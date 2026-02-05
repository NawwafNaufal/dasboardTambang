import type React from "react";
import { Link } from "react-router";

interface DropdownItemProps {
  tag?: "a" | "button";
  to?: string;
  onClick?: () => void;
  onItemClick?: () => void;
  baseClassName?: string;
  className?: string;
  children: React.ReactNode;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  tag = "button",
  to,
  onClick,
  onItemClick,
  baseClassName = "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900",
  className = "",
  children,
}) => {
  const combinedClasses = `${baseClassName} ${className}`.trim();

  const handleClick = (event: React.MouseEvent) => {
<<<<<<< HEAD
    // ✅ PERBAIKAN: Panggil onClick DULU sebelum preventDefault
    if (onClick) onClick();
    if (onItemClick) onItemClick();
    
    // PreventDefault hanya jika diperlukan
    if (tag === "button") {
      event.preventDefault();
    }
=======
    if (tag === "button") {
      event.preventDefault();
    }
    if (onClick) onClick();
    if (onItemClick) onItemClick();
>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9
  };

  if (tag === "a" && to) {
    return (
      <Link to={to} className={combinedClasses} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
<<<<<<< HEAD
    <button type="button" onClick={handleClick} className={combinedClasses}>
      {children}
    </button>
  );
};
=======
    <button onClick={handleClick} className={combinedClasses}>
      {children}
    </button>
  );
};
>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9
