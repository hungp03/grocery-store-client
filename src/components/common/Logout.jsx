import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/store/user/userSlice";
import { apiLogout } from "@/apis";
import icons from "@/utils/icons";
import { useNavigate } from "react-router-dom";
import path from "@/utils/path";
import clsx from "clsx";
import ClipLoader from "react-spinners/ClipLoader";

const { IoLogOutOutline } = icons;

const Logout = ({ text = "" }) => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await apiLogout();
      dispatch(logout());
      nav(`/${path.HOME}`);
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={clsx(
        "flex items-center gap-1 p-2",
        isLoading && "opacity-50 cursor-not-allowed",
        text === ""
          ? "rounded-full hover:bg-slate-200 hover:text-main"
          : "w-full hover:bg-sky-100"
      )}
    >
      {text}
      {isLoading ? (
        <ClipLoader size={18} />
      ) : (
        <IoLogOutOutline size={18} />
      )}
    </button>
  );
};

export default Logout;
