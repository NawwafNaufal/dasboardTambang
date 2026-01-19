import { createPortal } from "react-dom";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Apakah Anda yakin ingin menghapusnya?",
  description = "Data yang dihapus tidak dapat dikembalikan. Pastikan Anda yakin sebelum melanjutkan.",
}: DeleteModalProps) {
  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full overflow-auto"
      style={{ zIndex: 99999 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70"
        onClick={onClose}
        style={{ zIndex: 99999 }}
      />
      
      {/* Modal Content */}
      <div 
        className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 relative"
        style={{ zIndex: 100000 }}
      >
        {/* Close Icon */}
        <svg
          onClick={onClose}
          xmlns="http://www.w3.org/2000/svg"
          className="w-3.5 h-3.5 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 float-right"
          viewBox="0 0 320.591 320.591"
        >
          <path
            d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
          ></path>
          <path
            d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
          ></path>
        </svg>

        {/* Modal Content */}
        <div className="my-8 text-center">
          {/* Trash Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 fill-red-500 inline"
            viewBox="0 0 24 24"
          >
            <path
              d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
            />
            <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" />
          </svg>

          {/* Title and Description */}
          <div className="mt-6">
            <h4 className="text-slate-900 dark:text-white text-lg font-semibold">
              {title}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
              {description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3">
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-md cursor-pointer text-white text-sm font-medium tracking-wide bg-red-500 hover:bg-red-600 active:bg-red-500"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md cursor-pointer text-slate-900 dark:text-white text-sm font-medium tracking-wide bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-200 dark:active:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}