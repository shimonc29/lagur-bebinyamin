-- נתוני פיתוח בלבד. אין להציג אותם כמודעות אמיתיות בסביבת הייצור.
insert into public.listings (
  slug, status, title, locality, property_type, rooms, price, built_area,
  available_from, description, contact_name, contact_phone, contact_email,
  management_token_hash, consent_at, approved_at
) values (
  'demo-dira-4-shilo', 'active', 'דירת 4 חדרים בשילה', 'שילה', 'apartment',
  4, 4800, 112, current_date + 14,
  'מודעת פיתוח לדוגמה בלבד, לצורך בדיקת תצוגת לוח השכירויות המקומי.',
  'משתמש בדיקה', '0500000000', 'demo@example.com',
  encode(digest('demo-token-not-for-production', 'sha256'), 'hex'),
  now(), now()
);
