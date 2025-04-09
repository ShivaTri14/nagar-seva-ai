import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send, Image as ImageIcon, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  status?: "success" | "pending";
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
  const { toast } = useToast();
  const [hasInteracted, setHasInteracted] = useState(false);

  // Sample responses for demo purposes
  const sampleResponses: Record<string, string> = {
    garbage: "I've logged your garbage collection complaint. Expect resolution within 24 hours. Your tracking ID is #GC-2023-",
    water: "Your water supply issue has been registered. A team will investigate within 48 hours. Tracking ID: #WS-2023-",
    road: "Road maintenance request logged. Our team will assess the condition within 3-5 days. Tracking ID: #RM-2023-",
    certificate: "For birth/death certificates, please visit our services page or visit the municipal office with required documents.",
    bill: "You can pay your municipal bills online through our services page or at any authorized collection center.",
    waste: "For proper food waste disposal, we recommend composting it. The corporation provides subsidized composting bins.",
    recycle: "Please segregate recyclable waste (plastic, paper, glass) from general waste. Collection happens every Tuesday and Friday."
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !isImageAttached) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      let response = "I'm sorry, I don't have information about that. Please contact our helpdesk for assistance.";
      
      // Check for keywords in the input
      const lowerInput = input.toLowerCase();
      for (const [keyword, reply] of Object.entries(sampleResponses)) {
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
                  text: `UPDATE: Your ${keyword} complaint has been assigned to our field team. They will reach the location soon.`,
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
        response = "Thank you for the image. I can see this is a garbage collection issue at what appears to be a street corner. I've logged this complaint with high priority. Expect cleanup within 24 hours. Your tracking ID is #GC-2023-" + Math.floor(Math.random() * 10000);
        setIsImageAttached(false);
        
        // Show successful analysis toast
        toast({
          title: "Image Analysis Complete",
          description: "Issue identified: Garbage collection required",
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
    }, 1500);
  };

  const handleImageAttach = () => {
    setIsImageAttached(true);
    toast({
      title: "Image Attached",
      description: "Processing your image for analysis...",
      variant: "default",
    });
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
      {/* Chat button with pulse animation - positioned lower to avoid theme toggle */}
      <button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300",
          isOpen ? 
            "bg-municipal-dark text-white rotate-90" : 
            "bg-municipal-primary text-white",
          !isOpen && !hasInteracted && "animate-pulse-soft"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

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
            <div>
              <h3 className="font-bold">Nagarsathi</h3>
              <p className="text-xs opacity-80">Municipal AI Assistant</p>
            </div>
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

        {/* Chat input */}
        <div className="p-3 border-t border-border">
          <form onSubmit={handleSubmit} className="flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-municipal-primary"
              onClick={handleImageAttach}
            >
              {isImageAttached ? (
                <CheckCircle size={20} className="text-municipal-secondary" />
              ) : (
                <ImageIcon size={20} />
              )}
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 mx-2 border-border focus-visible:ring-municipal-primary"
            />
            <Button type="submit" size="icon" className="bg-municipal-primary hover:bg-municipal-primary/90">
              <Send size={18} />
            </Button>
          </form>
          <div className="text-xs text-muted-foreground mt-2 px-2">
            Ask about garbage collection, water issues, road maintenance, or upload an image of an issue
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;
