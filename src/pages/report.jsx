import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../App'; // Import the useDarkMode hook
import logo from '../logo.png';
import logoDark from '../logo dark.png';
//import { useToImage } from '@hcorta/react-to-image';
import { supabase } from '../backend/supabase';

export function Report(/*{ onDownload }*/) {
  const [shakawiData, setShakawiData] = useState([]);
  const [providersData, setProvidersData] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [color, setColor] = useState("");
  const [borderColor, setBorderColor] = useState("");
  const [h2Size, seth2Size] = useState("");
  const [date, setDate] = useState("");
  const { isDarkMode } = useDarkMode(); // Get dark mode state

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: shakawi, error: shakawiError } = await supabase.from('shakawi').select('*');
    if (shakawiError) {
      console.error('Error fetching shakawi data:', shakawiError);
      setShakawiData([
        { id: 0, all: 0, done: 0, not: 0 },
        { id: 1, all: 0, done: 0, not: 0 },
        { id: 2, all: 0, done: 0, not: 0 },
        { id: 3, all: 0, done: 0, not: 0 },
      ]);
    } else {
      setShakawiData(shakawi.sort((a, b) => a.id - b.id));
    }

    const { data: providers, error: providersError } = await supabase.from('providers').select('*');
    if (providersError) {
      console.error('Error fetching providers data:', providersError);
      setProvidersData([{}]);
    } else {
      setProvidersData(providers.sort((a, b) => a.id - b.id));
    }

    const { data: group, error: groupError } = await supabase.from('appsettings').select('*');
    if (groupError) {
      console.error('Error fetching settings data:', groupError);
    } else {
      setGroupName(group[0].group);
      setColor(group[0].color);
      setBorderColor(group[0].border);
      seth2Size(group[0].h2size);
      //alert(JSON.stringify(group[0].color));
    }

    const updateDateTime = () => {
      const date = new Date();
      const options = {
        weekday: 'long', // Day of the week in full name
        year: '2-digit', // Full year
        month: '2-digit', // Month with leading zero
        day: '2-digit', // Day with leading zero
        hour: '2-digit', // Hour with leading zero
        minute: '2-digit', // Minute with leading zero
        hour12: true, // Use 12-hour clock
        timeZone: 'Asia/Baghdad' // Set time zone for localization
      };


      const formatter = new Intl.DateTimeFormat('ar-EG', options);
      const formattedDate = formatter.format(date);

      // Replace AM/PM with Arabic equivalents
      const formattedDateWithArabicAMPM = formattedDate
        .replace('AM', 'ص')
        .replace('PM', 'م');

      setDate(formattedDateWithArabicAMPM);
    };
    updateDateTime();
  };


  const totalAll = shakawiData.reduce((sum, item) => sum + (item.all || 0), 0);
  const totalDone = shakawiData.reduce((sum, item) => sum + (item.done || 0), 0);
  const totalNot = shakawiData.reduce((sum, item) => sum + (item.not || 0), 0);

  return (
    <div className={`fixed-size-container ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
    <div className={`container p-4 font-body mb-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} /*ref={ref}*/ id="printme">
      <div className="flex justify-center items-center mx-4">
        <img src={isDarkMode ? logoDark : logo} alt="Logo" className="object-fill h-48 w-39" />
      </div>
      <div className="flex justify-between items-center mb-8">
        <div className={`border rounded-lg p-3 shadow-md text-white w-1/3 ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`} style={{backgroundColor: color}}>
          <h2 className={`text-center text-base ${isDarkMode ? 'text-gray-100' : 'text-white'}`}>{groupName}</h2>
        </div>
        <div className={`border rounded-lg p-3 shadow-md text-white w-1/3 ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`} style={{backgroundColor: color}}>
          <h2 className={`text-center text-base ${isDarkMode ? 'text-gray-100' : 'text-white'}`}>{date}</h2>
        </div>
      </div>
      <div className="mb-8">
        <h2 className={`text-center text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>موقف الشكاوي</h2>
        <table className={`table-auto w-full border-collapse text-center ${isDarkMode ? 'border-gray-700' : 'border-gray-800'}`} dir="rtl">
          <thead className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-white'}`} style={{backgroundColor: color}}>
            <tr>
              <th className={`p-2`} rowSpan="2">الصيانة</th>
              <th className={`p-2 text-center`} colSpan="3">عدد الشكاوي</th>
            </tr>
            <tr>
              <td className={`p-2 border ${isDarkMode ? 'border-gray-700' : 'border-gray-600'}`}>الكلي</td>
              <td className={`p-2 border ${isDarkMode ? 'border-gray-700' : 'border-gray-600'}`}>المنجزة</td>
              <td className={`p-2 border ${isDarkMode ? 'border-gray-700' : 'border-gray-600'}`}>الغير المنجزة</td>
            </tr>
          </thead>
          <tbody className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              {shakawiData.map((shakawi, index) => (
                  <tr key={index} className={`text-lg font-bold ${index % 2 === 0 ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-100') : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')}`}>
                      <td className={`p-1 border ${isDarkMode ? 'border-gray-700' : 'border-gray-600'}`}>صيانة {shakawi.name}</td>
                      <td className={`p-1 border ${isDarkMode ? 'border-gray-700' : 'border-gray-600'}`}>{shakawi.all}</td>
                      <td className={`p-1 border ${isDarkMode ? 'border-gray-700' : 'border-gray-600'}`}>{shakawi.done}</td>
                      <td className={`p-1 border ${isDarkMode ? 'border-gray-700' : 'border-gray-600'}`}>{shakawi.not}</td>
                  </tr>
              ))}
              {/* Total row */}
              <tr className={`font-bold text-lg ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <td className={`p-1 border ${isDarkMode ? 'border-gray-700' : 'border-gray-600'}`}>المجموع</td>
                  <td className={`p-1 border ${isDarkMode ? 'border-gray-700' : 'border-gray-600'}`}>{totalAll}</td>
                  <td className={`p-1 border ${isDarkMode ? 'border-gray-700' : 'border-gray-600'}`}>{totalDone}</td>
                  <td className={`p-1 border ${isDarkMode ? 'border-gray-700' : 'border-gray-600'}`}>{totalNot}</td>
              </tr>
          </tbody>
        </table>
      </div>
      { providersData.length > 0 && <div>
        <h2 className={`text-center text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>موقف المغذيات</h2>
        <table className={`table-auto w-full border-collapse ${isDarkMode ? 'border-gray-700' : 'border-gray-800'}`} dir="rtl">
          <thead>
            <tr className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-white'}`} style={{backgroundColor: color}}>
              <th className={`p-2 border ${isDarkMode ? 'border-gray-700' : 'border-gray-800'}`}>ت</th>
              <th className={`p-2 border ${isDarkMode ? 'border-gray-700' : 'border-gray-800'}`}>اسم الصيانة</th>
              <th className={`p-2 border ${isDarkMode ? 'border-gray-700' : 'border-gray-800'}`}>اسم المغذي</th>
              <th className={`p-2 border ${isDarkMode ? 'border-gray-700' : 'border-gray-800'}`}>وقت السقوط</th>
              <th className={`p-2 border ${isDarkMode ? 'border-gray-700' : 'border-gray-800'}`}>وقت العودة</th>
              <th className={`p-2 border ${isDarkMode ? 'border-gray-700' : 'border-gray-800'}`}>العارض</th>
            </tr>
          </thead>
          <tbody className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
            {providersData.map((provider, index) => (
              <tr key={index} className={`font-bold text-base ${index % 2 === 0 ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-100') : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')}`}>
              <td className={`p-2 border ${isDarkMode ? 'border-gray-700' : 'border-gray-800'}`}>{provider.order}</td>
              <td className={`p-2 border ${isDarkMode ? 'border-gray-700' : 'border-gray-800'}`}>{provider.sector}</td>
              <td className={`p-2 border ${isDarkMode ? 'border-gray-700' : 'border-gray-800'}`}>{provider.providerName}</td>
              <td className={`p-2 border ${isDarkMode ? 'border-gray-700' : 'border-gray-800'}`}>{provider.downT}</td>
              <td className={`p-2 border ${isDarkMode ? 'border-gray-700' : 'border-gray-800'}`}>{provider.upT}</td>
              <td className={`p-2 border ${isDarkMode ? 'border-gray-700' : 'border-gray-800'}`}>{provider.detail}</td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>}
  </div>
</div>
  );
}