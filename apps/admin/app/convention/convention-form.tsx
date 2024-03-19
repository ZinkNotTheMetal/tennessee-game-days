"use client";

import { ApiListResponse, IConvention } from "@repo/shared";
import { IVenue } from "@repo/shared/src/interfaces/venue";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { DateTime } from "ts-luxon";

interface ConventionFormProps {
  id?: number;
  convention?: IConvention;
}

export function ConventionForm({
  id,
  convention,
}: ConventionFormProps): JSX.Element {
  const [onSubmitting, setOnSubmitting] = useState<boolean>(false);
  const [isNewVenue, setIsNewVenue] = useState<boolean>(false)
  const [venueList, setVenueList] = useState<IVenue[]>([])
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_URL}/api/venue/list/`,
    {
      method: "GET"
    })
    .then((response) => {
      return response.json()
    })
    .then((json: ApiListResponse<IVenue>) => {
      setVenueList(json.list)
    })

  }, [])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IConvention>({
    values: {
      id: id || 0,
      name: convention?.name || '',
      isCancelled: convention?.isCancelled || false,
      venue: {
        id: convention?.venue?.id ?? -1,
        name: convention?.venue?.name ?? '',
        streetNumber: convention?.venue?.streetNumber ?? '',
        streetName: convention?.venue?.streetName ?? '',
        city: convention?.venue?.city ?? '',
        stateProvince: convention?.venue?.stateProvince ?? '',
        postalCode: convention?.venue?.postalCode ?? ''
      }
    },
  });

  const onSubmit: SubmitHandler<IConvention> = async (data) => {
    setOnSubmitting(true);

    // Updating
    if (data.id && data.id > 0) {
      fetch(`${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_URL}/api/convention/edit/${data.id}`,
      {
        method: "PUT",
        body: JSON.stringify(data)
      })
        .then((response) => {
          if (response.ok) {
            toast(
              `Successfully edited ${data.name}`,
              { type: "success" }
            );
          } else {
            toast(
              `Failed to edit ${data.name} convention (check the logs)`,
              { type: "error" }
            );
          }
        })
        .catch((error) => {
          console.log(error)
          toast(
            `Failed to edit ${data.name} convention (check the logs)`,
            { type: "error" }
          );
        });
    } else {
      fetch(`${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_URL}/api/convention/add`,
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      )
        .then((response) => {
          if (response.ok) {
            toast(
              `Successfully added ${data.name}`,
              { type: "success" }
            );
          } else {
            toast(
              `Failed to add ${data.name} convention (check the logs)`,
              { type: "error" }
            );
          }
        })
        .catch((error) => {
          console.log(error)
          toast(
            `Failed to add ${data.name} convention (check the logs)`,
            { type: "error" }
          );
        });
    }
    router.replace("/convention");
    router.refresh()
  };

  return (
    <form className="bg-white rounded-xl shadow-md p-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Convention Name</label>
        <input className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" {...register("name", { required: true })} />
        {errors.name && <span className="text-red-500">This field is required</span>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDateTime">Start Date</label>
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          type="datetime-local"
          {...register("startDateTimeUtc", { setValueAs: (value) => DateTime.fromISO(value).toUTC().toISO()} )}
          defaultValue={convention?.startDateTimeUtc && DateTime.fromISO(convention?.startDateTimeUtc).toFormat('yyyy-MM-dd HH:mm')}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDateTime">End Date</label>
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          type="datetime-local"
          {...register("endDateTimeUtc", { setValueAs: (value) => DateTime.fromISO(value).toUTC().toISO()} )}
          defaultValue={convention?.endDateTimeUtc && DateTime.fromISO(convention?.endDateTimeUtc).toFormat('yyyy-MM-dd HH:mm')}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDateTime">Extra hours for Hotel & Volunteer Start Time</label>
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          type="datetime-local"
          {...register("extraHoursStartDateTimeUtc", { setValueAs: (value) => DateTime.fromISO(value).toUTC().toISO()} )}
          defaultValue={convention?.extraHoursStartDateTimeUtc && DateTime.fromISO(convention?.extraHoursStartDateTimeUtc).toFormat('yyyy-MM-dd HH:mm')}
        />
      </div>

      {Boolean(id) && (
        <div className="mb-4">
          <input
            type="checkbox" 
            {...register('isCancelled')}
            id="isCancelled"
          />
          <label className="ml-2" htmlFor="isCancelled">Cancelled?</label>
        </div>
      )}

      {/* Check if this is a new record or not */}
      <div className="form-group">
        <label className="block text-gray-700 text-sm font-bold mb-2">Venue</label>
        <div className="button-wrapper mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsNewVenue((previous) => !previous)
              }}
              className={`w-full px-4 py-2 rounded-l focus:outline-none ${
                !isNewVenue ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Select existing venue
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsNewVenue((previous) => !previous)
              }}
              className={`w-full px-4 py-2 rounded-r focus:outline-none ${
                isNewVenue ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Enter new venue
            </button>
          </div>
        </div>
        
        {/* If new venue is selected */}
        { isNewVenue && (
          <>
            <div className="py-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="venue.name">Venue Name</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                {...register("venue.name", { required: true })}
              />
              {errors.venue?.name && <span className="text-red-500">This field is required</span>}
            </div>
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="streetNumber">Street Number</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  {...register("venue.streetNumber", { required: true })}
                />
                {errors.venue?.streetNumber && <span className="text-red-500">This field is required</span>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="streetName">Street Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  {...register("venue.streetName", { required: true })}
                />
                {errors.venue?.streetName && <span className="text-red-500">This field is required</span>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">City</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  {...register("venue.city", { required: true })}
                />
                {errors.venue?.city && <span className="text-red-500">This field is required</span>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stateProvince">State/Province</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  {...register("venue.stateProvince", { required: true })}
                />
                {errors.venue?.stateProvince && <span className="text-red-500">This field is required</span>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  {...register("venue.postalCode", { required: true })}
                />
                {errors.venue?.postalCode && <span className="text-red-500">This field is required</span>}
              </div>
            </div>

          </>
        )}
        { !isNewVenue && (
          <div className="relative w-full py-4 inline-block">
            <select
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              {...register("venue.id", { setValueAs: (value) => Number(value) })}
            >
              <option value="-1" disabled className="text-gray-500">Select a venue</option>
                {venueList.map(v => (
                  <option selected={v.id == convention?.venue?.id} key={v.id} value={v.id}>{v.name}</option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 fill-current text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="py-4 text-center">
        <button 
          className={`w-full bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full`}
          disabled={onSubmitting}
          type='submit'
        >
          {Boolean(id) ? 'Save' : 'Add'}
        </button>
      </div>
    </form>

  );
}
