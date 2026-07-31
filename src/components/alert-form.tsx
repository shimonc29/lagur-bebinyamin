"use client";

import { useState } from "react";
import { LOCALITIES } from "@/lib/listings";

export function AlertForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  async function submit(formData: FormData) {
    setStatus("sending");
    const response = await fetch("/api/alerts", { method: "POST", body: formData });
    setStatus(response.ok ? "success" : "error");
  }
  if (status === "success") return <div className="form-success"><strong>הבקשה נשמרה.</strong><p>נעדכן אתכם כשיעלה נכס מתאים.</p></div>;
  return (
    <form className="form-card" action={submit}>
      <fieldset><legend>באילו יישובים לחפש?</legend><div className="choice-grid">{LOCALITIES.map((locality) => <label className="choice" key={locality}><input type="checkbox" name="localities" value={locality} />{locality}</label>)}</div></fieldset>
      <div className="form-grid">
        <label className="field">מינימום חדרים<input name="minRooms" type="number" min="1" max="15" step=".5" required /></label>
        <label className="field">תקציב חודשי מרבי<input name="maxPrice" type="number" min="500" max="50000" required /></label>
        <label className="field">שם מלא<input name="name" required minLength={2} /></label>
        <label className="field">טלפון<input name="phone" type="tel" required /></label>
      </div>
      <label className="checkbox"><input name="consent" type="checkbox" value="true" required /> אני מאשר/ת לקבל עדכונים על נכסים מתאימים.</label>
      {status === "error" && <p className="form-error">לא הצלחנו לשמור את הבקשה. סמנו לפחות יישוב אחד ובדקו את הפרטים.</p>}
      <button className="button button-primary submit-button" disabled={status === "sending"}>{status === "sending" ? "שומרים…" : "יצירת התראת חיפוש"}</button>
    </form>
  );
}
