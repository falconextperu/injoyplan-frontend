import { useState } from 'react';
import ReactModal from 'react-modal';
import { Icon } from '@iconify/react';
import Image from 'next/image';

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        borderRadius: '24px',
        border: 'none',
        padding: '0px',
        width: 'min(600px, 92vw)',
        maxHeight: '90vh',
        overflow: 'hidden',
        background: 'transparent',
        boxShadow: 'none'
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
    },
};

interface Props {
    isOpen: boolean;
    onClose: () => void;
    userAvatar?: string;
    userName?: string;
}

export default function CreatePostModal({ isOpen, onClose, userAvatar = '/svg/us.svg', userName = 'Usuario' }: Props) {
    const [text, setText] = useState('');

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={modalStyles}
            ariaHideApp={false}
        >
            <div className="bg-white rounded-[24px] overflow-hidden shadow-2xl animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[#EDEFF5]">
                    <h2 className="text-xl font-bold text-[#212121]">Crear publicación</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-[#F7F7F7] flex items-center justify-center text-[#666] hover:bg-[#EEE] transition-colors"
                    >
                        <Icon icon="solar:close-circle-bold" width={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-[#EDEFF5]">
                            <Image src={userAvatar} alt="User" width={48} height={48} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-[#212121] text-sm mb-1">{userName}</h3>
                            <div className="w-fit bg-[#F0F7FA] text-[#007FA4] text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer">
                                <Icon icon="solar:earth-bold" width={12} />
                                <span>Público</span>
                                <Icon icon="solar:alt-arrow-down-bold" width={10} />
                            </div>
                        </div>
                    </div>

                    <textarea
                        className="w-full h-32 resize-none text-lg text-[#212121] placeholder-[#999] outline-none"
                        placeholder="¿Qué estás pensando, Usuario?"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                    />

                    {/* Media Placeholder Area */}
                    <div className="rounded-xl border-2 border-dashed border-[#EDEFF5] bg-[#FAFBFF] h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-[#F2F5FF] hover:border-[#007FA4]/30 transition-all group">
                        <div className="w-14 h-14 rounded-full bg-[#E0F2F7] flex items-center justify-center text-[#007FA4] mb-3 group-hover:scale-110 transition-transform">
                            <Icon icon="solar:gallery-add-bold" width={28} />
                        </div>
                        <p className="font-bold text-[#444] text-sm">Agregar fotos o videos</p>
                        <p className="text-xs text-[#999] mt-1">o arrastra y suelta aquí</p>
                    </div>
                </div>

                {/* Footer/Actions */}
                <div className="p-5 border-t border-[#EDEFF5] bg-[#FAFBFF] flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <p className="text-xs font-bold text-[#666] mr-2">Agregar a tu post:</p>
                        <button className="w-9 h-9 rounded-full hover:bg-black/5 flex items-center justify-center text-[#00AA00] transition-colors" title="Foto/Video">
                            <Icon icon="solar:gallery-bold" width={24} />
                        </button>
                        <button className="w-9 h-9 rounded-full hover:bg-black/5 flex items-center justify-center text-[#007FA4] transition-colors" title="Etiquetar">
                            <Icon icon="solar:user-id-bold" width={24} />
                        </button>
                        <button className="w-9 h-9 rounded-full hover:bg-black/5 flex items-center justify-center text-[#F9CB28] transition-colors" title="Sentimiento">
                            <Icon icon="solar:emoji-funny-circle-bold" width={24} />
                        </button>
                        <button className="w-9 h-9 rounded-full hover:bg-black/5 flex items-center justify-center text-[#FF4D4D] transition-colors" title="Ubicación">
                            <Icon icon="solar:map-point-bold" width={24} />
                        </button>
                    </div>

                    <button
                        disabled={!text}
                        className={`px-8 py-2.5 rounded-full font-bold text-white transition-all transform active:scale-95 ${text
                                ? 'bg-gradient-to-r from-[#FF4D4D] to-[#F9CB28] shadow-md hover:shadow-lg'
                                : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        onClick={() => {
                            // Mock submit
                            alert("¡Publicado! (Simulado)");
                            onClose();
                            setText('');
                        }}
                    >
                        Publicar
                    </button>
                </div>
            </div>
        </ReactModal>
    );
}
