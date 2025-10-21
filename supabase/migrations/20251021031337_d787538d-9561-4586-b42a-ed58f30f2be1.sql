-- Fix security issues

-- Drop and recreate leaderboard view without SECURITY DEFINER
DROP VIEW IF EXISTS public.leaderboard;

CREATE VIEW public.leaderboard 
WITH (security_invoker = true)
AS
SELECT 
  p.id,
  p.display_name,
  p.avatar_url,
  p.total_xp,
  p.current_streak,
  p.accuracy_percentage,
  ROW_NUMBER() OVER (ORDER BY p.total_xp DESC, p.current_streak DESC) as rank
FROM public.profiles p
WHERE p.subscription_tier = 'premium'
ORDER BY p.total_xp DESC, p.current_streak DESC
LIMIT 100;

-- Fix function search paths
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;

-- Grant proper permissions for the view
GRANT SELECT ON public.leaderboard TO authenticated;