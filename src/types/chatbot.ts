
export type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  status?: "success" | "pending" | "error";
  attachmentType?: "image";
  attachmentUrl?: string;
};

export type ServiceCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
};

export type ComplaintDetails = {
  type: string;
  description: string;
  location: string;
};

export type ChatLanguage = "english" | "hindi";

