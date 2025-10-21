import { CurrentHole } from "@/components/CurrentHole";
import { useRound } from "@/contexts/RoundContext";
import { FaRegTrashAlt } from "react-icons/fa";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function CurrentRound() {
  const { currentRound, currentHoleIndex } = useRound();

  if (!currentRound) {
    return <p>No active round. Please start one first.</p>;
  }

  return (
    <div className="flex flex-col items-center pt-4 pb-10 text-deep-forest bg-dune-sand min-h-screen">
      <div className="w-full px-4 flex flex-row justify-between items-center">
        <h1 className="text-2xl ">{currentRound.course.title}</h1>
        {currentHoleIndex !== 18 && (
          <AlertDialog>
            <AlertDialogTrigger className="text-sm font-medium px-3 aspect-square rounded-md flex items-center justify-center bg-red-500 text-dune-sand shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
              <FaRegTrashAlt className="" />
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-deep-forest border-2 border-dune-sand">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-dune-sand">
                  What would you like to do?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-dune-sand">
                  You can still submit your current round and track stats from
                  the holes you have completed
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-dune-sand">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => alert("Round data deleted")}
                  className="bg-red-500"
                >
                  Delete
                </AlertDialogAction>
                <AlertDialogAction
                  onClick={() => alert("Round submitted")}
                  className="bg-deep-forest border-2 border-dune-sand text-dune-sand"
                >
                  Submit Current Round
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <CurrentHole />
      <div className="w-full px-4 flex flex-row justify-evenly">
        {currentHoleIndex === 18 && (
          <AlertDialog>
            <AlertDialogTrigger className="text-sm font-medium h-9 rounded-md px-4 text-md flex items-center justify-center bg-deep-forest text-dune-sand shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
              Submit Round
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-deep-forest border-2 border-dune-sand">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-dune-sand">
                  Finished your round?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-dune-sand">
                  Submit your round to track your stats and see how you did!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-dune-sand">
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => alert("Round submitted")}
                  className="bg-deep-forest border-2 border-dune-sand text-dune-sand"
                >
                  Complete Round
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
