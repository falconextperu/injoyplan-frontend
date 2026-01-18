import Slider from "react-slick";
import styles from './slide.module.css'
import Card from "@/app/components/Card";
import { Event } from "@/app/interfaces/event";
import { useState, useCallback } from "react";

const Slide = ({ categoriesRelations }: any) => {

    const [dragging, setDragging] = useState(false);

    const handleBeforeChange = useCallback(() => {
        setDragging(true);
    }, []);

    const handleAfterChange = useCallback(() => {
        setDragging(false);
    }, []);

    console.log(categoriesRelations)

    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        centerMode: false,
        centerPadding: "0px",
        slidesToScroll: 4,
        autoplay: true,
        beforeChange: handleBeforeChange,
        afterChange: handleAfterChange,
        responsive: [
            {
                breakpoint: 1024,  // Tablets and small laptops
                settings: {
                    slidesToShow: 3,  // Show 3 items
                    slidesToScroll: 3, // Scroll 3 items
                    infinite: true,
                    dots: false,
                }
            },
            {
                breakpoint: 768,   // Mobile landscape and small tablets
                settings: {
                    slidesToShow: 2,  // Show 2 items
                    slidesToScroll: 2, // Scroll 2 items
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

    console.log(categoriesRelations)

    return (
        <div>
            <Slider {...settings} className={styles.slick__categories}>
                {
                    categoriesRelations?.map((item: Event, index: number) => {
                        return (
                            <Card isDragging={dragging} addFavoritesByUser={() => { }} key={index} item={item} heartDisabled />
                        )
                    })
                }
            </Slider>
        </div>
    )
}

export default Slide;