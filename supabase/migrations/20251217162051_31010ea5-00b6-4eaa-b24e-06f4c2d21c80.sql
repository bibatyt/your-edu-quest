-- Allow anyone to read parent_link_codes by code (for linking)
CREATE POLICY "Anyone can read codes for linking" 
ON public.parent_link_codes 
FOR SELECT 
USING (true);

-- Allow parents to update codes (mark as used)
CREATE POLICY "Anyone can mark codes as used" 
ON public.parent_link_codes 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Add specific_goal column to student_paths
ALTER TABLE public.student_paths ADD COLUMN IF NOT EXISTS specific_goal text;

-- Add recommendations and warnings columns to student_paths
ALTER TABLE public.student_paths ADD COLUMN IF NOT EXISTS ai_recommendations jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.student_paths ADD COLUMN IF NOT EXISTS ai_warnings jsonb DEFAULT '[]'::jsonb;

-- Add expected_progress column for parent tracking
ALTER TABLE public.student_paths ADD COLUMN IF NOT EXISTS expected_progress_percent integer DEFAULT 0;