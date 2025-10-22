import type { CurrentRound } from "@/types/course";
import type { RoundData, ShotInformation } from "@/types/roundData";
import { log } from "@/utils/logger";

export const ROUND_STORAGE_KEY = "bogeyBuddyCurrentRound";

interface LocalStorageState {
  currentRound: CurrentRound | null;
  roundData: RoundData | undefined;
  currentHoleIndex: number;
  currentShotIndex: number;
  shotInformation: ShotInformation;
}

/**
 * Loads the bogeyBuddyCurrentRound state from localStorage.
 * @returns {LocalStorageState | null} The loaded state or null if no local state is found/valid.
 */
export function loadLocalStorageState(): LocalStorageState | null {
  try {
    const serializedState = window.localStorage.getItem(ROUND_STORAGE_KEY);
    if (serializedState === null) {
      return null;
    }
    const localStorageCurrentRound = JSON.parse(serializedState);
    return localStorageCurrentRound as LocalStorageState;
  } catch (e) {
    console.warn(
      "⚠️ Could not load or parse a current round from localStorage. Clearing corrupted data.",
      e,
    );
    // Clear any corrupted or malformed data
    window.localStorage.removeItem(ROUND_STORAGE_KEY);
    return null;
  }
}

/**
 * Saves the current round state to localStorage.
 * @param {LocalStorageState} state - The entire state object to persist.
 */
export function saveLocalStorageState(state: LocalStorageState): void {
  try {
    const serializedState = JSON.stringify(state);
    window.localStorage.setItem(ROUND_STORAGE_KEY, serializedState);
    log("localStorage", "Current round saved to localStorage."); // Use for debugging
  } catch (e) {
    console.error("❌ Error saving round data to localStorage:", e);
  }
}

/**
 * Clears the round state from localStorage.
 */
export function clearLocalStorageState(): void {
  window.localStorage.removeItem(ROUND_STORAGE_KEY);
  log("localStorage", "Local round cleared.");
}
