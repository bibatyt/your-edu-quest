import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLandingLanguage, landingTranslations } from "@/hooks/useLandingLanguage";

export function FeedbackModal() {
  const { language } = useLandingLanguage();
  const t = landingTranslations[language];
  const { toast } = useToast();
  
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [review, setReview] = useState("");
  const [suggestions, setSuggestions] = useState("");

  const feedbackText = {
    ru: {
      title: "Ваш Отзыв о Qadam",
      buttonLabel: "Отзыв",
      nameLabel: "Ваше Имя",
      namePlaceholder: "Введите ваше имя",
      phoneLabel: "Телефон (опционально)",
      phonePlaceholder: "+7 (___) ___-__-__",
      reviewLabel: "Отзыв",
      reviewPlaceholder: "Расскажите о вашем опыте с Qadam...",
      suggestionsLabel: "Что стоит изменить? (опционально)",
      suggestionsPlaceholder: "Ваши предложения по улучшению...",
      submit: "Отправить Отзыв",
      sending: "Отправка...",
      successTitle: "Спасибо за ваш отзыв!",
      successDesc: "Мы ценим ваше мнение и обязательно его учтём.",
      errorTitle: "Ошибка при отправке",
      errorDesc: "Пожалуйста, попробуйте ещё раз.",
      fillRequired: "Пожалуйста, заполните обязательные поля",
    },
    en: {
      title: "Your Feedback on Qadam",
      buttonLabel: "Feedback",
      nameLabel: "Your Name",
      namePlaceholder: "Enter your name",
      phoneLabel: "Phone (optional)",
      phonePlaceholder: "+7 (___) ___-__-__",
      reviewLabel: "Review",
      reviewPlaceholder: "Tell us about your experience with Qadam...",
      suggestionsLabel: "What should we change? (optional)",
      suggestionsPlaceholder: "Your suggestions for improvement...",
      submit: "Submit Feedback",
      sending: "Sending...",
      successTitle: "Thank you for your feedback!",
      successDesc: "We appreciate your opinion and will take it into account.",
      errorTitle: "Error sending feedback",
      errorDesc: "Please try again.",
      fillRequired: "Please fill in the required fields",
    },
    kz: {
      title: "Qadam туралы пікіріңіз",
      buttonLabel: "Пікір",
      nameLabel: "Атыңыз",
      namePlaceholder: "Атыңызды енгізіңіз",
      phoneLabel: "Телефон (міндетті емес)",
      phonePlaceholder: "+7 (___) ___-__-__",
      reviewLabel: "Пікір",
      reviewPlaceholder: "Qadam-мен тәжірибеңіз туралы айтыңыз...",
      suggestionsLabel: "Нені өзгерту керек? (міндетті емес)",
      suggestionsPlaceholder: "Жақсарту бойынша ұсыныстарыңыз...",
      submit: "Пікірді жіберу",
      sending: "Жіберілуде...",
      successTitle: "Пікіріңіз үшін рахмет!",
      successDesc: "Біз сіздің пікіріңізді бағалаймыз.",
      errorTitle: "Жіберу қатесі",
      errorDesc: "Қайталап көріңіз.",
      fillRequired: "Міндетті өрістерді толтырыңыз",
    },
  };

  const text = feedbackText[language];

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !review.trim()) {
      toast({
        title: text.fillRequired,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await fetch("https://hook.eu1.make.com/8apuia9k3v1in0du3vhu8ics3rg3e1nv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || null,
          review: review.trim(),
          suggestions: suggestions.trim() || null,
          timestamp: new Date().toISOString(),
          language,
        }),
      });

      toast({
        title: text.successTitle,
        description: text.successDesc,
      });
      
      setName("");
      setPhone("");
      setReview("");
      setSuggestions("");
      setOpen(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: text.errorTitle,
        description: text.errorDesc,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
          <MessageSquare className="w-4 h-4" />
          {text.buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-sm border border-border/50 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{text.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitReview} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="feedback-name" className="text-sm font-medium">
              {text.nameLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="feedback-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={text.namePlaceholder}
              disabled={isLoading}
              className="bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedback-phone" className="text-sm font-medium">
              {text.phoneLabel}
            </Label>
            <Input
              id="feedback-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={text.phonePlaceholder}
              disabled={isLoading}
              className="bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedback-review" className="text-sm font-medium">
              {text.reviewLabel} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="feedback-review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder={text.reviewPlaceholder}
              disabled={isLoading}
              className="bg-background min-h-[100px] resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedback-suggestions" className="text-sm font-medium">
              {text.suggestionsLabel}
            </Label>
            <Textarea
              id="feedback-suggestions"
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              placeholder={text.suggestionsPlaceholder}
              disabled={isLoading}
              className="bg-background min-h-[80px] resize-none"
            />
          </div>
          
          <Button 
            type="submit" 
            size="sm"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? text.sending : text.submit}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
