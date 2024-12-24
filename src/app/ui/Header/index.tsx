"use client";
import styles from './header.module.css'
import logo from '../../../../public/svg/injoyplan.svg'
import lupa from '../../../../public/svg/search.svg'
import lupaMobile from '../../../../public/svg/searchmobile.svg'
import fb from '../../../../public/svg/fb.svg'
import ig from '../../../../public/svg/ig.svg'
import cora from '../../../../public/svg/favorite.svg'
import heartWhite from '../../../../public/svg/favoritepick.svg'
import Link from 'next/link'
import calendar from '../../../../public/svg/calendar.svg'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { IAuthState, useAuthStore } from '../../zustand/auth'
import { IEventsState, useEventStore } from '../../zustand/events'
import { IFavoriteState, useFavoriteStore } from '../../zustand/favorites'
import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import Image from 'next/image';
import Auth from '../Auth';
import useOutsideClick from '@/app/hooks/useOutsideClick';
import useIsMobile from '@/app/hooks/useIsMobile';
import { usePathname } from 'next/navigation'
import { quicksand, sans } from '../../../../public/fonts';
import 'moment/locale/es'; // Importa el idioma español
import ReactModal from 'react-modal';

moment.locale('es');

const Header = () => {


    const { auth }: IAuthState = useAuthStore();
    const { getEventBySearch, eventSearch, resetEventBySearch, events, getValueSearch }: IEventsState = useEventStore();
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
    const [isFindResult, setFindResults] = useState<boolean>(false);
    const favoritesRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    useEffect(() => {
        if (search.length <= 3) {
            const savedSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
            setRecentSearches(savedSearches);
        }
    }, [search]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (search?.length > 3 && eventSearch?.length === 0 && !isOpenEvent) {
            setFindResults(true);
        }
    }, [search, eventSearch, isOpenEvent]);

    useEffect(() => {
        if (search?.length > 3) {
            setIsOpenEvent(true)
            setFindResults(true);
            getEventBySearch(search);
        } else {
            setFindResults(false);
            resetEventBySearch();
        }
    }, [search])

    useEffect(() => {
        resetEventBySearch();
        setIsOpenEvent(false)
    }, [])

    const saveSearch = (term: string) => {
        getValueSearch(term);
        // Obtener búsquedas recientes desde localStorage
        const recentSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");

        // Evitar duplicados y limitar el historial a las últimas 10 búsquedas
        const updatedSearches = [term, ...recentSearches.filter((item: string) => item !== term)].slice(0, 10);

        // Guardar búsquedas recientes en localStorage
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

        // Actualizar el estado
        setRecentSearches(updatedSearches);

        setIsOpenEvent(false)
        setSearch("");
    };

    const deleteFavorites = (e: any, item: any) => {
        console.log(item)
        e.stopPropagation();
        deleteFavorite(item)
    }

    let eventsOnlyFavorites = events?.filter((item: any) => item.esfavorito === 1);

    const navigateEvent = (item: any) => {
        navigation.push(`/evento/${item?.ideventos}/${item.idfecha}`)
    }

    const isMobile = useIsMobile();

    function HighlightedText({ text, highlight }: { text: string; highlight: string }) {
        if (!highlight) {
            return <span>{text}</span>;
        }

        // Crear una expresión regular para buscar el texto que coincide, ignorando mayúsculas/minúsculas
        const regex = new RegExp(`(${highlight})`, 'gi');
        const parts = text.split(regex);

        return (
            <span>
                {parts.map((part, index) =>
                    regex.test(part) ? (
                        <b key={index} className="font-black text-black">
                            {part}
                        </b>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    }

    console.log(eventSearch)

    const closeModal = () => {
        document.body.classList.remove('ReactModal__Body--open');
        setIsOpenFavorite(false);
    }

    useEffect(() => {
        return () => {
            document.body.classList.remove('ReactModal__Body--open');
        };
    }, [isOpenFavorite, isOpenEvent]);

    const logout = () => {
        localStorage.clear();
        window.location.href = "/"
    }

    return (
        <div className="border-b border-solid border-[#EDEFF5] bg-[#F9FAFC]">
            <Auth openAuth={openAuth} setOpenAuth={setOpenAuth} />
            <div className="2xl:max-w-screen-2xl xl:max-w-screen-xl xl:px-10 max-w-[998px] h-18 py-6 px-1 mx-auto items-center grid grid-cols-12">
                <Link className='w-48' href="/"><Image src={logo} alt="logo" className='w-full' height={400} width={300} /></Link>
                {
                    !path.startsWith("/busqueda") && (
                        <div className={
                            isMobile ?
                                styles.search_containerMobile : "hidden relative border col-start-4 col-end-9 w-full col-span-5 md:flex items-center border-1 border-solid border-[#e8e8e8] rounded-[50px] bg-white"}>
                            <div className="flex justify-center pr-2 pl-4">
                                <Image src={lupa} width={28} onClick={() => setIsOpenEvent(true)} alt="lupa" className="hidden md:block" />
                            </div>
                            <div className={styles.search + 'relative w-full rounded-2xl'} ref={searchRef}>
                                {
                                    !isMobile &&
                                    <input
                                        onClick={() => setIsOpenEvent(true)}
                                        onChange={(e: any) => setSearch(e.target.value)}
                                        type="text" placeholder="Evento, equipo o artista"
                                        value={search}
                                        className="w-full  placeholder:text-[#bababa] bg-transparent border-none rounded-3xl relative outline-none font-[Quicksand] py-3 text-md text-[#5C6570] font-bold"
                                    />
                                }
                                {
                                    isOpenEvent && (
                                        <div ref={refEvent} className={"hidden md:block md:max-h-[400px] px-5 md:px-0 md:p-0 md:h-auto overflow-y-auto absolute bg-[#fff] w-full left-0 rounded-xl shadow-custom-2 md:top-16 h-[100vh] top-0 z-50"}>
                                            {
                                                isMobile && <div className="flex border mt-5 border-solid border-[#ddd] p-3 rounded-full">
                                                    <Image src={lupa} alt="lupa" className="" />
                                                    <input className='w-full outline-none pl-3' onChange={(e: any) => setSearch(e.target.value)} type="text" placeholder="Evento, equipo o artista" />
                                                    <Icon width={30} icon="openmoji:close" color='#8B2B2C' onClick={() => setIsOpenEvent(false)} />
                                                </div>
                                            }
                                            <div>
                                                <div>
                                                    {
                                                        eventSearch?.length > 0 ? <>
                                                            <div>
                                                                <h3 className='pt-5 pb-5 md:p-5 md:pb-4 sticky top-0 font-bold bg-[#fff] z-50 text-[20px] border-b border-solid border-[#ddd]'>Eventos</h3>
                                                                {eventSearch?.length > 0 && eventSearch?.slice(0, 10)?.map((item: any, index: number) => (
                                                                    <Link onClick={() => {
                                                                        saveSearch(item.titulo)

                                                                    }} className={sans.className} href={`/evento/${item?.ideventos}/${item.idfecha}`} key={index}>

                                                                        <div className='flex justify-between md:p-5 pb-3 pt-2 md:pt-5'>
                                                                            <div className='flex items-center'>
                                                                                <div className="w-[40px] h-[40px] mr-4">
                                                                                    <Image className='w-full h-full object-fill' objectFit='contain' width={100} height={100} src={item.url} alt="" />
                                                                                </div>
                                                                                <div>
                                                                                    <h3 className='font-normal text-md text-[#444] text-ellipsis w-[320px] overflow-hidden whitespace-nowrap'> <HighlightedText text={item.titulo} highlight={search} /></h3>
                                                                                    <span className='opacity-[0.5] text-[13px]'>{item.NombreLocal}</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className='text-right'>
                                                                                <p className={quicksand.className + ' font-bold opacity-50'}> {moment(item.FechaInicio).utc().format('ddd, D MMM').toLowerCase().replace('.', "")}</p>
                                                                                <p className={quicksand.className + ' text-right text-[#848484] text-[14px]'}>{item.HoraInicio}</p>
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                            <div>
                                                                {
                                                                    eventSearch?.length > 0 && (
                                                                        <div onClick={() => {
                                                                            saveSearch(search)

                                                                        }} className='pt-4 md:p-4 border-t border-solid border-[#ddd]'>
                                                                            <Link className='text-md text-[#1087AA]' href={`/busqueda/${search}`}><p>Ver todos los resultados por <strong>{search}</strong></p></Link>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </>
                                                            :


                                                            <div>
                                                                {
                                                                    isFindResult ? <>
                                                                        <div>
                                                                            <p className='p-4 py-5 text-[#862020]'>Ver todos los resultados para <strong>{search}</strong></p>
                                                                        </div>
                                                                    </> :
                                                                        <>
                                                                            {recentSearches?.length > 0 &&
                                                                                // <p className={styles.noResults}>Ver todos los resultado para <strong>{search || "Por buscar ..."}</strong></p>
                                                                                <div>
                                                                                    <h3 className='p-5 font-bold text-[16px] border-b border-solid border-[#ddd]'>Recientes</h3>
                                                                                    <ul>
                                                                                        {recentSearches.length > 0 ? (
                                                                                            recentSearches.map((term, index) => (
                                                                                                <li key={index} onClick={() => setSearch(term)} className="px-5 py-2 cursor-pointer hover:bg-gray-100">
                                                                                                    {term}
                                                                                                </li>
                                                                                            ))
                                                                                        ) : (
                                                                                            <p className="p-2 text-gray-500">No tienes búsquedas recientes</p>
                                                                                        )}
                                                                                    </ul>
                                                                                </div>
                                                                            }
                                                                        </>
                                                                }
                                                            </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                                {
                                    isMobile && isOpenEvent && (
                                        <ReactModal isOpen ariaHideApp={false} className={"p-0 bg-[#fff] overflow-y-auto h-[100vh]"}>
                                            <div ref={refEvent} className={"md:hidden md:max-h-[400px] px-5 md:px-0 md:p-0 md:h-auto overflow-y-auto absolute bg-[#fff] w-full left-0 rounded-xl shadow-custom-2 md:top-16 h-[100vh] top-0 z-50"}>
                                                {
                                                    isMobile && <div className="flex border mt-5 border-solid border-[#ddd] p-3 rounded-full icon">
                                                        <Image src={lupa} alt="lupa" className="" />
                                                        <input className='w-full outline-none pl-3' onChange={(e: any) => setSearch(e.target.value)} type="text" placeholder="Evento, equipo o artista" />
                                                        <Icon width={33} icon="openmoji:close" onClick={() => setIsOpenEvent(false)} />
                                                    </div>
                                                }
                                                <div>
                                                    <div>
                                                        {
                                                            eventSearch?.length > 0 ? <>
                                                                <div>
                                                                    <h3 className='pt-5 pb-5 md:p-5 md:pb-4 sticky top-0 font-bold bg-[#fff] z-50 text-[20px] border-b border-solid border-[#ddd]'>Eventos</h3>
                                                                    {eventSearch?.length > 0 && eventSearch?.slice(0, 10)?.map((item: any, index: number) => (
                                                                        <Link onClick={() => {
                                                                            saveSearch(item.titulo)

                                                                        }} className={sans.className} href={`/evento/${item?.ideventos}/${item.idfecha}`} key={index}>

                                                                            <div className='flex justify-between md:p-5 pb-3 pt-2 md:pt-5'>
                                                                                <div className='flex items-center'>
                                                                                    <div className="w-[40px] h-[40px] mr-4">
                                                                                        <Image className='w-full h-full object-fill' objectFit='contain' width={100} height={100} src={item.url} alt="" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <h3 className='font-normal text-md text-[#444] text-ellipsis md:w-[320px] w-[190px] overflow-hidden whitespace-nowrap'> <HighlightedText text={item.titulo} highlight={search} /></h3>
                                                                                        <span className='opacity-[0.5] text-[13px]'>{item.NombreLocal}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='text-right'>
                                                                                    <p className={quicksand.className + ' font-bold opacity-50'}> {moment(item.FechaInicio).utc().format('ddd, D MMM').toLowerCase().replace('.', "")}</p>
                                                                                    <p className={quicksand.className + ' text-right text-[#848484] text-[14px]'}>{item.HoraInicio}</p>
                                                                                </div>
                                                                            </div>
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                                <div>
                                                                    {
                                                                        eventSearch?.length > 0 && (
                                                                            <div onClick={() => {
                                                                                saveSearch(search)

                                                                            }} className='pt-4 md:p-4 border-t border-solid border-[#ddd]'>
                                                                                <Link className='text-md text-[#1087AA]' href={`/busqueda/${search}`}><p>Ver todos los resultados por <strong>{search}</strong></p></Link>
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
                                                            </>
                                                                :


                                                                <div>
                                                                    {
                                                                        isFindResult ? <>
                                                                            <div>
                                                                                <p className='p-4 py-5 text-[#862020]'>Ver todos los resultados para <strong>{search}</strong></p>
                                                                            </div>
                                                                        </> :
                                                                            <>
                                                                                {recentSearches?.length > 0 &&
                                                                                    // <p className={styles.noResults}>Ver todos los resultado para <strong>{search || "Por buscar ..."}</strong></p>
                                                                                    <div>
                                                                                        <h3 className='p-5 font-bold text-[16px] border-b border-solid border-[#ddd] mb-3'>Recientes</h3>
                                                                                        <ul>
                                                                                            {recentSearches.length > 0 ? (
                                                                                                recentSearches.map((term, index) => (
                                                                                                    <li key={index} onClick={() => setSearch(term)} className="px-5 py-2 cursor-pointer hover:bg-gray-100">
                                                                                                        {term}
                                                                                                    </li>
                                                                                                ))
                                                                                            ) : (
                                                                                                <p className="p-2 text-gray-500">No tienes búsquedas recientes</p>
                                                                                            )}
                                                                                        </ul>
                                                                                    </div>
                                                                                }
                                                                            </>
                                                                    }
                                                                </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </ReactModal>


                                    )
                                }
                            </div>
                        </div>
                    )
                }

                {
                    path === "/nosotros" || path === "/preguntas-frecuentes" || path === "/terminos-y-condiciones" || path === "/contactanos" ? (
                        <div className='col-start-9 col-end-13 flex justify-end items-center'>
                            <div className='border-[#007FA4] border border-solid rounded-full md:px-4 px-4 py-0.5 md:py-[2px]'>
                                <Image className='md:w-3 py-2 w-[10px]' src={fb} width={20} height={20} alt='facebook' />
                            </div>
                            <div className='ml-3 border-[#007FA4] border border-solid rounded-full md:px-2.5 px-3 py-3 md:py-[10px]'>
                                <Image className='md:w-6 w-[17px]' src={ig} width={20} height={20} alt='ig' />
                            </div>
                        </div>
                    ) :
                        <div className="col-start-9 col-end-13 flex justify-end md:relative items-center" ref={favoritesRef}>
                            {isMobile && auth !== null ? <button onClick={logout} className='mr-[10px] text-white bg-[#007FA4] text-[15px] p-2 rounded-[20px] font-open-sans cursor-pointer'><Icon icon="material-symbols:logout" width="24" height="24" /></button> : <p className='font-bold mr-3'>{auth?.nombre} {auth?.Apellido}</p>}
                            {auth === null && !isMobile ? (
                                <button onClick={() => setOpenAuth(true)}
                                    className='mr-[10px] text-white bg-[#007FA4] text-[15px] py-[10px] px-[25px] rounded-[20px] font-open-sans cursor-pointer'
                                >Ingresar</button>
                            ) :
                                auth === null && isMobile && (
                                    <button onClick={() => setOpenAuth(true)}
                                        className='mr-[10px] text-white bg-[#007FA4] text-[15px] p-2 rounded-[20px] font-open-sans cursor-pointer'
                                    ><Icon icon="solar:user-bold" width="24" height="24" /></button>
                                )
                            }
                            {
                                isMobile &&
                                <Image onClick={() => setIsOpenEvent(true)} className='mr-2 ml-2' src={lupaMobile} alt="lupa" width={30} height={30} />
                            }

                            {
                                isOpenFavorite ? (
                                    <Image src={heartWhite} className='md:bg-[#007FA4] cursor-pointer rounded-full p-2' alt="cora" width={43} height={43} onClick={() => setIsOpenFavorite(true)} />
                                ) :
                                    (
                                        <Image src={cora} className='md:bg-[#DBEBF1] cursor-pointer rounded-full p-2' alt="cora" width={43} height={43} onClick={() => setIsOpenFavorite(true)} />
                                    )
                            }


                            <div className='md:hidden'>
                                {
                                    isOpenFavorite && isMobile && (
                                        <ReactModal
                                            isOpen
                                            ariaHideApp={false}
                                            className={"p-0 bg-[#fff] overflow-y-auto h-[100vh] blur-0"}
                                        >
                                            <ul>
                                                <div>
                                                    <div className='sticky top-0 bg-[#fff] z-50'>
                                                        <h6 className='text-[18px] text-center md:text-left text-[#333] font-bold p-3 px-5 border-b border-solid border-[#e8e8e8]'>Favoritos</h6>
                                                        {
                                                            isMobile && <div className={styles.closeFavorites}>
                                                                <Icon className='cursor-pointer absolute right-4 top-4' width={24} icon="ic:baseline-close" onClick={closeModal} />
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="p-5">
                                                        {
                                                            eventsOnlyFavorites.length > 0 ? eventsOnlyFavorites?.map((item: any, index: number) => (
                                                                <div className="flex mt-2 mb-8 last:mb-0 relative w-full cursor-pointer group"
                                                                    onClick={() => navigateEvent(item)}
                                                                    key={index}
                                                                    onMouseEnter={() => setHoveredFavoriteId(item.idfavoritos)}
                                                                    onMouseLeave={() => setHoveredFavoriteId(null)}

                                                                >
                                                                    <div className='w-[45px] h-[35px] mr-4'>
                                                                        <Image className='w-full h-full' width={45} height={45} src={item.url} alt="" />
                                                                    </div>
                                                                    <div>
                                                                        <p className='text-[13px] font-bold text-[#4a4a4a]'>{moment(item.FechaInicio).utc().format('D MMM').toUpperCase()} - {item.HoraInicio} - {item.HoraFinal}</p>
                                                                        <h3 className='group-hover:text-[#037BA1] transition duration-100 font-bold mb-0 text-md text-[#212121] text-ellipsis w-[310px] overflow-hidden whitespace-nowrap'>{item.titulo}</h3>
                                                                        <p className='font-normal text-[13px]'>{item.NombreLocal}</p>
                                                                    </div>

                                                                    {
                                                                        isMobile && <Icon className='absolute right-0 top-0' icon="ic:baseline-close" onClick={(e: any) => deleteFavorites(e, item)} />
                                                                    }

                                                                    <Icon
                                                                        className={`absolute right-0 top-0 transition-opacity duration-200 ${hoveredFavoriteId === item.idfavoritos ? "opacity-100" : "opacity-0"
                                                                            }`}
                                                                        icon="ic:baseline-close"
                                                                        onClick={(e: any) => {
                                                                            e.stopPropagation(); // Evita que el evento alcance otros handlers
                                                                            deleteFavorites(e, item);
                                                                        }}
                                                                    />
                                                                </div>
                                                            )) :

                                                                <div className='p-10 px-16 py-20 relative z-50 text-center mx-auto flex justify-center'>
                                                                    <div>
                                                                        <Image src={calendar} alt="" className='mb-6 text-center mx-auto' width={60} height={60} />
                                                                        <strong className='text-[16px]'>Aún no tienes eventos favoritos</strong>
                                                                        <p className='text-[14px] mt-2'>En cuanto los tengas, podrás verlos aquí</p>
                                                                    </div>
                                                                </div>
                                                        }
                                                    </div>
                                                </div>
                                            </ul>
                                        </ReactModal>
                                    )
                                }
                            </div>

                            {
                                isOpenFavorite && (
                                    <div
                                        ref={refFavorite}
                                        className={"hidden md:block md:left-auto left-0 w-full md:w-[430px] overflow-hidden md:overflow-y-auto md:max-h-auto max-h-[400px] overflow-y-scroll md:shadow-custom-2 bg-[#fff] md:rounded-xl md:top-14 absolute md:right-0 z-50 md:after:absolute md:after:top-[-10px] md:after:right-[10px] md:after:mx-auto md:after:w-[1px] md:after:border-b-[11px] md:after:border-b-white md:after:border-l-[11px] md:after:border-l-transparent md:after:border-r-[11px] md:after:border-r-transparent md:after:content-['']"}
                                    >
                                        <ul>
                                            <div>
                                                <div>
                                                    <h6 className='text-[18px] text-center md:text-left text-[#333] font-bold p-3 px-5 border-b border-solid border-[#e8e8e8]'>Favoritos</h6>
                                                    {
                                                        isMobile && <div>
                                                            <Icon className='cursor-pointer absolute right-4 top-4' width={24} icon="ic:baseline-close" onClick={() => setIsOpenFavorite(false)} />
                                                        </div>
                                                    }
                                                </div>
                                                <div className="p-5">
                                                    {
                                                        eventsOnlyFavorites.length > 0 ? eventsOnlyFavorites?.map((item: any, index: number) => (
                                                            <div className="flex mt-2 mb-8 last:mb-0 relative w-full cursor-pointer group"
                                                                onClick={() => navigateEvent(item)}
                                                                key={index}
                                                                onMouseEnter={() => setHoveredFavoriteId(item.idfavoritos)}
                                                                onMouseLeave={() => setHoveredFavoriteId(null)}

                                                            >
                                                                <div className='w-[45px] h-[35px] mr-4'>
                                                                    <Image className='w-full h-full' width={45} height={45} src={item.url} alt="" />
                                                                </div>
                                                                <div>
                                                                    <p className='text-[13px] font-bold text-[#4a4a4a]'>{moment(item.FechaInicio).utc().format('D MMM').toUpperCase()} - {item.HoraInicio} - {item.HoraFinal}</p>
                                                                    <h3 className='group-hover:text-[#037BA1] transition duration-100 font-bold mb-0 text-md text-[#212121] text-ellipsis w-[310px] overflow-hidden whitespace-nowrap'>{item.titulo}</h3>
                                                                    <p className='font-normal text-[13px]'>{item.NombreLocal}</p>
                                                                </div>

                                                                {
                                                                    isMobile && <Icon className='absolute right-0 top-0' icon="ic:baseline-close" onClick={(e: any) => deleteFavorites(e, item)} />
                                                                }

                                                                <Icon
                                                                    className={`absolute right-0 top-0 transition-opacity duration-200 ${hoveredFavoriteId === item.idfavoritos ? "opacity-100" : "opacity-0"
                                                                        }`}
                                                                    icon="ic:baseline-close"
                                                                    onClick={(e: any) => {
                                                                        e.stopPropagation(); // Evita que el evento alcance otros handlers
                                                                        deleteFavorites(e, item);
                                                                    }}
                                                                />
                                                            </div>
                                                        )) :

                                                            <div className='p-10 px-16 py-20 relative z-50 text-center mx-auto flex justify-center'>
                                                                <div>
                                                                    <Image src={calendar} alt="" className='mb-6 text-center mx-auto' width={60} height={60} />
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