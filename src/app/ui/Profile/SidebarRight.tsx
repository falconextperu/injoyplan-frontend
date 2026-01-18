import { useState } from 'react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import { UserDTO } from '@/app/interfaces/user';
import { getProfileAssets } from '@/app/utils/profileAssets';
import CreatePostModal from './CreatePostModal';

interface Props {
    myProfile: UserDTO | null;
    isLoading: boolean;
    previewAvatar?: string;
    previewCover?: string;
}

export default function SidebarRight({ myProfile, isLoading, previewAvatar, previewCover }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading || !myProfile) {
        return (
            <div className="bg-white rounded-2xl p-6 border border-[#EDEFF5] sticky top-24 h-fit animate-pulse">
                <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
        );
    }

    const { profile, email, _count } = myProfile;
    const displayName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || email;

    // Use centralised asset logic
    const assets = getProfileAssets(profile);
    const avatarSrc = previewAvatar || assets.avatar;
    const coverDest = previewCover || assets.cover;

    const description = profile?.description || 'Sin descripción';

    // Stats
    const stats = [
        { label: 'Eventos', value: _count?.events || 0 },
        { label: 'Seguidores', value: _count?.followers || 0 },
        { label: 'Seguidos', value: _count?.following || 0 },
    ];

    return (
        <div className="bg-white rounded-2xl border border-[#EDEFF5] overflow-hidden">
            {/* Cover Image */}
            <div className="relative h-24 w-full bg-gray-200">
                <img
                    src={coverDest}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex flex-col items-center text-center px-6 pb-6">
                <div className="-mt-10 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-sm mb-4 bg-[#F7F7F7] relative z-10">
                    <img
                        src={avatarSrc}
                        alt={displayName}
                        className="w-full h-full object-cover"
                    />
                </div>

                <h2 className="font-bold text-lg text-[#212121] mb-1">{displayName}</h2>
                <p className="text-xs text-[#666] mb-4 max-w-[200px] truncate">{email}</p>

                <p className="text-sm text-[#444] mb-6 line-clamp-3">
                    {description}
                </p>

                <div className="flex justify-between w-full mb-6 px-2">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <span className="font-bold text-[#212121] text-lg">{stat.value}</span>
                            <span className="text-xs text-[#999]">{stat.label}</span>
                        </div>
                    ))}
                </div>

                <div className="w-full space-y-3">
                    {myProfile.userType === 'COMPANY' && (
                        <Link
                            href="/perfil/crear-evento"
                            className="flex items-center justify-center gap-2 w-full bg-[#007FA4] text-white py-3 rounded-full font-bold text-sm shadow-md hover:bg-[#006080] transition-colors"
                        >
                            <Icon icon="solar:calendar-add-bold" width={20} />
                            Crear Evento
                        </Link>
                    )}



                    <Link
                        href={`/usuario/${myProfile.id}`}
                        className="flex items-center justify-center gap-2 w-full bg-[#DBEBF1] text-[#007FA4] py-2.5 rounded-full font-bold text-sm hover:bg-[#cfe6ef] transition-colors"
                    >
                        <Icon icon="solar:user-circle-bold" />
                        Ver perfil público
                    </Link>

                    <Link
                        href="/perfil/editar"
                        className="flex items-center justify-center gap-2 w-full bg-[#f0f2f5] text-[#212121] py-2.5 rounded-full font-bold text-sm hover:bg-[#e4e6eb] transition-colors"
                    >
                        <Icon icon="solar:pen-bold" />
                        Editar Perfil
                    </Link>
                </div>
            </div>

            <CreatePostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userAvatar={avatarSrc}
                userName={displayName}
            />
        </div>
    );
}
