'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { backfillAchievements } from '@/lib/utils/backfillAchievements';
import { useToast } from '@/hooks/use-toast';

export function BackfillButton({ userId }: { userId: string }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleBackfill = async () => {
    setIsProcessing(true);
    
    try {
      const result = await backfillAchievements(userId);
      
      if (result.success) {
        toast({
          title: "Achievements Updated!",
          description: `Successfully unlocked ${result.completedCount} achievements based on your workout history.`,
          duration: 5000,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process achievements. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      onClick={handleBackfill}
      disabled={isProcessing}
      className="mb-6"
    >
      {isProcessing ? "Processing..." : "Update Achievements from History"}
    </Button>
  );
} 