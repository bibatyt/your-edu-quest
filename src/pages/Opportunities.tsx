import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, ExternalLink, Calendar, MapPin, Trophy, BookOpen, FlaskConical, GraduationCap, Globe, Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Opportunity {
  id: string;
  name: string;
  type: "olympiad" | "camp" | "research" | "course" | "competition";
  relevance: string;
  deadline: string;
  url: string;
  description: string;
  country: string;
  level: "international" | "national" | "regional";
  free: boolean;
}

const typeIcons = {
  olympiad: Trophy,
  camp: GraduationCap,
  research: FlaskConical,
  course: BookOpen,
  competition: Trophy,
};

const typeColors = {
  olympiad: "bg-amber-500/10 text-amber-600 border-amber-200",
  camp: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  research: "bg-purple-500/10 text-purple-600 border-purple-200",
  course: "bg-blue-500/10 text-blue-600 border-blue-200",
  competition: "bg-rose-500/10 text-rose-600 border-rose-200",
};

export default function Opportunities() {
  const { t, language } = useLanguage();
  const { profile } = useProfile();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");

  const generateOpportunities = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-opportunities", {
        body: {
          major: profile?.target_university || "",
          goal: "Get into top university",
          country: "Global",
          language,
        },
      });

      if (error) throw error;
      if (data?.opportunities) {
        setOpportunities(data.opportunities);
        toast.success(t("opportunitiesGenerated"));
      }
    } catch (error: any) {
      console.error("Error generating opportunities:", error);
      toast.error(t("opportunitiesError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (opportunities.length === 0) {
      generateOpportunities();
    }
  }, []);

  const filteredOpportunities = opportunities.filter((opp) => {
    if (filterType !== "all" && opp.type !== filterType) return false;
    if (filterCountry !== "all" && !opp.country.toLowerCase().includes(filterCountry.toLowerCase())) return false;
    if (filterLevel !== "all" && opp.level !== filterLevel) return false;
    return true;
  });

  const uniqueCountries = [...new Set(opportunities.map((o) => o.country))];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t("opportunitiesTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("opportunitiesSubtitle")}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">{t("filters")}</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[120px] h-9 text-sm">
              <SelectValue placeholder={t("type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allTypes")}</SelectItem>
              <SelectItem value="olympiad">{t("olympiad")}</SelectItem>
              <SelectItem value="camp">{t("camp")}</SelectItem>
              <SelectItem value="research">{t("research")}</SelectItem>
              <SelectItem value="course">{t("course")}</SelectItem>
              <SelectItem value="competition">{t("competition")}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterLevel} onValueChange={setFilterLevel}>
            <SelectTrigger className="w-[130px] h-9 text-sm">
              <SelectValue placeholder={t("levelFilter")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allLevels")}</SelectItem>
              <SelectItem value="international">{t("international")}</SelectItem>
              <SelectItem value="national">{t("national")}</SelectItem>
              <SelectItem value="regional">{t("regional")}</SelectItem>
            </SelectContent>
          </Select>

          {uniqueCountries.length > 0 && (
            <Select value={filterCountry} onValueChange={setFilterCountry}>
              <SelectTrigger className="w-[130px] h-9 text-sm">
                <SelectValue placeholder={t("country")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCountries")}</SelectItem>
                {uniqueCountries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <p className="text-muted-foreground font-medium">{t("generatingOpportunities")}</p>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{t("noOpportunities")}</p>
            <Button onClick={generateOpportunities} className="gap-2">
              <Sparkles className="w-4 h-4" />
              {t("generateOpportunities")}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {filteredOpportunities.length} {t("opportunitiesFound")}
              </span>
              <Button variant="ghost" size="sm" onClick={generateOpportunities} className="gap-1 text-primary">
                <Sparkles className="w-3 h-3" />
                {t("refresh")}
              </Button>
            </div>

            {filteredOpportunities.map((opp) => {
              const Icon = typeIcons[opp.type] || Trophy;
              const colorClass = typeColors[opp.type] || typeColors.competition;

              return (
                <Card key={opp.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground leading-tight">{opp.name}</h3>
                        <a
                          href={opp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-primary" />
                        </a>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <Badge variant="outline" className={`text-xs ${colorClass}`}>
                          {t(opp.type)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {t(opp.level)}
                        </Badge>
                        {opp.free && (
                          <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-200">
                            {t("free")}
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{opp.description}</p>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {opp.deadline}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {opp.country}
                        </span>
                      </div>

                      <p className="text-xs text-primary/80 mt-2 font-medium">{opp.relevance}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
