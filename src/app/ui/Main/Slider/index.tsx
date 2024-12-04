import Slider from "react-slick";
import styles from '../main.module.css'
import { useEffect } from "react";
import { IBannersState, useBannersStore } from "../../../zustand/banners";
import moment from "moment";
import BannerSkeleton from "../../../components/Skeletons/banner";
import banner from '../../../../../public/svg/banner.svg'
import Image from "next/image";
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
        <Slider {...settings}>
            {
                banners?.length === 0 ? (
                    banners.map((item: any) => (
                        <>
                            <div className={styles.content__slideImg}>
                                <Image src={banner} alt="banner" className="w-full" width={500} height={500} />
                                <div className={styles.content__info}>
                                    <div>
                                        <h4>{item.titulo}</h4>
                                        <div className={styles.date__format}>
                                            <div>
                                                {moment(item.FechaInicio).format('ddd').toUpperCase()}
                                                <div>
                                                    {moment(item.FechaInicio).format('DD MMM').toUpperCase()}
                                                </div>
                                            </div>
                                            <div style={{ marginLeft: "10px" }}>
                                                {item.HoraInicio}-{item.HoraFinal}
                                            </div>
                                        </div>
                                        <a rel="noopener noreferrer" target="_blank" href={`https://${item.urlFuente}`}>Conoce más</a>
                                    </div>
                                </div>

                            </div>
                            <div className={styles.fuent}>
                                <h4>VER FUENTE </h4>
                                {/* <img className={styles.blueGray} src={flechaceleste} alt="flecha-celeste" /> */}
                            </div>
                        </>
                    )
                    )
                ) : <BannerSkeleton />
            }
        </Slider>
    )
}

export default Slide;