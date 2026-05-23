import { useState, useEffect, useRef, createContext, useContext } from "react";

// ══════════════════════════════════════════════════════════════════════════════
// THEME SYSTEM
// ══════════════════════════════════════════════════════════════════════════════
const DARK = {
  bg:"#080B12", surface:"#0E1219", card:"#131820", raised:"#181F2B",
  border:"#1C2333", borderHi:"#2A3550",
  accent:"#3DD68C", accentLo:"#152D20", accentHi:"#5AEFAA",
  blue:"#4A9EFF",   blueLo:"#0D1E38",
  violet:"#9B6EFF",
  amber:"#F5A623",  amberLo:"#2E1E00",
  red:"#FF4F4F",    redLo:"#2E0E0E",
  text:"#EEF2FF",   sub:"#8895B3",   muted:"#3D4D6A",
  isDark: true,
  mapBg:"#0D1118", mapRoad:"#1A2030", mapDash:"#1E2840", mapBlock:"#111820",
  pillBg:"rgba(10,12,16,.92)", nameBg:"rgba(10,12,16,.9)",
};
const LIGHT = {
  bg:"#F0F4FC", surface:"#FFFFFF", card:"#FFFFFF", raised:"#F5F8FF",
  border:"#DDE5F4", borderHi:"#B8CAEE",
  accent:"#1DB870", accentLo:"#D4F5E5", accentHi:"#15A060",
  blue:"#2B7FFF",   blueLo:"#DBE9FF",
  violet:"#7B52FF",
  amber:"#E08800",  amberLo:"#FFF3D0",
  red:"#E03030",    redLo:"#FFE0E0",
  text:"#0D1528",   sub:"#4A5880",   muted:"#9BAAC8",
  isDark: false,
  mapBg:"#E8EEF8", mapRoad:"#CDD8EE", mapDash:"#B8C8E4", mapBlock:"#DBE4F4",
  pillBg:"rgba(255,255,255,.95)", nameBg:"rgba(255,255,255,.93)",
};

const ThemeCtx = createContext(DARK);
const useT = () => useContext(ThemeCtx);

// ── Status badges per theme ───────────────────────────────────────────────────
const getStatus = T => ({
  live:      { label:"Live",     dot:T.accent,  bg:T.accentLo, text:T.accent  },
  upcoming:  { label:"Upcoming", dot:T.blue,    bg:T.blueLo,   text:T.blue    },
  completed: { label:"Done",     dot:T.muted,   bg:T.raised,   text:T.muted   },
});

// ── Static data ───────────────────────────────────────────────────────────────
const MC = ["#3DD68C","#4A9EFF","#9B6EFF","#F5A623","#FF4F4F","#00C4EE","#FF6B9D","#FFD166"];
const LIVE_DATA = {
  1:{ speed:62, dist:0,   eta:"0 min",  memberStatus:"moving",  lastSeen:"now"    },
  2:{ speed:58, dist:1.2, eta:"2 min",  memberStatus:"moving",  lastSeen:"now"    },
  3:{ speed:0,  dist:2.8, eta:"5 min",  memberStatus:"stopped", lastSeen:"1m ago" },
  4:{ speed:0,  dist:5.4, eta:"9 min",  memberStatus:"stopped", lastSeen:"3m ago" },
};
const CAR_POS = [
  {x:.30,y:.52},{x:.38,y:.42},{x:.22,y:.64},{x:.13,y:.36},
];
const SEED = [
  { id:1,name:"Delhi Road Trip",   destination:"New Delhi",  date:"2025-06-22",time:"08:00",status:"live",     distance:287,alertKm:5,  notes:"Depart Sector 18. Fuel before highway.",   color:"#3DD68C",
    members:[{id:1,name:"Rohan",initials:"RO",color:"#3DD68C",car:"Swift · DL4C 1234",   role:"admin", avatar:"https://randomuser.me/api/portraits/men/32.jpg"  },{id:2,name:"Rahul",initials:"RA",color:"#4A9EFF",car:"Innova · UP32 5567",  role:"member",avatar:"https://randomuser.me/api/portraits/men/45.jpg"  },{id:3,name:"Priya",initials:"PR",color:"#F5A623",car:"Creta · HR26 8890",   role:"member",avatar:"https://randomuser.me/api/portraits/women/44.jpg"},{id:4,name:"Aman", initials:"AM",color:"#C36EFF",car:"Fortuner · PB10 4412",role:"member",avatar:"https://randomuser.me/api/portraits/men/22.jpg"}]},
  { id:2,name:"Goa Beach Weekend", destination:"Goa",        date:"2025-07-04",time:"06:30",status:"upcoming", distance:593,alertKm:10, notes:"Book toll tags. Leave early.",              color:"#4A9EFF",
    members:[{id:5,name:"Sneha", initials:"SN",color:"#4A9EFF",car:"Nexon · MH02 3310",  role:"admin" },{id:6,name:"Vikram",initials:"VI",color:"#9B6EFF",car:"Scorpio · KA01 8821",role:"member"}]},
  { id:3,name:"Manali Expedition", destination:"Manali, HP", date:"2025-08-15",time:"04:00",status:"upcoming", distance:536,alertKm:5,  notes:"Spare tyre. Rohtang permit required.",      color:"#9B6EFF",
    members:[{id:7,name:"Arjun", initials:"AR",color:"#9B6EFF",car:"Thar · HP07 7744",   role:"admin" },{id:8,name:"Meera", initials:"ME",color:"#F5A623",car:"XUV700 · DL8C 5511",role:"member"},{id:9,name:"Dev",  initials:"DE",color:"#3DD68C",car:"Bolero · PB08 2293", role:"member"},{id:10,name:"Anjali",initials:"AN",color:"#4A9EFF",car:"Creta · HP09 6612",  role:"member"},{id:11,name:"Kartik",initials:"KA",color:"#FF4F4F",car:"Swift · HR12 0021",  role:"member"}]},
  { id:4,name:"Jaipur Day Trip",   destination:"Jaipur, RJ", date:"2025-05-10",time:"07:00",status:"completed",distance:282,alertKm:2,  notes:"Completed. Total time: 5h 20m.",           color:"#F5A623",
    members:[{id:12,name:"Pooja", initials:"PO",color:"#F5A623",car:"Verna · RJ14 4432", role:"admin" },{id:13,name:"Saurav",initials:"SA",color:"#3DD68C",car:"Brezza · DL6C 9981",role:"member"},{id:14,name:"Nisha", initials:"NI",color:"#4A9EFF",car:"Baleno · UP16 7732",role:"member"}]},
];

// ── Icons ─────────────────────────────────────────────────────────────────────
const Ic = ({ d, size=16, color, sw=1.6 }) => {
  const T = useT();
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{flexShrink:0,display:"block"}}>
      <path d={d} stroke={color||T.sub} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};
const ICONS = {
  plus:"M12 5v14M5 12h14", edit:"M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:"M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6", close:"M18 6L6 18M6 6l12 12",
  map:"M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
  users:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  bell:"M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  check:"M20 6L9 17l-5-5", search:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  home:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
  flag:"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7",
  chevron:"M9 18l6-6-6-6", note:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  back:"M19 12H5M12 19l-7-7 7-7", speed:"M12 2a10 10 0 11-6.88 17.23M12 6v6l3 3",
  sos:"M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
  locate:"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  sun:"M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
  moon:"M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
};

// ── Themed helpers ────────────────────────────────────────────────────────────
const Avatar = ({ name, color, size=32 }) => {
  const T = useT();
  return (
    <div style={{width:size,height:size,borderRadius:"50%",background:color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.3,fontWeight:800,color:"#fff",flexShrink:0,border:`2px solid ${T.card}`,letterSpacing:-.5}}>
      {name.slice(0,2).toUpperCase()}
    </div>
  );
};
const AvatarStack = ({ members, max=4 }) => {
  const T = useT();
  const vis=members.slice(0,max), extra=members.length-max;
  return (
    <div style={{display:"flex"}}>
      {vis.map((m,i)=><div key={m.id} style={{marginLeft:i===0?0:-7,zIndex:vis.length-i}}><Avatar name={m.name} color={m.color} size={24}/></div>)}
      {extra>0&&<div style={{marginLeft:-7,width:24,height:24,borderRadius:"50%",background:T.raised,border:`2px solid ${T.card}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,color:T.sub}}>+{extra}</div>}
    </div>
  );
};
const Badge = ({ status }) => {
  const T = useT();
  const s = getStatus(T)[status];
  return (
    <span style={{background:s.bg,color:s.text,border:`1px solid ${s.text}30`,borderRadius:20,padding:"2px 9px",fontSize:10,fontWeight:700,letterSpacing:.5,display:"inline-flex",alignItems:"center",gap:4}}>
      <span style={{width:5,height:5,borderRadius:"50%",background:s.dot,display:"inline-block",...(status==="live"?{animation:"pulse 1.4s infinite"}:{})}}/>
      {s.label}
    </span>
  );
};
const Field = ({ label, value, onChange, placeholder, type="text" }) => {
  const T = useT();
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {label&&<label style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase"}}>{label}</label>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{background:T.raised,border:`1.5px solid ${T.border}`,borderRadius:10,padding:"11px 13px",fontSize:13,color:T.text,outline:"none",width:"100%",boxSizing:"border-box",fontFamily:"inherit"}}
        onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
    </div>
  );
};
const FieldArea = ({ label, value, onChange, placeholder }) => {
  const T = useT();
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {label&&<label style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase"}}>{label}</label>}
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3}
        style={{background:T.raised,border:`1.5px solid ${T.border}`,borderRadius:10,padding:"11px 13px",fontSize:13,color:T.text,outline:"none",width:"100%",boxSizing:"border-box",fontFamily:"inherit",resize:"none"}}
        onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// LIVE MAP CANVAS  (theme-aware, resolution-matched, avatar-aware)
// ══════════════════════════════════════════════════════════════════════════════
const LiveMap = ({ members, selectedId, onSelect }) => {
  const T      = useT();
  const cvR    = useRef(null);
  const wrapR  = useRef(null);
  const raf    = useRef(null);
  const fr     = useRef(0);
  const pos    = useRef([]);
  const dimR   = useRef({ W: 480, H: 280 });
  const imgs   = useRef({});  // cache of loaded Image objects keyed by member id

  // Preload avatar images for members that have one
  useEffect(() => {
    members.forEach(m => {
      if (!m.avatar || imgs.current[m.id]) return;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = m.avatar;
      img.onload = () => { imgs.current[m.id] = img; };
    });
  }, [members]);

  // Resize canvas to exactly match its container, sharp at any DPR
  useEffect(() => {
    const wrap = wrapR.current;
    if (!wrap) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      const dpr = window.devicePixelRatio || 1;
      const cv  = cvR.current;
      if (!cv) return;
      cv.width  = Math.round(width  * dpr);
      cv.height = Math.round(height * dpr);
      cv.style.width  = width  + "px";
      cv.style.height = height + "px";
      const ctx = cv.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dimR.current = { W: width, H: height };
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const cv=cvR.current; if(!cv) return;
    const ctx=cv.getContext("2d");

    const draw=()=>{
      fr.current++;
      const f=fr.current;
      const {W,H}=dimR.current;
      ctx.clearRect(0,0,W,H);

      // bg
      ctx.fillStyle=T.mapBg; ctx.fillRect(0,0,W,H);

      // roads
      const roads=[[0,H*.52,W,H*.52],[W*.28,0,W*.28,H],[W*.68,0,W*.68,H],[0,H*.22,W,H*.36],[0,H*.72,W,H*.66],[0,H*.85,W*.55,H*.80]];
      roads.forEach(([x1,y1,x2,y2])=>{
        ctx.strokeStyle=T.mapRoad; ctx.lineWidth=14; ctx.lineCap="round";
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
        ctx.strokeStyle=T.mapDash; ctx.lineWidth=1.5; ctx.setLineDash([10,9]);
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
        ctx.setLineDash([]);
      });

      // blocks
      ctx.fillStyle=T.mapBlock;
      [[42,42,130,90],[195,42,110,75],[345,42,85,88],[42,195,85,115],[195,200,115,95],[42,378,150,88],[345,200,88,128],[225,378,98,82],[368,378,78,98]]
        .forEach(([x,y,w,h])=>{ctx.beginPath();ctx.roundRect(x,y,w,h,4);ctx.fill();});

      // route
      const route=[[55,H*.52],[W*.28,H*.36],[W*.58,H*.26],[W-38,H*.20]];
      ctx.strokeStyle=T.isDark?"rgba(61,214,140,.45)":"rgba(29,184,112,.5)"; ctx.lineWidth=3; ctx.setLineDash([8,5]);
      ctx.beginPath(); route.forEach(([x,y],i)=>i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)); ctx.stroke(); ctx.setLineDash([]);

      // destination
      const [dx,dy]=[W-38,H*.20], pulse=.5+.5*Math.sin(f*.05);
      ctx.beginPath(); ctx.arc(dx,dy,18+pulse*8,0,Math.PI*2);
      ctx.fillStyle=T.isDark?`rgba(61,214,140,${.07+pulse*.05})`:`rgba(29,184,112,${.1+pulse*.07})`; ctx.fill();
      ctx.beginPath(); ctx.arc(dx,dy,10,0,Math.PI*2); ctx.fillStyle=T.accent; ctx.fill();
      ctx.fillStyle="#fff"; ctx.font="bold 9px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText("D",dx,dy);

      const selIdx=selectedId!=null?members.findIndex(m=>m.id===selectedId):-1;
      const positions=members.map((_,i)=>{
        const b=CAR_POS[i]||{x:.5,y:.5};
        return {x:W*b.x+Math.sin(f*.018+i*1.3)*3, y:H*b.y+Math.cos(f*.014+i*0.9)*2};
      });
      pos.current=positions;

      // gap lines
      if(selIdx!==-1){
        const src=positions[selIdx];
        members.forEach((m,i)=>{
          if(i===selIdx) return;
          const dst=positions[i], ld=LIVE_DATA[m.id], warn=ld&&ld.dist>4;
          ctx.save(); ctx.setLineDash([8,6]); ctx.lineDashOffset=-(f*.55)%14;
          ctx.strokeStyle=warn?"rgba(224,136,0,.85)":`${m.color}BB`; ctx.lineWidth=2;
          ctx.beginPath(); ctx.moveTo(src.x,src.y); ctx.lineTo(dst.x,dst.y); ctx.stroke();
          ctx.setLineDash([]); ctx.restore();
          // pill
          const mx=(src.x+dst.x)/2, my=(src.y+dst.y)/2, label=ld?`${ld.dist} km`:"–";
          ctx.font="bold 10px 'DM Sans',sans-serif";
          const tw=ctx.measureText(label).width, pw=tw+16, ph=18;
          ctx.shadowColor="rgba(0,0,0,.3)"; ctx.shadowBlur=6;
          ctx.fillStyle=warn?(T.isDark?"#E08800":"#E08800"):T.pillBg;
          ctx.beginPath(); ctx.roundRect(mx-pw/2,my-ph/2,pw,ph,9); ctx.fill();
          ctx.shadowBlur=0;
          ctx.strokeStyle=warn?`#E0880055`:`${m.color}44`; ctx.lineWidth=1.2;
          ctx.beginPath(); ctx.roundRect(mx-pw/2,my-ph/2,pw,ph,9); ctx.stroke();
          ctx.fillStyle=warn?"#fff":m.color; ctx.textAlign="center"; ctx.textBaseline="middle";
          ctx.fillText(label,mx,my);
        });
        const hp=.5+.5*Math.sin(f*.1);
        ctx.beginPath(); ctx.arc(positions[selIdx].x,positions[selIdx].y,30+hp*6,0,Math.PI*2);
        ctx.strokeStyle=`${members[selIdx].color}55`; ctx.lineWidth=2; ctx.stroke();
      }

      // ── Draw cars ─────────────────────────────────────────────────────────────
      members.forEach((m,i)=>{
        const p       = positions[i];
        const isMe    = i === 0;                          // "You" = first member always
        const isDim   = selIdx !== -1 && i !== selIdx;
        const isSel   = i === selIdx;
        const ld      = LIVE_DATA[m.id];
        const moving  = ld?.memberStatus === "moving";

        ctx.save();
        ctx.globalAlpha = isDim ? .35 : 1;

        // ── YOU: large pulsing beacon ring ──────────────────────────────────
        if (isMe) {
          const ring1 = .45 + .45 * Math.sin(f * .055);
          const ring2 = .4  + .4  * Math.sin(f * .055 + 1.1);
          // outer slow ring
          ctx.beginPath(); ctx.arc(p.x, p.y, 30 + ring1 * 10, 0, Math.PI*2);
          ctx.fillStyle = `${m.color}20`; ctx.fill();
          // inner ring
          ctx.beginPath(); ctx.arc(p.x, p.y, 20 + ring2 * 6, 0, Math.PI*2);
          ctx.fillStyle = `${m.color}35`; ctx.fill();
          // solid glow dot
          ctx.beginPath(); ctx.arc(p.x, p.y, 16, 0, Math.PI*2);
          ctx.fillStyle = `${m.color}55`; ctx.fill();
        } else if (moving) {
          // other moving cars: small glow
          const g = .5 + .5 * Math.sin(f * .04 + i);
          ctx.beginPath(); ctx.arc(p.x, p.y, 18 + g * 4, 0, Math.PI*2);
          ctx.fillStyle = `${m.color}18`; ctx.fill();
        }

        // ── car body / avatar ────────────────────────────────────────────────
        const imgObj   = imgs.current[m.id];
        const hasAvatar = !!imgObj;
        const R = isMe ? 16 : 13; // avatar circle radius

        ctx.save();
        ctx.translate(p.x, p.y);

        if (hasAvatar) {
          // ── PROFILE PHOTO CIRCLE ─────────────────────────────────────────
          // coloured ring background
          ctx.beginPath(); ctx.arc(0, 0, R + 3, 0, Math.PI*2);
          ctx.fillStyle = m.color; ctx.fill();
          // white border for YOU, selection ring for others
          if (isMe) {
            ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.arc(0, 0, R + 3, 0, Math.PI*2); ctx.stroke();
            // crown dot above circle
            ctx.fillStyle = "#fff";
            ctx.beginPath(); ctx.arc(0, -(R + 10), 4, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = m.color;
            ctx.beginPath(); ctx.arc(0, -(R + 10), 2.5, 0, Math.PI*2); ctx.fill();
          } else if (isSel) {
            ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, 0, R + 3, 0, Math.PI*2); ctx.stroke();
          }
          // clip to circle and draw photo
          ctx.save();
          ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI*2); ctx.clip();
          ctx.drawImage(imgObj, -R, -R, R * 2, R * 2);
          ctx.restore();
          // stopped overlay
          if (!moving) {
            ctx.fillStyle = "rgba(0,0,0,.5)";
            ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(-4,-4); ctx.lineTo(4,4); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(4,-4); ctx.lineTo(-4,4); ctx.stroke();
          }
        } else {
          // ── ORIGINAL CAR RECTANGLE ──────────────────────────────────────
          ctx.rotate(-0.4 + i * .28 + (i === 3 ? -.8 : 0));
          if (isMe) {
            ctx.fillStyle = m.color;
            ctx.beginPath(); ctx.roundRect(-15,-10,30,20,6); ctx.fill();
            ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.roundRect(-15,-10,30,20,6); ctx.stroke();
            ctx.fillStyle = "rgba(255,255,255,.5)";
            ctx.beginPath(); ctx.roundRect(-6,-7,12,9,2); ctx.fill();
            ctx.fillStyle = "#fff";
            ctx.beginPath(); ctx.arc(0,-13,4,0,Math.PI*2); ctx.fill();
            ctx.fillStyle = m.color;
            ctx.beginPath(); ctx.arc(0,-13,2.5,0,Math.PI*2); ctx.fill();
          } else {
            ctx.fillStyle = m.color;
            ctx.beginPath(); ctx.roundRect(-13,-8,26,16,5); ctx.fill();
            if (isSel) {
              ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
              ctx.beginPath(); ctx.roundRect(-13,-8,26,16,5); ctx.stroke();
            }
            ctx.fillStyle = "rgba(255,255,255,.32)";
            ctx.beginPath(); ctx.roundRect(-5,-5,10,7,2); ctx.fill();
          }
          if (!moving) {
            ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(-3,-3); ctx.lineTo(3,3); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(3,-3); ctx.lineTo(-3,3); ctx.stroke();
          }
        }
        ctx.restore(); // translate

        // ── NAME TAG (same style for both avatar + car) ──────────────────────
        // vertical offset: avatar circles sit higher so tag is further down
        const tagOffY = hasAvatar ? (isMe ? R + 10 : R + 8) : (isMe ? 19 : 15);
        const tagY    = p.y + tagOffY;
        const tagH    = isMe ? 20 : 17;

        if (isMe) {
          const label = "★ You";
          ctx.font = "bold 10px 'DM Sans',sans-serif";
          const tw = ctx.measureText(label).width + 18;
          ctx.shadowColor = m.color; ctx.shadowBlur = 10;
          ctx.fillStyle = m.color;
          ctx.beginPath(); ctx.roundRect(p.x - tw/2, tagY, tw, tagH, tagH/2); ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = T.isDark ? "#080B12" : "#ffffff";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(label, p.x, tagY + tagH/2);
        } else {
          ctx.font = "bold 9px 'DM Sans',sans-serif";
          const tw = ctx.measureText(m.name).width + 14;
          ctx.fillStyle = T.nameBg;
          ctx.beginPath(); ctx.roundRect(p.x - tw/2, tagY, tw, tagH, 5); ctx.fill();
          if (isSel) {
            ctx.strokeStyle = m.color; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.roundRect(p.x - tw/2, tagY, tw, tagH, 5); ctx.stroke();
          }
          ctx.fillStyle = m.color; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(m.name, p.x, tagY + tagH/2);
        }

        ctx.restore();
      });
      raf.current=requestAnimationFrame(draw);
    };
    draw();
    return ()=>cancelAnimationFrame(raf.current);
  }, [members, selectedId, T]);

  const onClick=e=>{
    const cv=cvR.current; if(!cv) return;
    const r=cv.getBoundingClientRect();
    // logical coords — no DPR scaling needed since ctx is already scaled
    const cx=e.clientX-r.left, cy=e.clientY-r.top;
    let best=-1, bestD=44;
    pos.current.forEach((p,i)=>{const d=Math.hypot(p.x-cx,p.y-cy);if(d<bestD){bestD=d;best=i;}});
    onSelect(best===-1?null:(members[best].id===selectedId?null:members[best].id));
  };

  return (
    <div ref={wrapR} style={{width:"100%",height:"100%",position:"relative"}}>
      <canvas ref={cvR} onClick={onClick} style={{display:"block",cursor:"pointer"}}/>
    </div>
  );
};


// ══════════════════════════════════════════════════════════════════════════════
// SOS CONFIRM MODAL
// ══════════════════════════════════════════════════════════════════════════════
const SosModal = ({ convoy, onConfirm, onClose }) => {
  const T = useT();
  const [hold, setHold] = useState(0);
  const timerRef = useRef(null);

  const startHold = () => {
    timerRef.current = setInterval(() => {
      setHold(h => {
        if (h >= 100) { clearInterval(timerRef.current); onConfirm(); return 100; }
        return h + 4;
      });
    }, 60);
  };
  const stopHold = () => { clearInterval(timerRef.current); if (hold < 100) setHold(0); };
  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div style={{position:"absolute",inset:0,zIndex:80,display:"flex",flexDirection:"column",background:`rgba(4,6,10,${T.isDark?.85:.65})`,backdropFilter:"blur(8px)",alignItems:"center",justifyContent:"flex-end",padding:"0 0 0"}}>
      <div style={{width:"100%",background:T.surface,borderRadius:"26px 26px 0 0",padding:"28px 24px 36px",boxShadow:`0 -24px 60px rgba(224,48,48,${T.isDark?.35:.2})`}}>

        {/* pulse ring */}
        <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
          <div style={{position:"relative",width:88,height:88}}>
            <div style={{position:"absolute",inset:-8,borderRadius:"50%",border:`2px solid ${T.red}`,opacity:.25,animation:"sosPing 1.6s ease-out infinite"}}/>
            <div style={{position:"absolute",inset:-18,borderRadius:"50%",border:`2px solid ${T.red}`,opacity:.12,animation:"sosPing 1.6s ease-out infinite",animationDelay:".5s"}}/>
            <div style={{width:88,height:88,borderRadius:"50%",background:`${T.red}18`,border:`3px solid ${T.red}`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",zIndex:1}}>
              <span style={{fontSize:38}}>🆘</span>
            </div>
          </div>
        </div>

        <div style={{textAlign:"center",marginBottom:8}}>
          <div style={{fontSize:22,fontWeight:900,color:T.red,letterSpacing:.5}}>SOS Emergency</div>
          <div style={{fontSize:13,color:T.sub,marginTop:6,lineHeight:1.5}}>
            All <strong style={{color:T.text}}>{convoy.members.length - 1} fellow members</strong> in "{convoy.name}" will receive an emergency alert with your live location.
          </div>
        </div>

        {/* who gets alerted */}
        <div style={{display:"flex",justifyContent:"center",gap:8,margin:"16px 0 20px",flexWrap:"wrap"}}>
          {convoy.members.slice(1).map(m => (
            <div key={m.id} style={{display:"flex",alignItems:"center",gap:6,background:T.raised,border:`1px solid ${T.border}`,borderRadius:20,padding:"5px 12px 5px 6px"}}>
              <Avatar name={m.name} color={m.color} size={22}/>
              <span style={{fontSize:11,fontWeight:700,color:T.text}}>{m.name}</span>
            </div>
          ))}
        </div>

        {/* hold button */}
        <div style={{position:"relative",marginBottom:14}}>
          <button
            onMouseDown={startHold} onMouseUp={stopHold} onMouseLeave={stopHold}
            onTouchStart={startHold} onTouchEnd={stopHold}
            style={{width:"100%",padding:"17px 0",borderRadius:16,background:`${T.red}15`,border:`2.5px solid ${T.red}`,cursor:"pointer",position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
            {/* fill bar */}
            <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${hold}%`,background:`${T.red}30`,transition:"width .06s linear",borderRadius:16}}/>
            <span style={{fontSize:26,position:"relative"}}>🆘</span>
            <span style={{fontSize:14,fontWeight:900,color:T.red,letterSpacing:1,position:"relative"}}>
              {hold > 0 ? `SENDING… ${Math.round(hold)}%` : "HOLD TO SEND SOS"}
            </span>
          </button>
        </div>
        <div style={{textAlign:"center",fontSize:11,color:T.muted,marginBottom:18}}>Hold the button for 3 seconds to confirm</div>

        <button onClick={onClose} style={{width:"100%",padding:"13px",borderRadius:14,background:T.raised,border:`1px solid ${T.border}`,color:T.sub,fontSize:14,fontWeight:700,cursor:"pointer"}}>
          Cancel
        </button>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SOS NOTIFICATION FEED (shown to "other members" after SOS fires)
// ══════════════════════════════════════════════════════════════════════════════
const SosNotifFeed = ({ convoy, sender, onClose }) => {
  const T = useT();
  const [step, setStep] = useState(0); // 0=incoming, 1=acknowledged

  useEffect(() => {
    const t = setTimeout(() => setStep(1), 2800);
    return () => clearTimeout(t);
  }, []);

  const others = convoy.members.filter(m => m.id !== sender.id);

  return (
    <div style={{position:"absolute",inset:0,zIndex:90,display:"flex",flexDirection:"column",background:`rgba(4,6,10,${T.isDark?.9:.75})`,backdropFilter:"blur(10px)"}}>

      {/* ── incoming alert top panel ── */}
      <div style={{background:T.red,padding:"16px 20px 14px",animation:"slideDown .4s ease"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:24,animation:"sosShake .5s ease infinite"}}>🆘</span>
          <div>
            <div style={{fontSize:13,fontWeight:900,color:"#fff",letterSpacing:.6}}>SOS ALERT — {convoy.name}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.85)",marginTop:2}}>
              <strong>{sender.name}</strong> triggered an emergency · Live location shared
            </div>
          </div>
        </div>
      </div>

      {/* ── notification cards for each other member ── */}
      <div style={{flex:1,overflowY:"auto",padding:"16px"}}>
        <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.45)",letterSpacing:.9,textTransform:"uppercase",marginBottom:12}}>Notifications Delivered To</div>

        {others.map((m, i) => (
          <div key={m.id} style={{background:T.card,border:`1.5px solid ${T.red}44`,borderRadius:18,marginBottom:12,overflow:"hidden",animation:`slideUp .4s ease ${i*.12}s both`}}>
            {/* red accent */}
            <div style={{height:3,background:`linear-gradient(90deg,${T.red},${T.red}55)`}}/>
            <div style={{padding:"14px 16px"}}>
              {/* member row */}
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <div style={{position:"relative"}}>
                  <Avatar name={m.name} color={m.color} size={44}/>
                  {step===1&&<div style={{position:"absolute",bottom:-2,right:-2,width:16,height:16,borderRadius:"50%",background:T.accent,border:`2px solid ${T.card}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9}}>✓</div>}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:800,color:T.text}}>{m.name}</div>
                  <div style={{fontSize:11,color:T.muted}}>{m.car}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  {step===0
                    ? <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:7,height:7,borderRadius:"50%",background:T.amber,animation:"pulse 1s infinite"}}/><span style={{fontSize:11,fontWeight:700,color:T.amber}}>Sending…</span></div>
                    : <div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:11,fontWeight:700,color:T.accent}}>✓ Delivered</span></div>
                  }
                </div>
              </div>

              {/* notification preview bubble */}
              <div style={{background:T.raised,borderRadius:14,padding:"11px 14px",border:`1px solid ${T.border}`}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                  <div style={{width:32,height:32,borderRadius:10,background:`${T.red}20`,border:`1px solid ${T.red}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:16}}>🆘</span>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                      <span style={{fontSize:11,fontWeight:800,color:T.text}}>CONVOY — SOS Alert</span>
                      <span style={{fontSize:10,color:T.muted}}>now</span>
                    </div>
                    <div style={{fontSize:12,color:T.sub,lineHeight:1.45}}>
                      🆘 <strong style={{color:T.red}}>{sender.name}</strong> needs immediate help on the {convoy.name} convoy. Tap to see their live location.
                    </div>
                  </div>
                </div>
              </div>

              {/* action row */}
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <div style={{flex:1,background:`${T.red}12`,border:`1px solid ${T.red}33`,borderRadius:10,padding:"8px 0",textAlign:"center"}}>
                  <div style={{fontSize:11,fontWeight:700,color:T.red}}>📍 View Location</div>
                </div>
                <div style={{flex:1,background:T.accentLo,border:`1px solid ${T.accent}33`,borderRadius:10,padding:"8px 0",textAlign:"center"}}>
                  <div style={{fontSize:11,fontWeight:700,color:T.accent}}>🚗 I'm On My Way</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── bottom close ── */}
      <div style={{padding:"14px 20px 28px",background:T.surface,borderTop:`1px solid ${T.border}`}}>
        <div style={{background:`${T.red}15`,border:`1.5px solid ${T.red}44`,borderRadius:14,padding:"10px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:16}}>📍</span>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:T.red}}>Your live location is being shared</div>
            <div style={{fontSize:11,color:T.muted,marginTop:1}}>All convoy members can see you on the map</div>
          </div>
        </div>
        <button onClick={onClose} style={{width:"100%",padding:"14px",borderRadius:14,background:T.accent,border:"none",color:T.isDark?"#080B12":"#fff",fontSize:14,fontWeight:800,cursor:"pointer"}}>
          ✓ Close & Return to Trip
        </button>
      </div>
    </div>
  );
};


// ══════════════════════════════════════════════════════════════════════════════
// FULLSCREEN MAP OVERLAY
// ══════════════════════════════════════════════════════════════════════════════
const FullscreenMap = ({ convoy, initialSelId, onClose }) => {
  const T = useT();
  const [selId,      setSelId]      = useState(initialSelId);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [showGaps,   setShowGaps]   = useState(false); // "all gaps" mode

  const selMember  = selId   != null ? convoy.members.find(m => m.id === selId)   : null;
  const glassLight = "rgba(255,255,255,.94)";
  const glassDark  = "rgba(8,11,18,.91)";
  const glass      = T.isDark ? glassDark : glassLight;
  const shadow     = "0 4px 24px rgba(0,0,0,.45)";


  return (
    <div style={{position:"absolute",inset:0,zIndex:70,display:"flex",flexDirection:"column",background:"#080B12",animation:"fsIn .3s cubic-bezier(.2,.8,.4,1)"}}>

      {/* ════════════════════  MAP LAYER  ════════════════════ */}
      <div style={{flex:1,position:"relative",overflow:"hidden"}}>
        <LiveMap members={convoy.members} selectedId={selId} onSelect={setSelId}/>

        {/* gradient overlays */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:110,background:"linear-gradient(to bottom,rgba(8,11,18,.78) 0%,transparent 100%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:100,background:"linear-gradient(to top,rgba(8,11,18,.55) 0%,transparent 100%)",pointerEvents:"none"}}/>

        {/* ══ ROW 1: back · name · speed ══ */}
        <div style={{position:"absolute",top:12,left:12,right:12,display:"flex",alignItems:"center",gap:8}}>
          {/* back */}
          <button onClick={onClose}
            style={{width:36,height:36,borderRadius:10,background:glass,border:`1px solid ${T.border}`,backdropFilter:"blur(10px)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:shadow}}>
            <Ic d={ICONS.back} size={16} color={T.sub} sw={2}/>
          </button>

          {/* convoy name */}
          <div style={{flex:1,minWidth:0,background:glass,borderRadius:10,padding:"6px 10px",backdropFilter:"blur(10px)",border:`1px solid ${T.accent}50`,overflow:"hidden",boxShadow:shadow}}>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:1}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:T.accent,flexShrink:0,animation:"pulse 1.4s infinite",display:"inline-block"}}/>
              <span style={{fontSize:12,fontWeight:800,color:T.accent,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{convoy.name}</span>
            </div>
            <div style={{fontSize:9,color:T.muted,paddingLeft:11}}>{convoy.members.length} cars · {convoy.destination}</div>
          </div>

          {/* speed */}
          <div style={{flexShrink:0,width:50,background:glass,borderRadius:10,padding:"5px 0",backdropFilter:"blur(10px)",border:`1px solid ${T.border}`,textAlign:"center",boxShadow:shadow}}>
            <div style={{fontSize:18,fontWeight:900,color:T.accent,fontFamily:"'Space Mono',monospace",lineHeight:1}}>62</div>
            <div style={{fontSize:7,color:T.muted,fontWeight:700,letterSpacing:.6}}>KM/H</div>
          </div>
        </div>

        {/* ══ ROW 2: stats · gap toggle · members toggle ══ */}
        <div style={{position:"absolute",top:60,left:12,right:12,display:"flex",alignItems:"center",gap:6}}>
          {/* ETA chip */}
          <div style={{background:glass,borderRadius:9,padding:"4px 10px",backdropFilter:"blur(10px)",border:`1px solid ${T.border}`,textAlign:"center",boxShadow:shadow}}>
            <div style={{fontSize:11,fontWeight:800,color:T.violet,fontFamily:"'Space Mono',monospace",lineHeight:1}}>4:32</div>
            <div style={{fontSize:7,color:T.muted,fontWeight:700,letterSpacing:.4}}>ETA</div>
          </div>
          {/* km left */}
          <div style={{background:glass,borderRadius:9,padding:"4px 10px",backdropFilter:"blur(10px)",border:`1px solid ${T.border}`,textAlign:"center",boxShadow:shadow}}>
            <div style={{fontSize:11,fontWeight:800,color:convoy.color,fontFamily:"'Space Mono',monospace",lineHeight:1}}>{convoy.distance}km</div>
            <div style={{fontSize:7,color:T.muted,fontWeight:700,letterSpacing:.4}}>LEFT</div>
          </div>

          <div style={{flex:1}}/>

          {/* gap-lines toggle */}
          <button onClick={()=>setShowGaps(g=>!g)}
            style={{width:34,height:34,borderRadius:9,background:showGaps?T.accentLo:glass,border:`1.5px solid ${showGaps?T.accent:T.border}`,backdropFilter:"blur(10px)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:shadow,flexShrink:0}}>
            <Ic d={ICONS.layers} size={14} color={showGaps?T.accent:T.sub} sw={1.8}/>
          </button>

          {/* members drawer toggle */}
          <button onClick={()=>setDrawerOpen(d=>!d)}
            style={{width:34,height:34,borderRadius:9,background:drawerOpen?T.accentLo:glass,border:`1.5px solid ${drawerOpen?T.accent:T.border}`,backdropFilter:"blur(10px)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:shadow,flexShrink:0}}>
            <Ic d={ICONS.users} size={14} color={drawerOpen?T.accent:T.sub} sw={1.8}/>
          </button>
        </div>

        {/* ── Gap legend (left, below row 2) ── */}
        {showGaps && (
          <div style={{position:"absolute",top:104,left:12,background:glass,borderRadius:12,padding:"9px 11px",backdropFilter:"blur(10px)",border:`1px solid ${T.accent}44`,boxShadow:shadow,animation:"slideDown .2s ease",maxWidth:160}}>
            <div style={{fontSize:9,fontWeight:800,color:T.accent,letterSpacing:.7,marginBottom:6,textTransform:"uppercase"}}>Gap Lines</div>
            {convoy.members.map(m=>{
              const ld=LIVE_DATA[m.id]; if(!ld||ld.dist===0) return null;
              const warn=ld.dist>4;
              return (
                <div key={m.id} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                  <div style={{width:12,height:2,borderRadius:2,background:warn?T.amber:m.color,flexShrink:0}}/>
                  <span style={{fontSize:10,color:T.sub,flex:1}}>{m.name}</span>
                  <span style={{fontSize:10,fontWeight:800,color:warn?T.amber:m.color,fontFamily:"'Space Mono',monospace"}}>{ld.dist}km</span>
                  {warn&&<span style={{fontSize:9}}>⚠</span>}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Hint pill pinned at bottom centre ── */}
        {!selId && !showGaps && (
          <div style={{position:"absolute",bottom:14,left:"50%",transform:"translateX(-50%)",background:glass,borderRadius:22,padding:"7px 16px",border:`1px solid ${T.border}`,backdropFilter:"blur(8px)",boxShadow:shadow,whiteSpace:"nowrap",pointerEvents:"none"}}>
            <span style={{fontSize:11,color:T.sub}}>Tap a car to see distance gaps</span>
          </div>
        )}

      </div>

      {/* ════════════════════  BOTTOM DRAWER  ════════════════════ */}
      <div style={{background:T.isDark?"rgba(10,13,20,.97)":"rgba(255,255,255,.98)",borderTop:`1px solid ${T.border}`,flexShrink:0,transition:"max-height .35s cubic-bezier(.4,0,.2,1)",maxHeight: drawerOpen ? 300 : 0,overflow:"hidden"}}>

        {/* ── drag handle + trip meta ── */}
        <div style={{padding:"10px 16px 6px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>setDrawerOpen(d=>!d)}>
          <div style={{flex:1,display:"flex",alignItems:"center",gap:0,overflowX:"auto",scrollbarWidth:"none",gap:16}}>
            {[
              {label:"REMAINING",  val:`${convoy.distance}km`, c:convoy.color},
              {label:"ETA",        val:"4h 32m",               c:T.violet    },
              {label:"AVG SPEED",  val:"60 km/h",              c:T.blue      },
              {label:"ALERT GAP",  val:`${convoy.alertKm}km`,  c:T.amber     },
            ].map(s=>(
              <div key={s.label} style={{flexShrink:0,textAlign:"center"}}>
                <div style={{fontSize:13,fontWeight:800,color:s.c,fontFamily:"'Space Mono',monospace",lineHeight:1}}>{s.val}</div>
                <div style={{fontSize:8,color:T.muted,fontWeight:700,letterSpacing:.6,marginTop:2}}>{s.label}</div>
              </div>
            ))}
          </div>
          {/* progress mini */}
          <div style={{width:60,flexShrink:0}}>
            <div style={{height:4,background:T.raised,borderRadius:4,overflow:"hidden"}}>
              <div style={{height:"100%",width:"38%",background:`linear-gradient(90deg,${convoy.color},${convoy.color}88)`,borderRadius:4}}/>
            </div>
            <div style={{fontSize:8,color:T.muted,marginTop:3,textAlign:"right",fontWeight:700}}>38% DONE</div>
          </div>
          <Ic d={drawerOpen?ICONS.chevron:ICONS.back} size={14} color={T.muted} sw={2}/>
        </div>

        {/* ── horizontal divider ── */}
        <div style={{height:1,background:T.border,margin:"0 14px"}}/>

        {/* ── member cards scroll ── */}
        <div style={{display:"flex",gap:10,padding:"10px 14px 14px",overflowX:"auto",scrollbarWidth:"none"}}>
          {convoy.members.map((m, i) => {
            const ld = LIVE_DATA[m.id] || {};
            const moving = ld.memberStatus === "moving";
            const warn   = ld.dist > 4;
            const active = selId === m.id;
            return (
              <button key={m.id} onClick={() => setSelId(detailId => detailId === m.id ? null : m.id)}
                style={{flexShrink:0,width:118,background:active?T.accentLo:T.card,border:`1.5px solid ${active?m.color:warn?T.amber+"55":T.border}`,borderRadius:16,padding:"12px 10px",cursor:"pointer",textAlign:"left",transition:"all .18s",boxShadow:active?`0 4px 16px ${m.color}33`:"none"}}>
                {/* avatar + status */}
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:9}}>
                  <div style={{position:"relative"}}>
                    <Avatar name={m.name} color={m.color} size={36}/>
                    <div style={{position:"absolute",bottom:-1,right:-1,width:11,height:11,borderRadius:"50%",background:moving?T.accent:T.amber,border:`2px solid ${T.card}`,boxShadow:`0 0 5px ${moving?T.accent:T.amber}`}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:800,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:2}}>
                      {i===0&&<span style={{fontSize:8,color:T.blue,fontWeight:800,background:T.blueLo,padding:"1px 5px",borderRadius:6}}>YOU</span>}
                      {m.role==="admin"&&<span style={{fontSize:8,color:T.accent,fontWeight:800,background:T.accentLo,padding:"1px 5px",borderRadius:6}}>ADMIN</span>}
                    </div>
                  </div>
                </div>

                {/* speed bar */}
                <div style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontSize:9,color:T.muted,fontWeight:700}}>SPEED</span>
                    <span style={{fontSize:10,fontWeight:900,color:T.text,fontFamily:"'Space Mono',monospace"}}>{ld.speed||0}</span>
                  </div>
                  <div style={{height:3,background:T.raised,borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${Math.min(100,(ld.speed||0)/1.2)}%`,background:m.color,borderRadius:3,transition:"width .5s"}}/>
                  </div>
                </div>

                {/* distance chip */}
                <div style={{background:warn?`${T.amber}18`:T.raised,border:`1px solid ${warn?T.amber+"44":T.border}`,borderRadius:10,padding:"5px 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:9,color:warn?T.amber:T.muted,fontWeight:700,letterSpacing:.3}}>{warn?"⚠ FAR":"DIST"}</span>
                  <span style={{fontSize:12,fontWeight:900,color:warn?T.amber:m.color,fontFamily:"'Space Mono',monospace"}}>{ld.dist||0} <span style={{fontSize:8,fontWeight:700}}>km</span></span>
                </div>

                {/* car plate */}
                <div style={{marginTop:7,fontSize:9,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.car}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// LIVE DETAIL SCREEN
// ══════════════════════════════════════════════════════════════════════════════
const LiveDetailScreen = ({ convoy, onBack, onEdit, onDelete }) => {
  const T = useT();
  const [selId,    setSelId]    = useState(null);
  const [mapTab,   setMapTab]   = useState("map");
  const [sosOpen,   setSosOpen]  = useState(false);
  const [sosSent,   setSosSent]  = useState(false);
  const [fullMap,   setFullMap]  = useState(false);
  const [fSelId,    setFSelId]   = useState(null);

  const selMember = selId!=null?convoy.members.find(m=>m.id===selId):null;
  const selLive   = selId!=null?LIVE_DATA[selId]:null;
  const sender    = convoy.members[0]; // "You"

  const fireSos = () => { setSosOpen(false); setSosSent(true); };

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>
      {/* header */}
      <div style={{padding:"14px 16px 10px",display:"flex",alignItems:"center",gap:10,background:T.surface,borderBottom:`1px solid ${T.border}`}}>
        <button onClick={onBack} style={{width:34,height:34,borderRadius:10,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Ic d={ICONS.back} size={16}/>
        </button>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:15,fontWeight:800,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{convoy.name}</div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:T.accent,animation:"pulse 1.4s infinite",display:"inline-block"}}/>
            <span style={{fontSize:11,color:T.accent,fontWeight:700}}>LIVE · {convoy.members.length} tracking</span>
          </div>
        </div>
        <button onClick={()=>setSosOpen(true)} style={{height:32,padding:"0 10px",borderRadius:9,background:T.redLo,border:`1.5px solid ${T.red}`,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
          <span style={{fontSize:13}}>🆘</span>
          <span style={{fontSize:11,fontWeight:800,color:T.red,letterSpacing:.6}}>SOS</span>
        </button>
        <button onClick={()=>onEdit(convoy)} style={{width:32,height:32,borderRadius:9,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Ic d={ICONS.edit} size={13} color={T.accent}/>
        </button>
        <button onClick={()=>onDelete(convoy)} style={{width:32,height:32,borderRadius:9,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Ic d={ICONS.trash} size={13} color={T.red}/>
        </button>
      </div>

      {/* progress */}
      <div style={{padding:"10px 16px",background:T.surface,borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
          <span style={{fontSize:11,color:T.muted}}>Noida</span>
          <span style={{fontSize:11,fontWeight:700,color:T.accent}}>{convoy.distance} km left</span>
          <span style={{fontSize:11,color:T.muted}}>{convoy.destination}</span>
        </div>
        <div style={{height:5,background:T.raised,borderRadius:5,overflow:"hidden"}}>
          <div style={{height:"100%",width:"38%",background:`linear-gradient(90deg,${convoy.color},${convoy.color}88)`,borderRadius:5,position:"relative"}}>
            <div style={{position:"absolute",right:0,top:-2,width:9,height:9,borderRadius:"50%",background:convoy.color,boxShadow:`0 0 8px ${convoy.color}`}}/>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
          <span style={{fontSize:10,color:T.muted}}>168 km done</span>
          <span style={{fontSize:10,color:T.muted}}>ETA 4h 32m</span>
        </div>
      </div>

      {/* sub-tabs */}
      <div style={{display:"flex",background:T.surface,borderBottom:`1px solid ${T.border}`}}>
        {[["map","🗺 Map"],["members","👥 Members"],["info","📋 Info"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setMapTab(id)} style={{flex:1,background:"none",border:"none",padding:"10px 0",fontSize:12,fontWeight:700,color:mapTab===id?T.accent:T.muted,borderBottom:`2px solid ${mapTab===id?T.accent:"transparent"}`,cursor:"pointer",marginBottom:-1,transition:"color .15s"}}>{lbl}</button>
        ))}
      </div>

      {/* ── MAP TAB ── */}
      {mapTab==="map"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* ── Map canvas ── */}
          <div style={{height:230,position:"relative",overflow:"hidden",background:T.mapBg}}>
            <LiveMap members={convoy.members} selectedId={selId} onSelect={setSelId}/>

            {/* LIVE TRACKING chip — display only, not clickable */}
            <div style={{position:"absolute",top:10,left:10,background:T.isDark?"rgba(8,11,18,.88)":"rgba(255,255,255,.93)",borderRadius:10,padding:"5px 10px",backdropFilter:"blur(6px)",border:`1px solid ${T.accent}44`,display:"flex",alignItems:"center",gap:6,pointerEvents:"none"}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:T.accent,animation:"pulse 1.4s infinite",display:"inline-block"}}/>
              <span style={{fontSize:10,fontWeight:700,color:T.accent}}>LIVE TRACKING</span>
            </div>

            {/* speed chip */}
            <div style={{position:"absolute",top:10,right:10,background:T.isDark?"rgba(8,11,18,.85)":"rgba(255,255,255,.9)",borderRadius:10,padding:"6px 10px",backdropFilter:"blur(6px)",border:`1px solid ${T.border}`,textAlign:"right"}}>
              <div style={{fontSize:18,fontWeight:800,color:T.accent,fontFamily:"'Space Mono',monospace",lineHeight:1}}>62</div>
              <div style={{fontSize:8,color:T.muted,fontWeight:700,letterSpacing:1}}>KM/H</div>
            </div>

            {/* tap hint */}
            {!selId&&(
              <div style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",background:T.isDark?"rgba(8,11,18,.8)":"rgba(255,255,255,.85)",borderRadius:20,padding:"5px 14px",border:`1px solid ${T.border}`,backdropFilter:"blur(4px)",whiteSpace:"nowrap"}}>
                <span style={{fontSize:10,color:T.sub}}>Tap a car to see distance gaps</span>
              </div>
            )}
          </div>

          {/* ── Full Screen button ── */}
          <button onClick={()=>{ setFSelId(selId); setFullMap(true); }}
            style={{margin:"10px 14px 0",padding:"11px 0",borderRadius:14,background:T.isDark?"rgba(61,214,140,.08)":"rgba(29,184,112,.07)",border:`1.5px solid ${T.accent}44`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"calc(100% - 28px)",transition:"background .15s"}}
            onMouseEnter={e=>e.currentTarget.style.background=T.accentLo}
            onMouseLeave={e=>e.currentTarget.style.background=T.isDark?"rgba(61,214,140,.08)":"rgba(29,184,112,.07)"}>
            <Ic d={ICONS.expand} size={15} color={T.accent} sw={2}/>
            <span style={{fontSize:13,fontWeight:700,color:T.accent,letterSpacing:.3}}>View Full Screen Map</span>
          </button>

          {/* gap panel */}
          {selMember&&selLive&&(
            <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:"10px 14px",animation:"slideDown .25s ease"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Avatar name={selMember.name} color={selMember.color} size={26}/>
                  <span style={{fontSize:13,fontWeight:800,color:T.text}}>{selMember.name}</span>
                  <span style={{fontSize:10,color:T.muted}}>→ all members</span>
                </div>
                <button onClick={()=>setSelId(null)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}>
                  <Ic d={ICONS.close} size={14}/>
                </button>
              </div>
              <div style={{display:"flex",gap:8}}>
                {convoy.members.filter(m=>m.id!==selId).map(m=>{
                  const ld=LIVE_DATA[m.id], warn=ld&&ld.dist>4;
                  return (
                    <div key={m.id} style={{flex:1,background:warn?`${T.amber}14`:T.card,border:`1px solid ${warn?T.amber+"44":m.color+"30"}`,borderRadius:12,padding:"8px 6px",textAlign:"center"}}>
                      <div style={{display:"flex",justifyContent:"center",marginBottom:4}}><Avatar name={m.name} color={m.color} size={22}/></div>
                      <div style={{fontSize:13,fontWeight:800,color:warn?T.amber:m.color,fontFamily:"'Space Mono',monospace"}}>{ld?ld.dist:"–"}</div>
                      <div style={{fontSize:8,fontWeight:700,color:T.muted,letterSpacing:.5}}>KM</div>
                      <div style={{fontSize:9,color:T.muted,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</div>
                      {warn&&<div style={{fontSize:8,color:T.amber,fontWeight:700,marginTop:1}}>⚠ FAR</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* member strip */}
          <div style={{padding:"10px 14px",display:"flex",gap:8,overflowX:"auto",scrollbarWidth:"none",borderBottom:`1px solid ${T.border}`}}>
            {convoy.members.map(m=>{
              const ld=LIVE_DATA[m.id], active=selId===m.id;
              return (
                <button key={m.id} onClick={()=>setSelId(active?null:m.id)}
                  style={{flexShrink:0,background:active?T.accentLo:T.card,border:`1.5px solid ${active?m.color:T.border}`,borderRadius:12,padding:"7px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:7,transition:"all .15s"}}>
                  <Avatar name={m.name} color={m.color} size={24}/>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontSize:11,fontWeight:700,color:T.text}}>{m.name}</div>
                    <div style={{fontSize:10,color:ld?.memberStatus==="stopped"?T.amber:T.accent}}>{ld?.memberStatus==="stopped"?"Stopped":`${ld?.speed} km/h`}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* stats */}
          <div style={{display:"flex",padding:"10px 14px",gap:8}}>
            {[{label:"DISTANCE",val:`${convoy.distance}km`,c:convoy.color},{label:"AVG SPEED",val:"60 km/h",c:T.blue},{label:"ALERT GAP",val:`${convoy.alertKm}km`,c:T.amber},{label:"ETA",val:"4h 32m",c:T.violet}].map(s=>(
              <div key={s.label} style={{flex:1,background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"9px 6px",textAlign:"center"}}>
                <div style={{fontSize:12,fontWeight:800,color:s.c,fontFamily:"'Space Mono',monospace",lineHeight:1}}>{s.val}</div>
                <div style={{fontSize:8,color:T.muted,fontWeight:700,letterSpacing:.5,marginTop:3}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MEMBERS TAB ── */}
      {mapTab==="members"&&(
        <div style={{flex:1,overflowY:"auto",padding:"14px"}}>
          <div style={{fontSize:11,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase",marginBottom:10}}>Live Member Status</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {convoy.members.map((m,i)=>{
              const ld=LIVE_DATA[m.id]||{}, moving=ld.memberStatus==="moving", warn=ld.dist>4;
              return (
                <div key={m.id} style={{background:T.card,border:`1.5px solid ${warn?T.amber+"44":T.border}`,borderRadius:16,padding:"14px",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:m.color,borderRadius:"16px 0 0 16px"}}/>
                  <div style={{marginLeft:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{position:"relative"}}>
                          <Avatar name={m.name} color={m.color} size={40}/>
                          <div style={{position:"absolute",bottom:-1,right:-1,width:12,height:12,borderRadius:"50%",background:moving?T.accent:T.amber,border:`2px solid ${T.card}`}}/>
                        </div>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <span style={{fontSize:14,fontWeight:800,color:T.text}}>{m.name}</span>
                            {m.role==="admin"&&<span style={{background:T.accentLo,color:T.accent,fontSize:9,fontWeight:800,padding:"1px 7px",borderRadius:10}}>ADMIN</span>}
                            {i===0&&<span style={{background:T.blueLo,color:T.blue,fontSize:9,fontWeight:800,padding:"1px 7px",borderRadius:10}}>YOU</span>}
                          </div>
                          <div style={{fontSize:11,color:T.muted,marginTop:1}}>{m.car}</div>
                        </div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:11,fontWeight:700,color:moving?T.accent:T.amber}}>{moving?"● Moving":"⏸ Stopped"}</div>
                        <div style={{fontSize:10,color:T.muted,marginTop:2}}>{ld.lastSeen}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      {[{icon:ICONS.speed,val:ld.speed,unit:"KM/H"},{icon:ICONS.locate,val:ld.dist,unit:"KM AWAY",warn},{icon:ICONS.flag,val:ld.eta,unit:"ETA"}].map((s,j)=>(
                        <div key={j} style={{flex:1,background:T.raised,borderRadius:10,padding:"7px 10px",display:"flex",alignItems:"center",gap:6}}>
                          <Ic d={s.icon} size={13} color={s.warn?T.amber:T.muted}/>
                          <div>
                            <div style={{fontSize:12,fontWeight:800,color:s.warn?T.amber:T.text,fontFamily:"'Space Mono',monospace"}}>{s.val}</div>
                            <div style={{fontSize:8,color:s.warn?T.amber:T.muted,fontWeight:700,letterSpacing:.5}}>{s.unit}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {warn&&(
                      <div style={{display:"flex",alignItems:"center",gap:7,background:T.amberLo,borderRadius:10,padding:"7px 10px",marginTop:8,border:`1px solid ${T.amber}33`}}>
                        <Ic d={ICONS.sos} size={13} color={T.amber} sw={2}/>
                        <span style={{fontSize:11,color:T.amber,fontWeight:700}}>{m.name} is {ld.dist}km behind — beyond {convoy.alertKm}km threshold</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* SOS button in members tab */}
          <div style={{marginTop:16}}>
            <button onClick={()=>setSosOpen(true)} style={{width:"100%",padding:"16px",borderRadius:16,background:`${T.red}14`,border:`2px solid ${T.red}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:12,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,background:`radial-gradient(circle at 50% 50%, ${T.red}18, transparent 70%)`,animation:"sosPulse 2s ease-in-out infinite"}}/>
              <span style={{fontSize:26,position:"relative"}}>🆘</span>
              <div style={{textAlign:"left",position:"relative"}}>
                <div style={{fontSize:15,fontWeight:900,color:T.red,letterSpacing:.8}}>SOS EMERGENCY</div>
                <div style={{fontSize:11,color:T.muted,marginTop:1}}>Hold to alert all {convoy.members.length-1} convoy members</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ── SOS active location-sharing banner (shown after SOS fires) ── */}
      {sosSent && mapTab !== "info" && (
        <div style={{background:T.red,padding:"8px 16px",display:"flex",alignItems:"center",gap:10,animation:"slideDown .3s ease",flexShrink:0}}>
          <span style={{fontSize:14,animation:"sosShake .6s ease infinite"}}>🆘</span>
          <div style={{flex:1}}>
            <div style={{fontSize:11,fontWeight:800,color:"#fff",letterSpacing:.5}}>SOS ACTIVE — Location shared with all members</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.75)"}}>Rahul, Priya & Aman have been notified</div>
          </div>
          <button onClick={()=>setSosSent(false)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}>
            <Ic d={ICONS.close} size={14} color="rgba(255,255,255,.8)"/>
          </button>
        </div>
      )}

      {/* ── INFO TAB ── */}
      {mapTab==="info"&&(
        <div style={{flex:1,overflowY:"auto",padding:"14px"}}>
          <div style={{background:`linear-gradient(135deg,${convoy.color}18,${convoy.color}06)`,border:`1px solid ${convoy.color}30`,borderRadius:18,padding:"16px",marginBottom:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              {[{label:"DISTANCE",val:`${convoy.distance}km`,c:convoy.color},{label:"MEMBERS",val:convoy.members.length,c:T.blue},{label:"ALERT AT",val:`${convoy.alertKm}km`,c:T.amber}].map(s=>(
                <div key={s.label} style={{textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:800,color:s.c,fontFamily:"'Space Mono',monospace",lineHeight:1}}>{s.val}</div>
                  <div style={{fontSize:9,color:T.muted,fontWeight:700,letterSpacing:.8,marginTop:4}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{height:1,background:`${convoy.color}20`,margin:"14px 0"}}/>
            <div style={{display:"flex",gap:16}}>
              <div style={{fontSize:12,color:T.sub}}>📅 {convoy.date}</div>
              <div style={{fontSize:12,color:T.sub}}>🕐 Departs {convoy.time}</div>
            </div>
          </div>
          {convoy.notes&&<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"12px 14px",marginBottom:14,display:"flex",gap:10}}>
            <Ic d={ICONS.note} size={15}/><span style={{fontSize:12,color:T.sub,lineHeight:1.5}}>{convoy.notes}</span>
          </div>}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <button onClick={()=>onEdit(convoy)} style={{padding:"14px",borderRadius:14,background:T.accentLo,border:`1.5px solid ${T.accent}`,color:T.accent,fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Ic d={ICONS.edit} size={16} color={T.accent} sw={2}/> Edit Convoy
            </button>
            <button onClick={()=>onDelete(convoy)} style={{padding:"14px",borderRadius:14,background:T.redLo,border:`1.5px solid ${T.red}`,color:T.red,fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Ic d={ICONS.trash} size={16} color={T.red} sw={2}/> Delete Convoy
            </button>
          </div>
        </div>
      )}
      {/* Fullscreen Map */}
      {fullMap && <FullscreenMap convoy={convoy} initialSelId={fSelId} onClose={()=>setFullMap(false)}/>}

      {/* SOS Confirm Modal */}
      {sosOpen && <SosModal convoy={convoy} onConfirm={fireSos} onClose={()=>setSosOpen(false)}/>}

      {/* Notification Feed (what other members see) */}
      {sosSent && <SosNotifFeed convoy={convoy} sender={sender} onClose={()=>setSosSent(false)}/>}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// STANDARD DETAIL SCREEN
// ══════════════════════════════════════════════════════════════════════════════
const DetailScreen = ({ convoy, onBack, onEdit, onDelete }) => {
  const T = useT();
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${T.border}`}}>
        <button onClick={onBack} style={{width:34,height:34,borderRadius:10,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Ic d={ICONS.back} size={16}/>
        </button>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:15,fontWeight:800,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{convoy.name}</div>
          <div style={{fontSize:11,color:T.muted}}>{convoy.destination}</div>
        </div>
        <Badge status={convoy.status}/>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px"}}>
        <div style={{background:`linear-gradient(135deg,${convoy.color}18,${convoy.color}06)`,border:`1px solid ${convoy.color}30`,borderRadius:18,padding:"16px",marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            {[{label:"DISTANCE",val:`${convoy.distance}km`,c:convoy.color},{label:"MEMBERS",val:convoy.members.length,c:T.blue},{label:"ALERT AT",val:`${convoy.alertKm}km`,c:T.amber}].map(s=>(
              <div key={s.label} style={{textAlign:"center"}}>
                <div style={{fontSize:22,fontWeight:800,color:s.c,fontFamily:"'Space Mono',monospace",lineHeight:1}}>{s.val}</div>
                <div style={{fontSize:9,color:T.muted,fontWeight:700,letterSpacing:.8,marginTop:4}}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{height:1,background:`${convoy.color}20`,margin:"14px 0"}}/>
          <div style={{display:"flex",gap:16}}>
            <div style={{fontSize:12,color:T.sub}}>📅 {convoy.date}</div>
            <div style={{fontSize:12,color:T.sub}}>🕐 {convoy.time}</div>
          </div>
        </div>
        {convoy.notes&&<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"12px 14px",marginBottom:14,display:"flex",gap:10}}>
          <Ic d={ICONS.note} size={15}/><span style={{fontSize:12,color:T.sub,lineHeight:1.5}}>{convoy.notes}</span>
        </div>}
        <div style={{fontSize:11,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase",marginBottom:10}}>Members · {convoy.members.length}</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
          {convoy.members.map(m=>(
            <div key={m.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"11px 14px",display:"flex",alignItems:"center",gap:11}}>
              <Avatar name={m.name} color={m.color} size={38}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:13,fontWeight:700,color:T.text}}>{m.name}</span>
                  {m.role==="admin"&&<span style={{background:T.accentLo,color:T.accent,fontSize:9,fontWeight:800,padding:"1px 7px",borderRadius:10}}>ADMIN</span>}
                </div>
                <div style={{fontSize:11,color:T.muted,marginTop:2}}>{m.car}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <button onClick={()=>onEdit(convoy)} style={{padding:"14px",borderRadius:14,background:T.accentLo,border:`1.5px solid ${T.accent}`,color:T.accent,fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Ic d={ICONS.edit} size={16} color={T.accent} sw={2}/> Edit Convoy
          </button>
          <button onClick={()=>onDelete(convoy)} style={{padding:"14px",borderRadius:14,background:T.redLo,border:`1.5px solid ${T.red}`,color:T.red,fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Ic d={ICONS.trash} size={16} color={T.red} sw={2}/> Delete Convoy
          </button>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// FORM SHEET
// ══════════════════════════════════════════════════════════════════════════════
const FormSheet = ({ convoy, onSave, onClose }) => {
  const T=useT();
  const editing=!!convoy?.id;
  const blank={name:"",destination:"",date:"",time:"",alertKm:5,notes:"",color:T.accent,status:"upcoming",members:[]};
  const [form,setForm]=useState(convoy?{...convoy,members:convoy.members.map(m=>({...m}))}:blank);
  const [tab,setTab]=useState("details");
  const [mName,setMName]=useState(""); const [mCar,setMCar]=useState("");
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const valid=form.name.trim()&&form.destination.trim()&&form.date;
  const addMember=()=>{
    if(!mName.trim()) return;
    const initials=mName.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
    set("members",[...form.members,{id:Date.now(),name:mName.trim(),initials,car:mCar.trim()||"Vehicle TBD",color:MC[form.members.length%MC.length],role:form.members.length===0?"admin":"member"}]);
    setMName(""); setMCar("");
  };
  return (
    <div style={{position:"absolute",inset:0,zIndex:50,display:"flex",flexDirection:"column"}}>
      <div style={{flex:"0 0 60px",background:"rgba(4,6,10,.5)",backdropFilter:"blur(4px)"}} onClick={onClose}/>
      <div style={{flex:1,background:T.surface,borderRadius:"22px 22px 0 0",display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:`0 -20px 60px rgba(0,0,0,${T.isDark?.6:.25})`}}>
        <div style={{padding:"10px 18px 0"}}>
          <div style={{width:36,height:4,background:T.border,borderRadius:4,margin:"0 auto 12px"}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <div style={{fontSize:17,fontWeight:800,color:T.text}}>{editing?"Edit Convoy":"New Convoy"}</div>
              <div style={{fontSize:11,color:T.muted,marginTop:1}}>{editing?convoy.name:"Set up a new group trip"}</div>
            </div>
            <button onClick={onClose} style={{width:32,height:32,borderRadius:10,background:T.card,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Ic d={ICONS.close} size={14}/>
            </button>
          </div>
          <div style={{display:"flex",borderBottom:`1px solid ${T.border}`}}>
            {[["details","Details"],["members",`Members (${form.members.length})`]].map(([id,lbl])=>(
              <button key={id} onClick={()=>setTab(id)} style={{flex:1,background:"none",border:"none",padding:"9px 0",fontSize:13,fontWeight:700,color:tab===id?T.accent:T.muted,borderBottom:`2px solid ${tab===id?T.accent:"transparent"}`,marginBottom:-1,cursor:"pointer"}}>{lbl}</button>
            ))}
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"16px 18px"}}>
          {tab==="details"&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <Field label="Convoy Name" value={form.name} onChange={v=>set("name",v)} placeholder="e.g. Delhi Road Trip"/>
              <Field label="Destination" value={form.destination} onChange={v=>set("destination",v)} placeholder="e.g. New Delhi, India"/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Field label="Date" type="date" value={form.date} onChange={v=>set("date",v)}/>
                <Field label="Time" type="time" value={form.time} onChange={v=>set("time",v)}/>
              </div>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase",marginBottom:8}}>Alert Distance</div>
                <div style={{display:"flex",gap:8}}>
                  {[2,5,10,20].map(km=>(
                    <button key={km} onClick={()=>set("alertKm",km)} style={{flex:1,padding:"10px 0",borderRadius:10,border:`1.5px solid ${form.alertKm===km?T.amber:T.border}`,background:form.alertKm===km?T.amberLo:T.raised,color:form.alertKm===km?T.amber:T.muted,fontSize:13,fontWeight:700,cursor:"pointer"}}>{km}km</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase",marginBottom:8}}>Color Tag</div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  {MC.map(c=>(
                    <button key={c} onClick={()=>set("color",c)} style={{width:30,height:30,borderRadius:"50%",background:c,border:`3px solid ${form.color===c?"#fff":"transparent"}`,boxShadow:form.color===c?`0 0 0 2px ${c}55`:"none",cursor:"pointer"}}/>
                  ))}
                </div>
              </div>
              {editing&&(
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase",marginBottom:8}}>Status</div>
                  <div style={{display:"flex",gap:8}}>
                    {Object.entries(getStatus(T)).map(([key,s])=>(
                      <button key={key} onClick={()=>set("status",key)} style={{flex:1,padding:"10px 0",borderRadius:10,border:`1.5px solid ${form.status===key?s.dot:T.border}`,background:form.status===key?s.bg:T.raised,color:form.status===key?s.dot:T.muted,fontSize:12,fontWeight:700,cursor:"pointer"}}>{s.label}</button>
                    ))}
                  </div>
                </div>
              )}
              <FieldArea label="Notes" value={form.notes} onChange={v=>set("notes",v)} placeholder="Meeting point, fuel stops, route notes…"/>
            </div>
          )}
          {tab==="members"&&(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {form.members.length===0&&<div style={{textAlign:"center",padding:"20px 0",fontSize:12,color:T.muted}}>No members yet.</div>}
              {form.members.map(m=>(
                <div key={m.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"10px 12px",display:"flex",alignItems:"center",gap:10}}>
                  <Avatar name={m.name} color={m.color} size={36}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:13,fontWeight:700,color:T.text}}>{m.name}</span>
                      {m.role==="admin"&&<span style={{background:T.accentLo,color:T.accent,fontSize:9,fontWeight:800,padding:"1px 7px",borderRadius:10}}>ADMIN</span>}
                    </div>
                    <div style={{fontSize:11,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.car}</div>
                  </div>
                  <button onClick={()=>set("members",form.members.filter(x=>x.id!==m.id))} style={{width:28,height:28,borderRadius:8,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Ic d={ICONS.close} size={12} color={T.red}/>
                  </button>
                </div>
              ))}
              <div style={{background:T.raised,border:`1.5px dashed ${T.borderHi}`,borderRadius:14,padding:"14px"}}>
                <div style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase",marginBottom:10}}>Add Member</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  <Field value={mName} onChange={setMName} placeholder="Member name"/>
                  <Field value={mCar}  onChange={setMCar}  placeholder="Car · Number (optional)"/>
                  <button onClick={addMember} disabled={!mName.trim()} style={{padding:"11px",borderRadius:10,background:mName.trim()?T.accentLo:T.raised,border:`1.5px solid ${mName.trim()?T.accent:T.border}`,color:mName.trim()?T.accent:T.muted,fontSize:13,fontWeight:700,cursor:mName.trim()?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    <Ic d={ICONS.plus} size={14} color={mName.trim()?T.accent:T.muted} sw={2.2}/> Add Member
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div style={{padding:"12px 18px 20px",borderTop:`1px solid ${T.border}`}}>
          <button onClick={()=>valid&&onSave({...form,id:convoy?.id||Date.now()})} disabled={!valid}
            style={{width:"100%",padding:"15px",borderRadius:14,background:valid?T.accent:T.muted,border:"none",color:valid?(T.isDark?"#080B12":"#fff"):T.surface,fontSize:15,fontWeight:800,cursor:valid?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Ic d={ICONS.check} size={17} color={valid?(T.isDark?"#080B12":"#fff"):T.surface} sw={2.5}/>{editing?"Save Changes":"Create Convoy"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Delete Sheet ──────────────────────────────────────────────────────────────
const DeleteSheet = ({ convoy, onConfirm, onClose }) => {
  const T=useT();
  return (
    <div style={{position:"absolute",inset:0,zIndex:60,display:"flex",flexDirection:"column"}}>
      <div style={{flex:1,background:`rgba(4,6,10,${T.isDark?.7:.4})`,backdropFilter:"blur(4px)"}} onClick={onClose}/>
      <div style={{background:T.surface,borderRadius:"22px 22px 0 0",padding:"20px 22px 30px",boxShadow:`0 -20px 60px rgba(0,0,0,${T.isDark?.6:.2})`}}>
        <div style={{width:36,height:4,background:T.border,borderRadius:4,margin:"0 auto 20px"}}/>
        <div style={{width:52,height:52,borderRadius:16,background:T.redLo,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>
          <Ic d={ICONS.trash} size={24} color={T.red} sw={1.8}/>
        </div>
        <div style={{fontSize:18,fontWeight:800,color:T.text,marginBottom:8}}>Delete Convoy?</div>
        <div style={{fontSize:13,color:T.sub,lineHeight:1.6,marginBottom:24}}>
          "<span style={{color:T.text,fontWeight:700}}>{convoy.name}</span>" will be permanently removed.
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:"14px",borderRadius:14,background:T.card,border:`1px solid ${T.border}`,color:T.sub,fontSize:14,fontWeight:700,cursor:"pointer"}}>Cancel</button>
          <button onClick={onConfirm} style={{flex:1,padding:"14px",borderRadius:14,background:T.red,border:"none",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer"}}>Delete</button>
        </div>
      </div>
    </div>
  );
};

// ── Convoy Card ───────────────────────────────────────────────────────────────
const ConvoyCard = ({ convoy, onTap, onEdit, onDelete }) => {
  const T=useT();
  return (
    <div onClick={()=>onTap(convoy)} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,overflow:"hidden",cursor:"pointer",transition:"box-shadow .15s"}}
      onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 4px 20px ${convoy.color}22`}
      onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
      <div style={{height:3,background:`linear-gradient(90deg,${convoy.color},${convoy.color}44)`}}/>
      <div style={{padding:"14px 15px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:15,fontWeight:800,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:4}}>{convoy.name}</div>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <Ic d={ICONS.map} size={11} color={T.muted}/>
              <span style={{fontSize:11,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{convoy.destination}</span>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:10,flexShrink:0}}>
            <Badge status={convoy.status}/>
            <button onClick={e=>{e.stopPropagation();onEdit(convoy);}} style={{width:28,height:28,borderRadius:8,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Ic d={ICONS.edit} size={12} color={T.accent}/>
            </button>
            <button onClick={e=>{e.stopPropagation();onDelete(convoy);}} style={{width:28,height:28,borderRadius:8,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Ic d={ICONS.trash} size={12} color={T.red}/>
            </button>
          </div>
        </div>
        <div style={{display:"flex",gap:14,marginBottom:12}}>
          <span style={{fontSize:11,color:T.sub}}>📅 {convoy.date}</span>
          <span style={{fontSize:11,color:T.sub}}>🕐 {convoy.time}</span>
          <span style={{fontSize:11,color:convoy.color,fontWeight:700,fontFamily:"'Space Mono',monospace"}}>{convoy.distance}km</span>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <AvatarStack members={convoy.members} max={4}/>
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            <Ic d={ICONS.users} size={11} color={T.muted}/>
            <span style={{fontSize:11,color:T.muted}}>{convoy.members.length} member{convoy.members.length!==1&&"s"}</span>
            <Ic d={ICONS.chevron} size={13} color={T.muted}/>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Home Screen ───────────────────────────────────────────────────────────────
const HomeScreen = ({ convoys, onTap, onEdit, onDelete, onNew }) => {
  const T=useT();
  const [search,setSearch]=useState(""), [filter,setFilter]=useState("all");
  const filtered=convoys.filter(c=>(filter==="all"||c.status===filter)&&(c.name.toLowerCase().includes(search.toLowerCase())||c.destination.toLowerCase().includes(search.toLowerCase())));
  const live=convoys.filter(c=>c.status==="live");
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"16px 18px 12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
          <div>
            <div style={{fontSize:22,fontWeight:800,color:T.text,lineHeight:1.1}}>My Convoys</div>
            <div style={{fontSize:12,color:T.muted,marginTop:3}}>{convoys.length} trips · {live.length} live</div>
          </div>
          <button onClick={onNew} style={{width:40,height:40,borderRadius:13,background:T.accent,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 20px ${T.accent}44`}}>
            <Ic d={ICONS.plus} size={18} color={T.isDark?"#080B12":"#fff"} sw={2.5}/>
          </button>
        </div>
        {live.length>0&&(
          <div onClick={()=>onTap(live[0])} style={{background:`linear-gradient(135deg,${live[0].color}18,${live[0].color}06)`,border:`1px solid ${live[0].color}40`,borderRadius:16,padding:"12px 14px",marginBottom:14,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:36,height:36,borderRadius:12,background:`${live[0].color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🚗</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:live[0].color,animation:"pulse 1.4s infinite",display:"inline-block"}}/>
                <span style={{fontSize:12,fontWeight:800,color:live[0].color}}>LIVE NOW</span>
              </div>
              <div style={{fontSize:14,fontWeight:700,color:T.text}}>{live[0].name}</div>
              <div style={{fontSize:11,color:T.sub}}>{live[0].members.length} members · {live[0].distance}km remaining</div>
            </div>
            <Ic d={ICONS.chevron} size={16} color={live[0].color}/>
          </div>
        )}
        <div style={{position:"relative",marginBottom:12}}>
          <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}><Ic d={ICONS.search} size={14}/></div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search convoys…"
            style={{width:"100%",background:T.card,border:`1.5px solid ${T.border}`,borderRadius:12,padding:"11px 12px 11px 36px",fontSize:13,color:T.text,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}
            onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
        </div>
        <div style={{display:"flex",gap:7,overflowX:"auto",scrollbarWidth:"none"}}>
          {[["all","All"],["live","Live"],["upcoming","Upcoming"],["completed","Done"]].map(([val,lbl])=>(
            <button key={val} onClick={()=>setFilter(val)} style={{flexShrink:0,padding:"6px 16px",borderRadius:20,border:`1.5px solid ${filter===val?T.accent:T.border}`,background:filter===val?T.accentLo:T.card,color:filter===val?T.accent:T.muted,fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .15s"}}>{lbl}</button>
          ))}
        </div>
      </div>
      <div style={{display:"flex",gap:10,padding:"0 18px 14px",overflowX:"auto",scrollbarWidth:"none"}}>
        {[
          {label:"Total",   val:convoys.length,                                color:T.accent},
          {label:"Live",    val:convoys.filter(c=>c.status==="live").length,   color:T.red   },
          {label:"Upcoming",val:convoys.filter(c=>c.status==="upcoming").length,color:T.blue },
          {label:"Members", val:[...new Set(convoys.flatMap(c=>c.members.map(m=>m.name)))].length,color:T.violet},
        ].map(s=>(
          <div key={s.label} style={{flexShrink:0,background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"10px 16px",minWidth:70,textAlign:"center",boxShadow:T.isDark?"none":"0 2px 8px rgba(0,0,0,.06)"}}>
            <div style={{fontSize:20,fontWeight:800,color:s.color,fontFamily:"'Space Mono',monospace"}}>{s.val}</div>
            <div style={{fontSize:10,color:T.muted,fontWeight:700,marginTop:2}}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"0 18px 10px",display:"flex",flexDirection:"column",gap:12}}>
        {filtered.length===0?(
          <div style={{textAlign:"center",padding:"40px 0",color:T.muted}}>
            <div style={{fontSize:36,marginBottom:12}}>🚘</div>
            <div style={{fontSize:14,fontWeight:700,color:T.sub,marginBottom:6}}>No convoys found</div>
            <div style={{fontSize:12}}>Tap + to create your first convoy</div>
          </div>
        ):filtered.map(c=><ConvoyCard key={c.id} convoy={c} onTap={onTap} onEdit={onEdit} onDelete={onDelete}/>)}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [isDark,  setIsDark]  = useState(true);
  const T = isDark ? DARK : LIGHT;

  const [convoys,   setConvoys]   = useState(SEED);
  const [screen,    setScreen]    = useState("home");
  const [activeC,   setActiveC]   = useState(null);
  const [sheet,     setSheet]     = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [toast,     setToast]     = useState(null);
  const [navTab,    setNavTab]    = useState("home");

  const flash=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),2600);};

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

  return (
    <ThemeCtx.Provider value={T}>
      <div style={{fontFamily:"'DM Sans','Nunito',system-ui,sans-serif",background:isDark?"#050709":"#D8E4F8",minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"flex-start",padding:"24px 16px",transition:"background .4s"}}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700;800&family=Space+Mono:wght@700&display=swap" rel="stylesheet"/>

        <div style={{width:"100%",maxWidth:390,background:T.bg,borderRadius:44,border:`1px solid ${T.border}`,boxShadow:isDark?"0 40px 90px rgba(0,0,0,.75),0 0 0 1px rgba(255,255,255,.04)":"0 40px 90px rgba(80,120,200,.2),0 0 0 1px rgba(255,255,255,.8)",overflow:"hidden",minHeight:820,display:"flex",flexDirection:"column",position:"relative",transition:"background .3s,border-color .3s"}}>

          {/* ── Status Bar ── */}
          <div style={{padding:"14px 20px 8px",display:"flex",justifyContent:"space-between",alignItems:"center",background:T.surface,borderBottom:`1px solid ${T.border}`}}>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:12,fontWeight:700,color:T.accent,letterSpacing:1.2}}>CONVOY</span>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {/* Theme toggle */}
              <button onClick={()=>setIsDark(d=>!d)}
                style={{width:60,height:28,borderRadius:14,background:isDark?T.raised:T.accentLo,border:`1.5px solid ${isDark?T.border:T.accent}`,cursor:"pointer",display:"flex",alignItems:"center",padding:"2px 4px",transition:"all .3s",position:"relative",flexShrink:0}}>
                <div style={{width:22,height:22,borderRadius:"50%",background:isDark?T.muted:T.accent,transform:`translateX(${isDark?0:30}px)`,transition:"transform .3s, background .3s",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 6px rgba(0,0,0,.3)"}}>
                  <span style={{fontSize:11}}>{isDark?"🌙":"☀️"}</span>
                </div>
              </button>
              <span style={{fontSize:10,color:T.muted}}>9:41</span>
              <div style={{width:26,height:26,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,color:isDark?"#080B12":"#fff",border:`2px solid ${T.surface}`}}>RO</div>
            </div>
          </div>

          {/* ── Screen content ── */}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg}}>
            {screen==="home"&&(
              <HomeScreen convoys={convoys} onTap={c=>{setActiveC(c);setScreen("detail");}} onEdit={c=>setSheet(c)} onDelete={c=>setDelTarget(c)} onNew={()=>setSheet("create")}/>
            )}
            {screen==="detail"&&activeC&&(
              (convoys.find(c=>c.id===activeC.id)||activeC).status==="live"
                ?<LiveDetailScreen convoy={convoys.find(c=>c.id===activeC.id)||activeC} onBack={()=>{setScreen("home");setActiveC(null);}} onEdit={c=>setSheet(c)} onDelete={c=>setDelTarget(c)}/>
                :<DetailScreen     convoy={convoys.find(c=>c.id===activeC.id)||activeC} onBack={()=>{setScreen("home");setActiveC(null);}} onEdit={c=>setSheet(c)} onDelete={c=>setDelTarget(c)}/>
            )}
          </div>

          {/* ── Bottom Nav ── */}
          <div style={{background:T.surface,borderTop:`1px solid ${T.border}`,padding:"10px 8px 18px",display:"flex"}}>
            {[{id:"home",icon:ICONS.home,label:"Convoys"},{id:"map",icon:ICONS.map,label:"Map"},{id:"bell",icon:ICONS.bell,label:"Alerts"},{id:"users",icon:ICONS.users,label:"Members"}].map(n=>(
              <button key={n.id} onClick={()=>{setNavTab(n.id);if(n.id==="home"){setScreen("home");setActiveC(null);}}}
                style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"6px 4px"}}>
                <div style={{width:40,height:30,borderRadius:10,background:navTab===n.id?T.accentLo:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"background .2s"}}>
                  <Ic d={n.icon} size={17} color={navTab===n.id?T.accent:T.muted} sw={navTab===n.id?2:1.6}/>
                </div>
                <span style={{fontSize:10,fontWeight:navTab===n.id?700:500,color:navTab===n.id?T.accent:T.muted}}>{n.label}</span>
              </button>
            ))}
          </div>

          {sheet!==null&&<FormSheet convoy={sheet==="create"?null:sheet} onSave={handleSave} onClose={()=>setSheet(null)}/>}
          {delTarget&&<DeleteSheet convoy={delTarget} onConfirm={handleDelete} onClose={()=>setDelTarget(null)}/>}

          {toast&&(
            <div style={{position:"absolute",bottom:90,left:"50%",transform:"translateX(-50%)",background:toast.type==="warn"?T.amberLo:T.accentLo,border:`1px solid ${toast.type==="warn"?T.amber:T.accent}`,borderRadius:12,padding:"11px 18px",display:"flex",alignItems:"center",gap:9,boxShadow:"0 8px 30px rgba(0,0,0,.3)",animation:"slideUp .3s ease",whiteSpace:"nowrap",zIndex:99}}>
              <Ic d={toast.type==="warn"?ICONS.trash:ICONS.check} size={14} color={toast.type==="warn"?T.amber:T.accent} sw={2.2}/>
              <span style={{fontSize:13,fontWeight:700,color:toast.type==="warn"?T.amber:T.accent}}>{toast.msg}</span>
            </div>
          )}
        </div>

        <style>{`
          @keyframes pulse    {0%,100%{opacity:1}50%{opacity:.3}}
          @keyframes slideUp  {from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
          @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
          @keyframes sosPing  {0%{transform:scale(1);opacity:.5}100%{transform:scale(1.8);opacity:0}}
          @keyframes sosShake {0%,100%{transform:rotate(0deg)}20%{transform:rotate(-10deg)}40%{transform:rotate(10deg)}60%{transform:rotate(-6deg)}80%{transform:rotate(6deg)}}
          @keyframes sosPulse {0%,100%{opacity:.6}50%{opacity:1}}
          @keyframes fsIn    {from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
          @keyframes slideUp2{from{transform:translateY(100%)}to{transform:translateY(0)}}
          *{box-sizing:border-box;}
          ::-webkit-scrollbar{display:none;}
          input::placeholder,textarea::placeholder{opacity:.5;}
          input[type="date"],input[type="time"]{color-scheme:${isDark?"dark":"light"};}
        `}</style>
      </div>
    </ThemeCtx.Provider>
  );
}
