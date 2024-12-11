import {create} from 'zustand';
import { get } from '../utils/fetch';
import { Event, IResponse } from '../interfaces/event';

export interface IEventsState {
    getEvents: (limit: number) => void;
    resetEventBySearch: () => void
    events: Event[];
    eventSearch: any
    eventSearchByFilters: any
    dataEvent: null,
    getEventBySearch: (data: string) => any
    setEventsAsFavorite: (idEvento: any, resp: any) => any
    setEventDataFavorite: (idEvento: any, resp: any) => any
    setEventsDeleteFavorite: (idFavorito: any) => any
    setEventDataDeleteDFavorite: (idFavorito: any) => any
    getEventByEventAndDate: (event: number, date: number) => any
    getEventSearchByFilters: (params: any) => any
}

export const useEventStore = create<IEventsState>((set, _get) => ({
    eventSearchByFilters: [],
    dataEvent: null,
    eventSearch: null,
    resetEventBySearch: () => {
        set({
            eventSearch: []
        })
    },
    events: [],
    getEvents: async (limit: number) => {
        try {
            const resp: IResponse = await get(`eventos/listarEventosxPaginate/${limit}/0`);
            console.log(resp)
            if (resp.HEADER.CODE === 200) {
                set({ events: resp.RESPONSE });
            } else {
                set({ events: [] })
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    },
    setEventsAsFavorite: (idEvento, resp) => {
        set((state : any) => ({
            events: state?.events?.map((event : any) =>
                event.ideventos === idEvento
                    ? { ...event, esfavorito: event.esfavorito === 0 ? 1 : 0, favorito: resp }
                    : event
            )
        }));
    },
    setEventDataFavorite: (idEvento: any, resp: number) => {
        set((state : any) => ({
            dataEvent: state?.dataEvent?.map((dataEventItem : any) => ({
                ...dataEventItem,
                data: dataEventItem?.data?.map((item : any) =>
                    item.ideventos === idEvento
                        ? { ...item, favorito: resp }
                        : item
                ),
            })),
        }));
    },
    setEventsDeleteFavorite: (favorito: any) => {
        set((state: any) => ({
            events: state?.events?.map((item: any) => 
                item.favorito === favorito
                ? { ...item , esfavorito: item.esfavorito === 1 ? 0 : 1 }
                : item
            )
        }));
    },
    setEventDataDeleteDFavorite: (favorito: any) => {
        set((state: any) => ({
            dataEvent: state?.dataEvent?.map((dataEventItem : any) => ({
                ...dataEventItem,
                data: dataEventItem?.data?.map((item : any) =>
                    item.favorito === favorito
                ? { ...item , favorito: null }
                : item
                ),
            })),
        }));
    },
    getEventBySearch: async (palabraBusqueda: string) => {
        try {
            const resp: any = await get(`eventos/listar_eventos_filtro_letras/${palabraBusqueda}`);
            console.log(resp)
            if (resp.HEADER.CODE === 200) {
                set({ eventSearch: resp.RESPONSE });
            } else {
                set({ eventSearch: null })
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    },
    getEventByEventAndDate: async (event: number, date: number) => {
        try {
            const resp: any = await get(`eventos/consultar_evento_seleccionado/${event}/${date}`);
            console.log(resp)
            if (resp.HEADER.CODE === 200) {
                set({ dataEvent: resp.RESPONSE });
            } else {
                set({ dataEvent: null })
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    },
    getEventSearchByFilters: async (data: any) => {
        const url = 'https://squid-app-bfky7.ondigitalocean.app/api/eventos/listar_Eventos_Publicos_filtro'; // Mantener la URL simple si usas POST
    
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // Enviar los datos en el cuerpo
        };
    
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const result = await response.json();
            console.log(result); // Mostrar la respuesta
    
            if (result.HEADER.CODE === 200) {
                // Manejar la respuesta exitosa
                set({
                    eventSearchByFilters: result.RESULT.ResponseFinal
                })
                console.log("Resultados:", result.RESULT.ResponseFinal);
            } else {
                // Manejar cuando no se obtienen resultados
                console.log("No se encontraron resultados");
            }
        } catch (error) {
            console.error('Error durante la búsqueda:', error);
        }
    }
}));