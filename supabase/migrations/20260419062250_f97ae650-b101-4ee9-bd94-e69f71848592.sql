DROP POLICY IF EXISTS "Anyone can submit a contact message" ON public.contact_messages;

CREATE POLICY "Anyone can submit a valid contact message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (
    length(trim(name)) BETWEEN 1 AND 200
    AND length(trim(message)) BETWEEN 1 AND 5000
    AND (email IS NULL OR length(email) <= 320)
    AND (phone IS NULL OR length(phone) <= 30)
    AND (topic IS NULL OR length(topic) <= 200)
  );