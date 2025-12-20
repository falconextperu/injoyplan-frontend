"use client"
import { ICategoriesState, useCategoriesState } from "@/app/zustand/categories";
import { IEventsState, useEventStore } from "@/app/zustand/events";
import moment from "moment";
import { useRouter, useParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import ticket from '../../../../public/svg/tickets_gray.svg'
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import SelectPro from "@/app/components/SelectPro";
import { DateTime } from "@/app/components/Date";
import comp from './../../../../public/svg/share.svg'
import corp from './../../../../public/svg/heart.svg'
import filter from './../../../../public/svg/filter.svg'
import flc from './../../../../public/svg/angle_right.svg'
import Link from "next/link";
import Image from "next/image";
import { quicksand, sans } from "../../../../public/fonts";
import Card from "@/app/components/Card";
import { IFavoriteState, useFavoriteStore } from "@/app/zustand/favorites";
import useOutsideClick from "@/app/hooks/useOutsideClick";
import ReactModal from "react-modal";
import { IAuthState, useAuthStore } from "@/app/zustand/auth";
import Auth from "@/app/ui/Auth";
import useAlertStore from "@/app/zustand/alert";
import useDebounce from "@/app/hooks/useDebounce";
import MoreFilters from "@/app/ui/MoreFilters";


const BusquedaEvento = () => {
    const params = useParams();

    moment.updateLocale('es', {
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
        weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
        weekdaysShort: 'Dom._Lun._Mar._Mié._Jue._Vie._Sáb.'.split('_'),
        weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_')
    });

    const { getEventSearchByFilters, eventSearchByFilters, total, valueSearch }: IEventsState = useEventStore();

    // If navigating via category ID (params.value exists), reset search text to empty
    // Otherwise, use the stored valueSearch from header search
    const paramValue = Array.isArray(params?.value) ? params.value[0] : params?.value;
    const isNavigatingByCategory = paramValue && Number(paramValue) !== 0;
    const [search, setSearch] = useState<any>(isNavigatingByCategory ? '' : valueSearch);

    const { countsCategories, getCategoriesCount, categoryInfo }: ICategoriesState = useCategoriesState();

    // Initialize category from URL params if available, otherwise fallback to store or 0
    // paramValue is already declared above
    const initialCategory = paramValue ? Number(paramValue) : (categoryInfo !== null ? categoryInfo?.idCategorias : 0);
    const [category, setCategory] = useState<number>(initialCategory);
    const { addFavorite, deleteFavorite }: IFavoriteState = useFavoriteStore();
    const { auth }: IAuthState = useAuthStore();
    const [openAuth, setOpenAuth] = useState<boolean>(false);

    const distritos = [
        { "id": 1, "value": "Cercado de Lima" },
        { "id": 2, "value": "Ate" },
        { "id": 3, "value": "Barranco" },
        { "id": 4, "value": "Breña" },
        { "id": 5, "value": "Comas" },
        { "id": 6, "value": "Chorrillos" },
        { "id": 7, "value": "El Agustino" },
        { "id": 8, "value": "Jesús María" },
        { "id": 9, "value": "La Molina" },
        { "id": 10, "value": "La Victoria" },
        { "id": 11, "value": "Lince" },
        { "id": 12, "value": "Los Olivos" },
        { "id": 13, "value": "Lurigancho" },
        { "id": 14, "value": "Lurín" },
        { "id": 15, "value": "Magdalena del Mar" },
        { "id": 16, "value": "Miraflores" },
        { "id": 17, "value": "Pachacámac" },
        { "id": 18, "value": "Pucusana" },
        { "id": 19, "value": "Pueblo Libre" },
        { "id": 20, "value": "Puente Piedra" },
        { "id": 21, "value": "Punta Hermosa" },
        { "id": 22, "value": "Punta Negra" },
        { "id": 23, "value": "Rímac" },
        { "id": 24, "value": "San Bartolo" },
        { "id": 25, "value": "San Borja" },
        { "id": 26, "value": "San Isidro" },
        { "id": 27, "value": "San Juan de Lurigancho" },
        { "id": 28, "value": "San Juan de Miraflores" },
        { "id": 29, "value": "San Luis" },
        { "id": 30, "value": "San Martín de Porres" },
        { "id": 31, "value": "San Miguel" },
        { "id": 32, "value": "Santa Anita" },
        { "id": 33, "value": "Santa María del Mar" },
        { "id": 34, "value": "Santa Rosa" },
        { "id": 35, "value": "Santiago de Surco" },
        { "id": 36, "value": "Surquillo" },
        { "id": 37, "value": "Villa El Salvador" },
        { "id": 38, "value": "Villa María del Triunfo" }
    ]

    const navigate = useRouter();

    const [date, setDate] = useState('');
    const [limit, setLimit] = useState(12);
    const [distrito, setDistrito] = useState<string | undefined>(undefined);

    // New validation filters state
    const [filtersMore, setFiltersMore] = useState({
        esGratis: false,
        enCurso: false,
        horaInicio: "",
        horaFin: ""
    });

    const handleDate = (value: string, _name: string) => {
        // setSearch("");
        setDate(moment(value, 'DD/MM/YYYY').format('DD-MM-YYYY'));
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    const searchDebounce = useDebounce(search, 1000)

    console.log(date)

    // fijate que puedo hacer para que getEventSearchByFilters se llame solo cuando el usuario haga una busqueda    
    // por ahora se llama cada vez que el usuario cambia el valor de searchDebounce, category, limit o date

    const buildSearchData = () => {
        const categoryName = countsCategories?.find((c: any) => Number(c.idCategorias) === Number(category))?.nombreCategoria || '';
        const formattedDate = date ? moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD') : '';

        return {
            "categoria": Number(category) !== 0 ? categoryName : undefined,
            "distrito": distrito,
            "fechaInicio": formattedDate,
            "busqueda": searchDebounce,
            "limit": limit,
            "page": 1, // Backend uses 1-based index or skip/limit? Controller says skip = (page - 1) * limit. So Page 1 is start.
            "esGratis": filtersMore.esGratis ? true : undefined,
            "enCurso": filtersMore.enCurso ? true : undefined,
            "horaInicio": filtersMore.horaInicio || undefined,
            "horaFin": filtersMore.horaFin || undefined
        };
    }

    useEffect(() => {
        // If searching by category (value !== 0), wait for categories list to be loaded
        // so we can resolve the name. 
        // IF category is 0, we do NOT need to wait, we search immediately.

        const categorySelected = Number(category) !== 0; // Ensure number comparison
        const categoriesLoaded = countsCategories && countsCategories.length > 0;

        if (categorySelected && !categoriesLoaded) {
            // Wait for categories to load only if we need to resolve a name
            return;
        }

        // Debounce effect is already handled by useDebounce hook producing 'searchDebounce'
        // We trigger search when any filter changes
        const data = buildSearchData();
        getEventSearchByFilters(data);

    }, [searchDebounce, category, limit, date, countsCategories, filtersMore, distrito])

    const searchDataFilter = () => {
        const data = buildSearchData();
        setIsOpenFilter(false)
        getEventSearchByFilters(data);
    }

    console.log(countsCategories)

    const handleSelectCategory = (_id: number) => {
        // setSearch("");
        setCategory(_id)
    }

    const handleSelectDistrict = (_id: number, value: string) => {
        // SelectPro passes (id, value, name, ...) to onChange
        // We use the value directly as district name for the backend filter
        setDistrito(value);
    }

    const navigateEvent = (item: any) => {
        navigate.push(`/evento/${item?.ideventos}/${item?.idfecha}`)
    }

    useEffect(() => {
        getCategoriesCount();
    }, [])

    console.log(eventSearchByFilters)
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

    const [isOpenFilter, setIsOpenFilter, ref] = useOutsideClick(false);

    const closeModal = () => {
        setIsOpenFilter(false);
        document.body.classList.remove('ReactModal__Body--open');
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            useAlertStore.getState().alert("Se ha copiado la url, compartelo con tus amigos :)", "notification");
        }).catch(err => {
            console.error('Error al copiar el enlace', err);
        });
    };

    console.log(search)

    return (
        <div>
            <>
                <Auth openAuth={openAuth} setOpenAuth={setOpenAuth} />
                <div className="bg-[#007FA4]">
                    <div className="py-14 2xl:max-w-screen-2xl xl:max-w-screen-xl mx-auto lg:max-w-screen-lg z-0 relative max-x-screen-md px-3 lg:px-4 xl:px-32">
                        <div className="">
                            <div className="flex items-center px-5 md:px-0">
                                <div className="w-[400px] border-b border-solid border-[#fff] z-0 relative top-2">
                                    <input value={search} placeholder="Ingresa tu busqueda" className="placeholder:text-[#fff] w-full bg-transparent outline-none capitalize text-[#fff]" onChange={handleChange} type="text" name='search' />
                                    {search.length === 0 && <Icon icon="ei:search" className="absolute right-2 top-[-8px]" width={30} color="#fff" onClick={() => setSearch("")} />}
                                    <div className="absolute top-[-10px] right-2 cursor-pointer">
                                        {search.length > 0 && <Icon icon="ei:close" width={30} color="#fff" onClick={() => setSearch("")} />}
                                    </div>
                                    <div className="absolute top-[-10px] right-2 cursor-pointer">
                                        {search.length > 0 && <Icon icon="ei:close" width={30} color="#fff" onClick={() => setSearch("")} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="hidden md:grid md:grid-cols-4 xl:gap-x-32 lg:gap-x-64 gap-5 mt-10 2xl:max-w-screen-2xl xl:max-w-screen-xl mx-auto lg:max-w-screen-lg relative max-x-screen-md px-3 lg:px-4 xl:px-32">
                        <div className="md:col-auto sm:col-start-1 sm:col-end-5">
                            <SelectPro isIconLeft={true} options={distritos} placeholder={`Explora en Lima, Peru`} name='distrito' onChange={handleSelectDistrict} />
                        </div>
                        <div className="md:col-auto col-start-1 col-end-5 z-20">
                            <DateTime onChange={handleDate} name="dateStart" placeholder="desde hoy" />
                        </div>
                        <div className="md:col-auto col-start-1 col-end-5 z-20">
                            <SelectPro isIconLeft={false} options={[{ id: 0, value: "Todas las categorías" }, ...(countsCategories?.map((item: any) => ({
                                id: item?.idCategorias,
                                value: item?.nombreCategoria
                            })) || [])]} defaultValue={categoryInfo?.nombreCategoria} placeholder={`Todas las categorías`} name='categoria' onChange={handleSelectCategory} />
                        </div>
                        <div className="md:col-auto col-start-1 col-end-5 flex items-center">
                            <MoreFilters onApply={(data: any) => setFiltersMore({ ...filtersMore, ...data })} />
                        </div>

                    </div>

                    {
                        eventSearchByFilters === undefined || eventSearchByFilters?.length === 0 ? (
                            <div className="text-center mt-32 mb-32">
                                <Image className="mx-auto grayscale" width={100} height={100} alt="No encontrados" src={ticket} />
                                <label htmlFor="" className={quicksand.className + ' font-bold text-[#4a4a4a] mb-5'}>No encontramos eventos</label>
                                <p className={sans.className + ' font-normal text-[#4a4a4a] text-[14px] mt-3'} >Intenta cambiando los filtros de búsqueda </p>
                            </div>
                        ) : ""
                    }

                    <div className="md:hidden px-8 mt-10 flex items-center justify-between">
                        <p>{eventSearchByFilters?.length} resultados</p>
                        <div className="flex cursor-pointer" onClick={() => setIsOpenFilter(true)}>
                            <p className="text-[#007FA4] uppercase font-bold mr-2">Filtros </p>
                            <Image src={filter} width={20} height={20} alt="filtro" />
                        </div>
                    </div>
                    {
                        isOpenFilter && (
                            <ReactModal className={"p-0"} onRequestClose={() => setIsOpenFilter(false)} ariaHideApp={false} isOpen={isOpenFilter}>
                                <div ref={ref} className="absolute top-0 w-full bg-[#fff] h-[100vh] z-50 p-10 overflow-hidden">
                                    <h5 className="font-bold text-2xl border-b border-solid border-[#ddd] pb-5">Filtros de búsqueda</h5>
                                    <div className="absolute top-3 right-3">
                                        <Icon width={30} icon="ei:close" onClick={closeModal} />
                                    </div>
                                    <div className="md:grid md:grid-cols-4 md:overflow-hidden xl:gap-x-32 lg:gap-x-64 gap-5 mt-10 2xl:max-w-screen-2xl xl:max-w-screen-xl mx-auto lg:max-w-screen-lg relative max-x-screen-md lg:px-4 xl:px-32">
                                        <div className="md:col-auto sm:col-start-1 sm:col-end-5 w-full">
                                            <SelectPro isIconLeft={true} options={distritos} placeholder={`Explora en Lima, Peru`} name='distrito' onChange={() => { }} />
                                        </div>
                                        <div className="md:col-auto col-start-1 col-end-5 mt-5 w-full">
                                            <DateTime onChange={handleDate} name="dateStart" placeholder="desde hoy" />
                                        </div>
                                        <div className="md:col-auto col-start-1 col-end-5 mt-5 pb-10 w-full">
                                            <SelectPro isIconLeft={false} options={[{ id: 0, value: "Todas las categorias" }, ...countsCategories?.map((item: any) => ({
                                                id: item?.idCategorias,
                                                value: item?.nombreCategoria
                                            }))]} placeholder={`Todas las categorias`} name='categoria' onChange={handleSelectCategory} />
                                        </div>
                                        <div className="border-t border-solid border-[#ddd]"></div>
                                        <div className="flex w-full">
                                            <button onClick={searchDataFilter} className="bg-[#007FA4] uppercase mt-5 text-center w-full py-3 text-[#fff] rounded-full font-bold">Aplicar</button>
                                        </div>
                                    </div>
                                </div>
                            </ReactModal>
                        )
                    }
                    <div className="2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg lg:px-4 h-18 py-5 mx-auto p-0 mt-3 xl:px-32">
                        <div className="hidden md:block">
                            {
                                eventSearchByFilters?.map((item: any, index: number) => (
                                    <div key={`${item?.idEventos ?? item?.ideventos}-${item?.idfecha ?? item?.FechaInicio}-${index}`}>
                                        <motion.div {...({ className: "max-h-[200px] grid rounded-2xl items-center grid-cols-12 shadow-custom-2 mb-16 relative" }) as any}
                                            // key={`${item?.idEventos ?? item?.ideventos}-${item?.idfecha ?? item?.FechaInicio}-${index}`}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => navigateEvent(item)}
                                            layout
                                            initial={{ opacity: 0, y: 50 }}  // Animación inicial (fuera de la vista)
                                            animate={{ opacity: 1, y: 0 }}  // Animación al entrar (desplazamiento hacia arriba)
                                            exit={{ opacity: 0, y: -50 }}  // Animación al salir (desplazamiento hacia abajo)
                                            transition={{ duration: 0.5, ease: "easeInOut" }}  // Transición suave
                                        >
                                            <div className="col-start-1 col-end-2 text-center">
                                                <strong className={`${quicksand.className} block font-[900] text-5xl text-[#444]`}>{moment(item?.FechaInicio)?.format('DD')}</strong>
                                                <span className={`${quicksand.className}font-sans font-[700] text-2xl text-[#444]`}>{moment(item?.FechaInicio)?.format('MMM').toUpperCase()}</span>
                                            </div>
                                            <div className="col-start-2 col-end-6 max-h-[200px]">
                                                <div className="max-h-[200px] w-full">
                                                    {item?.url ? (
                                                        <Image width={250} height={200} className="h-[revert-layer] w-full object-fill" src={item.url} alt="imagenes1" />
                                                    ) : (
                                                        <div className="h-[200px] w-full bg-[#f2f2f2]" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-start-6 col-end-11">
                                                <h3 className={`${sans.className} ml-10 font-bold font-sans text-2xl text-[#444]`}>{item?.titulo}</h3>
                                                <h6 className={`${sans.className} ml-10 mt-4 font-[300] text-[14px] font-sans`}>{moment(item?.FechaInicio)?.format('ddd')} {item?.HoraInicio} - {item?.HoraFinal}</h6>
                                                <h5 className={`${sans.className} ml-10 mt-1 font-[300] text-[14px] font-sans`}>{item?.descripcion}</h5>
                                            </div>
                                            <div className="col-start-11 col-end-13 justify-end flex">
                                                <div className="mr-8">
                                                    <span className="text-sm flex justify-end">Desde</span>
                                                    <p className="mt-5 text-[#007FA4] text-2xl font-bold">{item?.Monto > 0 ? `S/ ${Number(item.Monto).toFixed(2)}` : "¡Gratis!"}</p>
                                                    {/* <h6>Visto 21 veces</h6> */}
                                                    <div className="flex justify-end items-center">
                                                        <div onClick={(e) => {
                                                            handleCopyLink();
                                                            e.preventDefault();
                                                            e.stopPropagation(); // Evitar que el clic en el ícono de favorito navegue a la página del evento

                                                        }}>
                                                            <Icon color="#037BA1" className="mr-2 top-1 relative" icon="iconamoon:copy-light" width="26" height="26" />
                                                        </div>

                                                        <div onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation(); // Evitar que el clic en el ícono de favorito navegue a la página del evento
                                                            addFavoritesByUser(item);
                                                        }}>
                                                            {item?.favorito > 0 ? <div className='relative top-4'>
                                                                <Icon color='#037BA1' width={28} icon="mdi:heart" /><span className='text-[#037BA1] ml-3 font-bold text-md'></span>
                                                            </div> :
                                                                <div className='relative top-4'>
                                                                    <Image src={corp} alt="fav" width={24} /><span className='text-[#037BA1] ml-3 font-bold text-md'></span>
                                                                </div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <Link className="font-[900] absolute bottom-[-30px] left-[110px] text-[#A3ABCC] text-xs flex items-center" href="/about">VER FUENTE <Image className="ml-2" src={flc} alt="flc" width={15} height={15} /></Link>
                                        </motion.div>
                                    </div>
                                ))
                            }
                        </div>

                        {
                            limit >= total ? "" : (
                                <div className='text-[#007fa4] font-bold flex justify-center mt-10 mb-10 border-2 border-solid border-[#007FA4] p-2 w-fit mx-auto rounded-full px-16'>
                                    <button onClick={() => setLimit((page: any) => page + 12)} type="submit">VER MÁS EVENTOS</button>
                                </div>
                            )
                        }

                        <div className="block md:hidden px-8">
                            {
                                eventSearchByFilters?.map((item: any, index: number) => (
                                    <Card item={item} height={450} key={`${item?.idEventos ?? item?.ideventos}-${item?.idfecha ?? item?.FechaInicio}-${index}`} addFavoritesByUser={addFavoritesByUser} />
                                ))
                            }
                        </div>
                    </div>
                </div>
            </>
        </div>
    )
}

export default BusquedaEvento;