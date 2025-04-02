import React, { useState, useEffect } from 'react';
import { Banner, Sidebar, FeatureProduct } from "@/components";
import { useSelector } from 'react-redux';
import { ScaleLoader } from 'react-spinners';

const Home = () => {
    const { isLoggedIn } = useSelector(state => state.user);
    const [showRecommendation, setShowRecommendation] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoggedIn) {
            const timer = setTimeout(() => {
                setShowRecommendation(true);
                setLoading(false);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [isLoggedIn]);

    return (
        <>
            <div className="w-main flex mt-6">
                <div className="flex flex-col gap-5 w-[25%] flex-auto">
                    <Sidebar />
                </div>
                <div className="flex flex-col gap-5 pl-5 w-[75%] flex-auto">
                    <Banner />
                </div>
            </div>
            <div className="my-8">
                <FeatureProduct flag="new" />
            </div>

            {isLoggedIn && (
                <div className="my-8">
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <ScaleLoader color="#36d7b7" loading={loading} size={50} />
                        </div>
                    ) : (
                        <FeatureProduct flag="recommendation" />
                    )}
                </div>
            )}
        </>
    );
}

export default Home;
