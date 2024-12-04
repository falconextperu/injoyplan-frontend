"use client";
import styles from './main.module.css'
import flecha from '../../../../public/svg/right.svg'
import flechazul from '../../../../public/svg/blueright.svg'
import Slide from './Slider'
import { ICategoriesState, useCategoriesState } from '../../zustand/categories'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image';

const Main = () => {

    const { countsCategories }: ICategoriesState = useCategoriesState();

    console.log(countsCategories)

    const navigate = useRouter();

    const navigateByCategory = (item: any) => {
        console.log(item)
        navigate.push(`/busqueda/${item?.idCategorias}`)
    }  

    return (
        <div className="">
           <div className="max-w-screen-2xl md:max-w-screen-xl px-0 mx-auto grid grid-cols-12 gap-10">
                <div className="col-start-1 col-span-8 mt-12">
                    <div>
                        <Slide />
                    </div>
                </div>
                <div className="col-start-9 col-span-5 w-full mt-12">
                    <div className='grid grid-cols-2 gap-x-11 gap-y-3'>
                        {
                            countsCategories?.map((item: any, index: number) => (
                                <div className='relative cursor-pointer z-0' key={index} onClick={() => navigateByCategory(item)}>
                                    <div className='flex justify-center bg-[#861f21] p-5 py-6 rounded w-10/12 mx-auto relative z-50'>
                                        <Image width={50} height={50} className='z-0' src={item.iconos} alt="logomusica" />
                                    </div>
                                    <div className='bg-[#F6F6F6] pt-7 p-4 relative -top-5 z-0 rounded'>
                                        <h3 className='text-[18px] text-[#444] font-bold'>{item?.nombreCategoria}</h3>
                                        <span className='flex items-center text-sm font-[300] text-[#861F21]'>{item?.cantidad} eventos <Image className='ml-2' src={flecha} alt={item?.nombreCategoria}/></span>
                                    </div>
                                </div>
                            ))
                        }
                        <div className='flex grid-cols-3 justify-end w-full col-start-1 col-span-2'>
                            <Link href="/busqueda/0" className='flex items-center'> 
                            <h4 className='text-[14px] text-[#007FA4] font-bold relative -top-4'>TODAS LAS CATEGORÍAS + 10 </h4> 
                            <Image className='ml-2 -top-4 relative' src={flechazul} alt="flecha-azul" /></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main