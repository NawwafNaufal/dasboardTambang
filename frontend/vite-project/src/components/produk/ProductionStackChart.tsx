import React, { useState, useMemo, useRef, useEffect } from "react";

type Period = "harian" | "bulanan";
interface DR { machine: string; produksi: number; standby: number; breakdown: number; }

const ALL_MACHINES = [
  "M-01","M-02","M-03","M-04","M-05","M-06","M-07","M-08","M-09","M-10",
  "M-11","M-12","M-13","M-14","M-15","M-16","M-17","M-18","M-19","M-20",
  "M-21","M-22","M-23","M-24","M-25","M-26","M-27","M-28","M-29","M-30",
  "M-31","M-32","M-33",
];
const PAGE_SIZE = 6;
const MNS = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
const MNF = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function seed(k: string) { let h=0; for(let i=0;i<k.length;i++) h=(Math.imul(31,h)+k.charCodeAt(i))|0; return Math.abs(h); }
function daily(date: string): DR[] { return ALL_MACHINES.map(m=>{ const s=seed(date+m); return {machine:m,produksi:100+(s%200),standby:80+((s>>3)%150),breakdown:40+((s>>5)%100)}; }); }
function monthly(y: number, mo: number): DR[] { return ALL_MACHINES.map(m=>{ const s=seed(`${y}-${String(mo).padStart(2,"0")}${m}`); return {machine:m,produksi:2000+(s%3000),standby:1500+((s>>3)%2500),breakdown:800+((s>>5)%1500)}; }); }

const SERIES = [
  {key:"produksi"  as keyof DR, label:"Produksi",  color:"#27B5F5"},
  {key:"standby"   as keyof DR, label:"Standby",   color:"#4ADE80"},
  {key:"breakdown" as keyof DR, label:"Breakdown", color:"#FBBF24"},
];

const R = 22;

function rr(x:number, y:number, w:number, h:number, tl:number, tr:number, br:number, bl:number) {
  if (h < 0.5 || w < 0.5) return "";
  const c = (v:number) => Math.min(v, w/2, h/2);
  const [TL,TR,BR,BL] = [c(tl),c(tr),c(br),c(bl)];
  return `M${x+TL},${y} H${x+w-TR} Q${x+w},${y} ${x+w},${y+TR}`
       + ` V${y+h-BR} Q${x+w},${y+h} ${x+w-BR},${y+h}`
       + ` H${x+BL} Q${x},${y+h} ${x},${y+h-BL}`
       + ` V${y+TL} Q${x},${y} ${x+TL},${y} Z`;
}

// ── Chart ────────────────────────────────────────────────
const Chart: React.FC<{data:DR[]}> = ({data}) => {
  const wrap = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(560);
  const [tip, setTip] = useState<{cx:number;ty:number;d:DR}|null>(null);

  useEffect(()=>{
    if (!wrap.current) return;
    const ro = new ResizeObserver(([e])=>setW(e.contentRect.width));
    ro.observe(wrap.current);
    return ()=>ro.disconnect();
  },[]);

  const ML=44, MR=12, MT=12, MB=40;
  const SH=300;
  const iW=W-ML-MR;
  const iH=SH-MT-MB;

  const maxV = useMemo(()=>Math.max(...data.map(d=>d.produksi+d.standby+d.breakdown),1),[data]);
  const toPx = (v:number) => (v/maxV)*iH;

  const ticks = useMemo(()=>{
    const raw=maxV/5;
    const mag=Math.pow(10,Math.floor(Math.log10(Math.max(raw,1))));
    const step=Math.ceil(raw/mag)*mag||1;
    const arr:number[]=[];
    for(let v=0;v<=maxV*1.15;v+=step){ arr.push(v); if(arr.length>8) break; }
    return arr;
  },[maxV]);

  const n=data.length;
  const slotW=iW/n;
  const barW=Math.max(14,Math.min(slotW*0.55,48));

  return (
    <div ref={wrap} style={{position:"relative",width:"100%"}}>
      <svg width={W} height={SH} style={{display:"block",overflow:"visible"}}
           onMouseLeave={()=>setTip(null)}>
        <g transform={`translate(${ML},${MT})`}>
          {ticks.map(t=>{
            const gy = iH - toPx(t);
            return (
              <g key={t}>
                <line x1={0} x2={iW} y1={gy} y2={gy} stroke="#ebebeb" strokeWidth={1} strokeDasharray="5 4"/>
                <text x={-10} y={gy+4} textAnchor="end" fontSize={11} fill="#b0b7c3">{t>=1000?`${(t/1000).toFixed(t%1000===0?0:1)}k`:t}</text>
              </g>
            );
          })}

          {data.map((d,i)=>{
            const cx = slotW*i + slotW/2;
            const bx = cx - barW/2;
            const total = d.produksi + d.standby + d.breakdown;
            const totalPx = toPx(total);
            const totalTopY = iH - totalPx;

            const allSegs = SERIES.map(s=>({...s, val: d[s.key] as number}));
            if (allSegs.every(s=>s.val===0)) return null;

            let accPx = 0;
            const segRects = allSegs.map(seg => {
              const h = toPx(seg.val);
              const botY = iH - accPx;
              const topY = botY - h;
              accPx += h;
              return { ...seg, h, botY, topY };
            }).filter(s=>s.val>0);

            const paths: React.ReactNode[] = [];

            [...segRects].reverse().forEach((seg, ri) => {
              const si = segRects.length - 1 - ri;
              const isBottom = si === 0;
              const y = isBottom ? seg.topY : seg.topY;
              const h = isBottom ? seg.h : seg.h + R;
              paths.push(
                <path key={seg.key}
                  d={rr(bx, y, barW, h,
                    R, R,
                    isBottom ? R : 0,
                    isBottom ? R : 0
                  )}
                  fill={seg.color}
                />
              );
              if (seg.h > 22) {
                const midY = seg.topY + seg.h / 2;
                paths.push(
                  <text key={seg.key + "_lbl"}
                    x={bx + barW / 2} y={midY + 4}
                    textAnchor="middle" fontSize={11} fontWeight={600}
                    fill="rgba(255,255,255,0.9)" fontFamily="Inter,sans-serif"
                    style={{pointerEvents:"none"}}
                  >{seg.val}</text>
                );
              }
            });

            return (
              <g key={d.machine} style={{cursor:"default"}}
                onMouseEnter={()=>setTip({cx:cx+ML, ty:totalTopY+MT, d})}>
                <rect x={bx-6} y={0} width={barW+12} height={iH+R} fill="transparent"/>
                {paths}
                <text x={cx} y={iH+26} textAnchor="middle" fontSize={12} fill="#9ca3af">{d.machine}</text>
              </g>
            );
          })}
        </g>
      </svg>

      {tip&&(
        <div style={{position:"absolute",left:tip.cx,top:tip.ty-8,
          transform:"translate(-50%,-100%)",background:"#fff",
          border:"1px solid #e5e7eb",borderRadius:10,padding:"10px 14px",
          boxShadow:"0 6px 20px rgba(0,0,0,0.12)",fontSize:13,
          pointerEvents:"none",zIndex:20,whiteSpace:"nowrap"}}>
          <div style={{fontWeight:700,color:"#1f2937",marginBottom:6}}>{tip.d.machine}</div>
          {SERIES.map(s=>(
            <div key={s.key} style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
              <span style={{width:10,height:10,borderRadius:3,background:s.color,display:"inline-block"}}/>
              <span style={{color:"#6b7280"}}>{s.label}:</span>
              <span style={{fontWeight:600,color:"#111827"}}>{tip.d[s.key]} jam</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Month Picker ─────────────────────────────────────────
const MonthPicker: React.FC<{year:number;month:number;onChange:(y:number,m:number)=>void}> = ({year,month,onChange}) => {
  const [open,setOpen]=useState(false);
  const [dy,setDy]=useState(year);
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{ const h=(e:MouseEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node))setOpen(false);}; document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h); },[]);
  return (
    <div ref={ref} style={{position:"relative",display:"inline-block"}}>
      <button onClick={()=>setOpen(!open)} style={{
        display:"flex",alignItems:"center",gap:7,padding:"6px 11px",
        borderRadius:9,border:"1.5px solid #e5e7eb",background:"#fff",
        fontSize:12,fontWeight:600,cursor:"pointer",color:"#111827",
        boxShadow:"0 1px 3px rgba(0,0,0,0.07)",transition:"border-color 0.15s",
      }}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="2" width="14" height="13" rx="2.5" stroke="#9ca3af" strokeWidth="1.4"/>
          <path d="M1 6h14" stroke="#9ca3af" strokeWidth="1.4"/>
          <path d="M5 1v2M11 1v2" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <span>{MNS[month-1]} {year}</span>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 4.5L6 8l3.5-3.5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      {open&&(
        <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,background:"#fff",borderRadius:14,boxShadow:"0 12px 40px rgba(0,0,0,0.14)",padding:16,zIndex:999,minWidth:220,border:"1px solid #f0f0f0"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <button onClick={()=>setDy(y=>y-1)} style={{width:28,height:28,borderRadius:7,border:"1px solid #e5e7eb",background:"#f9fafb",cursor:"pointer",fontSize:14,color:"#374151",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
            <span style={{fontWeight:700,fontSize:13,color:"#111827"}}>{dy}</span>
            <button onClick={()=>setDy(y=>y+1)} style={{width:28,height:28,borderRadius:7,border:"1px solid #e5e7eb",background:"#f9fafb",cursor:"pointer",fontSize:14,color:"#374151",display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5}}>
            {MNS.map((nm2,idx)=>{ const a=dy===year&&idx+1===month; return (
              <button key={nm2} onClick={()=>{onChange(dy,idx+1);setOpen(false);}} style={{
                padding:"7px 4px",borderRadius:8,border:"none",
                background:a?"#1a6fd4":"transparent",
                color:a?"#fff":"#374151",fontWeight:a?700:500,
                cursor:"pointer",fontSize:12,transition:"background 0.12s",
              }}>{nm2}</button>
            ); })}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Date Picker ──────────────────────────────────────────
const DatePicker: React.FC<{value:string;onChange:(v:string)=>void}> = ({value,onChange}) => {
  const [open,setOpen]=useState(false);
  const ref=useRef<HTMLDivElement>(null);
  const [vY,vM,vD]=value.split("-").map(Number);
  const [ny,setNy]=useState(vY);
  const [nm,setNm]=useState(vM);
  useEffect(()=>{ const h=(e:MouseEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node))setOpen(false);}; document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h); },[]);
  const fd=new Date(ny,nm-1,1).getDay(), dim=new Date(ny,nm,0).getDate();
  const cells=Array(fd).fill(null).concat(Array.from({length:dim},(_,i)=>i+1));
  const prev=()=>{if(nm===1){setNy(y=>y-1);setNm(12);}else setNm(m=>m-1);};
  const next=()=>{if(nm===12){setNy(y=>y+1);setNm(1);}else setNm(m=>m+1);};
  return (
    <div ref={ref} style={{position:"relative",display:"inline-block"}}>
      <button onClick={()=>setOpen(!open)} style={{
        display:"flex",alignItems:"center",gap:7,padding:"6px 11px",
        borderRadius:9,border:"1.5px solid #e5e7eb",background:"#fff",
        fontSize:12,fontWeight:600,cursor:"pointer",color:"#111827",
        boxShadow:"0 1px 3px rgba(0,0,0,0.07)",
      }}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="2" width="14" height="13" rx="2.5" stroke="#9ca3af" strokeWidth="1.4"/>
          <path d="M1 6h14" stroke="#9ca3af" strokeWidth="1.4"/>
          <path d="M5 1v2M11 1v2" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <span>{String(vD).padStart(2,"0")} {MNS[vM-1]} {vY}</span>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 4.5L6 8l3.5-3.5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      {open&&(
        <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,background:"#fff",borderRadius:14,boxShadow:"0 12px 40px rgba(0,0,0,0.14)",padding:16,zIndex:999,minWidth:260,border:"1px solid #f0f0f0"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <button onClick={prev} style={{width:28,height:28,borderRadius:7,border:"1px solid #e5e7eb",background:"#f9fafb",cursor:"pointer",fontSize:14,color:"#374151",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
            <span style={{fontWeight:700,fontSize:13,color:"#111827"}}>{MNF[nm-1]} {ny}</span>
            <button onClick={next} style={{width:28,height:28,borderRadius:7,border:"1px solid #e5e7eb",background:"#f9fafb",cursor:"pointer",fontSize:14,color:"#374151",display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
            {["Min","Sen","Sel","Rab","Kam","Jum","Sab"].map(d=>(
              <div key={d} style={{textAlign:"center",fontSize:9,color:"#9ca3af",fontWeight:700,padding:"2px 0",textTransform:"uppercase",letterSpacing:"0.03em"}}>{d}</div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
            {cells.map((day,idx)=>{
              if(!day)return<div key={`e${idx}`}/>;
              const s=day===vD&&nm===vM&&ny===vY;
              const isToday=day===new Date().getDate()&&nm===new Date().getMonth()+1&&ny===new Date().getFullYear();
              return (
                <button key={day} onClick={()=>{onChange(`${ny}-${String(nm).padStart(2,"0")}-${String(day).padStart(2,"0")}`);setOpen(false);}} style={{
                  padding:"6px 2px",borderRadius:7,border:"none",
                  background:s?"#1a6fd4":isToday?"#eff6ff":"transparent",
                  color:s?"#fff":isToday?"#1a6fd4":"#374151",
                  fontWeight:s||isToday?700:400,
                  cursor:"pointer",fontSize:12,textAlign:"center",
                  transition:"background 0.1s",
                }}>{day}</button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main ─────────────────────────────────────────────────
export default function ProductionStackedBar() {
  const [period,setPeriod]=useState<Period>("harian");
  const [date,setDate]=useState("2026-02-27");
  const [year,setYear]=useState(2026);
  const [month,setMonth]=useState(2);
  const [page,setPage]=useState(0);
  const totalPg=Math.ceil(ALL_MACHINES.length/PAGE_SIZE);
  const machines=ALL_MACHINES.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE);

  const data=useMemo(()=>{
    const all=period==="harian"?daily(date):monthly(year,month);
    return all.filter(d=>machines.includes(d.machine));
  },[period,date,year,month,machines]);

  const title=useMemo(()=>{
    if(period==="harian"){const[y,m,d]=date.split("-").map(Number);return`Distribusi Waktu Mesin — ${String(d).padStart(2,"0")} ${MNF[m-1]} ${y}`;}
    return`Distribusi Waktu Mesin — ${MNF[month-1]} ${year}`;
  },[period,date,year,month]);

  const tp=data.reduce((s,d)=>s+d.produksi,0);
  const ts=data.reduce((s,d)=>s+d.standby,0);
  const tb=data.reduce((s,d)=>s+d.breakdown,0);
  const ta=tp+ts+tb;
  const av=ta>0?((tp/ta)*100).toFixed(1)+"%":"0%";

  return (
    <div style={{padding:24,fontFamily:"'Inter','Segoe UI',sans-serif",border:"1px solid #e5e7eb",borderRadius:16,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",background:"#fff"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,gap:8,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:6}}>
          <div style={{display:"flex",background:"#f0f0f0",borderRadius:999,padding:2,gap:2}}>
            {(["harian","bulanan"] as Period[]).map(p=>(
              <button key={p} onClick={()=>setPeriod(p)} style={{
                padding:"4px 14px",borderRadius:999,border:"none",
                background:period===p?"#fff":"transparent",
                color:period===p?"#111":"#9ca3af",
                cursor:"pointer",fontWeight:period===p?600:400,
                textTransform:"capitalize",fontSize:12,
                boxShadow:period===p?"0 1px 3px rgba(0,0,0,0.10)":"none",
                transition:"all 0.15s",
              }}>{p.charAt(0).toUpperCase()+p.slice(1)}</button>
            ))}
          </div>
        </div>

        {period==="harian"
          ?<DatePicker value={date} onChange={setDate}/>
          :<MonthPicker year={year} month={month} onChange={(y,m)=>{setYear(y);setMonth(m);}}/>}
      </div>

      <div style={{fontSize:14,fontWeight:700,color:"#1f2937",marginBottom:10}}>{title}</div>

      {/* Legend with increased spacing between items */}
      <div style={{display:"flex",gap:24,marginBottom:8}}>
        {SERIES.map(s=>(
          <div key={s.key} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:"#4b5563"}}>
            <span style={{width:10,height:10,borderRadius:3,background:s.color,display:"inline-block"}}/>
            {s.label}
          </div>
        ))}
      </div>

      <Chart data={data}/>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",margin:"14px 0 0"}}>
        <span style={{fontSize:11,color:"#9ca3af"}}>Mesin {page*PAGE_SIZE+1}–{Math.min((page+1)*PAGE_SIZE,ALL_MACHINES.length)} dari {ALL_MACHINES.length}</span>
        <div style={{display:"flex",gap:4}}>
          <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} style={{width:26,height:26,borderRadius:6,border:"1px solid #e5e7eb",background:page===0?"#f9fafb":"#fff",color:page===0?"#d1d5db":"#374151",cursor:page===0?"not-allowed":"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
          {Array.from({length:totalPg},(_,i)=>(
            <button key={i} onClick={()=>setPage(i)} style={{width:26,height:26,borderRadius:6,border:"1px solid #e5e7eb",background:page===i?"#1a6fd4":"#fff",color:page===i?"#fff":"#374151",cursor:"pointer",fontSize:11,fontWeight:page===i?700:400,display:"flex",alignItems:"center",justifyContent:"center"}}>{i+1}</button>
          ))}
          <button onClick={()=>setPage(p=>Math.min(totalPg-1,p+1))} disabled={page===totalPg-1} style={{width:26,height:26,borderRadius:6,border:"1px solid #e5e7eb",background:page===totalPg-1?"#f9fafb":"#fff",color:page===totalPg-1?"#d1d5db":"#374151",cursor:page===totalPg-1?"not-allowed":"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
        </div>
      </div>

      <div style={{
        margin:"16px -24px -24px -24px",
        background:"#eef6fb",
        borderTop:"1px solid #ddeef7",
        borderRadius:"0 0 16px 16px",
        padding:"20px 24px 24px",
        display:"flex",
        justifyContent:"space-around",
        gap:8,
      }}>
        {[
          {l:"Total Produksi",v:`${tp}h`,c:"#1a6fd4"},
          {l:"Total Standby",v:`${ts}h`,c:"#3d8fe0"},
          {l:"Total Breakdown",v:`${tb}h`,c:"#63a8f0"},
          {l:"Availability",v:av,c:"#1558a8"},
        ].map((c,i,arr)=>(
          <div key={c.l} style={{
            flex:1, textAlign:"center",
            borderRight: i < arr.length-1 ? "1px solid #c8dff0" : "none",
            paddingRight: i < arr.length-1 ? 8 : 0,
          }}>
            <div style={{fontSize:11,color:"#8aaec4",marginBottom:6,fontWeight:500,letterSpacing:"0.02em"}}>{c.l}</div>
            <div style={{fontSize:22,fontWeight:700,color:c.c,letterSpacing:"-0.01em"}}>{c.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}