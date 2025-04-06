
import { Brain, MessageSquareText, Image, Map, PieChart, AlertCircle } from "lucide-react";

const AIFeatures = () => {
  const features = [
    {
      icon: MessageSquareText,
      title: "24/7 AI Chat Support",
      description: "Get instant responses to your queries about municipal services anytime",
    },
    {
      icon: Image,
      title: "Issue Detection",
      description: "Upload photos of civic issues for AI-powered identification and faster resolution",
    },
    {
      icon: Map,
      title: "Location Analysis",
      description: "AI automatically identifies affected areas and routes complaints to relevant departments",
    },
    {
      icon: PieChart,
      title: "Smart Analytics",
      description: "Data-driven insights help us optimize municipal services based on trends",
    },
    {
      icon: AlertCircle,
      title: "Proactive Notifications",
      description: "Get timely updates about your area including water outages and road works",
    },
    {
      icon: Brain,
      title: "Smart Recommendations",
      description: "Receive personalized guidance on waste management, water conservation, and more",
    },
  ];

  return (
    <section className="py-16 bg-municipal-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">AI-Powered Civic Solutions</h2>
          <p className="section-subheading max-w-2xl mx-auto">
            Experience the future of municipal services with our integrated AI technologies
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-municipal-primary/10 rounded-lg flex items-center justify-center mb-4 text-municipal-primary">
                <feature.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-municipal-dark mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIFeatures;
