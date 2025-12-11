import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";
import { landingContent } from "../content";

// Import real screenshots
import wizardImg from "@/assets/screenshots/wizard.png";
import essayImg from "@/assets/screenshots/essay.png";
import aiMentorImg from "@/assets/screenshots/ai-mentor.png";
import pathImg from "@/assets/screenshots/path.png";
import aiPlanImg from "@/assets/screenshots/ai-plan.png";
import academicImg from "@/assets/screenshots/academic.png";
import financialImg from "@/assets/screenshots/financial.png";

const screenshotImages: Record<string, string> = {
  wizard: wizardImg,
  efc: financialImg,
  path: pathImg,
  universities: academicImg,
  step: aiPlanImg,
  essay: essayImg,
  aiMentor: aiMentorImg,
};

const screenshots = [
  { id: "wizard", title: "Шаги Wizard", description: "6 простых вопросов", image: wizardImg },
  { id: "academic", title: "Academic Info", description: "SAT, IELTS, GPA", image: academicImg },
  { id: "financial", title: "Financial Info", description: "Гранты и стипендии", image: financialImg },
  { id: "aiPlan", title: "AI Анализ", description: "Создание плана", image: aiPlanImg },
  { id: "path", title: "My Path", description: "Персональный план", image: pathImg },
  { id: "essay", title: "Essay Engine", description: "Impact Score", image: essayImg },
  { id: "aiMentor", title: "AI Mentor", description: "Всегда на связи", image: aiMentorImg },
];

export function ScreenshotsSection() {
  const { screenshots: screenshotsContent } = landingContent;

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
            {screenshotsContent.title}
          </h2>
        </motion.div>

        {/* Horizontal scroll */}
        <div className="relative">
          <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
            {screenshots.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="shrink-0 w-64 snap-center"
              >
                <div className="aspect-[9/18] rounded-3xl overflow-hidden border border-border/50 shadow-xl bg-card relative group">
                  {/* Phone notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-foreground/10 rounded-full z-10" />
                  
                  {/* Screenshot image */}
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover object-top"
                  />
                  
                  {/* Gradient overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/90 to-transparent" />
                </div>
                
                <div className="text-center mt-3">
                  <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-16 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-16 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
