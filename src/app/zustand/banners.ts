import { create } from 'zustand';
import { get } from '../utils/fetch';
import { Banner, IResponse } from '../interfaces/banner';

export interface IBannersState {
    getBanners: () => void;
    isLoading: boolean;
    banners: Banner[];
}

export const useBannersStore = create<IBannersState>((set, _get) => ({
    banners: [],
    isLoading: true, // Start true so skeleton shows until data loads
    getBanners: async () => {
        set({ isLoading: true });
        try {
            const resp: any = await get(`banners/active`);
            console.log(resp)
            if (Array.isArray(resp)) {
                set({ banners: resp, isLoading: false });
            } else {
                set({ banners: [], isLoading: false })
            }
        } catch (error) {
            console.error('Error loading banners:', error);
            set({ banners: [], isLoading: false })
        }
    },
}));