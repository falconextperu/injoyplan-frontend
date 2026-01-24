import { create } from 'zustand';

export type CookieConsentStatus = 'accepted' | 'denied' | 'configured' | null;

export interface CookiePreferences {
    essential: boolean;
    analytics: boolean;
    advertising: boolean;
    functional: boolean;
}

interface CookieState {
    consent: CookieConsentStatus;
    preferences: CookiePreferences;
    isVisible: boolean;

    // Actions
    setConsent: (status: CookieConsentStatus) => void;
    setPreferences: (prefs: CookiePreferences) => void;
    setIsVisible: (visible: boolean) => void;
    acceptAll: () => void;
    denyAll: () => void;
    initialize: () => void;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
    essential: true,
    analytics: false,
    advertising: false,
    functional: false,
};

const ACCEPTED_PREFERENCES: CookiePreferences = {
    essential: true,
    analytics: true,
    advertising: true,
    functional: true,
};

export const useCookieStore = create<CookieState>((set) => ({
    consent: null,
    preferences: DEFAULT_PREFERENCES,
    isVisible: false,

    setConsent: (status) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cookie_consent', status || '');
        }
        set({ consent: status });
    },

    setPreferences: (prefs) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cookie_preferences', JSON.stringify(prefs));
        }
        set({ preferences: prefs });
    },

    setIsVisible: (visible) => set({ isVisible: visible }),

    acceptAll: () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cookie_consent', 'accepted');
            localStorage.setItem('cookie_preferences', JSON.stringify(ACCEPTED_PREFERENCES));
        }
        set({
            consent: 'accepted',
            preferences: ACCEPTED_PREFERENCES,
            isVisible: false
        });
    },

    denyAll: () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cookie_consent', 'denied');
            localStorage.setItem('cookie_preferences', JSON.stringify(DEFAULT_PREFERENCES));
        }
        set({
            consent: 'denied',
            preferences: DEFAULT_PREFERENCES,
            isVisible: false
        });
    },

    initialize: () => {
        if (typeof window !== 'undefined') {
            const storedConsent = localStorage.getItem('cookie_consent') as CookieConsentStatus;
            const storedPrefs = localStorage.getItem('cookie_preferences');

            if (storedConsent) {
                set({ consent: storedConsent });
            } else {
                // Determine if we should show banner (e.g. small delay)
                setTimeout(() => {
                    set({ isVisible: true });
                }, 1000);
            }

            if (storedPrefs) {
                try {
                    set({ preferences: JSON.parse(storedPrefs) });
                } catch (e) {
                    console.error('Failed to parse cookie preferences', e);
                    set({ preferences: DEFAULT_PREFERENCES });
                }
            }
        }
    }
}));
