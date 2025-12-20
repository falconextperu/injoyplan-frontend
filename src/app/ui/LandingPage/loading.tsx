import styles from './landing.module.css'
import logo from '../../../assets/svg/logo.svg'
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const Loading = () => {

    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Simula un tiempo de carga de 2 segundos antes de iniciar la transición de desaparición
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 1500); // Ajusta el tiempo según tus necesidades

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    {...({
                        className: "loading-container",
                    } as any)}
                    initial={{ opacity: 1 }}       // Estado inicial: completamente visible
                    animate={{ opacity: 1 }}       // Mantener visible durante la carga
                    exit={{ opacity: 0 }}          // Animación de salida: desvanecerse
                    transition={{ duration: 0.5 }} // Duración de la animación de salida
                >
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <div className={styles.loading__bar}></div>  {/* Barra de carga */}
                        <div className={styles.loading__wrapper}>
                            <img src={logo} alt="" />
                            <h3>Cargando ...</h3>
                            <p>Esperando resultados de los eventos.</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Loading;
