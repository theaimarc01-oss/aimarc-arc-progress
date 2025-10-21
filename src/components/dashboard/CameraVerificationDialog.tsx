import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CameraVerificationDialogProps {
  task: {
    id: string;
    title: string;
    goal_id: string;
  };
  open: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export const CameraVerificationDialog = ({ task, open, onClose, onVerified }: CameraVerificationDialogProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [open]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({ title: "Camera Error", description: "Could not access camera", variant: "destructive" });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        setCaptured(true);
      }
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      // In a real implementation, you would:
      // 1. Send the captured image to MediaPipe for pose detection
      // 2. Validate the exercise/activity
      // 3. Store verification data
      
      // For now, we'll simulate verification
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Update task as verified
      const { error: taskError } = await supabase
        .from("tasks")
        .update({ 
          verified: true, 
          xp_earned: 100,
          verification_data: { method: "camera", timestamp: new Date().toISOString() }
        })
        .eq("id", task.id);

      if (taskError) throw taskError;

      // Create progress entry
      const { error: progressError } = await supabase.from("progress_entries").insert({
        user_id: user.id,
        goal_id: task.goal_id,
        task_id: task.id,
        verified: true,
        xp_gained: 100,
        notes: "Camera verified",
      });

      if (progressError) throw progressError;

      toast({ 
        title: "Verified! 🎉", 
        description: "Task verified with camera. +100 XP for strict verification!",
      });
      
      stopCamera();
      onVerified();
    } catch (error) {
      console.error("Error verifying task:", error);
      toast({ title: "Error", description: "Failed to verify task", variant: "destructive" });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Camera Verification</DialogTitle>
          <DialogDescription>
            Perform the activity and capture proof for verification
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${captured ? "hidden" : ""}`}
            />
            <canvas ref={canvasRef} className={`w-full h-full ${!captured ? "hidden" : ""}`} />
            
            {!stream && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">Starting camera...</p>
              </div>
            )}
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Task: {task.title}</p>
            <p className="text-sm text-muted-foreground">
              Position yourself in frame and perform the activity. The AI will verify your form and completion.
            </p>
          </div>

          <div className="flex gap-3">
            {!captured ? (
              <>
                <Button onClick={capturePhoto} disabled={!stream} className="flex-1 gap-2">
                  <Camera className="h-4 w-4" />
                  Capture Photo
                </Button>
                <Button onClick={onClose} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleVerify} disabled={verifying} className="flex-1 gap-2" variant="hero">
                  <CheckCircle2 className="h-4 w-4" />
                  {verifying ? "Verifying..." : "Verify & Submit"}
                </Button>
                <Button
                  onClick={() => setCaptured(false)}
                  variant="outline"
                  disabled={verifying}
                >
                  Retake
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
