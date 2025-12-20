"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

import FeedCard from './FeedCard';
import { useAuthStore } from '@/app/zustand/auth';
import { useFavoriteStore } from '@/app/zustand/favorites';
import { useEventFeedStore } from '@/app/zustand/eventFeed';

function getDisplayName(user: any) {
    const fullName = [user?.profile?.firstName, user?.profile?.lastName].filter(Boolean).join(' ').trim();
    return fullName || user?.email || 'Usuario';
}

function getAvatar(user: any) {
    return user?.profile?.avatar || '/svg/us.svg';
}

export default function EventFeed() {
    const { auth } = useAuthStore();
    const { addFavorite, deleteFavorite } = useFavoriteStore();
    const { items, isLoading, error, page, totalPages, loadFeed } = useEventFeedStore();

    useEffect(() => {
        if (!auth) return;
        loadFeed(1, 12, false);
    }, [auth]);

    const addFavoritesByUser = (item: any) => {
        if (!auth) return;

        if (item.esfavorito === 1) {
            deleteFavorite(item);
        } else {
            addFavorite({ idEvento: item.idEventos || item.ideventos, idFecha: item.idfecha, registrado: false });
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#EDEFF5] shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-[#212121]">Inicio</h1>
                        <p className="text-[#666] mt-1">Eventos publicados por ti y por las cuentas que sigues.</p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-[#007FA4] font-bold">
                        <Icon icon="solar:users-group-rounded-bold" width={22} />
                        <span className="text-sm">Feed</span>
                    </div>
                </div>

                {error && (
                    <p className="mt-4 text-sm font-bold text-[#861F21]">{error}</p>
                )}
            </div>

            {isLoading && items.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 border border-[#EDEFF5] shadow-sm text-[#666]">Cargando eventos...</div>
            ) : items.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-[#EDEFF5] shadow-sm text-center">
                    <div className="w-16 h-16 bg-[#E0F2F7] rounded-full flex items-center justify-center text-[#007FA4] mx-auto mb-4">
                        <Icon icon="solar:calendar-bold" width={28} />
                    </div>
                    <h2 className="text-xl font-black text-[#212121]">Aún no hay eventos en tu feed</h2>
                    <p className="text-[#666] mt-2">Sigue a organizadores o amigos para ver sus eventos aquí.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                    {items.map((item) => {
                        const owner: any = item.owner;
                        const favoritesCount = item.raw?._count?.favorites ?? 0;
                        const commentsCount = item.raw?._count?.comments ?? 0;

                        const isFavorite = item.event.esfavorito === 1;

                        return (
                            <FeedCard
                                key={`${item.event.idEventos}-${item.event.idfecha}`}
                                event={item.event}
                                owner={owner}
                                favoritesCount={favoritesCount}
                                commentsCount={commentsCount}
                                isFavorite={isFavorite}
                                onToggleFavorite={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    addFavoritesByUser(item.event);
                                }}
                            />
                        );
                    })}
                </div>
            )}

            {items.length > 0 && page < totalPages && (
                <div className="flex justify-center">
                    <button
                        onClick={() => loadFeed(page + 1, 12, true)}
                        className="bg-[#007FA4] text-white font-bold px-10 py-3 rounded-full hover:bg-[#006080] transition-colors"
                    >
                        Ver más
                    </button>
                </div>
            )}
        </div>
    );
}
