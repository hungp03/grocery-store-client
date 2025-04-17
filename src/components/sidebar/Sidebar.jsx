import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import category_default from "@/assets/category_default.png";
const Sidebar = () => {
    const categories = useSelector((state) => state.app.categories);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (categories !== undefined && categories !== null) {
            setLoading(false);
        }
    }, [categories]);
    
    return (
        <div className="flex flex-col border h-[400px] overflow-y-auto relative">
            {loading ? (
                <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center min-h-[50vh] z-10">
                    <SyncLoader color="#36d7b7" loading={loading} size={15} />
                </div>
            ) : (
                categories?.map((e) => (
                    <NavLink
                        key={e.slug}
                        to={`products/${e.slug}`}
                        className={({ isActive }) =>
                            isActive
                                ? "bg-main text-sm px-5 pt-[15px] pb-[14px] hover:text-main"
                                : "text-sm px-5 pt-[15px] pb-[14px] hover:text-main"
                        }>
                        <div className="flex items-center gap-2">
                            <img
                                src={
                                    e?.imageUrl
                                    || category_default
                                }
                                alt={e.name}
                                className="w-5 h-5 object-cover"
                            />
                            {e.name}
                        </div>
                    </NavLink>
                ))
            )}
        </div>
    );
}


export default Sidebar