-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, location, dietary_preferences, budget_preference, family_size)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'location', ''),
    COALESCE(
      CASE 
        WHEN NEW.raw_user_meta_data ->> 'dietary_preferences' IS NOT NULL 
        THEN ARRAY[NEW.raw_user_meta_data ->> 'dietary_preferences']
        ELSE ARRAY[]::TEXT[]
      END, 
      ARRAY[]::TEXT[]
    ),
    COALESCE(NEW.raw_user_meta_data ->> 'budget_preference', 'moderate'),
    COALESCE((NEW.raw_user_meta_data ->> 'family_size')::INTEGER, 1)
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Create trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
