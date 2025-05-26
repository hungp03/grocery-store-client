import React from 'react';
import { NavLink } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import category_default from '@/assets/category_default.png';
import { useSelector } from 'react-redux';

const Sidebar = () => {
    const { categories } = useSelector(state => state.app);
    const loading = !categories;
    return (
        <div
            className="
        border rounded-lg
        h-auto overflow-visible
        md:h-[400px] md:overflow-y-auto
      "
        >
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <SyncLoader color="#36d7b7" size={8} />
                </div>
            ) : (
                categories.map(cat => (
                    <NavLink
                        key={cat.slug}
                        to={`/products/${cat.slug}`}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 text-sm ${isActive ? 'bg-main text-white' : 'hover:bg-gray-100'
                            }`
                        }
                    >
                        <img
                            src={cat.imageUrl || category_default}
                            alt={cat.name}
                            className="w-5 h-5 object-cover flex-shrink-0"
                        />
                        <span>{cat.name}</span>
                    </NavLink>
                ))
            )}
        </div>
    );
};

export default Sidebar;




