"use client";
import "./globals.css";
import Header from "./ui/Header";
import Footer from "./ui/Footer";
import { useEffect, useState } from "react";

import Alert from "./components/Alert";
import CookieConsentBanner from "./components/CookieConsentBanner";

import { usePathname } from "next/navigation";

import { useAuthStore } from "./zustand/auth";
import { useFavoriteStore } from "./zustand/favorites";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { me, auth } = useAuthStore();
    const { getFavorites } = useFavoriteStore();

    // Initialize auth and favorites on app mount
    useEffect(() => {
        const initializeApp = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await me(); // Fetch current user
                } catch (error) {
                    console.error('Failed to initialize user:', error);
                }
            }
        };
        initializeApp();
    }, []);

    // Fetch favorites whenever auth user is available
    useEffect(() => {
        if (auth) {
            getFavorites();
        }
    }, [auth]);

    useEffect(() => {
        const checkModalClass = () => {
            const modalElements = document.getElementsByClassName("ReactModal__Body--open");
            setIsModalOpen(modalElements.length > 0);
        };

        checkModalClass();
        const observer = new MutationObserver(checkModalClass);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <div className={isModalOpen ? "blur-background" : "overflow-hidden"}>
                <Alert />
                {!isAdmin && <Header />}
                {children}
                {!isAdmin && <Footer />}
            </div>
            <CookieConsentBanner />
        </>
    );
}