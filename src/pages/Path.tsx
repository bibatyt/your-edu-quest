import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Circle, ChevronRight, Sparkles, 
  GraduationCap, FileText, DollarSign, ClipboardList,
  BookOpen, Target, Loader2, User, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  completed: boolean;
  order_index: number;
  efc_specific: boolean;
}

interface SuccessStory {
  id: string;
  name: string;
  university: string;
  country: string;
  efc_segment: string;
  story: string;
  scholarship_amount: string | null;
}

interface EFCData {
  role: string;
  efc_segment: string;
  residence_country: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  exam: <BookOpen className="w-5 h-5" />,
  essay: <FileText className="w-5 h-5" />,
  application: <ClipboardList className="w-5 h-5" />,
  financial: <DollarSign className="w-5 h-5" />,
  document: <ClipboardList className="w-5 h-5" />,
  general: <Target className="w-5 h-5" />,
};

const categoryColors: Record<string, string> = {
  exam: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  essay: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  application: "bg-green-500/10 text-green-500 border-green-500/20",
  financial: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  document: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  general: "bg-primary/10 text-primary border-primary/20",
};

const priorityLabels: Record<string, { label: string; color: string }> = {
  high: { label: "Важно", color: "bg-red-500/10 text-red-500" },
  medium: { label: "Средний", color: "bg-amber-500/10 text-amber-500" },
  low: { label: "Низкий", color: "bg-green-500/10 text-green-500" },
};

export default function Path() {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [efcData, setEfcData] = useState<EFCData | null>(null);
  const [efcExplanation, setEfcExplanation] = useState("");
  const [successStory, setSuccessStory] = useState<SuccessStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPathData();
    }
  }, [user]);

  const fetchPathData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch EFC data
      const { data: efcResult } = await supabase
        .from('user_efc_data')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (efcResult) {
        setEfcData(efcResult);
        
        // Fetch milestones
        const { data: milestonesResult } = await supabase
          .from('path_milestones')
          .select('*')
          .eq('user_id', user.id)
          .order('order_index');

        if (milestonesResult && milestonesResult.length > 0) {
          setMilestones(milestonesResult);
        } else {
          // Generate path if no milestones exist
          await generatePath(efcResult);
        }

        // Fetch matching success story
        const { data: storyResult } = await supabase
          .from('success_stories')
          .select('*')
          .eq('efc_segment', efcResult.efc_segment)
          .limit(1)
          .single();

        if (storyResult) {
          setSuccessStory(storyResult);
        }

        // Set EFC explanation
        updateEfcExplanation(efcResult.efc_segment, efcResult.role);
      }
    } catch (error) {
      console.error('Error fetching path data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateEfcExplanation = (segment: string, role: string) => {
    if (role === 'parent') {
      setEfcExplanation('Ваш путь настроен для поддержки ребёнка в процессе поступления.');
      return;
    }

    switch (segment) {
      case 'low':
        setEfcExplanation('Этот путь оптимизирован под максимальные стипендии и гранты. Фокус на Need-Blind университетах.');
        break;
      case 'medium':
        setEfcExplanation('Комбинация Need-based и Merit-based стратегий для оптимального покрытия.');
        break;
      case 'high':
        setEfcExplanation('Фокус на Merit-based стипендиях и престижных программах.');
        break;
    }
  };

  const generatePath = async (efc: EFCData) => {
    if (!user) return;
    
    setGenerating(true);
    try {
      // Get roadmap data for additional context
      const { data: roadmap } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data, error } = await supabase.functions.invoke('generate-path', {
        body: {
          role: efc.role,
          efcSegment: efc.efc_segment,
          targetCountry: roadmap?.target_country || 'usa',
          currentGrade: roadmap?.current_grade || '11',
          mainGoal: roadmap?.main_goal || 'top_uni',
          targetUniversities: [],
        }
      });

      if (error) throw error;

      // Save milestones to database
      const milestonesToInsert = data.milestones.map((m: any, index: number) => ({
        user_id: user.id,
        title: m.title,
        description: m.description,
        category: m.category,
        priority: m.priority,
        order_index: index + 1,
        efc_specific: m.efc_specific,
        metadata: m.metadata,
      }));

      const { data: insertedMilestones, error: insertError } = await supabase
        .from('path_milestones')
        .insert(milestonesToInsert)
        .select();

      if (insertError) throw insertError;

      setMilestones(insertedMilestones || []);
      setEfcExplanation(data.efcExplanation);
      toast.success('Персональный путь создан!');
    } catch (error) {
      console.error('Error generating path:', error);
      toast.error('Ошибка при генерации пути');
    } finally {
      setGenerating(false);
    }
  };

  const toggleMilestone = async (milestone: Milestone) => {
    try {
      const newCompleted = !milestone.completed;
      
      const { error } = await supabase
        .from('path_milestones')
        .update({ 
          completed: newCompleted,
          completed_at: newCompleted ? new Date().toISOString() : null
        })
        .eq('id', milestone.id);

      if (error) throw error;

      setMilestones(prev => 
        prev.map(m => 
          m.id === milestone.id ? { ...m, completed: newCompleted } : m
        )
      );

      if (newCompleted) {
        toast.success('Отлично! Шаг выполнен! 🎉');
      }
    } catch (error) {
      console.error('Error toggling milestone:', error);
      toast.error('Ошибка при обновлении');
    }
  };

  const resetPath = async () => {
    if (!user || !efcData) return;
    
    try {
      // Delete existing milestones
      await supabase
        .from('path_milestones')
        .delete()
        .eq('user_id', user.id);

      // Regenerate
      await generatePath(efcData);
    } catch (error) {
      console.error('Error resetting path:', error);
      toast.error('Ошибка при сбросе пути');
    }
  };

  const completedCount = milestones.filter(m => m.completed).length;
  const totalCount = milestones.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const nextMilestone = milestones.find(m => !m.completed);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!efcData) {
    return (
      <div className="min-h-screen bg-background pb-24 px-4 py-6">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-black text-foreground mb-3">Путь ещё не создан</h1>
          <p className="text-muted-foreground mb-6">
            Пройдите онбординг, чтобы получить персональный путь поступления
          </p>
          <Button variant="hero" onClick={() => window.location.href = '/onboarding'}>
            Начать
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="container max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                {efcData.role === 'parent' ? (
                  <User className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <GraduationCap className="w-5 h-5 text-primary-foreground" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-foreground">Мой путь</h1>
                <p className="text-xs text-muted-foreground">
                  {efcData.role === 'parent' ? 'Родитель' : 'Студент'} • EFC: {efcData.efc_segment}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={resetPath}
              disabled={generating}
            >
              <RefreshCw className={`w-5 h-5 ${generating ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Progress */}
          <div className="bg-muted/50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">Прогресс</span>
              <span className="text-sm font-bold text-primary">{completedCount}/{totalCount}</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full gradient-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* EFC Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/20 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">
                Персонализированный путь
              </p>
              <p className="text-xs text-muted-foreground">
                {efcExplanation}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Next Important Step */}
        {nextMilestone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="duolingo-card overflow-hidden"
          >
            <div className="gradient-primary p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5" />
                <span className="font-bold">Следующий важный шаг</span>
              </div>
              <h2 className="text-xl font-black">{nextMilestone.title}</h2>
            </div>
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                {nextMilestone.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${categoryColors[nextMilestone.category] || categoryColors.general}`}>
                    {categoryIcons[nextMilestone.category]}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${priorityLabels[nextMilestone.priority]?.color}`}>
                    {priorityLabels[nextMilestone.priority]?.label}
                  </span>
                </div>
                <Button 
                  variant="hero" 
                  size="sm"
                  onClick={() => toggleMilestone(nextMilestone)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Готово
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success Story */}
        {successStory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">🎓</div>
              <div className="flex-1">
                <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">
                  История успеха
                </p>
                <p className="text-sm font-bold text-foreground mb-1">
                  {successStory.name} → {successStory.university}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {successStory.story}
                </p>
                {successStory.scholarship_amount && (
                  <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs font-bold rounded-lg">
                    {successStory.scholarship_amount}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* All Milestones */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-1">
            Все шаги ({completedCount}/{totalCount})
          </h3>
          
          <AnimatePresence>
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  duolingo-card p-4 transition-all
                  ${milestone.completed ? 'opacity-60' : ''}
                `}
              >
                <button
                  onClick={() => toggleMilestone(milestone)}
                  className="w-full flex items-start gap-3 text-left"
                >
                  <div className={`
                    w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5
                    ${milestone.completed 
                      ? 'gradient-primary' 
                      : 'border-2 border-muted-foreground/30'
                    }
                  `}>
                    {milestone.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground/30" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-bold text-foreground ${milestone.completed ? 'line-through' : ''}`}>
                        {milestone.title}
                      </h4>
                      {milestone.efc_specific && (
                        <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded">
                          EFC
                        </span>
                      )}
                    </div>
                    {milestone.description && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {milestone.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${categoryColors[milestone.category] || categoryColors.general}`}>
                        {milestone.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${priorityLabels[milestone.priority]?.color}`}>
                        {priorityLabels[milestone.priority]?.label}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}