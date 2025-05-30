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
           <div className="w-full flex justify-center px-4 pt-6">
                <div className="w-full max-w-screen-xl lg:w-main">
                    <div className="flex flex-col md:flex-row items-stretch gap-6">
                        <aside className="md:w-1/4 flex-shrink-0">
                            <Sidebar />
                        </aside>
                        <main className="md:w-3/4">
                            <Banner />
                        </main>
                    </div>
                </div>
            </div>

          <div className="w-full bg-gray-50 py-8">
                <div className="w-full flex justify-center px-4">
                    <div className="w-full max-w-screen-xl lg:w-main">
                        <FeatureProduct flag="new" />
                    </div>
                </div>
            </div>

            {showRec && (
                <div className="w-full bg-white py-8">
                    <div className="w-full flex justify-center px-4">
                        <div className="w-full max-w-screen-xl lg:w-main">
                            <FeatureProduct flag="recommendation" />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Home;