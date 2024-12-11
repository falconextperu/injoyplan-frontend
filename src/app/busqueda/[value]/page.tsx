"use client"
import { ICategoriesState, useCategoriesState } from "@/app/zustand/categories";
import { IEventsState, useEventStore } from "@/app/zustand/events";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import styles from './explorer.module.css'
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


const Busqueda = ({ searchValue, setOpenAuth, auth }: any) => {

    moment.updateLocale('es', {
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
        weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
        weekdaysShort: 'Dom._Lun._Mar._Mié._Jue._Vie._Sáb.'.split('_'),
        weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_')
    });

    const location = useParams();
    const isOnlyNumber = location.value;
    console.log(isOnlyNumber)

    const { getEventSearchByFilters, eventSearchByFilters }: IEventsState = useEventStore();

    const [search, setSearch] = useState<any>(searchValue || typeof isOnlyNumber === "number" ? "" : isOnlyNumber);
    const { countsCategories, getCategoriesCount }: ICategoriesState = useCategoriesState();
    const [category, setCategory] = useState<number>(search?.length === 1 ? Number(search) : 0)
    const { addFavorite, deleteFavorite }: IFavoriteState = useFavoriteStore();


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

    const searchFilters = () => {
        let data = {
            "categoria": search?.length === 1 ? search : 0,
            "TipoEvento": 0,
            "Ubicacion": "",
            "horaInicioFin": "",
            "fecha": "09-10-2024",
            "busqueda": search,
            "cantPage": 12,
            "page": 0
        }
        getEventSearchByFilters(data);
    }

    const [date, setDate] = useState(moment(new Date(), 'DD/MM/YYYY').format('DD-MM-YYYY'));

    const handleDate = (value: string, name: string) => {
        console.log(date)
        console.log(name)
        setDate(moment(value, 'DD/MM/YYYY').format('DD-MM-YYYY'));
    }

    console.log(date)

    useEffect(() => {
        let data = {
            "categoria": category,
            "TipoEvento": 0,
            "Ubicacion": "",
            "horaInicioFin": "",
            "fecha": date,
            "busqueda": search,
            "cantPage": 12,
            "page": 0
        }
        getEventSearchByFilters(data);
    }, [search, date, category])

    const searchDataFilter = () => {
        let data = {
            "categoria": category,
            "TipoEvento": 0,
            "Ubicacion": "",
            "horaInicioFin": "",
            "fecha": date,
            "busqueda": "",
            "cantPage": 12,
            "page": 0
        }
        setIsOpenFilter(false)
        getEventSearchByFilters(data);
    }

    console.log(countsCategories)

    const handleSelectCategory = (_id: number) => {
        setCategory(_id)
    }

    const navigateEvent = (item: any) => {
        navigate.push(`/evento/${item.ideventos}/${item.idfecha}`)
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

    return (
        <div>
            <>
                <div className="bg-[#007FA4]">
                    <div className="py-14 2xl:max-w-screen-2xl xl:max-w-screen-xl mx-auto lg:max-w-screen-lg z-0 relative max-x-screen-md px-3 lg:px-4 xl:px-32">
                        <div className="">
                            <div className="flex items-center px-5 md:px-0">
                                <div className="w-[400px] border-b border-solid border-[#fff] z-0 relative top-2">
                                    <input className="w-full bg-transparent outline-none capitalize text-[#fff]" onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target?.value)} type="text" name='search' />

                                    <div className="md:hidden relative top-[-28px] left-10 flex justify-end w-full">
                                        <div className={styles.buttons__filters}>
                                            <Icon icon="ei:close" onClick={() => setSearch("")} />
                                            <div></div>
                                            <Icon onClick={searchFilters} icon="material-symbols:search" />
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <button className="border-[#fff] border rounded-full text-[#fff] px-20 py-2.5 uppercase ml-3 text-[12px]" onClick={searchFilters}>Buscar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="hidden md:grid md:grid-cols-4 md:overflow-hidden xl:gap-x-32 lg:gap-x-64 gap-5 mt-10 2xl:max-w-screen-2xl xl:max-w-screen-xl mx-auto lg:max-w-screen-lg relative max-x-screen-md px-3 lg:px-4 xl:px-32">
                        <div className="md:col-auto sm:col-start-1 sm:col-end-5">
                            <SelectPro isIconLeft={true} options={distritos} placeholder={`Explora en Lima, Peru`} name='distrito' onChange={() => { }} />
                        </div>
                        <div className="md:col-auto col-start-1 col-end-5">
                            <DateTime onChange={handleDate} name="dateStart" placeholder="desde hoy" />
                        </div>
                        <div className="md:col-auto col-start-1 col-end-5">
                            <SelectPro isIconLeft={false} options={countsCategories?.map((item: any) => ({
                                id: item?.idCategorias,
                                value: item?.nombreCategoria
                            }))} placeholder={`Cualquier categoría`} name='categoria' onChange={handleSelectCategory} />
                        </div>

                    </div>
                    <div className={styles.event__notFound}>
                        {
                            eventSearchByFilters === undefined && <p>No se encontraron resultados para este evento, por favor vuelve intentarlo</p>
                        }
                    </div>
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
                                            <SelectPro isIconLeft={false} options={countsCategories?.map((item: any) => ({
                                                id: item?.idCategorias,
                                                value: item?.nombreCategoria
                                            }))} placeholder={`Cualquier categoría`} name='categoria' onChange={handleSelectCategory} />
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
                                    <motion.div className="max-h-[200px] grid rounded-2xl items-center grid-cols-12 shadow-custom-2 mb-16 relative"
                                        key={index}
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
                                                <Image width={250} height={200} className="h-[revert-layer] w-full object-fill" src={item?.url} alt="imagenes1" />
                                            </div>
                                        </div>
                                        <div className="col-start-6 col-end-11">
                                            <h3 className={`${sans.className} ml-10 font-bold font-sans text-2xl text-[#444]`}>{item?.titulo}</h3>
                                            <h6 className={`${sans.className} ml-10 mt-4 font-[300] font-sans`}>{moment(item?.FechaInicio)?.format('ddd')} {item?.HoraInicio} - {item?.HoraFinal}</h6>
                                            <h5 className={`${sans.className} ml-10 font-[300] font-sans`}>{item?.NombreLocal}</h5>
                                        </div>
                                        <div className="col-start-11 col-end-13 justify-end flex">
                                            <div className="mr-8">
                                                <span className="text-sm flex justify-end">Desde</span>
                                                <p className="mt-5 text-[#007FA4] text-2xl font-bold">S/ {Number(item.Monto).toFixed(2)}</p>
                                                {/* <h6>Visto 21 veces</h6> */}
                                                <div className="flex justify-end">
                                                    <Image className="mr-5 mt-2" src={comp} alt="comp" width={20} height={20} />
                                                    <Image className="mt-2" src={corp} alt="corp" width={20} height={20} />
                                                </div>
                                            </div>
                                        </div>

                                        <Link className="font-[900] absolute bottom-[-30px] left-[110px] text-[#A3ABCC] text-xs flex items-center" href="/about">VER FUENTE <Image className="ml-2" src={flc} alt="flc" width={15} height={15} /></Link>
                                    </motion.div>
                                ))
                            }
                        </div>

                        <div className="block md:hidden px-8">
                            {
                                eventSearchByFilters?.map((item: any, index: number) => (
                                    <Card item={item} height={450} key={index} addFavoritesByUser={addFavoritesByUser} />
                                ))
                            }
                        </div>
                    </div>
                </div>
            </>
        </div>
    )
}

export default Busqueda;