"use client";

import { useState } from "react";
import { LOCALITIES, PROPERTY_TYPES } from "@/lib/listings";

const propertyLabels: Record<(typeof PROPERTY_TYPES)[number], string> = {
  apartment: "דירה", garden_apartment: "דירת גן", house: "בית פרטי", unit: "יחידת דיור",
};

export function PublishForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    const images = formData.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
    if (images.length > 4) {
      setError("אפשר להעלות עד 4 תמונות.");
      return setStatus("error");
    }
    if (images.some((image) => image.size > 5 * 1024 * 1024)) {
      setError("כל תמונה יכולה להיות בגודל של עד 5MB.");
      return setStatus("error");
    }
    setError("");
    setStatus("sending");
    const response = await fetch("/api/listings", { method: "POST", body: formData });
    setStatus(response.ok ? "success" : "error");
    if (!response.ok) setError("לא הצלחנו לשמור את המודעה. בדקו את הפרטים ונסו שוב.");
  }

  if (status === "success") {
    return <div className="form-success"><strong>המודעה התקבלה.</strong><p>נבדוק אותה והיא תופיע בלוח לאחר האישור.</p></div>;
  }

  return (
    <form className="form-card" action={submit}>
      <div className="form-grid">
        <label className="field field-wide">כותרת המודעה<input name="title" required minLength={8} placeholder="לדוגמה: דירת 4 חדרים מוארת בשילה" /></label>
        <label className="field">יישוב<select name="locality" required defaultValue=""><option value="" disabled>בחרו יישוב</option>{LOCALITIES.map((locality) => <option key={locality}>{locality}</option>)}</select></label>
        <label className="field">סוג הנכס<select name="propertyType" required defaultValue="apartment">{PROPERTY_TYPES.map((type) => <option key={type} value={type}>{propertyLabels[type]}</option>)}</select></label>
        <label className="field">מספר חדרים<input name="rooms" type="number" required min="1" max="15" step="0.5" /></label>
        <label className="field">שכר דירה חודשי<input name="price" type="number" required min="500" max="50000" inputMode="numeric" /></label>
        <label className="field">שטח בנוי במ״ר<input name="builtArea" type="number" required min="10" max="2000" /></label>
        <label className="field">תאריך כניסה<input name="availableFrom" type="date" required /></label>
        <label className="field field-wide">תיאור הנכס<textarea name="description" required minLength={20} rows={5} placeholder="ספרו על הבית, החצר, החניה ומה חשוב לדעת" /></label>
        <label className="field field-wide">תמונות הנכס — עד 4 תמונות
          <input name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple />
          <small>JPG, PNG או WebP. עד 5MB לכל תמונה.</small>
        </label>
        <label className="field">שם המפרסם<input name="contactName" required minLength={2} autoComplete="name" /></label>
        <label className="field">טלפון<input name="contactPhone" type="tel" required autoComplete="tel" placeholder="050-0000000" /></label>
        <label className="field field-wide">דוא״ל<input name="contactEmail" type="email" required autoComplete="email" /></label>
      </div>
      <label className="checkbox"><input name="consent" type="checkbox" value="true" required /> אני מאשר/ת את פרסום פרטי הקשר ואת תנאי השימוש.</label>
      {status === "error" && <p className="form-error">{error}</p>}
      <button className="button button-primary submit-button" disabled={status === "sending"}>{status === "sending" ? "שולחים…" : "שליחת המודעה לבדיקה"}</button>
    </form>
  );
}
