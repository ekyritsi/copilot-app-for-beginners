import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";

afterEach(cleanup);

function getControls() {
  return {
    search: screen.getByRole("searchbox", { name: /search/i }) as HTMLInputElement,
    genre: screen.getByRole("combobox", { name: /genre/i }) as HTMLSelectElement,
    status: screen.getByRole("combobox", { name: /status/i }) as HTMLSelectElement,
    clearButton: screen.getByRole("button", { name: /clear filters/i }) as HTMLButtonElement
  };
}

describe("Clear filters button", () => {
  it("is visible and disabled when the app first loads", () => {
    render(<App />);

    const { clearButton } = getControls();
    expect(clearButton).toBeTruthy();
    expect(clearButton.disabled).toBe(true);
  });

  it("becomes enabled after any filter changes", async () => {
    const user = userEvent.setup();
    render(<App />);
    const { genre, status, clearButton } = getControls();

    await user.selectOptions(genre, "Fantasy");
    expect(clearButton.disabled).toBe(false);

    await user.click(clearButton);
    await user.selectOptions(status, "unread");
    expect(clearButton.disabled).toBe(false);
  });

  it("resets search, genre, and status and shows every book again", async () => {
    const user = userEvent.setup();
    render(<App />);
    const { search, genre, status, clearButton } = getControls();

    await user.type(search, "Hobbit");
    await user.selectOptions(genre, "Fantasy");
    await user.selectOptions(status, "read");
    expect(screen.getByRole("heading", { name: "1 books shown" })).toBeTruthy();

    await user.click(clearButton);

    expect(search.value).toBe("");
    expect(genre.value).toBe("all");
    expect(status.value).toBe("all");
    expect(screen.getByRole("heading", { name: "12 books shown" })).toBeTruthy();
    expect(clearButton.disabled).toBe(true);
  });

  it("stays disabled when the search box only contains spaces", async () => {
    const user = userEvent.setup();
    render(<App />);
    const { search, clearButton } = getControls();

    await user.type(search, "   ");

    expect(clearButton.disabled).toBe(true);
  });
});
