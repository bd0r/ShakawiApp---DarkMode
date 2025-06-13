import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../App'; // Import the useDarkMode hook
import { supabase } from '../backend/supabase';

export function Providers() {
  const initialInputState = {
    sector: '',
    providerName: '',
    downT: '',
    upT: '',
    detail: '',
  };

  const [inputs, setInputs] = useState(initialInputState);
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [alert, setAlert] = useState(false);
  const { isDarkMode } = useDarkMode(); // Get dark mode state

  // Load data from Supabase when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('providers').select('*').order('order', { ascending: true });
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setData(data);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleAdd = async () => {
    if (inputs.sector === '') {
      setAlert(true);
      return;
    }

    const newOrder = data.length ? data[data.length - 1].order + 1 : 1;
    const newData = { ...inputs, order: newOrder };

    const { data: insertedData, error } = await supabase
      .from('providers')
      .insert([newData])
      .select('*');

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      setData([...data, ...insertedData]);
      setInputs(initialInputState);
    }
  };

  const handleEdit = (index) => {
    setIsEditing(true);
    setCurrentIndex(index);
    setInputs(data[index]);
  };

  const handleSave = async () => {
    const updatedItem = { ...inputs };
    const { error } = await supabase
      .from('providers')
      .update(updatedItem)
      .eq('id', updatedItem.id);

    if (error) {
      console.error('Error updating data:', error);
    } else {
      const updatedData = data.map((item, index) =>
        index === currentIndex ? updatedItem : item
      );
      setData(updatedData);
      setIsEditing(false);
      setInputs(initialInputState);
    }
  };

  const handleRemove = async (index) => {
    const idToRemove = data[index].id;
    const { error } = await supabase
      .from('providers')
      .delete()
      .eq('id', idToRemove);

    if (error) {
      console.error('Error deleting data:', error);
    } else {
      const filteredData = data.filter((_, i) => i !== index);
      const updatedData = filteredData.map((item, i) => ({ ...item, order: i + 1 }));

      for (const item of updatedData) {
        await supabase
          .from('providers')
          .update({ order: item.order })
          .eq('id', item.id);
      }

      setData(updatedData);
    }
  };

  const handleInputChange = (e) => {
    setAlert(false);
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  return (
    <div className={`container mx-auto p-4 font-body ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`} dir="rtl">
      {alert && (
        <div className={`border px-4 py-3 rounded relative ${isDarkMode ? 'bg-red-900 border-red-700 text-red-300' : 'bg-red-100 border-red-400 text-red-700'}`} role="alert">
          <strong className="font-bold ml-3">خطأ</strong>
          <span className="block sm:inline">يرجى تحديد الصيانة!</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3"></span>
        </div>
      )}
    <div className={`w-full p-4 rounded-2xl shadow-md mb-4 ${isDarkMode ? 'bg-gray-800 shadow-gray-700' : 'bg-white shadow-gray-600'}`}>
      <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">ادخال وتعديل المغذيات</h2>
      <div className="input-group space-y-4 mb-8">
        <div>
          <select
            name="sector"
            value={inputs.sector}
            onChange={handleInputChange}
            className="block w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
            <option value="">تحديد الصيانة</option>
            <option value="اليرموك">اليرموك</option>
            <option value="العامرية والخضراء">العامرية والخضراء</option>
            <option value="الجامعة">الجامعة</option>
            <option value="المنصور">المنصور</option>
          </select>
        </div>

        <input
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          type="text"
          name="providerName"
          placeholder="اسم المغذي"
          value={inputs.providerName}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          type="text"
          name="downT"
          placeholder="وقت السقوط"
          value={inputs.downT}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          type="text"
          name="upT"
          placeholder="وقت العودة"
          value={inputs.upT}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          type="text"
          name="detail"
          placeholder="العارض"
          value={inputs.detail}
          onChange={handleChange} />
        <button
          className="w-full p-2 bg-blue-500 text-white rounded dark:bg-blue-600 dark:hover:bg-blue-700"
          onClick={isEditing ? handleSave : handleAdd}>
          {isEditing ? 'حفظ التعديل' : 'إضــافـة'}
        </button>
      </div>
      </div>
      <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">المغذيات الحالية المدخلة</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 dark:text-gray-100">
              <th className="p-2 border dark:border-gray-600">ت</th>
              <th className="p-2 border dark:border-gray-600">اسم الصيانة</th>
              <th className="p-2 border dark:border-gray-600">أسم المغذي</th>
              <th className="p-2 border dark:border-gray-600">وقت السقوط</th>
              <th className="p-2 border dark:border-gray-600">وقت العودة</th>
              <th className="p-2 border dark:border-gray-600">العارض</th>
              <th className="p-2 border dark:border-gray-600">الخيارات</th>
            </tr>
          </thead>
          <tbody className="dark:text-gray-300">
            {data.map((item, index) => (
              <tr key={index} className={`text-center ${index % 2 === 0 ? (isDarkMode ? 'bg-gray-800' : 'bg-gray-100') : (isDarkMode ? 'bg-gray-700' : 'bg-white')}`}>
                <td className="p-2 border dark:border-gray-600">{index + 1}</td>
                <td className="p-2 border dark:border-gray-600">{item.sector}</td>
                <td className="p-2 border dark:border-gray-600">{item.providerName}</td>
                <td className="p-2 border dark:border-gray-600">{item.downT}</td>
                <td className="p-2 border dark:border-gray-600">{item.upT}</td>
                <td className="p-2 border dark:border-gray-600">{item.detail}</td>
                <td className="p-2 border dark:border-gray-600">
                  <button
                    className="bg-yellow-500 text-white p-1 rounded mr-2 dark mr-2:bg-yellow-600 dark:hover:bg-yellow-700 ml-3 px-3"
                    onClick={() => handleEdit(index)}
                  >
                    تعديل
                  </button>
                  <button
                    className="bg-red-500 text-white p-1 rounded dark:bg-red-600 dark:hover:bg-red-700 px-3"
                    onClick={() => handleRemove(index)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
