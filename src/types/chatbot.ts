
import React from 'react';

export type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  status?: "success" | "pending" | "error";
  attachmentType?: "image";
  attachmentUrl?: string;
  wasteAnalysis?: WasteAnalysisResult;
};

export type ServiceCategory = {
  id: string;
  name: string;
  icon: () => React.ReactNode;
  description: string;
};

export type ComplaintDetails = {
  type: string;
  description: string;
  location: string;
};

export type ChatLanguage = "english" | "hindi";

export type WasteCategory = 
  | "organic" 
  | "recyclable" 
  | "hazardous" 
  | "solid" 
  | "liquid"
  | "unknown";

export type WasteAnalysisResult = {
  category: WasteCategory;
  confidence: number;
  subTypes?: string[];
  multipleItems?: Array<{
    category: WasteCategory;
    confidence: number;
    boundingBox?: { x: number, y: number, width: number, height: number };
  }>;
};

export type WasteDisposalInfo = {
  category: WasteCategory;
  disposalMethods: string[];
  recyclingSteps?: string[];
  compostingGuidance?: string[];
  safetyPrecautions?: string[];
  environmentalImpact: string;
  municipalGuidelines: string;
};
