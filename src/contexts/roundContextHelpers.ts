import type {
  BasePutt,
  BaseStandardShot,
  Putt,
  ShotInformation,
  StandardShot,
} from "@/types/roundData";

export function getDateAndTimeStrings() {
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
  const currentTimeString = `${now.getHours()}:${formattedMinutes}:${formattedSeconds}`;
  return { currentDateString: now.toDateString(), currentTimeString };
}

export function normaliseShotData(shot: ShotInformation): ShotInformation {
  const { actualShotResult, intendedShotResult, ...rest } = shot;

  if (shot.shotCategory === "standard") {
    if (
      !isStandardShot(actualShotResult) ||
      !isBaseStandardShot(intendedShotResult)
    ) {
      throw new Error("Invalid standard shot data");
    }

    const standardActual: StandardShot = {
      ballFlight: actualShotResult.ballFlight,
      ballShape: actualShotResult.ballShape,
      swingType: actualShotResult.swingType,
      distanceToTarget: actualShotResult.distanceToTarget,
      directionToTarget: actualShotResult.directionToTarget,
      elevationChange: intendedShotResult.elevationChange,
    };

    const standardIntended: BaseStandardShot = {
      ballFlight: intendedShotResult.ballFlight,
      ballShape: intendedShotResult.ballShape,
      swingType: intendedShotResult.swingType,
      elevationChange: intendedShotResult.elevationChange,
    };

    return {
      ...rest,
      actualShotResult: standardActual,
      intendedShotResult: standardIntended,
    };
  } else {
    // shotCategory === "putt"
    if (!isPutt(actualShotResult) || !isBasePutt(intendedShotResult)) {
      throw new Error("Invalid putt shot data");
    }

    const puttActual: Putt = {
      distanceToTarget: actualShotResult.distanceToTarget,
      directionToTarget: actualShotResult.directionToTarget,
      missSide: actualShotResult.missSide,
      pace: actualShotResult.pace,
      read: actualShotResult.read,
    };

    const puttIntended: BasePutt = {
      pace: intendedShotResult.pace,
      read: intendedShotResult.read,
    };

    return {
      ...rest,
      actualShotResult: puttActual,
      intendedShotResult: puttIntended,
    };
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function isStandardShot(actual: any): actual is StandardShot {
  return actual && typeof actual.ballFlight === "string";
}

function isBaseStandardShot(intended: any): intended is BaseStandardShot {
  return intended && typeof intended.ballFlight === "string";
}

function isPutt(actual: any): actual is Putt {
  return actual && "missSide" in actual;
}

function isBasePutt(intended: any): intended is BasePutt {
  return intended && "pace" in intended;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
