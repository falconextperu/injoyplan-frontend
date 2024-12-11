import styles from './quest.module.css'
import question from './../../../public/svg/question.svg'
import lupa from './../../../public/svg/search.svg'
import plus from '../../../public/svg/plus.svg'
import Image from 'next/image'
import { quicksand } from '../../../public/fonts'

const Quest = () => {
    return (
        <div className="">
            <div className='bg-[#F8FAFB]'>
                <div className="pt-10 max-w-screen-md mx-auto md:flex items-center justify-start pb-10 md:px-0 px-10">
                    <div className='flex items-center'>
                        <Image src={question} className='md:w-full w-3/12' alt="dreamimg" />
                        <h3 className={`${quicksand.className} block ml-10 md:hidden text-3xl font-bold text-[#9B292B]`}>¿Preguntas? Busca aquí</h3>
                    </div>
                    <div className='md:ml-28 ml-10 hidden md:block'>
                        <h3 className={`${quicksand.className}  text-3xl font-bold text-[#9B292B]`}>¿Preguntas? Busca aquí</h3>
                        <div className='relative justify-between top-10 border border-solid border-[#E8E8E8] bg-[#fff] flex p-3 rounded-full w-[450px]'>
                            <div>
                                <input className='outline-none w-full' type="text" placeholder="Escribe tu pregunta" />
                            </div>
                            <div>
                                <Image src={lupa} alt="lupa" />
                            </div>
                        </div>
                    </div>
                    <div className='block md:hidden mb-10'>
                        <div className='relative justify-between top-10 border border-solid border-[#E8E8E8] bg-[#fff] flex p-3 rounded-full w-[450px]'>
                            <div>
                                <input className='outline-none w-full' type="text" placeholder="Escribe tu pregunta" />
                            </div>
                            <div>
                                <Image src={lupa} alt="lupa" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-screen-lg mx-auto grid grid-cols-12 gap-3 md:mt-20 mt-10 mb-16 md:px-0 px-5">
                <div className="grid-start-1 grid-end-2 hidden md:block">
                    <h3 className='font-bold'>CATEGORÍAS</h3>
                    <ul>
                        <li className='mt-3'><a href="#" className="text-sm font-bold text-[#007FA4]">Todas</a></li>
                        <li className='mt-3'><a href="#" className="text-sm ">Compras</a></li>
                        <li className='mt-3'><a href="#" className="text-sm">Servicios</a></li>
                        <li className='mt-3'><a href="#" className="text-sm">Compartir</a></li>
                    </ul>
                </div>
                <div className="md:col-start-3 md:col-end-12 col-start-1 col-end-13">
                    <div className="border-[#007fa4] border-solid border pt-5 pb-5 cursor-pointer px-4 rounded-md mb-5 flex justify-between items-center">
                        <h4 className='font-[600] text-[#007FA4]'>¿Usar Injoyplan tiene algún costo?</h4>
                        <Image src={plus} width={20} height={20} alt="mas"/>
                    </div>
                    <div className="border-[#007fa4] border-solid border pt-5 pb-5 cursor-pointer px-4 rounded-md mb-5 flex justify-between items-center">
                        <h4 className='font-[600] text-[#007FA4]'>¿Injoyplan organiza los eventos que se encuentran en su sitio web?</h4>
                        <Image src={plus} width={20} height={20} alt="mas"/>
                    </div>
                    <div className="border-[#007fa4] border-solid border pt-5 pb-5 cursor-pointer px-4 rounded-md mb-5 flex justify-between items-center">
                        <h4 className='font-[600] text-[#007FA4]'>¿En dónde encuentro la información de los eventos que se muestran en el sitio web?</h4>
                        <Image src={plus} width={20} height={20} alt="mas"/>
                    </div>
                    <div className="border-[#007fa4] border-solid border pt-5 pb-5 cursor-pointer px-4 rounded-md mb-5 flex justify-between items-center">
                        <h4 className='font-[600] text-[#007FA4]'>¿En dónde compro las entradas de los eventos?</h4>
                        <Image src={plus} width={20} height={20} alt="mas"/>
                    </div>
                    <div className="border-[#007fa4] border-solid border pt-5 pb-5 cursor-pointer px-4 rounded-md mb-5 flex justify-between items-center">
                        <h4 className='font-[600] text-[#007FA4]'>¿Puedo crearme una cuenta personal para uso del sitio web?</h4>
                        <Image src={plus} width={20} height={20} alt="mas"/>
                    </div>
                    <div className="border-[#007fa4] border-solid border pt-5 pb-5 cursor-pointer px-4 rounded-md mb-5 flex justify-between items-center">
                        <h4 className='font-[600] text-[#007FA4]'>¿Cómo puedo registrar algún evento en el sitio web?</h4>
                        <Image src={plus} width={20} height={20} alt="mas"/>
                    </div>
                    <div className="border-[#007fa4] border-solid border pt-5 pb-5 cursor-pointer px-4 rounded-md mb-5 flex justify-between items-center">
                        <h4 className='font-[600] text-[#007FA4]'>¿Puedo guardar los eventos que me interesan?</h4>
                        <Image src={plus} width={20} height={20} alt="mas"/>
                    </div>
                    <div className="border-[#007fa4] border-solid border pt-5 pb-5 cursor-pointer px-4 rounded-md mb-5 flex justify-between items-center">
                        <h4 className='font-[600] text-[#007FA4]'>¿Puedo compartir los eventos?</h4>
                        <Image src={plus} width={20} height={20} alt="mas"/>
                    </div>
                    <div className="border-[#007fa4] border-solid border pt-5 pb-5 cursor-pointer px-4 rounded-md mb-5 flex justify-between items-center">
                        <h4 className='font-[600] text-[#007FA4]'>¿Qué pasa si algún evento se modifica o cancela?</h4>
                        <Image src={plus} width={20} height={20} alt="mas"/>
                    </div>
                    <div className="border-[#007fa4] border-solid border pt-5 pb-5 cursor-pointer px-4 rounded-md mb-5 flex justify-between items-center">
                        <h4 className='font-[600] text-[#007FA4]'>¿En qué ciudades de Perú puedo buscar?</h4>
                        <Image src={plus} width={20} height={20} alt="mas"/>
                    </div>
                    <div className="border-[#007fa4] border-solid border pt-5 pb-5 cursor-pointer px-4 rounded-md mb-5 flex justify-between items-center">
                        <h4 className='font-[600] text-[#007FA4]'>¿Dónde puedo contactarlos?</h4>
                        <Image src={plus} width={20} height={20} alt="mas"/>
                    </div>
                    <div className="border-[#007fa4] border-solid border pt-5 pb-5 cursor-pointer px-4 rounded-md mb-5 flex justify-between items-center">
                        <h4 className='font-[600] text-[#007FA4]'>¿Cuáles son las condiciones generales del servicio y uso de la web?
                        </h4>
                        <Image src={plus} width={20} height={20} alt="mas"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Quest