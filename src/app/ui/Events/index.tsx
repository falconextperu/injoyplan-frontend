import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IEventsState, useEventStore } from '../../zustand/events'
import { IAuthState, useAuthStore } from '../../zustand/auth'
import { IFavoriteState, useFavoriteStore } from '../../zustand/favorites'
import Card from '@/app/components/Card'
import CardSkeleton from '@/app/components/CardSkeleton'
import { Event } from '@/app/interfaces/event'

const Events = ({ setPage, setOpenAuth }: any) => {
    const router = useRouter();
    const [clickCount, setClickCount] = useState(0);

    const { events, isLoading }: IEventsState = useEventStore();
    const { auth }: IAuthState = useAuthStore();
    const { addFavorite, deleteFavorite }: IFavoriteState = useFavoriteStore();

    const addFavoritesByUser = (item: any) => {
        if (item.favorito || item.esfavorito === 1) {
            deleteFavorite(item)
        } else {
            addFavorite(item)
        }
    }

    const handleLoadMore = () => {
        if (clickCount >= 2) {
            router.push('/busqueda/0');
        } else {
            setClickCount(prev => prev + 1);
            setPage((prevPage: any) => prevPage + 1);
        }
    };

    return (
        <div className='bg-[#fff]'>

            <div className="2xl:max-w-screen-2xl xl:max-w-screen-xl max-w-[980px] mx-auto mt-6 xl:px-10 px-5">
                <div className="md:px-0">
                    <div className='md:pt-16 pt-6'>
                        <h2 className='text-3xl mb-8 font-bold text-[#444444] md:text-[#212121]'>Eventos para ti</h2>
                    </div>
                    <div className="grid auto-cols-min grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {
                            isLoading && events.length === 0 ? (
                                // Show skeletons on initial load (or if cache empty)
                                Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
                            ) : events.length === 0 ? (
                                // No events
                                <div className="col-span-full text-center py-10 text-gray-500">No hay eventos disponibles.</div>
                            ) : (
                                events.map((item: Event, index: number) => {
                                    return (
                                        <Card item={item} key={`${item?.idEventos || item?.ideventos}-${item?.idfecha}`} addFavoritesByUser={addFavoritesByUser} />
                                    )
                                })
                            )
                        }
                    </div>
                    {/* Append Skeletons when loading more data (if we want that effect, but store clears events currently so skeletons replace list. 
                        Ideally we append skeletons to list. But current logic replaces array. Keep it simple: Skeletons show when loading. 
                    */}
                    {isLoading && events.length > 0 && (
                        // If we are loading MORE events effectively
                        <div className="grid auto-cols-min grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-5">
                            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={`skeleton-append-${i}`} />)}
                        </div>
                    )}

                    <div className='text-[#007fa4] font-bold flex justify-center mt-10 mb-10 border-2 border-solid border-[#007FA4] p-2 w-fit mx-auto rounded-full px-16'>
                        <button onClick={handleLoadMore} disabled={isLoading} type="submit">
                            {isLoading ? 'CARGANDO...' : clickCount >= 2 ? 'IR AL BUSCADOR' : 'VER MÁS EVENTOS'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Events
