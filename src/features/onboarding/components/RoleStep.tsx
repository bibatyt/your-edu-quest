import { motion } from "framer-motion";
import { ROLES } from "../types";

interface RoleStepProps {
  selectedRole: string;
  onSelect: (role: string) => void;
  language: 'ru' | 'en' | 'kk';
}

export function RoleStep({ selectedRole, onSelect, language }: RoleStepProps) {
  const titles = {
    ru: 'Кем вы являетесь?',
    en: 'Who are you?',
    kk: 'Сіз кімсіз?'
  };

  const subtitles = {
    ru: 'Это поможет нам персонализировать ваш путь',
    en: 'This will help us personalize your path',
    kk: 'Бұл біздің жолыңызды жекелендіруге көмектеседі'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="py-6"
    >
      <div className="text-center mb-10">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-black text-foreground mb-3"
        >
          {titles[language]}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg"
        >
          {subtitles[language]}
        </motion.p>
      </div>

      <div className="space-y-4">
        {ROLES.map((role, index) => (
          <motion.button
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            onClick={() => onSelect(role.id)}
            className={`
              w-full p-6 rounded-2xl border-2 text-left transition-all duration-200
              ${selectedRole === role.id 
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }
            `}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{role.icon}</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {role.label[language]}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {role.description[language]}
                </p>
              </div>
              <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                ${selectedRole === role.id 
                  ? 'border-primary bg-primary' 
                  : 'border-muted-foreground/30'
                }
              `}>
                {selectedRole === role.id && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2.5 h-2.5 bg-primary-foreground rounded-full"
                  />
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}