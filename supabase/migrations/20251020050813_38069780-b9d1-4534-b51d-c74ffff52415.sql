-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE goal_type AS ENUM ('fitness', 'learning', 'exam', 'seasonal');
CREATE TYPE goal_status AS ENUM ('active', 'completed', 'paused', 'abandoned');
CREATE TYPE verification_mode AS ENUM ('normal', 'strict');
CREATE TYPE task_status AS ENUM ('pending', 'completed', 'skipped');
CREATE TYPE subscription_tier AS ENUM ('free', 'premium');

-- Profiles table (additional user data)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  accuracy_percentage DECIMAL(5,2) DEFAULT 100.00,
  subscription_tier subscription_tier DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals table
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  goal_type goal_type NOT NULL,
  status goal_status DEFAULT 'active',
  verification_mode verification_mode DEFAULT 'normal',
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL,
  duration_days INTEGER GENERATED ALWAYS AS (end_date - start_date) STORED,
  intensity_level INTEGER CHECK (intensity_level BETWEEN 1 AND 5),
  completion_percentage DECIMAL(5,2) DEFAULT 0,
  days_completed INTEGER DEFAULT 0,
  ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_date DATE NOT NULL,
  status task_status DEFAULT 'pending',
  verified BOOLEAN DEFAULT false,
  verification_data JSONB,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress tracking table
CREATE TABLE public.progress_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  xp_gained INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT,
  xp_reward INTEGER DEFAULT 0,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements junction table
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Friend challenges table
CREATE TABLE public.friend_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenged_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_type goal_type NOT NULL,
  duration_days INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'declined')),
  creator_progress INTEGER DEFAULT 0,
  challenged_progress INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT different_users CHECK (creator_id != challenged_user_id)
);

-- Subscriptions/payments table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL,
  payment_id TEXT,
  payment_provider TEXT DEFAULT 'razorpay',
  amount INTEGER,
  currency TEXT DEFAULT 'INR',
  starts_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed some achievements
INSERT INTO public.achievements (name, description, icon, xp_reward, requirement_type, requirement_value) VALUES
  ('First Step', 'Complete your first task', '🎯', 50, 'tasks_completed', 1),
  ('Week Warrior', 'Maintain a 7-day streak', '🔥', 100, 'streak', 7),
  ('Month Master', 'Maintain a 30-day streak', '💪', 500, 'streak', 30),
  ('Century Club', 'Complete 100 tasks', '💯', 1000, 'tasks_completed', 100),
  ('Perfect Week', 'Complete all tasks for 7 days straight', '⭐', 200, 'perfect_days', 7),
  ('Early Bird', 'Complete a task before 8 AM', '🌅', 50, 'early_completion', 1),
  ('Night Owl', 'Complete a task after 10 PM', '🦉', 50, 'late_completion', 1),
  ('Overachiever', 'Reach 5000 XP', '🏆', 500, 'total_xp', 5000);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for goals
CREATE POLICY "Users can view own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for tasks
CREATE POLICY "Users can view own tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for progress_entries
CREATE POLICY "Users can view own progress" ON public.progress_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.progress_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.progress_entries FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for achievements (read-only for users)
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view others achievements" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "System can insert achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for friend_challenges
CREATE POLICY "Users can view their challenges" ON public.friend_challenges FOR SELECT 
  USING (auth.uid() = creator_id OR auth.uid() = challenged_user_id);
CREATE POLICY "Users can create challenges" ON public.friend_challenges FOR INSERT 
  WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update their challenges" ON public.friend_challenges FOR UPDATE 
  USING (auth.uid() = creator_id OR auth.uid() = challenged_user_id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscription" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create leaderboard view (for premium users)
CREATE OR REPLACE VIEW public.leaderboard AS
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

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update goal completion percentage
CREATE OR REPLACE FUNCTION public.update_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.goals
  SET 
    days_completed = (
      SELECT COUNT(DISTINCT date)
      FROM public.progress_entries
      WHERE goal_id = NEW.goal_id AND verified = true
    ),
    completion_percentage = (
      SELECT LEAST(100, (COUNT(DISTINCT date)::DECIMAL / NULLIF(duration_days, 0) * 100))
      FROM public.progress_entries
      WHERE goal_id = NEW.goal_id AND verified = true
    ),
    updated_at = NOW()
  WHERE id = NEW.goal_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to update goal progress
CREATE TRIGGER on_progress_entry_created
  AFTER INSERT ON public.progress_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_goal_progress();

-- Function to update user XP and streaks
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS TRIGGER AS $$
DECLARE
  last_entry_date DATE;
  days_diff INTEGER;
BEGIN
  -- Update total XP
  UPDATE public.profiles
  SET total_xp = total_xp + NEW.xp_gained
  WHERE id = NEW.user_id;
  
  -- Update streak
  SELECT MAX(date) INTO last_entry_date
  FROM public.progress_entries
  WHERE user_id = NEW.user_id AND date < NEW.date;
  
  IF last_entry_date IS NOT NULL THEN
    days_diff := NEW.date - last_entry_date;
    
    IF days_diff = 1 THEN
      -- Continue streak
      UPDATE public.profiles
      SET 
        current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1),
        updated_at = NOW()
      WHERE id = NEW.user_id;
    ELSIF days_diff > 1 THEN
      -- Streak broken, reset to 1
      UPDATE public.profiles
      SET 
        current_streak = 1,
        updated_at = NOW()
      WHERE id = NEW.user_id;
    END IF;
  ELSE
    -- First entry, set streak to 1
    UPDATE public.profiles
    SET 
      current_streak = 1,
      longest_streak = GREATEST(longest_streak, 1),
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to update user stats
CREATE TRIGGER on_progress_xp_earned
  AFTER INSERT ON public.progress_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_user_stats();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();