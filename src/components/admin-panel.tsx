"use client";

import { useState } from "react";

type AdminListing = {
  id: string; slug: string; title: string; locality: string; property_type: string;
  rooms: number; price: number; built_area: number; available_from: string;
  description: string; status: string; created_at: string; approved_at: string | null;
  contact_name: string; contact_phone: string; contact_email: string;
};

type AdminAlert = {
  id: string; localities: string[]; min_rooms: number; max_price: number;
  name: string; phone: string; active: boolean; created_at: string;
};

type Tab = "listings" | "alerts";

const statusLabels: Record<string, string> = {
  pending: "ממתינה לאישור", active: "פעילה", rejected: "נדחתה",
  removed: "הוסרה", expired: "פגה",
};

export function AdminPanel() {
  const [key, setKey] = useState("");
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [tab, setTab] = useState<Tab>("listings");
  const [message, setMessage] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  async function loadData() {
    setMessage("טוענים נתונים…");
    const response = await fetch("/api/admin/listings", { headers: { "x-admin-key": key } });
    if (!response.ok) {
      setAuthenticated(false);
      return setMessage(response.status === 401 ? "מפתח הניהול שגוי." : "לא ניתן לטעון את נתוני המערכת.");
    }
    const result = await response.json();
    setListings(result.listings ?? []);
    setAlerts(result.alerts ?? []);
    setAuthenticated(true);
    setMessage("");
  }

  async function update(body: object) {
    const response = await fetch("/api/admin/listings", {
      method: "PATCH",
      headers: { "content-type": "application/json", "x-admin-key": key },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("update_failed");
  }

  async function moderate(id: string, status: "active" | "rejected" | "removed") {
    try {
      await update({ target: "listing", id, status });
      setListings((current) => current.map((item) => item.id === id ? { ...item, status } : item));
      setMessage("המודעה עודכנה.");
    } catch {
      setMessage("עדכון המודעה נכשל.");
    }
  }

  async function toggleAlert(id: string, active: boolean) {
    try {
      await update({ target: "search_request", id, active });
      setAlerts((current) => current.map((item) => item.id === id ? { ...item, active } : item));
      setMessage(active ? "ההתראה הופעלה." : "ההתראה הושבתה.");
    } catch {
      setMessage("עדכון ההתראה נכשל.");
    }
  }

  async function remove(target: "listing" | "search_request", id: string) {
    const label = target === "listing" ? "המודעה" : "בקשת ההתראה";
    if (!window.confirm(`למחוק לצמיתות את ${label}? לא ניתן לבטל פעולה זו.`)) return;
    const response = await fetch("/api/admin/listings", {
      method: "DELETE",
      headers: { "content-type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ target, id }),
    });
    if (!response.ok) return setMessage("המחיקה נכשלה.");
    if (target === "listing") setListings((current) => current.filter((item) => item.id !== id));
    else setAlerts((current) => current.filter((item) => item.id !== id));
    setMessage(`${label} נמחקה.`);
  }

  return (
    <div>
      <div className="admin-login">
        <label className="field">מפתח ניהול
          <input type="password" value={key} onChange={(event) => setKey(event.target.value)} onKeyDown={(event) => event.key === "Enter" && loadData()} />
        </label>
        <button className="button button-primary" onClick={loadData}>כניסה ורענון</button>
      </div>
      {message && <p className="admin-message" role="status">{message}</p>}

      {authenticated && <>
        <div className="admin-summary">
          <div><strong>{listings.length}</strong><span>מודעות</span></div>
          <div><strong>{listings.filter((item) => item.status === "pending").length}</strong><span>ממתינות לאישור</span></div>
          <div><strong>{alerts.length}</strong><span>בקשות התראה</span></div>
          <div><strong>{alerts.filter((item) => item.active).length}</strong><span>התראות פעילות</span></div>
        </div>
        <div className="admin-tabs" role="tablist">
          <button className={tab === "listings" ? "active" : ""} onClick={() => setTab("listings")}>מודעות ({listings.length})</button>
          <button className={tab === "alerts" ? "active" : ""} onClick={() => setTab("alerts")}>בקשות התראה ({alerts.length})</button>
        </div>

        {tab === "listings" && <div className="admin-list">
          {listings.length === 0 && <p>אין מודעות במערכת.</p>}
          {listings.map((listing) => <article className="admin-item admin-item-detailed" key={listing.id}>
            <div className="admin-item-main">
              <span className={`status status-${listing.status}`}>{statusLabels[listing.status] ?? listing.status}</span>
              <h2>{listing.title}</h2>
              <p>{listing.locality} · {listing.rooms} חדרים · {listing.built_area} מ״ר · ₪{listing.price.toLocaleString("he-IL")}</p>
              <p>{listing.description}</p>
              <dl className="admin-details">
                <div><dt>שם המפרסם</dt><dd>{listing.contact_name}</dd></div>
                <div><dt>טלפון</dt><dd><a href={`tel:${listing.contact_phone}`}>{listing.contact_phone}</a></dd></div>
                <div><dt>אימייל</dt><dd><a href={`mailto:${listing.contact_email}`}>{listing.contact_email}</a></dd></div>
                <div><dt>כניסה לנכס</dt><dd>{new Date(listing.available_from).toLocaleDateString("he-IL")}</dd></div>
                <div><dt>נשלחה</dt><dd>{new Date(listing.created_at).toLocaleString("he-IL")}</dd></div>
              </dl>
            </div>
            <div className="admin-actions">
              <button onClick={() => moderate(listing.id, "active")}>אישור</button>
              <button onClick={() => moderate(listing.id, "rejected")}>דחייה</button>
              <button onClick={() => moderate(listing.id, "removed")}>הסרה מהאתר</button>
              <button className="danger" onClick={() => remove("listing", listing.id)}>מחיקה לצמיתות</button>
            </div>
          </article>)}
        </div>}

        {tab === "alerts" && <div className="admin-list">
          {alerts.length === 0 && <p>אין בקשות התראה במערכת.</p>}
          {alerts.map((alert) => <article className="admin-item admin-item-detailed" key={alert.id}>
            <div className="admin-item-main">
              <span className={`status ${alert.active ? "status-active" : "status-removed"}`}>{alert.active ? "פעילה" : "מושבתת"}</span>
              <h2>{alert.name}</h2>
              <p><a href={`tel:${alert.phone}`}>{alert.phone}</a></p>
              <dl className="admin-details">
                <div><dt>יישובים</dt><dd>{alert.localities.join(", ")}</dd></div>
                <div><dt>מינימום חדרים</dt><dd>{alert.min_rooms}</dd></div>
                <div><dt>תקציב מרבי</dt><dd>₪{alert.max_price.toLocaleString("he-IL")}</dd></div>
                <div><dt>נוצרה</dt><dd>{new Date(alert.created_at).toLocaleString("he-IL")}</dd></div>
              </dl>
            </div>
            <div className="admin-actions">
              <button onClick={() => toggleAlert(alert.id, !alert.active)}>{alert.active ? "השבתה" : "הפעלה"}</button>
              <button className="danger" onClick={() => remove("search_request", alert.id)}>מחיקה לצמיתות</button>
            </div>
          </article>)}
        </div>}
      </>}
    </div>
  );
}
