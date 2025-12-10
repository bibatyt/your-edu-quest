import { motion } from "framer-motion";
import { Star, MapPin, GraduationCap } from "lucide-react";
import { landingContent } from "../content";

export function SuccessStoriesSection() {
  const { successStories } = landingContent;

  const efcLabels: Record<string, string> = {
    low: "EFC Низкий",
    medium: "EFC Средний",
    high: "EFC Высокий"
  };

  const efcColors: Record<string, string> = {
    low: "bg-green-500/10 text-green-600",
    medium: "bg-amber-500/10 text-amber-600",
    high: "bg-blue-500/10 text-blue-600"
  };

  return (
    <section className="py-20 px-4">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
            {successStories.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {successStories.subtitle}
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
          {successStories.items.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="shrink-0 w-80 snap-center"
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm h-full"
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl">
                    {story.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{story.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {story.country}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${efcColors[story.efcSegment]}`}>
                    {efcLabels[story.efcSegment]}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-sm text-muted-foreground mb-4 italic">
                  "{story.text}"
                </p>

                {/* University info */}
                <div className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">{story.university}</span>
                  </div>
                  <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
                    {story.scholarship}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Scroll hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-4"
        >
          ← Свайпните для просмотра →
        </motion.p>
      </div>
    </section>
  );
}
