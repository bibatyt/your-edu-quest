import {
  Header,
  HeroSection,
  VideoDemoSection,
  ScreenshotsSection,
  AdvantagesSection,
  ProcessSection,
  EFCSection,
  SuccessStoriesSection,
  FooterSection,
} from "@/features/landing";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <VideoDemoSection />
        <ScreenshotsSection />
        <AdvantagesSection />
        <ProcessSection />
        <EFCSection />
        <SuccessStoriesSection />
        <FooterSection />
      </main>
    </div>
  );
};

export default Landing;
