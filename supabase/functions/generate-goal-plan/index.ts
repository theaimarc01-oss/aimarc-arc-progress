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

    const { goalType, duration, intensity, customPrompt } = await req.json();

    // Validate input
    if (!goalType || !duration || !intensity) {
      throw new Error('Missing required fields');
    }

    // Build system prompt based on goal type
    const systemPrompts = {
      fitness: `You are an expert fitness coach. Create a realistic, progressive ${duration}-day fitness plan with ${intensity}/5 intensity. Include exercises, sets, reps, and rest days. Format each day as a JSON object with: day, title, description, exercises array.`,
      learning: `You are an expert educator. Create a structured ${duration}-day learning plan for with ${intensity}/5 intensity. Break down topics logically with daily milestones. Format each day as a JSON object with: day, title, description, topics array.`,
      exam: `You are an expert exam preparation coach. Create a comprehensive ${duration}-day study plan with ${intensity}/5 intensity. Include topics, practice sessions, and revision days. Format each day as a JSON object with: day, title, description, topics array.`,
      seasonal: `You are a goal achievement expert. Create an achievable ${duration}-day seasonal goal plan with ${intensity}/5 intensity. Format each day as a JSON object with: day, title, description, activities array.`
    };

    const systemPrompt = systemPrompts[goalType as keyof typeof systemPrompts] || systemPrompts.fitness;
    const userPrompt = customPrompt || `Generate a ${duration}-day ${goalType} plan with ${intensity}/5 intensity level. Return ONLY a JSON array of tasks, no markdown formatting.`;

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please contact support.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI service unavailable');
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    // Parse JSON from response (handle potential markdown formatting)
    let tasks;
    try {
      // Remove markdown code blocks if present
      const cleanedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      tasks = JSON.parse(cleanedText);
    } catch (e) {
      console.error('Failed to parse AI response:', generatedText);
      throw new Error('Invalid AI response format');
    }

    return new Response(JSON.stringify({ tasks }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-goal-plan:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
