-- Add free trial tracking to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days');

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_trial_ends ON public.profiles(trial_ends_at);
CREATE INDEX IF NOT EXISTS idx_tasks_user_date ON public.tasks(user_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_progress_entries_user_goal ON public.progress_entries(user_id, goal_id);

-- Update existing users to have trial period
UPDATE public.profiles 
SET trial_ends_at = (created_at + INTERVAL '30 days')
WHERE trial_ends_at IS NULL;

-- Function to check if user has premium access (including trial)
CREATE OR REPLACE FUNCTION public.user_has_premium_access(user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_record RECORD;
BEGIN
  SELECT 
    subscription_tier,
    subscription_expires_at,
    trial_ends_at
  INTO profile_record
  FROM public.profiles
  WHERE id = user_id_param;
  
  -- Check if user has active premium subscription
  IF profile_record.subscription_tier = 'premium' AND 
     profile_record.subscription_expires_at > NOW() THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user is still in free trial period
  IF profile_record.trial_ends_at > NOW() THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;