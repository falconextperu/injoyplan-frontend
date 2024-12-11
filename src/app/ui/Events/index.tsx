import styles from './events.module.css'
import { IEventsState, useEventStore } from '../../zustand/events'
import { IAuthState, useAuthStore } from '../../zustand/auth'
import { IFavoriteState, useFavoriteStore } from '../../zustand/favorites'
import Card from '@/app/components/Card'
import { Event } from '@/app/interfaces/event'

const Events = ({ setPage, setOpenAuth }: any) => {

    const { events }: IEventsState = useEventStore();
    const { auth }: IAuthState = useAuthStore();
    const { addFavorite, deleteFavorite }: IFavoriteState = useFavoriteStore();

    console.log(events)
    const eventsNoDestacades = events?.filter((item: any) => item.Destacado === 0);
    console.log(eventsNoDestacades)

    const addFavoritesByUser = (item: any) => {
        if (auth) {
            console.log(item)
            if (item.esfavorito === 1) {
                deleteFavorite(item)
            } else {
                const data = {
                    idEvento: item.ideventos,
                    idFecha: item.idfecha,
                    registrado: false
                }
                addFavorite(data)
            }
        } else {
            setOpenAuth(true)
        }
    }

    return (
        <div className='bg-[#fff]'>
            <div className="2xl:max-w-screen-2xl xl:max-w-screen-xl max-w-[980px] mx-auto mt-6 xl:px-10 px-5">
                <div className="md:px-0">
                    <div className='md:pt-16 pt-6'>
                        <h2 className='text-3xl mb-8 font-bold text-[#444444] md:text-[#212121]'>Más eventos para ti</h2>
                    </div>
                    <div className="grid auto-cols-min grid-cols-1 gap-5 md:grid-cols-3 xl:grid-cols-4">
                        {
                            eventsNoDestacades.map((item: Event, index: number) => {
                                return (
                                   <Card item={item} key={index} addFavoritesByUser={addFavoritesByUser} />
                                )
                            })
                        }
                    </div>
                    <div className='text-[#007fa4] font-bold flex justify-center mt-10 mb-10 border-2 border-solid border-[#007FA4] p-2 w-fit mx-auto rounded-full px-16'>
                        <button onClick={() => setPage((page: any) => page + 12)} type="submit">VER MÁS EVENTOS</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Events
