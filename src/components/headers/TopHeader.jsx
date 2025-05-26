import React, { memo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import path from "@/utils/path";
import { getCurrentUser } from "@/store/user/asyncActions";
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from '@/components/index';
import Swal from "sweetalert2";
import { clearMessage } from "@/store/user/userSlice";
import { ClipLoader } from "react-spinners";

const TopHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { isLoggedIn, current, message } = useSelector(state => state.user);

    useEffect(() => {
        if (!isLoggedIn) return;

        setLoading(true);
        dispatch(getCurrentUser())
            .unwrap()
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [dispatch, isLoggedIn]);

    useEffect(() => {
        if (message) {
            Swal.fire("Oops!", message, 'info').then(() => {
                dispatch(clearMessage());
                navigate(`/${path.LOGIN}`);
            });
        }
    }, [message, dispatch, navigate]);

    return (
        <div className="w-full bg-main flex items-center justify-center">
            <div className="w-main h-10 flex items-center justify-between text-xs text-white px-4 md:px-0">
                <a
                    href={`${import.meta.env.VITE_BACKEND_TARGET}/swagger-ui/index.html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:block"
                >
                    API docs
                </a>

                {(!isLoggedIn || !current) ? (
                    <Link
                        className="hover:text-gray-700 text-center"
                        to={`/${path.LOGIN}`}
                    >
                        Đăng nhập hoặc đăng ký
                    </Link>
                ) : (
                    loading ? (
                        <ClipLoader size={20} color="#ffffff" />
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="hidden sm:block">{`Xin chào, ${current.name}`}</span>
                            <span className="sm:hidden">Xin chào</span>
                            <Logout />
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default memo(TopHeader);
