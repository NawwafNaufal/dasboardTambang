import { useState } from "react";

interface UserDropdownProps {
  selectedPT: string;
  onPTChange: (pt: string) => void;
}

export default function UserDropdown({
  selectedPT,
  onPTChange,
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (pt: string) => {
    onPTChange(pt);
    setIsOpen(false);
  };

  const ptOptions = [
    "PT Semen Tonasa",
    "PT Semen Padang",
    "Jakamitra",
    "Site Sale"
  ];

  return (
    <div className="relative w-52 h-10">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center px-4 py-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <span>{selectedPT}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transition: "transform 0.2s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
          className="text-gray-400 dark:text-gray-500 flex-shrink-0"
        >
          <path
            d="M2.5 5L7 9.5L11.5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-lg">
          {ptOptions.map((pt) => (
            <button
              key={pt}
              onClick={() => handleSelect(pt)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white first:rounded-t-lg last:rounded-b-lg ${
                selectedPT === pt
                  ? "bg-gray-100 dark:bg-gray-700 font-medium"
                  : ""
              }`}
            >
              {pt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}