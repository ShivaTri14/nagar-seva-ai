
import { Calendar, Download, CreditCard, HelpCircle, Bell, Users } from "lucide-react";
import { Link } from "react-router-dom";

const QuickLinks = () => {
  const links = [
    {
      icon: Calendar,
      text: "Events & Announcements",
      path: "/events",
      color: "bg-blue-500",
    },
    {
      icon: Download,
      text: "Forms & Downloads",
      path: "/downloads",
      color: "bg-green-500",
    },
    {
      icon: CreditCard,
      text: "Pay Municipal Taxes",
      path: "/payments",
      color: "bg-amber-500",
    },
    {
      icon: HelpCircle,
      text: "FAQ & Help",
      path: "/help",
      color: "bg-purple-500",
    },
    {
      icon: Bell,
      text: "Notifications",
      path: "/notifications",
      color: "bg-pink-500",
    },
    {
      icon: Users,
      text: "Public Forums",
      path: "/forums",
      color: "bg-cyan-500",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-heading text-center">Quick Access</h2>
        <p className="section-subheading text-center max-w-2xl mx-auto">
          Navigate to frequently used services and important information
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-8 animate-fade-in">
          {links.map((link, index) => (
            <Link 
              key={index} 
              to={link.path}
              className="card-hover flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg text-center"
            >
              <div className={`h-12 w-12 rounded-full ${link.color} text-white flex items-center justify-center mb-3`}>
                <link.icon size={24} />
              </div>
              <span className="text-sm font-medium text-municipal-dark">
                {link.text}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;
