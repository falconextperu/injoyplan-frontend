'use client';
import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useEventStore } from '@/app/zustand/events';
import EventDate from './event';
import DataEventSkeleton from '@/app/components/Skeletons/dataEvent';

const EventoPage = () => {

  const { getEventByEventAndDate, dataEvent, resetEvent }: any = useEventStore();

  const router = useParams();
  const { idEvento, idFecha } = router;

  // Track the current loading event to prevent showing stale data
  const currentEventRef = useRef<string | null>(null);

  useEffect(() => {
    // Reset data immediately when navigating to a new event
    const eventKey = `${idEvento}-${idFecha}`;
    if (currentEventRef.current !== eventKey) {
      resetEvent();
      currentEventRef.current = eventKey;
    }
    getEventByEventAndDate(idEvento, idFecha);
  }, [idEvento, idFecha, getEventByEventAndDate, resetEvent])

  if (dataEvent?.length === 0 || dataEvent === null) {
    return (
      <DataEventSkeleton />
    )
  }

  if (dataEvent?.length > 0) {
    const [{ data, dataFecha, dataPlataformaVenta, owner }] = dataEvent;

    return (
      <>
        <EventDate
          data={data}
          dataFecha={dataFecha}
          dataPlataformaVenta={dataPlataformaVenta}
          owner={owner}
        />
      </>
    );
  }



  return (
    <div></div>
  )

};

export default EventoPage;