import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import heartOutline from '../../../../public/svg/favorite.svg'
import heart from '../../../../public/svg/shape.svg'
import Angle from '../../../../public/svg/angle_right.svg'
import moment from "moment";
import { Event } from "@/app/interfaces/event";

interface IProps {
    key: number
    item: Event
    height?: number
    addFavoritesByUser: (event: Event) => void
}

const Card = ({ item, addFavoritesByUser,height }: IProps) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50 }}  // Animación inicial (fuera de la vista)
            animate={{ opacity: 1, y: 0 }}  // Animación al entrar (desplazamiento hacia arriba)
            exit={{ opacity: 0, y: -50 }}  // Animación al salir (desplazamiento hacia abajo)
            transition={{ duration: 0.5, ease: "easeInOut" }}  // Transición suave
            className={`min-h-[${height}] flex flex-col justify-between w-full mb-5 md:mb-5`}
        >
            <Link
                href={`/evento/${item.ideventos}/${item.idfecha}`}
                className='h-full w-full'>
                <div className="bg-[#fff] h-full w-full rounded-t-2xl rounded-b-2xl border border-solid] shadow-custom-2 group">
                    <div className='w-full h-56 rounded-t-2xl relative'>
                        <Image src={item.url} alt="img2" width={400} height={400} className='h-full w-full object-fill rounded-t-2xl' />
                        <div onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation(); // Evitar que el clic en el ícono de favorito navegue a la página del evento
                            addFavoritesByUser(item);
                        }}
                        // className={styles.heart}
                        >
                            <Image
                                width={30}
                                height={30}
                                className="absolute right-3 bg-[rgba(255,255,255,0.8)] rounded-full top-3 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                src={item.esfavorito === 1 ? heart : heartOutline} alt="" />
                        </div>
                        {
                            item.Destacado === 1 && (
                                <div className="uppercase absolute p-1 px-4 left-3 bottom-[-12px] bg-[#007FA4] rounded-full text-sm text-[#fff] font-bold">
                                    <p>Destacado</p>
                                </div>
                            )
                        }
                    </div>
                    <div className='p-4 bg-[#fff] rounded-bl-2xl rounded-br-2xl'>
                        <div>
                            <span className='text-xs font-bold text-[#4a4a4a]'>{moment(item.FechaInicio).utc().format('D MMM').toUpperCase()} - {item.HoraInicio} - {item.HoraFinal}</span>
                            <h3 className='font-black text-xl text-[#212121]'>{item.titulo}</h3>
                            <h5 className='text-sm font-normal mb-3 text-[#212121] mt-2'>{item.NombreLocal}</h5>
                        </div>
                        <div>
                            <strong className='text-[10px] font-bold uppercase text-[#212121]'>Desde</strong>
                            <h4 className='font-bold text-xl text-[#212121]'>{Number(item.Monto) > 0 ? `S/ ${item.Monto.toFixed(2)}` : "Gratis"}</h4>
                        </div>
                    </div>

                </div>
            </Link>
            <Link className='flex text-[11px] mt-2 text-[#A3ABCC] font-bold' href={`https://${item.urlFuente}`} target="_blank" rel="noopener noreferrer">
                VER FUENTE
                <Image className='ml-1' src={Angle} height={10} width={10} alt='Angulo' />
            </Link>
        </motion.div>
    )
}

export default Card;