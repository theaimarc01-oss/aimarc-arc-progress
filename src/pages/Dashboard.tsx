import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, ListTodo, TrendingUp, Users, Crown, Settings, LogOut, Bell } from "lucide-react";
import { CreateGoalDialog } from "@/components/dashboard/CreateGoalDialog";
import { TaskList } from "@/components/dashboard/TaskList";
import { ProgressCharts } from "@/components/dashboard/ProgressCharts";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { PremiumUpgrade } from "@/components/dashboard/PremiumUpgrade";
import { useAuth } from "@/hooks/useAuth";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { supabase } from "@/integrations/supabase/client";
import { requestNotificationPermission, scheduleDailyReminder } from "@/utils/notifications";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { data: premiumStatus } = usePremiumStatus();
  const [stats, setStats] = useState({
    activeGoals: 0,
    tasksToday: 0,
    completionRate: 0,
    rank: 0,
    streak: 0,
  });

  useEffect(() => {
    fetchStats();
    requestNotificationPermission().then((granted) => {
      if (granted) scheduleDailyReminder();
    });
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Fetch active goals
      const { data: goals } = await supabase
        .from("goals")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active");

      // Fetch today's tasks
      const today = new Date().toISOString().split('T')[0];
      const { data: tasks } = await supabase
        .from("tasks")
        .select("id, status")
        .eq("user_id", user.id)
        .eq("scheduled_date", today);

      // Fetch profile for streak and rank
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_streak, accuracy_percentage")
        .eq("id", user.id)
        .single();

      // Calculate completion rate
      const completedTasks = tasks?.filter(t => t.status === "completed").length || 0;
      const totalTasks = tasks?.length || 0;

      setStats({
        activeGoals: goals?.length || 0,
        tasksToday: totalTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        rank: 0, // Will be calculated from leaderboard
        streak: profile?.current_streak || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              AimArc
            </h1>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Dashboard</a>
              <a href="#goals" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">My Goals</a>
              <a href="#tasks" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Tasks</a>
              <a href="#progress" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Progress</a>
              <a href="#leaderboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Leaderboard</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1.5 rounded-full">
              <span className="text-lg">🔥</span>
              <span className="text-sm font-semibold">{stats.streak} day streak</span>
            </div>
            {premiumStatus?.isPremium && <Crown className="h-5 w-5 text-secondary" />}
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.email?.split('@')[0]}! 👋</h2>
            <p className="text-muted-foreground">Let's make today count. You're on track to achieve your goals.</p>
          </div>
          <CreateGoalDialog onGoalCreated={fetchStats} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Active Goals</span>
            </div>
            <p className="text-3xl font-bold">{stats.activeGoals}</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-secondary/10">
                <ListTodo className="h-5 w-5 text-secondary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Tasks Today</span>
            </div>
            <p className="text-3xl font-bold">{stats.tasksToday}</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Completion Rate</span>
            </div>
            <p className="text-3xl font-bold">{stats.completionRate}%</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/10">
                <Users className="h-5 w-5 text-success" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Global Rank</span>
            </div>
            <p className="text-3xl font-bold">
              {premiumStatus?.isPremium ? `#${stats.rank || "—"}` : "Premium"}
            </p>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6" id="tasks">
          <div className="lg:col-span-2">
            <TaskList />
          </div>
          <div>
            {!premiumStatus?.isPremium && <PremiumUpgrade />}
          </div>
        </div>

        {/* Progress Charts */}
        <div className="mb-6" id="progress">
          <ProgressCharts />
        </div>

        {/* Leaderboard */}
        <div id="leaderboard">
          <Leaderboard />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
