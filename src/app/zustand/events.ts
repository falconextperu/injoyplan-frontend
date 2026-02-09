import { create } from 'zustand';
import { get } from '../utils/fetch';
import { Event, IResponse } from '../interfaces/event';
import useAlertStore from './alert';
import moment from 'moment';

export interface IEventsState {
    getEvents: (page?: number) => void;
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
    setEventsDeleteFavoriteByEventId: (eventId: any) => void;
    setEventDeleteFiltersFavoriteByEventId: (eventId: any) => void;
    setEventDataDeleteFavoriteByEventId: (eventId: any) => void;
    getEventByEventAndDate: (event: number, date: number) => any
    getEventSearchByFilters: (params: any, options?: { page?: number, isLoadMore?: boolean, limit?: number }) => any
    setFeaturedEventsAsFavorite: (idEvento: any, resp: any) => any
    setFeaturedEventsDeleteFavorite: (idFavorito: any) => any
    setFeaturedEventsDeleteFavoriteByEventId: (eventId: any) => void
    updateEventsWithFavorites: (favorites: any[]) => void
    getValueSearch: (value: string) => any
}

// Función para mapear eventos del nuevo backend al formato del frontend antiguo
// Función para mapear eventos del nuevo backend al formato del frontend antiguo
export const mapEventFromBackend = (item: any, filterDate?: string): Event => {
    // Logic to find the most relevant upcoming date
    let firstDate = item.dates?.[0];

    if (item.dates && item.dates.length > 0) {
        // Sort dates chronologically
        const sortedDates = [...item.dates].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // If a specific filter date is provided, try to find a match
        if (filterDate) {
            // filterDate is usually "DD-MM-YYYY" or "YYYY-MM-DD". Let's handle string inputs carefully.
            // Assuming filterDate from store is "DD-MM-YYYY" based on usage in page.tsx: setDate(moment(value).format('DD-MM-YYYY'))
            // But verify format. If it comes from `data` in search, it might be in different format.
            // Let's normalize to comparison string YYYY-MM-DD for safety.

            const targetDateStr = typeof filterDate === 'string' && filterDate.includes('-')
                ? (filterDate.split('-')[2]?.length === 4 ? filterDate.split('-').reverse().join('-') : filterDate) // simple check if DD-MM-YYYY -> YYYY-MM-DD
                : null;

            // Better yet, just use moment if available or simple date string matching
            const match = sortedDates.find((d: any) => {
                const dDate = new Date(d.date).toISOString().split('T')[0]; // YYYY-MM-DD
                // filterDate should already be in YYYY-MM-DD format from buildSearchData()
                return dDate === filterDate;
            });

            if (match) {
                firstDate = match;
            } else {
                // Fallback to upcoming logic if no exact match (though backend likely filtered by it)
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const upcoming = sortedDates.find((d: any) => new Date(d.date).getTime() >= today.getTime());
                firstDate = upcoming || sortedDates[0];
            }
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const upcoming = sortedDates.find((d: any) => new Date(d.date).getTime() >= today.getTime());
            firstDate = upcoming || sortedDates[0];
        }
    }

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

        // Favoritos - Backend sends: favorito (ID string if favorited), esfavorito (1 or 0)
        favorito: item.favorito || item.esfavorito || 0,
        esfavorito: item.esfavorito === 1 || (item.favorito && item.favorito !== 0) ? 1 : 0,

        // Entradas externas
        ticketUrls: item.ticketUrls || [],
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
    getEvents: async (page: number = 1) => {
        set({ isLoading: true });
        try {
            console.log(`Loading page ${page}`);
            // Use proper page-based pagination
            const resp: any = await get(`events/public/search?page=${page}&limit=12&excludeFeatured=true`);
            console.log(resp);

            if (resp?.eventos && Array.isArray(resp.eventos)) {
                const newEvents = resp.eventos.map((item: any) => mapEventFromBackend(item));

                set((state) => ({
                    // Append new events if page > 1, otherwise replace
                    events: page === 1 ? newEvents : [...state.events, ...newEvents],
                    isLoading: false
                }));
            } else {
                set({ events: page === 1 ? [] : _get().events, isLoading: false });
            }
        } catch (error) {
            console.error('Error loading events:', error);
            set({ events: page === 1 ? [] : _get().events, isLoading: false });
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
                        ? { ...item, favorito: null, esfavorito: 0 }
                        : item
                ),
            })),
        }));
    },
    // Nuevas funciones para eliminar favorito por ID de Evento (más seguro)
    setEventsDeleteFavoriteByEventId: (eventId: any) => {
        set((state: any) => ({
            events: state?.events?.map((item: any) =>
                (item.ideventos || item.idEventos) === eventId
                    ? { ...item, esfavorito: 0, favorito: null }
                    : item
            )
        }));
    },
    setEventDeleteFiltersFavoriteByEventId: (eventId: any) => {
        set((state: any) => ({
            eventSearchByFilters: state?.eventSearchByFilters?.map((item: any) =>
                (item.ideventos || item.idEventos) === eventId
                    ? { ...item, favorito: null, esfavorito: 0 }
                    : item
            )
        }));
    },
    setEventDataDeleteFavoriteByEventId: (eventId: any) => {
        set((state: any) => ({
            dataEvent: state?.dataEvent?.map((dataEventItem: any) => ({
                ...dataEventItem,
                data: dataEventItem?.data?.map((item: any) =>
                    (item.ideventos || item.idEventos) === eventId
                        ? { ...item, favorito: null, esfavorito: 0 }
                        : item
                ),
            })),
        }));
    },
    setFeaturedEventsAsFavorite: (idEvento: any, resp: any) => {
        set((state: any) => ({
            eventsDestacades: state?.eventsDestacades?.map((event: any) =>
                (event.ideventos || event.idEventos) === idEvento
                    ? { ...event, esfavorito: 1, favorito: resp }
                    : event
            )
        }));
    },
    setFeaturedEventsDeleteFavorite: (favorito: any) => {
        set((state: any) => ({
            eventsDestacades: state?.eventsDestacades?.map((item: any) =>
                item.favorito === favorito
                    ? { ...item, esfavorito: 0, favorito: null }
                    : item
            )
        }));
    },
    setFeaturedEventsDeleteFavoriteByEventId: (eventId: any) => {
        set((state: any) => ({
            eventsDestacades: state?.eventsDestacades?.map((item: any) =>
                (item.ideventos || item.idEventos) === eventId
                    ? { ...item, esfavorito: 0, favorito: null }
                    : item
            )
        }));
    },
    getEventBySearch: async (palabraBusqueda: string) => {
        try {
            const resp: any = await get(`events/search?q=${palabraBusqueda}`);
            console.log(resp)
            if (resp?.data && Array.isArray(resp.data)) {
                // Map backend response to frontend format, expanding by dates
                const allEvents: any[] = [];
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                resp.data.forEach((item: any) => {
                    // Filter and sort verified upcoming dates
                    let eventDates = item.dates || [];

                    // Filter future dates
                    const upcomingDates = eventDates.filter((d: any) => {
                        const dateObj = new Date(d.date);
                        // Optional: clear time component for strict date comparison if needed
                        // dateObj.setHours(0,0,0,0); 
                        // But server returns ISO strings often with time or just date. 
                        // Let's rely on standard comparison.
                        // Ideally we check if date + endTime (if exists) is >= now.
                        // For search results, simple Date check is good.
                        return new Date(d.date).getTime() >= today.getTime();
                    });

                    // If we have upcoming dates, generate an item for EACH date
                    if (upcomingDates.length > 0) {
                        upcomingDates.forEach((dateInfo: any) => {
                            // Create a base mapped event using the standard mapper 
                            // (which might default to first date logic, but we override it)
                            const baseEvent = mapEventFromBackend(item);

                            // Override with THIS specific date's info
                            const specificEventInstance = {
                                ...baseEvent,
                                idfecha: dateInfo.id,
                                FechaInicio: dateInfo.date,
                                HoraInicio: dateInfo.startTime,
                                HoraFinal: dateInfo.endTime,
                                Monto: dateInfo.price,
                                EsGratis: (dateInfo.price === 0 || !dateInfo.price) ? 1 : 0
                            };
                            allEvents.push(specificEventInstance);
                        });
                    } else {
                        // Fallback mechanism: if no upcoming dates (or only past),
                        // show the event as "Past" or just use the standard mapping (usually shows last date or first)
                        // This ensures the event is at least visible if it matches search terms.
                        // Or we can choose to HIDE past events from search entirely. 
                        // Current logic: mapEventFromBackend picks *some* date.
                        // Let's keep showing it but mapped once.
                        allEvents.push(mapEventFromBackend(item));
                    }
                });

                // Sort all resulting events by date
                allEvents.sort((a, b) => new Date(a.FechaInicio).getTime() - new Date(b.FechaInicio).getTime());

                set({ eventSearch: allEvents });
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
                const plataformaVenta: any[] = [];
                // if (resp.websiteUrl) {
                //     plataformaVenta.push({
                //         nombrePlataforma: "Comprar Entrada",
                //         urlWebLugar: resp.websiteUrl,
                //         iconos: "/svg/tickets_gray.svg" // Default icon or map based on URL
                //     });
                // } else if (resp.link) {
                //     plataformaVenta.push({
                //         nombrePlataforma: "Más Info",
                //         urlWebLugar: resp.link,
                //         iconos: "/svg/tickets_gray.svg"
                //     });
                // }

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
    // aqui se llama asi por que el api debe ser con params pero metodo get y no post 
    getEventSearchByFilters: async (data: any, options?: { page?: number, isLoadMore?: boolean, limit?: number }) => {
        console.log("Searching with filters:", data, options);

        // Remove empty/undefined params
        const filteredParams = Object.entries(data)
            .filter(([_, value]) => value !== undefined && value !== '' && value !== 0)
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

        // Add pagination params
        const page = options?.page || 1;
        const limit = options?.limit || 12;

        // Construct query string
        const queryParams: any = { ...filteredParams, page, limit };
        const query = new URLSearchParams(queryParams).toString();

        try {
            // Extract date from params to pass to mapper
            const params = new URLSearchParams(data);
            const dateFilter = params.get('fechaInicio') || undefined;

            const resp: any = await get(`events/public/search?${query}`);
            console.log("Search response:", resp);

            if (resp && Array.isArray(resp.eventos)) {
                const mappedEvents = resp.eventos.map((item: any) => mapEventFromBackend(item, dateFilter))
                    .sort((a: any, b: any) => new Date(a.FechaInicio).getTime() - new Date(b.FechaInicio).getTime());

                if (options?.isLoadMore) {
                    set((state: any) => ({
                        eventSearchByFilters: [...(state.eventSearchByFilters || []), ...mappedEvents],
                        total: resp.total || 0
                    }));
                } else {
                    set({ eventSearchByFilters: mappedEvents, total: resp.total || 0 });
                }
            } else {
                if (!options?.isLoadMore) {
                    set({ eventSearchByFilters: [], total: 0 })
                }
            }
        } catch (error) {
            console.error('Error searching events by filters:', error);
            if (!options?.isLoadMore) {
                set({ eventSearchByFilters: [], total: 0 })
            }
        }
    },
    updateEventsWithFavorites: (favorites: any[]) => {
        // Create a Set of Favorite Event IDs for O(1) lookups
        const favoriteEventIds = new Set(favorites.map((f: any) => f.ideventos || f.idEventos));
        const favoriteMap = new Map(favorites.map((f: any) => [f.ideventos || f.idEventos, f.idfavoritos])); // Map EventID -> FavoriteID

        set((state: any) => {
            const updateList = (list: any[]) => list?.map((event: any) => {
                const eventId = event.ideventos || event.idEventos;
                if (favoriteEventIds.has(eventId)) {
                    return { ...event, esfavorito: 1, favorito: favoriteMap.get(eventId) };
                }
                return event;
            }) || [];

            return {
                events: updateList(state.events),
                eventsDestacades: updateList(state.eventsDestacades),
                eventsEntreteiment: updateList(state.eventsEntreteiment),
                eventsCulture: updateList(state.eventsCulture),
                eventsTeatro: updateList(state.eventsTeatro),
                eventsMusic: updateList(state.eventsMusic),
                eventSearch: updateList(state.eventSearch || []),
                eventSearchByFilters: updateList(state.eventSearchByFilters || []),
            };
        });
    }
}));