import styles from './card.module.css'
import { Dispatch } from 'react'
import { IEventsState, useEventStore } from '../../zustand/events'
import { IAuthState, useAuthStore } from '../../zustand/auth'
import { IFavoriteState, useFavoriteStore } from '../../zustand/favorites'
import Card from '@/app/components/Card'
import { Event } from '@/app/interfaces/event'


interface IProps {
    setOpenAuth: Dispatch<boolean>
}

const EventsFeatured = ({ setOpenAuth }: IProps) => {

    // const { events }: IEventsState = useEventStore();
    const { auth }: IAuthState = useAuthStore();
    const { addFavorite, deleteFavorite }: IFavoriteState = useFavoriteStore();
    const { eventsDestacades } = useEventStore();

    const addFavoritesByUser = (item: any) => {
        if (auth) {
            console.log(item)
            if (item.favorito || item.esfavorito === 1) {
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

    console.log(eventsDestacades)

    return (
        <>
            {
                eventsDestacades?.length > 0 && (
                    <div className='bg-[#FAFBFF] pb-[80px]'>
                        <div className="2xl:max-w-screen-2xl xl:max-w-screen-xl max-w-[980px] mx-auto md:mt-16 mt-8 xl:px-10 px-5">
                            <div className="md:px-0">
                                <div className='md:pt-12 pt-10'>
                                    <h2 className='text-3xl mb-8 font-bold text-[#444444] md:text-[#212121]'>Eventos destacados</h2>
                                </div>
                                <div className="grid auto-cols-min grid-cols-1 gap-5 2xl:grid-cols-3 xl:grid-cols-3 md:grid-cols-3">
                                    {
                                        eventsDestacades.map((item: any, index: number) => {
                                            return (
                                                <Card item={item} key={index} addFavoritesByUser={addFavoritesByUser} />
                                            )
                                        })
                                    }
                                </div>
                                <div className={styles.button__moreEvents}>
                                    {/* <button onClick={() => setPage((page: any) => page + 12)} type="submit">VER MÁS EVENTOS</button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default EventsFeatured