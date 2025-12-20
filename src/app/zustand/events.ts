import { create } from 'zustand';
import { get } from '../utils/fetch';
import { Event, IResponse } from '../interfaces/event';
import useAlertStore from './alert';
import moment from 'moment';

export interface IEventsState {
    getEvents: (limit: number) => void;
    isLoading: boolean;
    eventsEntreteiment: Event[],
    eventsCulture: Event[],
    eventsTeatro: Event[],
    eventsMusic: Event[],
    eventsDestacades: Event[],
    getEventsDestacades: () => void,
    resetEventBySearch: () => void
    resetEvent: () => void
    events: Event[];
    eventSearch: any
    total: number
    eventSearchByFilters: any
    valueSearch: string
    dataEvent: any,
    getEventBySearch: (data: string) => any
    setEventsAsFavorite: (idEvento: any, resp: any) => any
    setEventDataFavorite: (idEvento: any, resp: any) => any
    setEventFiltersFavorite: (idEvento: any, resp: any) => any
    setEventsDeleteFavorite: (idFavorito: any) => any
    setEventDataDeleteDFavorite: (idFavorito: any) => any
    setEventDeleteFiltersFavorite: (idFavorito: any) => any
    getEventByEventAndDate: (event: number, date: number) => any
    getEventSearchByFilters: (params: any) => any
    getValueSearch: (value: string) => any
}

// Función para mapear eventos del nuevo backend al formato del frontend antiguo
export const mapEventFromBackend = (item: any): Event => {
    const firstDate = item.dates?.[0];
    const location = item.location;

    return {
        // IDs
        idEventos: item.id,
        ideventos: item.id,
        idfecha: firstDate?.id || item.id,

        // Datos principales
        titulo: item.title,
        url: item.imageUrl,
        Destacado: item.isFeatured ? 1 : 0,

        // Fecha y hora
        FechaInicio: firstDate?.date || item.createdAt,
        HoraInicio: firstDate?.startTime || '',
        HoraFinal: firstDate?.endTime || '',

        // Precio
        Monto: firstDate?.price || 0,
        EsGratis: (firstDate?.price === 0 || !firstDate?.price) ? 1 : 0,

        // Ubicación
        NombreLocal: location?.name || location?.address || `${location?.district}, ${location?.province}` || '',
        Distrito: location?.district || '',
        direccion: location?.address || '',
        latitud_longitud: (location && location.latitude && location.longitude) ? `${location.latitude}, ${location.longitude}` : '',
        descripcionEvento: item.description || '',

        // Otros
        categoria_id: 0, // El nuevo backend usa string para category
        urlFuente: item.websiteUrl || item.link || '', // Mapea websiteUrl (Event) o link (Banner)
        estado: item.isActive ? '1' : '0',
        usuario_id: 0,

        // Favoritos
        favorito: item.favorito ? 1 : 0,
        esfavorito: item.favorito ? 1 : 0,
    };
};

export const useEventStore = create<IEventsState>((set, _get) => ({
    isLoading: false,
    eventsEntreteiment: [],
    eventsDestacades: [],
    eventsCulture: [],
    eventsTeatro: [],
    eventsMusic: [],
    valueSearch: "",
    eventSearchByFilters: [],
    total: 0,
    dataEvent: null,
    eventSearch: null,
    getValueSearch: (valueSearch: string) => {
        set({
            valueSearch: valueSearch
        })
    },
    resetEventBySearch: () => {
        set({
            eventSearch: []
        })
    },
    resetEvent: () => {
        set({
            dataEvent: null
        })
    },
    events: [],
    getEvents: async (limit: number) => {
        set({ isLoading: true });
        try {
            console.log(limit)
            const resp: any = await get(`events?page=1&limit=${limit}&excludeFeatured=true`);
            console.log(resp)
            if (resp?.data && Array.isArray(resp.data)) {
                set({
                    events: resp.data.map((item: any) => mapEventFromBackend(item)),
                    isLoading: false
                });
            } else {
                set({ events: [], isLoading: false })
            }
        } catch (error) {
            console.error('Error loading events:', error);
            set({ events: [], isLoading: false })
        }
    },
    getEventsDestacades: async () => {
        try {
            const resp: any = await get(`events/featured`);
            console.log(resp)
            // El backend puede retornar { data: [...] } o un array directo
            const eventsArray = resp?.data && Array.isArray(resp.data) ? resp.data : (Array.isArray(resp) ? resp : []);
            if (eventsArray.length > 0) {
                set({
                    eventsDestacades: eventsArray.map((item: any) => mapEventFromBackend(item))
                });
            } else {
                set({ eventsDestacades: [] })
            }
        } catch (error) {
            console.error('Error loading featured events:', error);
            set({ eventsDestacades: [] })
        }
    },
    setEventsAsFavorite: (idEvento, resp) => {
        console.log(idEvento, resp)

        set((state: any) => {
            console.log(state.events)
            return (
                {
                    events: state?.events?.map((event: any) =>
                        event.idEventos === idEvento
                            ? { ...event, esfavorito: event.esfavorito === 0 ? 1 : 0, favorito: resp }
                            : event
                    )
                });
        })
    },
    setEventFiltersFavorite: (idEvento: any, resp: number) => {
        console.log(idEvento, resp)
        set((state: any) => ({
            eventSearchByFilters: state?.eventSearchByFilters?.map((event: any) =>
                (event.ideventos || event.idEventos) === idEvento
                    ? { ...event, esfavorito: event.esfavorito === 0 ? 1 : 0, favorito: resp }
                    : event

            ),
        }));
    },
    setEventDataFavorite: (idEvento: any, resp: number) => {
        set((state: any) => ({
            dataEvent: state?.dataEvent?.map((dataEventItem: any) => ({
                ...dataEventItem,
                data: dataEventItem?.data?.map((item: any) =>
                    (item.ideventos || item.idEventos) === idEvento
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
                    ? { ...item, esfavorito: 0, favorito: null }
                    : item
            )
        }));
    },
    setEventDeleteFiltersFavorite: (favorito: any) => {
        set((state: any) => ({
            eventSearchByFilters: state?.eventSearchByFilters?.map((item: any) =>
                item.favorito === favorito
                    ? { ...item, favorito: null, esfavorito: 0 }
                    : item
            )
        }));
    },
    setEventDataDeleteDFavorite: (favorito: any) => {
        set((state: any) => ({
            dataEvent: state?.dataEvent?.map((dataEventItem: any) => ({
                ...dataEventItem,
                data: dataEventItem?.data?.map((item: any) =>
                    item.favorito === favorito
                        ? { ...item, favorito: null }
                        : item
                ),
            })),
        }));
    },
    getEventBySearch: async (palabraBusqueda: string) => {
        try {
            const resp: any = await get(`events/search?q=${palabraBusqueda}`);
            console.log(resp)
            if (resp?.data && Array.isArray(resp.data)) {
                // Map backend response to frontend format
                const mappedEvents = resp.data.map((item: any) => mapEventFromBackend(item));
                set({ eventSearch: mappedEvents });
            } else {
                set({ eventSearch: null })
            }
        } catch (error) {
            console.error('Error searching events:', error);
            set({ eventSearch: null })
        }
    },
    getEventByEventAndDate: async (event: number, date: number) => {
        console.log("getEventByEventAndDate", event)
        try {
            const resp: any = await get(`events/detail/${event}/${date}`);
            console.log("Detail resp:", resp)

            if (resp && resp.id) {
                // Transform backend response to frontend expected structure (Array)
                // Expected: [{ data: [event], dataFecha: [dates], dataPlataformaVenta: [...] }]

                const mappedEvent = mapEventFromBackend(resp);
                const dates = resp.dates || [];

                // Construct platform sales data from websiteUrl
                const plataformaVenta = [];
                if (resp.websiteUrl) {
                    plataformaVenta.push({
                        nombrePlataforma: "Comprar Entrada",
                        urlWebLugar: resp.websiteUrl,
                        iconos: "/svg/tickets_gray.svg" // Default icon or map based on URL
                    });
                } else if (resp.link) {
                    plataformaVenta.push({
                        nombrePlataforma: "Más Info",
                        urlWebLugar: resp.link,
                        iconos: "/svg/tickets_gray.svg"
                    });
                }

                const transformedData = [{
                    data: [mappedEvent],
                    dataFecha: dates.map((d: any) => ({
                        idfecha: d.id,
                        FechaInicio: d.date,
                        HoraInicio: d.startTime,
                        HoraFinal: d.endTime,
                        Monto: d.price
                    })),
                    dataPlataformaVenta: plataformaVenta,
                    owner: resp.user,
                }];

                set({ dataEvent: transformedData });
            } else {
                set({ dataEvent: null })
            }
        } catch (error) {
            console.error('Error loading event detail:', error);
            set({ dataEvent: null })
        }
    },
    // aqui se llama asi por que el api debe ser con params pero metodo get y no post 
    getEventSearchByFilters: async (data: any) => {
        console.log("Searching with filters:", data);

        // Remove empty/undefined params
        const filteredParams = Object.entries(data)
            .filter(([_, value]) => value !== undefined && value !== '' && value !== 0)
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

        const query = new URLSearchParams(filteredParams).toString();

        try {
            const resp: any = await get(`events/public/search?${query}`);
            console.log("Search response:", resp);

            if (resp && Array.isArray(resp.eventos)) {

                const mappedEvents = resp.eventos.map((item: any) => mapEventFromBackend(item));
                set({ eventSearchByFilters: mappedEvents, total: resp.total || 0 });
            } else {
                set({ eventSearchByFilters: [], total: 0 })
            }
        } catch (error) {
            console.error('Error searching events by filters:', error);
            set({ eventSearchByFilters: [], total: 0 })
        }
    }
}));