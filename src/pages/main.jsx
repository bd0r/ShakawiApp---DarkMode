import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../App'; // Import the useDarkMode hook
import banner from '../banner.jpg';
import { supabase } from '../backend/supabase';

export const MainPage = () => {

    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState([]);
    const whatsappNumber = '+9647702504331'; // Replace with your WhatsApp number
    const telegramUsername = 'i6d0r'; // Replace with your Telegram username
    const { isDarkMode } = useDarkMode(); // Get dark mode state

    const openWhatsAppChat = () => {
        const url = `https://wa.me/${whatsappNumber}`;
        window.open(url, '_blank');
    };

    const openTelegramChat = () => {
        const url = `https://t.me/${telegramUsername}`;
        window.open(url, '_blank');
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase.from('appsettings').select('*');
            if (error) {
                console.error('Error fetching data:', error);
            } else {
                console.log("the data:", data)
                setData(data);
                setShowModal(data[0].modal);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={`flex flex-col items-center p-4 md:p-8 font-body ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`} dir='rtl'>
            <div className={`relative flex flex-col mt-6 text-gray-700 dark:text-gray-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-md ${isDarkMode ? 'shadow-gray-700' : 'shadow-gray-600'} bg-clip-border w-96`}>
                <div
                    className={`relative h-56 mx-4 mt-2 overflow-hidden text-white shadow-lg bg-clip-border rounded-xl ${isDarkMode ? 'bg-blue-gray-700 shadow-blue-gray-700/40' : 'bg-blue-gray-500 shadow-blue-gray-500/40'}`}>
                    <img className='object-cover h-56'
                        src={banner}
                        alt="card-image" />
                </div>
                <div className="p-6">
                    <h5 className={`block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal ${isDarkMode ? 'text-blue-gray-100' : 'text-blue-gray-900'}`}>
                        تطبيق موقف الشكاوي والمغذيات في قطاع الكرخ المركز - وزارة الكهرباء
                    </h5>
                    <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit dark:text-gray-400">
                        تطبيق غير رسمي لتقديم موقف متابعة الشكاوي المغذيات لقطاع الكرخ المركز في وزارة الكهرباء، تم تطويره بواسطة المهندس بدرالدين سعدون.
                    </p>
                </div>
                <div className="p-6 pt-0">
                    <p className='my-2 dark:text-gray-400'>في حال وجود اي مشكلة يمكنك التواصل.</p>
                    <div className="flex space-x-4">
                        <button
                            onClick={openWhatsAppChat}
                            className="bg-green-500 text-white font-bold py-2 px-2 rounded-full hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                        >
                            Chat on WhatsApp
                        </button>
                        <div className='mx-3'></div>
                        <button
                            onClick={openTelegramChat}
                            className="bg-blue-500 text-white font-bold py-2 px-2 rounded-full hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                            Chat on Telegram
                        </button>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className={`p-4 rounded-lg relative w-96 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-2 font-bold dark:bg-red-600">✕</button>
                        <h5 className={`text-center mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal ${isDarkMode ? 'text-blue-gray-100' : 'text-blue-gray-900'}`}>
                            {data.length > 0 && data[0].modaltitle}
                        </h5>
                        {data.length > 0 && <img src={data[0].modalimg} alt="Modal" className="rounded-lg mx-auto" />}
                        <p className={`mt-2 text-center leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{data.length > 0 && data[0].modaltext}</p>

                    </div>
                </div>

            )}
        </div>
    );
};