import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons"

export function TierExplanationDialog() {
  return (
    <Dialog>
      <DialogTrigger className="w-full flex justify-center">
        <span className="text-sm text-muted-foreground hover:text-primary transition-colors underline decoration-dotted flex items-center gap-2">
          <QuestionMarkCircledIcon className="h-4 w-4" />
          What are tiers?
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black">Exercise Tiers Explained</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-sm text-black">
            Tiers are a simple and easy way to understand which exercises are the <span className="font-bold">best to choose</span> when working out.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'linear-gradient(45deg, #FFD700, #FFB700)' }}>
              <span className="text-lg font-bold px-2 py-1 rounded bg-white/20 border-2 border-black shadow-sm">A*</span>
              <p className="text-sm text-black">
                <span className="font-bold">The best exercises</span> for building strength and muscle. These are your key movements like <span className="font-bold">squats and deadlifts</span> that work multiple muscles at once.
              </p>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'linear-gradient(45deg, #14B8A6, #0D9488)' }}>
              <span className="text-lg font-bold px-2 py-1 rounded bg-white/20 border-2 border-black shadow-sm">A</span>
              <p className="text-sm text-white">
                <span className="font-bold">Great exercises</span> that target specific muscle groups effectively. These <span className="font-bold">support your A* movements</span> and are crucial for a well-rounded workout.
              </p>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'linear-gradient(45deg, #6366F1, #4F46E5)' }}>
              <span className="text-lg font-bold px-2 py-1 rounded bg-white/20 border-2 border-black shadow-sm">B</span>
              <p className="text-sm text-white">
                Either <span className="font-bold">beginner-friendly exercises</span> to help you progress, or movements that are <span className="font-bold">less efficient</span> for muscle growth but can add variety to your workout.
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Focus on <span className="font-bold">A* and A-tier exercises</span> for best results, using B-tier exercises to support your training journey or add variety.
          </p>
          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground italic">
              Repn&apos;s exercise tier classifications are based on current scientific research and evidence-based practices in exercise science. While we continuously review and update our content to reflect the latest findings, exercise science is an evolving field. Our team regularly reassesses and updates exercise information to ensure accuracy and alignment with contemporary research.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 