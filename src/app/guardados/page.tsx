"use client";

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

import SidebarLeft from '@/app/ui/Profile/SidebarLeft';
import Auth from '@/app/ui/Auth';
import Card from '@/app/components/Card';

import { useAuthStore } from '@/app/zustand/auth';
import { useFavoriteStore } from '@/app/zustand/favorites';

export default function GuardadosPage() {
  const { auth, me } = useAuthStore();
  const { favorites, getFavorites, addFavorite, deleteFavorite } = useFavoriteStore();

  const [openAuth, setOpenAuth] = useState(false);

  useEffect(() => {
    me();
  }, []);

  useEffect(() => {
    if (!auth) return;
    getFavorites();
  }, [auth]);

  if (!auth) {
    return (
      <div className="bg-[#F9FAFC] min-h-[70vh] flex items-center justify-center px-5">
        <div className="w-full max-w-md bg-white border border-[#EDEFF5] rounded-2xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-[#E0F2F7] rounded-full flex items-center justify-center text-[#007FA4] mx-auto mb-4">
            <Icon icon="solar:bookmark-circle-bold" width={30} />
          </div>
          <h1 className="text-2xl font-black text-[#212121]">Guardados</h1>
          <p className="text-[#666] mt-2">Inicia sesión para ver tus eventos guardados.</p>
          <button
            onClick={() => setOpenAuth(true)}
            className="mt-6 w-full bg-[#007FA4] text-white font-bold px-8 py-3 rounded-full hover:bg-[#006080] transition-colors"
          >
            Ingresar
          </button>
          <Auth openAuth={openAuth} setOpenAuth={setOpenAuth} />
        </div>
      </div>
    );
  }

  const addFavoritesByUser = (item: any) => {
    if (item.esfavorito === 1) {
      deleteFavorite(item);
    } else {
      addFavorite({ idEvento: item.idEventos || item.ideventos, idFecha: item.idfecha, registrado: false });
    }
  };

  return (
    <div className="bg-[#F9FAFC] min-h-[calc(100vh-120px)]">
      <div className="max-w-[1440px] mx-auto p-4 md:p-6 lg:p-8 flex gap-6">
        <div className="hidden md:block w-[80px] lg:w-[240px] flex-shrink-0">
          <SidebarLeft />
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-2xl p-6 border border-[#EDEFF5] shadow-sm">
            <h1 className="text-2xl md:text-3xl font-black text-[#212121]">Guardados</h1>
            <p className="text-[#666] mt-1">Tus eventos favoritos.</p>
          </div>

          <div className="mt-6">
            {favorites.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-[#EDEFF5] shadow-sm text-center">
                <div className="w-16 h-16 bg-[#FAFBFF] rounded-full flex items-center justify-center text-[#007FA4] mx-auto mb-4 border border-[#EDEFF5]">
                  <Icon icon="solar:heart-bold" width={28} className="text-[#FF4D4D]" />
                </div>
                <h2 className="text-xl font-black text-[#212121]">Aún no tienes guardados</h2>
                <p className="text-[#666] mt-2">Guarda eventos para encontrarlos rápido aquí.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
                {favorites.map((item: any) => (
                  <Card
                    key={`${item.idEventos || item.ideventos}-${item.idfecha}-${item.idfavoritos || item.favorito}`}
                    item={item}
                    addFavoritesByUser={addFavoritesByUser}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Auth openAuth={openAuth} setOpenAuth={setOpenAuth} />
    </div>
  );
}
