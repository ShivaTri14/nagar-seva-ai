import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Message, ChatLanguage, WasteAnalysisResult } from '@/types/chatbot';
import { 
  sampleResponses, 
  hindiTranslations, 
  generateRandomTrackingId 
} from '@/utils/chatbotUtils';
import { 
  analyzeWasteImage, 
  generateWasteAnalysisResponse 
} from '@/utils/wasteIdentificationUtils';

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

    // Check if this is a waste identification request with an image
    if (isImageAttached && imagePreview && 
        (input.toLowerCase().includes("waste") || 
         input.toLowerCase().includes("trash") ||
         input.toLowerCase().includes("garbage") ||
         input.toLowerCase().includes("recycle") ||
         input.toLowerCase().includes("dispose") ||
         input.toLowerCase().includes("identify") ||
         input.trim() === "")) {
      
      // Show waste analysis loading message
      const analysisLoadingMessage: Message = {
        id: messages.length + 2,
        text: currentLanguage === "english" 
          ? "Analyzing your waste image... This will take just a moment." 
          : "आपकी कचरे की छवि का विश्लेषण किया जा रहा है... यह बस एक क्षण लेगा।",
        sender: "bot",
        timestamp: new Date(),
        status: "pending"
      };
      
      setMessages((prev) => [...prev, analysisLoadingMessage]);
      
      // Process the waste image
      analyzeWasteImage(imagePreview).then((analysisResult: WasteAnalysisResult) => {
        // Generate a detailed response about the waste
        const responseText = generateWasteAnalysisResponse(analysisResult, currentLanguage);
        
        // Add waste analysis results to chat
        const analysisResponseMessage: Message = {
          id: messages.length + 3,
          text: responseText,
          sender: "bot",
          timestamp: new Date(),
          wasteAnalysis: analysisResult
        };
        
        setMessages((prev) => {
          // Replace the loading message with the actual response
          const filteredMessages = prev.filter(msg => msg.id !== analysisLoadingMessage.id);
          return [...filteredMessages, analysisResponseMessage];
        });
        
        setIsTyping(false);
        setGeneratingResponse(false);
        
        // Add gamification message after successful waste identification
        setTimeout(() => {
          const gamificationMessage: Message = {
            id: Date.now(),
            text: currentLanguage === "english" 
              ? "🌱 Great job identifying waste correctly! You've earned 5 eco-points. Keep properly disposing of waste to earn more points and badges." 
              : "🌱 कचरे की सही पहचान के लिए शाबाश! आपने 5 इको-पॉइंट्स अर्जित किए हैं। अधिक अंक और बैज अर्जित करने के लिए कचरे का उचित निपटान करते रहें।",
            sender: "bot",
            timestamp: new Date(),
            status: "success"
          };
          
          setMessages(prev => [...prev, gamificationMessage]);
          
          // Show toast for earned points
          toast({
            title: currentLanguage === "english" ? "+5 Eco-Points Earned!" : "+5 इको-पॉइंट्स अर्जित!",
            description: currentLanguage === "english" 
              ? "Thank you for proper waste identification" 
              : "उचित कचरा पहचान के लिए धन्यवाद",
            variant: "default",
          });
        }, 3000);
        
        clearAttachment();
        
        // Save conversation to database if user is logged in
        if (user) {
          saveConversationToDatabase(input, responseText);
        }
      });
      
      return;
    }

    // Handle non-waste identification queries
    // Simulate AI processing
    setTimeout(() => {
      let response = "I'm sorry, I don't have information about that. Please contact our helpdesk for assistance.";
      
      // Check for keywords in the input
      const lowerInput = input.toLowerCase();
      const currentResponses = currentLanguage === "english" ? sampleResponses : hindiTranslations;
      
      // Add waste-related keywords to the existing responses
      if (lowerInput.includes("organic waste") || lowerInput.includes("food waste") || 
          lowerInput.includes("compost")) {
        response = currentLanguage === "english" 
          ? "Organic waste should be placed in green bins. It can be composted to create nutrient-rich soil. The municipality collects organic waste on Mondays and Thursdays."
          : "जैविक कचरे को हरे डिब्बों में रखा जाना चाहिए। इसे खाद बनाकर पोषक तत्वों से भरपूर मिट्टी बनाई जा सकती है। नगर पालिका सोमवार और गुरुवार को जैविक कचरा एकत्र करती है।";
      } else if (lowerInput.includes("recyclable") || lowerInput.includes("recycle")) {
        response = currentLanguage === "english" 
          ? "Recyclable materials like paper, plastic, glass, and metal should be cleaned and placed in blue bins. Make sure to separate different types of recyclables according to local guidelines."
          : "कागज, प्लास्टिक, कांच और धातु जैसी रीसाइकिल सामग्री को साफ करके नीले बिन में रखा जाना चाहिए। स्थानीय दिशानिर्देशों के अनुसार विभिन्न प्रकार के रीसाइकिल को अलग करना सुनिश्चित करें।";
      } else if (lowerInput.includes("hazardous") || lowerInput.includes("batteries") || 
                lowerInput.includes("chemical") || lowerInput.includes("electronic")) {
        response = currentLanguage === "english" 
          ? "Hazardous waste requires special handling. Never mix with regular trash. Take items like batteries, electronics, and chemicals to the designated collection center at Environmental Complex, Civil Lines, open on the first Saturday of each month."
          : "खतरनाक कचरे के लिए विशेष हैंडलिंग की आवश्यकता होती है। कभी भी नियमित कचरे के साथ न मिलाएं। बैटरी, इलेक्ट्रॉनिक्स और रसायन जैसी वस्तुओं को पर्यावरण कॉम्प्लेक्स, सिविल लाइंस में नामित संग्रह केंद्र पर ले जाएं, जो हर महीने के पहले शनिवार को खुला रहता है।";
      } else {
        // Use existing responses for non-waste queries
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
      }

      // Handle regular image attachments (non-waste identification)
      if (isImageAttached && !lowerInput.includes("waste") && !lowerInput.includes("garbage") && 
          !lowerInput.includes("recycle")) {
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
