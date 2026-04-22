import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  size?: "sm" | "md";
  variant?: "primary" | "outline";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
}) => {
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  const variantClasses = {
    primary:
      "text-white shadow-theme-xs disabled:opacity-50",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
  };

  const primaryStyle =
    variant === "primary"
      ? {
          backgroundColor: "#fd9141",
          // hover & disabled dihandle via inline + onMouseEnter/Leave
        }
      : {};

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      style={primaryStyle}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={e => {
        if (variant === "primary" && !disabled)
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#e8803a";
      }}
      onMouseLeave={e => {
        if (variant === "primary")
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#fd9141";
      }}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;