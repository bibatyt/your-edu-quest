import { useEffect } from "react";
import { Flame, Target, Lightbulb, CheckCircle2, Circle, ChevronRight, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useProfile } from "@/hooks/useProfile";
import { useDailyQuests } from "@/hooks/useDailyQuests";
import { useLanguage } from "@/hooks/useLanguage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Dashboard = () => {
  const { profile, loading, updateStreak } = useProfile();
  const { quests, toggleQuest, loading: questsLoading } = useDailyQuests();
  const { t } = useLanguage();

  useEffect(() => {
    if (profile) {
      updateStreak();
    }
  }, [profile?.id]);

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
  const wisdomKey = wisdomKeys[Math.floor(Math.random() * wisdomKeys.length)];

  const getLevelTitle = (level: number) => {
    if (level <= 2) return t("newbie");
    if (level <= 5) return "Explorer";
    if (level <= 10) return "Scholar";
    return "Master";
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <main className="container max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* Profile Header */}
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="relative">
            <Avatar className="w-14 h-14 border-3 border-primary ring-2 ring-primary/20">
              <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-lg">
                {profile?.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-md shadow-sm">
              LVL
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("level")} {profile?.level || 1}</p>
            <p className="font-bold text-foreground">{getLevelTitle(profile?.level || 1)}</p>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {t("welcomeBack")}, {profile?.name || "Студент"} 👋
          </h1>
          <p className="text-muted-foreground text-sm mb-4">{t("readyToConquer")}</p>
          
          {/* XP Progress */}
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-primary font-bold">{currentLevelXP} XP</span>
            <span className="text-muted-foreground">{xpToNextLevel - currentLevelXP} {t("xpToLevel")} {(profile?.level || 1) + 1}</span>
          </div>
          <Progress value={(currentLevelXP / xpToNextLevel) * 100} className="h-3 rounded-full" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {/* Streak Card */}
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Flame className={`w-6 h-6 ${(profile?.streak || 0) > 0 ? 'animate-pulse' : ''}`} />
              </div>
            </div>
            <p className="text-3xl font-bold mt-2">{profile?.streak || 0} <span className="text-lg font-normal">{t("days")}</span></p>
            <p className="text-white/80 text-sm">🔥 {(profile?.streak || 0) > 0 ? t("onFire") : "Start streak!"}</p>
          </div>

          {/* Goal Card */}
          <div className="bg-card rounded-2xl p-4 border border-border shadow-card">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-primary font-semibold mt-2">{t("goal")}</p>
            <p className="font-medium text-foreground truncate">
              {profile?.target_university ? profile.target_university.slice(0, 12) + "..." : t("setGoal")}
            </p>
          </div>
        </div>

        {/* Daily Quests */}
        <div className="bg-card rounded-2xl p-4 border border-border shadow-card animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🎯</span>
            <h2 className="font-bold text-foreground">{t("dailyQuests")}</h2>
          </div>
          {questsLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-3">
              {quests.map((quest, index) => (
                <button
                  key={quest.id}
                  onClick={() => toggleQuest(quest.id, quest.completed)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                    quest.completed 
                      ? "bg-primary/10 border border-primary/20" 
                      : "bg-muted/30 hover:bg-muted/50 border border-transparent"
                  }`}
                  style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                >
                  {quest.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={`text-sm text-left flex-1 ${quest.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {quest.quest_title}
                  </span>
                  <span className={`text-sm font-semibold whitespace-nowrap ${quest.completed ? "text-primary" : "text-primary"}`}>
                    +{quest.xp_reward} XP
                  </span>
                  {!quest.completed && (
                    <span className="text-xs text-muted-foreground">0/1</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Wisdom Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-4 border border-emerald-200/50 dark:border-emerald-800/30 animate-fade-in" style={{ animationDelay: "0.25s" }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wide mb-1">{t("wisdomOfDay")}</p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                "{t(wisdomKey)}"
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
