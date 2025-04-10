
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Camera, ImageIcon, CheckCircle, Loader2 } from 'lucide-react';
import { ChatLanguage } from '@/types/chatbot';

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleImageClick: () => void;
  handleCameraCapture: () => void;
  isImageAttached: boolean;
  generatingResponse: boolean;
  currentLanguage: ChatLanguage;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  handleSubmit,
  handleImageClick,
  handleCameraCapture,
  isImageAttached,
  generatingResponse,
  currentLanguage,
}) => {
  return (
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
  );
};

export default ChatInput;
