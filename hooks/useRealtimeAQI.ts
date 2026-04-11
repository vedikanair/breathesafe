"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import type { AQIRecord } from "@/types/database";

/**
 * Real-time subscription hook for AQI record updates.
 * Subscribes to INSERT events on the aqi_record table.
 */
export function useRealtimeAQI(
  stationId?: string,
  onNewRecord?: (record: AQIRecord) => void
) {
  const [latestRecord, setLatestRecord] = useState<AQIRecord | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const handleNewRecord = useCallback(
    (record: AQIRecord) => {
      setLatestRecord(record);
      onNewRecord?.(record);
    },
    [onNewRecord]
  );

  useEffect(() => {
    // Only subscribe if Supabase is configured
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return;
    }

    const filter = stationId
      ? `station_id=eq.${stationId}`
      : undefined;

    const channel = supabase
      .channel("aqi-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "aqi_record",
          filter,
        },
        (payload) => {
          handleNewRecord(payload.new as AQIRecord);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [stationId, handleNewRecord]);

  return { latestRecord, isConnected };
}
