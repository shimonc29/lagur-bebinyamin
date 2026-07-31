"use client";

import { useState } from "react";

type AdminListing = {
  id: string; title: string; locality: string; price: number; rooms: number;
  status: string; created_at: string; contact_name: string; contact_phone: string;
};

export function AdminPanel() {
  const [key, setKey] = useState("");
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [message, setMessage] = useState("");

  async function loadListings() {
    setMessage("טוענים…");
    const response = await fetch("/api/admin/listings", { headers: { "x-admin-key": key } });
    if (!response.ok) return setMessage(response.status === 401 ? "מפתח ניהול שגוי." : "לא ניתן לטעון את המודעות.");
    const result = await response.json();
    setListings(result.listings);
    setMessage("");
  }

  async function moderate(id: string, status: "active" | "rejected" | "removed") {
    const response = await fetch("/api/admin/listings", {
      method: "PATCH", headers: { "content-type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ id, status }),
    });
    if (!response.ok) return setMessage("העדכון נכשל.");
    setListings((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    setMessage("המודעה עודכנה.");
  }

  return (
    <div>
      <div className="admin-login"><label className="field">מפתח ניהול<input type="password" value={key} onChange={(event) => setKey(event.target.value)} /></label><button className="button button-primary" onClick={loadListings}>כניסה למודעות</button></div>
      {message && <p className="admin-message" role="status">{message}</p>}
      <div className="admin-list">{listings.map((listing) => <article className="admin-item" key={listing.id}><div><span className={`status status-${listing.status}`}>{listing.status}</span><h2>{listing.title}</h2><p>{listing.locality} · {listing.rooms} חדרים · ₪{listing.price.toLocaleString("he-IL")}</p><small>{listing.contact_name} · {listing.contact_phone}</small></div><div className="admin-actions"><button onClick={() => moderate(listing.id, "active")}>אישור</button><button onClick={() => moderate(listing.id, "rejected")}>דחייה</button><button onClick={() => moderate(listing.id, "removed")}>הסרה</button></div></article>)}</div>
    </div>
  );
}
