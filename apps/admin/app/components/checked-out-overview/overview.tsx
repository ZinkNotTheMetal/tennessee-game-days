'use client'

import { useEffect, useState } from "react";
import { DateTime } from "ts-luxon";

interface CheckedOutItemRow {
  gameName: string
  checkOutTimeUtcIso: string
  attendeePreferredName: string
  attendeeLastName: string
}

export default function GameCheckoutItemOverview({ gameName, checkOutTimeUtcIso, attendeePreferredName, attendeeLastName }: CheckedOutItemRow): JSX.Element {
  const [elapsedTime, setElapsedTime] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(DateTime.fromISO(checkOutTimeUtcIso).toRelative({ base: DateTime.now(), style: 'short'}))
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [checkOutTimeUtcIso]);

  return (
    <>
      <span>{gameName} - {attendeePreferredName} {attendeeLastName}</span>
      <span>{elapsedTime}</span>
    </>
  );
}
