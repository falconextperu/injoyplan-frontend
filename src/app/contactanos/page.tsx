import Image from 'next/image'
import styles from './center.module.css'
import contact from './../../../public/svg/contact.svg'
import { quicksand } from '../../../public/fonts'

const Center = () => {
    return (
        <div className={styles.contact}>
            <div className="bg-[#F8FAFB] flex justify-center pt-14 items-center">
                <div>
                    <Image className='md:w-full w-7/12' src={contact} alt="contactimg" />
                </div>
                <div>
                    <h3 className='md:text-[38px] text-[27px] text-[#9B292B] font-bold md:ml-10 top-[-25px] relative'>Contáctanos</h3>
                </div>
            </div>
            <div className="mx-auto max-w-[700px] bg-[#fff] mt-16 mb-16 px-5 md:px-0">
                <form>
                    <h5 className={quicksand.className + ' mb-10 font-bold md:text-[22px] text-[16px]'}>Déjanos un mensaje y pronto nos comunicaremos contigo.</h5>
                    <div className='grid grid-cols-2 gap-x-10 gap-y-5'>
                        <div className='col-start-1 col-end-3'>
                            <label className={quicksand?.className + ' font-normal md:text-[17px] text-[14px]  text-[#666]'} htmlFor="nombre"><span className="text-[red]">* </span> Nombre completo</label>
                            <input
                                className='rounded w-full p-2 mt-3 text-[14px] border border-solid border-[#0000001F]'
                                type="text"
                                id="nombre"
                                name="nombre"
                                required
                            />
                        </div>
                        <div className='col-start-1 col-end-3 md:col-start-1 md:col-end-2'>
                            <label className={quicksand?.className + ' font-normal md:text-[17px] text-[14px]  text-[#666]'} htmlFor="correo"><span className="text-[red]">* </span> Correo de contacto</label>
                            <input
                                className='rounded w-full p-2 mt-3 text-[14px] border border-solid border-[#0000001F]'
                                type="email"
                                id="correo"
                                name="correo"
                                placeholder='tucorreo@ejemplo.com'
                                required
                            />
                        </div>
                        <div className='col-start-1 col-end-3 md:col-start-2 md:col-end-3'>
                            <label className={quicksand?.className + ' font-normal md:text-[17px] text-[14px]  text-[#666]'} htmlFor="telefono"><span className="text-[red]">* </span> Teléfono</label>
                            <input
                                className='rounded w-full p-2 mt-3 text-[14px] border border-solid border-[#0000001F]'
                                type="tel"
                                id="telefono"
                                name="telefono"
                                required
                            />
                        </div>
                        <div className='col-start-1 col-end-3 md:col-start-1 md:col-end-2'>
                            <label className={quicksand?.className + ' font-normal md:text-[17px] text-[14px]  text-[#666]'} htmlFor="motivoMensaje"><span className="text-[red]">* </span> Motivo del mensaje</label>
                            <select
                                className='rounded w-full p-2 mt-3 text-[14px] border border-solid border-[#0000001F]'
                                id="motivoMensaje"
                                name="motivoMensaje"
                                required
                            >
                                <option value="" className='option-ph'>Seleccionar</option>
                                <option value="" className='option-ph'>Consulta</option>
                                <option value="" className='option-ph'>Sugerencia</option>
                                <option value="" className='option-ph'>Reclamo</option>
                                {/* Agregar opciones */}
                            </select>
                        </div>
                        <div className='col-start-1 col-end-3'>
                            <label className={quicksand?.className + ' font-normal md:text-[17px] text-[14px]  text-[#666]'} htmlFor="descripcion"><span className="text-[red]">* </span> Descripción</label>
                            <textarea
                                id="descripcion"
                                className='rounded w-full p-2 mt-3 h-40 text-[14px] border border-solid border-[#0000001F]'
                                name="descripcion"
                                required
                            />
                            <div className='w-full mx-auto justify-center flex mb-10'>
                                <button className='bg-[#D1D3D4] rounded-full mt-8 px-20 py-3 text-[#fff] font-bold' type="submit">ENVIAR</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <hr />
        </div>
    )
}

export default Center