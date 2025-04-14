
import React from 'react';
import { Languages } from 'lucide-react';
import { ChatLanguage } from '@/types/chatbot';

interface ChatHeaderProps {
  switchLanguage: () => void;
  currentLanguage: ChatLanguage;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ switchLanguage, currentLanguage }) => {
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
          className="p-2 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
          aria-label="Switch language"
        >
          <Languages size={20} className="text-white" />
          <span className="ml-2 text-xs hidden md:inline">
            {currentLanguage === 'english' ? 'हिंदी' : 'English'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
