import { useState, useEffect } from 'react';
import { supabase } from '../backend/supabase';
import { Navigate } from 'react-router-dom';

import { useDarkMode } from '../App'; // Import the useDarkMode hook

export default function AdminPage() {
  const [modalSettings, setModalSettings] = useState({
    title: '',
    text: '',
    imageUrl: '',
    isEnabled: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isDarkMode } = useDarkMode(); // Get dark mode state

  useEffect(() => {
    if (isAuthenticated) {
      fetchModalSettings();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'isniper20') {
      setIsAuthenticated(true);
      setMessage('');
    } else {
      setMessage('كلمة المرور غير صحيحة');
    }
  };

  const fetchModalSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('appsettings')
        .select('*')
        .eq('id', 0)
        .single();

      if (error) throw error;
      if (data) {
        console.log('Fetched modal state:', data.modal); // Debug log
        setModalSettings({
          title: data.modaltitle || '',
          text: data.modaltext || '',
          imageUrl: data.modalimg || '',
          isEnabled: data.modal === 'true' || data.modal === true
        });
      }
    } catch (error) {
      console.error('Error fetching modal settings:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validate inputs
    if (!modalSettings.title.trim() || !modalSettings.text.trim() || !modalSettings.imageUrl.trim()) {
      setMessage('جميع الحقول مطلوبة');
      setLoading(false);
      return;
    }

    // Validate image URL
    try {
      new URL(modalSettings.imageUrl);
    } catch (e) {
      setMessage('الرجاء إدخال رابط صورة صحيح');
      setLoading(false);
      return;
    }

    try {
      console.log('Saving modal state:', modalSettings.isEnabled); // Debug log
      // Always update the record with id=0
      const { error } = await supabase
        .from('appsettings')
        .update({
          modal: modalSettings.isEnabled ? 'true' : 'false', // Ensure consistent string format
          modaltitle: modalSettings.title,
          modaltext: modalSettings.text,
          modalimg: modalSettings.imageUrl
        })
        .eq('id', 0);

      if (error) throw error;
      
      setMessage('تم حفظ الإعدادات بنجاح!');
      await fetchModalSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('حدث خطأ أثناء حفظ الإعدادات. الرجاء المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setModalSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 font-body" dir='rtl'>
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">تسجيل الدخول للوحة التحكم</h1>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-3"
                  required
                />
              </div>
              {message && (
                <div className="text-red-500 dark:text-red-400 text-sm">{message}</div>
              )}
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                دخول
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} py-8 px-4 sm:px-6 lg:px-8 font-body`}>
      <div className="max-w-2xl mx-auto">
        <div className={`bg-white dark:bg-gray-800 shadow-md ${isDarkMode ? 'shadow-gray-700' : 'shadow-gray-600'} rounded-lg p-6`}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">إعدادات الإعلانات</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Modal Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={modalSettings.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-3"
                required
              />
            </div>
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Modal Text
              </label>
              <textarea
                id="text"
                name="text"
                rows={4}
                value={modalSettings.text}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-3"
                required
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={modalSettings.imageUrl}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-3"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isEnabled"
                name="isEnabled"
                checked={modalSettings.isEnabled}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="isEnabled" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                Enable Modal
              </label>
            </div>

            {message && (
              <div className={`p-4 rounded-md ${message.includes('Error') 
                ? (isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-50 text-red-700') 
                : (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-50 text-green-700')}`}>
                {message}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
