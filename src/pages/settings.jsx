import React, { useState, useEffect } from 'react';
import { supabase } from '../backend/supabase';
import { useDarkMode } from '../App'; // Import the useDarkMode hook


export const FormComponent = () => {
    const [selectedValue, setSelectedValue] = useState('وجبة عثمان علي');
    const [color, setColor] = useState('');
    const [IsSaved, setIsSaved] = useState(false);
    const [msg, setMsg] = useState('');
    const { isDarkMode } = useDarkMode(); // Get dark mode state
  

    // Load saved data from localStorage on component mount
    useEffect(() => {
        const getSettings = async () => {
            const { data: group, error: groupError } = await supabase.from('appsettings').select('*');
            if (groupError) {
                console.error('Error fetching settings data:', groupError);
            } else {
                setSelectedValue(group[0].group);
                setColor(group[0].color);
            }
        }
        getSettings();
 
    }, []);

    const handleSave = async () => {
        const { data, error } = await supabase
            .from('appsettings')  // Update the correct table
            .update({ group: selectedValue, color: color })
            .eq('id', 0);  // Make sure to target the correct row
        
        if (error) {
            console.error('Error updating appsettings:', error);
        } else {
            setMsg("تم حفظ البيانات!");
            setIsSaved(true);
        }
    };
    

    const shakawiRemove = async () => {
        const { data, error } = await supabase
            .from('shakawi')
            .update({ all: 0, done: 0, not: 0 })
            .neq('id', -1);  // Ensures the update applies to all rows
    
        if (error) {
            console.error('Error updating data:', error);
        } else {
            console.log('Values updated successfully:', data);
            setMsg("تم تصفير جميع الشكاوي!");
            setIsSaved(true);
        }
    };
    

    const providersRemove = async () => {
        const { error } = await supabase
            .from('providers')
            .delete()
            .neq('id', -1); // Ensures all rows are deleted
    
        if (error) {
            console.error('Error deleting data:', error);
        } else {
            console.log("All providers deleted successfully!");
            setMsg("تم حذف جميع المغذيات!");
            setIsSaved(true);
        }
    };
    

    const removeAll = async () => {
        await shakawiRemove();
        await providersRemove();
        setSelectedValue('وجبة عثمان علي');
        setColor('#438fd6');

        const { data, error } = await supabase
            .from('appsettings')
            .update({ group: selectedValue, color: color });
    }

    return (
        <div className={`flex flex-col items-center p-4 md:p-8 font-body ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`} dir='rtl'>
            {IsSaved && <div className={`flex items-center p-4 mb-4 text-sm border rounded-lg ${isDarkMode ? 'text-green-400 border-green-800 bg-gray-800' : 'text-green-800 border-green-300 bg-green-50'}`} role="alert">
                <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <div>
                    <span className="font-medium">{msg}</span>
                </div>
            </div>}
            <div className={`w-full max-w-md p-4 rounded-2xl shadow-md mb-4 ${isDarkMode ? 'bg-gray-800 shadow-gray-700' : 'bg-white shadow-gray-600'}`}>
                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>تخصيص الموقف</h2>
                <div className={`max-w-sm mx-auto rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>أسماء الوجبات</label>
                    <select
                        value={selectedValue}
                        onChange={(e) => { setSelectedValue(e.target.value); setIsSaved(false) }}
                        className={`w-full border p-2 rounded-md ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300'}`}>
                        <option value="وجبة عثمان علي">وجبة عثمان علي</option>
                        <option value="وجبة ياسر عبدالقادر">وجبة ياسر عبدالقادر</option>
                        <option value="وجبة عمر حسين">وجبة عمر حسين</option>
                        <option value="وجبة رعد خليل">وجبة رعد خليل</option>
                    </select>
                </div>
                <div className="mb-4 mt-6">
                    <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>اختر لون الجداول في الموقف:</label>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => { setColor(e.target.value); setIsSaved(false) }}
                        className={`w-full h-10 border-none rounded-md ${isDarkMode ? 'bg-gray-700' : ''}`}
                    />
                </div>
                <button
                    onClick={handleSave}
                    className={`w-full text-white p-2 rounded-md transition duration-200 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}>
                    حفـظ
                </button>
            </div>
            <div className={`w-full max-w-md p-4 rounded-2xl shadow-md mb-4 ${isDarkMode ? 'bg-gray-800 shadow-gray-700' : 'bg-white shadow-gray-600'}`}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <button onClick={shakawiRemove} className={`text-white py-2 px-4 rounded transition duration-200 ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-700'}`}>حذف الشكاوى</button>
                    <button onClick={providersRemove} className={`text-white py-2 px-4 rounded transition duration-200 ${isDarkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-700'}`}>حذف المغذيات</button>
                </div>
                <div className="flex justify-center">
                    <button onClick={removeAll} className={`text-white py-2 w-full rounded transition duration-200 ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-700'}`}>حذف جميع البيانات</button>
                </div>
            </div>
        </div>
    );
};


/*
           <div className="w-full max-w-md bg-white p-4 rounded-2xl shadow-md shadow-gray-600 mb-4">
            <div className="max-w-sm mx-auto bg-white rounded-lg overflow-hidden">
                    <label className="block text-gray-700 mb-2">نوع الخط</label>
                    <select
                        value={selectedValue}
                        onChange={(e) => { setSelectedValue(e.target.value); setIsSaved(false) }}
                        className="w-full border border-gray-300 p-2 rounded-md">
                        <option value="وجبة عثمان علي">وجبة عثمان علي</option>
                        <option value="وجبة ياسر عبدالقادر">وجبة ياسر عبدالقادر</option>
                        <option value="وجبة عمر حسين">وجبة عمر حسين</option>
                        <option value="وجبة رعد خليل">وجبة رعد خليل</option>
                    </select>
                </div>
                <div className="max-w-sm py-5 mx-auto bg-white rounded-lg overflow-hidden">
                    <label className="block text-gray-700 mb-2">حجم الخط</label>
                    <select
                        value={selectedValue}
                        onChange={(e) => { setSelectedValue(e.target.value); setIsSaved(false) }}
                        className="w-full border border-gray-300 p-2 rounded-md">
                        <option value="وجبة عثمان علي"></option>
                        <option value="وجبة ياسر عبدالقادر"></option>
                        <option value="وجبة عمر حسين"></option>
                        <option value="وجبة رعد خليل"></option>
                    </select>
                </div>
                <div className="max-w-sm py-5 mx-auto bg-white rounded-lg overflow-hidden">
                    <label className="block text-gray-700 mb-2">حجم الخطوط للجدول</label>
                    <select
                        value={selectedValue}
                        onChange={(e) => { setSelectedValue(e.target.value); setIsSaved(false) }}
                        className="w-full border border-gray-300 p-2 rounded-md">
                        <option value="وجبة عثمان علي"></option>
                        <option value="وجبة ياسر عبدالقادر"></option>
                        <option value="وجبة عمر حسين"></option>
                        <option value="وجبة رعد خليل"></option>
                    </select>
                </div>
            </div>
            */