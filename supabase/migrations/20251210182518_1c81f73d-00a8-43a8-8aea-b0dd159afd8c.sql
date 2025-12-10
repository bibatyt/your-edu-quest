-- Таблица для EFC данных пользователя
CREATE TABLE public.user_efc_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('student', 'parent')),
  residence_country text NOT NULL,
  income_range text NOT NULL CHECK (income_range IN ('low', 'medium', 'high')),
  budget_range text NOT NULL CHECK (budget_range IN ('low', 'medium', 'high')),
  efc_segment text NOT NULL CHECK (efc_segment IN ('low', 'medium', 'high')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Таблица для персонального пути (milestones)
CREATE TABLE public.path_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('exam', 'essay', 'application', 'financial', 'document', 'general')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  due_date date,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamp with time zone,
  order_index integer NOT NULL DEFAULT 0,
  efc_specific boolean NOT NULL DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Таблица для историй успеха
CREATE TABLE public.success_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  university text NOT NULL,
  country text NOT NULL,
  efc_segment text NOT NULL CHECK (efc_segment IN ('low', 'medium', 'high')),
  residence_country text,
  gpa_range text,
  story text NOT NULL,
  scholarship_amount text,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Таблица для рекомендаций ВУЗов
CREATE TABLE public.university_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  university_name text NOT NULL,
  university_id text,
  country text NOT NULL,
  match_score integer NOT NULL DEFAULT 0,
  financial_aid_available boolean NOT NULL DEFAULT false,
  scholarship_type text,
  reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_efc_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.path_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.university_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_efc_data
CREATE POLICY "Users can view own efc data" ON public.user_efc_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own efc data" ON public.user_efc_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own efc data" ON public.user_efc_data FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for path_milestones
CREATE POLICY "Users can view own milestones" ON public.path_milestones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own milestones" ON public.path_milestones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own milestones" ON public.path_milestones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own milestones" ON public.path_milestones FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for success_stories (public read)
CREATE POLICY "Anyone can view success stories" ON public.success_stories FOR SELECT USING (true);

-- RLS Policies for university_recommendations
CREATE POLICY "Users can view own recommendations" ON public.university_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recommendations" ON public.university_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own recommendations" ON public.university_recommendations FOR DELETE USING (auth.uid() = user_id);

-- Insert sample success stories
INSERT INTO public.success_stories (name, university, country, efc_segment, residence_country, gpa_range, story, scholarship_amount) VALUES
('Айгерим К.', 'Harvard University', 'usa', 'low', 'kz', '3.8-4.0', 'Получила полный грант на обучение благодаря Need-Blind политике Гарварда. Главный совет: не бойтесь подаваться на финансовую помощь!', '$85,000/год'),
('Даниял М.', 'University of Toronto', 'canada', 'medium', 'kz', '3.6-3.8', 'Комбинация Merit и Need-based стипендий покрыла 70% стоимости. Ключ — сильные эссе и рекомендации.', '$45,000/год'),
('Мария С.', 'ETH Zurich', 'eu', 'high', 'ru', '3.9-4.0', 'В Европе образование доступнее! ETH стоит ~$1500/год, плюс получила Excellence Scholarship.', '€15,000 + низкая стоимость'),
('Арман Т.', 'NUS Singapore', 'asia', 'medium', 'kz', '3.7-3.9', 'Tuition Grant снизил стоимость вдвое. Азия — отличный вариант для качественного образования.', '50% Tuition Grant'),
('Алина В.', 'Yale University', 'usa', 'low', 'ru', '3.85-4.0', 'Yale покрыл 100% финансовой потребности. Секрет успеха — уникальная история в эссе.', 'Full Financial Aid');

-- Trigger for updated_at
CREATE TRIGGER update_user_efc_data_updated_at
BEFORE UPDATE ON public.user_efc_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();