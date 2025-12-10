import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { landingContent } from "../content";

export function FooterSection() {
  const { footer } = landingContent;

  return (
    <>
      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center bg-card rounded-[2rem] p-10 sm:p-16 border border-border/50 shadow-lg relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4">
                {footer.cta.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                {footer.cta.subtitle}
              </p>
              <Link to="/onboarding">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="h-14 px-10 text-lg font-bold group shadow-primary"
                >
                  {footer.cta.button}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-border">
        <div className="container max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-black text-sm">Q</span>
              </div>
              <span className="font-bold text-foreground">Qadam AI</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Условия использования
              </a>
              <a href="mailto:hello@qadam.ai" className="text-muted-foreground hover:text-foreground transition-colors">
                Контакты
              </a>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            {footer.copyright}
          </div>
        </div>
      </footer>
    </>
  );
}
