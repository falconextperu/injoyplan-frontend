"use client";
import "./globals.css";
import Header from "./ui/Header";
import Footer from "./ui/Footer";
import { useEffect, useState } from "react";
import { IAuthState, useAuthStore } from "./zustand/auth";

export default function ClientLayout({ children }: { children: React.ReactNode }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { me } : IAuthState = useAuthStore();
    
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

    useEffect(() => {
        me();  // Llamas a la función `me` para obtener la información del usuario
    }, [me]);

    return (
        <div className={isModalOpen ? "blur-background pointer-events-none" : "overflow-hidden"}>
            <Header />
            {children}
            <Footer />
        </div>
    );
}