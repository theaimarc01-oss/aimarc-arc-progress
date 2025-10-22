-- Ensure triggers to keep goal progress and user stats updated
-- Update goals when progress entries change
DROP TRIGGER IF EXISTS trg_update_goal_progress ON public.progress_entries;
CREATE TRIGGER trg_update_goal_progress
AFTER INSERT OR UPDATE ON public.progress_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_goal_progress();

-- Update user stats (xp, streaks) when a progress entry is added
DROP TRIGGER IF EXISTS trg_update_user_stats ON public.progress_entries;
CREATE TRIGGER trg_update_user_stats
AFTER INSERT ON public.progress_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_user_stats();

-- Maintain updated_at timestamps consistently
DROP TRIGGER IF EXISTS update_goals_updated_at ON public.goals;
CREATE TRIGGER update_goals_updated_at
BEFORE UPDATE ON public.goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();