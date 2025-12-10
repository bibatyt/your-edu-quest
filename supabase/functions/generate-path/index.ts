import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PathRequest {
  role: 'student' | 'parent';
  efcSegment: 'low' | 'medium' | 'high';
  targetCountry: string;
  currentGrade: string;
  mainGoal: string;
  targetUniversities: string[];
}

interface Milestone {
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  order_index: number;
  efc_specific: boolean;
  metadata: Record<string, any>;
}

// Base milestones for students
function getStudentBaseMilestones(targetCountry: string, currentGrade: string): Milestone[] {
  const milestones: Milestone[] = [
    {
      title: "Составить список целевых университетов",
      description: "Выбери 8-12 университетов: 3-4 reach, 4-5 target, 2-3 safety",
      category: "general",
      priority: "high",
      order_index: 1,
      efc_specific: false,
      metadata: { country: targetCountry }
    },
    {
      title: "Начать подготовку к стандартизированным тестам",
      description: targetCountry === 'usa' ? "SAT/ACT подготовка" : targetCountry === 'uk' ? "IELTS подготовка" : "Подготовка к экзаменам",
      category: "exam",
      priority: "high",
      order_index: 2,
      efc_specific: false,
      metadata: {}
    },
    {
      title: "Создать список внеклассных активностей",
      description: "Задокументируй все твои достижения, проекты и волонтёрство",
      category: "application",
      priority: "medium",
      order_index: 3,
      efc_specific: false,
      metadata: {}
    },
    {
      title: "Начать работу над Personal Statement",
      description: "Напиши первый черновик главного эссе",
      category: "essay",
      priority: "high",
      order_index: 4,
      efc_specific: false,
      metadata: {}
    },
    {
      title: "Выбрать учителей для рекомендаций",
      description: "Попроси 2-3 учителей написать recommendation letters",
      category: "document",
      priority: "medium",
      order_index: 5,
      efc_specific: false,
      metadata: {}
    },
  ];

  // Add grade-specific milestones
  if (currentGrade === '11' || currentGrade === '10') {
    milestones.push({
      title: "Улучшить GPA в текущем семестре",
      description: "Сфокусируйся на предметах, важных для твоей специальности",
      category: "general",
      priority: "high",
      order_index: 6,
      efc_specific: false,
      metadata: {}
    });
  }

  return milestones;
}

// EFC-specific milestones for LOW segment
function getLowEFCMilestones(targetCountry: string): Milestone[] {
  const milestones: Milestone[] = [
    {
      title: "Составить список Need-Blind университетов",
      description: "Harvard, Yale, MIT, Princeton, Amherst и другие не учитывают финансы при приёме",
      category: "financial",
      priority: "high",
      order_index: 10,
      efc_specific: true,
      metadata: { efcType: 'need-blind' }
    },
    {
      title: "Заполнить CSS Profile",
      description: "Обязательная форма для финансовой помощи в большинстве топовых университетов США",
      category: "financial",
      priority: "high",
      order_index: 11,
      efc_specific: true,
      metadata: {}
    },
    {
      title: "Заполнить FAFSA",
      description: "Федеральная форма для финансовой помощи в США",
      category: "financial",
      priority: "high",
      order_index: 12,
      efc_specific: true,
      metadata: {}
    },
    {
      title: "Найти внешние стипендии",
      description: "Поищи стипендии вне университетов: Bolashak, DAAD, Fulbright и другие",
      category: "financial",
      priority: "medium",
      order_index: 13,
      efc_specific: true,
      metadata: {}
    },
  ];

  if (targetCountry === 'eu') {
    milestones.push({
      title: "Исследовать бесплатное образование в Европе",
      description: "Германия, Норвегия, Финляндия предлагают бесплатное или дешёвое образование",
      category: "financial",
      priority: "high",
      order_index: 14,
      efc_specific: true,
      metadata: {}
    });
  }

  return milestones;
}

// EFC-specific milestones for MEDIUM segment
function getMediumEFCMilestones(): Milestone[] {
  return [
    {
      title: "Составить комбинированную стратегию финансирования",
      description: "Комбинируй Need-based и Merit-based стипендии для оптимального покрытия",
      category: "financial",
      priority: "high",
      order_index: 10,
      efc_specific: true,
      metadata: {}
    },
    {
      title: "Найти Merit-based стипендии",
      description: "Многие университеты дают стипендии за академические достижения",
      category: "financial",
      priority: "medium",
      order_index: 11,
      efc_specific: true,
      metadata: {}
    },
    {
      title: "Рассмотреть Early Decision с финансовой помощью",
      description: "Некоторые университеты дают больше помощи для ED кандидатов",
      category: "application",
      priority: "medium",
      order_index: 12,
      efc_specific: true,
      metadata: {}
    },
  ];
}

// EFC-specific milestones for HIGH segment
function getHighEFCMilestones(): Milestone[] {
  return [
    {
      title: "Сфокусироваться на Merit-based стипендиях",
      description: "Подавайся на стипендии за академические и внеклассные достижения",
      category: "financial",
      priority: "medium",
      order_index: 10,
      efc_specific: true,
      metadata: {}
    },
    {
      title: "Рассмотреть Early Decision стратегию",
      description: "ED значительно увеличивает шансы поступления в топовые университеты",
      category: "application",
      priority: "high",
      order_index: 11,
      efc_specific: true,
      metadata: {}
    },
    {
      title: "Исследовать престижные программы",
      description: "Honors programs, dual degrees и специальные треки в топовых университетах",
      category: "general",
      priority: "medium",
      order_index: 12,
      efc_specific: true,
      metadata: {}
    },
  ];
}

// Parent-specific milestones
function getParentMilestones(efcSegment: string): Milestone[] {
  const milestones: Milestone[] = [
    {
      title: "Создать финансовый план на образование",
      description: "Оцените общую стоимость и составьте план покрытия расходов",
      category: "financial",
      priority: "high",
      order_index: 1,
      efc_specific: false,
      metadata: {}
    },
    {
      title: "Настроить трекинг дедлайнов",
      description: "Создайте общий календарь дедлайнов с ребёнком",
      category: "general",
      priority: "high",
      order_index: 2,
      efc_specific: false,
      metadata: {}
    },
    {
      title: "Подготовить финансовые документы",
      description: "Соберите налоговые декларации, справки о доходах и активах",
      category: "document",
      priority: "high",
      order_index: 3,
      efc_specific: false,
      metadata: {}
    },
    {
      title: "Установить регулярные check-in с ребёнком",
      description: "Еженедельно обсуждайте прогресс и помогайте с организацией",
      category: "general",
      priority: "medium",
      order_index: 4,
      efc_specific: false,
      metadata: {}
    },
  ];

  if (efcSegment === 'low') {
    milestones.push({
      title: "Изучить все варианты финансовой помощи",
      description: "Need-based гранты, государственные программы, кредиты на образование",
      category: "financial",
      priority: "high",
      order_index: 5,
      efc_specific: true,
      metadata: {}
    });
  }

  return milestones;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { role, efcSegment, targetCountry, currentGrade, mainGoal, targetUniversities }: PathRequest = await req.json();

    let milestones: Milestone[] = [];

    if (role === 'student') {
      // Add base milestones
      milestones = getStudentBaseMilestones(targetCountry, currentGrade);

      // Add EFC-specific milestones
      switch (efcSegment) {
        case 'low':
          milestones = [...milestones, ...getLowEFCMilestones(targetCountry)];
          break;
        case 'medium':
          milestones = [...milestones, ...getMediumEFCMilestones()];
          break;
        case 'high':
          milestones = [...milestones, ...getHighEFCMilestones()];
          break;
      }
    } else {
      // Parent path
      milestones = getParentMilestones(efcSegment);
    }

    // Sort by order_index
    milestones.sort((a, b) => a.order_index - b.order_index);

    // Generate EFC explanation
    let efcExplanation = '';
    if (efcSegment === 'low') {
      efcExplanation = `Этот путь оптимизирован под максимальные стипендии и гранты, т.к. ваш EFC — низкий. Мы фокусируемся на Need-Blind университетах и полной финансовой помощи.`;
    } else if (efcSegment === 'medium') {
      efcExplanation = `Ваш путь включает комбинацию Need-based и Merit-based стратегий для оптимального покрытия стоимости обучения.`;
    } else {
      efcExplanation = `Ваш путь сфокусирован на академических достижениях и Merit-based стипендиях для поступления в престижные программы.`;
    }

    return new Response(
      JSON.stringify({ 
        milestones,
        efcExplanation,
        efcSegment,
        role
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating path:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});