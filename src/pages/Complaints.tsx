
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Upload, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";

const Complaints = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    area: "",
    issueType: "",
    description: "",
    severity: "",
    fileUploaded: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Generate random tracking ID
      const trackingId = `${formData.issueType.substring(0, 2).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
      
      toast({
        title: "Complaint Filed Successfully",
        description: `Your complaint has been registered with tracking ID: ${trackingId}`,
        variant: "default",
      });
      
      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        area: "",
        issueType: "",
        description: "",
        severity: "",
        fileUploaded: false
      });
    }, 2000);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = () => {
    setFormData(prev => ({ ...prev, fileUploaded: true }));
    toast({
      title: "File Uploaded",
      description: "Your image has been uploaded and will be analyzed by our AI",
      variant: "default",
    });
  };

  return (
    <>
      <Helmet>
        <title>File a Complaint | Prayagraj Municipal Corporation</title>
        <meta name="description" content="File complaints related to municipal services like garbage collection, water supply, road maintenance, and more." />
      </Helmet>
      
      <Navbar />
      
      <div className="bg-municipal-light/30 py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-municipal-dark mb-3">
              File a Civic Complaint
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Report issues related to municipal services for prompt resolution. 
              Our AI-assisted system ensures your complaint reaches the right department.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 max-w-3xl mx-auto">
            <div className="bg-blue-50 border-l-4 border-municipal-primary p-4 mb-6 rounded">
              <div className="flex">
                <AlertCircle className="text-municipal-primary mr-3 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="font-medium text-municipal-primary">Before you file a complaint</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Please provide accurate location details and upload images of the issue if possible.
                    Our AI will help categorize and prioritize your complaint.
                  </p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-municipal-dark" htmlFor="name">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-municipal-dark" htmlFor="phone">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-municipal-dark" htmlFor="email">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-municipal-dark" htmlFor="address">
                  Complaint Location
                </label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter the exact address of the issue"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-municipal-dark" htmlFor="area">
                    Area/Ward
                  </label>
                  <Input
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="Enter your area or ward number"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-municipal-dark" htmlFor="issueType">
                    Issue Type
                  </label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("issueType", value)}
                    value={formData.issueType}
                  >
                    <SelectTrigger id="issueType">
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="garbage">Garbage Collection</SelectItem>
                      <SelectItem value="water">Water Supply</SelectItem>
                      <SelectItem value="sewage">Sewage/Drainage</SelectItem>
                      <SelectItem value="roads">Road Maintenance</SelectItem>
                      <SelectItem value="lights">Street Lights</SelectItem>
                      <SelectItem value="parks">Parks & Recreation</SelectItem>
                      <SelectItem value="noise">Noise Pollution</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-municipal-dark" htmlFor="description">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the issue in detail"
                  rows={4}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-municipal-dark" htmlFor="severity">
                    Urgency Level
                  </label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("severity", value)}
                    value={formData.severity}
                  >
                    <SelectTrigger id="severity">
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Can be addressed anytime</SelectItem>
                      <SelectItem value="medium">Medium - Needs attention within a week</SelectItem>
                      <SelectItem value="high">High - Requires prompt action</SelectItem>
                      <SelectItem value="critical">Critical - Immediate attention needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-municipal-dark">
                    Upload Images (Optional)
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="border-dashed border-2 w-full h-10 bg-gray-50"
                      onClick={handleFileChange}
                    >
                      <Upload size={16} className="mr-2" />
                      {formData.fileUploaded ? "File Uploaded" : "Upload Image"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Upload images for AI-assisted analysis (Max 5MB per image)
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <Button 
                  type="submit" 
                  className="bg-municipal-primary hover:bg-municipal-primary/90 w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Complaint"
                  )}
                </Button>
                <p className="text-center text-xs text-gray-500 mt-4">
                  By submitting, you agree to our terms and privacy policy
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
      <AIChatbot />
    </>
  );
};

export default Complaints;
