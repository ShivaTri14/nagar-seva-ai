
// Sample responses for demo purposes
export const sampleResponses: Record<string, string> = {
  garbage: "I've logged your garbage collection complaint. Expect resolution within 24 hours. Your tracking ID is #GC-2023-",
  water: "Your water supply issue has been registered. A team will investigate within 48 hours. Tracking ID: #WS-2023-",
  road: "Road maintenance request logged. Our team will assess the condition within 3-5 days. Tracking ID: #RM-2023-",
  certificate: "For birth/death certificates, please visit our services page or visit the municipal office with required documents.",
  bill: "You can pay your municipal bills online through our services page or at any authorized collection center.",
  waste: "For proper food waste disposal, we recommend composting it. The corporation provides subsidized composting bins.",
  recycle: "Please segregate recyclable waste (plastic, paper, glass) from general waste. Collection happens every Tuesday and Friday.",
  tax: "Property tax payments can be made online or at designated collection centers. The next due date is 30th June. Late payments incur a 2% monthly penalty.",
  permit: "Building permits can be applied for online through our municipal portal. Processing typically takes 15-20 working days."
};

// Hindi version of welcome message and responses
export const hindiTranslations: Record<string, string> = {
  welcome: "नमस्ते! मैं नगरसाथी हूँ, आपका नगरपालिका सहायक। आज मैं आपकी किस प्रकार सहायता कर सकता हूँ?",
  garbage: "मैंने आपकी कचरा संग्रह शिकायत दर्ज कर ली है। 24 घंटे के भीतर समाधान की उम्मीद करें। आपका ट्रैकिंग आईडी है #GC-2023-",
  water: "आपकी पानी की आपूर्ति की समस्या दर्ज कर ली गई है। एक टीम 48 घंटों के भीतर जांच करेगी। ट्रैकिंग आईडी: #WS-2023-",
  road: "सड़क रखरखाव अनुरोध दर्ज किया गया। हमारी टीम 3-5 दिनों के भीतर स्थिति का आकलन करेगी। ट्रैकिंग आईडी: #RM-2023-",
  certificate: "जन्म/मृत्यु प्रमाणपत्र के लिए, कृपया हमारे सेवा पेज पर जाएं या आवश्यक दस्तावेजों के साथ नगरपालिका कार्यालय का दौरा करें।",
  bill: "आप हमारे सेवा पेज के माध्यम से या किसी भी अधिकृत संग्रह केंद्र पर अपने नगरपालिका बिल का ऑनलाइन भुगतान कर सकते हैं।",
  switchToEnglish: "अंग्रेजी में स्विच करने के लिए 'English' या 'अंग्रेजी' टाइप करें"
};

export const serviceCategories = [
  { 
    id: "water", 
    name: "Water Services", 
    icon: <span className="text-blue-500">💧</span>,
    description: "Report water issues, check supply status, request new connection"
  },
  { 
    id: "waste", 
    name: "Waste Management", 
    icon: <span className="text-green-500">♻️</span>,
    description: "Schedule pickup, report dumping, recycling information"
  },
  { 
    id: "tax", 
    name: "Property Tax", 
    icon: <span className="text-amber-500">🏦</span>,
    description: "Calculate tax, payment options, verification of records"
  },
  { 
    id: "roads", 
    name: "Road Maintenance", 
    icon: <span className="text-gray-500">🛣️</span>,
    description: "Report potholes, request repairs, traffic management"
  },
  { 
    id: "permits", 
    name: "Building Permits", 
    icon: <span className="text-purple-500">🏗️</span>,
    description: "Apply for permits, check status, submit documents"
  }
];

export const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const generateRandomTrackingId = () => {
  return Math.floor(Math.random() * 10000);
};

