
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import ComplaintOverview from "@/components/ComplaintOverview";
import QuickLinks from "@/components/QuickLinks";
import AIFeatures from "@/components/AIFeatures";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Prayagraj Municipal Corporation | Smart Civic Hub</title>
        <meta name="description" content="Official website of Prayagraj Municipal Corporation. Access civic services, file complaints, and get AI assistance for all your municipal needs." />
      </Helmet>
      
      <Navbar />
      <Hero />
      <QuickLinks />
      <ServicesSection />
      <ComplaintOverview />
      <AIFeatures />
      <Footer />
      <AIChatbot />
    </>
  );
};

export default Index;
