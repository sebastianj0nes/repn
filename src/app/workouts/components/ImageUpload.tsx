import { ImageHandler } from '@/lib/utils/imageHandler';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onPreviewChange: (preview: string | null) => void;
  onError: (error: string | null) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  onPreviewChange,
  onError
}) => {
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      try {
        const file = event.target.files[0];
        
        // Compress image before preview
        const compressedFile = await ImageHandler.compressImage(file);
        onImageSelect(compressedFile);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          if (result.startsWith('data:image')) {
            onPreviewChange(result);
            onError(null);
          } else {
            onPreviewChange(null);
            onError('Invalid image format');
          }
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error handling image:', error);
        onError('Error processing image');
        onPreviewChange(null);
      }
    }
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="hidden"
    />
  );
}; 