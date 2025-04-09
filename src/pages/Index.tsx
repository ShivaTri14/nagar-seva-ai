
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import ComplaintOverview from "@/components/ComplaintOverview";
import QuickLinks from "@/components/QuickLinks";
import AIFeatures from "@/components/AIFeatures";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import FloatingThemeToggle from "@/components/FloatingThemeToggle";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Prayagraj Municipal Corporation | Smart Civic Hub</title>
        <meta name="description" content="Official website of Prayagraj Municipal Corporation. Access civic services, file complaints, and get AI assistance for all your municipal needs." />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navbar />
        <Breadcrumbs />
        <Hero />
        <QuickLinks />
        <ServicesSection />
        <ComplaintOverview />
        <AIFeatures />
        <FAQSection />
        <Footer />
        <FloatingThemeToggle />
        <AIChatbot />
      </div>
    </>
  );
};

export default Index;
