'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DateTime } from "ts-luxon";

interface CheckedOutItemRow {
  id: number
  gameName: string
  checkOutTimeUtcIso: string
  attendeePreferredName: string
  attendeeLastName: string
  attendeeBadgeNumber: string
}

export default function GameCheckoutItemOverview({ id, gameName, checkOutTimeUtcIso, attendeePreferredName, attendeeLastName, attendeeBadgeNumber }: CheckedOutItemRow): JSX.Element {
  const [elapsedTime, setElapsedTime] = useState<string>('');
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(DateTime.fromISO(checkOutTimeUtcIso).toRelative({ base: DateTime.now(), style: 'short'}))
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [checkOutTimeUtcIso]);

  return (
    <div className="flex justify-between hover:bg-slate-300 cursor-pointer px-1" onClick={() => router.push(`/library/edit/${id}`)}>
      <span>{gameName} - {attendeePreferredName} {attendeeLastName} ({attendeeBadgeNumber})</span>
      <span>{elapsedTime}</span>
    </div>
  );
}
