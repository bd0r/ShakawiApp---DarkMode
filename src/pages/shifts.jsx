import React, { useState, useEffect } from 'react';
import { format, addDays, differenceInDays } from "date-fns";
import { ar } from "date-fns/locale";
import { useDarkMode } from '../App'; // Import the useDarkMode hook


const shifts = [
    "ياسر عبد القادر",
    "عمر حسين علي",
    "رعد خليل",
    "عثمان علي حماد",
];

const colors = {
    "ياسر عبد القادر": { light: "bg-blue-200", dark: "dark:bg-blue-700" },
    "عمر حسين علي": { light: "bg-green-200", dark: "dark:bg-green-700" },
    "رعد خليل": { light: "bg-yellow-200", dark: "dark:bg-yellow-700" },
    "عثمان علي حماد": { light: "bg-red-200", dark: "dark:bg-red-700" },
};

const startDate = new Date("2025-01-28"); // Fixed start date

export const ShiftsForm = () => {
    const { isDarkMode } = useDarkMode(); // Get dark mode state
    const [depth, setDepth] = useState(20);
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [dayName, setDayName] = useState('');
    const today = new Date();
    const daysSinceStart = differenceInDays(today, startDate);
    const schedule = Array.from({ length: depth }, (_, i) => {
        const date = addDays(today, i);
        const shiftIndex = (daysSinceStart + i) % shifts.length;
        const name = shifts[shiftIndex];
        return {
            name,
            date: format(date, "dd/MM/yyyy", { locale: ar }),
            day: format(date, "EEEE", { locale: ar }),
            color: colors[name],
        };
    });

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const options = { weekday: 'long' };
            const day = new Intl.DateTimeFormat('ar-EG', options).format(now);
            const date = now.toLocaleDateString("en-GB");
            const time = now.toLocaleTimeString();
            setDayName(day);
            setCurrentDate(date);
            setCurrentTime(time);
        };
        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000);
        return () => clearInterval(intervalId);
    }, []);


    return (
        <div className={`flex flex-col items-center p-4 md:p-8 font-body ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`} dir='rtl'>
            <div className={`w-full max-w-md p-2 rounded-2xl shadow-md mb-2 text-center mt-2 ${isDarkMode ? 'bg-gray-800 shadow-gray-700' : 'bg-white shadow-gray-600'}`}>
                <div className="p-4">
                    <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{dayName}</h2>
                    <p className={`mb-1 text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{currentDate}</p>
                    <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{currentTime}</p>
                </div>
            </div>
            <div className={`w-full max-w-md p-4 rounded-2xl shadow-md mb-4 text-center mt-4 ${isDarkMode ? 'bg-gray-800 shadow-gray-700' : 'bg-white shadow-gray-600'}`}>
                <p className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>جدول المناوبين</p>
                <div className={`border flex items-center justify-center space-x-4 p-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                    <p className={`text-base font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>عدد الأيام : </p>
                    <input
                        type="number"
                        value={depth}
                        onChange={(e) => setDepth(Number(e.target.value))}
                        className={`p-2 border rounded w-24 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 text-gray-700'}`}
                        placeholder="عدد الأيام"
                    />
                </div>

                <table className={`w-full border-collapse text-right ${isDarkMode ? 'border-gray-700' : 'border-gray-400'}`}>
                    <thead className={`${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-800'}`}>
                        <tr>
                            <th className={`border p-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}>اسم الوجبة</th>
                            <th className={`border p-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}>التاريخ</th>
                            <th className={`border p-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}>اليوم</th>
                        </tr>
                    </thead>
                    <tbody className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                        {schedule.map((item, index) => (
                            <tr key={index} className={`${isDarkMode ? colors[item.name].dark : colors[item.name].light}`}>
                                <td className={`border p-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}>{item.name}</td>
                                <td className={`border p-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}>{item.date}</td>
                                <td className={`border p-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}>{item.day}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};