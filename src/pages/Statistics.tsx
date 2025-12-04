import { BarChart3, TrendingUp, Award, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { useLanguage } from "@/hooks/useLanguage";
import { useNavigate } from "react-router-dom";

const Statistics = () => {
  const { profile, loading } = useProfile();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="container max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">{t("statistics")}</h1>
          <Button variant="secondary" size="sm" className="rounded-xl">
            <Calendar className="w-4 h-4 mr-2" />
            {t("activity")}
          </Button>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* XP Graph Card */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-card animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-bold">{t("xpLast7Days")}</h2>
          </div>
          <div className="h-48 bg-muted/30 rounded-xl flex items-center justify-center">
            {(profile?.xp || 0) > 0 ? (
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">{profile?.xp}</div>
                <p className="text-sm text-muted-foreground">{t("totalXPEarned")}</p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t("startQuests")}</p>
                <p className="text-xs">{t("toSeeProgress")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Test Scores */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl p-4 border border-border shadow-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">SAT</span>
            </div>
            <div className="text-3xl font-bold">
              {profile?.sat_score ?? "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {profile?.sat_score ? t("outOf1600") : t("addInSettings")}
            </p>
          </div>

          <div className="bg-card rounded-2xl p-4 border border-border shadow-card animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-accent" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">IELTS</span>
            </div>
            <div className="text-3xl font-bold">
              {profile?.ielts_score ?? "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {profile?.ielts_score ? t("outOf9") : t("addInSettings")}
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="font-bold mb-4">{t("overallStats")}</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-primary/10 rounded-xl text-center">
              <div className="text-2xl font-bold text-primary">{profile?.xp || 0}</div>
              <div className="text-xs text-muted-foreground">{t("totalXP")}</div>
            </div>
            <div className="p-4 bg-primary/10 rounded-xl text-center">
              <div className="text-2xl font-bold text-primary">{profile?.level || 1}</div>
              <div className="text-xs text-muted-foreground">{t("level")}</div>
            </div>
            <div className="p-4 bg-accent/10 rounded-xl text-center">
              <div className="text-2xl font-bold text-accent">{profile?.streak || 0}</div>
              <div className="text-xs text-muted-foreground">{t("dayStreak")}</div>
            </div>
          </div>
        </div>

        {/* Add Score CTA */}
        {(!profile?.sat_score && !profile?.ielts_score) && (
          <div className="text-center py-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <p className="text-sm text-muted-foreground mb-3">
              {t("addTestResults")}
            </p>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => navigate("/settings")}>
              {t("addResults")}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Statistics;
