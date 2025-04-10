
import React, { useRef, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { formatTime } from '@/utils/chatbotUtils';
import { cn } from '@/lib/utils';
import { Message, WasteCategory } from '@/types/chatbot';
import { Badge } from "@/components/ui/badge";

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

  // Helper function to get appropriate color for waste category
  const getWasteCategoryColor = (category: WasteCategory): string => {
    switch (category) {
      case "organic": return "bg-green-100 text-green-800 border-green-300";
      case "recyclable": return "bg-blue-100 text-blue-800 border-blue-300";
      case "hazardous": return "bg-red-100 text-red-800 border-red-300";
      case "solid": return "bg-gray-100 text-gray-800 border-gray-300";
      case "liquid": return "bg-purple-100 text-purple-800 border-purple-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Helper function to get appropriate icon for waste category
  const getWasteCategoryIcon = (category: WasteCategory): React.ReactNode => {
    switch (category) {
      case "hazardous": 
        return <AlertCircle size={14} className="mr-1" />;
      default:
        return <Info size={14} className="mr-1" />;
    }
  };

  // Format text with markdown-like syntax
  const formatMessageText = (text: string): React.ReactNode => {
    // Split by newlines first to handle line breaks
    const lines = text.split('\n');
    
    return (
      <>
        {lines.map((line, i) => {
          // Bold text
          const boldRegex = /\*\*(.*?)\*\*/g;
          const parts = [];
          let lastIndex = 0;
          let match;
          
          while ((match = boldRegex.exec(line)) !== null) {
            // Add text before the bold section
            if (match.index > lastIndex) {
              parts.push(<span key={`${i}-${lastIndex}`}>{line.substring(lastIndex, match.index)}</span>);
            }
            // Add the bold section
            parts.push(<span key={`${i}-${match.index}`} className="font-semibold">{match[1]}</span>);
            lastIndex = match.index + match[0].length;
          }
          
          // Add any remaining text
          if (lastIndex < line.length) {
            parts.push(<span key={`${i}-${lastIndex}`}>{line.substring(lastIndex)}</span>);
          }
          
          // If parts array is empty, just use the line as is
          const content = parts.length > 0 ? parts : line;
          
          // Bulletpoints
          if (line.trim().startsWith('• ')) {
            return (
              <div key={i} className="pl-2 flex">
                <span className="mr-1">•</span>
                <span>{line.substring(2)}</span>
              </div>
            );
          }
          
          return <div key={i}>{content}</div>;
        })}
      </>
    );
  };

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
            {formatMessageText(message.text)}
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
            {message.wasteAnalysis && (
              <div className="mt-2">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "font-medium flex items-center px-2 py-0.5 text-xs", 
                    getWasteCategoryColor(message.wasteAnalysis.category)
                  )}
                >
                  {getWasteCategoryIcon(message.wasteAnalysis.category)}
                  {message.wasteAnalysis.category} waste - {Math.round(message.wasteAnalysis.confidence * 100)}% confidence
                </Badge>
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
