import Slider from "react-slick";
import styles from '../main.module.css'
import { useEffect } from "react";
import { IBannersState, useBannersStore } from "../../../zustand/banners";
import moment from "moment";
// import BannerSkeleton from "../../../components/Skeletons/banner";
import banner from '../../../../../public/svg/banner.svg'
import Image from "next/image";
import Angle from '../../../../../public/svg/angle_right.svg'
import Link from "next/link";
moment.locale('es');

const Slide = () => {

    const { getBanners, banners }: IBannersState = useBannersStore();

    var settings = {
        dots: true,
        infinite: true,
        fade: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        responsive: [
            {
                breakpoint: 1024,  // Tablets and small laptops
                settings: {
                    slidesToShow: 1,  // Show 3 items
                    slidesToScroll: 1, // Scroll 3 items
                    infinite: true,
                    dots: false,
                }
            },
            {
                breakpoint: 768,   // Mobile landscape and small tablets
                settings: {
                    slidesToShow: 1,  // Show 2 items
                    slidesToScroll: 1, // Scroll 2 items
                    infinite: true,
                    dots: false,
                }
            },
            {
                breakpoint: 480,   // Mobile portrait
                settings: {
                    slidesToShow: 1,  // Show 1 item
                    slidesToScroll: 1, // Scroll 1 item
                    infinite: true,
                    dots: false,
                }
            }
        ]
    };

    useEffect(() => {
        getBanners();
    }, [])

    console.log(banners)

    return (
        <Slider className="slide" {...settings}>
            {/* { */}
            {/* // banners?.length === 0 ? ( */}
            {/* // banners.map((item: any) => ( */}

            <div className="h-full">
                <div className="h-full">
                    <Image src={banner} alt="banner" className="w-full h-full object-cover" />
                    <div className="absolute md:top-40 top-24 left-6">
                        <div>
                            <h4 className="bg-customText text-[#fff] rounded text-2xl md:text-3xl p-2 w-fit">Estamos JOBdidos Vol. 2</h4>
                            <div>
                                <div className="flex items-center w-fit bg-customText text-[#fff] rounded text-md p-2 ">
                                    <p className="ml-2">VIE <strong className="font-normal block">15 ENE</strong></p>
                                    {/* {moment(item.FechaInicio).format('ddd').toUpperCase()} */}
                                    <div className="border-l border-solid border-[#fff] ml-4">
                                       <p className="ml-3"> 20:00 - 21:00 Joinnus Live</p>
                                        {/* {moment(item.FechaInicio).format('DD MMM').toUpperCase()} */}
                                    </div>
                                </div>
                                <div>
                                    {/* {item.HoraInicio}-{item.HoraFinal} */}
                                </div>
                            </div>
                            <a className=" bg-customText p-3 text-md relative top-2 rounded uppercase text-[#fff]" rel="noopener noreferrer" target="_blank" 
                            // href={`https://${item.urlFuente}`}
                            >Conoce más</a>
                        </div>
                    </div>
                </div>
                <Link className='absolute md:bottom-[-0px] bottom-[-5px] z-50 flex justify-center text-[11px] md:text-left xl:text-left md:justify-start mt-2 text-[#A3ABCC] font-bold w-full text-center' href={`#`} target="_blank" rel="noopener noreferrer">
                    VER FUENTE
                    <Image className='ml-1 relative top-0.5' src={Angle} height={10} width={10} alt='Angulo' />
                </Link>
            </div>
            {/* )
                ) : <BannerSkeleton />
            } */}
        </Slider>
    )
}

export default Slide;