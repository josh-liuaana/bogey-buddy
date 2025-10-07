import { CurrentShot } from "@/components/CurrentShot";

import { Button } from "../ui/button";

export function CurrentHole() {
  return (
    <div className="border-2 m-4">
      <h1>Current Hole</h1>

      <p>Hole Number</p>
      <CurrentShot />
      <Button>End Hole</Button>
    </div>
  );
}
