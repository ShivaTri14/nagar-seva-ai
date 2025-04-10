
import { WasteAnalysisResult, WasteCategory, WasteDisposalInfo } from "@/types/chatbot";

// Dummy image analysis function for demo purposes
// In a real implementation, this would use computer vision models
export const analyzeWasteImage = (imageUrl: string): Promise<WasteAnalysisResult> => {
  return new Promise((resolve) => {
    console.log("Analyzing waste image:", imageUrl);
    
    // Simulate processing delay (2 seconds for demo)
    setTimeout(() => {
      // Deterministic "analysis" based on image characteristics for demo
      const hash = hashString(imageUrl);
      const wasteCategories: WasteCategory[] = ["organic", "recyclable", "hazardous", "solid", "liquid"];
      const index = Math.abs(hash) % wasteCategories.length;
      const category = wasteCategories[index];
      
      // Generate confidence between 85% and 98%
      const confidence = 85 + (hash % 14);

      // Simulate multi-item detection
      const hasMultipleItems = hash % 3 === 0;
      
      let result: WasteAnalysisResult = {
        category,
        confidence: confidence / 100,
      };
      
      // Add subTypes based on the category
      switch(category) {
        case "organic":
          result.subTypes = hash % 2 === 0 ? ["food waste", "yard clippings"] : ["vegetable scraps", "fruit peels"];
          break;
        case "recyclable":
          result.subTypes = hash % 2 === 0 ? ["plastic bottles", "cardboard"] : ["aluminum cans", "paper"];
          break;
        case "hazardous":
          result.subTypes = hash % 2 === 0 ? ["batteries", "electronics"] : ["paint cans", "chemicals"];
          break;
        case "solid":
          result.subTypes = hash % 2 === 0 ? ["styrofoam", "wrappers"] : ["broken ceramics", "disposable items"];
          break;
        case "liquid":
          result.subTypes = hash % 2 === 0 ? ["cooking oil", "detergent"] : ["paint", "solvents"];
          break;
      }
      
      // If multiple items detected, add that information
      if (hasMultipleItems) {
        const secondaryIndex = (Math.abs(hash) + 1) % wasteCategories.length;
        const secondaryCategory = wasteCategories[secondaryIndex];
        
        result.multipleItems = [
          {
            category: result.category,
            confidence: result.confidence,
            boundingBox: { x: 10, y: 10, width: 200, height: 150 }
          },
          {
            category: secondaryCategory,
            confidence: (confidence - 5) / 100,
            boundingBox: { x: 220, y: 50, width: 180, height: 130 }
          }
        ];
      }
      
      resolve(result);
    }, 2000);
  });
};

// Simple hash function for deterministic "analysis" results in demo
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// Waste disposal information database
export const wasteDisposalInfo: Record<WasteCategory, WasteDisposalInfo> = {
  organic: {
    category: "organic",
    disposalMethods: [
      "Use dedicated green bins for organic waste collection",
      "Consider home composting for yard waste and select food scraps",
      "Keep organic waste separate from other waste types"
    ],
    recyclingSteps: [],
    compostingGuidance: [
      "Layer green materials (food scraps) with brown materials (leaves, paper)",
      "Maintain proper moisture - damp as a wrung-out sponge",
      "Turn your compost pile regularly to aerate it",
      "Avoid meat, dairy, and oily foods in home composting"
    ],
    safetyPrecautions: [],
    environmentalImpact: "When organic waste goes to landfill, it produces methane, a potent greenhouse gas. Properly composted, it creates nutrient-rich soil instead.",
    municipalGuidelines: "Prayagraj Municipal Corporation collects organic waste on Mondays and Thursdays. Use the provided green bins only."
  },
  
  recyclable: {
    category: "recyclable",
    disposalMethods: [
      "Clean and dry all recyclables before disposal",
      "Place in blue recycling bins",
      "Separate different types if required by local guidelines"
    ],
    recyclingSteps: [
      "Rinse containers to remove food residue",
      "Remove labels and lids if required locally",
      "Flatten cardboard boxes to save space",
      "Sort by material type: paper, plastic, glass, metal"
    ],
    compostingGuidance: [],
    safetyPrecautions: ["Watch for sharp edges on metal containers"],
    environmentalImpact: "Recycling one ton of paper saves 17 trees and 7,000 gallons of water. Plastic recycling reduces oil consumption and landfill usage.",
    municipalGuidelines: "Recyclable collection happens every Tuesday and Friday. Items must be clean and sorted according to material type."
  },
  
  hazardous: {
    category: "hazardous",
    disposalMethods: [
      "Never mix with regular waste",
      "Take to designated hazardous waste collection centers",
      "Use manufacturer take-back programs when available"
    ],
    recyclingSteps: [],
    compostingGuidance: [],
    safetyPrecautions: [
      "Keep in original containers with labels intact",
      "Store away from children and pets",
      "Do not mix different hazardous materials",
      "Use protective gloves when handling",
      "Transport in secure containers to prevent spills"
    ],
    environmentalImpact: "Improperly disposed hazardous waste can contaminate soil and water sources, potentially affecting human health and wildlife for decades.",
    municipalGuidelines: "Hazardous waste must be taken to the designated collection center at Environmental Complex, Civil Lines, open on the first Saturday of each month from 9 AM to 3 PM."
  },
  
  solid: {
    category: "solid",
    disposalMethods: [
      "Use black bins for non-recyclable solid waste",
      "Reduce volume by compacting when possible",
      "Consider reuse options before disposal"
    ],
    recyclingSteps: [],
    compostingGuidance: [],
    safetyPrecautions: ["Wrap sharp objects carefully to prevent injuries to waste handlers"],
    environmentalImpact: "Non-recyclable solid waste occupies valuable landfill space and takes hundreds of years to decompose, if at all.",
    municipalGuidelines: "General solid waste collection occurs three times weekly. Maximum two bags per household per collection."
  },
  
  liquid: {
    category: "liquid",
    disposalMethods: [
      "Never pour down regular drains or toilets",
      "Use absorbent materials to solidify before disposal",
      "Take to specialized liquid waste collection points"
    ],
    recyclingSteps: [],
    compostingGuidance: [],
    safetyPrecautions: [
      "Store in sealed, labeled containers",
      "Keep incompatible liquids separate",
      "Use secondary containment for large quantities",
      "Have spill absorption materials ready"
    ],
    environmentalImpact: "Liquid waste can quickly spread through water systems, potentially contaminating drinking water and harming aquatic ecosystems.",
    municipalGuidelines: "Cooking oils can be recycled at designated collection points. Other liquid wastes must be taken to the Environmental Complex for proper disposal."
  },
  
  unknown: {
    category: "unknown",
    disposalMethods: [
      "Contact municipal waste department for guidance",
      "Provide a clear photo to waste management authorities",
      "Consider professional waste assessment for unidentified materials"
    ],
    recyclingSteps: [],
    compostingGuidance: [],
    safetyPrecautions: ["Treat unknown materials as potentially hazardous until identified"],
    environmentalImpact: "Improper disposal of unidentified materials risks environmental damage through unexpected chemical reactions or contamination.",
    municipalGuidelines: "For unidentified waste, contact the Municipal Helpline at 1800-XXX-XXXX for proper disposal instructions."
  }
};

// Generate a user-friendly waste analysis response
export const generateWasteAnalysisResponse = (analysis: WasteAnalysisResult, language: "english" | "hindi"): string => {
  if (language === "hindi") {
    // Hindi responses would be implemented here
    return `मैंने आपकी छवि का विश्लेषण किया है और इसे ${getHindiCategoryName(analysis.category)} कचरे के रूप में पहचाना है (${Math.round(analysis.confidence * 100)}% विश्वास के साथ)।`;
  }
  
  // English responses
  let response = `I've analyzed your image and identified it as ${getCategoryDisplayName(analysis.category)} waste (${Math.round(analysis.confidence * 100)}% confidence).`;
  
  if (analysis.subTypes && analysis.subTypes.length > 0) {
    response += ` Specifically, I can see ${analysis.subTypes.join(" and ")}.`;
  }
  
  if (analysis.multipleItems && analysis.multipleItems.length > 1) {
    response += ` I've also detected multiple items in the image, including ${getCategoryDisplayName(analysis.multipleItems[1].category)} waste.`;
  }
  
  const info = wasteDisposalInfo[analysis.category];
  
  response += `\n\n**Proper Disposal Methods:**\n`;
  response += info.disposalMethods.map(method => `• ${method}`).join('\n');
  
  if (analysis.category === "organic" && info.compostingGuidance && info.compostingGuidance.length > 0) {
    response += `\n\n**Composting Guidance:**\n`;
    response += info.compostingGuidance.map(guide => `• ${guide}`).join('\n');
  }
  
  if (analysis.category === "recyclable" && info.recyclingSteps && info.recyclingSteps.length > 0) {
    response += `\n\n**Recycling Steps:**\n`;
    response += info.recyclingSteps.map(step => `• ${step}`).join('\n');
  }
  
  if (analysis.category === "hazardous" && info.safetyPrecautions && info.safetyPrecautions.length > 0) {
    response += `\n\n**Safety Precautions:**\n`;
    response += info.safetyPrecautions.map(precaution => `• ${precaution}`).join('\n');
  }
  
  response += `\n\n**Environmental Impact:**\n${info.environmentalImpact}`;
  
  response += `\n\n**Municipal Guidelines:**\n${info.municipalGuidelines}`;
  
  return response;
};

// Helper functions for formatting
function getCategoryDisplayName(category: WasteCategory): string {
  switch (category) {
    case "organic": return "Organic";
    case "recyclable": return "Recyclable";
    case "hazardous": return "Hazardous";
    case "solid": return "Solid";
    case "liquid": return "Liquid";
    default: return "Unknown";
  }
}

function getHindiCategoryName(category: WasteCategory): string {
  switch (category) {
    case "organic": return "जैविक";
    case "recyclable": return "पुनर्नवीनीकरण योग्य";
    case "hazardous": return "खतरनाक";
    case "solid": return "ठोस";
    case "liquid": return "तरल";
    default: return "अज्ञात";
  }
}
