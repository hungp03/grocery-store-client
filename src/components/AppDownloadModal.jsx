import React, { useState, useEffect } from 'react';
import { FaTimes, FaAndroid } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const AppDownloadModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const checkConditions = () => {
            const currentWidth = window.innerWidth;
            const isMobile = currentWidth <= 768;
            const isAdminPath = location.pathname.includes('admin');
            // Check if the user is and on a non-admin path
            setIsVisible(isMobile && !isAdminPath);
        };

        checkConditions();

        window.addEventListener('resize', checkConditions);

        return () => {
            window.removeEventListener('resize', checkConditions);
        };
    }, [location.pathname]); 

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    className="fixed bottom-0 left-0 right-0 bg-white shadow-xl z-50 p-4 border-t"
                >
                    <div className="max-w-screen-xl mx-auto">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <FaAndroid className="text-[#10B981] text-2xl" />
                                <h3 className="font-semibold text-lg">Tải ứng dụng Android</h3>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Trải nghiệm giao diện tối ưu hơn với ứng dụng di động của chúng tôi cho màn hình nhỏ. Tải ngay!
                        </p>
                        <div className="flex justify-center">
                            <a
                                href="https://play.google.com/store"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#10B981] text-white px-6 py-2 rounded-full hover:bg-[#0D9668] transition-colors"
                            >
                                Tải ngay
                            </a>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AppDownloadModal;