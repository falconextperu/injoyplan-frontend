'use client';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useEventStore } from '@/app/zustand/events';
import EventDate from './event';
import DataEventSkeleton from '@/app/components/Skeletons/dataEvent';

const EventoPage = () => {

  const { getEventByEventAndDate, dataEvent }: any = useEventStore();

  console.log(dataEvent)

  const router = useParams();
  const { idEvento, idFecha } = router;

  useEffect(() => {
    getEventByEventAndDate(idEvento, idFecha)
  }, [idEvento, idFecha])

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