
import { AnimatePresence, motion } from 'framer-motion'
import Svg from "../Svg";
import { Icons } from "../Svg/iconsPack";
import styles from './toast.module.css'
import { useEffect } from 'react';
import useAlertStore from '../../zustand/alert';

interface IAlertProps {
   title?: string
   message: string | string[]
   type: string
}

const Toast = ({
   title,
   message,
}: IAlertProps) => {

   const { type, resetAlert } = useAlertStore()

   const handleClose = () => {
      resetAlert();
   }

   useEffect(() => {
      if (type) {
         setTimeout(() => {
            resetAlert();
         }, 5000)
      }
   }, [type])

   return (
      <AnimatePresence
      >
         <motion.div
            initial={{ opacity: 0, y: -30, x: 0 }}
            animate={{ opacity: 1, y: 0 }}
            {...({
               className: `${styles.wrapper__toast} ${styles[type]}`
            } as any)}>
            <div className={styles.content__toast}>
               {type === "success" && <Svg icon={Icons.msgSuccess} />}
               {type === "error" && <Svg icon={Icons.msgError} />}
               {type === "notification" && <Svg icon={Icons.notification} />}

               <div>
                  <div className={styles.header__toast}>
                     <h6>{title}</h6>
                     <Svg onClick={handleClose} icon={Icons.close} />
                  </div>
                  <div className={styles.message}>
                     {
                        typeof (message) === 'string' ? message :
                           <ul>
                              {
                                 message.map((text, index) => (
                                    <li key={index}><p>{text}</p></li>
                                 ))
                              }
                           </ul>
                     }
                  </div>
               </div>
            </div>
         </motion.div>
      </AnimatePresence>
   )
}

export default Toast;