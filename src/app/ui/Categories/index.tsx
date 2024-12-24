
import ReactModal from 'react-modal';
import { Dispatch, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './categories.module.css'
import { ICategoriesState, useCategoriesState } from '../../zustand/categories';
import { Category } from '../../interfaces/category';
import { ReactSVG } from 'react-svg';
import useIsMobile from '@/app/hooks/useIsMobile';

interface IProps {
    openCategories: boolean
    setOpenCategories: Dispatch<boolean>
}

const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
};


const Categories = ({ setOpenCategories, openCategories }: IProps) => {

    const isMobile = useIsMobile();

    console.log(openCategories)

    const customStyles = {
        content: {
            top: isMobile ? '50%' : '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            borderRadius: isMobile ? "0px" : "10px",
            boxShadow: "0 0 50px #523f6926",
            border: "none",
            width: isMobile ? "auto" : "720px",
            padding: isMobile ? "0px" : "0px",
            maxHeight: isMobile ? "100vh" : "880px",
            height: isMobile ? "100vh" : "",
            background: isMobile ? "#FFF" : "transparent",
            transform: 'translate(-50%, -50%)',
            zIndex: 1000
        }
    };

    const { categories, getCategories }: ICategoriesState = useCategoriesState();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    useEffect(() => {
        getCategories();
    }, [])

    const handleContinue = () => {
        document.body.classList.remove('ReactModal__Body--open');
        setOpenCategories(false)
    }

    useEffect(() => {
        // Cargar categorías seleccionadas desde localStorage al montar el componente
        const storedCategories = localStorage.getItem("selectedCategories");
        if (storedCategories) {
            setSelectedCategories(JSON.parse(storedCategories));
        }
    }, []);

    const handleSelectCategory = (categoryId: string) => {
        let updatedCategories;

        if (selectedCategories?.includes(categoryId)) {
            // Deseleccionar categoría
            updatedCategories = selectedCategories?.filter(id => id !== categoryId);
        } else {
            // Seleccionar categoría
            updatedCategories = [...selectedCategories, categoryId];
        }

        setSelectedCategories(updatedCategories);
        localStorage.setItem("selectedCategories", JSON.stringify(updatedCategories));
    };

    return (
        <ReactModal isOpen={openCategories} style={customStyles} ariaHideApp={false}>
            {
                categories.length > 0 && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        style={{ background: "#fff" }}
                        exit="exit"
                        variants={variants}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={styles.categories}>
                            <div className='p-8 text-center'>
                                <div>
                                    <h2 className='text-[#861F21] font-bold text-4xl mt-8'>¡Bienvenido a Injoyplan!</h2>
                                    <p className='text-[#444] text-[14px] mt-10'>Tus gustos sobre todo, elígelos y te recomendaremos los mejores eventos para tí.</p>
                                </div>
                                <div className="grid md:grid-cols-4 md:gap-8 md:mt-8 mt-10 grid-cols-2 gap-5">
                                    {
                                        categories?.map((item: Category) => (
                                            <div
                                                key={item.idCategorias}
                                                id={item.nombreCategoria}
                                                className={selectedCategories?.includes(item?.idCategorias?.toString()) ? "bg-[#861F21] cursor-pointer text-center px-3 py-3 rounded" : " rounded cursor-pointer text-center bg-[#f6f6f6] px-3 py-3"}
                                                onClick={() => handleSelectCategory(item.idCategorias.toString())}
                                            >
                                                <div className={selectedCategories?.includes(item.idCategorias.toString()) ? "" : styles.selected}>
                                                    <div className='w-[60px] h-[60px] flex mx-auto mt-2 mb-2'>
                                                        <ReactSVG
                                                            src={item.iconos}
                                                            beforeInjection={(svg: any) => {
                                                                svg.setAttribute('style', 'width: 60px; height: 60px;');
                                                                svg.querySelector('path').setAttribute('fill', 'red'); // Cambia el color
                                                            }}
                                                        />
                                                        {/* <Image src={item?.iconos} className='w-full' width={100} height={100} alt={item.nombreCategoria} /> */}
                                                    </div>
                                                </div>
                                                <p className={selectedCategories?.includes(item.idCategorias.toString()) ? 'font-semibold text-[#fff] mb-3' : 'font-semibold text-[#444] mb-3'}>{item.nombreCategoria}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="mt-10">
                                    <button className='cursor-pointer bg-[#007FA4] text-[#fff] px-14 mb-6 py-2 rounded-full uppercase' onClick={handleContinue}>Continuar</button>
                                    <p className='text-[#007fa4] cursor-pointer font-medium underline' onClick={handleContinue}>No, no tengo un gusto en especifico</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )
            }
        </ReactModal>
    )
}

export default Categories;