
import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatButtonProps {
  isOpen: boolean;
  hasInteracted: boolean;
  toggleChat: () => void;
}

const ChatButton: React.FC<ChatButtonProps> = ({ 
  isOpen, 
  hasInteracted, 
  toggleChat 
}) => {
  return (
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
  );
};

export default ChatButton;
