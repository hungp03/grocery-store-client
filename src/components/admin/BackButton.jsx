import React from 'react'
import { IoChevronBack } from "react-icons/io5";
import { useNavigate} from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
function BackButton({ turnBackPage, header}) {
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();
    const handleTurnBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate(turnBackPage);
        }
    };
    return (
        <div>
            <div className="flex items-center text-2xl text-black hover:text-blue-800 mb-3">

                <div className="flex items-center cursor-pointer" onClick={handleTurnBack}>
                
                    <IoChevronBack className="mr-2" />{" "}

                    {header}
                </div>
            </div>
        </div>
    )
}

export default BackButton