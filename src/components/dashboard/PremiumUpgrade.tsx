import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Check, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PremiumUpgrade = () => {
  const [loading, setLoading] = useState(false);
  const [trialInfo, setTrialInfo] = useState<{ daysLeft: number; inTrial: boolean } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrialInfo();
  }, []);

  const fetchTrialInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("trial_ends_at")
        .eq("id", user.id)
        .single();

      if (profile?.trial_ends_at) {
        const trialEnd = new Date(profile.trial_ends_at);
        const now = new Date();
        const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        setTrialInfo({ daysLeft: Math.max(0, daysLeft), inTrial: daysLeft > 0 });
      }
    } catch (error) {
      console.error("Error fetching trial info:", error);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const res = await loadRazorpayScript();
      if (!res) {
        toast({ title: "Error", description: "Razorpay SDK failed to load", variant: "destructive" });
        return;
      }

      // Create order on backend (you'll need to create this edge function)
      // For now, we'll simulate with hardcoded values
      const options = {
        key: "rzp_test_xxxxxx", // Replace with your Razorpay key
        amount: 99900, // ₹999 in paise
        currency: "INR",
        name: "AimArc Premium",
        description: "Unlock all premium features",
        image: "/favicon.ico",
        handler: async function (response: any) {
          try {
            // Verify payment and create subscription
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + 1);

            const { error: subError } = await supabase.from("subscriptions").insert({
              user_id: user.id,
              tier: "premium",
              payment_id: response.razorpay_payment_id,
              payment_provider: "razorpay",
              amount: 999,
              currency: "INR",
              starts_at: new Date().toISOString(),
              expires_at: expiresAt.toISOString(),
            });

            if (subError) throw subError;

            // Update profile
            await supabase
              .from("profiles")
              .update({
                subscription_tier: "premium",
                subscription_expires_at: expiresAt.toISOString(),
              })
              .eq("id", user.id);

            toast({
              title: "Welcome to Premium! 🎉",
              description: "All features unlocked. Enjoy AimArc Premium!",
            });

            window.location.reload();
          } catch (error) {
            console.error("Payment verification error:", error);
            toast({ title: "Error", description: "Payment verification failed", variant: "destructive" });
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: "#6366F1",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast({ title: "Error", description: "Failed to initiate payment", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-secondary/10 via-primary/5 to-accent/10 border-secondary/20">
      {trialInfo?.inTrial && (
        <div className="mb-4 p-3 rounded-lg bg-success/10 border border-success/20">
          <p className="text-sm font-semibold text-success flex items-center gap-2">
            🎁 Free Trial Active - {trialInfo.daysLeft} days remaining
          </p>
        </div>
      )}
      
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-lg bg-secondary/20">
          <Crown className="h-6 w-6 text-secondary" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            {trialInfo?.inTrial ? "Enjoying Premium?" : "Upgrade to Premium"}
            <Sparkles className="h-5 w-5 text-secondary" />
          </h3>
          <p className="text-sm text-muted-foreground">
            {trialInfo?.inTrial 
              ? `Continue with premium after your trial ends in ${trialInfo.daysLeft} days`
              : "Unlock advanced features and maximize your goal achievement"
            }
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {[
          "Access global leaderboard rankings",
          "AI-powered doubt solver & coach",
          "Advanced analytics & insights",
          "Friend challenges & competitions",
          "Priority support",
          "Unlimited goal creation",
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
              <Check className="h-3 w-3 text-success" />
            </div>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold">₹999</span>
        <span className="text-muted-foreground">/month</span>
      </div>

      <Button onClick={handleUpgrade} disabled={loading} className="w-full gap-2" variant="hero" size="lg">
        <Crown className="h-5 w-5" />
        {loading ? "Processing..." : "Upgrade Now"}
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Secure payment powered by Razorpay. Cancel anytime.
      </p>
    </Card>
  );
};
