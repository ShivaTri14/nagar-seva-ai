
import React, { useState, useEffect } from 'react';
import { Leaf, Recycle, AlertCircle, Package, Droplet } from 'lucide-react';

interface WasteTip {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const wasteTips: WasteTip[] = [
  {
    icon: <Leaf className="text-green-500" />,
    title: "Organic Waste",
    description: "Food scraps and yard waste can be composted to create nutrient-rich soil.",
    color: "border-green-300"
  },
  {
    icon: <Recycle className="text-blue-500" />,
    title: "Recyclable Waste",
    description: "Clean and separate paper, plastic, glass, and metal for efficient recycling.",
    color: "border-blue-300"
  },
  {
    icon: <AlertCircle className="text-red-500" />,
    title: "Hazardous Waste",
    description: "Take batteries, electronics, and chemicals to designated collection centers.",
    color: "border-red-300"
  },
  {
    icon: <Package className="text-gray-500" />,
    title: "Solid Waste",
    description: "Reduce non-recyclable waste by choosing products with less packaging.",
    color: "border-gray-300"
  },
  {
    icon: <Droplet className="text-purple-500" />,
    title: "Liquid Waste",
    description: "Never pour oils, paints, or chemicals down regular drains.",
    color: "border-purple-300"
  }
];

interface WasteTipsProps {
  language: "english" | "hindi";
}

const WasteTips: React.FC<WasteTipsProps> = ({ language }) => {
  const [currentTip, setCurrentTip] = useState<number>(0);
  
  // Auto-rotate tips every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % wasteTips.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Hindi translations would be added here in a real implementation
  const title = language === "english" ? "Waste Management Tips" : "कचरा प्रबंधन टिप्स";

  return (
    <div className="p-3 border-t border-border">
      <div className="text-sm font-medium text-center mb-2">{title}</div>
      <div className={`p-3 border rounded-lg text-sm flex items-center ${wasteTips[currentTip].color}`}>
        <div className="mr-2 flex-shrink-0">
          {wasteTips[currentTip].icon}
        </div>
        <div>
          <div className="font-medium">{wasteTips[currentTip].title}</div>
          <div className="text-xs text-muted-foreground">{wasteTips[currentTip].description}</div>
        </div>
      </div>
      <div className="flex justify-center mt-2">
        {wasteTips.map((_, index) => (
          <button
            key={index}
            className={`mx-1 h-1.5 w-1.5 rounded-full ${currentTip === index ? 'bg-municipal-primary' : 'bg-gray-300'}`}
            onClick={() => setCurrentTip(index)}
            aria-label={`Tip ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default WasteTips;
