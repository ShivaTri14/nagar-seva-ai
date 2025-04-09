
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-municipal-light to-municipal-light/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
          <div className="lg:flex justify-center hidden">
            <div className="relative">
              <div className="absolute -inset-1 bg-municipal-primary/20 rounded-lg blur"></div>
              <div className="bg-white p-1 rounded-lg relative">
                <img 
                  src="https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace" 
                  alt="Prayagraj Municipal Corporation Building" 
                  className="rounded-lg object-cover h-[400px] w-[500px]"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-municipal-accent p-4 rounded-lg shadow-lg">
                <div className="text-municipal-dark font-bold text-xl">24/7</div>
                <div className="text-sm">Citizen Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
