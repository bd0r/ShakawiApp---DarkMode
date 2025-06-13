import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../App'; // Import the useDarkMode hook
import { Switch } from '@headlessui/react'; // Import Switch component for the toggle
import {
  Link,
  useLocation
} from "react-router-dom";
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import html2canvas from 'html2canvas';


const logo = require('../navbar.png');

const navigation = [
  { name: 'الرئيسية', href: "/", current: false },
  { name: 'جدول المناوبين', href: "/shifts", current: false },
  { name: 'تخصيص الموقف', href: "/settings", current: false },
  { name: 'موقف الشكاوي', href: "/complaints", current: false },
  { name: 'موقف المغذيات', href: "/providers", current: false },
  { name: 'معاينة', href: "/report", current: false },
  { name: 'إدارة', href: "/admin", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function NavBar(/*{ onDownload }*/) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const location = useLocation();
  const [navItems, setNavItems] = useState(navigation);

  // const printDocument = () => {
  //   const input = document.getElementById("printme");
  //   //input.style.width = '1000px';
  //   //input.style.overflow = 'auto';
  //   html2canvas(input).then((canvas) => {
  //     // document.body.style.width = '1200px'; // Adjust the width as per your requirement
  //     // document.body.style.overflow = 'auto'; // Ensure overflow to avoid content cut-off
    
  //     const dataURL = canvas.toDataURL("image/png");
  //     //imgData.download = 'downloaded-image.jpg';
  //     var img = new Image();
  //     img.src = dataURL;
  //     img.download = dataURL;
  //     // Create a link element
  //     var a = document.createElement("a");
  //     a.innerHTML = "DOWNLOAD";
  //     a.target = "_blank";
  //     // Set the href of the link to the data URL of the image
  //     a.href = img.src;
  //     // Set the download attribute of the link
  //     a.download = "download";
  //     // Append the link to the page
  //     document.body.appendChild(a);
  //     // Click the link to trigger the download
  //     a.click();
  //   });
  // };

  const printDocument = () => {
    const input = document.getElementById("printme");
    html2canvas(input).then((canvas) => {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "downloaded-image.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, "image/png");
    })
  };

  

  useEffect(() => {
    const updatedNavItems = navItems.map(item => ({
      ...item,
      current: item.href === location.pathname
    }));
    setNavItems(updatedNavItems);
  }, [location.pathname]);

  const handleItemClick = (index) => {
    const updatedNavItems = navItems.map((item, i) => {
      item.current = i === index;
      return item;
    });
    setNavItems(updatedNavItems);
  };

  return (
    <Disclosure as="nav" className="bg-gray-100 dark:bg-gray-800 font-body" dir='rtl'>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-500 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center ml-4">
              <img alt="Shakawi App" src={logo} className="h-11 w-11" />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex items-center space-x-4"> {/* Added items-center for vertical alignment */}
              <div className="flex space-x-4">
                {navItems.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? 'bg-gray-300 dark:bg-gray-900 text-black dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium',
                    )}
                    onClick={() => handleItemClick(index)}>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          {/* Dark Mode Toggle Switch */}
          <div className="ml-3">
            <Switch
              checked={isDarkMode}
              onChange={toggleDarkMode}
              className={`${isDarkMode ? 'bg-indigo-600' : 'bg-gray-200'}
                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`${isDarkMode ? 'translate-x-0' : '-translate-x-6'}
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </div>
          {location.pathname === '/report' && (
            <button className="bg-blue-600 text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
              onClick={printDocument}>
              تنزيل الموقف
            </button>
          )}
          </div>
        </div>
      </div>
      </div>
      <DisclosurePanel className="sm:hidden">
        <div className={`space-y-1 px-2 pb-3 pt-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          {navItems.map((item, index) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              to={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-300 dark:bg-gray-900 text-black dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              )}
              onClick={() => handleItemClick(index)}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
        
      </DisclosurePanel>
    </Disclosure>
  );
}
