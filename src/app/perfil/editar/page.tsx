"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import moment from 'moment';

import Auth from '@/app/ui/Auth';
import { useAuthStore } from '@/app/zustand/auth';
import { useProfileStore } from '@/app/zustand/profile';
import useAlertStore from '@/app/zustand/alert';
import SidebarLeft from '@/app/ui/Profile/SidebarLeft';
import SidebarRight from '@/app/ui/Profile/SidebarRight';
import { Icon } from '@iconify/react';

export default function EditarPerfilPage() {
  const { auth, me } = useAuthStore();
  const { myProfile, getMyProfile, updateMyProfile, uploadAvatar, uploadCover, isLoading, error } = useProfileStore();
  const { alert } = useAlertStore();

  const [openAuth, setOpenAuth] = useState(false);

  const profile = myProfile?.profile;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  // New Fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Note: gender and birthDate should be in profile, but if schema update isn't applied yet, they might be undefined
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');

  useEffect(() => {
    me();
    getMyProfile();
  }, []);

  useEffect(() => {
    // User fields are at root of myProfile
    if (myProfile) {
      setEmail(myProfile.email || '');
      setUsername(myProfile.username || '');
    }

    // Profile fields
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setDescription(profile.description || '');
      setPhone(profile.phone || '');
      setCity(profile.city || '');
      setCountry(profile.country || '');
      setGender(profile.gender || '');
      setBirthDate(profile.birthDate ? moment.utc(profile.birthDate).format('YYYY-MM-DD') : '');
    }
  }, [myProfile, profile]);

  const displayName = useMemo(() => {
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
    return fullName || myProfile?.email || 'Editar perfil';
  }, [firstName, lastName, myProfile?.email]);

  const avatarSrc = useMemo(() => {
    if (profile?.avatar) return profile.avatar;
    // Local 3D Avatars
    if (gender === 'Male') return '/images/avatar_male.png';
    if (gender === 'Female') return '/images/avatar_female.png';
    return '/images/avatar_male.png'; // Fallback
  }, [profile?.avatar, gender]);

  const coverSrc = profile?.coverImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop'; // Sleek Gradient Blue/Purple Professional background

  // Generate default username if empty
  useEffect(() => {
    if (myProfile && !myProfile.username && !username) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const baseName = (myProfile.email.split('@')[0] || 'user').replace(/[^a-zA-Z0-9]/g, '');
      setUsername(`${baseName}${randomSuffix}`);
    }
  }, [myProfile]);

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
    <div className="bg-[#F9FAFC] min-h-screen py-6 relative">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Left Sidebar */}
          <div className="hidden md:block md:col-span-3 lg:col-span-2 sticky top-24 self-start">
            <SidebarLeft />
          </div>

          {/* Center Content */}
          <div className="col-span-1 md:col-span-9 lg:col-span-7">
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
                <img
                  src={coverSrc}
                  alt="Portada"
                  className="w-full h-full object-cover"
                />
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
                    <img
                      src={avatarSrc}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
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
                  <div className="md:col-span-2">
                    <label className="font-bold text-[#444]">Nombre Completo</label>
                    <input
                      value={`${firstName} ${lastName}`.trim()}
                      onChange={(e) => {
                        const val = e.target.value;
                        const parts = val.split(' ');
                        setFirstName(parts[0] || '');
                        setLastName(parts.slice(1).join(' ') || '');
                      }}
                      placeholder="Nombre y Apellido"
                      className="w-full mt-2 bg-[#F7F7F7] outline-none border border-solid border-[#ddd] p-3 rounded-md"
                      type="text"
                    />
                  </div>

                  {/* Public Fields Group */}
                  <div>
                    <label className="font-bold text-[#444]">Nombre de usuario</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                      <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full mt-2 bg-[#F7F7F7] outline-none border border-solid border-[#ddd] p-3 pl-8 rounded-md"
                        type="text"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[#444]">Correo electrónico</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full mt-2 bg-[#F7F7F7] outline-none border border-solid border-[#ddd] p-3 rounded-md"
                      type="email"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="font-bold text-[#444]">Contraseña</label>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Escribe una nueva contraseña para cambiarla"
                      className="w-full mt-2 bg-[#F7F7F7] outline-none border border-solid border-[#ddd] p-3 rounded-md"
                      type="password"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#444]">Género</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full mt-2 bg-[#F7F7F7] outline-none border border-solid border-[#ddd] p-3 rounded-md"
                    >
                      <option value="">Seleccionar</option>
                      <option value="Male">Masculino</option>
                      <option value="Female">Femenino</option>
                      <option value="Other">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#444]">Fecha de nacimiento</label>
                    <input
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full mt-2 bg-[#F7F7F7] outline-none border border-solid border-[#ddd] p-3 rounded-md"
                      type="date"
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

                  <div className="md:col-span-2 mt-2 mb-1">
                    <div className="bg-[#F0F8FF] border border-[#B8E2F2] rounded-xl p-4 flex items-start gap-3">
                      <Icon icon="solar:info-circle-bold" className="text-[#007FA4] mt-0.5 flex-shrink-0" width={20} />
                      <p className="text-sm text-[#007FA4]">
                        La información de teléfono, país y ciudad es confidencial y no será expuesta públicamente.
                      </p>
                    </div>
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
                        username: username || undefined,
                        email: email || undefined,
                        password: password || undefined,
                        gender: gender || undefined,
                        birthDate: birthDate || undefined,
                      });
                      const { error } = useProfileStore.getState();
                      if (!error) {
                        alert('Perfil actualizado correctamente', 'success');
                      }
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
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24 self-start">
            <SidebarRight myProfile={myProfile} isLoading={isLoading} previewAvatar={avatarSrc} previewCover={coverSrc} />
          </div>

        </div>
        <Auth openAuth={openAuth} setOpenAuth={setOpenAuth} />
      </div>
    </div>
  );
}
