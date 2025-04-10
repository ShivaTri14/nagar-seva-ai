
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  X, 
  Send, 
  Image as ImageIcon, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Languages,
  Camera,
  FileText,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  status?: "success" | "pending" | "error";
  attachmentType?: "image";
  attachmentUrl?: string;
};

type ServiceCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
};

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Nagarsathi, your municipal assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isImageAttached, setIsImageAttached] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isComplaintDrawerOpen, setIsComplaintDrawerOpen] = useState(false);
  const [complaintDetails, setComplaintDetails] = useState({
    type: "",
    description: "",
    location: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<"english" | "hindi">("english");
  const { user } = useAuth();
  const [generatingResponse, setGeneratingResponse] = useState(false);

  // Service categories
  const serviceCategories: ServiceCategory[] = [
    { 
      id: "water", 
      name: "Water Services", 
      icon: <span className="text-blue-500">💧</span>,
      description: "Report water issues, check supply status, request new connection"
    },
    { 
      id: "waste", 
      name: "Waste Management", 
      icon: <span className="text-green-500">♻️</span>,
      description: "Schedule pickup, report dumping, recycling information"
    },
    { 
      id: "tax", 
      name: "Property Tax", 
      icon: <span className="text-amber-500">🏦</span>,
      description: "Calculate tax, payment options, verification of records"
    },
    { 
      id: "roads", 
      name: "Road Maintenance", 
      icon: <span className="text-gray-500">🛣️</span>,
      description: "Report potholes, request repairs, traffic management"
    },
    { 
      id: "permits", 
      name: "Building Permits", 
      icon: <span className="text-purple-500">🏗️</span>,
      description: "Apply for permits, check status, submit documents"
    }
  ];

  // Sample responses for demo purposes
  const sampleResponses: Record<string, string> = {
    garbage: "I've logged your garbage collection complaint. Expect resolution within 24 hours. Your tracking ID is #GC-2023-",
    water: "Your water supply issue has been registered. A team will investigate within 48 hours. Tracking ID: #WS-2023-",
    road: "Road maintenance request logged. Our team will assess the condition within 3-5 days. Tracking ID: #RM-2023-",
    certificate: "For birth/death certificates, please visit our services page or visit the municipal office with required documents.",
    bill: "You can pay your municipal bills online through our services page or at any authorized collection center.",
    waste: "For proper food waste disposal, we recommend composting it. The corporation provides subsidized composting bins.",
    recycle: "Please segregate recyclable waste (plastic, paper, glass) from general waste. Collection happens every Tuesday and Friday.",
    tax: "Property tax payments can be made online or at designated collection centers. The next due date is 30th June. Late payments incur a 2% monthly penalty.",
    permit: "Building permits can be applied for online through our municipal portal. Processing typically takes 15-20 working days."
  };

  // Hindi version of welcome message and responses
  const hindiTranslations: Record<string, string> = {
    welcome: "नमस्ते! मैं नगरसाथी हूँ, आपका नगरपालिका सहायक। आज मैं आपकी किस प्रकार सहायता कर सकता हूँ?",
    garbage: "मैंने आपकी कचरा संग्रह शिकायत दर्ज कर ली है। 24 घंटे के भीतर समाधान की उम्मीद करें। आपका ट्रैकिंग आईडी है #GC-2023-",
    water: "आपकी पानी की आपूर्ति की समस्या दर्ज कर ली गई है। एक टीम 48 घंटों के भीतर जांच करेगी। ट्रैकिंग आईडी: #WS-2023-",
    road: "सड़क रखरखाव अनुरोध दर्ज किया गया। हमारी टीम 3-5 दिनों के भीतर स्थिति का आकलन करेगी। ट्रैकिंग आईडी: #RM-2023-",
    certificate: "जन्म/मृत्यु प्रमाणपत्र के लिए, कृपया हमारे सेवा पेज पर जाएं या आवश्यक दस्तावेजों के साथ नगरपालिका कार्यालय का दौरा करें।",
    bill: "आप हमारे सेवा पेज के माध्यम से या किसी भी अधिकृत संग्रह केंद्र पर अपने नगरपालिका बिल का ऑनलाइन भुगतान कर सकते हैं।",
    switchToEnglish: "अंग्रेजी में स्विच करने के लिए 'English' या 'अंग्रेजी' टाइप करें"
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // After 30 seconds, if user hasn't interacted with chatbot, show a notification
    if (!hasInteracted && !isOpen) {
      const timer = setTimeout(() => {
        toast({
          title: "Need assistance?",
          description: "Our AI assistant can help you with municipal queries!",
          duration: 5000,
        });
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [hasInteracted, isOpen, toast]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
          setIsImageAttached(true);
          toast({
            title: "Image Attached",
            description: "Your image has been attached to the chat.",
            variant: "default",
          });
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const clearAttachment = () => {
    setIsImageAttached(false);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmitComplaint = () => {
    const complaintText = `I want to report a ${complaintDetails.type} issue at ${complaintDetails.location}. ${complaintDetails.description}`;
    setInput(complaintText);
    setIsComplaintDrawerOpen(false);
    
    // Add slight delay to let drawer close
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }, 300);
  };

  const handleCameraCapture = () => {
    // In a real implementation, this would access the device camera
    toast({
      title: "Camera Access",
      description: "Camera functionality would open here to capture issue.",
      variant: "default",
    });
  };

  const switchLanguage = () => {
    const newLanguage = currentLanguage === "english" ? "hindi" : "english";
    setCurrentLanguage(newLanguage);
    
    // Update bot message based on language
    const welcomeMessage = newLanguage === "english" 
      ? "I've switched to English. How can I help you today?" 
      : "मैंने हिंदी में स्विच कर लिया है। मैं आपकी कैसे सहायता कर सकता हूँ?";
    
    const langMessage: Message = {
      id: Date.now(),
      text: welcomeMessage,
      sender: "bot",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, langMessage]);
    
    toast({
      title: newLanguage === "english" ? "Language Changed" : "भाषा बदली गई",
      description: newLanguage === "english" ? "Now chatting in English" : "अब हिंदी में चैट करें",
      variant: "default",
    });
  };

  const saveConversationToDatabase = async (userMessage: string, botResponse: string) => {
    try {
      if (user) {
        await supabase.from('chatbot_conversations').insert({
          user_id: user.id,
          user_message: userMessage,
          bot_response: botResponse,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error saving conversation:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !isImageAttached) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
      ...(isImageAttached && imagePreview ? { 
        attachmentType: "image",
        attachmentUrl: imagePreview 
      } : {})
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setGeneratingResponse(true);

    // Handle language switching
    if (input.toLowerCase().includes("hindi") || input.toLowerCase().includes("हिंदी")) {
      setTimeout(() => {
        setCurrentLanguage("hindi");
        const response = hindiTranslations.welcome;
        
        const botMessage: Message = {
          id: messages.length + 2,
          text: response,
          sender: "bot",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        setGeneratingResponse(false);
      }, 1500);
      
      clearAttachment();
      return;
    }
    
    if (currentLanguage === "hindi" && (input.toLowerCase().includes("english") || input.toLowerCase().includes("अंग्रेजी"))) {
      setTimeout(() => {
        setCurrentLanguage("english");
        const response = "I've switched to English. How can I help you today?";
        
        const botMessage: Message = {
          id: messages.length + 2,
          text: response,
          sender: "bot",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        setGeneratingResponse(false);
      }, 1500);
      
      clearAttachment();
      return;
    }

    // Simulate AI processing
    setTimeout(() => {
      let response = "I'm sorry, I don't have information about that. Please contact our helpdesk for assistance.";
      
      // Check for keywords in the input
      const lowerInput = input.toLowerCase();
      const currentResponses = currentLanguage === "english" ? sampleResponses : hindiTranslations;
      
      for (const [keyword, reply] of Object.entries(currentResponses)) {
        if (lowerInput.includes(keyword)) {
          response = reply;
          if (keyword === "garbage" || keyword === "water" || keyword === "road") {
            // Add random ID for tracking
            response += Math.floor(Math.random() * 10000);
            
            // Add status update for complaints
            setTimeout(() => {
              setMessages((prev) => [
                ...prev,
                {
                  id: prev.length + 2,
                  text: currentLanguage === "english" 
                    ? `UPDATE: Your ${keyword} complaint has been assigned to our field team. They will reach the location soon.` 
                    : `अपडेट: आपकी ${keyword} शिकायत हमारी फील्ड टीम को सौंप दी गई है। वे जल्द ही स्थान पर पहुंचेंगे।`,
                  sender: "bot",
                  timestamp: new Date(),
                  status: "success"
                }
              ]);
            }, 8000);
          }
          break;
        }
      }

      if (isImageAttached) {
        response = currentLanguage === "english"
          ? "Thank you for the image. I can see this is an issue that needs attention. I've logged this complaint with high priority. Expect resolution within 24 hours. Your tracking ID is #MC-2023-" + Math.floor(Math.random() * 10000)
          : "छवि के लिए धन्यवाद। मैं देख सकता हूँ कि यह एक ऐसी समस्या है जिस पर ध्यान देने की आवश्यकता है। मैंने इस शिकायत को उच्च प्राथमिकता के साथ दर्ज किया है। 24 घंटे के भीतर समाधान की उम्मीद करें। आपका ट्रैकिंग आईडी है #MC-2023-" + Math.floor(Math.random() * 10000);
        
        clearAttachment();
        
        // Show successful analysis toast
        toast({
          title: currentLanguage === "english" ? "Image Analysis Complete" : "छवि विश्लेषण पूर्ण",
          description: currentLanguage === "english" ? "Issue identified and logged" : "समस्या पहचानी और दर्ज की गई",
          variant: "default",
        });
      }

      // Add bot response
      const botMessage: Message = {
        id: messages.length + 2,
        text: response,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      setGeneratingResponse(false);
      
      // Save conversation to database if user is logged in
      if (user) {
        saveConversationToDatabase(input, response);
      }
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setHasInteracted(true);
  };

  return (
    <>
      {/* Chat button with pulse animation */}
      <button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300",
          isOpen ? 
            "bg-municipal-dark text-white rotate-90" : 
            "bg-municipal-primary text-white",
          !isOpen && !hasInteracted && "animate-pulse-soft"
        )}
        aria-label="Toggle chat"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Hidden file input for image upload */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload image"
      />

      {/* Chat window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 w-80 sm:w-96 bg-background border border-border rounded-lg shadow-xl z-40 overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12 pointer-events-none"
        )}
      >
        {/* Chat header */}
        <div className="bg-municipal-primary text-white p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center mr-3">
              <span className="text-municipal-primary font-bold">AI</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold">Nagarsathi</h3>
              <p className="text-xs opacity-80">Municipal AI Assistant</p>
            </div>
            <button 
              onClick={switchLanguage} 
              className="p-1.5 rounded-full hover:bg-municipal-primary/80"
              aria-label="Switch language"
            >
              <Languages size={18} />
            </button>
          </div>
        </div>

        {/* Chat messages */}
        <div className="h-96 overflow-y-auto p-4 bg-accent/10">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "mb-4 max-w-[80%] animate-fade-in",
                message.sender === "user" ? "ml-auto" : "mr-auto"
              )}
            >
              <div
                className={cn(
                  "rounded-lg p-3",
                  message.sender === "user"
                    ? "bg-municipal-primary text-white rounded-br-none"
                    : "bg-white border border-gray-200 shadow-sm rounded-bl-none"
                )}
              >
                <p>{message.text}</p>
                {message.attachmentUrl && (
                  <div className="mt-2">
                    <img 
                      src={message.attachmentUrl} 
                      alt="Attached" 
                      className="rounded max-h-40 cursor-pointer"
                      onClick={() => setIsImageDialogOpen(true)}
                    />
                  </div>
                )}
                {message.status && (
                  <div className="flex items-center mt-1 text-xs font-medium text-municipal-accent">
                    <CheckCircle size={12} className="mr-1" />
                    Status Updated
                  </div>
                )}
              </div>
              <div
                className={cn(
                  "text-xs mt-1 text-gray-500",
                  message.sender === "user" ? "text-right" : "text-left"
                )}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center space-x-2 text-municipal-primary mb-4">
              <div className="w-2 h-2 rounded-full bg-municipal-primary animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-municipal-primary animate-pulse delay-75"></div>
              <div className="w-2 h-2 rounded-full bg-municipal-primary animate-pulse delay-150"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick action buttons */}
        <div className="flex overflow-x-auto py-2 px-3 border-t border-border bg-muted/20">
          <button
            onClick={() => setIsComplaintDrawerOpen(true)}
            className="flex-shrink-0 text-xs bg-municipal-accent/10 text-municipal-accent px-3 py-1.5 rounded-full mr-2"
          >
            File Complaint
          </button>
          <button
            onClick={() => setInput("How do I pay property tax?")}
            className="flex-shrink-0 text-xs bg-municipal-accent/10 text-municipal-accent px-3 py-1.5 rounded-full mr-2"
          >
            Pay Tax
          </button>
          <button
            onClick={() => setInput("I need a birth certificate")}
            className="flex-shrink-0 text-xs bg-municipal-accent/10 text-municipal-accent px-3 py-1.5 rounded-full mr-2"
          >
            Certificates
          </button>
          <button
            onClick={() => setInput("Waste collection schedule")}
            className="flex-shrink-0 text-xs bg-municipal-accent/10 text-municipal-accent px-3 py-1.5 rounded-full"
          >
            Waste Collection
          </button>
        </div>

        {/* Chat input */}
        <div className="p-3 border-t border-border">
          <form onSubmit={handleSubmit} className="flex items-center">
            <div className="flex">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-municipal-primary"
                onClick={handleImageClick}
                disabled={isImageAttached || generatingResponse}
              >
                {isImageAttached ? (
                  <CheckCircle size={20} className="text-municipal-secondary" />
                ) : (
                  <ImageIcon size={20} />
                )}
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-municipal-primary ml-1"
                onClick={handleCameraCapture}
                disabled={isImageAttached || generatingResponse}
              >
                <Camera size={20} />
              </Button>
            </div>
            
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={currentLanguage === "english" ? 
                "Type your message..." : 
                "अपना संदेश लिखें..."
              }
              className="flex-1 mx-2 border-border focus-visible:ring-municipal-primary"
              disabled={generatingResponse}
            />
            
            <Button 
              type="submit" 
              size="icon" 
              className="bg-municipal-primary hover:bg-municipal-primary/90"
              disabled={generatingResponse}
            >
              {generatingResponse ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </Button>
          </form>
          
          <div className="text-xs text-muted-foreground mt-2 px-2">
            {currentLanguage === "english" ? 
              "Ask about municipal services or upload an image of an issue" : 
              "नगरपालिका सेवाओं के बारे में पूछें या किसी समस्या की छवि अपलोड करें"
            }
          </div>
        </div>
      </div>

      {/* Image preview dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Image Attachment</DialogTitle>
            <DialogDescription>
              Attached image for municipal complaint
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-2">
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="max-w-full max-h-[60vh]" />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Complaint drawer */}
      <Drawer open={isComplaintDrawerOpen} onOpenChange={setIsComplaintDrawerOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>File a Complaint</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 py-2">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Complaint Type</label>
              <div className="grid grid-cols-2 gap-2">
                {serviceCategories.map((category) => (
                  <button
                    key={category.id}
                    className={cn(
                      "p-3 border rounded-lg text-sm flex flex-col items-center justify-center text-center",
                      complaintDetails.type === category.id 
                        ? "border-municipal-primary bg-municipal-primary/10" 
                        : "border-border hover:border-municipal-primary/50"
                    )}
                    onClick={() => setComplaintDetails(prev => ({...prev, type: category.id}))}
                  >
                    <div className="text-2xl mb-1">{category.icon}</div>
                    <div>{category.name}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input 
                value={complaintDetails.location} 
                onChange={(e) => setComplaintDetails(prev => ({...prev, location: e.target.value}))}
                placeholder="Enter address or location"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea 
                value={complaintDetails.description} 
                onChange={(e) => setComplaintDetails(prev => ({...prev, description: e.target.value}))}
                placeholder="Describe the issue in detail"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Attach Photo (Optional)</label>
              <div 
                className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-muted/20"
                onClick={handleImageClick}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="max-h-32 mx-auto" />
                    <button 
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearAttachment();
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload an image</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button 
              onClick={handleSubmitComplaint}
              className="bg-municipal-primary hover:bg-municipal-primary/90"
              disabled={!complaintDetails.type || !complaintDetails.location || !complaintDetails.description}
            >
              Submit Complaint
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AIChatbot;
