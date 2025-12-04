import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useProfile } from "./useProfile";

type Language = "ru" | "en" | "kk";

interface Translations {
  [key: string]: {
    ru: string;
    en: string;
    kk: string;
  };
}

const translations: Translations = {
  // Navigation
  home: { ru: "Главная", en: "Home", kk: "Басты" },
  path: { ru: "Путь", en: "Path", kk: "Жол" },
  ai: { ru: "AI", en: "AI", kk: "AI" },
  statistics: { ru: "Статистика", en: "Stats", kk: "Статистика" },
  settings: { ru: "Настройки", en: "Settings", kk: "Баптаулар" },
  
  // Dashboard
  welcomeBack: { ru: "С возвращением", en: "Welcome back", kk: "Қайта оралуыңызбен" },
  readyToConquer: { ru: "Готов покорять университеты?", en: "Ready to conquer universities?", kk: "Университеттерді бағындыруға дайынсыз ба?" },
  level: { ru: "Уровень", en: "Level", kk: "Деңгей" },
  newbie: { ru: "Новичок", en: "Newbie", kk: "Жаңадан бастаушы" },
  xpToLevel: { ru: "XP до Lvl", en: "XP to Lvl", kk: "XP Lvl дейін" },
  days: { ru: "дн.", en: "days", kk: "күн" },
  onFire: { ru: "В огне!", en: "On fire!", kk: "Отты!" },
  goal: { ru: "ЦЕЛЬ", en: "GOAL", kk: "МАҚСАТ" },
  setGoal: { ru: "Поставить цель", en: "Set a goal", kk: "Мақсат қою" },
  dailyQuests: { ru: "Ежедневные задания", en: "Daily Quests", kk: "Күнделікті тапсырмалар" },
  wisdomOfDay: { ru: "МУДРОСТЬ ДНЯ", en: "WISDOM OF THE DAY", kk: "КҮННІҢ ДАНАЛЫҒЫ" },
  
  // Settings
  profile: { ru: "Профиль", en: "Profile", kk: "Профиль" },
  upload: { ru: "Загрузить", en: "Upload", kk: "Жүктеу" },
  random: { ru: "Случайно", en: "Random", kk: "Кездейсоқ" },
  name: { ru: "Имя", en: "Name", kk: "Аты" },
  yourName: { ru: "Ваше имя", en: "Your name", kk: "Сіздің атыңыз" },
  save: { ru: "Сохранить", en: "Save", kk: "Сақтау" },
  language: { ru: "Язык", en: "Language", kk: "Тіл" },
  testResults: { ru: "Результаты тестов", en: "Test Results", kk: "Тест нәтижелері" },
  saveResults: { ru: "Сохранить результаты", en: "Save Results", kk: "Нәтижелерді сақтау" },
  logout: { ru: "Выйти", en: "Log out", kk: "Шығу" },
  settingsSaved: { ru: "Настройки сохранены!", en: "Settings saved!", kk: "Баптаулар сақталды!" },
  errorSaving: { ru: "Ошибка при сохранении", en: "Error saving", kk: "Сақтау қатесі" },
  languageChanged: { ru: "Язык изменён", en: "Language changed", kk: "Тіл өзгертілді" },
  resultsSaved: { ru: "Результаты сохранены!", en: "Results saved!", kk: "Нәтижелер сақталды!" },
  loggedOut: { ru: "Вы вышли из аккаунта", en: "Logged out", kk: "Сіз аккаунттан шықтыңыз" },
  satError: { ru: "SAT должен быть от 400 до 1600", en: "SAT must be between 400 and 1600", kk: "SAT 400-ден 1600-ге дейін болуы керек" },
  ieltsError: { ru: "IELTS должен быть от 1 до 9", en: "IELTS must be between 1 and 9", kk: "IELTS 1-ден 9-ға дейін болуы керек" },
  avatarUpdated: { ru: "Аватар обновлён!", en: "Avatar updated!", kk: "Аватар жаңартылды!" },
  avatarError: { ru: "Ошибка загрузки аватара", en: "Error uploading avatar", kk: "Аватар жүктеу қатесі" },
  
  // Wisdom quotes
  wisdom1: { 
    ru: "Не просто учись. Покоряй знания, покоряй мир!", 
    en: "Don't just learn. Conquer knowledge, conquer the world!", 
    kk: "Жай ғана оқыма. Білімді баулы, әлемді баулы!" 
  },
  wisdom2: { 
    ru: "Образование — это не подготовка к жизни; образование — это сама жизнь.", 
    en: "Education is not preparation for life; education is life itself.", 
    kk: "Білім — бұл өмірге дайындық емес; білім — бұл өмірдің өзі." 
  },
  wisdom3: { 
    ru: "Будущее принадлежит тем, кто верит в красоту своей мечты.", 
    en: "The future belongs to those who believe in the beauty of their dreams.", 
    kk: "Болашақ арманының сұлулығына сенетіндердікі." 
  },
  wisdom4: { 
    ru: "Единственный способ делать великую работу — любить то, что вы делаете.", 
    en: "The only way to do great work is to love what you do.", 
    kk: "Керемет жұмыс істеудің жалғыз жолы — істеп жатқан нәрсені жақсы көру." 
  },

  // Statistics
  xpLast7Days: { ru: "XP за последние 7 дней", en: "XP for last 7 days", kk: "Соңғы 7 күндегі XP" },
  totalXPEarned: { ru: "Всего XP заработано", en: "Total XP earned", kk: "Барлығы XP жинады" },
  startQuests: { ru: "Начните выполнять задания", en: "Start completing quests", kk: "Тапсырмаларды орындай бастаңыз" },
  toSeeProgress: { ru: "чтобы увидеть прогресс", en: "to see progress", kk: "прогресті көру үшін" },
  outOf1600: { ru: "Из 1600", en: "Out of 1600", kk: "1600-ден" },
  outOf9: { ru: "Из 9.0", en: "Out of 9.0", kk: "9.0-дан" },
  addInSettings: { ru: "Добавьте в настройках", en: "Add in settings", kk: "Баптауларда қосыңыз" },
  overallStats: { ru: "Общая статистика", en: "Overall Statistics", kk: "Жалпы статистика" },
  totalXP: { ru: "Всего XP", en: "Total XP", kk: "Барлық XP" },
  dayStreak: { ru: "Дн. серия", en: "Day streak", kk: "Күн сериясы" },
  addTestResults: { ru: "Добавьте свои результаты тестов в настройках", en: "Add your test results in settings", kk: "Тест нәтижелерін баптауларда қосыңыз" },
  addResults: { ru: "Добавить результаты", en: "Add results", kk: "Нәтижелерді қосу" },
  activity: { ru: "Активность", en: "Activity", kk: "Белсенділік" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { profile, updateProfile } = useProfile();
  const [language, setLanguageState] = useState<Language>("ru");

  useEffect(() => {
    if (profile?.language) {
      setLanguageState(profile.language as Language);
    }
  }, [profile?.language]);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    if (profile) {
      await updateProfile({ language: lang });
    }
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.ru || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
