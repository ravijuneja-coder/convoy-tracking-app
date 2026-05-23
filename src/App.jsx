import { useState, useEffect, useRef } from "react";

// ── Palette ───────────────────────────────────────────────────────────────────
const T = {
  bg:"#080B12", surface:"#0E1219", card:"#131820", raised:"#181F2B",
  border:"#1C2333", borderHi:"#2A3550",
  accent:"#3DD68C", accentLo:"#152D20", accentHi:"#5AEFAA",
  blue:"#4A9EFF",   blueLo:"#0D1E38",
  violet:"#9B6EFF", violetLo:"#1A1040",
  amber:"#F5A623",  amberLo:"#2E1E00",
  red:"#FF4F4F",    redLo:"#2E0E0E",
  text:"#EEF2FF",   sub:"#8895B3",   muted:"#3D4D6A",
};
const MC = ["#3DD68C","#4A9EFF","#9B6EFF","#F5A623","#FF4F4F","#00D4FF","#FF6B9D","#FFD166"];
const STATUS = {
  live:      { label:"Live",     dot:"#3DD68C", bg:"#152D20", text:"#3DD68C" },
  upcoming:  { label:"Upcoming", dot:"#4A9EFF", bg:"#0D1E38", text:"#4A9EFF" },
  completed: { label:"Done",     dot:"#8895B3", bg:"#181F2B", text:"#8895B3" },
};

// ── Live tracking state per member ────────────────────────────────────────────
const LIVE_DATA = {
  1: { speed: 62, dist: 0,   eta: "0 min",  memberStatus: "moving",  lastSeen: "now",    heading: 45  },
  2: { speed: 58, dist: 1.2, eta: "2 min",  memberStatus: "moving",  lastSeen: "now",    heading: 42  },
  3: { speed: 0,  dist: 2.8, eta: "5 min",  memberStatus: "stopped", lastSeen: "1m ago", heading: 40  },
  4: { speed: 0,  dist: 5.4, eta: "9 min",  memberStatus: "stopped", lastSeen: "3m ago", heading: 35  },
};
// Canvas car positions (relative to 480×300 canvas)
const CAR_POS = [
  { x: 0.30, y: 0.52 },
  { x: 0.38, y: 0.42 },
  { x: 0.22, y: 0.64 },
  { x: 0.13, y: 0.36 },
];

// ── Seed Data ─────────────────────────────────────────────────────────────────
const SEED = [
  {
    id:1, name:"Delhi Road Trip", destination:"New Delhi", date:"2025-06-22",
    time:"08:00", status:"live", distance:287, alertKm:5,
    notes:"Depart Sector 18. Fuel before highway.",
    color:"#3DD68C",
    members:[
      { id:1, name:"Rohan", initials:"RO", color:"#3DD68C", car:"Swift · DL4C 1234",    role:"admin"  },
      { id:2, name:"Rahul", initials:"RA", color:"#4A9EFF", car:"Innova · UP32 5567",   role:"member" },
      { id:3, name:"Priya", initials:"PR", color:"#F5A623", car:"Creta · HR26 8890",    role:"member" },
      { id:4, name:"Aman",  initials:"AM", color:"#C36EFF", car:"Fortuner · PB10 4412", role:"member" },
    ],
  },
  {
    id:2, name:"Goa Beach Weekend", destination:"Goa", date:"2025-07-04",
    time:"06:30", status:"upcoming", distance:593, alertKm:10,
    notes:"Book toll tags. Leave early to avoid traffic.",
    color:"#4A9EFF",
    members:[
      { id:5, name:"Sneha",  initials:"SN", color:"#4A9EFF", car:"Nexon · MH02 3310",   role:"admin"  },
      { id:6, name:"Vikram", initials:"VI", color:"#9B6EFF", car:"Scorpio · KA01 8821", role:"member" },
    ],
  },
  {
    id:3, name:"Manali Expedition", destination:"Manali, HP", date:"2025-08-15",
    time:"04:00", status:"upcoming", distance:536, alertKm:5,
    notes:"Carry spare tyre. Rohtang permit required.",
    color:"#9B6EFF",
    members:[
      { id:7,  name:"Arjun",  initials:"AR", color:"#9B6EFF", car:"Thar · HP07 7744",    role:"admin"  },
      { id:8,  name:"Meera",  initials:"ME", color:"#F5A623", car:"XUV700 · DL8C 5511", role:"member" },
      { id:9,  name:"Dev",    initials:"DE", color:"#3DD68C", car:"Bolero · PB08 2293",  role:"member" },
      { id:10, name:"Anjali", initials:"AN", color:"#4A9EFF", car:"Creta · HP09 6612",   role:"member" },
      { id:11, name:"Kartik", initials:"KA", color:"#FF4F4F", car:"Swift · HR12 0021",   role:"member" },
    ],
  },
  {
    id:4, name:"Jaipur Day Trip", destination:"Jaipur, RJ", date:"2025-05-10",
    time:"07:00", status:"completed", distance:282, alertKm:2,
    notes:"Completed. Total time: 5h 20m.",
    color:"#F5A623",
    members:[
      { id:12, name:"Pooja",  initials:"PO", color:"#F5A623", car:"Verna · RJ14 4432",  role:"admin"  },
      { id:13, name:"Saurav", initials:"SA", color:"#3DD68C", car:"Brezza · DL6C 9981", role:"member" },
      { id:14, name:"Nisha",  initials:"NI", color:"#4A9EFF", car:"Baleno · UP16 7732", role:"member" },
    ],
  },
];

// ── Icon ──────────────────────────────────────────────────────────────────────
const Ic = ({ d, size=16, color=T.sub, sw=1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, display:"block" }}>
    <path d={d} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ICONS = {
  plus:    "M12 5v14M5 12h14",
  edit:    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:   "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  close:   "M18 6L6 18M6 6l12 12",
  map:     "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
  users:   "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  bell:    "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  check:   "M20 6L9 17l-5-5",
  search:  "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
  flag:    "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7",
  chevron: "M9 18l6-6-6-6",
  note:    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  back:    "M19 12H5M12 19l-7-7 7-7",
  speed:   "M12 2a10 10 0 11-6.88 17.23M12 6v6l3 3",
  sos:     "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
  locate:  "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const Avatar = ({ name, color, size=32, border=T.card }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.3, fontWeight:800, color:"#fff", flexShrink:0, border:`2px solid ${border}`, letterSpacing:-0.5 }}>
    {name.slice(0,2).toUpperCase()}
  </div>
);
const AvatarStack = ({ members, max=4 }) => {
  const vis = members.slice(0,max), extra = members.length-max;
  return (
    <div style={{ display:"flex" }}>
      {vis.map((m,i) => <div key={m.id} style={{ marginLeft:i===0?0:-7, zIndex:vis.length-i }}><Avatar name={m.name} color={m.color} size={24}/></div>)}
      {extra>0 && <div style={{ marginLeft:-7, width:24, height:24, borderRadius:"50%", background:T.raised, border:`2px solid ${T.card}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:800, color:T.sub }}>+{extra}</div>}
    </div>
  );
};
const Badge = ({ status }) => {
  const s = STATUS[status];
  return (
    <span style={{ background:s.bg, color:s.text, border:`1px solid ${s.text}30`, borderRadius:20, padding:"2px 9px", fontSize:10, fontWeight:700, letterSpacing:0.5, display:"inline-flex", alignItems:"center", gap:4 }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:s.dot, display:"inline-block", ...(status==="live"?{animation:"pulse 1.4s infinite"}:{}) }}/>
      {s.label}
    </span>
  );
};
const Field = ({ label, value, onChange, placeholder, type="text" }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
    {label && <label style={{ fontSize:10, fontWeight:700, color:T.muted, letterSpacing:0.9, textTransform:"uppercase" }}>{label}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{ background:T.raised, border:`1.5px solid ${T.border}`, borderRadius:10, padding:"11px 13px", fontSize:13, color:T.text, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" }}
      onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
  </div>
);
const FieldArea = ({ label, value, onChange, placeholder }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
    {label && <label style={{ fontSize:10, fontWeight:700, color:T.muted, letterSpacing:0.9, textTransform:"uppercase" }}>{label}</label>}
    <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3}
      style={{ background:T.raised, border:`1.5px solid ${T.border}`, borderRadius:10, padding:"11px 13px", fontSize:13, color:T.text, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit", resize:"none" }}
      onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// LIVE MAP CANVAS
// ══════════════════════════════════════════════════════════════════════════════
const LiveMap = ({ members, selectedId, onSelect }) => {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const frame     = useRef(0);
  const posRef    = useRef([]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const W = cv.width, H = cv.height;

    const draw = () => {
      frame.current++;
      const f = frame.current;
      ctx.clearRect(0,0,W,H);

      // ── background ──
      ctx.fillStyle = "#0D1118"; ctx.fillRect(0,0,W,H);

      // ── road network ──
      const roads = [
        [0, H*.52, W, H*.52],
        [W*.28,0, W*.28,H],
        [W*.68,0, W*.68,H],
        [0,H*.22, W,H*.36],
        [0,H*.72, W,H*.66],
        [0,H*.85, W*.55,H*.80],
      ];
      roads.forEach(([x1,y1,x2,y2]) => {
        ctx.strokeStyle="#1A2030"; ctx.lineWidth=14; ctx.lineCap="round";
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
        ctx.strokeStyle="#1E2840"; ctx.lineWidth=1.5;
        ctx.setLineDash([10,9]);
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
        ctx.setLineDash([]);
      });

      // ── city blocks ──
      ctx.fillStyle="#111820";
      [[42,42,130,90],[195,42,110,75],[345,42,85,88],
       [42,195,85,115],[195,200,115,95],[42,378,150,88],
       [345,200,88,128],[225,378,98,82],[368,378,78,98]
      ].forEach(([x,y,w,h]) => { ctx.beginPath(); ctx.roundRect(x,y,w,h,4); ctx.fill(); });

      // ── route ──
      const route = [[55,H*.52],[W*.28,H*.36],[W*.58,H*.26],[W-38,H*.20]];
      ctx.strokeStyle="rgba(61,214,140,0.45)"; ctx.lineWidth=3;
      ctx.setLineDash([8,5]);
      ctx.beginPath();
      route.forEach(([x,y],i)=>i===0?ctx.moveTo(x,y):ctx.lineTo(x,y));
      ctx.stroke(); ctx.setLineDash([]);

      // ── destination ──
      const [dx,dy]=[W-38,H*.20], pulse=.5+.5*Math.sin(f*.05);
      ctx.beginPath(); ctx.arc(dx,dy,18+pulse*8,0,Math.PI*2);
      ctx.fillStyle=`rgba(61,214,140,${.07+pulse*.05})`; ctx.fill();
      ctx.beginPath(); ctx.arc(dx,dy,10,0,Math.PI*2);
      ctx.fillStyle="#3DD68C"; ctx.fill();
      ctx.fillStyle="#fff"; ctx.font="bold 9px sans-serif";
      ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText("D",dx,dy);

      // ── live car positions ──
      const selIdx = selectedId!=null ? members.findIndex(m=>m.id===selectedId) : -1;
      const positions = members.map((_,i) => {
        const base = CAR_POS[i] || { x:.5, y:.5 };
        return {
          x: W*base.x + Math.sin(f*.018+i*1.3)*3,
          y: H*base.y + Math.cos(f*.014+i*0.9)*2,
        };
      });
      posRef.current = positions;

      // ── gap lines when a car is selected ──
      if (selIdx !== -1) {
        const src = positions[selIdx];
        members.forEach((m,i) => {
          if (i===selIdx) return;
          const dst = positions[i];
          const liveD = LIVE_DATA[m.id];
          const warn  = liveD && liveD.dist>4;
          const dashOff = -(f*.55)%(14);
          ctx.save();
          ctx.setLineDash([8,6]); ctx.lineDashOffset=dashOff;
          ctx.strokeStyle= warn ? "rgba(245,166,35,.8)" : `${m.color}BB`;
          ctx.lineWidth=2;
          ctx.beginPath(); ctx.moveTo(src.x,src.y); ctx.lineTo(dst.x,dst.y); ctx.stroke();
          ctx.setLineDash([]); ctx.restore();

          // midpoint pill
          const mx=(src.x+dst.x)/2, my=(src.y+dst.y)/2;
          const label = liveD ? `${liveD.dist} km` : "–";
          ctx.font="bold 10px 'DM Sans',sans-serif";
          const tw=ctx.measureText(label).width, pw=tw+16, ph=18;
          ctx.shadowColor="rgba(0,0,0,.5)"; ctx.shadowBlur=8;
          ctx.fillStyle= warn?"#F5A623":"#161A22";
          ctx.beginPath(); ctx.roundRect(mx-pw/2,my-ph/2,pw,ph,9); ctx.fill();
          ctx.shadowBlur=0;
          ctx.strokeStyle= warn?"#F5A62355":`${m.color}44`;
          ctx.lineWidth=1.2;
          ctx.beginPath(); ctx.roundRect(mx-pw/2,my-ph/2,pw,ph,9); ctx.stroke();
          ctx.fillStyle= warn?"#fff":m.color;
          ctx.textAlign="center"; ctx.textBaseline="middle";
          ctx.fillText(label,mx,my);
        });
        // halo on selected
        const hp=.5+.5*Math.sin(f*.1);
        ctx.beginPath(); ctx.arc(positions[selIdx].x,positions[selIdx].y,30+hp*6,0,Math.PI*2);
        ctx.strokeStyle=`${members[selIdx].color}55`; ctx.lineWidth=2; ctx.stroke();
      }

      // ── draw cars ──
      members.forEach((m,i) => {
        const p=positions[i];
        const isDimmed=selIdx!==-1&&i!==selIdx;
        const isSelected=i===selIdx;
        const ld=LIVE_DATA[m.id];
        ctx.save();
        ctx.globalAlpha=isDimmed?.4:1;

        // glow
        if (ld?.memberStatus==="moving") {
          const g=.5+.5*Math.sin(f*.04+i);
          ctx.beginPath(); ctx.arc(p.x,p.y,22+g*5,0,Math.PI*2);
          ctx.fillStyle=`${m.color}${isSelected?"30":"14"}`; ctx.fill();
        }

        // car body
        ctx.save(); ctx.translate(p.x,p.y);
        const angle=-0.4+i*.28+(i===3?-0.8:0);
        ctx.rotate(angle);
        ctx.fillStyle=m.color;
        ctx.beginPath(); ctx.roundRect(-13,-8,26,16,5); ctx.fill();
        if (isSelected) {
          ctx.strokeStyle="#fff"; ctx.lineWidth=2;
          ctx.beginPath(); ctx.roundRect(-13,-8,26,16,5); ctx.stroke();
        }
        // windshield
        ctx.fillStyle="rgba(255,255,255,.32)";
        ctx.beginPath(); ctx.roundRect(-5,-5,10,7,2); ctx.fill();
        // stopped cross
        if (ld?.memberStatus==="stopped") {
          ctx.strokeStyle="#fff"; ctx.lineWidth=1.5;
          ctx.beginPath(); ctx.moveTo(-3,-3); ctx.lineTo(3,3); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(3,-3); ctx.lineTo(-3,3); ctx.stroke();
        }
        ctx.restore();

        // name tag
        ctx.font="bold 9px 'DM Sans',sans-serif";
        const nt=ctx.measureText(m.name).width+14;
        ctx.fillStyle="rgba(10,12,16,.9)";
        ctx.beginPath(); ctx.roundRect(p.x-nt/2,p.y+15,nt,17,5); ctx.fill();
        if (isSelected) {
          ctx.strokeStyle=m.color; ctx.lineWidth=1.2;
          ctx.beginPath(); ctx.roundRect(p.x-nt/2,p.y+15,nt,17,5); ctx.stroke();
        }
        ctx.fillStyle=m.color; ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillText(m.name,p.x,p.y+23.5);

        ctx.restore();
      });

      rafRef.current=requestAnimationFrame(draw);
    };
    draw();
    return ()=>cancelAnimationFrame(rafRef.current);
  }, [members, selectedId]);

  const handleClick = e => {
    const cv=canvasRef.current; if(!cv) return;
    const r=cv.getBoundingClientRect();
    const sx=cv.width/r.width, sy=cv.height/r.height;
    const cx=(e.clientX-r.left)*sx, cy=(e.clientY-r.top)*sy;
    let best=-1, bestD=44;
    posRef.current.forEach((p,i)=>{ const d=Math.hypot(p.x-cx,p.y-cy); if(d<bestD){bestD=d;best=i;} });
    onSelect(best===-1 ? null : (members[best].id===selectedId ? null : members[best].id));
  };

  return (
    <canvas ref={canvasRef} width={480} height={280}
      onClick={handleClick}
      style={{ width:"100%", height:"100%", display:"block", cursor:"pointer" }}/>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// LIVE DETAIL SCREEN  (only shown when convoy.status === "live")
// ══════════════════════════════════════════════════════════════════════════════
const LiveDetailScreen = ({ convoy, onBack, onEdit, onDelete }) => {
  const [selId, setSelId]   = useState(null);
  const [mapTab, setMapTab] = useState("map"); // map | members | info
  const [tick, setTick]     = useState(0);

  // simulate live speed/dist drift
  useEffect(()=>{
    const t=setInterval(()=>setTick(n=>n+1),3000);
    return ()=>clearInterval(t);
  },[]);

  const selMember = selId!=null ? convoy.members.find(m=>m.id===selId) : null;
  const selLive   = selId!=null ? LIVE_DATA[selId] : null;

  // leading car = member[0] (Rohan / "You")
  const leader    = convoy.members[0];

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

      {/* ── Header ── */}
      <div style={{ padding:"14px 16px 10px", display:"flex", alignItems:"center", gap:10, background:T.surface, borderBottom:`1px solid ${T.border}` }}>
        <button onClick={onBack} style={{ width:34, height:34, borderRadius:10, background:T.raised, border:`1px solid ${T.border}`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Ic d={ICONS.back} size={16} color={T.sub}/>
        </button>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:15, fontWeight:800, color:T.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{convoy.name}</div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:2 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:T.accent, animation:"pulse 1.4s infinite", display:"inline-block" }}/>
            <span style={{ fontSize:11, color:T.accent, fontWeight:700 }}>LIVE · {convoy.members.length} tracking</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          <button onClick={()=>onEdit(convoy)} style={{ width:32, height:32, borderRadius:9, background:T.raised, border:`1px solid ${T.border}`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Ic d={ICONS.edit} size={13} color={T.accent}/>
          </button>
          <button onClick={()=>onDelete(convoy)} style={{ width:32, height:32, borderRadius:9, background:T.raised, border:`1px solid ${T.border}`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Ic d={ICONS.trash} size={13} color={T.red}/>
          </button>
        </div>
      </div>

      {/* ── Trip progress bar ── */}
      <div style={{ padding:"10px 16px", background:T.surface, borderBottom:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <span style={{ fontSize:11, color:T.muted }}>Noida</span>
          <span style={{ fontSize:11, fontWeight:700, color:T.accent }}>{convoy.distance} km left</span>
          <span style={{ fontSize:11, color:T.muted }}>{convoy.destination}</span>
        </div>
        <div style={{ height:5, background:T.raised, borderRadius:5, overflow:"hidden" }}>
          <div style={{ height:"100%", width:"38%", background:`linear-gradient(90deg,${convoy.color},${convoy.color}88)`, borderRadius:5, position:"relative" }}>
            <div style={{ position:"absolute", right:0, top:-2, width:9, height:9, borderRadius:"50%", background:convoy.color, boxShadow:`0 0 8px ${convoy.color}` }}/>
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
          <span style={{ fontSize:10, color:T.muted }}>168 km done</span>
          <span style={{ fontSize:10, color:T.muted }}>ETA 4h 32m</span>
        </div>
      </div>

      {/* ── Sub-tabs ── */}
      <div style={{ display:"flex", background:T.surface, borderBottom:`1px solid ${T.border}` }}>
        {[["map","🗺 Map"],["members","👥 Members"],["info","📋 Info"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setMapTab(id)} style={{ flex:1, background:"none", border:"none", padding:"10px 0", fontSize:12, fontWeight:700, color:mapTab===id?T.accent:T.muted, borderBottom:`2px solid ${mapTab===id?T.accent:"transparent"}`, cursor:"pointer", marginBottom:-1 }}>{lbl}</button>
        ))}
      </div>

      {/* ── TAB: MAP ── */}
      {mapTab==="map" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

          {/* map canvas */}
          <div style={{ height:240, position:"relative", overflow:"hidden", background:"#0D1118" }}>
            <LiveMap members={convoy.members} selectedId={selId} onSelect={setSelId}/>

            {/* top-left: convoy color chip */}
            <div style={{ position:"absolute", top:10, left:10, background:"rgba(8,11,18,.85)", borderRadius:10, padding:"5px 10px", backdropFilter:"blur(6px)", border:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:T.accent, animation:"pulse 1.4s infinite", display:"inline-block" }}/>
              <span style={{ fontSize:10, fontWeight:700, color:T.accent }}>LIVE TRACKING</span>
            </div>

            {/* top-right: speed */}
            <div style={{ position:"absolute", top:10, right:10, background:"rgba(8,11,18,.85)", borderRadius:10, padding:"6px 10px", backdropFilter:"blur(6px)", border:`1px solid ${T.border}`, textAlign:"right" }}>
              <div style={{ fontSize:18, fontWeight:800, color:T.accent, fontFamily:"'Space Mono',monospace", lineHeight:1 }}>62</div>
              <div style={{ fontSize:8, color:T.muted, fontWeight:700, letterSpacing:1 }}>KM/H</div>
            </div>

            {/* bottom hint */}
            {!selId && (
              <div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)", background:"rgba(8,11,18,.8)", borderRadius:20, padding:"5px 14px", border:`1px solid ${T.border}`, backdropFilter:"blur(4px)" }}>
                <span style={{ fontSize:10, color:T.sub }}>Tap a car to see gaps</span>
              </div>
            )}
          </div>

          {/* gap panel when car is selected */}
          {selMember && selLive && (
            <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`, padding:"10px 14px", animation:"slideDown .25s ease" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <Avatar name={selMember.name} color={selMember.color} size={26}/>
                  <span style={{ fontSize:13, fontWeight:800, color:T.text }}>{selMember.name}</span>
                  <span style={{ fontSize:10, color:T.muted }}>→ all members</span>
                </div>
                <button onClick={()=>setSelId(null)} style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
                  <Ic d={ICONS.close} size={14} color={T.muted}/>
                </button>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                {convoy.members.filter(m=>m.id!==selId).map(m=>{
                  const ld=LIVE_DATA[m.id];
                  const warn=ld&&ld.dist>4;
                  return (
                    <div key={m.id} style={{ flex:1, background:warn?`${T.amber}12`:T.card, border:`1px solid ${warn?T.amber+"44":m.color+"33"}`, borderRadius:12, padding:"8px 6px", textAlign:"center" }}>
                      <Avatar name={m.name} color={m.color} size={22} border={warn?T.amberLo:T.card}/>
                      <div style={{ fontSize:13, fontWeight:800, color:warn?T.amber:m.color, fontFamily:"'Space Mono',monospace", marginTop:5 }}>{ld?ld.dist:"–"}</div>
                      <div style={{ fontSize:8, fontWeight:700, color:T.muted, letterSpacing:.5 }}>KM</div>
                      <div style={{ fontSize:9, color:T.muted, marginTop:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.name}</div>
                      {warn&&<div style={{ fontSize:8, color:T.amber, fontWeight:700, marginTop:1 }}>⚠ FAR</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* member quick-select strip */}
          <div style={{ padding:"10px 14px", display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none", borderBottom:`1px solid ${T.border}` }}>
            {convoy.members.map(m=>{
              const ld=LIVE_DATA[m.id];
              const active=selId===m.id;
              return (
                <button key={m.id} onClick={()=>setSelId(active?null:m.id)}
                  style={{ flexShrink:0, background:active?T.accentLo:T.card, border:`1.5px solid ${active?m.color:T.border}`, borderRadius:12, padding:"7px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:7 }}>
                  <Avatar name={m.name} color={m.color} size={24}/>
                  <div style={{ textAlign:"left" }}>
                    <div style={{ fontSize:11, fontWeight:700, color:T.text }}>{m.name}</div>
                    <div style={{ fontSize:10, color:ld?.memberStatus==="stopped"?T.amber:T.accent }}>{ld?.memberStatus==="stopped"?"Stopped":`${ld?.speed} km/h`}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* trip stats row */}
          <div style={{ display:"flex", padding:"10px 14px", gap:8 }}>
            {[
              { label:"DISTANCE", val:`${convoy.distance}km`, color:convoy.color },
              { label:"AVG SPEED", val:"60 km/h",             color:T.blue      },
              { label:"ALERT GAP", val:`${convoy.alertKm}km`, color:T.amber     },
              { label:"ETA",       val:"4h 32m",              color:T.violet    },
            ].map(s=>(
              <div key={s.label} style={{ flex:1, background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"9px 6px", textAlign:"center" }}>
                <div style={{ fontSize:13, fontWeight:800, color:s.color, fontFamily:"'Space Mono',monospace", lineHeight:1 }}>{s.val}</div>
                <div style={{ fontSize:8, color:T.muted, fontWeight:700, letterSpacing:.5, marginTop:3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: MEMBERS ── */}
      {mapTab==="members" && (
        <div style={{ flex:1, overflowY:"auto", padding:"14px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.muted, letterSpacing:.9, textTransform:"uppercase", marginBottom:10 }}>Live Member Status</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {convoy.members.map((m,i)=>{
              const ld=LIVE_DATA[m.id]||{};
              const moving=ld.memberStatus==="moving";
              const warn=ld.dist>4;
              return (
                <div key={m.id} style={{ background:T.card, border:`1.5px solid ${warn?T.amber+"44":T.border}`, borderRadius:16, padding:"14px", overflow:"hidden", position:"relative" }}>
                  {/* color accent left bar */}
                  <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:m.color, borderRadius:"16px 0 0 16px" }}/>
                  <div style={{ marginLeft:10 }}>
                    {/* row 1 */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ position:"relative" }}>
                          <Avatar name={m.name} color={m.color} size={40}/>
                          <div style={{ position:"absolute", bottom:-1, right:-1, width:12, height:12, borderRadius:"50%", background:moving?T.accent:T.amber, border:`2px solid ${T.card}` }}/>
                        </div>
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <span style={{ fontSize:14, fontWeight:800, color:T.text }}>{m.name}</span>
                            {m.role==="admin"&&<span style={{ background:T.accentLo, color:T.accent, fontSize:9, fontWeight:800, padding:"1px 7px", borderRadius:10 }}>ADMIN</span>}
                            {i===0&&<span style={{ background:T.blueLo, color:T.blue, fontSize:9, fontWeight:800, padding:"1px 7px", borderRadius:10 }}>YOU</span>}
                          </div>
                          <div style={{ fontSize:11, color:T.muted, marginTop:1 }}>{m.car}</div>
                        </div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:11, fontWeight:700, color:moving?T.accent:T.amber }}>{moving?"● Moving":"⏸ Stopped"}</div>
                        <div style={{ fontSize:10, color:T.muted, marginTop:2 }}>{ld.lastSeen}</div>
                      </div>
                    </div>

                    {/* row 2: stats chips */}
                    <div style={{ display:"flex", gap:8 }}>
                      <div style={{ flex:1, background:T.raised, borderRadius:10, padding:"7px 10px", display:"flex", alignItems:"center", gap:6 }}>
                        <Ic d={ICONS.speed} size={13} color={T.muted}/>
                        <div>
                          <div style={{ fontSize:13, fontWeight:800, color:T.text, fontFamily:"'Space Mono',monospace" }}>{ld.speed}</div>
                          <div style={{ fontSize:8, color:T.muted, fontWeight:700, letterSpacing:.5 }}>KM/H</div>
                        </div>
                      </div>
                      <div style={{ flex:1, background:T.raised, borderRadius:10, padding:"7px 10px", display:"flex", alignItems:"center", gap:6 }}>
                        <Ic d={ICONS.locate} size={13} color={warn?T.amber:T.muted}/>
                        <div>
                          <div style={{ fontSize:13, fontWeight:800, color:warn?T.amber:T.text, fontFamily:"'Space Mono',monospace" }}>{ld.dist}</div>
                          <div style={{ fontSize:8, color:warn?T.amber:T.muted, fontWeight:700, letterSpacing:.5 }}>KM AWAY</div>
                        </div>
                      </div>
                      <div style={{ flex:1, background:T.raised, borderRadius:10, padding:"7px 10px", display:"flex", alignItems:"center", gap:6 }}>
                        <Ic d={ICONS.flag} size={13} color={T.muted}/>
                        <div>
                          <div style={{ fontSize:13, fontWeight:800, color:T.text, fontFamily:"'Space Mono',monospace" }}>{ld.eta}</div>
                          <div style={{ fontSize:8, color:T.muted, fontWeight:700, letterSpacing:.5 }}>ETA</div>
                        </div>
                      </div>
                    </div>

                    {/* warn banner */}
                    {warn&&(
                      <div style={{ display:"flex", alignItems:"center", gap:7, background:T.amberLo, borderRadius:10, padding:"7px 10px", marginTop:8, border:`1px solid ${T.amber}33` }}>
                        <Ic d={ICONS.sos} size={13} color={T.amber} sw={2}/>
                        <span style={{ fontSize:11, color:T.amber, fontWeight:700 }}>{m.name} is {ld.dist}km behind — beyond {convoy.alertKm}km alert threshold</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SOS strip */}
          <div style={{ marginTop:16, background:T.redLo, border:`1.5px solid ${T.red}33`, borderRadius:16, padding:"13px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:T.red }}>🆘 SOS Emergency</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>Alerts all convoy members instantly</div>
            </div>
            <button style={{ padding:"9px 16px", background:T.red, border:"none", borderRadius:10, color:"#fff", fontSize:12, fontWeight:800, cursor:"pointer" }}>SEND SOS</button>
          </div>
        </div>
      )}

      {/* ── TAB: INFO ── */}
      {mapTab==="info" && (
        <div style={{ flex:1, overflowY:"auto", padding:"14px" }}>
          {/* hero stats */}
          <div style={{ background:`linear-gradient(135deg,${convoy.color}18,${convoy.color}06)`, border:`1px solid ${convoy.color}30`, borderRadius:18, padding:"16px", marginBottom:14 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
              {[
                { label:"DISTANCE",val:`${convoy.distance}km`,color:convoy.color },
                { label:"MEMBERS", val:convoy.members.length, color:T.blue       },
                { label:"ALERT AT",val:`${convoy.alertKm}km`, color:T.amber      },
              ].map(s=>(
                <div key={s.label} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:22, fontWeight:800, color:s.color, fontFamily:"'Space Mono',monospace", lineHeight:1 }}>{s.val}</div>
                  <div style={{ fontSize:9, color:T.muted, fontWeight:700, letterSpacing:.8, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ height:1, background:`${convoy.color}20`, margin:"14px 0" }}/>
            <div style={{ display:"flex", gap:16 }}>
              <div style={{ fontSize:12, color:T.sub }}>📅 {convoy.date}</div>
              <div style={{ fontSize:12, color:T.sub }}>🕐 Departs {convoy.time}</div>
            </div>
          </div>
          {convoy.notes&&(
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:"12px 14px", marginBottom:14, display:"flex", gap:10 }}>
              <Ic d={ICONS.note} size={15} color={T.muted}/>
              <span style={{ fontSize:12, color:T.sub, lineHeight:1.5 }}>{convoy.notes}</span>
            </div>
          )}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <button onClick={()=>onEdit(convoy)} style={{ padding:"14px", borderRadius:14, background:T.accentLo, border:`1.5px solid ${T.accent}`, color:T.accent, fontSize:14, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <Ic d={ICONS.edit} size={16} color={T.accent} sw={2}/> Edit Convoy
            </button>
            <button onClick={()=>onDelete(convoy)} style={{ padding:"14px", borderRadius:14, background:T.redLo, border:`1.5px solid ${T.red}`, color:T.red, fontSize:14, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <Ic d={ICONS.trash} size={16} color={T.red} sw={2}/> Delete Convoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// STANDARD DETAIL SCREEN (upcoming / completed)
// ══════════════════════════════════════════════════════════════════════════════
const DetailScreen = ({ convoy, onBack, onEdit, onDelete }) => (
  <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
    <div style={{ padding:"14px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${T.border}` }}>
      <button onClick={onBack} style={{ width:34, height:34, borderRadius:10, background:T.raised, border:`1px solid ${T.border}`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Ic d={ICONS.back} size={16} color={T.sub}/>
      </button>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:15, fontWeight:800, color:T.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{convoy.name}</div>
        <div style={{ fontSize:11, color:T.muted }}>{convoy.destination}</div>
      </div>
      <Badge status={convoy.status}/>
    </div>
    <div style={{ flex:1, overflowY:"auto", padding:"16px" }}>
      <div style={{ background:`linear-gradient(135deg,${convoy.color}18,${convoy.color}06)`, border:`1px solid ${convoy.color}30`, borderRadius:18, padding:"16px", marginBottom:14 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
          {[
            { label:"DISTANCE",val:`${convoy.distance}km`,color:convoy.color },
            { label:"MEMBERS", val:convoy.members.length, color:T.blue },
            { label:"ALERT AT",val:`${convoy.alertKm}km`, color:T.amber },
          ].map(s=>(
            <div key={s.label} style={{ textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:800, color:s.color, fontFamily:"'Space Mono',monospace", lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:9, color:T.muted, fontWeight:700, letterSpacing:.8, marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ height:1, background:`${convoy.color}20`, margin:"14px 0" }}/>
        <div style={{ display:"flex", gap:16 }}>
          <div style={{ fontSize:12, color:T.sub }}>📅 {convoy.date}</div>
          <div style={{ fontSize:12, color:T.sub }}>🕐 Departs {convoy.time}</div>
        </div>
      </div>
      {convoy.notes&&(
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:"12px 14px", marginBottom:14, display:"flex", gap:10 }}>
          <Ic d={ICONS.note} size={15} color={T.muted}/>
          <span style={{ fontSize:12, color:T.sub, lineHeight:1.5 }}>{convoy.notes}</span>
        </div>
      )}
      <div style={{ fontSize:11, fontWeight:700, color:T.muted, letterSpacing:.9, textTransform:"uppercase", marginBottom:10 }}>Members · {convoy.members.length}</div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
        {convoy.members.map(m=>(
          <div key={m.id} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:"11px 14px", display:"flex", alignItems:"center", gap:11 }}>
            <Avatar name={m.name} color={m.color} size={38}/>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:13, fontWeight:700, color:T.text }}>{m.name}</span>
                {m.role==="admin"&&<span style={{ background:T.accentLo, color:T.accent, fontSize:9, fontWeight:800, padding:"1px 7px", borderRadius:10, letterSpacing:.6 }}>ADMIN</span>}
              </div>
              <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{m.car}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <button onClick={()=>onEdit(convoy)} style={{ padding:"14px", borderRadius:14, background:T.accentLo, border:`1.5px solid ${T.accent}`, color:T.accent, fontSize:14, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <Ic d={ICONS.edit} size={16} color={T.accent} sw={2}/> Edit Convoy
        </button>
        <button onClick={()=>onDelete(convoy)} style={{ padding:"14px", borderRadius:14, background:T.redLo, border:`1.5px solid ${T.red}`, color:T.red, fontSize:14, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <Ic d={ICONS.trash} size={16} color={T.red} sw={2}/> Delete Convoy
        </button>
      </div>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// FORM SHEET
// ══════════════════════════════════════════════════════════════════════════════
const FormSheet = ({ convoy, onSave, onClose }) => {
  const editing=!!convoy?.id;
  const blank={ name:"",destination:"",date:"",time:"",alertKm:5,notes:"",color:T.accent,status:"upcoming",members:[] };
  const [form,setForm]=useState(convoy?{...convoy,members:convoy.members.map(m=>({...m}))}:blank);
  const [tab,setTab]=useState("details");
  const [mName,setMName]=useState(""); const [mCar,setMCar]=useState("");
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const valid=form.name.trim()&&form.destination.trim()&&form.date;
  const addMember=()=>{
    if(!mName.trim())return;
    const initials=mName.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
    const color=MC[form.members.length%MC.length];
    set("members",[...form.members,{id:Date.now(),name:mName.trim(),initials,car:mCar.trim()||"Vehicle TBD",color,role:form.members.length===0?"admin":"member"}]);
    setMName(""); setMCar("");
  };
  return (
    <div style={{ position:"absolute",inset:0,zIndex:50,display:"flex",flexDirection:"column" }}>
      <div style={{ flex:"0 0 60px",background:"rgba(4,6,10,.6)",backdropFilter:"blur(4px)" }} onClick={onClose}/>
      <div style={{ flex:1,background:T.surface,borderRadius:"22px 22px 0 0",display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"0 -20px 60px rgba(0,0,0,.6)" }}>
        <div style={{ padding:"10px 18px 0" }}>
          <div style={{ width:36,height:4,background:T.border,borderRadius:4,margin:"0 auto 12px" }}/>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
            <div>
              <div style={{ fontSize:17,fontWeight:800,color:T.text }}>{editing?"Edit Convoy":"New Convoy"}</div>
              <div style={{ fontSize:11,color:T.muted,marginTop:1 }}>{editing?convoy.name:"Set up a new group trip"}</div>
            </div>
            <button onClick={onClose} style={{ width:32,height:32,borderRadius:10,background:T.card,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Ic d={ICONS.close} size={14} color={T.sub}/>
            </button>
          </div>
          <div style={{ display:"flex",borderBottom:`1px solid ${T.border}` }}>
            {[["details","Details"],["members",`Members (${form.members.length})`]].map(([id,lbl])=>(
              <button key={id} onClick={()=>setTab(id)} style={{ flex:1,background:"none",border:"none",padding:"9px 0",fontSize:13,fontWeight:700,color:tab===id?T.accent:T.muted,borderBottom:`2px solid ${tab===id?T.accent:"transparent"}`,marginBottom:-1,cursor:"pointer" }}>{lbl}</button>
            ))}
          </div>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:"16px 18px" }}>
          {tab==="details"&&(
            <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
              <Field label="Convoy Name" value={form.name} onChange={v=>set("name",v)} placeholder="e.g. Delhi Road Trip"/>
              <Field label="Destination" value={form.destination} onChange={v=>set("destination",v)} placeholder="e.g. New Delhi, India"/>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                <Field label="Date" type="date" value={form.date} onChange={v=>set("date",v)}/>
                <Field label="Time" type="time" value={form.time} onChange={v=>set("time",v)}/>
              </div>
              <div>
                <div style={{ fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase",marginBottom:8 }}>Alert Distance</div>
                <div style={{ display:"flex",gap:8 }}>
                  {[2,5,10,20].map(km=>(
                    <button key={km} onClick={()=>set("alertKm",km)} style={{ flex:1,padding:"10px 0",borderRadius:10,border:`1.5px solid ${form.alertKm===km?T.amber:T.border}`,background:form.alertKm===km?T.amberLo:T.raised,color:form.alertKm===km?T.amber:T.muted,fontSize:13,fontWeight:700,cursor:"pointer" }}>{km}km</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase",marginBottom:8 }}>Color Tag</div>
                <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
                  {MC.map(c=>(
                    <button key={c} onClick={()=>set("color",c)} style={{ width:30,height:30,borderRadius:"50%",background:c,border:`3px solid ${form.color===c?"#fff":"transparent"}`,boxShadow:form.color===c?`0 0 0 2px ${c}55`:"none",cursor:"pointer" }}/>
                  ))}
                </div>
              </div>
              {editing&&(
                <div>
                  <div style={{ fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase",marginBottom:8 }}>Status</div>
                  <div style={{ display:"flex",gap:8 }}>
                    {Object.entries(STATUS).map(([key,s])=>(
                      <button key={key} onClick={()=>set("status",key)} style={{ flex:1,padding:"10px 0",borderRadius:10,border:`1.5px solid ${form.status===key?s.dot:T.border}`,background:form.status===key?s.bg:T.raised,color:form.status===key?s.dot:T.muted,fontSize:12,fontWeight:700,cursor:"pointer" }}>{s.label}</button>
                    ))}
                  </div>
                </div>
              )}
              <FieldArea label="Notes" value={form.notes} onChange={v=>set("notes",v)} placeholder="Meeting point, fuel stops, route notes…"/>
            </div>
          )}
          {tab==="members"&&(
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {form.members.length===0&&<div style={{ textAlign:"center",padding:"20px 0",fontSize:12,color:T.muted }}>No members yet.</div>}
              {form.members.map(m=>(
                <div key={m.id} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"10px 12px",display:"flex",alignItems:"center",gap:10 }}>
                  <Avatar name={m.name} color={m.color} size={36}/>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                      <span style={{ fontSize:13,fontWeight:700,color:T.text }}>{m.name}</span>
                      {m.role==="admin"&&<span style={{ background:T.accentLo,color:T.accent,fontSize:9,fontWeight:800,padding:"1px 7px",borderRadius:10 }}>ADMIN</span>}
                    </div>
                    <div style={{ fontSize:11,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{m.car}</div>
                  </div>
                  <button onClick={()=>set("members",form.members.filter(x=>x.id!==m.id))} style={{ width:28,height:28,borderRadius:8,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <Ic d={ICONS.close} size={12} color={T.red}/>
                  </button>
                </div>
              ))}
              <div style={{ background:T.raised,border:`1.5px dashed ${T.borderHi}`,borderRadius:14,padding:"14px" }}>
                <div style={{ fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase",marginBottom:10 }}>Add Member</div>
                <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                  <Field value={mName} onChange={setMName} placeholder="Member name"/>
                  <Field value={mCar}  onChange={setMCar}  placeholder="Car · Number (optional)"/>
                  <button onClick={addMember} disabled={!mName.trim()} style={{ padding:"11px",borderRadius:10,background:mName.trim()?T.accentLo:T.card,border:`1.5px solid ${mName.trim()?T.accent:T.border}`,color:mName.trim()?T.accent:T.muted,fontSize:13,fontWeight:700,cursor:mName.trim()?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
                    <Ic d={ICONS.plus} size={14} color={mName.trim()?T.accent:T.muted} sw={2.2}/> Add Member
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div style={{ padding:"12px 18px 20px",borderTop:`1px solid ${T.border}` }}>
          <button onClick={()=>valid&&onSave({...form,id:convoy?.id||Date.now()})} disabled={!valid}
            style={{ width:"100%",padding:"15px",borderRadius:14,background:valid?T.accent:T.muted,border:"none",color:valid?"#080B12":T.surface,fontSize:15,fontWeight:800,cursor:valid?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
            <Ic d={ICONS.check} size={17} color={valid?"#080B12":T.surface} sw={2.5}/>{editing?"Save Changes":"Create Convoy"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Delete Sheet ──────────────────────────────────────────────────────────────
const DeleteSheet = ({ convoy, onConfirm, onClose }) => (
  <div style={{ position:"absolute",inset:0,zIndex:60,display:"flex",flexDirection:"column" }}>
    <div style={{ flex:1,background:"rgba(4,6,10,.7)",backdropFilter:"blur(4px)" }} onClick={onClose}/>
    <div style={{ background:T.surface,borderRadius:"22px 22px 0 0",padding:"20px 22px 30px",boxShadow:"0 -20px 60px rgba(0,0,0,.6)" }}>
      <div style={{ width:36,height:4,background:T.border,borderRadius:4,margin:"0 auto 20px" }}/>
      <div style={{ width:52,height:52,borderRadius:16,background:T.redLo,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14 }}>
        <Ic d={ICONS.trash} size={24} color={T.red} sw={1.8}/>
      </div>
      <div style={{ fontSize:18,fontWeight:800,color:T.text,marginBottom:8 }}>Delete Convoy?</div>
      <div style={{ fontSize:13,color:T.sub,lineHeight:1.6,marginBottom:24 }}>
        "<span style={{ color:T.text,fontWeight:700 }}>{convoy.name}</span>" will be permanently removed.
      </div>
      <div style={{ display:"flex",gap:10 }}>
        <button onClick={onClose} style={{ flex:1,padding:"14px",borderRadius:14,background:T.card,border:`1px solid ${T.border}`,color:T.sub,fontSize:14,fontWeight:700,cursor:"pointer" }}>Cancel</button>
        <button onClick={onConfirm} style={{ flex:1,padding:"14px",borderRadius:14,background:T.red,border:"none",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer" }}>Delete</button>
      </div>
    </div>
  </div>
);

// ── Convoy Card ───────────────────────────────────────────────────────────────
const ConvoyCard = ({ convoy, onTap, onEdit, onDelete }) => (
  <div onClick={()=>onTap(convoy)} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,overflow:"hidden",cursor:"pointer" }}>
    <div style={{ height:3,background:`linear-gradient(90deg,${convoy.color},${convoy.color}44)` }}/>
    <div style={{ padding:"14px 15px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ fontSize:15,fontWeight:800,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:4 }}>{convoy.name}</div>
          <div style={{ display:"flex",alignItems:"center",gap:5 }}>
            <Ic d={ICONS.map} size={11} color={T.muted}/>
            <span style={{ fontSize:11,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{convoy.destination}</span>
          </div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:6,marginLeft:10 }}>
          <Badge status={convoy.status}/>
          <button onClick={e=>{e.stopPropagation();onEdit(convoy);}} style={{ width:28,height:28,borderRadius:8,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Ic d={ICONS.edit} size={12} color={T.accent}/>
          </button>
          <button onClick={e=>{e.stopPropagation();onDelete(convoy);}} style={{ width:28,height:28,borderRadius:8,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Ic d={ICONS.trash} size={12} color={T.red}/>
          </button>
        </div>
      </div>
      <div style={{ display:"flex",gap:14,marginBottom:12 }}>
        <span style={{ fontSize:11,color:T.sub }}>📅 {convoy.date}</span>
        <span style={{ fontSize:11,color:T.sub }}>🕐 {convoy.time}</span>
        <span style={{ fontSize:11,color:convoy.color,fontWeight:700,fontFamily:"'Space Mono',monospace" }}>{convoy.distance}km</span>
      </div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <AvatarStack members={convoy.members} max={4}/>
        <div style={{ display:"flex",alignItems:"center",gap:5 }}>
          <Ic d={ICONS.users} size={11} color={T.muted}/>
          <span style={{ fontSize:11,color:T.muted }}>{convoy.members.length} member{convoy.members.length!==1&&"s"}</span>
          <Ic d={ICONS.chevron} size={13} color={T.muted}/>
        </div>
      </div>
    </div>
  </div>
);

// ── Home Screen ───────────────────────────────────────────────────────────────
const HomeScreen = ({ convoys, onTap, onEdit, onDelete, onNew }) => {
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("all");
  const filtered=convoys.filter(c=>(filter==="all"||c.status===filter)&&(c.name.toLowerCase().includes(search.toLowerCase())||c.destination.toLowerCase().includes(search.toLowerCase())));
  const live=convoys.filter(c=>c.status==="live");
  return (
    <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
      <div style={{ padding:"16px 18px 12px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16 }}>
          <div>
            <div style={{ fontSize:22,fontWeight:800,color:T.text,lineHeight:1.1 }}>My Convoys</div>
            <div style={{ fontSize:12,color:T.muted,marginTop:3 }}>{convoys.length} trips · {live.length} live</div>
          </div>
          <button onClick={onNew} style={{ width:40,height:40,borderRadius:13,background:T.accent,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 20px ${T.accent}44` }}>
            <Ic d={ICONS.plus} size={18} color="#080B12" sw={2.5}/>
          </button>
        </div>
        {live.length>0&&(
          <div onClick={()=>onTap(live[0])} style={{ background:`linear-gradient(135deg,${live[0].color}20,${live[0].color}08)`,border:`1px solid ${live[0].color}40`,borderRadius:16,padding:"12px 14px",marginBottom:14,cursor:"pointer",display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:36,height:36,borderRadius:12,background:`${live[0].color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>🚗</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:2 }}>
                <span style={{ width:6,height:6,borderRadius:"50%",background:live[0].color,animation:"pulse 1.4s infinite",display:"inline-block" }}/>
                <span style={{ fontSize:12,fontWeight:800,color:live[0].color }}>LIVE NOW</span>
              </div>
              <div style={{ fontSize:14,fontWeight:700,color:T.text }}>{live[0].name}</div>
              <div style={{ fontSize:11,color:T.sub }}>{live[0].members.length} members tracking · {live[0].distance}km</div>
            </div>
            <Ic d={ICONS.chevron} size={16} color={live[0].color}/>
          </div>
        )}
        <div style={{ position:"relative",marginBottom:12 }}>
          <div style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)" }}><Ic d={ICONS.search} size={14} color={T.muted}/></div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search convoys…"
            style={{ width:"100%",background:T.card,border:`1.5px solid ${T.border}`,borderRadius:12,padding:"11px 12px 11px 36px",fontSize:13,color:T.text,outline:"none",boxSizing:"border-box",fontFamily:"inherit" }}
            onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
        </div>
        <div style={{ display:"flex",gap:7,overflowX:"auto",scrollbarWidth:"none" }}>
          {[["all","All"],["live","Live"],["upcoming","Upcoming"],["completed","Done"]].map(([val,lbl])=>(
            <button key={val} onClick={()=>setFilter(val)} style={{ flexShrink:0,padding:"6px 16px",borderRadius:20,border:`1.5px solid ${filter===val?T.accent:T.border}`,background:filter===val?T.accentLo:T.card,color:filter===val?T.accent:T.muted,fontSize:12,fontWeight:700,cursor:"pointer" }}>{lbl}</button>
          ))}
        </div>
      </div>
      <div style={{ display:"flex",gap:10,padding:"0 18px 14px",overflowX:"auto",scrollbarWidth:"none" }}>
        {[
          {label:"Total",   val:convoys.length,                               color:T.accent },
          {label:"Live",    val:convoys.filter(c=>c.status==="live").length,   color:T.red    },
          {label:"Upcoming",val:convoys.filter(c=>c.status==="upcoming").length,color:T.blue  },
          {label:"Members", val:[...new Set(convoys.flatMap(c=>c.members.map(m=>m.name)))].length,color:T.violet},
        ].map(s=>(
          <div key={s.label} style={{ flexShrink:0,background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"10px 16px",minWidth:70,textAlign:"center" }}>
            <div style={{ fontSize:20,fontWeight:800,color:s.color,fontFamily:"'Space Mono',monospace" }}>{s.val}</div>
            <div style={{ fontSize:10,color:T.muted,fontWeight:700,marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:"0 18px 10px",display:"flex",flexDirection:"column",gap:12 }}>
        {filtered.length===0?(
          <div style={{ textAlign:"center",padding:"40px 0",color:T.muted }}>
            <div style={{ fontSize:36,marginBottom:12 }}>🚘</div>
            <div style={{ fontSize:14,fontWeight:700,color:T.sub,marginBottom:6 }}>No convoys found</div>
            <div style={{ fontSize:12 }}>Tap + to create your first convoy</div>
          </div>
        ):filtered.map(c=><ConvoyCard key={c.id} convoy={c} onTap={onTap} onEdit={onEdit} onDelete={onDelete}/>)}
      </div>
    </div>
  );
};

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [convoys,   setConvoys]   = useState(SEED);
  const [screen,    setScreen]    = useState("home");
  const [activeC,   setActiveC]   = useState(null);
  const [sheet,     setSheet]     = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [toast,     setToast]     = useState(null);
  const [navTab,    setNavTab]    = useState("home");

  const flash=(msg,type="ok")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),2600); };

  const handleSave=data=>{
    if(convoys.find(c=>c.id===data.id)){
      setConvoys(cs=>cs.map(c=>c.id===data.id?{...c,...data}:c));
      if(activeC?.id===data.id) setActiveC(prev=>({...prev,...data}));
      flash(`"${data.name}" updated`);
    } else {
      setConvoys(cs=>[{...data,distance:Math.floor(200+Math.random()*600)},...cs]);
      flash(`"${data.name}" created!`);
    }
    setSheet(null);
  };

  const handleDelete=()=>{
    const name=delTarget.name;
    setConvoys(cs=>cs.filter(c=>c.id!==delTarget.id));
    setDelTarget(null);
    if(activeC?.id===delTarget.id){setScreen("home");setActiveC(null);}
    flash(`"${name}" deleted`,"warn");
  };

  const liveConvoy=c=>c.status==="live";

  return (
    <div style={{ fontFamily:"'DM Sans','Nunito',system-ui,sans-serif",background:"#050709",minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"flex-start",padding:"24px 16px" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700;800&family=Space+Mono:wght@700&display=swap" rel="stylesheet"/>

      <div style={{ width:"100%",maxWidth:390,background:T.bg,borderRadius:44,border:"1px solid #1C2333",boxShadow:"0 40px 90px rgba(0,0,0,.75),0 0 0 1px rgba(255,255,255,.04)",overflow:"hidden",minHeight:820,display:"flex",flexDirection:"column",position:"relative" }}>

        {/* status bar */}
        <div style={{ padding:"14px 24px 8px",display:"flex",justifyContent:"space-between",alignItems:"center",background:T.surface }}>
          <span style={{ fontFamily:"'Space Mono',monospace",fontSize:12,fontWeight:700,color:T.accent,letterSpacing:1.2 }}>CONVOY</span>
          <div style={{ display:"flex",gap:10,alignItems:"center" }}>
            <span style={{ fontSize:10,color:T.muted }}>9:41</span>
            <Avatar name="Rohan" color={T.accent} size={26} border={T.surface}/>
          </div>
        </div>

        {/* screen */}
        <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
          {screen==="home"&&(
            <HomeScreen convoys={convoys} onTap={c=>{setActiveC(c);setScreen("detail");}} onEdit={c=>setSheet(c)} onDelete={c=>setDelTarget(c)} onNew={()=>setSheet("create")}/>
          )}
          {screen==="detail"&&activeC&&(
            liveConvoy(convoys.find(c=>c.id===activeC.id)||activeC)
              ? <LiveDetailScreen
                  convoy={convoys.find(c=>c.id===activeC.id)||activeC}
                  onBack={()=>{setScreen("home");setActiveC(null);}}
                  onEdit={c=>setSheet(c)}
                  onDelete={c=>setDelTarget(c)}/>
              : <DetailScreen
                  convoy={convoys.find(c=>c.id===activeC.id)||activeC}
                  onBack={()=>{setScreen("home");setActiveC(null);}}
                  onEdit={c=>setSheet(c)}
                  onDelete={c=>setDelTarget(c)}/>
          )}
        </div>

        {/* bottom nav */}
        <div style={{ background:T.surface,borderTop:`1px solid ${T.border}`,padding:"10px 8px 18px",display:"flex" }}>
          {[{id:"home",icon:ICONS.home,label:"Convoys"},{id:"map",icon:ICONS.map,label:"Map"},{id:"bell",icon:ICONS.bell,label:"Alerts"},{id:"users",icon:ICONS.users,label:"Members"}].map(n=>(
            <button key={n.id} onClick={()=>{setNavTab(n.id);if(n.id==="home"){setScreen("home");setActiveC(null);}}}
              style={{ flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"6px 4px" }}>
              <div style={{ width:40,height:30,borderRadius:10,background:navTab===n.id?T.accentLo:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"background .2s" }}>
                <Ic d={n.icon} size={17} color={navTab===n.id?T.accent:T.muted} sw={navTab===n.id?2:1.6}/>
              </div>
              <span style={{ fontSize:10,fontWeight:navTab===n.id?700:500,color:navTab===n.id?T.accent:T.muted }}>{n.label}</span>
            </button>
          ))}
        </div>

        {sheet!==null&&<FormSheet convoy={sheet==="create"?null:sheet} onSave={handleSave} onClose={()=>setSheet(null)}/>}
        {delTarget&&<DeleteSheet convoy={delTarget} onConfirm={handleDelete} onClose={()=>setDelTarget(null)}/>}

        {toast&&(
          <div style={{ position:"absolute",bottom:90,left:"50%",transform:"translateX(-50%)",background:toast.type==="warn"?T.amberLo:T.accentLo,border:`1px solid ${toast.type==="warn"?T.amber:T.accent}`,borderRadius:12,padding:"11px 18px",display:"flex",alignItems:"center",gap:9,boxShadow:"0 8px 30px rgba(0,0,0,.5)",animation:"slideUp .3s ease",whiteSpace:"nowrap",zIndex:99 }}>
            <Ic d={toast.type==="warn"?ICONS.trash:ICONS.check} size={14} color={toast.type==="warn"?T.amber:T.accent} sw={2.2}/>
            <span style={{ fontSize:13,fontWeight:700,color:toast.type==="warn"?T.amber:T.accent }}>{toast.msg}</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes slideUp  { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes slideDown{ from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{display:none;}
        input::placeholder,textarea::placeholder{color:#3D4D6A;}
        input[type="date"],input[type="time"]{color-scheme:dark;}
      `}</style>
    </div>
  );
}
