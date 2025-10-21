import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Trophy, CheckCircle2, TrendingUp } from "lucide-react";

const leaderboardData = [
  { rank: 1, name: "Alex Rivera", streak: 45, accuracy: 98, xp: 12450 },
  { rank: 2, name: "Sarah Chen", streak: 42, accuracy: 96, xp: 11890 },
  { rank: 3, name: "Marcus Johnson", streak: 38, accuracy: 95, xp: 10230 },
  { rank: 4, name: "Priya Sharma", streak: 35, accuracy: 97, xp: 9870 },
];

const testimonials = [
  {
    name: "David Kim",
    goal: "Software Engineer Prep",
    text: "AimArc's strict verification kept me accountable. Landed my dream job after 90 days!",
    verified: true,
  },
  {
    name: "Emma Watson",
    goal: "Marathon Training",
    text: "The AI planning is incredible. It adjusted my running plan perfectly as I progressed.",
    verified: true,
  },
  {
    name: "Raj Patel",
    goal: "Learning Spanish",
    text: "30-day streak and counting! The community challenges make learning so much fun.",
    verified: true,
  },
];

export const Community = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Join a community of{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              achievers
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track verified progress, compete on leaderboards, and get inspired by others crushing their goals
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Leaderboard Preview */}
          <Card className="p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Trophy className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Global Leaderboard</h3>
                <p className="text-sm text-muted-foreground">Top performers this month</p>
              </div>
            </div>

            <div className="space-y-3">
              {leaderboardData.map((user) => (
                <div
                  key={user.rank}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                    ${user.rank === 1 ? "bg-yellow-500 text-white" : ""}
                    ${user.rank === 2 ? "bg-gray-400 text-white" : ""}
                    ${user.rank === 3 ? "bg-orange-600 text-white" : ""}
                    ${user.rank > 3 ? "bg-muted text-muted-foreground" : ""}
                  `}>
                    {user.rank}
                  </div>

                  <Avatar className="h-10 w-10 bg-gradient-accent" />

                  <div className="flex-1">
                    <p className="font-semibold">{user.name}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>🔥 {user.streak}d</span>
                      <span>✓ {user.accuracy}%</span>
                      <span>{user.xp} XP</span>
                    </div>
                  </div>

                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-center">
                <TrendingUp className="inline h-4 w-4 mr-1" />
                <strong>Unlock leaderboards</strong> with Premium to see your rank
              </p>
            </div>
          </Card>

          {/* Testimonials */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Success Stories</h3>
                <p className="text-sm text-muted-foreground">Real people, verified results</p>
              </div>
            </div>

            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all border-l-4 border-l-success"
              >
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12 bg-gradient-warm" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{testimonial.name}</p>
                      {testimonial.verified && (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{testimonial.goal}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
              </Card>
            ))}

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Join <strong>10,000+ users</strong> achieving their goals with AimArc
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
