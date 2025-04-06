
import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-municipal-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div>
            <h3 className="font-bold text-xl mb-4 flex items-center">
              <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center mr-2">
                <span className="text-municipal-primary font-bold">P</span>
              </div>
              Prayagraj Municipal
            </h3>
            <p className="text-gray-300 mb-4">
              Working towards a cleaner, greener, and smarter Prayagraj. Your city, our responsibility.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/complaints" className="text-gray-300 hover:text-white transition-colors">
                  File a Complaint
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-gray-300 hover:text-white transition-colors">
                  Track Status
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-300 hover:text-white transition-colors">
                  News & Updates
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0" />
                <p className="text-gray-300">
                  Municipal Corporation, Civil Lines, Prayagraj, Uttar Pradesh 211001
                </p>
              </div>
              <div className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0" />
                <p className="text-gray-300">+91 532 2567890</p>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0" />
                <p className="text-gray-300">contact@prayagraj.gov.in</p>
              </div>
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-2">
              Subscribe to our newsletter for updates and announcements.
            </p>
            <form className="mt-4">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-municipal-dark/50 text-white border border-gray-600 px-3 py-2 rounded-l-md flex-1 focus:outline-none focus:border-municipal-accent"
                />
                <button 
                  className="bg-municipal-accent text-white px-4 py-2 rounded-r-md hover:bg-municipal-accent/90 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Prayagraj Municipal Corporation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
