import React, { useEffect, useState } from 'react';
import styles from './date.module.css';
import { Icons } from '../Svg/iconsPack';
import Icon from '../Icon';
import useOutsideClick from '../../hooks/useOutsideClick';
import moment from 'moment';
import { motion } from 'framer-motion';
import Input from './../../components/Input';

export interface CalendarEvent {
    date: Date;
    description: string;
}

const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/;

export const DateTime = ({ events, text, onChange, name, right, left, disabled, top, withOutFormat }: any) => {

    const [writeDate, setWriteDate] = useState<string>("");
    // Allow selectedDate to be null initially if no value is passed
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isOpen, setIsOpen, ref] = useOutsideClick(false);

    const daysInMonth = (date: Date): number => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const firstDayOfMonth = (date: Date): number => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handleDateClick = (date: Date): void => {
        setWriteDate("Desde " + moment(date).format("DD/MM/YYYY"));
        setSelectedDate(date);
        setIsOpen(false);
    };

    const handleClickOutsideDate = (e: React.MouseEvent<HTMLDivElement>): void => {
        e.stopPropagation();
    };

    const getEventDescription = (date: Date): string | null => {
        const event = events?.find((e: any) => e.date.toDateString() === date.toDateString());
        return event ? event.description : null;
    };

    const getDisplayDate = () => {
        // Use a default date for rendering the calendar grid if selectedDate is null
        return selectedDate || new Date();
    }

    const renderDays = (): JSX.Element[] => {
        const displayDate = getDisplayDate();
        const days: JSX.Element[] = [];
        for (let i = 0; i < firstDayOfMonth(displayDate); i++) {
            days.push(<div key={`empty-${i}`} className={styles.empty}></div>);
        }
        for (let i = 1; i <= daysInMonth(displayDate); i++) {
            let date = new Date(displayDate.getFullYear(), displayDate.getMonth(), i);
            const eventDescription = getEventDescription(date);
            const classNames = [`${styles.day}`];
            if (date.toDateString() === new Date().toDateString()) {
                classNames.push(`${styles.today}`);
            }
            if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
                classNames.push(`${styles.selected}`);
            }
            if (eventDescription) {
                classNames.push(`${styles['has-event']}`);
            }
            days.push(
                <div key={`day-${i}`} className={classNames.join(' ')} onClick={() => handleDateClick(date)} title={eventDescription ? eventDescription : ''}>
                    {i}
                </div>
            );
        }
        return days;
    };

    const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const input = e.target.value;

        if (input.length > 10 || input.replace(dateRegex, '').length > 0) {
            return;
        }

        const dateMatch = input.match(dateRegex);

        if (dateMatch) {
            let [_, day, month, year] = dateMatch;
            if (parseInt(day) > 31 || parseInt(month) > 12) {
                return;
            }

            const formattedDate = `${day}/${month}/${year}`;
            setWriteDate(formattedDate);
        }
    };

    useEffect(() => {
        if (writeDate && writeDate != '' && writeDate.length === 10) {
            let date = moment(writeDate, "DD/MM/YYYY").toDate();
            setSelectedDate(date);
        }
    }, [writeDate]);

    useEffect(() => {
        // Only trigger onChange if selectedDate is actually set (not null)
        if (selectedDate) {
            if (withOutFormat) {
                onChange(selectedDate, name);
            } else {
                onChange(moment(selectedDate).format('DD/MM/YYYY'), name);
            }
        }
    }, [selectedDate]);

    return (
        <>
            <div ref={ref} className={styles.date} onClick={() => setIsOpen(!isOpen)}>
                <div className={disabled && styles.disabled}>
                    <div className={styles.icon__date} >
                        <Icon icon={Icons.calendar} />
                    </div>
                    <Input
                        disabled={disabled}
                        name={name}
                        isLabel
                        label={text}
                        type='text'
                        onChange={handleChangeDate}
                        // If no selectedDate, show "Desde hoy" or similar, but don't force a value if it's meant to be empty
                        value={writeDate ? writeDate : (selectedDate ? "Desde " + moment(selectedDate).format('DD/MM/YYYY') : "Desde hoy")}
                    />
                </div>
                {isOpen && (
                    <motion.div
                        animate={left ? { x: -155, y: 10 } : top ? { x: 0, y: -400 } : right ? { y: 40 } : { x: 0, y: 10 }}
                        initial={left ? { y: 10, x: 100 } : top ? { x: 0, y: -390 } : right ? { y: 20 } : { y: 40 }}
                    >
                        <div onClick={(e) => handleClickOutsideDate(e)}>
                            <div className={styles.header}>
                                <button type='reset' onClick={() => {
                                    const d = getDisplayDate();
                                    setSelectedDate(new Date(d.getFullYear(), d.getMonth() - 1, 1))
                                }}>
                                    <Icon icon={Icons.arrowLeft} />
                                </button>
                                <div className={styles.month}>{getDisplayDate().toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
                                <button type='reset' onClick={() => {
                                    const d = getDisplayDate();
                                    setSelectedDate(new Date(d.getFullYear(), d.getMonth() + 1, 1))
                                }}>
                                    <Icon icon={Icons.arrowRight} />
                                </button>
                            </div>
                            <div className={styles.days}>
                                <div className={styles['day-label']}>Dom</div>
                                <div className={styles['day-label']}>Lun</div>
                                <div className={styles['day-label']}>Mar</div>
                                <div className={styles['day-label']}>Mie</div>
                                <div className={styles['day-label']}>Jue</div>
                                <div className={styles['day-label']}>Vie</div>
                                <div className={styles['day-label']}>Sab</div>
                                {renderDays()}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </>
    );
};
