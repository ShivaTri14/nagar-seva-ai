
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ComplaintDetails, ChatLanguage } from "@/types/chatbot";
import ChatButton from "./chatbot/ChatButton";
import ChatHeader from "./chatbot/ChatHeader";
import ChatMessages from "./chatbot/ChatMessages";
import QuickActions from "./chatbot/QuickActions";
import ChatInput from "./chatbot/ChatInput";
import WasteTips from "./chatbot/WasteTips";
import ImagePreviewDialog from "./chatbot/ImagePreviewDialog";
import ComplaintDrawer from "./chatbot/ComplaintDrawer";
import { useChatbotConversation } from "@/hooks/useChatbotConversation";

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isComplaintDrawerOpen, setIsComplaintDrawerOpen] = useState(false);
  const [complaintDetails, setComplaintDetails] = useState<ComplaintDetails>({
    type: "",
    description: "",
    location: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showWasteTips, setShowWasteTips] = useState(true);

  const {
    messages,
    input,
    setInput,
    isTyping,
    isImageAttached,
    setIsImageAttached,
    imagePreview,
    setImagePreview,
    currentLanguage,
    generatingResponse,
    handleSubmit,
    switchLanguage,
    clearAttachment
  } = useChatbotConversation();
  
  const { toast } = useToast();

  useEffect(() => {
    // After 30 seconds, if user hasn't interacted with chatbot, show a notification
    if (!hasInteracted && !isOpen) {
      const timer = setTimeout(() => {
        toast({
          title: "Need assistance?",
          description: "Our AI assistant can help with municipal queries and waste identification!",
          duration: 5000,
        });
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [hasInteracted, isOpen, toast]);

  // Hide waste tips when user starts typing or when there are messages
  useEffect(() => {
    if (input.length > 0 || messages.length > 1) {
      setShowWasteTips(false);
    } else {
      setShowWasteTips(true);
    }
  }, [input, messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (.jpg, .png, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
          setIsImageAttached(true);
          
          // Set a default input text for waste identification if input is empty
          if (!input.trim()) {
            setInput("Please identify this waste and tell me how to dispose of it properly");
          }
          
          toast({
            title: "Image Attached",
            description: "Your image has been attached. Send to analyze waste type.",
            variant: "default",
          });
        }
      };
      
      reader.readAsDataURL(file);
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
      description: "Camera functionality would open here to capture waste for analysis.",
      variant: "default",
    });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setHasInteracted(true);
  };

  return (
    <>
      <ChatButton 
        isOpen={isOpen} 
        hasInteracted={hasInteracted} 
        toggleChat={toggleChat} 
      />

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
        <ChatHeader 
          switchLanguage={switchLanguage} 
          currentLanguage={currentLanguage as ChatLanguage}
        />

        <ChatMessages 
          messages={messages} 
          isTyping={isTyping}
          setIsImageDialogOpen={setIsImageDialogOpen}
        />

        {showWasteTips && (
          <WasteTips language={currentLanguage as ChatLanguage} />
        )}

        <QuickActions 
          setInput={setInput} 
          setIsComplaintDrawerOpen={setIsComplaintDrawerOpen}
          currentLanguage={currentLanguage as ChatLanguage}
        />

        <ChatInput 
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          handleImageClick={handleImageClick}
          handleCameraCapture={handleCameraCapture}
          isImageAttached={isImageAttached}
          generatingResponse={generatingResponse}
          currentLanguage={currentLanguage as ChatLanguage}
        />
      </div>

      <ImagePreviewDialog 
        isOpen={isImageDialogOpen}
        setIsOpen={setIsImageDialogOpen}
        imagePreview={imagePreview}
      />

      <ComplaintDrawer 
        isOpen={isComplaintDrawerOpen}
        setIsOpen={setIsComplaintDrawerOpen}
        complaintDetails={complaintDetails}
        setComplaintDetails={setComplaintDetails}
        handleSubmitComplaint={handleSubmitComplaint}
        handleImageClick={handleImageClick}
        imagePreview={imagePreview}
        clearAttachment={clearAttachment}
      />
    </>
  );
};

export default AIChatbot;
