
import { FileText, Droplet, Trash2, Map, FileCheck, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: "Certificates & Documents",
      description: "Birth, death, and property certificates",
      icon: FileText,
      path: "/services/certificates",
      color: "bg-blue-100 text-blue-700",
    },
    {
      id: 2,
      title: "Water & Drainage",
      description: "Water supply and drainage issues",
      icon: Droplet,
      path: "/services/water",
      color: "bg-cyan-100 text-cyan-700",
    },
    {
      id: 3,
      title: "Waste Management",
      description: "Garbage collection and disposal",
      icon: Trash2,
      path: "/services/waste",
      color: "bg-green-100 text-green-700",
    },
    {
      id: 4,
      title: "Roads & Infrastructure",
      description: "Road repairs and street lighting",
      icon: Map,
      path: "/services/infrastructure",
      color: "bg-amber-100 text-amber-700",
    },
    {
      id: 5,
      title: "Permits & Licenses",
      description: "Building and business permits",
      icon: FileCheck,
      path: "/services/permits",
      color: "bg-purple-100 text-purple-700",
    },
    {
      id: 6,
      title: "Emergency Services",
      description: "Emergency response and assistance",
      icon: AlertTriangle,
      path: "/services/emergency",
      color: "bg-red-100 text-red-700",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">Our Municipal Services</h2>
          <p className="section-subheading max-w-2xl mx-auto">
            Access essential services and report issues easily through our integrated platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {services.map((service) => (
            <Link to={service.path} key={service.id} className="card-hover">
              <div className="border border-gray-200 rounded-lg p-6 bg-white h-full">
                <div className={`w-14 h-14 rounded-lg ${service.color} flex items-center justify-center mb-4`}>
                  <service.icon size={28} />
                </div>
                <h3 className="font-bold text-xl text-municipal-dark mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
