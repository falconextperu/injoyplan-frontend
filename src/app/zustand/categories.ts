import { create } from 'zustand';
import { get } from '../utils/fetch';
import { Category, IResponse } from '../interfaces/category';
import { mapEventFromBackend } from './events';

export interface ICategoriesState {
    getCategories: () => void;
    isLoading: boolean;
    categories: Category[];
    categoriesRelations: any
    getCategoriesRelations: (id: string | number) => void
    countsCategories: any
    getCategoriesCount: () => void
    categoryInfo: any
    getValueCategory: (value: any) => void
}

export const useCategoriesState = create<ICategoriesState>((set, _get) => ({
    categoryInfo: null,
    countsCategories: null,
    isLoading: false,
    categoriesRelations: [],
    categories: [],
    getValueCategory: (category: any) => {
        set({
            categoryInfo: category
        })
    },
    getCategories: async () => {
        try {
            const resp: any = await get(`events/stats/by-category`);
            if (Array.isArray(resp)) {
                set({ categories: resp });
            } else {
                set({ categories: [] })
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            set({ categories: [] })
        }
    },
    getCategoriesRelations: async (idEvent: string | number) => {
        try {
            const resp: any = await get(`events/related/${idEvent}?excludeFeatured=true`);
            console.log(resp)
            if (Array.isArray(resp)) {
                set({ categoriesRelations: resp.map((item: any) => mapEventFromBackend(item)) });
            } else {
                set({ categoriesRelations: [] })
            }
        } catch (error) {
            console.error('Error loading related events:', error);
            set({ categoriesRelations: [] })
        }
    },
    getCategoriesCount: async () => {
        set({ isLoading: true });
        try {
            const resp: any = await get(`events/stats/by-category`);
            console.log(resp)
            if (Array.isArray(resp)) {
                set({ countsCategories: resp, isLoading: false });
            } else {
                set({ countsCategories: [], isLoading: false })
            }
        } catch (error) {
            console.error('Error loading category counts:', error);
            set({ countsCategories: [], isLoading: false })
        }
    },
}));
