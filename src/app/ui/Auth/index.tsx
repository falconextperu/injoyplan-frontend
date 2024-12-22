import { Icon } from '@iconify/react/dist/iconify.js';
import ReactModal from 'react-modal';
import styles from './auth.module.css';
import logo from '../../../../public/svg/logo.svg';
import { Dispatch, useEffect, useState } from 'react';
import { m, motion } from 'framer-motion';
import { IAuthState, useAuthStore } from '../../zustand/auth';
import useAlertStore from '../../zustand/alert';
import Image from 'next/image';
import useIsMobile from '@/app/hooks/useIsMobile';

interface IProps {
    openAuth: boolean;
    setOpenAuth: Dispatch<boolean>;
}

const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
};

const Auth = ({ openAuth, setOpenAuth }: IProps) => {


    const [isRegister, setIsRegister] = useState<boolean>(false);
    const { signIn, login }: IAuthState = useAuthStore();

    const isMobile = useIsMobile();

    // Estados para controlar los valores del formulario
    const [nombre, setNombre] = useState<string>("");
    const [apellido, setApellido] = useState<string>("");
    const [genero, setGenero] = useState<string>("Seleccionar");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const customStyles = {
        content: {
            top: isMobile ? '50%' : '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            borderRadius: "10px",
            boxShadow: "0 0 50px #523f6926",
            border: "none",
            width: isMobile ? "100%" : "550px",
            padding: isMobile ? "0px" : "0px",
            maxHeight: isMobile ? "100vh" : "880px",
            height: isMobile ? "100vh" : "",
            background: isMobile ? "#FFF" : "transparent",
            transform: 'translate(-50%, -50%)',
            zIndex: 1000
        },
        overlay: {
            zIndex: 999, // Ensure the overlay is above the blurred content
        }
    };


    // Función para manejar el envío del formulario
    const handleSubmit = async () => {
        const body = {
            nombre,
            apellido,
            genero,
            f_nacimiento: "",
            imagenPerfil: "",
            password,
            email,
            terminoCondiciones: 1,
            politica: 1
        };

        if (isRegister) {
            if (nombre === "" || apellido === "" || genero === "" || email === "" || password === "") {
                return useAlertStore.getState().alert("Complete los datos obligatorios para crear su cuenta", "error")
            }
            signIn(body)
            setIsRegister(false)
        } else {
            if (email === "" || password === "") {
                return useAlertStore.getState().alert("Complete datos obligatorios para iniciar sesion", "error")
            }
            let data = {
                email,
                password
            }
            login(data)
            onCloseModal();
        }
    };

    const onCloseModal = () => {
        document.body.classList.remove('ReactModal__Body--open');
        setOpenAuth(false)
    }

    return (
        <ReactModal ariaHideApp={false} isOpen={openAuth} style={customStyles}>
            <motion.div
                initial="hidden"
                animate="visible"
                style={{ background: "#fff" }}
                exit="exit"
                variants={variants}
                transition={{ duration: 0.3 }}
            >
                <div className={styles.closeModal} onClick={onCloseModal}>
                    <Icon icon="line-md:close" fontSize={25} />
                </div>
                <div className="px-10 pt-10 pb-5">
                    <div className="py-0">
                        <div className='text-center'>
                            <Image src={logo} className='mx-auto' width={60} height={60} alt="Logo" />
                            <h2 className='font-bold font-sans text-2xl mt-2 text-[#212121] mb-0'>¡Bienvenido a Injoyplan!</h2>
                            <p className='mt-1 mb-10 font-sans font-thin'>Empieza a explorar los eventos más importantes para ti</p>
                        </div>
                        <div>
                            {
                                isRegister && (
                                    <div className="grid grid-cols-2 gap-4 mt-8">
                                        <div>
                                            <label className='font-normal font-sans' htmlFor="nombre">Nombres</label>
                                            <input className='bg-[#F7F7F7] outline-none border border-solid border-[#ddd] w-full p-2 rounded-md' type="text" name='nombre' value={nombre} onChange={(e) => setNombre(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className='font-normal font-sans' htmlFor="apellido">Apellidos</label>
                                            <input className='bg-[#F7F7F7] outline-none border border-solid border-[#ddd] w-full p-2 rounded-md' type="text" name='apellido' value={apellido} onChange={(e) => setApellido(e.target.value)} />
                                        </div>
                                    </div>
                                )
                            }
                            <div>
                                <label className='font-normal block mt-3 font-sans' htmlFor="email">Email</label>
                                <input className='bg-[#F7F7F7] outline-none border border-solid border-[#ddd] w-full p-2 rounded-md' type="text" name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className={isRegister ? "grid grid-cols-2 gap-4 " : ""}>
                                <div>
                                    <label className='font-normal block mt-3 font-sans' htmlFor="password">Contraseña</label>
                                    <input className='bg-[#F7F7F7] outline-none border border-solid border-[#ddd] w-full p-2 rounded-md' type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                {
                                    isRegister && (
                                        <div>
                                            <label className='font-normal block mt-3 font-sans' htmlFor="genero">Sexo</label>
                                            <select className='bg-[#F7F7F7] border border-solid border-[#ddd] w-full p-2 rounded-md py-[9px]' value={genero} onChange={(e) => setGenero(e.target.value)}>
                                                <option value="Seleccionar">Seleccionar</option>
                                                <option value="No especificar">No Especificar</option>
                                                <option value="Masculino">Masculino</option>
                                                <option value="Femenino">Femenino</option>
                                            </select>
                                        </div>
                                    )
                                }
                            </div>
                            {
                                isRegister && (
                                    <>
                                        <div className='flex items-start mt-4'>
                                            <input type="checkbox" className='relative top-1 mr-1' />
                                            <p className='text-sm mt-0'>Al hacer click en <strong>Registrarte</strong>, aceptas los términos y condiciones, nuestra política de privacidad y política de cookies.</p>
                                        </div>
                                        <div className='flex items-start mt-3'>
                                            <input type="checkbox" className='relative top-1 mr-1' />
                                            <p className='text-sm mt-0'>Autorizo el uso de mis datos personales para recibir información, ofertas, promociones, o contenido publicitario o comercial relacionado con esta web, Injoyplan y sus vinculados.</p>
                                        </div>
                                    </>
                                )
                            }
                            <div>
                                <button className='bg-[#007FA4] p-3 text-[#Fff] font-sans font-bold rounded w-full mt-4' onClick={handleSubmit}>{isRegister ? "Registrarte" : "Iniciar Sesión"}</button>
                            </div>
                            <hr />
                            <div className='mb-4 mt-4 text-center'>
                                {
                                    isRegister ? (
                                        <p>¿ Ya tienes una cuenta ? <span className='block text-[#007FA4] font-bold' onClick={() => setIsRegister(false)}>inicia sesión</span></p>
                                    ) :
                                        <p>¿ Aún no te has creado una cuenta ? <span className='block text-[#007FA4] font-bold' onClick={() => setIsRegister(true)}>regístrate</span></p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </ReactModal>
    );
}

export default Auth;