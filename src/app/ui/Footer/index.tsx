// import styles from './footer.module.css'
import mail from '../../../../public/svg/email.svg'
import facebook from '../../../../public/svg/facebook.svg'
import twi from '../../../../public/svg/twitter.svg'
import youtube from '../../../../public/svg/youtube.svg'
import instagram from '../../../../public/svg/instagram.svg'
import libro from '../../../../public/svg/book.svg'
import Link from 'next/link'
import Image from 'next/image'
import { sans } from '../../../../public/fonts'


const Footer = () => {
    return (
        <div className='border-t border-[#f1f1f1]'>
            <footer className=''>
                <div className='mx-auto max-w-screen-2xl md:max-w-screen-xl pt-16 pb-16'>
                    <div className='flex justify-between'>
                        <div>
                            <h3 className='font-bold text-xl'>Conócenos</h3>
                            <Link href='/nosotros'><p className={`${sans.className} font-[300] mt-6 text-[#212121]`}>Acerca de nosotros</p></Link>
                        </div>
                        <div>
                            <h3 className='font-bold text-xl'>¿Necesitas ayuda?</h3>
                            <Link href="/preguntas-frecuentes"><p className={`${sans.className} font-[300] mt-6 text-[#212121]`}>Preguntas frecuentes</p></Link>
                            <Link href="/contactanos"><p className={`${sans.className} font-[300] mt-6 text-[#212121]`}>Contáctanos</p></Link>
                        </div>
                        <div>
                            <h3 className='font-bold text-xl'>Políticas</h3>
                            <Link href="/politicas-privacidad"><p className={`${sans.className} font-[300] mt-6 text-[#212121]`}>Política de privacidad</p></Link>
                            <p className={`${sans.className} font-[300] mt-6 text-[#212121]`}>Política de cookies</p>
                            <Link href="/terminos-y-condiciones"><p className={`${sans.className} font-[300] mt-6 text-[#212121]`}>Términos y condiciones de uso</p></Link>
                        </div>
                        <div>
                            <h3 className='font-bold text-xl'>Contáctanos</h3>
                            <p className={`${sans.className} font-[300] mt-6 text-[#212121]`}>Escríbenos a nuestra casilla de correo:</p>
                            <strong className='font-sans text-xl flex items-center text-[#007FA4] mt-6 font-normal'><Image className='mr-2' src={mail} alt="mail" /> Contacto@injoyplan.com</strong>
                        </div>
                    </div>


                </div>
                <div className='bg-[#303033]'>
                    <div className='mx-auto max-w-screen-2xl md:max-w-screen-xl pt-8 pb-8 flex justify-between items-center'>
                        <div>
                            <p className='text-[#fff]'>Copyright © 2021 Injoyplan</p>
                        </div>
                        <div className='flex items-center'>
                            <div className='flex justify-between border-r border-solid border-[rgba(255,255,255,0.1)]'>
                                <div>
                                    <Image className='p-2 mr-6 border border-solid rounded-full' width={40} height={40} objectFit='cover' src={facebook} alt="facebook" />
                                </div>
                                <div>
                                    <Image className='p-2 mr-6 border border-solid rounded-full' width={40} height={40} objectFit='cover' src={twi} alt="twi" />
                                </div>
                                <div>
                                    <Image className='p-2 mr-6 border border-solid rounded-full' width={40} height={40} objectFit='cover' src={youtube} alt="youtube" />
                                </div>
                                <div>
                                    <Image className='p-2 mr-6 border border-solid rounded-full' width={40} height={40} objectFit='cover' src={instagram} alt="instagram" />
                                </div>
                            </div>
                            <div className='ml-6 flex justify-center text-center'>
                                <div className='text-center mx-auto w-full'>
                                    <Image width={50} height={50} className='text-center mx-auto' src={libro} alt="libro" />
                                    <p className='text-[#fff] text-sm'>Libro de Reclamaciones</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer
