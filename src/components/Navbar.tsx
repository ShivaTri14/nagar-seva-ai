
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Menu, Search, User, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Complaints", path: "/complaints" },
    { name: "Track Status", path: "/track" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Failed to log out",
        variant: "destructive",
      });
    }
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo and City Name */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-municipal-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <h1 className="font-bold text-municipal-dark text-xl">Prayagraj</h1>
              <p className="text-xs text-municipal-primary/80">Municipal Corporation</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className="font-medium text-municipal-dark hover:text-municipal-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {isSearchOpen ? (
              <div className="relative flex items-center">
                <Input 
                  placeholder="Search services, forms..." 
                  className="pl-8 w-64 border-municipal-primary/30 focus:border-municipal-primary"
                  autoFocus
                />
                <Search size={18} className="absolute left-2 text-municipal-primary/60" />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-0 text-municipal-primary" 
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X size={18} />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" className="text-municipal-dark" onClick={() => setIsSearchOpen(true)}>
                <Search size={20} />
              </Button>
            )}
            
            <LanguageSwitcher />
            
            <Button variant="ghost" size="icon" className="text-municipal-dark">
              <Bell size={20} />
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-municipal-primary hover:bg-municipal-primary/90" size="sm">
                    <User size={16} className="mr-2" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white">
                  <div className="px-3 py-2 text-sm font-medium">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button className="bg-municipal-primary hover:bg-municipal-primary/90" size="sm" onClick={() => navigate('/auth')}>
                <User size={16} className="mr-2" />
                Login
              </Button>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-municipal-dark"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 px-4 animate-fade-in">
          <div className="flex items-center mb-4">
            <Input 
              placeholder="Search services, forms..." 
              className="flex-1 border-municipal-primary/30"
            />
            <Button variant="ghost" size="icon" className="text-municipal-primary ml-2">
              <Search size={20} />
            </Button>
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" className="text-municipal-dark">
              <Bell size={20} />
            </Button>
          </div>
          
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className="font-medium text-municipal-dark hover:text-municipal-primary transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="mt-4">
            {user ? (
              <>
                <p className="text-sm mb-2 text-gray-500">Logged in as: {user.email}</p>
                <Button className="w-full mb-2" variant="outline" onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}>
                  <User size={16} className="mr-2" />
                  Profile
                </Button>
                <Button className="w-full text-red-600" variant="outline" onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                className="bg-municipal-primary hover:bg-municipal-primary/90 w-full"
                onClick={() => { navigate('/auth'); setIsMenuOpen(false); }}
              >
                <User size={16} className="mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
