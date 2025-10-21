import { Target, Brain, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Target,
    title: "Set Your Goal",
    description: "Choose fitness, learning, exam, or seasonal goal arcs. Tell us your timeline and preferences.",
    color: "primary",
  },
  {
    icon: Brain,
    title: "AI Builds Your Plan",
    description: "Our Hugging Face AI creates structured daily tasks tailored to your goals and intensity level.",
    color: "accent",
  },
  {
    icon: TrendingUp,
    title: "Track, Verify & Progress",
    description: "Complete tasks, verify with camera or quiz, and watch your progress soar on beautiful charts.",
    color: "success",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How AimArc Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your goals into achievements
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative group animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-border to-transparent z-0"></div>
                )}

                <div className="relative bg-card p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-border group-hover:border-primary/30 h-full">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-accent flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-${step.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-8 w-8 text-${step.color}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">Ready to get started?</p>
          <div className="flex items-center justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
            <span className="text-sm font-medium text-success">Average setup time: 2 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
};
