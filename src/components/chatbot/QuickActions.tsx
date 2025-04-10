
import React from 'react';

interface QuickActionsProps {
  setInput: (input: string) => void;
  setIsComplaintDrawerOpen: (open: boolean) => void;
  currentLanguage: "english" | "hindi";
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  setInput, 
  setIsComplaintDrawerOpen,
  currentLanguage
}) => {
  return (
    <div className="flex overflow-x-auto py-2 px-3 border-t border-border bg-muted/20">
      <button
        onClick={() => setIsComplaintDrawerOpen(true)}
        className="flex-shrink-0 text-xs bg-municipal-accent/10 text-municipal-accent px-3 py-1.5 rounded-full mr-2"
      >
        {currentLanguage === "english" ? "File Complaint" : "शिकायत दर्ज करें"}
      </button>
      <button
        onClick={() => setInput("How do I pay property tax?")}
        className="flex-shrink-0 text-xs bg-municipal-accent/10 text-municipal-accent px-3 py-1.5 rounded-full mr-2"
      >
        {currentLanguage === "english" ? "Pay Tax" : "कर भुगतान"}
      </button>
      <button
        onClick={() => setInput("I need a birth certificate")}
        className="flex-shrink-0 text-xs bg-municipal-accent/10 text-municipal-accent px-3 py-1.5 rounded-full mr-2"
      >
        {currentLanguage === "english" ? "Certificates" : "प्रमाणपत्र"}
      </button>
      <button
        onClick={() => setInput("Waste collection schedule")}
        className="flex-shrink-0 text-xs bg-municipal-accent/10 text-municipal-accent px-3 py-1.5 rounded-full"
      >
        {currentLanguage === "english" ? "Waste Collection" : "कचरा संग्रह"}
      </button>
    </div>
  );
};

export default QuickActions;
