import { create } from 'zustand';
import { get, post } from '../utils/fetch';
import { IEmail, IResponse } from '../interfaces/auth';
import { IUser } from '../interfaces/auth';
import useAlertStore from './alert';

export interface IAuthState {
    signIn: (data: any) => void;
    auth: IUser | null;
    me: () => void;
    login: (data: any) => void;
    sendEmail: (email: IEmail) => void
    success: boolean
}

export const useAuthStore = create<IAuthState>((set, _get) => ({
    success: false,
    auth: null,
    login:  async (data: any) => {
        try {
            const resp: IResponse = await post(`usuario/login`, data);
            console.log(resp)
            if (resp.HEADER.CODE === 500) {
                return useAlertStore.getState().alert("La contraseña o el usuario son incorrectos, intentelo de nuevo porfavor", "error")
            }
            if (resp.HEADER.CODE === 200) {
                localStorage.setItem("token", resp.RESPONSE.token);
                set({ auth: resp.RESPONSE.user, success: true });
            } else {
                set({ auth: null })
            }
           
        } catch (error) {
            return useAlertStore.getState().alert("El usuario o contraseña son incorrectas", "error")
            // console.error('Error during login:', error);
        }
    },
    signIn: async (data: any) => {
        try {
            const resp: IResponse = await post(`usuario/create`, data);
            console.log(resp)
            if (resp.HEADER.CODE === 200) {
                localStorage.setItem("token", resp.RESPONSE.token);
                useAlertStore.getState().alert("Usuario creado correctamente", "success");
                set({ auth: resp.RESPONSE.user, success: true });
            } 
            if(resp.HEADER.CODE === 500) {
                useAlertStore.getState().alert(resp.HEADER.MESSAGE, "error");
                // set({ auth: resp.RESPONSE.user });
            }
        } catch (error) {
            console.log(error)
            console.error('Error during login:', error);
        }
    },
    me: async () => {
        try {
            const resp: IResponse = await get(`usuario/auth/@me`);
            if (resp.HEADER.CODE === 200) {
                console.log(resp)
                set({ auth: resp.RESPONSE.user });
            } else {
                set({ auth: null })
            }
        } catch (error) {
            // console.error('Error during login:', error);
        }
    },
    sendEmail: async (email: IEmail ) => {
        try {
            const resp: any = await post(`eventos/guardar_correo_para_enviar_mejores_eventos`, email);
            console.log(resp)
            if (resp.message !== "") {
                useAlertStore.getState().alert(resp.message, "success");
                // set({ auth: resp.RESPONSE.user });
            } else {
                // set({ auth: null })
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    },
}));


