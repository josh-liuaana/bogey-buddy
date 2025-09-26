import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "./App";

// Basic test to check if the App component renders correctly

describe("App", () => {
  it("App test suite correctly set up", () => {
    expect(true).toBe(true);

    render(<App />);
    const headingElement = screen.getByText(/bogey buddy/i);
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveClass("text-4xl", "font-bold");
  });
});
