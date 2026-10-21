import { describe, expect, it } from "vitest";
import { filterBooks, type BookFiltersState } from "../App";
import { books } from "../data/books";

const defaultFilters: BookFiltersState = {
  searchTerm: "",
  selectedGenre: "all",
  readingStatus: "all"
};

describe("filterBooks", () => {
  it("matches title and author searches without depending on letter case", () => {
    const titleResults = filterBooks(books, {
      ...defaultFilters,
      searchTerm: "hobbit"
    });
    const authorResults = filterBooks(books, {
      ...defaultFilters,
      searchTerm: "URSULA K. LE GUIN"
    });

    expect(titleResults.map((book) => book.title)).toEqual(["The Hobbit"]);
    expect(authorResults.map((book) => book.title)).toEqual(["A Wizard of Earthsea"]);
  });

  it("filters by genre and reading status together", () => {
    const results = filterBooks(books, {
      ...defaultFilters,
      selectedGenre: "Fantasy",
      readingStatus: "unread"
    });

    expect(results.map((book) => book.title)).toEqual(["The Night Circus"]);
  });
});
