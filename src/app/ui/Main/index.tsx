"use client";
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
           <div className="2xl:max-w-screen-2xl xl:max-w-screen-xl max-w-screen-md px-0 mx-auto grid grid-cols-12 gap-10 xl:px-10">
                <div className="xl:col-start-1 xl:col-end-9 md:col-start-1 md:col-end-13 xl:mt-12 md:mt-6 col-start-1 col-end-13">
                    <div className='slider-banner'>
                        <Slide />
                    </div>
                </div>
                <div className="xl:col-start-9 scrollbar-thumb-gray-700 scrollbar-track-gray-200 scrollbar  xl:col-end-13 md:col-start-1 md:col-end-13 xl:mt-12 md:mt-0 w-full col-start-1 col-end-13 md:overflow-hidden overflow-x-scroll md:px-0 px-10">
                    <div className='grid xl:grid-cols-2 gap-x-11 gap-y-3 md:grid-cols-4 grid-cols-4 gap-3 md:w-auto w-[900px]'>
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
                        <div className='flex justify-end w-full xl:col-start-1 xl:col-end-3 md:col-start-1 md:col-end:5 col-start-1 col-end-2 mt-3'>
                            <Link href="/busqueda/0" className='flex items-center'> 
                            <h4 className='md:text-[14px] text-[#007FA4] font-bold relative -top-7 text-[12px]'>TODAS LAS CATEGORÍAS + 10 </h4> 
                            <Image className='ml-2 -top-7 relative' src={flechazul} alt="flecha-azul" /></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main