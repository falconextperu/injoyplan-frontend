"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';

import Auth from '@/app/ui/Auth';
import { useAuthStore } from '@/app/zustand/auth';
import { useProfileStore } from '@/app/zustand/profile';

export default function EditarPerfilPage() {
  const { auth, me } = useAuthStore();
  const { myProfile, getMyProfile, updateMyProfile, uploadAvatar, uploadCover, isLoading, error } = useProfileStore();

  const [openAuth, setOpenAuth] = useState(false);

  const profile = myProfile?.profile;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    me();
    getMyProfile();
  }, []);

  useEffect(() => {
    setFirstName(profile?.firstName || '');
    setLastName(profile?.lastName || '');
    setDescription(profile?.description || '');
    setPhone(profile?.phone || '');
    setCity(profile?.city || '');
    setCountry(profile?.country || '');
  }, [profile?.firstName, profile?.lastName, profile?.description, profile?.phone, profile?.city, profile?.country]);

  const displayName = useMemo(() => {
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
    return fullName || myProfile?.email || 'Editar perfil';
  }, [firstName, lastName, myProfile?.email]);

  const avatarSrc = profile?.avatar || '/svg/us.svg';
  const coverSrc = profile?.coverImage || '/images/portada11.png';

  if (!auth) {
    return (
      <div className="bg-[#F9FAFC] min-h-[60vh]">
        <div className="max-w-[998px] mx-auto px-5 xl:px-10 py-10">
          <div className="bg-white border border-solid border-[#EDEFF5] rounded-2xl p-8 shadow-sm text-center">
            <h1 className="text-2xl font-bold text-[#212121]">Editar perfil</h1>
            <p className="text-[#666] mt-2">Inicia sesión para editar tu perfil.</p>
            <button
              onClick={() => setOpenAuth(true)}
              className="mt-6 bg-[#007FA4] text-white font-bold px-8 py-3 rounded-full"
            >
              Ingresar
            </button>
          </div>
        </div>
        <Auth openAuth={openAuth} setOpenAuth={setOpenAuth} />
      </div>
    );
  }

  return (
    <div className="bg-[#F9FAFC]">
      <div className="max-w-[998px] mx-auto px-5 xl:px-10 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#212121]">Editar perfil</h1>
            <p className="text-[#666] mt-1">{displayName}</p>
          </div>
          <Link href="/perfil" className="text-[#007FA4] font-bold">
            Volver
          </Link>
        </div>

        <div className="bg-white border border-solid border-[#EDEFF5] rounded-2xl overflow-hidden shadow-sm">
          <div className="relative h-[160px] md:h-[220px] bg-[#EEE]">
            <Image src={coverSrc} alt="Portada" fill className="object-cover" />
            <label className="absolute right-4 bottom-4 bg-white/90 border border-solid border-[#EDEFF5] text-[#007FA4] font-bold px-4 py-2 rounded-full cursor-pointer">
              Cambiar portada
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  await uploadCover(file);
                }}
              />
            </label>
          </div>

          <div className="px-6 md:px-8 pb-8">
            <div className="-mt-10 md:-mt-14 flex items-end gap-4 relative z-10">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white bg-[#F7F7F7]">
                <Image src={avatarSrc} alt="Avatar" width={112} height={112} className="w-full h-full object-cover" />
              </div>
              <label className="bg-white border border-solid border-[#007FA4] text-[#007FA4] font-bold px-4 py-2 rounded-full cursor-pointer">
                Cambiar avatar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    await uploadAvatar(file);
                  }}
                />
              </label>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#444]">Nombres</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full mt-2 bg-[#F7F7F7] outline-none border border-solid border-[#ddd] p-3 rounded-md"
                  type="text"
                />
              </div>
              <div>
                <label className="font-bold text-[#444]">Apellidos</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full mt-2 bg-[#F7F7F7] outline-none border border-solid border-[#ddd] p-3 rounded-md"
                  type="text"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-bold text-[#444]">Descripción</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-2 bg-[#F7F7F7] outline-none border border-solid border-[#ddd] p-3 rounded-md min-h-[120px]"
                />
              </div>

              <div>
                <label className="font-bold text-[#444]">Teléfono</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-2 bg-[#F7F7F7] outline-none border border-solid border-[#ddd] p-3 rounded-md"
                  type="tel"
                />
              </div>
              <div>
                <label className="font-bold text-[#444]">Ciudad</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full mt-2 bg-[#F7F7F7] outline-none border border-solid border-[#ddd] p-3 rounded-md"
                  type="text"
                />
              </div>
              <div className="md:col-span-2">
                <label className="font-bold text-[#444]">País</label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full mt-2 bg-[#F7F7F7] outline-none border border-solid border-[#ddd] p-3 rounded-md"
                  type="text"
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 text-[#861F21] font-bold">{error}</p>
            )}

            <div className="mt-8 flex items-center gap-3">
              <button
                disabled={isLoading}
                onClick={async () => {
                  await updateMyProfile({
                    firstName: firstName || undefined,
                    lastName: lastName || undefined,
                    description: description || undefined,
                    phone: phone || undefined,
                    city: city || undefined,
                    country: country || undefined,
                  });
                }}
                className={
                  isLoading
                    ? 'bg-[#007FA4]/60 text-white font-bold px-8 py-3 rounded-full cursor-not-allowed'
                    : 'bg-[#007FA4] text-white font-bold px-8 py-3 rounded-full'
                }
              >
                Guardar cambios
              </button>
              <Link
                href="/perfil"
                className="border border-solid border-[#007FA4] text-[#007FA4] font-bold px-8 py-3 rounded-full"
              >
                Cancelar
              </Link>
            </div>
          </div>
        </div>

        <Auth openAuth={openAuth} setOpenAuth={setOpenAuth} />
      </div>
    </div>
  );
}
