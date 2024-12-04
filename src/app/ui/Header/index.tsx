"use client";
import styles from './header.module.css'
import logo from '../../../../public/images/logo.png'
import lupa from '../../../../public/svg/search.svg'
import lupaMobile from '../../../../public/svg/search.svg'
import fb from '../../../../public/svg/fb.svg'
import ig from '../../../../public/svg/ig.svg'
import cora from '../../../../public/svg/favorite.svg'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { IAuthState, useAuthStore } from '../../zustand/auth'
import { IEventsState, useEventStore } from '../../zustand/events'
import { IFavoriteState, useFavoriteStore } from '../../zustand/favorites'
import { Icon } from '@iconify/react/dist/iconify.js'
import nofavorite from '../../../../public/svg/nofavorite.svg'
import moment from 'moment'
// import Auth from '../../Auth'
import Image from 'next/image';
import Auth from '../Auth';
import useOutsideClick from '@/app/hooks/useOutsideClick';
import useIsMobile from '@/app/hooks/useIsMobile';
import { usePathname } from 'next/navigation'

moment.locale('es');

const Header = () => {


    const { auth }: IAuthState = useAuthStore();
    const { getEventBySearch, eventSearch, resetEventBySearch, events, getEvents }: IEventsState = useEventStore();
    const { getFavorites, deleteFavorite }: IFavoriteState = useFavoriteStore();
    const [isOpenEvent, setIsOpenEvent, refEvent] = useOutsideClick(false);
    const [isOpenFavorite, setIsOpenFavorite, refFavorite] = useOutsideClick(false);
    const [openAuth, setOpenAuth] = useState<boolean>(false);
    const navigation = useRouter()
    const path = usePathname();

    console.log(path)

    useEffect(() => {
        getFavorites();
    }, [])

    const [search, setSearch] = useState<string>("");
    const [hoveredFavoriteId, setHoveredFavoriteId] = useState<number | null>(null);

    const favoritesRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (search.length > 3) {
            getEventBySearch(search)
            setIsOpenEvent(true)
        } else {
            resetEventBySearch();
            setIsOpenEvent(false)
        }
    }, [search]);

    const deleteFavorites = (e: any, item: any) => {
        console.log(item)
        e.stopPropagation();
        deleteFavorite(item)
    }

    let eventsOnlyFavorites = events?.filter((item: any) => item.esfavorito === 1);

    const navigateEvent = (item: any) => {
        navigation.push(`/evento/${item.ideventos}/${item.idfecha}`)
    }

    const isMobile = useIsMobile();


    return (
        <div className="border-b border-solid border-[#e9e9e9] bg-[#F9FAFC]">
            <Auth openAuth={openAuth} setOpenAuth={setOpenAuth} />
            <div className="max-w-screen-2xl md:max-w-screen-xl h-18 py-5 mx-auto items-center grid grid-cols-12">
                <Link className='w-44' href="/"><Image src={logo} alt="logo" height={300} width={300} /></Link>

                <div className={
                    isMobile ?
                        styles.search_containerMobile : "relative border col-start-4 col-end-9 w-full col-span-5 flex items-center border-1 border-solid border-[#ddd] rounded-[50px] bg-white"}>
                    {
                        isMobile && <div className={styles.search_icon_container}>
                            <Image src={lupaMobile} alt="lupa" className={styles.search_icon} />
                        </div>
                    }
                    <div className="flex justify-center pr-2 pl-4">
                        <Image src={lupa} width={28} onClick={() => setIsOpenEvent(true)} alt="lupa" className={styles.search_icon} />
                    </div>
                    <div className={styles.search + 'relative w-full rounded-2xl'} ref={searchRef}>
                        {
                            !isMobile &&
                            <input
                                onClick={() => setIsOpenEvent(true)}
                                onChange={(e: any) => setSearch(e.target.value)}
                                type="text" placeholder="Evento, equipo o artista"
                                className="w-full bg-transparent border-none rounded-3xl relative outline-none font-[Quicksand] py-4 text-md text-[#5C6570] font-bold"
                            />
                        }
                        {
                            isOpenEvent && (
                                <div ref={refEvent} className={"max-h-[400px] overflow-y-scroll absolute bg-[#fff] w-full left-0 rounded-xl shadow-custom-2 top-16 z-50"}>
                                    {
                                        isMobile && <div className={styles.searchMobile}>
                                            <Image src={lupa} alt="lupa" className={styles.search_icon} />
                                            <input onChange={(e: any) => setSearch(e.target.value)} type="text" placeholder="Evento, equipo o artista" />
                                            <Icon icon="openmoji:close" color='#9B292B' onClick={() => setIsOpenEvent(true)} />
                                        </div>
                                    }
                                    <div>
                                        <ul className={styles.dropdownHeader__wrapper} onClick={() => {
                                            setIsOpenEvent(false),
                                                setSearch("")
                                        }}>
                                            <div className={styles.dropdown__header}>
                                                <div>
                                                    {eventSearch?.length > 0 ? <h6 className='font-bold'>Eventos</h6> :
                                                        <p className={styles.noResults}>Ver todos los resultado para <strong>{search || "Por buscar ..."}</strong></p>
                                                    }
                                                </div>
                                                <div>
                                                    {eventSearch?.length > 0 && eventSearch?.map((item: any, index: number) => (
                                                        <Link href={`/evento/${item.ideventos}/${item.idfecha}`} key={index}>
                                                            <div className={styles.events}>
                                                                <div className={styles.event__left}>
                                                                    <div>
                                                                        <img src={item.url} alt={item.title} />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className='font-bold text-xl'>{item.titulo}</h3>
                                                                        <span>{item.NombreLocal}</span>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p> {moment(item.FechaInicio).utc().format('ddd, D MMM').toUpperCase()}</p>
                                                                    <span>{item.HoraInicio}</span>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                                <div>
                                                    {
                                                        eventSearch?.length > 0 && (
                                                            <div className={styles.seeAll}>
                                                                <Link href={`/busqueda/${search}`}><p>Ver todos los resultados por <strong>{search}</strong></p></Link>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>

                {
                    path === "/nosotros" || path === "/preguntas-frecuentes" || path === "/terminos-y-condiciones" || path === "/contactanos" ? (
                        <div className='col-start-12 flex'>
                            <div className='border-[#007FA4] border border-solid rounded-full px-4 py-[10px]'>
                            <Image className='' src={fb} width={10} alt='facebook' />
                            </div>
                            <div className='ml-3 border-[#007FA4] border border-solid rounded-full px-3 py-[10px]'>
                            <Image className='' src={ig} width={20} alt='ig' />
                            </div>
                        </div>
                    ) :
                        <div className={styles.corazon} ref={favoritesRef}>
                            <p>{auth?.nombre} {auth?.Apellido}</p>
                            {auth === null && <button onClick={() => setOpenAuth(true)}
                                className='mr-[10px] text-white bg-[#007FA4] text-[15px] py-[10px] px-[25px] rounded-[20px] font-open-sans cursor-pointer'
                            >Ingresar</button>}
                            <Image src={cora} alt="cora" width={47} height={47} onClick={() => setIsOpenFavorite(true)} />
                            {
                                isOpenFavorite && (
                                    <div
                                        className={"opacity-100 visible z-10 shadow-custom-2"}
                                    >
                                        <ul className={styles.dropdownHeader__wrapper}>
                                            <div className={styles.dropdown__header}>
                                                <div>
                                                    <h6>Favoritos</h6>
                                                    {
                                                        isMobile && <div className={styles.closeFavorites}>
                                                            <Icon width={30} icon="ic:baseline-close" onClick={() => setIsOpenFavorite(true)} />
                                                        </div>
                                                    }
                                                </div>
                                                <div className={styles.favorites__dropdown}>
                                                    {
                                                        eventsOnlyFavorites.length > 0 ? eventsOnlyFavorites?.map((item: any, index: number) => (
                                                            <div className={styles.favorites}
                                                                onClick={() => navigateEvent(item)}
                                                                key={index}
                                                                onMouseEnter={() => setHoveredFavoriteId(item.idfavoritos)}
                                                                onMouseLeave={() => setHoveredFavoriteId(null)}
                                                            >
                                                                <div>
                                                                    <img src={item.url} alt="" />
                                                                </div>
                                                                <div>
                                                                    <p>{moment(item.FechaInicio).utc().format('D MMM').toUpperCase()} - {item.HoraInicio} - {item.HoraFinal}</p>
                                                                    <h3>{item.titulo}</h3>
                                                                    <span>{item.NombreLocal}</span>
                                                                </div>

                                                                {
                                                                    isMobile && <Icon icon="ic:baseline-close" onClick={(e: any) => deleteFavorites(e, item)} />
                                                                }

                                                                {hoveredFavoriteId === item.idfavoritos && !isMobile && (
                                                                    <Icon icon="ic:baseline-close" onClick={(e: any) => deleteFavorites(e, item)} />
                                                                )}
                                                            </div>
                                                        )) :

                                                            <div className={styles.noFavorite}>
                                                                <div>
                                                                    <img src={nofavorite} alt="" />
                                                                    <strong>Aún no tienes eventos favoritos</strong>
                                                                    <p>En cuanto los tengas, podrás verlos aquí</p>
                                                                </div>
                                                            </div>
                                                    }
                                                </div>
                                            </div>
                                        </ul>
                                    </div>
                                )
                            }
                        </div>
                }
            </div>
        </div>
    )
}

export default Header