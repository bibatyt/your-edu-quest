import { motion } from "framer-motion";
import { Shield, CheckCircle2 } from "lucide-react";
import { landingContent } from "../content";

export function EFCSection() {
  const { efc } = landingContent;

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Shield className="w-4 h-4" />
            EFC-Алгоритм
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
            {efc.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {efc.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* What is EFC */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {efc.points.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
                className="bg-card rounded-xl p-5 border border-border/50 flex gap-4"
              >
                <div className="text-3xl shrink-0">{point.icon}</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{point.title}</h3>
                  <p className="text-sm text-muted-foreground">{point.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Why trust us */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/10"
          >
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              {efc.trust.title}
            </h3>
            <div className="space-y-4">
              {efc.trust.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-sm text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>

            {/* Visual element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 bg-card/50 rounded-xl border border-border/30"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground">EFC Сегмент</span>
                <span className="text-xs font-bold text-primary">Автоматически</span>
              </div>
              <div className="flex gap-2">
                {['Низкий', 'Средний', 'Высокий'].map((seg, i) => (
                  <div 
                    key={seg}
                    className={`
                      flex-1 py-2 rounded-lg text-center text-xs font-medium
                      ${i === 0 ? 'bg-green-500/20 text-green-600' : 
                        i === 1 ? 'bg-amber-500/20 text-amber-600' : 
                        'bg-blue-500/20 text-blue-600'}
                    `}
                  >
                    {seg}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
