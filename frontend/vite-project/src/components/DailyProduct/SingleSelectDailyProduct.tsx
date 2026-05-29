import { useState, useEffect, useRef, useMemo } from "react";

interface SingleSelectProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
}

export const SingleSelectDailyProduct: React.FC<SingleSelectProps> = ({ options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setSearch("");
  }, [open]);

  const filtered = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(search.toLowerCase())),
    [options, search]
  );

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-3 px-5 py-1 rounded-xl min-w-[120px] justify-between border text-sm font-semibold transition-all ${
          open
            ? "border-[#fd9141] ring-2 ring-orange-100 bg-white text-[#fd9141] dark:bg-gray-800 dark:border-[#fd9141] dark:ring-orange-900/40 dark:text-[#fd9141]"
            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        }`}
      >
        <span className="text-sm font-semibold text-[#fd9141]">{value || "Pilih Unit"}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg" width="12" height="12"
          fill="currentColor" viewBox="0 0 16 16"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
          className="text-gray-400"
        >
          <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute z-50 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
          style={{ top: "calc(100% + 6px)", left: 0, minWidth: "160px" }}
        >
          {/* Search */}
          <div className="p-2 border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                fill="#9ca3af" viewBox="0 0 16 16"
                className="absolute left-2.5 top-1/2 -translate-y-1/2"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11" />
              </svg>
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari unit..."
                className="w-full pl-7 pr-6 py-1.5 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:border-[#fd9141] focus:ring-2 focus:ring-orange-100 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm leading-none"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: "200px", overflowY: "auto" }} className="py-1">
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-xs text-gray-400 text-center">Tidak ditemukan</div>
            )}
            {filtered.map((opt) => {
              const isActive = opt === value;
              return (
                <button
                  key={opt}
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                    isActive
                      ? "bg-orange-50 dark:bg-orange-900/30 text-[#fd9141] font-semibold"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {isActive ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                      fill="currentColor" viewBox="0 0 16 16"
                      style={{ color: "#fd9141" }} className="flex-shrink-0"
                    >
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                    </svg>
                  ) : (
                    <span style={{ width: 12 }} />
                  )}
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};