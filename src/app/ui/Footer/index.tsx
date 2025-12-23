"use client"
import mail from '../../../../public/svg/email.svg';
import facebook from '../../../../public/svg/facebook.svg';
import twi from '../../../../public/svg/twitter.svg';
import youtube from '../../../../public/svg/youtube.svg';
import arrow from '../../../../public/svg/arrowdown.svg';
import instagram from '../../../../public/svg/instagram.svg';
import tiktok from '../../../../public/svg/tiktok.svg';
import libro from '../../../../public/svg/book.svg';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section: any) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="border-t border-[#f1f1f1]">
      <footer>
        {/* Desktop View */}
        <div className="hidden md:block mx-auto 2xl:max-w-screen-2xl xl:max-w-screen-xl max-w-[980px] pt-16 pb-16 xl:px-10">
          <div className="flex justify-between flex-wrap">
            <div>
              <h3 className="font-bold text-xl">Conócenos</h3>
              <Link href="/nosotros">
                <p className="font-light mt-6 text-[#212121]">Acerca de nosotros</p>
              </Link>
            </div>
            <div>
              <h3 className="font-bold text-xl">¿Necesitas ayuda?</h3>
              <Link href="/preguntas-frecuentes">
                <p className="font-light mt-6 text-[#212121]">Preguntas frecuentes</p>
              </Link>
              <Link href="/contactanos">
                <p className="font-light mt-6 text-[#212121]">Contáctanos</p>
              </Link>
            </div>
            <div>
              <h3 className="font-bold text-xl">Políticas</h3>
              <Link href="/politicas-privacidad">
                <p className="font-light mt-6 text-[#212121]">Política de privacidad</p>
              </Link>
              <p className="font-light mt-6 text-[#212121]">Política de cookies</p>
              <Link href="/terminos-y-condiciones">
                <p className="font-light mt-6 text-[#212121]">Términos y condiciones de uso</p>
              </Link>
            </div>
            <div>
              <h3 className="font-bold text-xl">Contáctanos</h3>
              <p className="font-light mt-6 text-[#212121]">Escríbenos a nuestra casilla de correo:</p>
              <strong className="text-xl flex items-center text-[#007FA4] mt-6 font-normal">
                <Image className="mr-2" src={mail} alt="mail" /> Contacto@injoyplan.com
              </strong>
            </div>
          </div>
        </div>

        {/* Mobile View */}

        <div className="block md:hidden mx-auto max-w-screen-md pt-8 pb-8">
          <div className='block md:hidden px-8'>
            <h3 className="font-bold text-lg">Contáctanos</h3>
            <p className="text-sm text-[#212121] mt-6">Escríbenos a nuestra casilla de correo:</p>
            <div className="flex items-center text-[#007FA4] mt-6 mb-10">
              <Image src={mail} alt="mail" width={24} height={24} className="mr-2" />
              <strong>Contacto@injoyplan.com</strong>
            </div>
          </div>
          {[
            { title: 'Conócenos', links: [{ label: 'Acerca de nosotros', href: '/nosotros' }] },
            {
              title: '¿Necesitas ayuda?',
              links: [
                { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes' },
                { label: 'Contáctanos', href: '/contactanos' },
              ],
            },
            {
              title: 'Políticas',
              links: [
                { label: 'Política de privacidad', href: '/politicas-privacidad' },
                { label: 'Política de cookies', href: '#' },
                { label: 'Términos y condiciones de uso', href: '/terminos-y-condiciones' },
              ],
            },
          ].map((section, index) => (
            <div key={index} className="mb-4 border-t border-solid border-[#EDEFF5] pt-4 px-8">
              <h3
                className="font-bold text-lg flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection(index)}
              >
                {section.title}
                <span className="text-xl">{openSection === index ? <Image src={arrow} height={13} width={13} alt='Arrow' /> : <Image src={arrow} height={13} width={13} alt='Arrow' />}</span>
              </h3>
              {openSection === index && (
                <div className="mt-4 space-y-2">
                  {section.links.map((link, idx) => (
                    <Link href={link.href} key={idx} className="text-[#212121] text-sm font-light block">
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Contact Section */}
        </div>

        <div className='bg-[#303033] hidden md:block'>
          <div className='mx-auto 2xl:max-w-screen-2xl xl:max-w-screen-xl max-w-[980px] pt-8 pb-8 xl:px-10 flex justify-between items-center'>
            <div>
              <p className='text-[#fff]'>Copyright © 2026 Injoyplan</p>
            </div>
            <div className='flex items-center'>
              <div className='flex justify-between border-r border-solid border-[rgba(255,255,255,0.1)]'>
                <a href="https://www.facebook.com/Injoyplan" target="_blank" rel="noopener noreferrer">
                  <Image className='p-2 mr-6 border border-solid rounded-full hover:bg-gray-700' width={34} height={34} objectFit='cover' src={facebook} alt="facebook" />
                </a>
                {/* <div>
                  <Image className='p-2 mr-6 border border-solid rounded-full' width={34} height={34} objectFit='cover' src={twi} alt="twi" />
                </div> */}
                <a href="https://www.youtube.com/@injoyplan" target="_blank" rel="noopener noreferrer">
                  <Image className='p-2 mr-6 border border-solid rounded-full hover:bg-gray-700' width={34} height={34} objectFit='cover' src={youtube} alt="youtube" />
                </a>
                <a href="https://www.instagram.com/injoyplan" target="_blank" rel="noopener noreferrer">
                  <Image className='p-2 mr-6 border border-solid rounded-full hover:bg-gray-700' width={34} height={34} objectFit='cover' src={instagram} alt="instagram" />
                </a>
                <a href="https://www.tiktok.com/@injoyplan" target="_blank" rel="noopener noreferrer">
                  <Image className='p-2 mr-6 border border-solid rounded-full hover:bg-gray-700' width={34} height={34} objectFit='cover' src={tiktok} alt="tiktok" />
                </a>
              </div>
              <div className='ml-6 flex justify-center text-center'>
                <div className='text-center mx-auto w-full'>
                  <Link href="/libro-de-reclamaciones" >
                    <Image width={110} height={100} className='text-center mx-auto' src="https://cdn.shopify.com/s/files/1/0276/9184/3699/files/Libro_reclamaciones_480x480.png?v=1727902723" alt="Libro de Reclamaciones" style={{ objectFit: 'contain' }} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="bg-[#303033] block md:hidden">
          <div className="mx-auto 2xl:max-w-screen-2xl xl:max-w-screen-xl max-w-screen-md pt-8 pb-8 flex flex-col sm:flex-row justify-between items-center xl:px-10">
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <a href="https://www.facebook.com/Injoyplan" target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hover:bg-gray-700">
                <Image src={facebook} alt="facebook" width={16} height={16} />
              </a>
              <a href="https://www.instagram.com/injoyplan" target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hover:bg-gray-700">
                <Image src={instagram} alt="instagram" width={16} height={16} />
              </a>
              <a href="https://www.youtube.com/@injoyplan" target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hover:bg-gray-700">
                <Image src={youtube} alt="youtube" width={16} height={16} />
              </a>
              <a href="https://www.tiktok.com/@injoyplan" target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hover:bg-gray-700">
                <Image src={tiktok} alt="tiktok" width={16} height={16} />
              </a>
            </div>

            {/* Libro de Reclamaciones */}
            <div className="text-center mt-12 sm:mt-0 w-full mx-auto mb-12">
              <Link href="/libro-de-reclamaciones" >
                <Image className='mx-auto' src="https://cdn.shopify.com/s/files/1/0276/9184/3699/files/Libro_reclamaciones_480x480.png?v=1727902723" alt="Libro de Reclamaciones" width={150} height={100} style={{ objectFit: 'contain' }} />
              </Link>
            </div>
            <hr className='border-1 border-solid border-[#737373] w-full' />
            {/* Copyright */}
            <div className="text-white text-sm mt-6 sm:mt-0">
              Copyright © 2026 Injoyplan
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Footer;
