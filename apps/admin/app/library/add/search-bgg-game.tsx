"use client";

import BoardGameGeekResults from "@/app/components/bgg-game-table/results-table";
import Search from "@/app/components/search/search";
import useBoardGameGeekSearch from "@/app/hooks/useBggSearch";
import { ChangeEvent, useEffect, useState } from "react";
import AddBggGameToLibrary from "./add-bgg-game-to-library";
import { IBoardGameGeekEntity } from "@repo/board-game-geek-shared";

export default function UserSearchBggGame(): JSX.Element {
  const [search, setSearch] = useState<{ query: string; searchById: boolean }>({
    query: "",
    searchById: false,
  } as { query: string; searchById: boolean });

  const [isLoading, debounced, resultsCount, results, error] = useBoardGameGeekSearch(
    search.query,
    search.searchById
  );
  const [gameSelected, setGameSelected] = useState<IBoardGameGeekEntity | undefined>(undefined)

  useEffect(() => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      query: "",
    }));
  }, [search.searchById])

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    debounced(value)

    if (!search.searchById || /^\d*$/.test(value)) {
      setSearch((prevSearch) => ({
        ...prevSearch,
        query: value,
      })); 
    }
  }

  return (
    <>
      {gameSelected === undefined && (
        <>
          <div className="flex justify-end px-1 py-2 bg-gray-200">
            <label htmlFor="toggle" className="flex items-center cursor-pointer">
              <div
                className={`relative ${search.searchById ? "bg-green-500" : "bg-gray-600"} w-14 h-8 rounded-full`}
              >
                <input
                  id="toggle"
                  type="checkbox"
                  className="hidden"
                  checked={search.searchById}
                  onChange={() => {
                    setSearch((prevSearch) => ({
                      ...prevSearch,
                      searchById: !search.searchById,
                    }));
                  }}
                />
                <div
                  className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                    search.searchById ? "transform translate-x-6" : ""
                  }`}
                ></div>
              </div>
              <div className="ml-3 text-gray-700 font-medium">Search by BGG ID</div>
            </label>
            {/* Search Board Game Geek search bar */}
          </div>
          <div>
            <Search
              onChange={(e) => { handleSearchInputChange(e) }}
              placeholder="Search Board Game Geek..."
              value={search.query}
            />
          </div>
          {Boolean(isLoading) && (
            <div className="text-center">
              <div className="absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2 ">
                <div className="border-t-transparent border-solid animate-spin rounded-full border-blue-400 border-8 h-16 w-16" />
              </div>
              <span>Loading Bgg Results...</span>
            </div>
          )}
          {/* BGG Results */}
          {!isLoading && (
            <BoardGameGeekResults bggResults={{results: results, totalCount: resultsCount}} setItemToAdd={setGameSelected} />
          )}
        </>
      )}

      {gameSelected !== undefined && (
        <AddBggGameToLibrary clear={() => setGameSelected(undefined)} gameSelected={gameSelected} />
      )}
      
    </>
  );
}
