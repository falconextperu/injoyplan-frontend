"use client";

import { Icon } from '@iconify/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/zustand/auth';

export default function SidebarLeft() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuthStore();

    const menuItems = [
        { icon: 'solar:home-smile-bold', label: 'Inicio', href: '/explorar' },
        { icon: 'solar:chat-round-dots-bold', label: 'Mensajes', href: '/mensajes' },
        { icon: 'solar:bookmark-circle-bold', label: 'Guardados', href: '/guardados' },
        { icon: 'solar:settings-bold', label: 'Configuración', href: '/perfil/editar' },
    ];

    const isActive = (href: string) => {
        if (href === '/explorar') return pathname === '/explorar';
        return pathname?.startsWith(href);
    }

    const onLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
        logout();
        router.push('/');
    }

    return (
        <div className="bg-white rounded-2xl p-6 border border-[#EDEFF5] hidden md:block">
            <nav className="flex flex-col gap-6">
                {menuItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className={
                            isActive(item.href)
                                ? 'flex items-center gap-4 text-[#007FA4] transition-colors group'
                                : 'flex items-center gap-4 text-[#666] hover:text-[#007FA4] transition-colors group'
                        }
                    >
                        <Icon
                            icon={item.icon}
                            width={24}
                            className={
                                isActive(item.href)
                                    ? 'text-[#007FA4] transition-colors'
                                    : 'text-[#999] group-hover:text-[#007FA4] transition-colors'
                            }
                        />
                        <span className="font-bold text-sm">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="mt-10 pt-6 border-t border-[#EDEFF5]">
                <button
                    onClick={onLogout}
                    className="flex items-center gap-4 text-[#FF4D4D] hover:text-[#D93636] transition-colors w-full"
                >
                    <Icon icon="solar:logout-2-bold" width={24} />
                    <span className="font-bold text-sm">Cerrar Sesión</span>
                </button>
            </div>
        </div>
    );
}
