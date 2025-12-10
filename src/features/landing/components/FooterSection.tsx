import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Mail, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { landingContent } from "../content";

export function FooterSection() {
  const { footer } = landingContent;

  return (
    <>
      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-br from-card to-card/80 rounded-3xl p-8 sm:p-12 border border-border/50 shadow-xl relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
            />
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <span className="text-3xl">🚀</span>
              </motion.div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-4">
                {footer.cta.title}
              </h2>
              <p className="text-base text-muted-foreground mb-8 max-w-md mx-auto">
                {footer.cta.subtitle}
              </p>
              <Link to="/onboarding">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="h-14 px-10 text-lg font-bold group"
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
      <footer className="py-10 px-4 border-t border-border bg-card/50">
        <div className="container max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-black text-lg">Q</span>
              </div>
              <div>
                <span className="font-bold text-foreground text-lg">Qadam AI</span>
                <p className="text-xs text-muted-foreground">Твой путь к поступлению</p>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:hello@qadam.ai"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm">
            <Link to="/onboarding" className="text-muted-foreground hover:text-foreground transition-colors">
              Начать
            </Link>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              Как это работает
            </a>
            <a href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">
              Демо
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Политика конфиденциальности
            </a>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            {footer.copyright}
          </div>
        </div>
      </footer>
    </>
  );
}
