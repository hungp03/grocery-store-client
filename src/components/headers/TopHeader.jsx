import React, { memo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import path from "@/utils/path";
import { getCurrentUser } from "@/store/user/asyncActions";
import { useDispatch, useSelector } from 'react-redux'
import { Logout } from '@/components/index'
import Swal from "sweetalert2";
import { clearMessage } from "@/store/user/userSlice";

const TopHeader = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoggedIn, current, message } = useSelector(
        state => state.user
    )
    useEffect(() => {
        const setTimeoutId = setTimeout(() => {
            if (isLoggedIn) dispatch(getCurrentUser())
        }, 300);
        return () => {
            clearTimeout(setTimeoutId)
        }
    }, [dispatch, isLoggedIn])

    useEffect(() => {
        if (message)
            Swal.fire("Oops!", message, 'info').then(() => {
                dispatch(clearMessage())
                navigate(`/${path.LOGIN}`)
            })
    }, [message])

    return (
        <div className="w-full bg-main flex items-center justify-center">
            <div className="w-main h-10 flex items-center justify-between text-xs text-white">
                <a href={`${import.meta.env.VITE_BACKEND_TARGET}/swagger-ui/index.html`} target="_blank" rel="noopener noreferrer">
                    API docs
                </a>
                {!isLoggedIn || !current
                    ? <Link className=" hover:text-gray-700" to={`/${path.LOGIN}`}>Đăng nhập hoặc đăng ký</Link>
                    : <div className="flex items-center gap-2">
                        <span>{`Welcome, ${current?.name}`}</span>
                        <Logout />
                    </div>}
            </div>
        </div>
    );
};

export default memo(TopHeader);
