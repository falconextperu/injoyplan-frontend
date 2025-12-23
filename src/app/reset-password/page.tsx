"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { useAuthStore } from "@/app/zustand/auth";
import { Icon } from "@iconify/react";
import Image from "next/image";
import logo from "../../../public/svg/logo.svg";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const { resetPassword } = useAuthStore();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!token) {
            setError("Token inválido o faltante");
            return;
        }

        if (newPassword.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        if (!/(?=.*[a-z])/.test(newPassword)) {
            setError("La contraseña debe incluir al menos una letra minúscula.");
            return;
        }

        if (!/(?=.*[A-Z])/.test(newPassword)) {
            setError("La contraseña debe incluir al menos una letra mayúscula.");
            return;
        }

        if (!/(?=.*\d)/.test(newPassword)) {
            setError("La contraseña debe incluir al menos un número.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setIsLoading(true);
        const result = await resetPassword({ token, newPassword });
        setIsLoading(false);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                router.push("/");
            }, 3000);
        } else {
            setError(result.message || "Error al restablecer la contraseña");
        }
    };

    if (!token) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                    <Icon icon="solar:danger-circle-bold" width={24} />
                    <p>Enlace inválido o expirado. Por favor solicita uno nuevo.</p>
                </div>
                <button
                    onClick={() => router.push("/")}
                    className="mt-4 text-[#007FA4] font-bold hover:underline"
                >
                    Volver al inicio
                </button>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon icon="solar:check-circle-bold" className="text-green-500 text-5xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#212121] mb-2">¡Contraseña restablecida!</h2>
                    <p className="text-gray-500 mb-6">
                        Tu contraseña ha sido actualizada correctamente. Serás redirigido al inicio en unos segundos.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full bg-[#277FA4] hover:bg-[#206a8a] text-white font-bold py-3.5 rounded-full transition-all"
                    >
                        Ir al inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-xl">
                <div className="flex justify-center mb-6">
                    <Image src={logo} alt="Injoyplan" width={50} height={50} />
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[#212121] mb-2">Nueva Contraseña</h1>
                    <p className="text-gray-500 text-sm">Ingresa tu nueva contraseña segura.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center gap-2">
                            <Icon icon="solar:danger-circle-bold" width={20} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Nueva contraseña</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007FA4] focus:ring-1 focus:ring-[#007FA4] transition-all"
                            placeholder="••••••••"
                            required
                            minLength={8}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Confirmar contraseña</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007FA4] focus:ring-1 focus:ring-[#007FA4] transition-all"
                            placeholder="••••••••"
                            required
                            minLength={8}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-[#277FA4] text-white font-bold py-3.5 rounded-full shadow-md hover:shadow-lg transition-all transform active:scale-95 text-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#206a8a]'
                            }`}
                    >
                        {isLoading ? 'Actualizando...' : 'Restablecer contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
