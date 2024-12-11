import { create } from 'zustand';
import { del, get, post } from '../utils/fetch';
import { Favorite, IResponse } from '../interfaces/favorite';
import { useEventStore } from './events';

export interface IFavoriteState {
    favorites: Favorite[];
    addFavorite: (data: any) => any
    deleteFavorite: (id: any) => any
    getFavorites: () => any
}

export const useFavoriteStore = create<IFavoriteState>((set, _get) => ({
    favorites: [],
    addFavorite: async (data: any) => {
        try {
            const resp: IResponse = await post(`usuario/createFavoritos`, data);
            console.log(resp)
            if (resp.HEADER.CODE === 200) {
                useEventStore.getState().setEventsAsFavorite(data.idEvento, resp.RESPONSE);
                useEventStore.getState().setEventDataFavorite(data.idEvento,resp.RESPONSE)
            } 
        } catch (error: any) {
            console?.error('Error during login:', error);
        }
    },
    deleteFavorite: async (event: any) => {
        console.log(event)
        try {
            // console.log(id);
            const resp: IResponse = await del(`usuario/eliminar_favoritos/${event.favorito}`);
            console.log(resp)
            if (resp.HEADER.CODE === 200) {
                useEventStore.getState().setEventsDeleteFavorite(event.favorito);
                useEventStore.getState().setEventDataDeleteDFavorite(event.favorito);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    },
    getFavorites: async () => {
        try {
            const resp: IResponse = await get(`usuario/consultarfavoritos`);
            console.log(resp)
            if (resp.HEADER.CODE === 200) {
                console.log(resp)
                set({ favorites: resp.RESPONSE })
            } else {

            }
        } catch (error) {
            // console.error('Error during login:', error);
        }
    },
}));


