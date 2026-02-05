'use client';
import useAlertStore from '@/app/zustand/alert';
import { IAuthState, useAuthStore } from '@/app/zustand/auth';
import { ICategoriesState, useCategoriesState } from '@/app/zustand/categories';
import { IFavoriteState, useFavoriteStore } from '@/app/zustand/favorites';
import { useEventCommentsStore } from '@/app/zustand/eventComments';
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
import ModalDates from './ModalDate/ModalDates';

moment.locale('es');

moment.updateLocale('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mié._Jue._Vie._Sáb.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_')
});

const CommentItem = ({ comment, eventId, depth = 0 }: { comment: any, eventId: string, depth?: number }) => {
    const { auth } = useAuthStore();
    const { addComment, deleteComment, editComment, toggleLike } = useEventCommentsStore();
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [replyContent, setReplyContent] = useState('');

    const user = comment.user;
    const name = [user?.profile?.firstName, user?.profile?.lastName].filter(Boolean).join(' ').trim() || user?.email || 'Usuario';
    const avatar = user?.profile?.avatar || '/svg/us.svg';
    const time = comment?.createdAt ? moment(comment.createdAt).fromNow() : '';

    const isOwner = (auth as any)?.id === comment.userId;
    const likesCount = comment._count?.likes || 0;
    const isLiked = comment.isLiked;

    const ownerHref = user?.id ? `/usuario/${user.id}` : '#';

    const handleLike = async () => {
        if (!auth) return; // Add auth check/modal trigger
        await toggleLike(eventId, comment.id);
    };

    const handleReply = async () => {
        if (!replyContent.trim()) return;

        // Flatten logic: If this is already a reply (has parentId), link to the parent.
        // Otherwise, this is the parent.
        const targetParentId = comment.parentId || comment.id;

        // If we are replying to a reply, tag the user
        const finalContent = comment.parentId ? `@${name} ${replyContent}` : replyContent;

        const success = await addComment(eventId, finalContent, targetParentId);
        if (success) {
            setReplyContent('');
            setIsReplying(false);
        }
    };

    const handleEdit = async () => {
        if (!editContent.trim()) return;
        const success = await editComment(eventId, comment.id, editContent);
        if (success) setIsEditing(false);
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        await deleteComment(eventId, comment.id);
        setShowDeleteModal(false);
    };

    return (
        <div className={`flex flex-col gap-3 ${depth > 0 ? 'ml-4 sm:ml-10 border-l-2 border-[#EDEFF5] pl-3 sm:pl-4' : ''}`}>
            <div className="flex items-start gap-2 sm:gap-3">
                <Link href={ownerHref} className="block w-10 h-10 rounded-full overflow-hidden border border-[#EDEFF5] bg-[#F7F7F7] flex-shrink-0 hover:opacity-80 transition-opacity">
                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                        <Link href={ownerHref} className="font-bold text-[#212121] text-sm hover:underline">{name}</Link>
                        <p className="text-[12px] text-[#999]">{time}</p>
                    </div>

                    {isEditing ? (
                        <div className="mt-2">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full bg-[#FAFBFF] border border-[#EDEFF5] rounded-xl p-3 outline-none text-sm min-h-[60px]"
                            />
                            <div className="flex items-center justify-end gap-2 mt-2">
                                <button onClick={() => setIsEditing(false)} className="text-xs text-[#666] font-bold px-3 py-1">Cancelar</button>
                                <button onClick={handleEdit} className="text-xs bg-[#007FA4] text-white font-bold px-4 py-1.5 rounded-full">Guardar</button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-[#444] mt-1 whitespace-pre-line">{comment.content}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1 sm:gap-1.5 text-xs font-bold transition-colors ${isLiked ? 'text-[#861F21]' : 'text-[#666] hover:text-[#861F21]'}`}
                        >
                            <Icon icon={isLiked ? "solar:heart-bold" : "solar:heart-linear"} width={14} />
                            <span>{likesCount > 0 ? likesCount : 'Me gusta'}</span>
                        </button>

                        {auth && (
                            <button
                                onClick={() => setIsReplying(!isReplying)}
                                className="flex items-center gap-1 sm:gap-1.5 text-xs font-bold text-[#666] hover:text-[#007FA4] transition-colors"
                            >
                                <Icon icon="solar:reply-outline" width={14} />
                                <span>Responder</span>
                            </button>
                        )}

                        {isOwner && !isEditing && (
                            <>
                                <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-[#666] hover:text-[#007FA4]">Editar</button>
                                <button onClick={handleDelete} className="text-xs font-bold text-[#666] hover:text-[#861F21]">Eliminar</button>
                            </>
                        )}
                    </div>

                    {isReplying && (
                        <div className="mt-3 flex items-start gap-3">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Escribe una respuesta..."
                                    className="w-full bg-[#FAFBFF] border border-[#EDEFF5] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#007FA4]"
                                    autoFocus
                                />
                            </div>
                            <button
                                onClick={handleReply}
                                disabled={!replyContent.trim()}
                                className="bg-[#007FA4] text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-[#006080] disabled:opacity-50"
                            >
                                Responder
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="flex flex-col gap-3 mt-1">
                    {comment.replies.map((reply: any) => (
                        <CommentItem key={reply.id} comment={reply} eventId={eventId} depth={depth + 1} />
                    ))}
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-[#212121] mb-2">Eliminar comentario</h3>
                        <p className="text-[#666] mb-8 font-medium">¿Estás seguro de eliminar este comentario?</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#007FA4] hover:bg-[#006080] transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#007FA4] bg-[#F0F8FF] hover:bg-[#e0f0fa] transition-colors"
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const EventDate = ({ data, dataFecha, dataPlataformaVenta, owner }: any) => {

    const isMobile = useIsMobile();
    const [date, setDate] = useState<string>("");
    const [daysRemaining, setDaysRemaining] = useState<string>("");
    const [dataFechaOrdenada, setDataFechaOrdenada] = useState<any>(dataFecha);
    const [initHour, setInitHour] = useState<string>("")
    const [visibleItems, _setVisibleItems] = useState<number>(5);
    const [endHour, setEndHour] = useState<string>("")
    const [showModal, setShowModal] = useState<boolean>(false);
    const { categoriesRelations }: ICategoriesState = useCategoriesState();
    const { auth }: IAuthState = useAuthStore();
    const { addFavorite, deleteFavorite }: IFavoriteState = useFavoriteStore();

    // Comments
    const {
        commentsByEvent,
        totalByEvent,
        isLoadingByEvent,
        errorByEvent,
        loadComments,
        addComment,
    } = useEventCommentsStore();

    const eventId = String(data?.[0]?.idEventos || data?.[0]?.ideventos || '');
    const comments = (eventId && commentsByEvent[eventId]) ? commentsByEvent[eventId] : [];
    const totalComments = eventId ? (totalByEvent[eventId] ?? comments.length) : 0;
    const isLoadingComments = eventId ? isLoadingByEvent[eventId] === true : false;
    const commentsError = eventId ? errorByEvent[eventId] : null;
    const [commentText, setCommentText] = useState('');

    const ownerName = [owner?.profile?.firstName, owner?.profile?.lastName].filter(Boolean).join(' ').trim() || owner?.email || 'Organizador';
    const ownerAvatar = owner?.profile?.avatar || '/svg/us.svg';
    const ownerHref = owner?.id ? `/usuario/${owner.id}` : '#';

    const fuente = data?.[0]?.urlFuente || data?.[0]?.websiteUrl;
    const fuenteHref = fuente ? (String(fuente).startsWith('http') ? String(fuente) : `https://${fuente}`) : '#';

    useEffect(() => {
        if (!eventId) return;
        window.scrollTo(0, 0); // Scroll to top when event changes
        loadComments(eventId);
    }, [eventId]);

    useEffect(() => {
        if (data !== undefined) {
            // Filter out past dates first, then sort
            const today = moment().startOf('day');
            const futureDates = (dataFecha || data[0]).filter((item: any) => {
                const fechaEvento = moment(item.FechaInicio).startOf('day');
                return fechaEvento.isSameOrAfter(today);
            });

            const sortedDataFecha = [...futureDates].sort((a: any, b: any) => {
                // @ts-ignore
                return new Date(a.FechaInicio) - new Date(b.FechaInicio);
            });

            setDataFechaOrdenada(sortedDataFecha);
            console.log(sortedDataFecha)
            // Configurar la fecha inicial como la primera disponible
            if (sortedDataFecha.length > 0) {
                const initialDate = moment(sortedDataFecha[0]?.FechaInicio).utcOffset(-5).format('dddd, D [de] MMMM [de] YYYY');
                const days = calcularDiasRestantes(sortedDataFecha[0]?.FechaInicio); // Calcular días restantes
                setDate(initialDate);
                setDaysRemaining(days); // Establecer días restantes
                setInitHour(sortedDataFecha[0]?.HoraInicio);
                setEndHour(sortedDataFecha[0]?.HoraFinal);
            }
        }
    }, [dataFecha, data]);

    const getDate = (item: any) => {
        let date = moment(item.FechaInicio).locale('es').utcOffset(-5).format('dddd, D [de] MMMM [de] YYYY')
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
    const mapRefDesktop: any = useRef(null);
    const mapRefMobile: any = useRef(null);

    const handleScrollToMapDesktop = () => {
        mapRefDesktop.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleScrollToMapMobile = () => {
        mapRefMobile.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCopyLink = async () => {
        const shareData = {
            title: data[0]?.titulo || 'Evento en InjoyPlan',
            text: `¡Mira este evento! ${data[0]?.titulo || ''}`,
            url: window.location.href
        };

        // Use native share if available (mainly mobile devices)
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err: any) {
                // User cancelled share or error
                if (err.name !== 'AbortError') {
                    console.error('Error al compartir', err);
                }
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                useAlertStore.getState().alert("Se ha copiado la url, compartelo con tus amigos :)", "notification");
            }).catch(err => {
                console.error('Error al copiar el enlace', err);
            });
        }
    };

    const addFavoritesByUser = (item: any) => {
        console.log(item)
        if (item?.favorito) {
            deleteFavorite(item)
        } else {
            addFavorite(item)
        }
    }

    if (data === undefined || data.length === 0) {
        return <div>
            <div className="text-center mt-32 mb-32">
                <Image className="mx-auto grayscale" width={100} height={100} alt="No encontrados" src={ticket} />
                <label htmlFor="" className={quicksand.className + ' font-bold text-[#4a4a4a] mb-5'}>El evento a terminado</label>
                <p className={sans.className + ' font-normal text-[#4a4a4a] text-[14px] mt-3'} >Al parecer no hay información sobre este evento</p>
            </div></div>
    }

    console.log(data)

    return (
        <div className="2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg mx-auto mb-10 xl:px-10 px-0">
            {showModal && <ModalDates setShowModal={setShowModal} showModal={showModal} dataFechaOrdenada={dataFechaOrdenada} />}
            {/* Fix: Use grid-cols-1 by default for mobile, and 15 cols for lg (desktop/laptop) */}
            <div className='grid grid-cols-1 lg:grid-cols-[15] mt-10 gap-10'>
                {/* Left Column: Full width on mobile, spans 3 cols on desktop */}
                <div className="lg:col-start-1 lg:col-end-4 px-5">
                    <div>
                        <h2 className='text-[#007FA4] text-3xl font-bold'>{data[0]?.titulo}</h2>
                        <div>
                            <div className=''>
                                {daysRemaining?.length > 0 ? <span className='font-sans text-md'>{date}<strong className='font-thin ml-2'>({daysRemaining})</strong></span> : <p>Aún por confirmar</p>}
                            </div>
                        </div>


                    </div>
                    <div className={styles.fuent}>
                        <img className={styles.logmagen} src={data[0]?.url} alt="bitimg" />
                        <div className='flex justify-between items-center'>
                            <Link
                                className='relative xl:bottom-0 bottom-[-3px]'
                                target='_blank'
                                href={fuenteHref}
                                onClick={(e) => {
                                    if (fuenteHref === '#') e.preventDefault();
                                }}
                            >
                                VER FUENTE <Image src={flechaceleste} alt="flechaceleste" />
                            </Link>
                            <div className="xl:hidden flex items-center">
                                <div className='flex' onClick={handleCopyLink}>
                                    <Image src={compartir} width={20} alt="compartir" /><span className='text-[#A3ABCC] ml-4 font-bold text-md'></span>
                                </div>
                                <div className='flex items-center' onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation(); // Evitar que el clic en el ícono de favorito navegue a la página del evento
                                    addFavoritesByUser(data[0]);
                                }}>
                                    {data[0]?.favorito ? <div className='top-3'>
                                        <Icon className='top-3 relative' color='A3ABCC' width={20} height={20} icon="mdi:heart" /><span className='text-[#A3ABCC] ml-3 font-bold text-md'></span>
                                    </div> :
                                        <div className='relative top-3'>
                                            <Image className='relative' src={fav} alt="fav" /><span className='text-[#A3ABCC] ml-3 font-bold text-md'></span>
                                        </div>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Organizador */}
                    {/* {owner?.id && (
                        <div className="mt-5 bg-white border border-solid border-[#EDEFF5] rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <Link href={ownerHref} className="flex items-center gap-3 min-w-0">
                                    <div className="w-11 h-11 rounded-full overflow-hidden border border-solid border-[#EDEFF5] bg-[#F7F7F7] flex-shrink-0">
                                        <img src={ownerAvatar} alt={ownerName} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[12px] text-[#666] font-bold">Organizador</p>
                                        <p className="font-black text-[#212121] truncate">{ownerName}</p>
                                    </div>
                                </Link>

                                <Link
                                    href={ownerHref}
                                    className="bg-[#007FA4] text-white font-bold px-5 py-2 rounded-full hover:bg-[#006080] transition-colors text-sm"
                                >
                                    Ver perfil
                                </Link>
                            </div>
                        </div>
                    )} */}

                    {
                        // !isMobile && (
                        <div className='lg:block hidden'>
                            <h4 className="text-[#212121] mt-10 text-xl font-bold mb-6">Te contamos:</h4>
                            <div className="text-[#212121] text-md font-thin font-sans mb-6">{ReactHtmlParser(data[0]?.descripcionEvento)}</div>
                        </div>
                    }

                    {
                        // !isMobile && (
                        <div className='lg:block hidden'>
                            <div ref={mapRefDesktop}>
                                <Map location={data[0]?.latitud_longitud} />
                            </div>
                        </div>
                    }
                </div>

                {/* Right Column: Full width on mobile, spans remaining 12 cols on desktop */}
                <div className="lg:col-start-4 lg:col-end-[16] cursor-pointer">

                    <div className="xl:items-center xl:flex xl:justify-end md:block hidden">
                        <div className='flex mr-10' onClick={handleCopyLink}>
                            <Image src={compartir} alt="compartir" /><span className='text-[#A3ABCC] ml-4 font-bold text-md'>Compartir</span>
                        </div>
                        <div onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation(); // Evitar que el clic en el ícono de favorito navegue a la página del evento
                            addFavoritesByUser(data[0]);
                        }}>
                            {data[0]?.favorito ? <div className='flex items-center'>
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
                            {date?.length > 0 ? <p className='font-thin'>{date}. {initHour} - {endHour}</p> : "Aún por confirmar"}
                        </div>

                        <div className='mt-8 font-bold'>
                            <h6>{dataFechaOrdenada?.length === 1 ? "Fecha Disponible" : "Otras fechas disponibles"}</h6>
                            {dataFechaOrdenada?.length === 0 && <p className='font-normal w-[200px] mt-0'>Aún por confirmar</p>}
                            {
                                dataFechaOrdenada?.length > 0 && (
                                    <div className='flex flex-wrap gap-2 mt-5'>

                                        {
                                            dataFechaOrdenada?.slice(0, 5).map((item: any, index: number) => (
                                                <div className='cursor-pointer border py-2.5 w-[60px] sm:w-[70px] h-[60px] sm:h-[70px] rounded px-2 sm:px-3.5 bg-[#fff] border-solid border-[rgba(0,0,0,0.12)]' key={index} onClick={() => getDate(item)}>
                                                    <strong className='block text-center text-lg sm:text-xl'>{moment(item?.FechaInicio).utcOffset(-5).format('D')}</strong>
                                                    <span className='font-thin text-center mx-auto block text-xs sm:text-base'>{moment(item?.FechaInicio).utcOffset(-5).format('MMM').toUpperCase()}</span>
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
                            <div className='mt-8 max-w-full'>
                                <h6>Lugar</h6>
                                <p className='font-thin break-words'>{data[0]?.NombreLocal}</p>
                                <p className='font-thin break-words'>{data[0]?.direccion} {data[0]?.Distrito ? ` - ${data[0]?.Distrito}` : ''}</p>
                            </div>

                            <div>
                                <button onClick={isMobile ? handleScrollToMapMobile : handleScrollToMapDesktop} className={styles.seeMoreButton}>Ver en mapa</button>
                            </div>
                        </div>
                        <div className="mt-7">
                            <h6 className='font-bold mb-2'>{Number(data[0]?.Monto) > 0 ? "Entradas desde" : "Entradas"}</h6>
                            <strong className='text-3xl'>{Number(data[0]?.Monto) === 0 ? "¡Gratis!" : 'S/ ' + Number(data[0]?.Monto).toFixed(2)}</strong>
                        </div>
                        {/* Only show tickets section if there are platforms or ticketUrls */}
                        {((dataPlataformaVenta && dataPlataformaVenta.length > 0) || (data[0]?.ticketUrls && data[0].ticketUrls.length > 0)) && (
                            <div className="mt-10">
                                <h6 className='font-bold'>Consigue tus entradas aquí</h6>
                                {
                                    dataPlataformaVenta?.map((item: any, index: number) => {
                                        const url = item.urlWebLugar ? (String(item.urlWebLugar).startsWith('http') ? String(item.urlWebLugar) : `https://${item.urlWebLugar}`) : '#';
                                        return (
                                            <div className='bg-[#9B292B] mt-6 p-4 text-center rounded-full' key={index}>
                                                <Link className='flex items-center justify-center text-[#fff] font-bold' rel="noopener noreferrer" target="_blank" href={url}><button className='flex items-center'><Image width={20} height={20} className='mr-3' src={item.iconos} alt="loguito" />{item.nombrePlataforma}</button></Link>
                                            </div>
                                        )
                                    })
                                }
                                {
                                    (() => {
                                        const ticketUrls = data[0]?.ticketUrls;
                                        if (!ticketUrls || !Array.isArray(ticketUrls)) return null;

                                        // Count occurrences of each platform name
                                        const nameCounts: { [key: string]: number } = {};
                                        ticketUrls.forEach((link: { name: string }) => {
                                            const name = link.name || 'Entradas';
                                            nameCounts[name] = (nameCounts[name] || 0) + 1;
                                        });

                                        // Track current index for each name
                                        const currentIndex: { [key: string]: number } = {};

                                        return ticketUrls.map((link: { name: string; url: string }, idx: number) => {
                                            const url = link.url?.startsWith('http') ? link.url : `https://${link.url}`;
                                            const baseName = link.name || 'Entradas';

                                            // Increment index for this name
                                            currentIndex[baseName] = (currentIndex[baseName] || 0) + 1;

                                            // Add number if there are multiple of the same type
                                            const displayName = nameCounts[baseName] > 1
                                                ? `${baseName} ${currentIndex[baseName]}`
                                                : baseName;

                                            const getIcon = (name: string) => {
                                                const n = (name || '').toLowerCase();
                                                if (n.includes('tiktok')) return 'ic:baseline-tiktok';
                                                if (n.includes('instagram')) return 'mdi:instagram';
                                                if (n.includes('facebook')) return 'mdi:facebook';
                                                if (n.includes('whatsapp')) return 'mdi:whatsapp';
                                                if (n.includes('web')) return 'mdi:web';
                                                return 'solar:ticket-bold';
                                            };

                                            return (
                                                <div className='bg-[#9B282B] mt-4 p-4 text-center rounded-full' key={`ticket-${idx}`}>
                                                    <Link className='flex items-center justify-center text-[#fff] font-bold' rel="noopener noreferrer" target="_blank" href={url}>
                                                        <Icon icon={getIcon(baseName)} width={24} className='mr-3' />
                                                        {displayName}
                                                    </Link>
                                                </div>
                                            );
                                        });
                                    })()
                                }
                            </div>
                        )}

                    </div>
                    {/*responsive*/}
                    <div className='lg:hidden block px-5'>
                        <div>
                            <h4 className='mb-5 mt-5 font-bold text-[18px]'>Te contamos:</h4>
                            <div className='text-[#212121] text-md font-thin font-sans mb-6'>{ReactHtmlParser(data[0]?.descripcionEvento)}</div>
                        </div>
                    </div>
                    <div className='lg:hidden block max-w-[96%] mx-auto mt-5'>
                        <div ref={mapRefMobile} style={{ marginBottom: "15px", padding: "0px 10px" }}>
                            <Map location={data[0]?.latitud_longitud} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments */}
            {/* {eventId && (
                <div className="mt-10 px-5 xl:px-0">
                    <div className="bg-white border border-solid border-[#EDEFF5] rounded-2xl p-6 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-black text-[#212121]">Comentarios</h3>
                                <p className="text-sm text-[#666]">{totalComments} comentario{totalComments === 1 ? '' : 's'}</p>
                            </div>
                            <button
                                onClick={() => loadComments(eventId)}
                                className="text-[#007FA4] font-bold text-sm hover:underline"
                            >
                                Actualizar
                            </button>
                        </div>

                        {commentsError && (
                            <p className="mt-4 text-sm font-bold text-[#861F21]">{commentsError}</p>
                        )}

                        <div className="mt-6 space-y-6">
                            {isLoadingComments ? (
                                <div className="text-sm text-[#666]">Cargando comentarios...</div>
                            ) : comments.length > 0 ? (
                                comments.map((c: any) => (
                                    <CommentItem key={c.id} comment={c} eventId={eventId} />
                                ))
                            ) : (
                                <div className="text-sm text-[#666]">Aún no hay comentarios. Sé el primero en comentar.</div>
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-[#EDEFF5]">
                            {auth ? (
                                <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                                    <div className="flex-1">
                                        <label className="text-[12px] font-bold text-[#666]">Escribe un comentario</label>
                                        <textarea
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Comparte tu opinión..."
                                            className="w-full mt-2 bg-[#F7F7F7] outline-none border border-solid border-[#EDEFF5] p-3 rounded-xl min-h-[80px] sm:min-h-[90px]"
                                        />
                                    </div>
                                    <button
                                        onClick={async () => {
                                            const ok = await addComment(eventId, commentText);
                                            if (ok) setCommentText('');
                                        }}
                                        className="bg-[#007FA4] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#006080] transition-colors w-full sm:w-auto"
                                    >
                                        Publicar
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-[#FAFBFF] border border-[#EDEFF5] rounded-xl p-4 text-sm text-[#666]">
                                    Inicia sesión para comentar este evento.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )} */}

            {categoriesRelations?.code ? "" : <RelatedEvents data={data} />}
        </div >


    )

};

export default EventDate;
