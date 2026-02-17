-- ==========================================================================
-- Create storage bucket for notes files and set public access policies
-- ==========================================================================

-- Create the bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'notes-files',
    'notes-files',
    true,
    10485760,  -- 10MB
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if any
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE tablename = 'objects' AND schemaname = 'storage'
          AND policyname LIKE '%notes-files%'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    END LOOP;
END $$;

-- Allow anyone to read/download files (public bucket)
CREATE POLICY "Anyone can view notes-files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'notes-files');

-- Allow anyone to upload files (since no auth is implemented)
CREATE POLICY "Anyone can upload notes-files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'notes-files');

-- Allow anyone to update files
CREATE POLICY "Anyone can update notes-files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'notes-files');

-- Allow anyone to delete files
CREATE POLICY "Anyone can delete notes-files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'notes-files');

-- ==========================================================================
-- Update the admin_create_note function to accept file fields
-- ==========================================================================
CREATE OR REPLACE FUNCTION public.admin_create_note(
    p_title text,
    p_description text,
    p_folder_id uuid,
    p_file_url text DEFAULT NULL,
    p_file_name text DEFAULT NULL,
    p_file_size bigint DEFAULT NULL,
    p_file_type text DEFAULT NULL,
    p_storage_path text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_id uuid;
BEGIN
    INSERT INTO public.notes (title, description, folder_id, file_url, file_name, file_size, file_type, storage_path)
    VALUES (p_title, p_description, p_folder_id, p_file_url, p_file_name, p_file_size, p_file_type, p_storage_path)
    RETURNING id INTO new_id;
    RETURN new_id;
END;
$$;

-- Update the admin_update_note function to accept file fields
CREATE OR REPLACE FUNCTION public.admin_update_note(
    p_id uuid,
    p_title text,
    p_description text,
    p_file_url text DEFAULT NULL,
    p_file_name text DEFAULT NULL,
    p_file_size bigint DEFAULT NULL,
    p_file_type text DEFAULT NULL,
    p_storage_path text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.notes
    SET title = p_title, description = p_description,
        file_url = COALESCE(p_file_url, file_url),
        file_name = COALESCE(p_file_name, file_name),
        file_size = COALESCE(p_file_size, file_size),
        file_type = COALESCE(p_file_type, file_type),
        storage_path = COALESCE(p_storage_path, storage_path),
        updated_at = now()
    WHERE id = p_id;
END;
$$;
