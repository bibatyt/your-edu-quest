import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Circle, Loader2, Link2, LogOut, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

type Language = "ru" | "en" | "kk";

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: "not_started" | "in_progress" | "done";
  category: string;
  order: number;
}

const translations = {
  ru: {
    title: "Прогресс ребёнка",
    progress: "Общий прогресс",
    currentStage: "Следующий шаг",
    noLink: "Привяжите аккаунт ребёнка",
    enterCode: "Введите код, который ребёнок создал в приложении",
    codePlaceholder: "Код (например: ABC123)",
    linkChild: "Привязать",
    loading: "Загрузка...",
    notStarted: "Не начато",
    inProgress: "В процессе",
    done: "Выполнено",
    invalidCode: "Неверный или истёкший код",
    linked: "Аккаунт привязан!",
    completed: "Выполнено",
    upcoming: "Предстоящие шаги",
    viewOnly: "Только просмотр",
    logout: "Выйти",
    statistics: "Статистика",
    recommendations: "Рекомендации AI",
    warnings: "Чего избегать",
    aheadOfSchedule: "опережает график на",
    behindSchedule: "отстаёт от графика на",
    onTrack: "идёт по плану",
    childStatus: "Статус ребёнка",
    tasksCompleted: "задач выполнено",
    tasksRemaining: "задач осталось",
    goal: "Цель",
    targetYear: "Год поступления",
    specialty: "Направление",
  },
  en: {
    title: "Child's Progress",
    progress: "Overall progress",
    currentStage: "Next step",
    noLink: "Link your child's account",
    enterCode: "Enter the code your child created in the app",
    codePlaceholder: "Code (e.g. ABC123)",
    linkChild: "Link",
    loading: "Loading...",
    notStarted: "Not started",
    inProgress: "In progress",
    done: "Done",
    invalidCode: "Invalid or expired code",
    linked: "Account linked!",
    completed: "Completed",
    upcoming: "Upcoming steps",
    viewOnly: "View only",
    logout: "Logout",
    statistics: "Statistics",
    recommendations: "AI Recommendations",
    warnings: "What to avoid",
    aheadOfSchedule: "ahead of schedule by",
    behindSchedule: "behind schedule by",
    onTrack: "on track",
    childStatus: "Child's status",
    tasksCompleted: "tasks completed",
    tasksRemaining: "tasks remaining",
    goal: "Goal",
    targetYear: "Target year",
    specialty: "Field",
  },
  kk: {
    title: "Баланың прогресі",
    progress: "Жалпы прогресс",
    currentStage: "Келесі қадам",
    noLink: "Баланың аккаунтын байланыстырыңыз",
    enterCode: "Бала қосымшада жасаған кодты енгізіңіз",
    codePlaceholder: "Код (мысалы: ABC123)",
    linkChild: "Байланыстыру",
    loading: "Жүктелуде...",
    notStarted: "Басталмаған",
    inProgress: "Орындалуда",
    done: "Орындалды",
    invalidCode: "Жарамсыз немесе мерзімі өткен код",
    linked: "Аккаунт байланыстырылды!",
    completed: "Орындалған",
    upcoming: "Алдағы қадамдар",
    viewOnly: "Тек көру",
    logout: "Шығу",
    statistics: "Статистика",
    recommendations: "AI Ұсыныстары",
    warnings: "Неден аулақ болу керек",
    aheadOfSchedule: "графиктен озып келеді",
    behindSchedule: "графиктен қалып келеді",
    onTrack: "жоспар бойынша",
    childStatus: "Бала мәртебесі",
    tasksCompleted: "тапсырма орындалды",
    tasksRemaining: "тапсырма қалды",
    goal: "Мақсат",
    targetYear: "Түсу жылы",
    specialty: "Бағыт",
  },
};

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [language] = useState<Language>("ru");
  const t = translations[language];

  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);
  const [code, setCode] = useState("");
  const [linkedStudentId, setLinkedStudentId] = useState<string | null>(null);
  const [path, setPath] = useState<{
    id: string;
    milestones: Milestone[];
    progress_percent: number;
    current_stage: string;
    specific_goal?: string;
    target_year?: number;
    ai_recommendations?: string[];
    ai_warnings?: string[];
    expected_progress_percent?: number;
  } | null>(null);

  useEffect(() => {
    if (user) checkLinkAndFetchPath();
  }, [user]);

  const checkLinkAndFetchPath = async () => {
    if (!user) return;
    try {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("linked_student_id")
        .eq("user_id", user.id)
        .eq("role", "parent")
        .maybeSingle();

      if (roleData?.linked_student_id) {
        setLinkedStudentId(roleData.linked_student_id);
        await fetchStudentPath(roleData.linked_student_id);
      }
    } catch (error) {
      console.error("Error checking link:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentPath = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from("student_paths")
        .select("*")
        .eq("user_id", studentId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setPath({
          ...data,
          milestones: (data.milestones as unknown as Milestone[]) || [],
          ai_recommendations: (data.ai_recommendations as unknown as string[]) || [],
          ai_warnings: (data.ai_warnings as unknown as string[]) || [],
        });
      }
    } catch (error) {
      console.error("Error fetching student path:", error);
    }
  };

  const handleLinkChild = async () => {
    if (!user || !code.trim()) return;
    setLinking(true);
    try {
      // Fetch the code - RLS now allows reading
      const { data: codeData, error: codeError } = await supabase
        .from("parent_link_codes")
        .select("student_id, used, expires_at")
        .eq("code", code.trim().toUpperCase())
        .maybeSingle();

      console.log("Code lookup result:", codeData, codeError);

      if (codeError) {
        console.error("Code lookup error:", codeError);
        toast.error(t.invalidCode);
        return;
      }

      if (!codeData) {
        toast.error(t.invalidCode);
        return;
      }

      if (codeData.used) {
        toast.error(t.invalidCode);
        return;
      }

      if (new Date(codeData.expires_at) < new Date()) {
        toast.error(t.invalidCode);
        return;
      }

      // Mark code as used
      const { error: updateError } = await supabase
        .from("parent_link_codes")
        .update({ used: true })
        .eq("code", code.trim().toUpperCase());

      if (updateError) {
        console.error("Error updating code:", updateError);
      }

      // Create or update parent role with linked student
      const { error: roleError } = await supabase.from("user_roles").upsert({
        user_id: user.id,
        role: "parent" as const,
        linked_student_id: codeData.student_id,
      });

      if (roleError) {
        console.error("Error creating role:", roleError);
        toast.error(t.invalidCode);
        return;
      }

      setLinkedStudentId(codeData.student_id);
      await fetchStudentPath(codeData.student_id);
      toast.success(t.linked);
    } catch (error) {
      console.error("Error linking child:", error);
      toast.error(t.invalidCode);
    } finally {
      setLinking(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "not_started": return t.notStarted;
      case "in_progress": return t.inProgress;
      case "done": return t.done;
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!linkedStudentId) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-card">
          <span className="text-lg font-semibold text-foreground">Qadam</span>
          <button
            onClick={handleLogout}
            className="p-2 rounded hover:bg-muted transition-colors text-muted-foreground"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-sm w-full space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Link2 className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">{t.noLink}</h1>
              <p className="text-sm text-muted-foreground mt-2">{t.enterCode}</p>
            </div>

            <div className="space-y-3">
              <Input
                placeholder={t.codePlaceholder}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="text-center text-lg tracking-widest h-14 rounded-xl font-mono"
                maxLength={6}
              />
              <Button
                className="w-full h-12 rounded-xl font-semibold"
                onClick={handleLinkChild}
                disabled={!code.trim() || linking}
              >
                {linking ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  t.linkChild
                )}
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <p className="text-muted-foreground">{t.loading}</p>
      </div>
    );
  }

  const completedMilestones = path.milestones.filter((m) => m.status === "done");
  const upcomingMilestones = path.milestones.filter((m) => m.status !== "done");
  const nextStep = upcomingMilestones.sort((a, b) => a.order - b.order)[0];
  
  // Calculate progress difference
  const expectedProgress = path.expected_progress_percent || 10;
  const progressDiff = path.progress_percent - expectedProgress;
  const isAhead = progressDiff > 0;
  const isBehind = progressDiff < -5;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-card border-b border-border z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">{t.title}</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-lg">
              {t.viewOnly}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 pb-24 space-y-5">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-5 ${
            isAhead 
              ? "bg-gradient-to-br from-primary to-accent" 
              : isBehind 
              ? "bg-gradient-to-br from-destructive/80 to-destructive" 
              : "bg-gradient-to-br from-warning/80 to-warning"
          } text-white`}
        >
          <div className="flex items-center gap-3 mb-3">
            {isAhead ? (
              <TrendingUp className="w-6 h-6" />
            ) : isBehind ? (
              <TrendingDown className="w-6 h-6" />
            ) : (
              <BarChart3 className="w-6 h-6" />
            )}
            <span className="text-sm font-medium opacity-90">{t.childStatus}</span>
          </div>
          
          <p className="text-2xl font-bold mb-1">
            {isAhead 
              ? `🎉 ${t.aheadOfSchedule} ${Math.abs(progressDiff)}%!`
              : isBehind 
              ? `⚠️ ${t.behindSchedule} ${Math.abs(progressDiff)}%`
              : `✅ ${t.onTrack}`
            }
          </p>
          
          {path.specific_goal && (
            <p className="text-sm opacity-80 mt-2">
              {t.goal}: {path.specific_goal}
            </p>
          )}
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{t.progress}</span>
            <span className="text-3xl font-bold text-primary">
              {path.progress_percent}%
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${path.progress_percent}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-primary rounded-full"
            />
          </div>
          <div className="flex justify-between mt-3 text-sm">
            <span className="text-muted-foreground">
              {completedMilestones.length} {t.tasksCompleted}
            </span>
            <span className="text-muted-foreground">
              {upcomingMilestones.length} {t.tasksRemaining}
            </span>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">{t.statistics}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-2xl font-bold text-foreground">{completedMilestones.length}</p>
              <p className="text-sm text-muted-foreground">{t.tasksCompleted}</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-2xl font-bold text-foreground">{upcomingMilestones.length}</p>
              <p className="text-sm text-muted-foreground">{t.tasksRemaining}</p>
            </div>
            {path.target_year && (
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="text-2xl font-bold text-foreground">{path.target_year}</p>
                <p className="text-sm text-muted-foreground">{t.targetYear}</p>
              </div>
            )}
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-2xl font-bold text-foreground">{expectedProgress}%</p>
              <p className="text-sm text-muted-foreground">Ожидаемый прогресс</p>
            </div>
          </div>
        </motion.div>

        {/* Next Step */}
        {nextStep && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-primary/5 border border-primary/20 rounded-2xl p-5"
          >
            <span className="text-xs text-primary font-bold uppercase tracking-wide">{t.currentStage}</span>
            <p className="text-base font-semibold text-foreground mt-2">
              {nextStep.title}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {nextStep.description}
            </p>
          </motion.div>
        )}

        {/* AI Recommendations */}
        {path.ai_recommendations && path.ai_recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card border border-border rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-warning" />
              <h2 className="font-semibold text-foreground">{t.recommendations}</h2>
            </div>
            <ul className="space-y-3">
              {path.ai_recommendations.slice(0, 5).map((rec, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="text-primary font-bold">{i + 1}.</span>
                  <span className="text-muted-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* AI Warnings */}
        {path.ai_warnings && path.ai_warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-destructive/5 border border-destructive/20 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h2 className="font-semibold text-foreground">{t.warnings}</h2>
            </div>
            <ul className="space-y-3">
              {path.ai_warnings.slice(0, 5).map((warning, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="text-destructive font-bold">!</span>
                  <span className="text-muted-foreground">{warning}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Completed Section */}
        {completedMilestones.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              {t.completed} ({completedMilestones.length})
            </h2>
            <div className="bg-card border border-border rounded-2xl divide-y divide-border">
              {completedMilestones.map((milestone) => (
                <div key={milestone.id} className="p-4 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground line-through">
                      {milestone.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Upcoming Section */}
        {upcomingMilestones.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              {t.upcoming} ({upcomingMilestones.length})
            </h2>
            <div className="bg-card border border-border rounded-2xl divide-y divide-border">
              {upcomingMilestones
                .sort((a, b) => a.order - b.order)
                .map((milestone) => (
                  <div key={milestone.id} className="p-4">
                    <div className="flex gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          milestone.status === "in_progress"
                            ? "border-2 border-warning bg-warning/10"
                            : "border-2 border-border"
                        }`}
                      >
                        {milestone.status === "in_progress" && (
                          <Circle className="w-2 h-2 fill-warning text-warning" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-medium text-foreground">
                            {milestone.title}
                          </h3>
                          <span
                            className={`shrink-0 text-xs px-2 py-0.5 rounded-lg ${
                              milestone.status === "in_progress"
                                ? "bg-warning/10 text-warning"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {getStatusLabel(milestone.status)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
