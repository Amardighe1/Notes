
-- Fix function search paths for existing functions
CREATE OR REPLACE FUNCTION public.update_folder_notes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.folders 
        SET notes_count = notes_count + 1, updated_at = NOW()
        WHERE id = NEW.folder_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.folders 
        SET notes_count = notes_count - 1, updated_at = NOW()
        WHERE id = OLD.folder_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, department, semester)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        NEW.raw_user_meta_data->>'department',
        NEW.raw_user_meta_data->>'semester'
    );
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_download_count(note_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    UPDATE public.notes 
    SET download_count = download_count + 1, updated_at = NOW()
    WHERE id = note_uuid;
END;
$function$;
