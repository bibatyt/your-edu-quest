import {
  Header,
  HeroSection,
  FeaturesSection,
  ProcessSection,
  MentorSection,
  TestimonialsSection,
  FooterSection,
} from "@/features/landing";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ProcessSection />
        <MentorSection />
        <TestimonialsSection />
        <FooterSection />
      </main>
    </div>
  );
};

export default Landing;
