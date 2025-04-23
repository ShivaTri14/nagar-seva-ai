
export type WasteClassification = {
  binType: 'green' | 'blue' | 'unknown';
  wasteType: 'decomposable' | 'non-decomposable' | 'unknown';
  detectedIssue: string;
};

// Sanitation keywords in different languages
export const SANITATION_KEYWORDS = {
  en: ['garbage', 'trash', 'waste', 'sewage', 'drainage', 'pollution'],
  hi: ['कचरा', 'गंदगी', 'नाली', 'सीवेज', 'प्रदूषण'],
  ta: ['குப்பை', 'கழிவு', 'கழிவுநீர்', 'மாசுபாடு'],
  bn: ['আবর্জনা', 'বর্জ্য', 'নিকাশী', 'দূষণ'],
  ur: ['کوڑا', 'گندگی', 'سیوریج', 'آلودگی']
};

// Process text to detect waste-related intent
export const processText = (text: string, defaultLang = 'en'): { intent: string; language: string } => {
  const lower = text.toLowerCase();
  for (const [lang, keywords] of Object.entries(SANITATION_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return { intent: 'file_complaint', language: lang };
    }
  }
  return { intent: 'unknown', language: defaultLang };
};

// Templates for different languages
export const COMPLAINT_TEMPLATES = {
  en: "Complaint: {issue}, Location: {loc}",
  hi: "शिकायत: {issue}, स्थान: {loc}",
  ta: "புகார்: {issue}, இடம்: {loc}",
  bn: "অভিযোগ: {issue}, অবস্থান: {loc}",
  ur: "شکایت: {issue}, مقام: {loc}"
};

// Generate complaint text based on language
export const generateComplaintText = (
  issue: string, 
  location: string, 
  language: string = 'en'
): string => {
  const template = COMPLAINT_TEMPLATES[language as keyof typeof COMPLAINT_TEMPLATES] || COMPLAINT_TEMPLATES.en;
  return template.replace('{issue}', issue).replace('{loc}', location);
};

// Generate application template
export const generateApplicationTemplate = (issue: string, location: string): string => {
  return `
To
The Municipal Commissioner,
[Name of Municipal Corporation]
[City Name]

Subject: Complaint regarding ${issue} at ${location}

Respected Sir/Madam,

I, ______________________________________ (Name),
residing at ______________________________________ (Full Address),
Mobile No.: ______________________,
Email: __________________________,

wish to bring to your kind notice that there is an accumulation of garbage at the above-mentioned location.
This not only causes foul odor and breeding of disease-carrying vectors, but also poses a serious health and environmental hazard to local residents.

Kindly take immediate action to clear this waste and arrange for regular disposal.

Thank you for your prompt attention.

Date: ________________            Signature: ________________
`.trim();
};

