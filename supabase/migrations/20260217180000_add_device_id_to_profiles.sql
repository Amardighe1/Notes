-- Add device_id column to profiles for single-device binding
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS device_id TEXT DEFAULT NULL;

-- Index for fast lookups during login verification
CREATE INDEX IF NOT EXISTS idx_profiles_device_id ON profiles(device_id);

-- Comment for clarity
COMMENT ON COLUMN profiles.device_id IS 'Unique device identifier bound on signup. Verified on every login to prevent account sharing.';
