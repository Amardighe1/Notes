-- Email OTP verification table
CREATE TABLE IF NOT EXISTS public.email_otps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  otp text NOT NULL,
  expires_at timestamptz NOT NULL,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Index for fast lookups by email
CREATE INDEX IF NOT EXISTS idx_email_otps_email ON public.email_otps(email);

-- Auto-cleanup expired OTPs (keep table small)
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.email_otps WHERE expires_at < now();
END;
$$;

-- RPC function to verify OTP (called from frontend)
CREATE OR REPLACE FUNCTION public.verify_email_otp(p_email text, p_otp text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_valid boolean;
BEGIN
  -- Check if a valid (non-expired, non-verified) OTP exists
  SELECT EXISTS(
    SELECT 1 FROM public.email_otps
    WHERE email = lower(trim(p_email))
      AND otp = p_otp
      AND expires_at > now()
      AND verified = false
  ) INTO v_valid;

  IF v_valid THEN
    -- Mark as verified and clean up
    UPDATE public.email_otps
    SET verified = true
    WHERE email = lower(trim(p_email)) AND otp = p_otp;
  END IF;

  RETURN v_valid;
END;
$$;

-- Allow anon users to call verify function (needed before signup)
GRANT EXECUTE ON FUNCTION public.verify_email_otp(text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.verify_email_otp(text, text) TO authenticated;

-- RLS: No direct access to the table from clients
ALTER TABLE public.email_otps ENABLE ROW LEVEL SECURITY;

-- Only service role (Edge Functions) can insert/read/update
-- No policies = no client access (service role bypasses RLS)
