import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Flame, Target, Lightbulb, CheckCircle2, Clock, 
  ChevronRight, Loader2, Zap, Trophy, Sparkles 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { useDailyQuests } from "@/hooks/useDailyQuests";
import { useLanguage } from "@/hooks/useLanguage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

const Dashboard = () => {
  const { profile, loading, updateStreak } = useProfile();
  const { quests, toggleQuest, loading: questsLoading } = useDailyQuests();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [wisdomIndex] = useState(() => Math.floor(Math.random() * 4));
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (profile) {
      updateStreak();
    }
  }, [profile?.id]);

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899'],
    });
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  }, []);

  const handleTaskComplete = async (questId: string, completed: boolean) => {
    await toggleQuest(questId, completed);
    if (!completed) {
      triggerConfetti();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const xpToNextLevel = 100;
  const currentLevelXP = profile ? profile.xp % xpToNextLevel : 0;
  const wisdomKeys = ["wisdom1", "wisdom2", "wisdom3", "wisdom4"];

  const completedQuests = quests.filter(q => q.completed).length;
  const totalQuests = quests.length;
  const progressPercent = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0;

  // Get the first uncompleted quest as "task of the day"
  const taskOfDay = quests.find(q => !q.completed);
  const allCompleted = completedQuests === totalQuests && totalQuests > 0;

  // Emotional progress text
  const getProgressText = () => {
    if (allCompleted) return { text: "Ты супергерой! Все задачи выполнены! 🦸‍♂️", emoji: "🎉" };
    if (progressPercent >= 66) return { text: "Отлично! Ты почти у цели!", emoji: "🔥" };
    if (progressPercent >= 33) return { text: "Хороший темп! Продолжай!", emoji: "💪" };
    if ((profile?.streak || 0) > 3) return { text: `${profile?.streak} дней подряд! Ты в ударе!`, emoji: "⚡" };
    return { text: "Начни с малого — одна задача за раз", emoji: "🎯" };
  };

  const progressInfo = getProgressText();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8" />
                <span className="text-xl font-bold">Отлично! +XP</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* Compact Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-primary">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="gradient-primary text-primary-foreground font-bold">
                  {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {profile?.level || 1}
              </div>
            </div>
            <div>
              <p className="font-bold text-foreground">{profile?.name || "Студент"}</p>
              <p className="text-xs text-muted-foreground">{profile?.xp || 0} XP</p>
            </div>
          </div>
          
          {/* Streak Badge */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-3 py-2 rounded-full gradient-streak text-white"
          >
            <Flame className={`w-5 h-5 ${(profile?.streak || 0) > 0 ? 'animate-fire' : ''}`} />
            <span className="font-bold">{profile?.streak || 0}</span>
          </motion.div>
        </motion.div>

        {/* MAIN FOCUS: Task of the Day Card - Takes 60% of screen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="duolingo-card overflow-hidden"
        >
          {/* Header gradient */}
          <div className="gradient-primary p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-semibold opacity-90">Задача дня</span>
              <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded-full">~12 мин</span>
            </div>
            <h2 className="text-xl font-bold leading-tight">
              {allCompleted 
                ? "🎉 Все задачи выполнены!" 
                : taskOfDay?.quest_title || "Загрузка..."}
            </h2>
          </div>

          {/* Action area */}
          <div className="p-5">
            {allCompleted ? (
              <div className="text-center py-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-6xl mb-4"
                >
                  🏆
                </motion.div>
                <p className="text-muted-foreground">Возвращайся завтра за новыми задачами!</p>
              </div>
            ) : taskOfDay && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-xp" />
                    <span className="font-bold text-xp">+{taskOfDay.xp_reward} XP</span>
                  </div>
                </div>
                
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full h-14 text-lg font-bold"
                  onClick={() => handleTaskComplete(taskOfDay.id, taskOfDay.completed)}
                >
                  <CheckCircle2 className="w-6 h-6 mr-2" />
                  Выполнено!
                </Button>
              </>
            )}
          </div>
        </motion.div>

        {/* Emotional Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="duolingo-card p-5"
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl">{progressInfo.emoji}</div>
            <div className="flex-1">
              <p className="font-bold text-foreground mb-2">{progressInfo.text}</p>
              <div className="flex items-center gap-3">
                <Progress value={progressPercent} className="h-3 flex-1" />
                <span className="text-sm font-bold text-muted-foreground">
                  {completedQuests}/{totalQuests}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-3"
        >
          <button
            onClick={() => navigate("/path")}
            className="duolingo-card p-4 text-left hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <p className="font-bold text-foreground text-sm">Мой план</p>
            <p className="text-xs text-muted-foreground">Roadmap</p>
          </button>

          <button
            onClick={() => navigate("/counselor")}
            className="duolingo-card p-4 text-left hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <p className="font-bold text-foreground text-sm">AI Советник</p>
            <p className="text-xs text-muted-foreground">Задать вопрос</p>
          </button>
        </motion.div>

        {/* Other Quests (collapsed) */}
        {quests.filter(q => q.id !== taskOfDay?.id).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="duolingo-card"
          >
            <button
              onClick={() => {}}
              className="w-full flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">📋</span>
                <span className="font-bold text-foreground">Другие задачи</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            
            <div className="px-4 pb-4 space-y-2">
              {quests.filter(q => q.id !== taskOfDay?.id).map((quest) => (
                <button
                  key={quest.id}
                  onClick={() => handleTaskComplete(quest.id, quest.completed)}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-xl transition-all
                    ${quest.completed 
                      ? "bg-primary/10 border border-primary/20" 
                      : "bg-muted/50 hover:bg-muted"
                    }
                  `}
                >
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center shrink-0
                    ${quest.completed 
                      ? "bg-primary text-primary-foreground" 
                      : "border-2 border-muted-foreground/30"
                    }
                  `}>
                    {quest.completed && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span className={`text-sm text-left flex-1 ${
                    quest.completed ? "line-through text-muted-foreground" : "text-foreground"
                  }`}>
                    {quest.quest_title}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    quest.completed ? "text-primary bg-primary/10" : "text-xp bg-xp/10"
                  }`}>
                    +{quest.xp_reward}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Wisdom Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="gradient-wisdom rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-wisdom-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-wisdom-foreground/80 uppercase tracking-wider mb-1">
                {t("wisdomOfDay")}
              </p>
              <p className="text-sm text-wisdom-foreground font-semibold">
                "{t(wisdomKeys[wisdomIndex])}"
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
