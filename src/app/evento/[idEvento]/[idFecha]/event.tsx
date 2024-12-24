'use client';
import useAlertStore from '@/app/zustand/alert';
import { IAuthState, useAuthStore } from '@/app/zustand/auth';
import { ICategoriesState, useCategoriesState } from '@/app/zustand/categories';
import { IFavoriteState, useFavoriteStore } from '@/app/zustand/favorites';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import styles from './venta.module.css'
import Image from 'next/image';
import flechaceleste from './../../../../../public/icons/angle_right-celeste.png'
import fav from './../../../../../public/icons/fav.svg'
import compartir from './../../../../../public/icons/compartir.svg'
import { Icon } from '@iconify/react/dist/iconify.js';
import ReactHtmlParser from 'react-html-parser'
import Map from '@/app/components/Map';
import useIsMobile from '@/app/hooks/useIsMobile';
import Link from 'next/link';
import ticket from '../../../../../public/svg/tickets_gray.svg'
import RelatedEvents from '@/app/ui/RelatedEvents';
import { quicksand, sans } from '../../../../../public/fonts';

moment.locale('es');

moment.updateLocale('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mié._Jue._Vie._Sáb.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_')
});

const EventDate = ({ data, dataFecha, dataPlataformaVenta }: any) => {

    const isMobile = useIsMobile();
    const [date, setDate] = useState<string>("");
    const [daysRemaining, setDaysRemaining] = useState<string>("");
    const [dataFechaOrdenada, setDataFechaOrdenada] = useState<any>(dataFecha);
    const [initHour, setInitHour] = useState<string>("")
    const [visibleItems, _setVisibleItems] = useState<number>(5);
    const [endHour, setEndHour] = useState<string>("")
    const [showModal, setShowModal] = useState<boolean>(false);
    const { getCategoriesRelations, categoriesRelations }: ICategoriesState = useCategoriesState();
    const { auth }: IAuthState = useAuthStore();
    const { addFavorite, deleteFavorite }: IFavoriteState = useFavoriteStore();

    useEffect(() => {
        if (data !== undefined) {
            const sortedDataFecha = [...dataFecha || data[0]].sort((a: any, b: any) => {
                // @ts-ignore
                return new Date(a.FechaInicio) - new Date(b.FechaInicio);
            });
            setDataFechaOrdenada(sortedDataFecha);
            console.log(sortedDataFecha)
            // Configurar la fecha inicial como la primera disponible
            if (sortedDataFecha.length > 0) {
                const initialDate = moment(sortedDataFecha[0]?.FechaInicio).utc().format('dddd, D [de] MMMM [de] YYYY');
                const days = calcularDiasRestantes(sortedDataFecha[0]?.FechaInicio); // Calcular días restantes
                setDate(initialDate);
                setDaysRemaining(days); // Establecer días restantes
                setInitHour(sortedDataFecha[0]?.HoraInicio);
                setEndHour(sortedDataFecha[0]?.HoraFinal);
            }
        }
    }, [dataFecha, data]);

    const getDate = (item: any) => {
        let date = moment(item.FechaInicio).locale('es').utc().format('dddd, D [de] MMMM [de] YYYY')
        setDate(date);
        const days = calcularDiasRestantes(item.FechaInicio); // Calcular días restantes
        setDaysRemaining(days); // Establecer días restantes
        setInitHour(item.HoraInicio);
        setEndHour(item.HoraFinal);
    }

    const calcularDiasRestantes = (fechaInicio: string) => {
        const fechaActual = moment().startOf('day');
        const fechaEvento = moment(fechaInicio).startOf('day');
        const diferenciaDias = fechaEvento.diff(fechaActual, 'days');

        if (diferenciaDias === 0) {
            return "hoy";
        } else if (diferenciaDias > 0) {
            return `Dentro de ${diferenciaDias} días`;
        } else {
            return `Hace ${Math.abs(diferenciaDias)} días`;
        }
    };

    const modalShowDates = () => {
        setShowModal(true);
    }

    useEffect(() => {
        if (data !== undefined) {
            getCategoriesRelations(data[0].categoria_id);
        }
    }, [data])

    const mapRefDesktop: any = useRef(null);
    const mapRefMobile: any = useRef(null);

    const handleScrollToMapDesktop = () => {
        mapRefDesktop.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleScrollToMapMobile = () => {
        mapRefMobile.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            useAlertStore.getState().alert("Se ha copiado la url, compartelo con tus amigos :)", "notification");
        }).catch(err => {
            console.error('Error al copiar el enlace', err);
        });
    };

    const addFavoritesByUser = (item: any) => {
        if (auth) {
            console.log(item)
            if (item?.favorito > 0) {
                deleteFavorite(item)
            } else {
                const data = {
                    idEvento: item?.ideventos,
                    idFecha: item?.idfecha,
                    registrado: false
                }
                addFavorite(data)
            }
        } else {
            // setOpenAuth(true)
        }
    }

    if (data === undefined) {
        return <div>
                <div className="text-center mt-32 mb-32">
                    <Image className="mx-auto grayscale" width={100} height={100} alt="No encontrados" src={ticket} />
                    <label htmlFor="" className={quicksand.className + ' font-bold text-[#4a4a4a] mb-5'}>El evento a terminado</label>
                    <p className={sans.className + ' font-normal text-[#4a4a4a] text-[14px] mt-3'} >Al parecer no hay información sobre este evento</p>
                </div></div>
    }

    return (
        <div className="2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg mx-auto mb-10 xl:px-10 px-0">
            {/* {showModal && <ModalDates setShowModal={setShowModal} showModal={showModal} dataFechaOrdenada={dataFechaOrdenada} />} */}
            <div className='grid grid-cols-[15] mt-10 gap-10'>
                <div className="col-start-1 xl:col-start-1 xl:col-end-4 px-5">
                    <div>
                        <h2 className='text-[#007FA4] text-3xl font-bold'>{data[0]?.titulo}</h2>
                        <div>
                            <div className=''>
                               {daysRemaining?.length > 0 ?  <span className='font-sans text-md'>{date}<strong className='font-thin ml-2'>({daysRemaining})</strong></span> : <p>Aún por confirmar</p>}
                            </div>
                        </div>
                    </div>
                    <div className={styles.fuent}>
                        <img className={styles.logmagen} src={data[0]?.url} alt="bitimg" />
                        <div className='flex justify-between items-center'>
                            {/* href={`https://${item.urlFuente}`} */}
                            <Link className='relative xl:bottom-0 bottom-[-3px]' target='_blank' href={`https://${data[0]?.urlFuente}`}>VER FUENTE <Image src={flechaceleste} alt="flechaceleste" /></Link>
                            <div className="xl:hidden flex items-center">
                                <div className='flex' onClick={handleCopyLink}>
                                    <Image src={compartir} width={20} alt="compartir" /><span className='text-[#A3ABCC] ml-4 font-bold text-md'></span>
                                </div>
                                <div className='flex items-center' onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation(); // Evitar que el clic en el ícono de favorito navegue a la página del evento
                                    addFavoritesByUser(data[0]);
                                }}>
                                    {data[0].favorito > 0 ? <div className='top-3'>
                                        <Icon className='top-3 relative' color='A3ABCC' width={20} height={20} icon="mdi:heart" /><span className='text-[#A3ABCC] ml-3 font-bold text-md'></span>
                                    </div> :
                                        <div className='relative top-3'>
                                            <Image className='relative' src={fav} alt="fav" /><span className='text-[#A3ABCC] ml-3 font-bold text-md'></span>
                                        </div>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {
                        // !isMobile && (
                        <div className='xl:block hidden'>
                            <h4 className="text-[#212121] mt-10 text-xl font-bold mb-6">Lo que se sabe del evento</h4>
                            <div className="text-[#212121] text-md font-thin font-sans mb-6">{ReactHtmlParser(data[0]?.descripcionEvento)}</div>
                        </div>
                    }

                    {
                        // !isMobile && (
                        <div className='xl:block hidden'>
                            <div ref={mapRefDesktop}>
                                <Map location={data[0]?.latitud_longitud} />
                            </div>
                        </div>
                    }
                </div>

                <div className="col-start-1  xl:col-start-4 xl:col-end-[16]">

                    <div className="xl:items-center xl:flex xl:justify-end md:block hidden">
                        <div className='flex mr-10' onClick={handleCopyLink}>
                            <Image src={compartir} alt="compartir" /><span className='text-[#A3ABCC] ml-4 font-bold text-md'>Compartir</span>
                        </div>
                        <div onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation(); // Evitar que el clic en el ícono de favorito navegue a la página del evento
                            addFavoritesByUser(data[0]);
                        }}>
                            {data[0].favorito > 0 ? <div className='flex items-center'>
                                <Icon color='A3ABCC' width={20} icon="mdi:heart" /><span className='text-[#A3ABCC] ml-3 font-bold text-md'>Favorito</span>
                            </div> :
                                <div className='flex items-center'>
                                    <Image src={fav} alt="fav" /><span className='text-[#A3ABCC] ml-3 font-bold text-md'>Favorito</span>
                                </div>}
                        </div>
                    </div>
                    <div className='bg-[#f7f7fa] xl:mt-14 mt-0 xl:p-10 p-6 xl:sticky top-0 xl:top-4'>
                        <div>
                            <h6 className='font-bold'>Fecha y hora</h6>
                            {date.length > 0 ? <p className='font-thin'>{date}. {initHour} - {endHour}</p> : "Aún por confirmar"}
                        </div>

                        <div className='mt-8 font-bold'>
                            <h6>{dataFechaOrdenada?.length === 1 ? "Fecha Disponible" : "Otras fechas disponibles"}</h6>
                            {dataFechaOrdenada?.length === 0 && <p className='font-normal w-[200px] mt-0'>Aún por confirmar</p>}
                            {
                                dataFechaOrdenada?.length > 0 && (
                                    <div className='flex mt-5'>

                                        {
                                            dataFechaOrdenada?.slice(0, 5).map((item: any, index: number) => (
                                                <div className='mr-3 cursor-pointer border py-2.5 w-[70px] h-[70px] rounded px-3.5 bg-[#fff] border-solid border-[rgba(0,0,0,0.12)]' key={index} onClick={() => getDate(item)}>
                                                    <strong className='block text-center text-xl'>{moment(item?.FechaInicio).utc().format('D')}</strong>
                                                    <span className='font-thin text-center mx-auto block'>{moment(item?.FechaInicio).utc().format('MMM').toUpperCase()}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }

                            <div>
                                {visibleItems < dataFechaOrdenada?.length && (
                                    <button onClick={modalShowDates} className={styles.seeMoreButton}>Ver todas</button>
                                )}
                            </div>
                            <div className='mt-8'>
                                <h6>Lugar del evento</h6>
                                <p className='font-thin'>{data[0]?.direccion}</p>
                            </div>

                            <div>
                                <button onClick={isMobile ? handleScrollToMapMobile : handleScrollToMapDesktop} className={styles.seeMoreButton}>Ver en mapa</button>
                            </div>
                        </div>
                        <div className="mt-7">
                            <h6 className='font-bold mb-2'>{Number(data[0]?.Monto) > 0 ? "Entradas desde" : "Entradas"}</h6>
                            <strong className='text-3xl'>{Number(data[0]?.Monto) === 0  ? "Gratis" : 'S/ ' + Number(data[0]?.Monto).toFixed(2)}</strong>
                        </div>
                        <div className="mt-10">
                            <h6 className='font-bold'>Consigue tus entradas aquí</h6>
                            {
                                dataPlataformaVenta?.map((item: any, index: number) => (
                                    <div className='bg-[#9B292B] mt-6 p-4 text-center rounded-full' key={index}>
                                        <Link className='flex items-center justify-center text-[#fff] font-bold' rel="noopener noreferrer" target="_blank" href={`https://${item.urlWebLugar}`}><button className='flex items-center'><Image width={20} height={20} className='mr-3' src={item.iconos} alt="loguito" />{item.nombrePlataforma}</button></Link>
                                    </div>
                                ))
                            }
                        </div>

                    </div>
                    {/*responsive*/}
                    {
                        <div className='xl:hidden block px-5'>
                            <div>
                                <h4 className='mb-5 mt-5 font-bold text-[18px]'>Lo que se sabe del evento</h4>
                                <div className='text-[#212121] text-md font-thin font-sans mb-6'>{ReactHtmlParser(data[0]?.descripcionEvento)}</div>
                            </div>
                        </div>
                    }
                    {
                        <div className='xl:hidden block max-w-[96%] mx-auto mt-5'>
                            <div ref={mapRefMobile} style={{ marginBottom: "15px", padding: "0px 10px" }}>
                                <Map location={data[0]?.latitud_longitud} />
                            </div>
                        </div>
                    }
                </div>
            </div>

            {categoriesRelations?.code ? "" : <RelatedEvents data={data} />}
        </div >


    )

};

export default EventDate;