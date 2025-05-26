import React from 'react';
import { navigation } from '@/utils/constants';
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <div className="w-full bg-white">
      <div className="px-4 md:px-0 md:w-main md:mx-auto">
        <nav
          className="
            flex 
            overflow-x-auto 
            whitespace-nowrap 
            no-scrollbar 
            h-[48px] 
            items-center 
            border-y 
            text-sm
          "
        >
          {navigation.map((e, idx) => (
            <NavLink
              key={e.id}
              to={e.path}
              className={({ isActive }) => [
                'flex-shrink-0',
                'py-2',
                idx === 0 ? 'pl-0 pr-8' : 'px-8',
                isActive
                  ? 'text-main font-semibold'
                  : 'text-gray-700 hover:text-main'
              ].join(' ')}
            >
              {e.value}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;