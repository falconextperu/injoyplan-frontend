"use client";
import styles from './header.module.css'
import logo from '../../../../public/images/logo.png'
import lupa from '../../../../public/svg/search.svg'
import lupaMobile from '../../../../public/svg/searchmobile.svg'
import fb from '../../../../public/svg/fb.svg'
import ig from '../../../../public/svg/ig.svg'
import cora from '../../../../public/svg/favorite.svg'
import Link from 'next/link'
import calendar from '../../../../public/svg/calendar.svg'
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
    const { getEventBySearch, eventSearch, resetEventBySearch, events }: IEventsState = useEventStore();
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
            // setIsOpenEvent(false)
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
            <div className="2xl:max-w-screen-2xl xl:max-w-screen-xl xl:px-10 max-w-[998px] h-18 py-5 px-5 mx-auto items-center grid grid-cols-12">
                <Link className='w-44' href="/"><Image src={logo} alt="logo" height={300} width={300} /></Link>
                <div className={
                    isMobile ?
                        styles.search_containerMobile : "relative border col-start-4 col-end-8 w-full col-span-5 flex items-center border-1 border-solid border-[#ddd] rounded-[50px] bg-white"}>
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
                                <div ref={refEvent} className={"md:max-h-[400px] md:h-auto overflow-y-auto absolute bg-[#fff] w-full left-0 rounded-xl shadow-custom-2 md:top-16 h-[100vh] top-0 z-50"}>
                                    {
                                        isMobile && <div className={styles.searchMobile}>
                                            <Image src={lupa} alt="lupa" className={styles.search_icon} />
                                            <input className='w-full' onChange={(e: any) => setSearch(e.target.value)} type="text" placeholder="Evento, equipo o artista" />
                                            <Icon icon="openmoji:close" color='#9B292B' onClick={() => setIsOpenEvent(false)} />
                                        </div>
                                    }
                                    <div>
                                        <ul onClick={() => {
                                            setIsOpenEvent(false),
                                                setSearch("")
                                        }}>
                                            <div>
                                                <div>
                                                    {eventSearch?.length > 0 ? <h6 className='font-bold text-2xl text-left px-6 pt-4 pb-4 border-b border-solid border-[#ddd]'>Eventos</h6> :
                                                        <p className={styles.noResults}>Ver todos los resultado para <strong>{search || "Por buscar ..."}</strong></p>
                                                    }
                                                </div>
                                                <div>
                                                    {eventSearch?.length > 0 && eventSearch?.map((item: any, index: number) => (
                                                        <Link href={`/evento/${item.ideventos}/${item.idfecha}`} key={index}>
                                                            <div className={styles.events}>
                                                                <div className='flex items-center'>
                                                                    <div className="w-[80px] h-[55px] mr-4">
                                                                        <Image className='w-full h-full object-cover' objectFit='contain' width={100} height={100} src={item.url} alt="" />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className='font-bold text-[18px]'>{item.titulo}</h3>
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
                                                                <Link className='text-md' href={`/busqueda/${search}`}><p>Ver todos los resultados por <strong>{search}</strong></p></Link>
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
                        <div className='col-start-8 col-end-13 flex justify-end items-center'>
                            <div className='border-[#007FA4] border border-solid rounded-full md:px-4 px-4 py-0.5 md:py-[2px]'>
                                <Image className='md:w-3 py-2 w-[10px]' src={fb} width={20} height={20} alt='facebook' />
                            </div>
                            <div className='ml-3 border-[#007FA4] border border-solid rounded-full md:px-2.5 px-3 py-3 md:py-[10px]'>
                                <Image className='md:w-6 w-[17px]' src={ig} width={20} height={20}  alt='ig' />
                            </div>
                        </div>
                    ) :
                        <div className="col-start-8 col-end-13 flex justify-end md:relative items-center" ref={favoritesRef}>
                           {isMobile && auth !== null ?  <p className='font-bold text-[#007FA4] bg-[#DBEBF1] rounded-full p-2'>{auth?.nombre[0]} {auth?.Apellido?.[0]}</p> :  <p className='font-bold mr-3'>{auth?.nombre} {auth?.Apellido}</p>}
                            {auth === null && <button onClick={() => setOpenAuth(true)}
                                className='mr-[10px] text-white bg-[#007FA4] text-[15px] py-[10px] px-[25px] rounded-[20px] font-open-sans cursor-pointer'
                            >Ingresar</button>}
                            {
                                isMobile &&
                                <Image onClick={() => setIsOpenEvent(true)} className='mr-2 ml-2' src={lupaMobile} alt="lupa" width={30} height={30} />
                            }
                          
                                <Image src={cora} className='md:bg-[#DBEBF1] cursor-pointer rounded-full p-2' alt="cora" width={43} height={43} onClick={() => setIsOpenFavorite(true)} />
                           
                            {
                                isOpenFavorite && (
                                    <div
                                        ref={refFavorite}
                                        className={"top-0 md:left-auto left-0 w-full md:w-[430px] h-[100vh] overflow-hidden md:overflow-y-auto md:max-h-[350px] md:shadow-custom-2 bg-[#fff] md:rounded-xl md:top-14 absolute md:right-0 z-50 md:after:absolute md:after:top-[-10px] md:after:right-[10px] md:after:mx-auto md:after:w-[1px] md:after:border-b-[11px] md:after:border-b-white md:after:border-l-[11px] md:after:border-l-transparent md:after:border-r-[11px] md:after:border-r-transparent md:after:content-['']"}
                                    >
                                        <ul>
                                            <div>
                                                <div>
                                                    <h6 className='text-[18px] text-center md:text-left text-[#333] font-bold p-3 border-b border-solid border-[#e8e8e8]'>Favoritos</h6>
                                                    {
                                                        isMobile && <div className={styles.closeFavorites}>
                                                            <Icon className='cursor-pointer relative right-1' width={20} icon="ic:baseline-close" onClick={() => setIsOpenFavorite(false)} />
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

                                                            <div className='p-10 px-16 relative z-50 text-center mx-auto flex justify-center'>
                                                                <div>
                                                                    <Image src={calendar} alt="" className='mb-6 text-center mx-auto' width={60} height={60}/>
                                                                    <strong className='text-[16px]'>Aún no tienes eventos favoritos</strong>
                                                                    <p className='text-[14px] mt-2'>En cuanto los tengas, podrás verlos aquí</p>
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