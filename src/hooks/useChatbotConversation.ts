import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Message, ChatLanguage, WasteAnalysisResult, WasteAnalysis } from '@/types/chatbot';
import { 
  sampleResponses, 
  hindiTranslations, 
  generateRandomTrackingId,
  transformWasteAnalysisResult 
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

  const saveConversationToDatabase = async (userMessage: string, botResponse: string) => {
    if (!user) return;
    
    try {
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

  const transformWasteAnalysisResult = (result: WasteAnalysisResult): WasteAnalysis => {
    let binType: 'green' | 'blue' | 'unknown' = 'unknown';
    if (result.category === 'organic') {
      binType = 'green';
    } else if (result.category === 'recyclable') {
      binType = 'blue';
    }
    
    let wasteType: 'decomposable' | 'non-decomposable' | 'unknown' = 'unknown';
    if (result.category === 'organic') {
      wasteType = 'decomposable';
    } else if (result.category === 'recyclable' || result.category === 'solid') {
      wasteType = 'non-decomposable';
    }
    
    let detectedIssue = '';
    if (result.subTypes && result.subTypes.length > 0) {
      detectedIssue = `Detected ${result.subTypes.join(', ')}`;
    } else {
      detectedIssue = `Detected ${result.category} waste`;
    }
    
    if (result.confidence) {
      detectedIssue += ` (${Math.round(result.confidence * 100)}% confidence)`;
    }
    
    return {
      binType,
      wasteType,
      detectedIssue,
      confidence: result.confidence
    };
  };

const generateApplicationFormat = (location: string, issue: string, language: string) => {
  if (language === "hindi") {
    return `
सेवा में,
नगर आयुक्त,
प्रयागराज नगर निगम
प्रयागराज

विषय: ${location} में ${issue} की शिकायत

महोदय/महोदया,

मैं ______________________ (नाम),
निवासी ______________________ (पूरा पता),
मोबाइल नंबर: ______________________,
ईमेल: ______________________,

आपके ध्यान में यह बात लाना चाहता/चाहती हूं कि उपरोक्त स्थान पर एक गंभीर समस्या है। कृपया इस मामले में तत्काल कार्रवाई करें।

धन्यवाद

दिनांक: ________________            हस्ताक्षर: ________________

आप अपनी शिकायत यहां भी दर्ज कर सकते हैं: https://allahabadmc.gov.in/CitizenHome.html
    `;
  }

  return `
To,
The Municipal Commissioner,
Prayagraj Municipal Corporation
Prayagraj

Subject: Complaint regarding ${issue} at ${location}

Respected Sir/Madam,

I, ______________________ (Name),
residing at ______________________ (Full Address),
Mobile No.: ______________________,
Email: ______________________,

wish to bring to your kind notice that there is a serious issue at the above-mentioned location. Kindly take immediate action on this matter.

Thank you for your prompt attention.

Date: ________________            Signature: ________________

You can also file your complaint at: https://allahabadmc.gov.in/CitizenHome.html
  `;
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !isImageAttached) return;

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

    if (isImageAttached && imagePreview && 
        (input.toLowerCase().includes("waste") || 
         input.toLowerCase().includes("trash") ||
         input.toLowerCase().includes("garbage") ||
         input.toLowerCase().includes("recycle") ||
         input.toLowerCase().includes("dispose") ||
         input.toLowerCase().includes("identify") ||
         input.trim() === "")) {
      
      const analysisLoadingMessage: Message = {
        id: messages.length + 2,
        text: currentLanguage === "english" 
          ? "Analyzing your waste image... This will take just a moment." 
          : "आपकी कचरे की छवि का विश्लेषण किया जा रहा है... यह बस एक क्षण लेगा。",
        sender: "bot",
        timestamp: new Date(),
        status: "pending"
      };
      
      setMessages((prev) => [...prev, analysisLoadingMessage]);
      
      analyzeWasteImage(imagePreview).then((analysisResult: WasteAnalysisResult) => {
        const wasteAnalysis = transformWasteAnalysisResult(analysisResult);
        
        const responseText = generateWasteAnalysisResponse(analysisResult, currentLanguage);
        
        const analysisResponseMessage: Message = {
          id: messages.length + 3,
          text: responseText,
          sender: "bot",
          timestamp: new Date(),
          wasteAnalysis: wasteAnalysis
        };
        
        setMessages((prev) => {
          const filteredMessages = prev.filter(msg => msg.id !== analysisLoadingMessage.id);
          return [...filteredMessages, analysisResponseMessage];
        });
        
        setIsTyping(false);
        setGeneratingResponse(false);
        
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
          
          toast({
            title: currentLanguage === "english" ? "+5 Eco-Points Earned!" : "+5 इको-पॉइंट्स अर्जित!",
            description: currentLanguage === "english" 
              ? "Thank you for proper waste identification" 
              : "उचित कचरा पहचान के लिए धन्यवाद",
            variant: "default",
          });
        }, 3000);
        
        clearAttachment();
        
        if (user) {
          saveConversationToDatabase(input, responseText);
        }
      });
      
      return;
    }

    // Fix: Define lowerInput variable
    const lowerInput = input.toLowerCase();

    if (isImageAttached && !lowerInput.includes("waste") && !lowerInput.includes("garbage") && 
        !lowerInput.includes("recycle")) {
      // Fix: Define response variable
      let response = currentLanguage === "english"
        ? "Thank you for the image. I can see this is an issue that needs attention. I've logged this complaint with high priority. Expect resolution within 24 hours. Your tracking ID is #MC-2023-" + generateRandomTrackingId()
        : "छवि के लिए धन्यवाद। मैं देख सकता हूँ कि यह एक ऐसी समस्या है जिस पर ध्यान देने की आवश्यकता है। मैंने इस शिकायत को उच्च प्राथमिकता के साथ दर्ज किया है। 24 घंटे के भीतर समाधान की उम्मीद करें। आपका ट्रैकिंग आईडी है #MC-2023-" + generateRandomTrackingId();
      
      clearAttachment();
      
      toast({
        title: currentLanguage === "english" ? "Image Analysis Complete" : "छवि विश्लेषण पूर्ण",
        description: currentLanguage === "english" ? "Issue identified and logged" : "समस्या पहचानी और दर्ज की गई",
        variant: "default",
      });
      
      // Also need to show the response to the user
      setTimeout(() => {
        const botMessage: Message = {
          id: messages.length + 2,
          text: response,
          sender: "bot",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        setGeneratingResponse(false);
        
        if (user) {
          saveConversationToDatabase(input, response);
        }
      }, 1500);
      
      return;
    }

    setTimeout(() => {
      let response = "I'm sorry, I don't have information about that. Please contact our helpdesk for assistance.";
      
      const lowerInput = input.toLowerCase();
      const currentResponses = currentLanguage === "english" ? sampleResponses : hindiTranslations;
      
      // If there's a location and image attached, generate application format
      if (isImageAttached && imagePreview) {
        const applicationFormat = generateApplicationFormat(
          "the specified location", // You can enhance this by storing actual location
          "the reported issue",
          currentLanguage
        );
        
        response = applicationFormat;
      } else if (lowerInput.includes("organic waste") || lowerInput.includes("food waste") || 
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
          : "खतरनाक कचरे के लिए विशेष हैंडलिंग की आवश्यकता होती है। कभी भी नियमित कचरे के साथ न मिलाएं। बैटरी, इलेक्ट्रॉनिक्स और रसायन जैसी वस्तुओं को पर्यावरण कॉम्प्लेक्स, सिविल लाइंस में नामित संग्रह केंद्र पर ले जाएं, जो हर महीने के पहले शनिवार को ुला रहता है।";
      } else {
        for (const [keyword, reply] of Object.entries(currentResponses)) {
          if (lowerInput.includes(keyword)) {
            response = reply;
            if (keyword === "garbage" || keyword === "water" || keyword === "road") {
              response += generateRandomTrackingId();
              
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

      const botMessage: Message = {
        id: messages.length + 2,
        text: response,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      setGeneratingResponse(false);
      
      if (user) {
        saveConversationToDatabase(input, response);
      }
    }, 1500);
  };

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
