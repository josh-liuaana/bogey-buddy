import { FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { CurrentHole } from "@/components/CurrentHole";
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
import { useRound } from "@/contexts/RoundContext";

export function CurrentRound() {
  const { currentRound, currentHoleIndex, endRound, abandonRound } = useRound();
  const navigate = useNavigate();

  if (!currentRound) {
    return <p>No active round. Please start one first.</p>;
  }

  const handleRoundCompletion = async () => {
    alert("Round completed!");
    const result = await endRound();
    navigate("/round-summary", { state: result });
  };

  const handleRoundDelete = () => {
    alert("Round abandoned!");
    abandonRound();
    navigate("/");
  };

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
                  onClick={handleRoundDelete}
                  className="bg-red-500"
                >
                  Delete
                </AlertDialogAction>
                <AlertDialogAction
                  onClick={handleRoundCompletion}
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
                  onClick={handleRoundCompletion}
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
