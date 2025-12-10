import { motion } from "framer-motion";
import { Play, CheckCircle2 } from "lucide-react";
import { landingContent } from "../content";

export function VideoDemoSection() {
  const { videoDemo } = landingContent;

  const demoSteps = [
    "Ответ на вопросы Wizard",
    "Генерация персонального пути",
    "Рекомендации ВУЗов и грантов",
    "Истории успеха похожих студентов"
  ];

  return (
    <section id="demo" className="py-20 px-4 bg-muted/30">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
            {videoDemo.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {videoDemo.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Video placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-3 relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl overflow-hidden border border-border/50 shadow-xl"
          >
            <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-lg"
              >
                <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
              </motion.button>
            </div>
            
            {/* Fake video preview elements */}
            <div className="absolute inset-0 p-6 pointer-events-none">
              <div className="h-full flex flex-col justify-between opacity-40">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-foreground/20 rounded w-3/4" />
                  <div className="h-2 bg-foreground/20 rounded w-1/2" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Steps list */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            <h3 className="text-xl font-bold text-foreground mb-6">
              Что вы увидите в демо:
            </h3>
            {demoSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border/50"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{step}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
