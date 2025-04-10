
import React from 'react';
import { Languages } from 'lucide-react';
import { ChatLanguage } from '@/types/chatbot';

interface ChatHeaderProps {
  switchLanguage: () => void;
  currentLanguage: ChatLanguage;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ switchLanguage }) => {
  return (
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
  );
};

export default ChatHeader;
