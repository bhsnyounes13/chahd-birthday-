CREATE TABLE public.guestbook_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 40),
  message TEXT NOT NULL CHECK (char_length(btrim(message)) BETWEEN 1 AND 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_published BOOLEAN NOT NULL DEFAULT true
);
GRANT SELECT, INSERT ON public.guestbook_messages TO anon, authenticated;
GRANT ALL ON public.guestbook_messages TO service_role;
ALTER TABLE public.guestbook_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read published" ON public.guestbook_messages FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Submit valid" ON public.guestbook_messages FOR INSERT TO anon, authenticated WITH CHECK (is_published = true AND char_length(btrim(name)) BETWEEN 1 AND 40 AND char_length(btrim(message)) BETWEEN 1 AND 500 AND name !~ '[<>]' AND message !~ '[<>]');
CREATE INDEX guestbook_created_idx ON public.guestbook_messages (created_at DESC);

CREATE OR REPLACE FUNCTION public.guestbook_guard() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.created_at := now();
  NEW.is_published := true;
  IF (SELECT count(*) FROM public.guestbook_messages WHERE created_at > now() - interval '1 minute') >= 15 THEN
    RAISE EXCEPTION 'rate_limited';
  END IF;
  IF EXISTS (SELECT 1 FROM public.guestbook_messages WHERE lower(name) = lower(NEW.name) AND message = NEW.message AND created_at > now() - interval '1 day') THEN
    RAISE EXCEPTION 'duplicate';
  END IF;
  IF EXISTS (SELECT 1 FROM public.guestbook_messages WHERE lower(name) = lower(NEW.name) AND created_at > now() - interval '30 seconds') THEN
    RAISE EXCEPTION 'rate_limited';
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.guestbook_guard() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER guestbook_guard BEFORE INSERT ON public.guestbook_messages FOR EACH ROW EXECUTE FUNCTION public.guestbook_guard();