import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Crown, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free Forever",
    price: "₹0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Basic AI planning",
      "Normal verification mode",
      "Self-report tracking",
      "Basic progress charts",
      "Daily reminders",
      "Community access",
    ],
    cta: "Start Free",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Premium",
    price: "₹59",
    period: "per month",
    description: "Unlock your full potential",
    features: [
      "Everything in Free",
      "Strict camera verification",
      "Advanced AI planning",
      "Rep counting with MediaPipe",
      "Global leaderboards",
      "Friend challenges",
      "Detailed analytics",
      "Priority support",
    ],
    cta: "Start Free Trial",
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "Free Trial",
    price: "1 Month",
    period: "all features",
    description: "Try everything risk-free",
    features: [
      "Full Premium access",
      "Cancel anytime",
      "No credit card required",
      "Switch plans anytime",
      "Keep your data",
    ],
    cta: "Claim Free Trial",
    variant: "secondary" as const,
    popular: false,
  },
];

export const Pricing = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Simple, transparent pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose your plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade when you're ready. All plans include our core goal tracking features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative p-8 hover:shadow-xl transition-all duration-300 animate-fade-in ${
                plan.popular 
                  ? "border-2 border-primary shadow-lg scale-105" 
                  : "border-border"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-accent px-4 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Crown className="h-4 w-4 text-white" />
                    <span className="text-sm font-bold text-white">Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="flex items-end justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.period !== "all features" && (
                    <span className="text-muted-foreground mb-2">/{plan.period.split(' ')[1] || plan.period}</span>
                  )}
                </div>
                {plan.period === "all features" && (
                  <p className="text-sm text-muted-foreground">{plan.period}</p>
                )}
              </div>

              <Button 
                variant={plan.variant} 
                size="lg" 
                className="w-full mb-6"
              >
                {plan.cta}
              </Button>

              <div className="space-y-3">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Check className="h-5 w-5 text-success" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">Secure payments powered by</p>
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="font-medium">Razorpay</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
              <span className="font-medium">UPI</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
              <span className="font-medium">Cards</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CreditCard = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2"/>
    <line x1="2" y1="10" x2="22" y2="10" strokeWidth="2"/>
  </svg>
);
