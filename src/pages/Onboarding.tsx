import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  StepIndicator,
  GoalStep,
  ProfileStep,
  AuthStep,
  AnalyzingAnimation,
  RoleStep,
  EFCStep,
  TOP_UNIVERSITIES,
  calculateEFCSegment,
  type OnboardingStep,
  type IncomeRange,
  type BudgetRange,
} from "@/features/onboarding";

const Onboarding = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const [step, setStep] = useState<OnboardingStep>(1);
  const [showAnalyzing, setShowAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [role, setRole] = useState("");
  const [goal, setGoal] = useState("");
  const [residenceCountry, setResidenceCountry] = useState("");
  const [incomeRange, setIncomeRange] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [grade, setGrade] = useState("");
  const [country, setCountry] = useState("");
  const [universities, setUniversities] = useState<string[]>([]);
  
  // Language
  const language = 'ru' as const;

  const canProceed = () => {
    if (step === 1) return !!role;
    if (step === 2) return !!goal;
    if (step === 3) return !!residenceCountry && !!incomeRange && !!budgetRange;
    if (step === 4) return !!grade && !!country;
    return true;
  };

  const handleNext = () => {
    if (step < 5) {
      setStep((step + 1) as OnboardingStep);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as OnboardingStep);
    }
  };

  const handleAuthSubmit = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const { error } = await signUp(email, password, name);
      
      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Этот email уже зарегистрирован");
        } else {
          toast.error(error.message);
        }
        setLoading(false);
        return;
      }

      // Save onboarding data
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Calculate EFC segment
        const efcSegment = calculateEFCSegment(
          incomeRange as IncomeRange, 
          budgetRange as BudgetRange
        );

        // Save EFC data
        await supabase.from('user_efc_data').insert({
          user_id: user.id,
          role: role,
          residence_country: residenceCountry,
          income_range: incomeRange,
          budget_range: budgetRange,
          efc_segment: efcSegment,
        });

        // Get university names for display
        const selectedUniNames = universities
          .map(id => TOP_UNIVERSITIES.find(u => u.id === id)?.name)
          .filter(Boolean)
          .join(', ');

        // Save roadmap data
        await supabase.from('roadmaps').insert({
          user_id: user.id,
          main_goal: goal,
          current_grade: grade,
          target_country: country,
          desired_major: '',
        });
        
        // Update profile with target universities
        await supabase.from('profiles').update({
          target_university: selectedUniNames || country
        }).eq('user_id', user.id);
      }

      // Show analyzing animation
      setShowAnalyzing(true);
      
    } catch (error) {
      toast.error("Произошла ошибка. Попробуйте снова.");
      setLoading(false);
    }
  };

  const handleAnalyzingComplete = () => {
    toast.success("Добро пожаловать! Твой персональный путь готов.");
    navigate("/dashboard", { replace: true });
  };

  if (showAnalyzing) {
    return (
      <AnalyzingAnimation 
        onComplete={handleAnalyzingComplete}
        language={language}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        {step > 1 ? (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-muted-foreground" />
          </motion.button>
        ) : (
          <div className="w-10" />
        )}
        
        <StepIndicator currentStep={step} totalSteps={5} />
        
        <div className="w-10" />
      </header>

      {/* Content */}
      <main className="flex-1 px-6 pb-6 flex flex-col overflow-hidden">
        <div className="flex-1 max-w-lg mx-auto w-full overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <RoleStep
                key="role"
                selectedRole={role}
                onSelect={setRole}
                language={language}
              />
            )}
            {step === 2 && (
              <GoalStep
                key="goal"
                selectedGoal={goal}
                onSelect={setGoal}
                language={language}
              />
            )}
            {step === 3 && (
              <EFCStep
                key="efc"
                residenceCountry={residenceCountry}
                incomeRange={incomeRange}
                budgetRange={budgetRange}
                onResidenceSelect={setResidenceCountry}
                onIncomeSelect={setIncomeRange}
                onBudgetSelect={setBudgetRange}
                language={language}
              />
            )}
            {step === 4 && (
              <ProfileStep
                key="profile"
                grade={grade}
                country={country}
                universities={universities}
                onGradeSelect={setGrade}
                onCountrySelect={setCountry}
                onUniversitiesChange={setUniversities}
                language={language}
              />
            )}
            {step === 5 && (
              <AuthStep
                key="auth"
                onSubmit={handleAuthSubmit}
                loading={loading}
                language={language}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Button (only for steps 1-4) */}
        {step < 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 max-w-lg mx-auto w-full shrink-0"
          >
            <Button
              variant="hero"
              size="lg"
              className="w-full h-14 text-lg"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {language === 'ru' ? 'Продолжить' :
               language === 'kk' ? 'Жалғастыру' :
               'Continue'}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Onboarding;