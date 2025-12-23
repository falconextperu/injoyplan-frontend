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
            const resp: any = await post(`favorites`, { eventId: data.idEvento });
            console.log(data)
            console.log(resp)
            if (resp && resp.id) {
                useEventStore.getState().setEventsAsFavorite(data.idEvento, resp.id);
                useEventStore.getState().setFeaturedEventsAsFavorite(data.idEvento, resp.id); // Update Featured
                useEventStore.getState().setEventDataFavorite(data.idEvento, resp.id);
                useEventStore.getState().setEventFiltersFavorite(data.idEvento, resp.id);
                // refresh favorites list so UI (Header) picks up changes
                await _get().getFavorites();
            }
        } catch (error: any) {
            console?.error('Error adding favorite:', error);
        }
    },
    deleteFavorite: async (event: any) => {
        console.log(event)
        try {
            const favoriteId = event?.idfavoritos ?? event?.favorito;
            const eventId = event?.idEvento ?? event?.idEventos ?? event?.ideventos;

            if (!favoriteId && !eventId) {
                console.error('No favoriteId or eventId provided for deletion');
                return;
            }

            // Prefer deleting by favoriteId (legacy behavior). Fallback to deleting by eventId.
            const endpoint = favoriteId
                ? `favorites/${favoriteId}`
                : `favorites/event/${eventId}`;

            const resp: any = await del(endpoint);
            console.log(resp)

            // On errors, backend returns { statusCode, message, error }
            if (resp && resp.message && !resp.statusCode) {

                // Update specific event by EventID (Most reliable for detail view)
                if (eventId) {
                    useEventStore.getState().setEventsDeleteFavoriteByEventId(eventId);
                    useEventStore.getState().setFeaturedEventsDeleteFavoriteByEventId(eventId); // Update Featured by Event ID
                    useEventStore.getState().setEventDataDeleteFavoriteByEventId(eventId);
                    useEventStore.getState().setEventDeleteFiltersFavoriteByEventId(eventId);
                }

                const favIdForState = favoriteId ?? event?.favorito;
                if (favIdForState) {
                    useEventStore.getState().setEventsDeleteFavorite(favIdForState);
                    useEventStore.getState().setFeaturedEventsDeleteFavorite(favIdForState); // Update Featured by Fav ID
                    useEventStore.getState().setEventDataDeleteDFavorite(favIdForState);
                    useEventStore.getState().setEventDeleteFiltersFavorite(favIdForState);
                }
                // refresh favorites list after deletion
                await _get().getFavorites();
            }
        } catch (error) {
            console.error('Error deleting favorite:', error);
        }
    },
    getFavorites: async () => {
        try {
            const resp: any = await get(`favorites`);
            console.log(resp)
            // Backend returns { data: favorites[], total, page, totalPages }
            if (resp?.data && Array.isArray(resp.data)) {
                // Map each favorite to legacy format
                const mappedFavorites = resp.data.map((fav: any) => {
                    const event = fav.event;
                    const firstDate = event?.dates?.[0];
                    const location = event?.location;

                    return {
                        idfavoritos: fav.id, // Favorite ID for deletion
                        favorito: fav.id,
                        esfavorito: 1,

                        // Event IDs
                        ideventos: event?.id,
                        idEventos: event?.id,
                        idfecha: firstDate?.id || event?.id,

                        // Event data
                        titulo: event?.title,
                        url: event?.imageUrl,
                        Destacado: event?.isFeatured ? 1 : 0,

                        // Date/time
                        FechaInicio: firstDate?.date || event?.createdAt,
                        HoraInicio: firstDate?.startTime || '',
                        HoraFinal: firstDate?.endTime || '',

                        // Price
                        Monto: firstDate?.price || 0,
                        EsGratis: (firstDate?.price === 0 || !firstDate?.price) ? 1 : 0,

                        // Location
                        NombreLocal: location?.address || (location?.district && location?.province ? `${location.district}, ${location.province}` : '') || '',
                        Distrito: location?.district || '',
                        direccion: location?.address || '',

                        // Other
                        categoria_id: 0,
                        urlFuente: event?.websiteUrl || event?.link || '',
                        estado: event?.isActive ? '1' : '0',
                        usuario_id: 0,
                    };
                });

                // Sort chronologically by event date (upcoming first)
                mappedFavorites.sort((a: any, b: any) => {
                    const dateA = new Date(a.FechaInicio).getTime();
                    const dateB = new Date(b.FechaInicio).getTime();
                    return dateA - dateB;
                });

                set({ favorites: mappedFavorites });

                // Sync with Event Store lists
                useEventStore.getState().updateEventsWithFavorites(mappedFavorites);
            } else {
                set({ favorites: [] })
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
            set({ favorites: [] })
        }
    },
}));


