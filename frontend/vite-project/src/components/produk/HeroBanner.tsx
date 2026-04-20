import { useOutletContext } from "react-router";

interface HeroBannerProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

export default function HeroBanner({ activeTab, onTabChange }: HeroBannerProps) {
  const tabs = ["Volume", "Index"];
  let selectedPT = "PT Semen Tonasa";
  try {
    const ctx = useOutletContext<{ selectedPT?: string }>();
    if (ctx?.selectedPT) selectedPT = ctx.selectedPT;
  } catch {}

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: "510px" }}>
      <img
        src="../../../public/images/cards/tambang1.png"
        alt="Hero Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-100 dark:opacity-0 transition-opacity duration-700"
        style={{ objectPosition: "90% center" }}
      />
      <img
        src="../../../public/images/cards/tambang2.png"
        alt="Hero Banner Night"
        className="absolute inset-0 w-full h-full object-cover opacity-0 dark:opacity-100 transition-opacity duration-700"
        style={{ objectPosition: "90% 57%" }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
        }}
      />

      {/* TOP RIGHT - PT Name */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="text-white text-sm font-semibold whitespace-nowrap">{selectedPT}</span>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
      </div>

      {/* CONTENT */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
        <div>
          <h1
            className="text-white font-bold leading-none"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", letterSpacing: "-0.02em" }}
          >
            Production
          </h1>
          <h1
            className="text-white font-bold leading-none"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", letterSpacing: "-0.02em" }}
          >
            Dashboard
          </h1>
          <p className="text-white/75 mt-2 max-w-sm text-sm leading-relaxed">
            Monitor production KPIs, daily output, and performance metrics in real-time across all units.
          </p>
        </div>

        {/* TAB */}
        <div className="absolute bottom-6 md:bottom-8 xl:left-[calc(32.333%+1.5rem)] left-6">
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-sm p-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange?.(tab)}
                className={`px-6 py-2 rounded-sm text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow"
                    : "text-white hover:text-white/80"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}