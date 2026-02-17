-- Auto-cleanup resolved purchases after 7 days
-- Deletes purchases where status is 'approved' or 'rejected' and reviewed_at > 7 days ago
-- Also removes associated payment screenshots from storage

CREATE OR REPLACE FUNCTION public.cleanup_resolved_purchases()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count integer;
  storage_deleted integer := 0;
  cutoff timestamptz := now() - interval '7 days';
BEGIN
  -- Step 1: Delete payment screenshots from storage for purchases about to be removed
  DELETE FROM storage.objects
  WHERE bucket_id = 'payment-screenshots'
    AND name IN (
      SELECT payment_screenshot_path
      FROM public.purchases
      WHERE status IN ('approved', 'rejected')
        AND reviewed_at IS NOT NULL
        AND reviewed_at < cutoff
        AND payment_screenshot_path IS NOT NULL
    );
  GET DIAGNOSTICS storage_deleted = ROW_COUNT;

  -- Step 2: Delete the resolved purchase records
  DELETE FROM public.purchases
  WHERE status IN ('approved', 'rejected')
    AND reviewed_at IS NOT NULL
    AND reviewed_at < cutoff;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  RETURN jsonb_build_object(
    'purchases_deleted', deleted_count,
    'screenshots_deleted', storage_deleted,
    'cutoff_date', cutoff
  );
END;
$$;

-- Grant execute to authenticated users (admin will call this)
GRANT EXECUTE ON FUNCTION public.cleanup_resolved_purchases() TO authenticated;

-- Also try to enable pg_cron for automatic daily cleanup
-- This may fail on some Supabase plans but the function will still work when called manually
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS pg_cron;
  -- Schedule daily cleanup at 3:00 AM UTC
  PERFORM cron.schedule(
    'cleanup-resolved-purchases',
    '0 3 * * *',
    'SELECT public.cleanup_resolved_purchases()'
  );
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pg_cron not available — cleanup will run on admin dashboard load';
END;
$$;
