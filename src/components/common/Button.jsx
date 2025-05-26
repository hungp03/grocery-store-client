import React from "react";

const Button = ({
  children,
  handleOnClick,
  className = "",
  fw = false,
  type = "button",
}) => {
  // fw=true ⇒ full width; fw=false ⇒ fit nội dung
  const widthClass = fw ? "w-full" : "w-fit";

  return (
    <button
      type={type}
      className={`
         px-4 py-2
         rounded-md
         text-white bg-main
         font-semibold my-2
         ${widthClass}
         ${className}
       `}
      onClick={handleOnClick}
    >
      {children}
    </button>
  );
};

export default Button;