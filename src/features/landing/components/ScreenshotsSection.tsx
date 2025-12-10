import { motion } from "framer-motion";
import { 
  ClipboardList, Calculator, Route, GraduationCap, 
  Target, Smartphone 
} from "lucide-react";
import { landingContent } from "../content";

const iconMap: Record<string, React.ReactNode> = {
  wizard: <ClipboardList className="w-6 h-6" />,
  efc: <Calculator className="w-6 h-6" />,
  path: <Route className="w-6 h-6" />,
  universities: <GraduationCap className="w-6 h-6" />,
  step: <Target className="w-6 h-6" />,
};

const colorMap: Record<string, string> = {
  wizard: "from-blue-500/20 to-blue-600/10",
  efc: "from-green-500/20 to-green-600/10",
  path: "from-purple-500/20 to-purple-600/10",
  universities: "from-amber-500/20 to-amber-600/10",
  step: "from-primary/20 to-primary/10",
};

export function ScreenshotsSection() {
  const { screenshots } = landingContent;

  return (
    <section className="py-20 px-4 overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-4">
            <Smartphone className="w-4 h-4" />
            Мобильный интерфейс
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3">
            {screenshots.title}
          </h2>
        </motion.div>

        {/* Horizontal scroll */}
        <div className="relative">
          <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
            {screenshots.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="shrink-0 w-72 snap-center"
              >
                <div className={`
                  aspect-[9/16] rounded-3xl overflow-hidden 
                  bg-gradient-to-b ${colorMap[item.id]} 
                  border border-border/50 shadow-lg
                  relative group
                `}>
                  {/* Phone frame */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-background/80 rounded-full" />
                  
                  {/* Content placeholder */}
                  <div className="absolute inset-0 p-6 pt-12 flex flex-col">
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-16 h-16 rounded-2xl bg-card shadow-md flex items-center justify-center mb-4 text-primary"
                      >
                        {iconMap[item.id]}
                      </motion.div>
                      <h3 className="text-lg font-bold text-foreground text-center mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground text-center">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Fake UI elements */}
                    <div className="space-y-2 mt-auto">
                      <div className="h-3 bg-foreground/10 rounded w-full" />
                      <div className="h-3 bg-foreground/10 rounded w-4/5" />
                      <div className="h-10 bg-primary/20 rounded-xl mt-4" />
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Реальный интерфейс
                </p>
              </motion.div>
            ))}
          </div>

          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
