
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ImagePreviewDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  imagePreview: string | null;
}

const ImagePreviewDialog: React.FC<ImagePreviewDialogProps> = ({
  isOpen,
  setIsOpen,
  imagePreview,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Image Attachment</DialogTitle>
          <DialogDescription>
            Attached image for municipal complaint
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-2">
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="max-w-full max-h-[60vh]" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;
