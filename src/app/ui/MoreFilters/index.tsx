import React, { useEffect, useState } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface FilterState {
    timeRange: string; // "all", "morning", "afternoon", "night"
    esGratis: boolean;
    enCurso: boolean;
}

interface Props {
    onApply: (data: { horaInicio?: string; horaFin?: string; esGratis: boolean; enCurso: boolean }) => void;
}

const MoreFilters = ({ onApply }: Props) => {
    const [isOpen, setIsOpen, ref] = useOutsideClick(false);

    // Internal state
    const [timeRange, setTimeRange] = useState<string>("all");
    const [esGratis, setEsGratis] = useState<boolean>(false);
    const [enCurso, setEnCurso] = useState<boolean>(false);
    const [isTimeOpen, setIsTimeOpen] = useState(false);

    const timeOptions = [
        { value: "all", label: "Cualquier hora", start: "", end: "" },
        { value: "morning", label: "Mañana (06:00 - 12:00)", start: "06:00", end: "12:00" },
        { value: "afternoon", label: "Tarde (12:00 - 18:00)", start: "12:00", end: "18:00" },
        { value: "night", label: "Noche (18:00 - 06:00)", start: "18:00", end: "06:00" },
    ];

    const handleApply = () => {
        const selectedTime = timeOptions.find(t => t.value === timeRange);

        onApply({
            horaInicio: selectedTime?.start,
            horaFin: selectedTime?.end,
            esGratis,
            enCurso
        });
        setIsOpen(false);
    };

    const selectedLabel = timeOptions.find(t => t.value === timeRange)?.label || "Cualquier hora";

    return (
        <div ref={ref} className="relative z-20">
            <div
                className="cursor-pointer text-[#007FA4] font-bold flex items-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                Mas filtros...
            </div>

            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    // @ts-ignore
                    className="absolute top-10 left-0 bg-white shadow-xl rounded-xl p-4 w-[300px] border border-gray-100"
                >
                    {/* Time Filter */}
                    <div className="mb-4 relative">
                        <div
                            className="bg-gray-100 p-3 rounded-lg flex justify-between items-center cursor-pointer"
                            onClick={() => setIsTimeOpen(!isTimeOpen)}
                        >
                            <span className="text-gray-700 font-medium text-sm truncate">{selectedLabel}</span>
                            <Icon icon={isTimeOpen ? "ei:chevron-up" : "ei:chevron-down"} width={24} />
                        </div>

                        {isTimeOpen && (
                            <div className="absolute top-full text-black left-0 w-full bg-white shadow-lg rounded-lg mt-1 z-30 border border-gray-100">
                                {timeOptions.map((opt) => (
                                    <div
                                        key={opt.value}
                                        className={`p-3 hover:bg-gray-50 cursor-pointer text-sm ${timeRange === opt.value ? 'font-bold text-[#007FA4]' : 'text-gray-600'}`}
                                        onClick={() => {
                                            setTimeRange(opt.value);
                                            setIsTimeOpen(false);
                                        }}
                                    >
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-3 mb-6">
                        {/* 
                        <div
                            className="bg-gray-100 p-3 rounded-lg flex justify-between items-center cursor-pointer"
                            onClick={() => setEnCurso(!enCurso)}
                        >
                            <span className="text-gray-700 font-medium text-sm">En curso</span>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${enCurso ? 'bg-[#007FA4] border-[#007FA4]' : 'bg-white border-gray-300'}`}>
                                {enCurso && <Icon icon="ei:check" className="text-white" width={18} />}
                            </div>
                        </div> 
                        */}

                        <div
                            className="bg-gray-100 p-3 rounded-lg flex justify-between items-center cursor-pointer"
                            onClick={() => setEsGratis(!esGratis)}
                        >
                            <span className="text-gray-700 font-medium text-sm">Gratis</span>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${esGratis ? 'bg-[#007FA4] border-[#007FA4]' : 'bg-white border-gray-300'}`}>
                                {esGratis && <Icon icon="ei:check" className="text-white" width={18} />}
                            </div>
                        </div>
                    </div>

                    {/* Apply Button */}
                    <button
                        onClick={handleApply}
                        className="w-full bg-[#007FA4] text-white font-bold py-3 rounded-full hover:bg-[#006a8a] transition-colors"
                    >
                        APLICAR
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default MoreFilters;
