import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Crown, Medal, TrendingUp, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

interface LeaderboardEntry {
  id: string;
  display_name: string;
  avatar_url: string;
  total_xp: number;
  current_streak: number;
  accuracy_percentage: number;
  rank: number;
}

export const Leaderboard = () => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: premiumStatus } = usePremiumStatus();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("rank", { ascending: true })
        .limit(50);

      if (error) throw error;
      setLeaders(data || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-secondary" />;
      case 2:
      case 3:
        return <Medal className="h-5 w-5 text-accent" />;
      default:
        return null;
    }
  };

  const isPremium = premiumStatus?.isPremium;
  const inFreeTrial = premiumStatus?.inFreeTrial;

  if (loading) {
    return <Card className="p-6">Loading leaderboard...</Card>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Global Leaderboard
        </h3>
        {inFreeTrial && (
          <Badge variant="secondary" className="gap-1">
            🎁 Free Trial Active
          </Badge>
        )}
        {!isPremium && !inFreeTrial && (
          <Badge variant="secondary" className="gap-1">
            <Crown className="h-3 w-3" />
            Premium Only
          </Badge>
        )}
      </div>

      {!isPremium ? (
        <div className="text-center py-12 space-y-4">
          <div className="p-4 rounded-full bg-secondary/10 w-fit mx-auto">
            <Crown className="h-12 w-12 text-secondary" />
          </div>
          <div>
            <h4 className="font-bold text-lg mb-2">Unlock Leaderboard</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Upgrade to premium to compete with others and see your global ranking
            </p>
          </div>
        </div>
      ) : leaders.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No leaderboard data yet</p>
      ) : (
        <div className="space-y-2">
          {leaders.map((leader, index) => (
            <div
              key={leader.id}
              className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                index < 3 ? "bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10" : "border border-border hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-3 min-w-[60px]">
                {getRankIcon(leader.rank)}
                <span className="font-bold text-lg">#{leader.rank}</span>
              </div>

              <Avatar className="h-10 w-10">
                <AvatarImage src={leader.avatar_url} alt={leader.display_name} />
                <AvatarFallback>{leader.display_name?.[0] || "?"}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{leader.display_name || "Anonymous"}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {leader.total_xp?.toLocaleString()} XP
                  </span>
                  <span>🔥 {leader.current_streak} days</span>
                  <span>✓ {leader.accuracy_percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
