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

    const events = [
        {
            "esfavorito": 0,
            "favorito": null,
            "HoraInicio": "19:30",
            "HoraFinal": "22:00",
            "FechaInicio": "2024-11-21T05:00:00.000Z",
            "inBanner": null,
            "ideventos": 2585,
            "titulo": "Toma tu Tomate",
            "NombreLocal": "Jazz Zone",
            "urlFuente": "www.joinnus.com/events/stand-up/lima-toma-tu-tomate-59560",
            "url": "https://res.cloudinary.com/do4rokki9/image/upload/v1698546547/InjoyPlan/fotos/Toma_tu_Tomate.jpg",
            "Monto": 25,
            "Destacado": 1,
            "categoria_id": 2,
            "EsGratis": 1,
            "Distrito": "15",
            "estado": null,
            "idfecha": 1907,
            "usuario_id": 1
        },
        {
            "esfavorito": 0,
            "favorito": null,
            "HoraInicio": "19:30",
            "HoraFinal": "22:00",
            "FechaInicio": "2024-11-21T05:00:00.000Z",
            "inBanner": null,
            "ideventos": 2364,
            "titulo": "La COMBI-NATION: Magia, Stand-up y Fiesta - Segunda Fecha",
            "NombreLocal": "Círculo Militar del Perú",
            "urlFuente": "www.joinnus.com/events/stand-up/lima-la-combination-magia-standup-y-fiesta-segunda-fecha-59016",
            "url": "https://res.cloudinary.com/do4rokki9/image/upload/v1701984024/InjoyPlan/fotos/La_COMBI-NATION_Magia_Stand-up_y_Fiesta_-_Segunda_Fecha.jpg",
            "Monto": 0,
            "Destacado": 1,
            "categoria_id": 2,
            "EsGratis": 2,
            "Distrito": "33",
            "estado": null,
            "idfecha": 1399,
            "usuario_id": 1
        },
        {
            "esfavorito": 0,
            "favorito": null,
            "HoraInicio": "20:00",
            "HoraFinal": "22:00",
            "FechaInicio": "2024-11-21T05:00:00.000Z",
            "inBanner": null,
            "ideventos": 1858,
            "titulo": "Velas de Cumpleaños",
            "NombreLocal": "Teatro Ricardo Blume",
            "urlFuente": "www.joinnus.com/events/theater/lima-velas-de-cumpleanos-de-noah-haidle-55793",
            "url": "https://res.cloudinary.com/do4rokki9/image/upload/v1693326736/InjoyPlan/fotos/VELAS_DE_CUMPLEA%C3%91OS_de_Noah_Haidle.jpg",
            "Monto": 25,
            "Destacado": 1,
            "categoria_id": 4,
            "EsGratis": 1,
            "Distrito": "33",
            "estado": null,
            "idfecha": 4,
            "usuario_id": 1
        },
        {
            "esfavorito": 0,
            "favorito": null,
            "HoraInicio": "20:00",
            "HoraFinal": "21:00",
            "FechaInicio": "2024-11-21T05:00:00.000Z",
            "inBanner": null,
            "ideventos": 2335,
            "titulo": "Barioná, el hijo del trueno",
            "NombreLocal": "Espacio Cultural Karol Wojtyla",
            "urlFuente": "www.joinnus.com/events/theater/lima-bariona-el-hijo-del-trueno-58714",
            "url": "https://res.cloudinary.com/do4rokki9/image/upload/v1701524957/InjoyPlan/fotos/Barion%C3%A1_el_hijo_del_trueno.jpg",
            "Monto": 30,
            "Destacado": 1,
            "categoria_id": 4,
            "EsGratis": 1,
            "Distrito": "40",
            "estado": null,
            "idfecha": 1358,
            "usuario_id": 1
        },
        {
            "esfavorito": 0,
            "favorito": null,
            "HoraInicio": "20:00",
            "HoraFinal": "21:00",
            "FechaInicio": "2024-11-21T05:00:00.000Z",
            "inBanner": null,
            "ideventos": 2335,
            "titulo": "Barioná, el hijo del trueno",
            "NombreLocal": "Espacio Cultural Karol Wojtyla",
            "urlFuente": "www.joinnus.com/events/theater/lima-bariona-el-hijo-del-trueno-58714",
            "url": "https://res.cloudinary.com/do4rokki9/image/upload/v1701524957/InjoyPlan/fotos/Barion%C3%A1_el_hijo_del_trueno.jpg",
            "Monto": 30,
            "Destacado": 1,
            "categoria_id": 4,
            "EsGratis": 1,
            "Distrito": "40",
            "estado": null,
            "idfecha": 1358,
            "usuario_id": 1
        },
        {
            "esfavorito": 0,
            "favorito": null,
            "HoraInicio": "18:30",
            "HoraFinal": "21:00",
            "FechaInicio": "2024-11-22T05:00:00.000Z",
            "inBanner": null,
            "ideventos": 2491,
            "titulo": "Hablando Huevadas 22 De Diciembre",
            "NombreLocal": "Teatro Canout",
            "urlFuente": "www.entradaya.com.pe/HABLANDO-HUEVADAS-22-DE-DICIEMBRE/",
            "url": "https://res.cloudinary.com/do4rokki9/image/upload/v1703549877/InjoyPlan/fotos/Hablando_Huevadas_22.12.23.jpg",
            "Monto": 69,
            "Destacado": 1,
            "categoria_id": 2,
            "EsGratis": 1,
            "Distrito": "15",
            "estado": null,
            "idfecha": 1618,
            "usuario_id": 1
        },
        {
            "esfavorito": 0,
            "favorito": null,
            "HoraInicio": "20:00",
            "HoraFinal": "21:30",
            "FechaInicio": "2024-11-22T05:00:00.000Z",
            "inBanner": null,
            "ideventos": 1860,
            "titulo": "Un monstruo viene a verme",
            "NombreLocal": "Teatro Británico",
            "urlFuente": "www.joinnus.com/events/theater/lima-un-monstruo-viene-a-verme-56024",
            "url": "https://res.cloudinary.com/do4rokki9/image/upload/v1698471155/InjoyPlan/fotos/Un_monstruo_viene_a_verme.png",
            "Monto": 25,
            "Destacado": 1,
            "categoria_id": 4,
            "EsGratis": 1,
            "Distrito": "15",
            "estado": null,
            "idfecha": 40,
            "usuario_id": 1
        },
        {
            "esfavorito": 0,
            "favorito": null,
            "HoraInicio": "20:00",
            "HoraFinal": "21:30",
            "FechaInicio": "2024-11-22T05:00:00.000Z",
            "inBanner": null,
            "ideventos": 1990,
            "titulo": "Mi Mujer, La Monja y Yo",
            "NombreLocal": "C.C. CAFAE-SE",
            "urlFuente": "www.atrapalo.pe/entradas/mi-mujer-la-monja-y-yo_e4901658/",
            "url": "https://res.cloudinary.com/do4rokki9/image/upload/v1698706480/InjoyPlan/fotos/Mi_Mujer_La_Monja_y_Yo.jpg",
            "Monto": 30,
            "Destacado": 1,
            "categoria_id": 4,
            "EsGratis": 1,
            "Distrito": "24",
            "estado": null,
            "idfecha": 343,
            "usuario_id": 1
        },
        {
            "esfavorito": 0,
            "favorito": null,
            "HoraInicio": "20:00",
            "HoraFinal": "22:00",
            "FechaInicio": "2024-11-22T05:00:00.000Z",
            "inBanner": null,
            "ideventos": 2080,
            "titulo": "Brujas",
            "NombreLocal": "Teatro Marsano",
            "urlFuente": "teleticket.com.pe/brujas-teatro-marsano",
            "url": "https://res.cloudinary.com/do4rokki9/image/upload/v1699114162/InjoyPlan/fotos/Brujas.jpg",
            "Monto": 40,
            "Destacado": 1,
            "categoria_id": 4,
            "EsGratis": 1,
            "Distrito": "15",
            "estado": null,
            "idfecha": 731,
            "usuario_id": 1
        },
        {
            "esfavorito": 0,
            "favorito": null,
            "HoraInicio": "20:00",
            "HoraFinal": "22:00",
            "FechaInicio": "2024-11-22T05:00:00.000Z",
            "inBanner": null,
            "ideventos": 2107,
            "titulo": "La vida en otros planetas",
            "NombreLocal": "Auditorio ICPNA Miraflores",
            "urlFuente": "www.joinnus.com/events/theater/lima-la-vida-en-otros-planetas-de-mariana-de-althaus-57993",
            "url": "https://res.cloudinary.com/do4rokki9/image/upload/v1699842570/InjoyPlan/fotos/La_vida_en_otros_planetas.jpg",
            "Monto": 30,
            "Destacado": 1,
            "categoria_id": 4,
            "EsGratis": 1,
            "Distrito": "15",
            "estado": null,
            "idfecha": 850,
            "usuario_id": 1
        },
        {
            "esfavorito": 0,
            "favorito": null,
            "HoraInicio": "20:30",
            "HoraFinal": "21:45",
            "FechaInicio": "2024-11-22T05:00:00.000Z",
            "inBanner": null,
            "ideventos": 1991,
            "titulo": "Mi Persona Favorita",
            "NombreLocal": "Teatro Auditorio Miraflores",
            "urlFuente": "www.atrapalo.pe/entradas/mi-persona-favorita_e4901549/",
            "url": "https://res.cloudinary.com/do4rokki9/image/upload/v1698706480/InjoyPlan/fotos/Mi_persona_favorita.jpg",
            "Monto": 40,
            "Destacado": 1,
            "categoria_id": 4,
            "EsGratis": 1,
            "Distrito": "15",
            "estado": null,
            "idfecha": 349,
            "usuario_id": 1
        },
        {
            "esfavorito": 0,
            "favorito": null,
            "HoraInicio": "20:45",
            "HoraFinal": "21:30",
            "FechaInicio": "2024-11-22T05:00:00.000Z",
            "inBanner": null,
            "ideventos": 2544,
            "titulo": "El médico a palos",
            "NombreLocal": "Teatro Mocha Graña",
            "urlFuente": "www.instagram.com/p/C05KuCkLP1R/",
            "url": "https://res.cloudinary.com/do4rokki9/image/upload/v1703640979/InjoyPlan/fotos/El_m%C3%A9dico_a_palos.jpg",
            "Monto": 15,
            "Destacado": 1,
            "categoria_id": 4,
            "EsGratis": 1,
            "Distrito": "25",
            "estado": null,
            "idfecha": 1680,
            "usuario_id": 1
        }
    ]

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

    console.log(events)
    const destacades = events?.filter((item: any) => item.Destacado === 1);
    console.log(destacades)


    return (
        <div className='bg-[#FAFBFF] pb-[80px]'>
            <div className="2xl:max-w-screen-2xl xl:max-w-screen-xl max-w-[980px] mx-auto md:mt-16 mt-8 xl:px-10 px-5">
                <div className="md:px-0">
                    <div className='md:pt-12 pt-10'>
                        <h2 className='text-3xl mb-8 font-bold text-[#444444] md:text-[#212121]'>Eventos destacados</h2>
                    </div>
                    <div className="grid auto-cols-min grid-cols-1 gap-5 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-3">
                        {
                            destacades.map((item: any, index: number) => {
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

export default EventsFeatured