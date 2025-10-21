import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Camera, CheckCircle2 } from "lucide-react";
import { CameraVerificationDialog } from "./CameraVerificationDialog";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  verified: boolean;
  scheduled_date: string;
  goal_id: string;
  goals: {
    title: string;
    verification_mode: string;
  };
}

export const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          goals (
            title,
            verification_mode
          )
        `)
        .eq("user_id", user.id)
        .eq("scheduled_date", today)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = async (taskId: string, checked: boolean) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ 
          status: checked ? "completed" : "pending",
          completed_at: checked ? new Date().toISOString() : null,
        })
        .eq("id", taskId);

      if (error) throw error;
      
      toast({ 
        title: checked ? "Task marked complete!" : "Task marked incomplete",
        description: checked ? "Great work! Keep it up." : "",
      });
      
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      toast({ title: "Error", description: "Failed to update task", variant: "destructive" });
    }
  };

  const handleVerify = (task: Task) => {
    if (task.goals.verification_mode === "strict") {
      setSelectedTask(task);
    } else {
      handleNormalVerification(task.id);
    }
  };

  const handleNormalVerification = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ verified: true, xp_earned: 50 })
        .eq("id", taskId);

      if (error) throw error;

      // Create progress entry
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await supabase.from("progress_entries").insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          goal_id: task.goal_id,
          task_id: taskId,
          verified: true,
          xp_gained: 50,
        });
      }

      toast({ title: "Verified!", description: "Task verified successfully. +50 XP" });
      fetchTasks();
    } catch (error) {
      console.error("Error verifying task:", error);
      toast({ title: "Error", description: "Failed to verify task", variant: "destructive" });
    }
  };

  if (loading) {
    return <Card className="p-6">Loading tasks...</Card>;
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Today's Tasks</h3>
          <Badge variant="secondary">{tasks.length} tasks</Badge>
        </div>

        {tasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No tasks scheduled for today</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  checked={task.status === "completed"}
                  onCheckedChange={(checked) => handleTaskComplete(task.id, checked as boolean)}
                />
                <div className="flex-1">
                  <p className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{task.goals.title}</p>
                </div>
                {task.verified && (
                  <Badge className="gap-1 bg-success text-success-foreground">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
                {!task.verified && task.status === "completed" && (
                  <Button onClick={() => handleVerify(task)} size="sm" variant="outline" className="gap-2">
                    {task.goals.verification_mode === "strict" ? (
                      <>
                        <Camera className="h-4 w-4" />
                        Camera Verify
                      </>
                    ) : (
                      "Verify"
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {selectedTask && (
        <CameraVerificationDialog
          task={selectedTask}
          open={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onVerified={() => {
            setSelectedTask(null);
            fetchTasks();
          }}
        />
      )}
    </>
  );
};
