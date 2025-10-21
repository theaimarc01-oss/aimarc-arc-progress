import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreateGoalDialogProps {
  onGoalCreated?: () => void;
}

export const CreateGoalDialog = ({ onGoalCreated }: CreateGoalDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalType, setGoalType] = useState<"fitness" | "learning" | "exam" | "seasonal">("fitness");
  const [verificationMode, setVerificationMode] = useState<"normal" | "strict">("normal");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [durationDays, setDurationDays] = useState(30);
  const [intensityLevel, setIntensityLevel] = useState(3);
  const { toast } = useToast();

  const handleCreateGoal = async () => {
    if (!title.trim()) {
      toast({ title: "Error", description: "Goal title is required", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + durationDays);

      const { error } = await supabase.from("goals").insert({
        user_id: user.id,
        title,
        description,
        goal_type: goalType,
        verification_mode: verificationMode,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        duration_days: durationDays,
        intensity_level: intensityLevel,
        status: "active",
      });

      if (error) throw error;

      toast({ title: "Success!", description: "Goal created successfully" });
      setOpen(false);
      resetForm();
      onGoalCreated?.();
    } catch (error) {
      console.error("Error creating goal:", error);
      toast({ title: "Error", description: "Failed to create goal", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!title.trim()) {
      toast({ title: "Error", description: "Please enter a goal title first", variant: "destructive" });
      return;
    }

    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-goal-plan", {
        body: {
          goalType,
          duration: durationDays,
          intensity: intensityLevel,
          customPrompt: `Generate a ${durationDays}-day plan for: ${title}. ${description}`,
        },
      });

      if (error) throw error;

      toast({ 
        title: "AI Plan Generated!", 
        description: `Created ${data.tasks.length} tasks for your goal`,
      });
      
      // Create goal and tasks
      await handleCreateGoal();
    } catch (error) {
      console.error("Error generating AI plan:", error);
      toast({ title: "Error", description: "Failed to generate AI plan", variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setGoalType("fitness");
    setVerificationMode("normal");
    setStartDate(new Date());
    setDurationDays(30);
    setIntensityLevel(3);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
          <DialogDescription>Set up your goal and let AI generate a personalized plan</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Winter Fitness Transformation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your goal..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Goal Type</Label>
              <Select value={goalType} onValueChange={(v: any) => setGoalType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fitness">🏋️ Fitness</SelectItem>
                  <SelectItem value="learning">📚 Learning</SelectItem>
                  <SelectItem value="exam">📝 Exam Prep</SelectItem>
                  <SelectItem value="seasonal">🎯 Seasonal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Verification Mode</Label>
              <Select value={verificationMode} onValueChange={(v: any) => setVerificationMode(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">✅ Normal</SelectItem>
                  <SelectItem value="strict">📸 Strict (Camera)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(startDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={(date) => date && setStartDate(date)} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Duration: {durationDays} days</Label>
            <Slider
              value={[durationDays]}
              onValueChange={([v]) => setDurationDays(v)}
              min={7}
              max={365}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Intensity Level: {intensityLevel}/5</Label>
            <Slider
              value={[intensityLevel]}
              onValueChange={([v]) => setIntensityLevel(v)}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleAIGenerate} disabled={aiLoading || loading} className="flex-1 gap-2" variant="hero">
            <Sparkles className="h-4 w-4" />
            {aiLoading ? "Generating..." : "Generate AI Plan"}
          </Button>
          <Button onClick={handleCreateGoal} disabled={loading || aiLoading} variant="outline" className="flex-1">
            {loading ? "Creating..." : "Create Manual Goal"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
