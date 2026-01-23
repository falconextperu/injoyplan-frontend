import Slider from "react-slick";
import { useEffect } from "react";
import { IBannersState, useBannersStore } from "../../../zustand/banners";
import moment from "moment";
import Image from "next/image";
import Angle from '../../../../../public/svg/angle_right.svg';
import Link from "next/link";
import BannerSkeleton from "@/app/components/Skeletons/banner";
moment.locale('es');

const Slide = () => {
    const { getBanners, banners, isLoading }: IBannersState = useBannersStore();

    const settings = {
        dots: true,
        infinite: true,
        fade: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                }
            }
        ]
    };

    useEffect(() => {
        getBanners();
    }, []);

    console.log(banners)

    if (isLoading) return <BannerSkeleton />

    return (
        <Slider className="slide" {...settings}>
            {banners?.length > 0 ? (
                banners.map((item: any, index: number) => {
                    // Parse date as UTC to avoid timezone conversion issues
                    // This ensures "2026-05-24" displays as "24 MAY" instead of "23 MAY"
                    const date = item.fecha ? moment.utc(item.fecha) : null;
                    const dayName = date ? date.format('ddd').toUpperCase().replace('.', '') : '';
                    const dayNumber = date ? date.format('D') : '';
                    const monthName = date ? date.format('MMM').toUpperCase().replace('.', '') : '';

                    return (
                        <div key={index} className="h-full">
                            <div className="h-full relative">
                                <Image src={item.imageUrl} alt="banner" width={2000} height={1000} className="w-full h-full object-fill" />
                                <div className="absolute md:top-36 top-24 left-5 md:left-10">
                                    <div>
                                        <h4 className="bg-customText text-[#fff] rounded rounded-bl-none rounded-tl-none text-2xl md:text-3xl p-2 w-fit font-bold">{item.title}</h4>

                                        {(item.fecha || item.horaInicio || item.categoria) && (
                                            <div className="flex items-center w-fit bg-customText text-[#fff] rounded rounded-bl-none rounded-tl-none text-md p-2 mt-1">
                                                {date && (
                                                    <p className="ml-2 leading-tight">
                                                        {dayName} <strong className="font-normal block text-xl">{dayNumber} {monthName}</strong>
                                                    </p>
                                                )}
                                                {(item.horaInicio || item.categoria) && (
                                                    <div className={`border-l border-solid border-[#fff] ml-4 pl-3 flex flex-col justify-center ${!date ? 'border-none ml-0 pl-2' : ''}`}>
                                                        {item.horaInicio && (
                                                            <p className="">{item.horaInicio} {item.horaFin ? `- ${item.horaFin}` : ''}</p>
                                                        )}
                                                        {item.direccion && (
                                                            <p className="font-bold opacity-90">{item.direccion}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <a className="bg-customText transition-colors p-3 px-6 text-md relative top-4 rounded uppercase text-[#fff] font-bold inline-block" href={item.link || item.urlFuente || "#"}>
                                            Conoce más
                                        </a>
                                    </div>
                                </div>
                            </div>
                            {item.urlFuente && (
                                <Link className="absolute md:bottom-2 bottom-1 z-50 flex justify-center text-[11px] md:text-left xl:text-left md:justify-start mt-2 text-[#A3ABCC] font-bold w-full text-center transition-colors" href={item.urlFuente} target="_blank" rel="noopener noreferrer">
                                    VER FUENTE
                                    <Image className="ml-1 relative top-0.5" src={Angle} height={10} width={10} alt="Angulo" />
                                </Link>
                            )}
                        </div>
                    );
                })
            ) : (
                <BannerSkeleton />
            )}
        </Slider>
    );
};

export default Slide;