import { create } from "zustand";

type SearchState = {
  suggestions: string[];
  isLoading: boolean;
  getSuggestions: (searchText: string) => void;
  clearSuggestions: () => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  suggestions: [],
  isLoading: true,
  getSuggestions: async (searchText: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/Product/search-suggestions/${searchText}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const responseData: ApiResponse<string[]> = await res.json();
      const { data, success, message } = responseData;
      set({
        suggestions: data,
      });
    } catch (err) {
      set((prev) => ({ ...prev, isLoading: false }));
    }
  },
  clearSuggestions: () =>
    set({
      suggestions: undefined,
    }),
}));
