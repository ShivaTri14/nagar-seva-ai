
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Message, ChatLanguage } from '@/types/chatbot';
import { sampleResponses, hindiTranslations, generateRandomTrackingId } from '@/utils/chatbotUtils';

export const useChatbotConversation = () => {
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
  const [isImageAttached, setIsImageAttached] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatingResponse, setGeneratingResponse] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<ChatLanguage>("english");
  const { toast } = useToast();
  const { user } = useAuth();

  // Save conversation to database if user is logged in
  const saveConversationToDatabase = async (userMessage: string, botResponse: string) => {
    if (!user) return;
    
    try {
      // Instead of trying to insert into chatbot_conversations table,
      // we'll use the feedback table since it's available in the database
      await supabase.from('feedback').insert({
        user_id: user.id,
        name: user.email?.split('@')[0] || 'User',
        email: user.email || 'user@example.com',
        subject: 'Chatbot Conversation',
        message: `User: ${userMessage}\nBot: ${botResponse}`
      });
    } catch (error) {
      console.error("Error saving conversation:", error);
    }
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
            response += generateRandomTrackingId();
            
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
          ? "Thank you for the image. I can see this is an issue that needs attention. I've logged this complaint with high priority. Expect resolution within 24 hours. Your tracking ID is #MC-2023-" + generateRandomTrackingId()
          : "छवि के लिए धन्यवाद। मैं देख सकता हूँ कि यह एक ऐसी समस्या है जिस पर ध्यान देने की आवश्यकता है। मैंने इस शिकायत को उच्च प्राथमिकता के साथ दर्ज किया है। 24 घंटे के भीतर समाधान की उम्मीद करें। आपका ट्रैकिंग आईडी है #MC-2023-" + generateRandomTrackingId();
        
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

  // Clear image attachment
  const clearAttachment = () => {
    setIsImageAttached(false);
    setImagePreview(null);
  };

  return {
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
    clearAttachment,
    saveConversationToDatabase
  };
};
