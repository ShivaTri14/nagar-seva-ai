
import React, { useRef, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { formatTime } from '@/utils/chatbotUtils';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chatbot';

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  setIsImageDialogOpen: (open: boolean) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  isTyping, 
  setIsImageDialogOpen
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
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
  );
};

export default ChatMessages;
