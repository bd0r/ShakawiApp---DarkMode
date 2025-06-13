import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { supabase } from '../backend/supabase';
import { useDarkMode } from '../App'; // Import the useDarkMode hook

export const ShakawiForm = () => {
    const navigate = useNavigate();
    const [IsSaved, setIsSaved] = useState(false);
    const [data, setData] = useState([]);
    const inputRefs = useRef([]);
    const { isDarkMode } = useDarkMode(); // Get dark mode state

    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        const { data, error } = await supabase.from('shakawi').select('*');
        if (error) {
            console.error('Error fetching data:', error);
        } else {
            setData(data.sort((a, b) => a.id - b.id));
        }
    };

    const handleInputChange = (e, groupIndex, inputKey) => {
        setIsSaved(false);
        const { value } = e.target;
        const newData = [...data];
        newData[groupIndex][inputKey] = Number(value);
        if (inputKey === 'all' || inputKey === 'done') {
            newData[groupIndex]['not'] = newData[groupIndex]['all'] - newData[groupIndex]['done'];
        }
        setData(newData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Update the shakawi table
        const { error } = await supabase
            .from('shakawi')
            .upsert(data);

        if (error) {
            console.error('Error updating data:', error);
        } else {
            console.log('Data updated successfully');
            fetchData();
            //backToTop();
            navigate('/providers')
        }
    };

    const handleFocus = (index) => {
        inputRefs.current[index].select();
    };

    return (
        <div className={`flex flex-col items-center p-4 md:p-8 font-body ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`} dir='rtl'>
            {IsSaved && <div className={`flex items-center p-4 mb-4 text-sm border rounded-lg ${isDarkMode ? 'text-green-400 border-green-800 bg-gray-800' : 'text-green-800 border-green-300 bg-green-50'}`} role="alert">
                <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <div>
                    <span className="font-medium">تم حفظ البيانات!</span>
                </div>
            </div>}
            <div className={`w-full max-w-md shadow-md rounded-lg p-6 mb-4 ${isDarkMode ? 'bg-gray-800 shadow-gray-700' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>موقف اعداد الشكاوي</h2>
            <form onSubmit={handleSubmit}>
                {data.map((group, index) => (
                    <div key={index} className="mb-4">
                        <h2 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>صيانة {group.name}</h2>
                        <div className="flex flex-col space-y-2">
                            <label className={`block mb-2 text-sm font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-400'}`}>العدد الكلي</label>
                            <input
                                ref={(el) => inputRefs.current[index * 3] = el}
                                onFocus={() => handleFocus(index * 3)}
                                type="number"
                                value={group['all']}
                                onChange={(e) => handleInputChange(e, index, 'all')}
                                className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 text-gray-700'}`}
                                placeholder={"0"}
                            />
                            <label className={`block mb-2 text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-500'}`}>العدد المنجز</label>
                            <input
                                ref={(el) => inputRefs.current[index * 3 + 1] = el}
                                onFocus={() => handleFocus(index * 3 + 1)}
                                type="number"
                                value={group['done']}
                                onChange={(e) => handleInputChange(e, index, 'done')}
                                className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 text-gray-700'}`}
                                placeholder={"0"}
                            />
                            <label className={`block mb-2 text-sm font-bold ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>العدد الغير المنجز</label>
                            <input
                                ref={(el) => inputRefs.current[index * 3 + 2] = el}
                                onFocus={() => handleFocus(index * 3 + 2)}
                                type="number"
                                value={group['not']}
                                onChange={(e) => handleInputChange(e, index, 'not')}
                                className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 text-gray-700'}`}
                                placeholder={"0"}
                                disabled={true}
                            />
                        </div>
                    </div>
                ))}
                <div className='flex flex-col space-y-2'>
                    <button
                        type="submit"
                        className={`p-2 text-white rounded hover:bg-blue-700 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-800' : 'bg-blue-500 hover:bg-blue-700'}`}
                    >
                        حفــظ
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
};
