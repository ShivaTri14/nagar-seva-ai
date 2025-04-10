
import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { serviceCategories } from '@/utils/chatbotUtils';
import { ComplaintDetails } from '@/types/chatbot';

interface ComplaintDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  complaintDetails: ComplaintDetails;
  setComplaintDetails: React.Dispatch<React.SetStateAction<ComplaintDetails>>;
  handleSubmitComplaint: () => void;
  handleImageClick: () => void;
  imagePreview: string | null;
  clearAttachment: () => void;
}

const ComplaintDrawer: React.FC<ComplaintDrawerProps> = ({
  isOpen,
  setIsOpen,
  complaintDetails,
  setComplaintDetails,
  handleSubmitComplaint,
  handleImageClick,
  imagePreview,
  clearAttachment,
}) => {
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>File a Complaint</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 py-2">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Complaint Type</label>
            <div className="grid grid-cols-2 gap-2">
              {serviceCategories.map((category) => (
                <button
                  key={category.id}
                  className={cn(
                    "p-3 border rounded-lg text-sm flex flex-col items-center justify-center text-center",
                    complaintDetails.type === category.id 
                      ? "border-municipal-primary bg-municipal-primary/10" 
                      : "border-border hover:border-municipal-primary/50"
                  )}
                  onClick={() => setComplaintDetails(prev => ({...prev, type: category.id}))}
                >
                  <div className="text-2xl mb-1">{category.icon()}</div>
                  <div>{category.name}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Location</label>
            <Input 
              value={complaintDetails.location} 
              onChange={(e) => setComplaintDetails(prev => ({...prev, location: e.target.value}))}
              placeholder="Enter address or location"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea 
              value={complaintDetails.description} 
              onChange={(e) => setComplaintDetails(prev => ({...prev, description: e.target.value}))}
              placeholder="Describe the issue in detail"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Attach Photo (Optional)</label>
            <div 
              className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-muted/20"
              onClick={handleImageClick}
            >
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="max-h-32 mx-auto" />
                  <button 
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearAttachment();
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload an image</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button 
            onClick={handleSubmitComplaint}
            className="bg-municipal-primary hover:bg-municipal-primary/90"
            disabled={!complaintDetails.type || !complaintDetails.location || !complaintDetails.description}
          >
            Submit Complaint
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ComplaintDrawer;
