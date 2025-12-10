import { motion } from "framer-motion";
import { RESIDENCE_COUNTRIES, INCOME_RANGES, BUDGET_RANGES } from "../types";

interface EFCStepProps {
  residenceCountry: string;
  incomeRange: string;
  budgetRange: string;
  onResidenceSelect: (country: string) => void;
  onIncomeSelect: (range: string) => void;
  onBudgetSelect: (range: string) => void;
  language: 'ru' | 'en' | 'kk';
}

export function EFCStep({ 
  residenceCountry, 
  incomeRange, 
  budgetRange,
  onResidenceSelect, 
  onIncomeSelect, 
  onBudgetSelect,
  language 
}: EFCStepProps) {
  const titles = {
    ru: 'Финансовая информация',
    en: 'Financial Information',
    kk: 'Қаржылық ақпарат'
  };

  const subtitles = {
    ru: 'Это поможет подобрать лучшие гранты и стипендии',
    en: 'This will help find the best grants and scholarships',
    kk: 'Бұл үздік гранттар мен стипендияларды табуға көмектеседі'
  };

  const labels = {
    residence: {
      ru: 'Страна проживания',
      en: 'Country of residence',
      kk: 'Тұратын ел'
    },
    income: {
      ru: 'Годовой доход семьи',
      en: 'Annual family income',
      kk: 'Отбасының жылдық табысы'
    },
    budget: {
      ru: 'Бюджет на обучение (в год)',
      en: 'Education budget (per year)',
      kk: 'Білім алуға бюджет (жылына)'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="py-4"
    >
      <div className="text-center mb-8">
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

      <div className="space-y-6">
        {/* Residence Country */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-bold text-foreground mb-3">
            {labels.residence[language]}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {RESIDENCE_COUNTRIES.map((country) => (
              <button
                key={country.id}
                onClick={() => onResidenceSelect(country.id)}
                className={`
                  p-3 rounded-xl border-2 text-left transition-all duration-200 text-sm
                  ${residenceCountry === country.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                {country.label[language]}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Income Range */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-bold text-foreground mb-3">
            {labels.income[language]}
          </label>
          <div className="space-y-2">
            {INCOME_RANGES.map((range) => (
              <button
                key={range.id}
                onClick={() => onIncomeSelect(range.id)}
                className={`
                  w-full p-4 rounded-xl border-2 text-left transition-all duration-200
                  ${incomeRange === range.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">{range.label[language]}</span>
                  <span className="text-xs text-muted-foreground">{range.description[language]}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Budget Range */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-bold text-foreground mb-3">
            {labels.budget[language]}
          </label>
          <div className="space-y-2">
            {BUDGET_RANGES.map((range) => (
              <button
                key={range.id}
                onClick={() => onBudgetSelect(range.id)}
                className={`
                  w-full p-4 rounded-xl border-2 text-left transition-all duration-200
                  ${budgetRange === range.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">{range.label[language]}</span>
                  <span className="text-xs text-muted-foreground">{range.description[language]}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}