import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

const years = ["2025", "2023", "2022", "2021", "2020"];

export default function YearDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2024");

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function selectYear(year: string) {
    setSelectedYear(year);
    closeDropdown();
  }

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center gap-2 px-4 text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg h-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        onClick={toggleDropdown}
      >
        <svg
          className="w-5 h-5 text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="font-medium">{selectedYear}</span>
        <svg
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="w-32 p-2 mt-2"
      >
        {years.map((year) => (
          <DropdownItem
            key={year}
            onItemClick={() => selectYear(year)}
            className={`flex w-full font-medium text-left rounded-lg px-3 py-2 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/5 dark:hover:text-gray-300 ${
              selectedYear === year
                ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {year}
          </DropdownItem>
        ))}
      </Dropdown>
    </div>
  );
}