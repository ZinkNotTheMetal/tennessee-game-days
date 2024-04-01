"use client";

import { IPlayToWinItem } from "@repo/shared";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FormatBoardGameGeekType } from "../components/bgg-type/format-type";
import useBoardGameGeekSearch from "../hooks/useBggSearch";
import { IBoardGameGeekEntity } from "@repo/board-game-geek-shared";
import { FaTimesCircle } from "react-icons/fa";
import { ImSpinner3 } from "react-icons/im";

interface PlayToWinItemFormProps {
  // As of now this will always be set (no adding functionality through UI yet)
  // set back to ? if we add that in the future
  id: number;
  playToWinItem: IPlayToWinItem;
}

export function PlayToWinItemForm({
  id,
  playToWinItem,
}: PlayToWinItemFormProps) : JSX.Element {
  const [searchBggQuery, setSearchBggQuery] = useState<string>('')
  const [isLoading, debounced, resultsCount, results, error] = useBoardGameGeekSearch(
    searchBggQuery,
    false
  );
  const [onSubmitting, setOnSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const { boardGameGeekThing, ...rest } = playToWinItem;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IPlayToWinItem>({
    values: {
      ...rest,
      boardGameGeekThing,
    },
  })

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchBggQuery(value)
    debounced(value)
  }

  const fixBoardGameGeekId = (bggEntity?: IBoardGameGeekEntity) => {
    // If one is passed in the user is selecting it
    if (bggEntity) {
      playToWinItem.boardGameGeekId = bggEntity.id
      playToWinItem.boardGameGeekThing = bggEntity
    } else {
      // the user is trying to deselect it
      playToWinItem.boardGameGeekId = undefined
      playToWinItem.boardGameGeekThing = undefined
    }
    setSearchBggQuery('')

    reset(playToWinItem)

  }
  
  const onSubmit: SubmitHandler<IPlayToWinItem> = async (data) => {
    setOnSubmitting(true);

    // At the moment we are only editing play to win games
    // If we change to adding as well we need to follow library items for the if (data.id && data.id > 0) {
    fetch(`/api/play-to-win/edit/${data.id}`,
    {
      method: "PUT",
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (response.ok) {
          toast(
            `Successfully edited ${data.gameName}`,
            { type: "success" }
          );
        } else {
          toast(
            `Failed to edit ${data.gameName} play-to-win game (check the logs)`,
            { type: "error" }
          );
        }
      })
      .catch((error) => {
        console.log(error)
        toast(
          `Failed to edit ${data.gameName} play-to-win game (check the logs)`,
          { type: "error" }
        );
      });

    router.replace("/play-to-win");
    router.refresh()
  }

  return(
    <form className="bg-white rounded-xl" onSubmit={handleSubmit(onSubmit)}>
      {/* Similar to library item let's show the art name and year published if we have it */}
      {Boolean(playToWinItem.boardGameGeekId) && boardGameGeekThing && (
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="col-span-1 px-10 flex justify-center items-center">
            <div className="relative h-64 w-56">
              <Image
                src={boardGameGeekThing.imageUrl}
                alt={`Image for ${boardGameGeekThing.itemName}`}
                priority={true}
                fill={true}
                className="rounded"
              />
            </div>
          </div>

          <div className="col-span-2 p-4">

          <div className="pb-3">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 italic"
              htmlFor="name"
            >
              Board Game Geek Id
            </label>
            <label className="pl-1 flex items-center">
              <span>{boardGameGeekThing.id}</span>
              <FaTimesCircle
                className="text-red-500 ml-2 cursor-pointer"
                size={20} // Adjust the size of the icon
                onClick={() => fixBoardGameGeekId()}
              />
            </label>
          </div>

          <div className="pb-3">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 italic"
              htmlFor="name"
            >
              Year Published
            </label>
            <label className="pl-1">{boardGameGeekThing.yearPublished}</label>
          </div>

          <div className="pb-3">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 italic"
              htmlFor="name"
            >
              Type
            </label>
            <label className="pl-1">{FormatBoardGameGeekType(boardGameGeekThing.type)}</label>
          </div>

          </div>
        </div>
      )}

      <div className="px-2 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 px-2">
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="itemType"
            >
              Barcode
            </label>
            <input
              className={`w-full p-2 border ${errors?.barcode ? "border-red-600" : "border-gray-300"} rounded`}
              {...register("barcode", { required: true })}
            />
            {errors.barcode && (
              <span className="text-red-600">
                Barcode is required for play to win item!
              </span>
            )}
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="itemType"
            >
              Game Name
            </label>
            <input
              className={`w-full p-2 border ${errors?.gameName ? "border-red-600" : "border-gray-300"} rounded`}
              {...register("gameName", { required: true })}
            />
            {errors.gameName && (
              <span className="text-red-600">
                Game Name is required for play to win item
              </span>
            )}
          </div>
        </div>

        {!Boolean(playToWinItem.boardGameGeekId) && (
          <div className="relative p-2">
            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Search Board Game Geek..."
              onChange={handleSearchInputChange}
            />
            { isLoading && (
              <span className="p-1">
                <ImSpinner3 className="animate-spin" />
              </span>
            )}
            {searchBggQuery && !isLoading && (
              <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white rounded-md shadow-lg">
                { results.map((result) => (
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white w-full text-left"
                    role="option"
                    onClick={(e) => {
                      e.preventDefault()
                      fixBoardGameGeekId(result)
                    }}
                    key={result.id}
                  >
                    {result.itemName}
                  </button>
                ))}
              </div>
            )}
          </div>

        )}

        {Boolean(playToWinItem.boardGameGeekId) && boardGameGeekThing && (
          <div className="px-2 py-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Game Description
            </label>
            <textarea
              className="resize-y w-full h-64 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={boardGameGeekThing.description}
              {...register("boardGameGeekThing.description")}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemType">
                  Minimum Players
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  {...register("boardGameGeekThing.minimumPlayerCount")}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemType">
                  Maximum Players
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  {...register("boardGameGeekThing.maximumPlayerCount")}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemType">
                  Minimum Player Age
                </label>
                <input
                  className="w-full p-2 border border-gray-300 bg-gray-200 rounded"
                  disabled
                  {...register("boardGameGeekThing.minimumPlayerAge")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemType">
                  Best Voted Player Count
                </label>
                <label className="pl-1">{boardGameGeekThing.votedBestPlayerCount}</label>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemType">
                  Average Rating
                </label>
                <label className="pl-1">{boardGameGeekThing.averageUserRating}</label>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemType">
                  Complexity Rating
                </label>
                <label className="pl-1">{boardGameGeekThing.complexityRating}</label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemType">
                  Playing Time
                </label>
                <label className="pl-1">{boardGameGeekThing.playingTimeMinutes} minutes</label>
              </div>
              
              {boardGameGeekThing.ranking && (
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemType">
                    Board Game Geek Ranking
                  </label>
                  <label className="pl-1">{boardGameGeekThing.ranking}</label>
                </div>
              )}
            </div>
          </div>
        )}

        {Boolean(playToWinItem.boardGameGeekId) && boardGameGeekThing &&
          <>
            <hr />

            <div className="p-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="itemType"
              >
                Game Mechanics
              </label>
              <ul className="list-disc list-inside px-2">
                {boardGameGeekThing.mechanics.map((gm, index) => (
                  <li key={index} id={String(gm.id)} className="mb-1">
                    {gm.name}
                  </li>
                ))}
              </ul>
            </div>
          </>
        }

        <hr />

        <div className="pl-2 pt-2 flex gap-2">
          <input type="checkbox" {...register("isHidden")} />
          <label className="" htmlFor="IsHidden">
            Hide game?
          </label>
        </div>

        <div className="pl-2 pt-8">
          <div className="flex items-center">
            <label htmlFor="totalTimesPlayed" className="text-gray-700 text-sm font-bold mr-2">Total Times Played:</label>
            <span id="totalTimesPlayed" className="text-gray-700">{playToWinItem.totalTimesPlayed}</span>
          </div>
        </div>

        <div className="pt-8 text-center pb-12">
          <button
            className={`${onSubmitting ? "opacity-50 cursor-not-allowed" : ""} bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full`}
            disabled={onSubmitting}
            type="submit"
          >
            Update
          </button>
        </div>

      </div>

    </form>
  )

}