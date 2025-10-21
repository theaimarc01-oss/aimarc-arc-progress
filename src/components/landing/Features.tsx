import { 
  Target, Calendar, Bell, Camera, BarChart3, Users, 
  Trophy, CreditCard, Shield, Zap, MessageSquare, Award 
} from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    category: "Goal Setting & AI Planning",
    items: [
      { icon: Target, title: "Smart Goal Types", desc: "Fitness, Learning, Exam, or Seasonal Arcs" },
      { icon: Zap, title: "AI-Generated Plans", desc: "Hugging Face AI creates personalized daily tasks" },
      { icon: Calendar, title: "Flexible Timeline", desc: "Set your own pace and intensity preferences" },
      { icon: MessageSquare, title: "AI Doubt Solver", desc: "Get instant answers to your questions" },
    ]
  },
  {
    category: "Task Management & Tracking",
    items: [
      { icon: Bell, title: "Smart Reminders", desc: "Web push notifications and real-time alerts" },
      { icon: Camera, title: "Verification System", desc: "Normal self-report or strict camera verification" },
      { icon: BarChart3, title: "Progress Analytics", desc: "Visual dashboards with charts and insights" },
      { icon: Trophy, title: "Gamification", desc: "Streaks, XP, badges, and achievement tracking" },
    ]
  },
  {
    category: "Community & Social",
    items: [
      { icon: Users, title: "Global Leaderboards", desc: "Compete with users worldwide (Premium)" },
      { icon: Award, title: "Friend Challenges", desc: "Invite friends and track together" },
      { icon: Shield, title: "Public Profiles", desc: "Showcase your verified progress and badges" },
      { icon: Users, title: "Community Feed", desc: "See others' achievements and milestones" },
    ]
  },
  {
    category: "Premium Features",
    items: [
      { icon: Camera, title: "Strict Mode", desc: "AI camera verification with rep counting" },
      { icon: BarChart3, title: "Advanced Analytics", desc: "Deep insights and accuracy metrics" },
      { icon: Trophy, title: "Ranks & Leaderboards", desc: "Access all competitive features" },
      { icon: CreditCard, title: "Secure Payments", desc: "Razorpay integration • ₹59/month" },
    ]
  }
];

export const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything you need to{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              achieve your goals
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From AI-powered planning to strict verification, we've built the complete platform for goal achievement
          </p>
        </div>

        <div className="space-y-16 max-w-7xl mx-auto">
          {features.map((section, sectionIndex) => (
            <div key={sectionIndex} className="animate-fade-in" style={{ animationDelay: `${sectionIndex * 0.1}s` }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-1 w-12 bg-gradient-accent rounded-full"></div>
                <h3 className="text-2xl font-bold">{section.category}</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {section.items.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card 
                      key={index}
                      className="p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer border-border hover:border-primary/30"
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-bold mb-2 text-lg">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.desc}
                      </p>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="mt-20 p-8 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-primary/10">
          <h4 className="text-center text-xl font-bold mb-6">Powered by industry-leading technology</h4>
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="font-medium">Supabase</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span className="font-medium">Hugging Face AI</span>
            </div>
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              <span className="font-medium">MediaPipe</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <span className="font-medium">Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
