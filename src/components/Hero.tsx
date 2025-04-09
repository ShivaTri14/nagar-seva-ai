
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-municipal-light to-municipal-light/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-block bg-municipal-accent/20 text-municipal-dark px-4 py-1 rounded-full font-medium text-sm">
              Smart City Initiative
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-municipal-dark">
              Welcome to <span className="text-municipal-primary">Prayagraj</span> Municipal Corporation
            </h1>
            <p className="text-lg text-gray-700 max-w-lg">
              Empowering citizens with simplified access to municipal services, 
              faster complaint resolution, and AI-powered assistance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-municipal-primary hover:bg-municipal-primary/90 text-white">
                <Link to="/services">
                  Explore Services
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-municipal-primary text-municipal-primary hover:bg-municipal-primary/10">
                <Link to="/complaints">
                  File Complaint
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
