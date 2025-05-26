import React, { useState, useEffect } from 'react';
import { Banner, Sidebar, FeatureProduct } from '@/components';
import { useSelector} from 'react-redux';

const Home = () => {
    const { isLoggedIn } = useSelector(state => state.user);
    const [showRec, setShowRec] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            const timer = setTimeout(() => setShowRec(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [isLoggedIn]);

    return (
        <>
            <div className="container mx-auto px-4 pt-6">
                <div className="flex flex-col md:flex-row items-stretch gap-6">
                    <aside className="w-full md:w-1/4 flex-shrink-0">
                        <Sidebar />
                    </aside>
                    <main className="w-full md:w-3/4">
                        <Banner />
                    </main>
                </div>
            </div>

            <div className="w-full bg-gray-50 py-8">
                <div className="px-4 lg:px-24">
                    <FeatureProduct flag="new" />
                </div>
            </div>

            {showRec && (
                <div className="w-full bg-white py-8">
                    <div className="px-4 lg:px-24">
                        <FeatureProduct flag="recommendation" />
                    </div>
                </div>
            )}
        </>
    );
};

export default Home;
