import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { goalId, tasks } = await req.json();

    if (!goalId || !tasks || !Array.isArray(tasks)) {
      throw new Error('Invalid request: goalId and tasks array required');
    }

    // Get goal details
    const { data: goal, error: goalError } = await supabaseClient
      .from('goals')
      .select('start_date, duration_days')
      .eq('id', goalId)
      .single();

    if (goalError) throw goalError;

    // Prepare tasks for insertion
    const startDate = new Date(goal.start_date);
    const tasksToInsert = tasks.map((task: any, index: number) => {
      const scheduledDate = new Date(startDate);
      scheduledDate.setDate(scheduledDate.getDate() + (task.day || index));

      return {
        user_id: user.id,
        goal_id: goalId,
        title: task.title,
        description: task.description || '',
        scheduled_date: scheduledDate.toISOString().split('T')[0],
        status: 'pending',
        verified: false,
        xp_earned: 0,
      };
    });

    // Insert tasks
    const { data: insertedTasks, error: insertError } = await supabaseClient
      .from('tasks')
      .insert(tasksToInsert)
      .select();

    if (insertError) throw insertError;

    console.log(`Created ${insertedTasks.length} tasks for goal ${goalId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        tasksCreated: insertedTasks.length,
        tasks: insertedTasks 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in create-tasks:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
