-- Fix duration_days column - make it a regular column instead of generated
ALTER TABLE public.goals 
ALTER COLUMN duration_days DROP EXPRESSION IF EXISTS;

-- Update duration_days to be calculated from dates
UPDATE public.goals 
SET duration_days = (end_date - start_date)
WHERE duration_days IS NULL OR duration_days = 0;

-- Ensure intensity_level has proper default
ALTER TABLE public.goals 
ALTER COLUMN intensity_level SET DEFAULT 1;