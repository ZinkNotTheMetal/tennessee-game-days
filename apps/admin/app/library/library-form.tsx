"use client";

import { useRouter } from "next/navigation";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import { ICheckoutEvent, ILibraryItem } from "@repo/shared";
import { FormatBoardGameGeekType } from "../components/bgg-type/format-type";
import { DateTime } from "ts-luxon";

interface LibraryFormProps {
  id?: number;
  libraryItem: ILibraryItem;
}

function DisplayLastCheckedInTime(checkoutEvents: ICheckoutEvent[]) {
  
  if (checkoutEvents.length === 0) return 'No one has checked out this game'

  const lastCheckedIn = checkoutEvents.find(f => f.checkedInTimeUtcIso !== null)?.checkedInTimeUtcIso

  if (lastCheckedIn === undefined) return 'Checked out - but not checked back in yet'

  return DateTime.fromISO(lastCheckedIn).toLocal().toFormat('MM/dd/yyyy t')
}

export function LibraryForm({
  id,
  libraryItem,
}: LibraryFormProps): JSX.Element {
  const [onSubmitting, setOnSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const { boardGameGeekThing, ...rest } = libraryItem;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ILibraryItem>({
    values: {
      ...rest,
      boardGameGeekThing,
    },
  })

  const onSubmit: SubmitHandler<ILibraryItem> = async (data) => {
    setOnSubmitting(true);
    // Updating
    if (data.id && data.id > 0) {
      fetch(`/api/library/edit/${data.id}`,
      {
        method: "PUT",
        body: JSON.stringify(data)
      })
        .then((response) => {
          if (response.ok) {
            toast(
              `Successfully edited ${data.boardGameGeekThing.itemName}`,
              { type: "success" }
            );
          } else {
            toast(
              `Failed to edit ${data.boardGameGeekThing.itemName} to the library (check the logs)`,
              { type: "error" }
            );
          }
        })
        .catch((error) => {
          console.log(error)
          toast(
            `Failed to edit ${data.boardGameGeekThing.itemName} to the library (check the logs)`,
            { type: "error" }
          );
        });
    } else {
      fetch(`/api/library/add`,
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      )
        .then((response) => {
          if (response.ok) {
            toast(
              `Successfully added ${data.boardGameGeekThing.itemName} to the library`,
              { type: "success" }
            );
          } else {
            toast(
              `Failed to add ${data.boardGameGeekThing.itemName} to the library (check the logs)`,
              { type: "error" }
            );
          }
        })
        .catch((error) => {
          console.log(error)
          toast(
            `Failed to add ${data.boardGameGeekThing.itemName} to the library (check the logs)`,
            { type: "error" }
          );
        });
    }
    router.replace("/library");
    router.refresh()
  };

  return (
    <form className="bg-white rounded-xl" onSubmit={handleSubmit(onSubmit)}>
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

        {/* Game Name */}
        <div className="col-span-2 p-4">
          <div className="pb-3">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 italic"
              htmlFor="name"
            >
              Name
            </label>
            <label>{boardGameGeekThing.itemName}</label>
          </div>

          <div className="pb-3">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 italic"
              htmlFor="name"
            >
              Year Published
            </label>
            <label>{boardGameGeekThing.yearPublished}</label>
          </div>

          <div className="pt-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Alias
            </label>
            <input
              className={`w-full p-2 border border-gray-300 rounded`}
              {...register("alias")}
            />
            <span className="text-sm text-red-500">
              This allows you to change the name in the library
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
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
                Barcode is required to add item to library
              </span>
            )}
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="itemType"
            >
              Owner
            </label>
            <input
              className={`w-full p-2 border ${errors?.owner ? "border-red-600" : "border-gray-300"} rounded`}
              {...register("owner", { required: true })}
            />
            {errors.owner && (
              <span className="text-red-600">
                Owner is required to add item to library
              </span>
            )}
          </div>
        </div>

        {/* Game Description */}
        <div className="p-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Game Description
          </label>
          <textarea
            className="resize-y w-full h-64 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={boardGameGeekThing.description}
            {...register("boardGameGeekThing.description")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {/* Board Game Type */}
          <div className="p-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="itemType"
            >
              Board Game Type
            </label>
            <input
              className="w-full p-2 border border-gray-300 bg-slate-200 rounded"
              disabled
              value={FormatBoardGameGeekType(boardGameGeekThing.type)}
            />
          </div>

          {/* Minimum Players */}
          <div className="p-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="itemType"
            >
              Minimum Players
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              {...register("boardGameGeekThing.minimumPlayerCount")}
            />
          </div>

          {/* Maximum Player */}
          <div className="p-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="itemType"
            >
              Maximum Players
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              {...register("boardGameGeekThing.maximumPlayerCount")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {/* Best Voted Player Count */}
          <div className="p-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="itemType"
            >
              Best Voted Player Count
            </label>
            <input
              className="w-full p-2 border border-gray-300 bg-gray-200 rounded"
              disabled
              {...register("boardGameGeekThing.votedBestPlayerCount")}
            />
          </div>

          {/* Average Rating */}
          <div className="p-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="itemType"
            >
              Average Rating
            </label>
            <input
              className="w-full p-2 border border-gray-300 bg-gray-200 rounded"
              disabled
              {...register("boardGameGeekThing.averageUserRating")}
            />
          </div>

          {/* Average Complexity */}
          <div className="p-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="itemType"
            >
              Complexity Rating
            </label>
            <input
              className="w-full p-2 border border-gray-300 bg-gray-200 rounded"
              disabled
              {...register("boardGameGeekThing.complexityRating")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {/* Minimum Player Age */}
          <div className="p-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="itemType"
            >
              Minimum Player Age
            </label>
            <input
              className="w-full p-2 border border-gray-300 bg-gray-200 rounded"
              disabled
              {...register("boardGameGeekThing.minimumPlayerAge")}
            />
          </div>

          {/* PlayingTime */}
          <div className="p-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="itemType"
            >
              Playing Time
            </label>
            <input
              className="w-full p-2 border border-gray-300 bg-gray-200 rounded"
              disabled
              {...register("boardGameGeekThing.playingTimeMinutes")}
            />
          </div>

          {/* Average Complexity */}
          <div className="p-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="itemType"
            >
              Board Game Geek Ranking
            </label>
            <input
              className="w-full p-2 border border-gray-300 bg-gray-200 rounded"
              disabled
              {...register("boardGameGeekThing.ranking")}
            />
          </div>
        </div>
      </div>

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

      {Boolean(id) && (
        <>
          <hr />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {/* PlayingTime */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="itemType"
              >
                Total amount of times checked out
              </label>
              <span className="">{libraryItem.checkOutEvents.length}</span>
            </div>

            {/* Total Minutes checked out */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="itemType"
              >
                Total Checkout Time (minutes)
              </label>
              <span className="">{libraryItem.totalCheckedOutMinutes}</span>
            </div>

            {/* Total Minutes checked out */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="itemType"
              >
                Last Time Checked In
              </label>
              <span className="">
                { DisplayLastCheckedInTime(libraryItem.checkOutEvents) }
              </span>
            </div>
          </div>
        </>
      )}

      <div className="pl-4 pt-2 flex gap-2">
        <input type="checkbox" {...register("isHidden")} />
        <label className="" htmlFor="IsHidden">
          Hide game from library?
        </label>
      </div>

      <div className="pt-8 text-center pb-12">
        <button
          className={`${onSubmitting ? "opacity-50 cursor-not-allowed" : ""} bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full`}
          disabled={onSubmitting}
          type="submit"
        >
          {Boolean(id) && <>Update</>}
          {Boolean(!id) && <>Add to library</>}
        </button>
      </div>
    </form>
  );
}
