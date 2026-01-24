"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useCookieStore } from '../../zustand/cookies';

const CookieConsentBanner = () => {
    const {
        isVisible,
        setIsVisible,
        consent,
        preferences,
        setPreferences,
        setConsent,
        acceptAll,
        denyAll,
        initialize
    } = useCookieStore();

    const [showConfig, setShowConfig] = useState(false);

    // Initialize store on mount
    useEffect(() => {
        initialize();
    }, []);

    const handleSaveConfig = () => {
        setConsent('configured');
        setPreferences(preferences); // Persists current state
        setIsVisible(false);
        setShowConfig(false);
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/30 z-[9998]" onClick={() => { }} />

            {/* Banner */}
            <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {!showConfig ? (
                        // Main Banner View
                        <div className="p-6 md:p-8">
                            <div className="flex items-start gap-4">
                                <div className="hidden md:flex w-12 h-12 bg-[#F0F8FF] rounded-xl items-center justify-center flex-shrink-0">
                                    <Icon icon="solar:cookie-bold" className="text-[#007FA4] text-2xl" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-[#212121] mb-2">Aviso de Cookies</h3>
                                    <p className="text-sm text-[#666] leading-relaxed">
                                        En este sitio web <strong>www.injoyplan.com</strong> utilizamos cookies propias y/o de terceros
                                        para recopilar datos estadísticos de la navegación de nuestros usuarios y mejorar nuestros servicios.
                                        También puede cambiar su configuración siempre que lo desee u obtener más información{' '}
                                        <Link href="/politicas-cookies" className="text-[#007FA4] font-bold hover:underline">
                                            aquí
                                        </Link>.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                <button
                                    onClick={acceptAll}
                                    className="flex-1 bg-[#007FA4] hover:bg-[#006080] text-white font-bold py-3 px-6 rounded-full transition-all text-sm"
                                >
                                    Aceptar
                                </button>
                                <button
                                    onClick={() => setShowConfig(true)}
                                    className="flex-1 bg-[#F0F8FF] hover:bg-[#e0f0fa] text-[#007FA4] font-bold py-3 px-6 rounded-full transition-all text-sm"
                                >
                                    Configurar
                                </button>
                                <button
                                    onClick={denyAll}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#666] font-bold py-3 px-6 rounded-full transition-all text-sm"
                                >
                                    Denegar
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Configuration View
                        <div className="p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setShowConfig(false)}
                                        className="text-[#007FA4] hover:text-[#006080]"
                                    >
                                        <Icon icon="solar:arrow-left-linear" width={24} />
                                    </button>
                                    <h3 className="text-lg font-bold text-[#212121]">Configurar Cookies</h3>
                                </div>
                            </div>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto">
                                {/* Essential Cookies */}
                                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                                    <div className="flex-1 pr-4">
                                        <h4 className="font-bold text-[#212121] text-sm">Cookies Esenciales</h4>
                                        <p className="text-xs text-[#666] mt-1">
                                            Necesarias para el funcionamiento básico del sitio web.
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={true}
                                            disabled
                                            className="sr-only"
                                        />
                                        <div className="w-11 h-6 bg-[#007FA4] rounded-full opacity-60"></div>
                                        <div className="absolute left-5 top-0.5 w-5 h-5 bg-white rounded-full shadow"></div>
                                    </div>
                                </div>

                                {/* Analytics Cookies */}
                                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                                    <div className="flex-1 pr-4">
                                        <h4 className="font-bold text-[#212121] text-sm">Cookies de Análisis</h4>
                                        <p className="text-xs text-[#666] mt-1">
                                            Nos permiten medir y analizar el uso del sitio web.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={preferences.analytics}
                                            onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007FA4]"></div>
                                    </label>
                                </div>

                                {/* Advertising Cookies */}
                                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                                    <div className="flex-1 pr-4">
                                        <h4 className="font-bold text-[#212121] text-sm">Cookies Publicitarias</h4>
                                        <p className="text-xs text-[#666] mt-1">
                                            Permiten mostrar publicidad relevante para ti.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={preferences.advertising}
                                            onChange={(e) => setPreferences({ ...preferences, advertising: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007FA4]"></div>
                                    </label>
                                </div>

                                {/* Functional Cookies */}
                                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                                    <div className="flex-1 pr-4">
                                        <h4 className="font-bold text-[#212121] text-sm">Cookies Funcionales</h4>
                                        <p className="text-xs text-[#666] mt-1">
                                            Mejoran la experiencia con características personalizadas.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={preferences.functional}
                                            onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007FA4]"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                <button
                                    onClick={handleSaveConfig}
                                    className="flex-1 bg-[#007FA4] hover:bg-[#006080] text-white font-bold py-3 px-6 rounded-full transition-all text-sm"
                                >
                                    Guardar preferencias
                                </button>
                                <button
                                    onClick={acceptAll}
                                    className="flex-1 bg-[#F0F8FF] hover:bg-[#e0f0fa] text-[#007FA4] font-bold py-3 px-6 rounded-full transition-all text-sm"
                                >
                                    Aceptar todas
                                </button>
                            </div>

                            <p className="text-xs text-[#999] text-center mt-4">
                                Puedes obtener más información en nuestra{' '}
                                <Link href="/politicas-cookies" className="text-[#007FA4] hover:underline">
                                    Política de Cookies
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CookieConsentBanner;

