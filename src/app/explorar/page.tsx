"use client";

import { useEffect, useState } from 'react';
import Auth from '@/app/ui/Auth';
import { useAuthStore } from '@/app/zustand/auth';
import { useProfileStore } from '@/app/zustand/profile';
import SidebarLeft from '@/app/ui/Profile/SidebarLeft';
import SidebarRight from '@/app/ui/Profile/SidebarRight';
import EventFeed from '@/app/ui/Profile/EventFeed';

export default function ExplorarPage() {
    const { auth, me, logout } = useAuthStore();
    const {
        myProfile,
        getMyProfile,
        isLoading,
    } = useProfileStore();

    const [openAuth, setOpenAuth] = useState(false);

    useEffect(() => {
        me();
        getMyProfile();
    }, []);

    if (!auth) {
        return (
            <div className="bg-[#F9FAFC] min-h-[90vh] flex items-center justify-center">
                <div className="max-w-md w-full px-5">
                    <div className="bg-white border border-[#EDEFF5] rounded-2xl p-8 shadow-sm text-center">
                        <h1 className="text-2xl font-bold text-[#212121]">Explorar</h1>
                        <p className="text-[#666] mt-2 mb-6">Inicia sesión para ver tu feed personalizado.</p>
                        <button
                            onClick={() => setOpenAuth(true)}
                            className="bg-[#007FA4] text-white font-bold px-8 py-3 rounded-full hover:bg-[#006080] transition-colors w-full"
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
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 ">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Left Sidebar - Navigation */}
                    <div className="hidden md:block md:col-span-3 lg:col-span-2 sticky top-24 self-start">
                        <SidebarLeft />
                    </div>

                    {/* Center - Main Feed */}
                    <div className="col-span-1 md:col-span-9 lg:col-span-7">
                        <EventFeed />
                    </div>

                    {/* Right Sidebar - Profile Info */}
                    <div className="hidden lg:block lg:col-span-3 sticky top-24 self-start">
                        <SidebarRight myProfile={myProfile} isLoading={isLoading} />
                    </div>

                </div>
            </div>

            <Auth openAuth={openAuth} setOpenAuth={setOpenAuth} />
        </div>
    );
}
