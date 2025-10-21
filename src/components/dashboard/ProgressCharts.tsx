import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Calendar, Zap } from "lucide-react";

export const ProgressCharts = () => {
  const [xpData, setXpData] = useState<any[]>([]);
  const [streakData, setStreakData] = useState<any[]>([]);
  const [completionData, setCompletionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch last 30 days of progress
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: progressData, error } = await supabase
        .from("progress_entries")
        .select("date, xp_gained, verified")
        .eq("user_id", user.id)
        .gte("date", thirtyDaysAgo.toISOString().split('T')[0])
        .order("date", { ascending: true });

      if (error) throw error;

      // Aggregate data by date
      const dataByDate = progressData?.reduce((acc: any, entry: any) => {
        const date = entry.date;
        if (!acc[date]) {
          acc[date] = { date, xp: 0, tasks: 0, verified: 0 };
        }
        acc[date].xp += entry.xp_gained;
        acc[date].tasks += 1;
        if (entry.verified) acc[date].verified += 1;
        return acc;
      }, {});

      const chartData = Object.values(dataByDate || {}).map((d: any) => ({
        date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        xp: d.xp,
        tasks: d.tasks,
        accuracy: d.tasks > 0 ? Math.round((d.verified / d.tasks) * 100) : 0,
      }));

      setXpData(chartData);
      setStreakData(chartData);
      setCompletionData(chartData);
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    xp: {
      label: "XP Gained",
      color: "hsl(var(--primary))",
    },
    tasks: {
      label: "Tasks Completed",
      color: "hsl(var(--secondary))",
    },
    accuracy: {
      label: "Accuracy",
      color: "hsl(var(--success))",
    },
  };

  if (loading) {
    return <Card className="p-6">Loading charts...</Card>;
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-6">Progress Analytics</h3>
      
      <Tabs defaultValue="xp" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="xp" className="gap-2">
            <Zap className="h-4 w-4" />
            XP Trend
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <Calendar className="h-4 w-4" />
            Task Completion
          </TabsTrigger>
          <TabsTrigger value="accuracy" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Accuracy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="xp" className="space-y-4">
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={xpData}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="xp" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorXp)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
          <p className="text-sm text-muted-foreground text-center">
            Total XP earned over the last 30 days
          </p>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="tasks" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <p className="text-sm text-muted-foreground text-center">
            Number of tasks completed daily
          </p>
        </TabsContent>

        <TabsContent value="accuracy" className="space-y-4">
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--success))" strokeWidth={3} dot={{ fill: "hsl(var(--success))", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <p className="text-sm text-muted-foreground text-center">
            Verification accuracy percentage over time
          </p>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
