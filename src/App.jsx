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
    members:[{id:1,name:"Rohan",initials:"RO",color:"#3DD68C",car:"Swift · DL4C 1234",   role:"admin", avatar:"https://i.pravatar.cc/150?img=11"  },{id:2,name:"Rahul",initials:"RA",color:"#4A9EFF",car:"Innova · UP32 5567",  role:"member",avatar:"https://i.pravatar.cc/150?img=52"  },{id:3,name:"Priya",initials:"PR",color:"#F5A623",car:"Creta · HR26 8890",   role:"member",avatar:"https://i.pravatar.cc/150?img=47"},{id:4,name:"Aman", initials:"AM",color:"#C36EFF",car:"Fortuner · PB10 4412",role:"member",avatar:"https://i.pravatar.cc/150?img=68"}]},
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
  person:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  camera:"M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z",
  phone:"M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.64A2 2 0 012 .18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z",
  shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  car2:"M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-1m-1 0a2 2 0 11-4 0m4 0H9m-4 0a2 2 0 11-4 0",
  logout:"M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
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
const Field = ({ label, value, onChange, placeholder, type="text", min }) => {
  const T = useT();
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {label&&<label style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase",textAlign:"left"}}>{label}</label>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        {...(min!==undefined?{min}:{})}
        style={{background:T.raised,border:`1.5px solid ${T.border}`,borderRadius:10,padding:"11px 13px",fontSize:13,color:T.text,outline:"none",width:"100%",boxSizing:"border-box",fontFamily:"inherit"}}
        onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
    </div>
  );
};
const FieldArea = ({ label, value, onChange, placeholder }) => {
  const T = useT();
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {label&&<label style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase",textAlign:"left"}}>{label}</label>}
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3}
        style={{background:T.raised,border:`1.5px solid ${T.border}`,borderRadius:10,padding:"11px 13px",fontSize:13,color:T.text,outline:"none",width:"100%",boxSizing:"border-box",fontFamily:"inherit",resize:"none"}}
        onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
    </div>
  );
};

// ── OSRM road-following route fetcher ────────────────────────────────────────
// waypoints: [[lat,lng], ...] — returns [[lat,lng], ...] road-snapped coords
const fetchOSRMRoute = async (waypoints) => {
  try {
    const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(";");
    const res  = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`
    );
    const data = await res.json();
    if (data.code === "Ok" && data.routes?.[0]) {
      // OSRM returns [lng, lat] — flip to [lat, lng] for Leaflet
      return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    }
  } catch (_) {}
  return waypoints; // straight-line fallback
};

// ── Haversine distance (km) between two lat/lng points ───────────────────────
const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
};

// ══════════════════════════════════════════════════════════════════════════════
// LOCATION PICKER  (search + tap on map → reverse geocode via Nominatim)
// ══════════════════════════════════════════════════════════════════════════════
const LocationPickerMap = ({ value, onChange, onClose, accentColor, pinColor, title="Pick Destination" }) => {
  const T = useT();
  const accent = accentColor || T.accent;
  const pin    = pinColor    || "#3DD68C";
  const wrapRef     = useRef(null);
  const mapRef      = useRef(null);
  const markerRef   = useRef(null);
  const searchRef   = useRef(null);
  const searchBarRef = useRef(null);
  const debounceRef = useRef(null);

  const [label,    setLabel]    = useState(value || "");
  const [loading,  setLoading]  = useState(false);
  const [latlng,   setLatlng]   = useState(null);
  const [query,    setQuery]    = useState("");
  const [results,  setResults]  = useState([]);
  const [searching,setSearching]= useState(false);
  const [showRes,  setShowRes]  = useState(false);

  const pinHtml = (color=pin) => `<div style="width:28px;height:28px;background:${color};border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 3px 12px ${color}66;"></div>`;

  const dropPin = (L, map, lat, lng) => {
    if (markerRef.current) markerRef.current.remove();
    markerRef.current = L.marker([lat, lng], {
      icon: L.divIcon({ className:"", iconSize:[28,28], iconAnchor:[14,28], html:pinHtml("#3DD68C") }),
    }).addTo(map);
  };

  // Search Nominatim
  const doSearch = async q => {
    if (!q.trim()) { setResults([]); setShowRes(false); return; }
    setSearching(true); setShowRes(true);
    try {
      const res  = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=6&countrycodes=in`);
      const data = await res.json();
      setResults(data);
    } catch { setResults([]); }
    setSearching(false);
  };

  const onQueryChange = v => {
    setQuery(v);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(v), 420);
  };

  const pickResult = r => {
    const lat = parseFloat(r.lat), lng = parseFloat(r.lon);
    setLatlng({ lat, lng });
    setLabel(r.display_name);
    setQuery(r.display_name);
    setResults([]); setShowRes(false);
    if (mapRef.current && window.L) {
      dropPin(window.L, mapRef.current, lat, lng);
      mapRef.current.setView([lat, lng], 13);
    }
    // Pre-confirm selection so coords are available immediately
    onChange({ label: r.display_name, lat, lng });
  };

  // Map click → reverse geocode
  const handleMapClick = async (L, lat, lng) => {
    setLatlng({ lat, lng });
    setLoading(true); setShowRes(false);
    dropPin(L, mapRef.current, lat, lng);
    mapRef.current.panTo([lat, lng]);
    try {
      const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await res.json();
      const addr = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setLabel(addr); setQuery(addr);
    } catch { setLabel(`${lat.toFixed(5)}, ${lng.toFixed(5)}`); }
    setLoading(false);
  };

  useEffect(() => {
    loadLeaflet().then(L => {
      if (mapRef.current || !wrapRef.current) return;
      const map = L.map(wrapRef.current, {
        zoomControl: false, attributionControl: false,
        center: [20.5937, 78.9629], zoom: 5,
      });
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
      map.on("click", e => handleMapClick(L, e.latlng.lat, e.latlng.lng));
    });
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  const confirm = () => { if (label) { onChange({ label, lat: latlng?.lat, lng: latlng?.lng }); onClose(); } };

  return (
    <div style={{position:"absolute",inset:0,zIndex:60,display:"flex",flexDirection:"column",background:T.bg,animation:"fsIn .25s ease"}}>

      {/* ── Header ── */}
      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,flexShrink:0,padding:"12px 14px 10px",position:"relative",zIndex:30,overflow:"visible"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <button onClick={onClose} style={{width:34,height:34,borderRadius:10,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Ic d={ICONS.back} size={16}/>
          </button>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:800,color:T.text}}>{title}</div>
            <div style={{fontSize:11,color:T.muted}}>Search or tap anywhere on the map</div>
          </div>
        </div>

        {/* Search bar */}
        <div ref={searchBarRef} style={{position:"relative"}}>
          <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",zIndex:1}}>
            {searching
              ? <span style={{fontSize:13}}>⏳</span>
              : <Ic d={ICONS.search} size={15} color={T.muted}/>}
          </div>
          <input
            ref={searchRef}
            value={query}
            onChange={e=>onQueryChange(e.target.value)}
            onFocus={()=>query.trim()&&setShowRes(true)}
            placeholder="Search city, landmark, area…"
            style={{width:"100%",background:T.raised,border:`1.5px solid ${showRes&&results.length?accent:T.border}`,borderRadius:12,padding:"11px 36px 11px 38px",fontSize:13,color:T.text,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}
          />
          {query.length>0&&(
            <button onClick={()=>{setQuery("");setResults([]);setShowRes(false);searchRef.current?.focus();}}
              style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",padding:4}}>
              <Ic d={ICONS.close} size={13} color={T.muted}/>
            </button>
          )}
        </div>
      </div>

      {/* ── Dropdown — fixed so it always paints above Leaflet canvas ── */}
      {showRes&&(()=>{
        const rect = searchBarRef.current?.getBoundingClientRect();
        const top  = rect ? rect.bottom + 6 : 120;
        const left = rect ? rect.left        : 14;
        const width= rect ? rect.width       : 340;
        return (
          <div style={{position:"fixed",top,left,width,background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,boxShadow:"0 12px 40px rgba(0,0,0,.32)",zIndex:99999,overflow:"hidden",maxHeight:260,overflowY:"auto"}}>
            {results.length===0&&!searching&&(
              <div style={{padding:"14px 16px",fontSize:12,color:T.muted,textAlign:"center"}}>No results found</div>
            )}
            {results.map((r,i)=>(
              <button key={i} onClick={()=>pickResult(r)}
                style={{width:"100%",padding:"11px 14px",background:"none",border:"none",borderBottom:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"flex-start",gap:10,textAlign:"left"}}>
                <span style={{fontSize:16,flexShrink:0,marginTop:1}}>📍</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {r.address?.city||r.address?.town||r.address?.village||r.address?.county||r.name||r.display_name.split(",")[0]}
                  </div>
                  <div style={{fontSize:11,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:2}}>{r.display_name}</div>
                </div>
              </button>
            ))}
          </div>
        );
      })()}

      {/* ── Map ── */}
      <div style={{flex:1,position:"relative"}} onClick={()=>setShowRes(false)}>
        <div ref={wrapRef} style={{width:"100%",height:"100%"}}/>
        {/* Zoom controls */}
        <div style={{position:"absolute",right:12,bottom:80,display:"flex",flexDirection:"column",gap:6,zIndex:10}}>
          {["+","−"].map((lbl,i)=>(
            <button key={i} onClick={()=>mapRef.current?.[i===0?"zoomIn":"zoomOut"]()}
              style={{width:36,height:36,borderRadius:10,background:T.isDark?"rgba(10,13,20,.92)":"rgba(255,255,255,.94)",border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:T.text,boxShadow:"0 2px 8px rgba(0,0,0,.2)"}}>
              {lbl}
            </button>
          ))}
        </div>
        {/* Tap hint */}
        {!latlng&&(
          <div style={{position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",background:T.isDark?"rgba(10,13,20,.88)":"rgba(255,255,255,.93)",borderRadius:20,padding:"7px 16px",border:`1px solid ${T.border}`,pointerEvents:"none",whiteSpace:"nowrap",boxShadow:"0 2px 12px rgba(0,0,0,.15)"}}>
            <span style={{fontSize:11,color:T.sub}}>📍 Tap the map to drop a pin</span>
          </div>
        )}
        {/* Selected pill over map */}
        {(latlng||loading)&&(
          <div style={{position:"absolute",top:10,left:10,right:10,background:T.isDark?"rgba(10,13,20,.92)":"rgba(255,255,255,.95)",borderRadius:12,padding:"9px 12px",border:`1px solid ${T.accent}55`,display:"flex",alignItems:"center",gap:8,zIndex:10,backdropFilter:"blur(6px)"}}>
            <span style={{fontSize:14,flexShrink:0}}>{loading?"⏳":"✅"}</span>
            <span style={{fontSize:11,color:T.text,flex:1,lineHeight:1.4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {loading?"Getting address…":label}
            </span>
          </div>
        )}
      </div>

      {/* ── Confirm ── */}
      <div style={{padding:"12px 14px 20px",background:T.surface,borderTop:`1px solid ${T.border}`,flexShrink:0}}>
        <button onClick={confirm} disabled={!label||loading}
          style={{width:"100%",padding:"14px",borderRadius:14,background:label&&!loading?accent:T.muted,border:"none",color:label&&!loading?(T.isDark?"#080B12":"#fff"):T.surface,fontSize:14,fontWeight:800,cursor:label&&!loading?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"background .2s"}}>
          <Ic d={ICONS.check} size={16} color={label&&!loading?(T.isDark?"#080B12":"#fff"):T.surface} sw={2.5}/>
          Use This Location
        </button>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// REAL MAP  (Leaflet + OpenStreetMap, no API key)
// ══════════════════════════════════════════════════════════════════════════════

// Delhi Road Trip live positions (real Noida → Delhi coordinates)
const LIVE_COORDS = {
  1: { lat: 28.5672, lng: 77.3211 }, // Rohan  — Noida Sector 18
  2: { lat: 28.5728, lng: 77.3089 }, // Rahul  — ahead on NH-48
  3: { lat: 28.5601, lng: 77.3310 }, // Priya  — slightly behind
  4: { lat: 28.5490, lng: 77.3420 }, // Aman   — furthest behind
};

const LEAFLET_CSS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
const LEAFLET_JS  = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";

function loadLeaflet() {
  return new Promise((resolve) => {
    if (window.L) return resolve(window.L);
    // CSS
    if (!document.getElementById("lf-css")) {
      const lnk = document.createElement("link");
      lnk.id = "lf-css"; lnk.rel = "stylesheet"; lnk.href = LEAFLET_CSS;
      document.head.appendChild(lnk);
    }
    // JS
    if (!document.getElementById("lf-js")) {
      const s = document.createElement("script");
      s.id = "lf-js"; s.src = LEAFLET_JS;
      s.onload = () => resolve(window.L);
      document.head.appendChild(s);
    } else {
      const wait = setInterval(() => { if (window.L) { clearInterval(wait); resolve(window.L); } }, 50);
    }
  });
}

const LiveMap = ({ members, selectedId, onSelect, outerMapRef }) => {
  const T       = useT();
  const wrapRef = useRef(null);
  const mapRef  = useRef(null);
  const markersRef = useRef({});
  const pulseRef   = useRef({});
  const [ready, setReady] = useState(false);

  // Build marker HTML for a member
  const markerHtml = (m, isMe, isSel) => {
    const R   = isMe ? 38 : 32;
    const bdr = isMe ? `border:3px solid #fff;box-shadow:0 0 0 3px ${m.color},0 4px 16px ${m.color}88`
                     : isSel ? `border:2.5px solid #fff;box-shadow:0 0 0 2px ${m.color}`
                     : `border:2.5px solid ${m.color};box-shadow:0 3px 10px rgba(0,0,0,.25)`;
    const img = m.avatar
      ? `<img src="${m.avatar}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;"/>`
      : `<div style="width:100%;height:100%;border-radius:50%;background:${m.color};display:flex;align-items:center;justify-content:center;font-size:${isMe?13:11}px;font-weight:800;color:#fff;font-family:DM Sans,sans-serif;">${m.initials}</div>`;
    const pulse = isMe
      ? `<div style="position:absolute;inset:-8px;border-radius:50%;background:${m.color}30;animation:lf-pulse 2s ease-in-out infinite;pointer-events:none;"></div>
         <div style="position:absolute;inset:-4px;border-radius:50%;background:${m.color}20;animation:lf-pulse 2s ease-in-out infinite .6s;pointer-events:none;"></div>`
      : "";
    const crown = isMe
      ? `<div style="position:absolute;top:-14px;left:50%;transform:translateX(-50%);font-size:12px;line-height:1;">★</div>` : "";
    const label = isMe ? "★ You"  : m.name;
    const lbgc  = isMe ? m.color  : (T.isDark ? "rgba(10,13,22,.9)" : "rgba(255,255,255,.95)");
    const ltxtc = isMe ? (T.isDark ? "#080B12" : "#fff") : m.color;
    return `<div style="position:relative;width:${R}px;height:${R}px;${bdr};border-radius:50%;cursor:pointer;">
      ${pulse}${img}
      <div style="position:absolute;top:calc(100% + 4px);left:50%;transform:translateX(-50%);background:${lbgc};color:${ltxtc};font-size:${isMe?10:9}px;font-weight:800;white-space:nowrap;padding:2px 8px;border-radius:20px;font-family:DM Sans,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.2);">${label}</div>
    </div>`;
  };

  // Init map once
  useEffect(() => {
    loadLeaflet().then(L => {
      if (mapRef.current || !wrapRef.current) return;

      // Inject pulse keyframes once
      if (!document.getElementById("lf-kf")) {
        const s = document.createElement("style");
        s.id = "lf-kf";
        s.textContent = `@keyframes lf-pulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.3);opacity:.2}}`;
        document.head.appendChild(s);
      }

      const map = L.map(wrapRef.current, {
        zoomControl: false, attributionControl: false,
        dragging: true, scrollWheelZoom: false, doubleClickZoom: false,
      });
      mapRef.current = map;

      // OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Fit map to all member positions
      const latlngs = members.map(m => [LIVE_COORDS[m.id]?.lat ?? 28.57, LIVE_COORDS[m.id]?.lng ?? 77.32]);
      map.fitBounds(L.latLngBounds(latlngs).pad(0.25));

      // Road-following route via OSRM (Noida Sector 18 → New Delhi)
      const routeWaypoints = [
        [28.5672, 77.3211], // Noida start
        [28.6448, 77.2167], // New Delhi destination
      ];
      fetchOSRMRoute(routeWaypoints).then(coords => {
        if (!mapRef.current) return;
        L.polyline(coords, { color: "#1DB870", weight: 5, opacity: .8 }).addTo(map);
      });

      // Destination marker
      const destIcon = L.divIcon({
        className: "", iconSize: [32, 32], iconAnchor: [16, 16],
        html: `<div style="width:32px;height:32px;background:#1DB870;border-radius:50%;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 0 0 3px #1DB87044,0 4px 12px rgba(0,0,0,.25);">🏁</div>`,
      });
      L.marker([28.6448, 77.2167], { icon: destIcon }).addTo(map)
       .bindPopup("<b>New Delhi</b><br>Destination");

      // Member markers
      members.forEach((m, idx) => {
        const coord = LIVE_COORDS[m.id];
        if (!coord) return;
        const isMe = idx === 0;
        const isSel = m.id === selectedId;
        const icon = L.divIcon({
          className: "", iconSize: [isMe ? 44 : 38], iconAnchor: [isMe ? 22 : 19, isMe ? 22 : 19],
          html: markerHtml(m, isMe, isSel),
        });
        const mk = L.marker([coord.lat, coord.lng], { icon, zIndexOffset: isMe ? 1000 : idx * 10 }).addTo(map);
        mk.on("click", () => onSelect(m.id === selectedId ? null : m.id));
        markersRef.current[m.id] = mk;
      });

      // Share map ref with parent if requested
      if (outerMapRef) outerMapRef.current = map;
      // Force Leaflet to recalculate container size after flex layout settles
      setTimeout(() => { if (mapRef.current) mapRef.current.invalidateSize(); }, 120);
      setReady(true);
    });
    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  // Update marker icons when selection changes
  useEffect(() => {
    if (!mapRef.current || !window.L) return;
    const L = window.L;
    members.forEach((m, idx) => {
      const mk = markersRef.current[m.id];
      if (!mk) return;
      const isMe = idx === 0, isSel = m.id === selectedId;
      mk.setIcon(L.divIcon({
        className: "", iconSize: [isMe ? 44 : 38], iconAnchor: [isMe ? 22 : 19, isMe ? 22 : 19],
        html: markerHtml(m, isMe, isSel),
      }));
    });
  }, [selectedId, T]);

  // Handle click on map (deselect)
  useEffect(() => {
    if (!mapRef.current) return;
    const handler = () => onSelect(null);
    mapRef.current.on("click", handler);
    return () => mapRef.current?.off("click", handler);
  }, [onSelect]);

  return (
    <div ref={wrapRef} style={{ width:"100%", height:"100%", background: T.mapBg }}/>
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
  const [showGaps,   setShowGaps]   = useState(false);
  const innerMapRef = useRef(null); // shared from LiveMap

  const selMember  = selId   != null ? convoy.members.find(m => m.id === selId)   : null;
  const glassLight = "rgba(255,255,255,.94)";
  const glassDark  = "rgba(8,11,18,.91)";
  const glass      = T.isDark ? glassDark : glassLight;
  const shadow     = "0 4px 24px rgba(0,0,0,.45)";

  // After the open animation (300ms) the flex container has its final size —
  // tell Leaflet to recalculate so tiles fill the full area correctly.
  useEffect(() => {
    const t = setTimeout(() => {
      try { innerMapRef.current?.invalidateSize(); } catch(_) {}
    }, 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{position:"absolute",inset:0,zIndex:70,display:"flex",flexDirection:"column",background:"#080B12",animation:"fsIn .3s cubic-bezier(.2,.8,.4,1)"}}>

      {/* ════════════════════  MAP LAYER  ════════════════════ */}
      <div style={{flex:1,position:"relative",overflow:"hidden",minHeight:0}}>
        <LiveMap members={convoy.members} selectedId={selId} onSelect={setSelId} outerMapRef={innerMapRef}/>

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
const LiveDetailScreen = ({ convoy, onBack, onEdit, onDelete, onEndConvoy, authUser=null }) => {
  const T = useT();
  const [selId,    setSelId]    = useState(null);
  const [mapTab,   setMapTab]   = useState("map");
  const [sosOpen,   setSosOpen]  = useState(false);
  const [sosSent,   setSosSent]  = useState(false);
  const [fullMap,   setFullMap]  = useState(false);
  const [fSelId,    setFSelId]   = useState(null);
  const [members,   setMembers]  = useState(convoy.members);
  const [endConfirm,setEndConfirm]=useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementInput, setAnnouncementInput] = useState("");
  const [stopAlerts, setStopAlerts] = useState([]);
  const [stopModalOpen, setStopModalOpen] = useState(false);
  const STOP_REASONS = ["⛽ Fuel Stop","🔧 Breakdown","☕ Rest Break","🚻 Nature Break"];

  // Logged-in user is admin if their name matches any admin member (or if first member is admin and no authUser)
  const isAdmin = authUser
    ? members.some(m=>m.name.toLowerCase()===authUser.name?.toLowerCase()&&m.role==="admin")
    : members[0]?.role==="admin";

  const removeMember = id => setMembers(ms => ms.filter(m => m.id !== id));
  const makeAdmin    = id => setMembers(ms => ms.map(m => ({
    ...m,
    role: m.id === id ? "admin" : m.role === "admin" ? "member" : m.role,
  })));

  // ── Simulate live GPS movement ──
  const [livePositions, setLivePositions] = useState({...LIVE_COORDS});
  const [liveStats, setLiveStats] = useState({...LIVE_DATA});

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePositions(prev => {
        const next = {};
        Object.keys(prev).forEach(id => {
          next[id] = {
            lat: prev[id].lat + (Math.random() - 0.48) * 0.0003,
            lng: prev[id].lng + (Math.random() - 0.45) * 0.0003,
          };
        });
        return next;
      });
      setLiveStats(prev => {
        const next = {...prev};
        Object.keys(next).forEach(id => {
          if (next[id].memberStatus === "moving") {
            next[id] = {
              ...next[id],
              speed: Math.max(30, Math.min(100, next[id].speed + Math.round((Math.random()-0.5)*6))),
              dist: Math.max(0, parseFloat((next[id].dist + (Math.random()-0.4)*0.05).toFixed(1))),
            };
          }
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const selMember = selId!=null?convoy.members.find(m=>m.id===selId):null;
  const selLive   = selId!=null?liveStats[selId]:null;
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
              <div style={{fontSize:18,fontWeight:800,color:T.accent,fontFamily:"'Space Mono',monospace",lineHeight:1}}>{liveStats[1]?.speed||62}</div>
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
                  const ld=liveStats[m.id], warn=ld&&ld.dist>4;
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
              const ld=liveStats[m.id], active=selId===m.id, stopped=ld?.memberStatus==="stopped";
              return (
                <button key={m.id} onClick={()=>setSelId(active?null:m.id)}
                  style={{flexShrink:0,background:active?T.accentLo:T.card,border:`1.5px solid ${active?m.color:T.border}`,borderRadius:14,padding:"8px 14px 8px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:9,transition:"all .15s",minWidth:0}}>
                  {/* avatar */}
                  <div style={{width:32,height:32,borderRadius:"50%",background:m.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff",flexShrink:0,letterSpacing:-.5}}>
                    {m.initials}
                  </div>
                  {/* text */}
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:2,minWidth:0}}>
                    <span style={{fontSize:12,fontWeight:700,color:T.text,whiteSpace:"nowrap"}}>{m.name}</span>
                    <span style={{fontSize:10,fontWeight:600,color:stopped?T.amber:T.accent,whiteSpace:"nowrap"}}>{stopped?"⏸ Stopped":`${ld?.speed} km/h`}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* stats */}
          <div style={{display:"flex",padding:"10px 14px",gap:8}}>
            {[{label:"DISTANCE",val:`${convoy.distance}km`,c:convoy.color},{label:"AVG SPEED",val:`${Math.round(Object.values(liveStats).filter(d=>d.memberStatus==="moving").reduce((s,d)=>s+d.speed,0)/Math.max(1,Object.values(liveStats).filter(d=>d.memberStatus==="moving").length))} km/h`,c:T.blue},{label:"ALERT GAP",val:`${convoy.alertKm}km`,c:T.amber},{label:"ETA",val:"4h 32m",c:T.violet}].map(s=>(
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
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontSize:11,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase"}}>Live Member Status</div>
            {isAdmin&&<span style={{fontSize:9,fontWeight:800,color:T.accent,background:T.accentLo,padding:"2px 8px",borderRadius:10}}>ADMIN</span>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {members.map((m,i)=>{
              const ld=liveStats[m.id]||{}, moving=ld.memberStatus==="moving", warn=ld.dist>4;
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
                          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                            <span style={{fontSize:14,fontWeight:800,color:T.text}}>{m.name}</span>
                            {m.role==="admin"&&<span style={{background:T.accentLo,color:T.accent,fontSize:9,fontWeight:800,padding:"1px 7px",borderRadius:10}}>ADMIN</span>}
                            {(authUser?m.name.toLowerCase()===authUser.name?.toLowerCase():i===0)&&<span style={{background:T.blueLo,color:T.blue,fontSize:9,fontWeight:800,padding:"1px 7px",borderRadius:10}}>YOU</span>}
                            {ld.eta&&<span style={{background:T.blueLo,color:T.blue,fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:10,border:`1px solid ${T.blue}44`}}>🕐 {ld.eta}</span>}
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
                    {/* Admin controls — hide for logged-in user (can't remove yourself) */}
                    {isAdmin&&!(authUser?m.name.toLowerCase()===authUser.name?.toLowerCase():i===0)&&(
                      <div style={{display:"flex",gap:8,marginTop:8,paddingTop:8,borderTop:`1px solid ${T.border}`}}>
                        <button onClick={()=>makeAdmin(m.id)}
                          style={{flex:1,padding:"7px 0",borderRadius:10,background:T.accentLo,border:`1px solid ${T.accent}44`,cursor:"pointer",fontSize:11,fontWeight:800,color:T.accent}}>
                          {m.role==="admin"?"↩ Revoke Admin":"👑 Make Admin"}
                        </button>
                        <button onClick={()=>removeMember(m.id)}
                          style={{flex:1,padding:"7px 0",borderRadius:10,background:T.redLo,border:`1px solid ${T.red}44`,cursor:"pointer",fontSize:11,fontWeight:800,color:T.red}}>
                          🚫 Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Active stop alerts banner */}
          {stopAlerts.length>0&&(
            <div style={{marginTop:12,background:T.amberLo,border:`1px solid ${T.amber}44`,borderRadius:14,padding:"10px 14px"}}>
              <div style={{fontSize:10,fontWeight:700,color:T.amber,letterSpacing:.7,textTransform:"uppercase",marginBottom:6}}>Active Stop Alerts</div>
              {stopAlerts.map((a,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                  <span style={{fontSize:13}}>{a.reason.split(" ")[0]}</span>
                  <span style={{fontSize:12,color:T.text,fontWeight:700}}>{a.senderName}</span>
                  <span style={{fontSize:11,color:T.muted}}>{a.reason.split(" ").slice(1).join(" ")}</span>
                  <span style={{marginLeft:"auto",fontSize:10,color:T.muted}}>{a.time}</span>
                </div>
              ))}
            </div>
          )}

          {/* Report Stop button */}
          <div style={{marginTop:12}}>
            <button onClick={()=>setStopModalOpen(true)} style={{width:"100%",padding:"13px",borderRadius:14,background:T.amberLo,border:`1.5px solid ${T.amber}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <span style={{fontSize:16}}>🛑</span>
              <span style={{fontSize:13,fontWeight:800,color:T.amber}}>Report Stop</span>
            </button>
          </div>

          {/* SOS button in members tab */}
          <div style={{marginTop:12}}>
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
            {/* Stats */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
              {[{label:"DISTANCE",val:`${convoy.distance}km`,c:convoy.color},{label:"MEMBERS",val:convoy.members.length,c:T.blue},{label:"ALERT AT",val:`${convoy.alertKm}km`,c:T.amber}].map(s=>(
                <div key={s.label} style={{textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:800,color:s.c,fontFamily:"'Space Mono',monospace",lineHeight:1}}>{s.val}</div>
                  <div style={{fontSize:9,color:T.muted,fontWeight:700,letterSpacing:.8,marginTop:4}}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Route card */}
            <div style={{background:T.isDark?"rgba(0,0,0,.18)":"rgba(255,255,255,.55)",borderRadius:12,padding:"11px 12px",marginBottom:12}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",paddingTop:3,flexShrink:0}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:T.blue,boxShadow:`0 0 0 3px ${T.blue}33`}}/>
                  <div style={{width:2,height:22,background:`linear-gradient(to bottom,${T.blue},${convoy.color})`,margin:"3px 0"}}/>
                  <div style={{width:10,height:10,borderRadius:"50%",background:convoy.color,boxShadow:`0 0 0 3px ${convoy.color}33`}}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{marginBottom:14}}>
                    <div style={{fontSize:9,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase",marginBottom:2}}>Starting Point</div>
                    <div style={{fontSize:12,color:T.text,lineHeight:1.4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{convoy.startingPoint||"Noida Sector 18"}</div>
                  </div>
                  <div>
                    <div style={{fontSize:9,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase",marginBottom:2}}>Destination</div>
                    <div style={{fontSize:12,color:T.text,lineHeight:1.4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{convoy.destination}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Date / time */}
            <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <span style={{fontSize:13}}>📅</span>
                <span style={{fontSize:12,color:T.sub}}>{convoy.date}{convoy.endDate&&convoy.endDate!==convoy.date?` → ${convoy.endDate}`:""}</span>
              </div>
              {convoy.time&&<div style={{display:"flex",alignItems:"center",gap:5}}>
                <span style={{fontSize:13}}>🕐</span>
                <span style={{fontSize:12,color:T.sub}}>Departs {convoy.time}</span>
              </div>}
            </div>
          </div>
          {convoy.notes&&<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"12px 14px",marginBottom:14,display:"flex",gap:10}}>
            <Ic d={ICONS.note} size={15}/><span style={{fontSize:12,color:T.sub,lineHeight:1.5}}>{convoy.notes}</span>
          </div>}

          {/* Invite Code */}
          {convoy.inviteCode&&(
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"12px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
              <div style={{flex:1}}>
                <div style={{fontSize:9,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase",marginBottom:4}}>Invite Code</div>
                <div style={{fontSize:22,fontWeight:800,color:T.accent,fontFamily:"'Space Mono',monospace",letterSpacing:3}}>{convoy.inviteCode}</div>
              </div>
              <button onClick={()=>{ navigator.clipboard?.writeText(convoy.inviteCode); }}
                style={{padding:"8px 14px",borderRadius:10,background:T.accentLo,border:`1px solid ${T.accent}44`,cursor:"pointer",fontSize:12,fontWeight:700,color:T.accent,flexShrink:0}}>
                Copy
              </button>
            </div>
          )}

          {/* Announcements */}
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px",marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase",marginBottom:10}}>📢 Announcements</div>
            {announcements.length===0&&<div style={{fontSize:12,color:T.muted,textAlign:"center",padding:"8px 0"}}>No announcements yet.</div>}
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:isAdmin?12:0}}>
              {announcements.map((a,i)=>(
                <div key={i} style={{background:T.raised,borderRadius:12,padding:"10px 12px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:11,fontWeight:800,color:T.accent}}>{a.sender}</span>
                    <span style={{fontSize:10,color:T.muted}}>{a.time}</span>
                  </div>
                  <div style={{fontSize:12,color:T.text,lineHeight:1.5}}>{a.message}</div>
                </div>
              ))}
            </div>
            {isAdmin&&(
              <div style={{display:"flex",gap:8,marginTop:announcements.length>0?0:0}}>
                <input value={announcementInput} onChange={e=>setAnnouncementInput(e.target.value)}
                  placeholder="Type an announcement…"
                  style={{flex:1,background:T.raised,border:`1.5px solid ${T.border}`,borderRadius:10,padding:"9px 12px",fontSize:12,color:T.text,outline:"none",fontFamily:"inherit"}}
                  onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
                <button onClick={()=>{
                  if(!announcementInput.trim()) return;
                  const now = new Date();
                  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}`;
                  setAnnouncements(as=>[...as,{sender:authUser?.name||convoy.members[0]?.name||"Admin",message:announcementInput.trim(),time}]);
                  setAnnouncementInput("");
                }} style={{padding:"9px 14px",borderRadius:10,background:T.accent,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,color:T.isDark?"#080B12":"#fff",flexShrink:0}}>
                  📢 Send
                </button>
              </div>
            )}
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <button onClick={()=>onEdit(convoy)} style={{padding:"14px",borderRadius:14,background:T.accentLo,border:`1.5px solid ${T.accent}`,color:T.accent,fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Ic d={ICONS.edit} size={16} color={T.accent} sw={2}/> Edit Convoy
            </button>
            {isAdmin&&(
              <button onClick={()=>setEndConfirm(true)} style={{padding:"14px",borderRadius:14,background:`${T.amber}14`,border:`1.5px solid ${T.amber}`,color:T.amber,fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                🏁 End Convoy Early
              </button>
            )}
            <button onClick={()=>onDelete(convoy)} style={{padding:"14px",borderRadius:14,background:T.redLo,border:`1.5px solid ${T.red}`,color:T.red,fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Ic d={ICONS.trash} size={16} color={T.red} sw={2}/> Delete Convoy
            </button>
          </div>
        </div>
      )}

      {/* ── End Convoy confirmation sheet ── */}
      {endConfirm&&(
        <div style={{position:"absolute",inset:0,zIndex:80,display:"flex",flexDirection:"column",background:`rgba(4,6,10,${T.isDark?.7:.4})`,backdropFilter:"blur(6px)",alignItems:"center",justifyContent:"flex-end"}}>
          <div style={{width:"100%",background:T.surface,borderRadius:"22px 22px 0 0",padding:"24px 22px 32px",boxShadow:`0 -20px 60px rgba(0,0,0,${T.isDark?.5:.2})`}}>
            <div style={{width:36,height:4,background:T.border,borderRadius:4,margin:"0 auto 20px"}}/>
            <div style={{fontSize:36,textAlign:"center",marginBottom:12}}>🏁</div>
            <div style={{fontSize:18,fontWeight:800,color:T.text,textAlign:"center",marginBottom:8}}>End Convoy Early?</div>
            <div style={{fontSize:13,color:T.sub,textAlign:"center",lineHeight:1.6,marginBottom:22}}>
              This will mark <strong style={{color:T.text}}>{convoy.name}</strong> as completed and notify all {members.length} members.
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setEndConfirm(false)} style={{flex:1,padding:"14px",borderRadius:14,background:T.card,border:`1px solid ${T.border}`,color:T.sub,fontSize:14,fontWeight:700,cursor:"pointer"}}>Cancel</button>
              <button onClick={()=>{setEndConfirm(false);onEndConvoy&&onEndConvoy(convoy);}} style={{flex:1,padding:"14px",borderRadius:14,background:T.amber,border:"none",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer"}}>End Trip</button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Map */}
      {fullMap && <FullscreenMap convoy={convoy} initialSelId={fSelId} onClose={()=>setFullMap(false)}/>}

      {/* Stop Report Modal */}
      {stopModalOpen&&(
        <div style={{position:"absolute",inset:0,zIndex:80,display:"flex",flexDirection:"column",background:`rgba(4,6,10,${T.isDark?.7:.4})`,backdropFilter:"blur(6px)",alignItems:"center",justifyContent:"flex-end"}}>
          <div style={{width:"100%",background:T.surface,borderRadius:"22px 22px 0 0",padding:"24px 22px 32px",boxShadow:`0 -20px 60px rgba(0,0,0,${T.isDark?.5:.2})`}}>
            <div style={{width:36,height:4,background:T.border,borderRadius:4,margin:"0 auto 20px"}}/>
            <div style={{fontSize:18,fontWeight:800,color:T.text,marginBottom:16}}>🛑 Report a Stop</div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
              {STOP_REASONS.map(r=>(
                <button key={r} onClick={()=>{
                  const senderName = authUser?.name||convoy.members[0]?.name||"You";
                  const now = new Date();
                  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}`;
                  setStopAlerts(sa=>[...sa,{reason:r,senderName,time}]);
                  setStopModalOpen(false);
                }} style={{padding:"13px 16px",borderRadius:14,background:T.card,border:`1px solid ${T.border}`,color:T.text,fontSize:13,fontWeight:700,cursor:"pointer",textAlign:"left"}}>
                  {r}
                </button>
              ))}
            </div>
            <button onClick={()=>setStopModalOpen(false)} style={{width:"100%",padding:"13px",borderRadius:14,background:T.raised,border:`1px solid ${T.border}`,color:T.muted,fontSize:14,fontWeight:700,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      )}

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
const DetailScreen = ({ convoy, onBack, onEdit, onDelete, onStartConvoy, authUser }) => {
  const T = useT();
  const [memberStatuses, setMemberStatuses] = useState({});
  const isUpcoming = convoy.status === "upcoming";
  const myMember = authUser ? convoy.members.find(m => m.name.toLowerCase() === authUser.name?.toLowerCase()) : null;
  const isMe = (m) => authUser ? m.name.toLowerCase() === authUser.name?.toLowerCase() : false;

  const STATUS_OPTS = [
    { key:"ready",    label:"✅ Ready",        color:"#3DD68C" },
    { key:"late",     label:"🕐 Running Late", color:"#F5A623" },
    { key:"enroute",  label:"🚗 En Route",     color:"#4A9EFF" },
  ];

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
          {/* Stats row */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
            {[{label:"DISTANCE",val:`${convoy.distance}km`,c:convoy.color},{label:"MEMBERS",val:convoy.members.length,c:T.blue},{label:"ALERT AT",val:`${convoy.alertKm}km`,c:T.amber}].map(s=>(
              <div key={s.label} style={{textAlign:"center"}}>
                <div style={{fontSize:22,fontWeight:800,color:s.c,fontFamily:"'Space Mono',monospace",lineHeight:1}}>{s.val}</div>
                <div style={{fontSize:9,color:T.muted,fontWeight:700,letterSpacing:.8,marginTop:4}}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Route: start → destination */}
          <div style={{background:T.isDark?"rgba(0,0,0,.18)":"rgba(255,255,255,.55)",borderRadius:12,padding:"11px 12px",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
              {/* Timeline dots */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",paddingTop:3,flexShrink:0}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:T.blue,boxShadow:`0 0 0 3px ${T.blue}33`}}/>
                <div style={{width:2,height:22,background:`linear-gradient(to bottom,${T.blue},${convoy.color})`,margin:"3px 0"}}/>
                <div style={{width:10,height:10,borderRadius:"50%",background:convoy.color,boxShadow:`0 0 0 3px ${convoy.color}33`}}/>
              </div>
              {/* Labels */}
              <div style={{flex:1,minWidth:0}}>
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:9,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase",marginBottom:2}}>Starting Point</div>
                  <div style={{fontSize:12,color:T.text,lineHeight:1.4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{convoy.startingPoint||"Not set"}</div>
                </div>
                <div>
                  <div style={{fontSize:9,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase",marginBottom:2}}>Destination</div>
                  <div style={{fontSize:12,color:T.text,lineHeight:1.4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{convoy.destination||"Not set"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Date / time row */}
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <span style={{fontSize:13}}>📅</span>
              <span style={{fontSize:12,color:T.sub}}>{convoy.date}{convoy.endDate&&convoy.endDate!==convoy.date?` → ${convoy.endDate}`:""}</span>
            </div>
            {convoy.time&&<div style={{display:"flex",alignItems:"center",gap:5}}>
              <span style={{fontSize:13}}>🕐</span>
              <span style={{fontSize:12,color:T.sub}}>{convoy.time}</span>
            </div>}
          </div>
        </div>
        {convoy.notes&&<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"12px 14px",marginBottom:14,display:"flex",gap:10}}>
          <Ic d={ICONS.note} size={15}/><span style={{fontSize:12,color:T.sub,lineHeight:1.5}}>{convoy.notes}</span>
        </div>}

        {/* Invite Code */}
        {convoy.inviteCode&&(
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"12px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
            <div style={{flex:1}}>
              <div style={{fontSize:9,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase",marginBottom:4}}>Invite Code</div>
              <div style={{fontSize:22,fontWeight:800,color:T.accent,fontFamily:"'Space Mono',monospace",letterSpacing:3}}>{convoy.inviteCode}</div>
            </div>
            <button onClick={()=>{ navigator.clipboard?.writeText(convoy.inviteCode); }}
              style={{padding:"8px 14px",borderRadius:10,background:T.accentLo,border:`1px solid ${T.accent}44`,cursor:"pointer",fontSize:12,fontWeight:700,color:T.accent,flexShrink:0}}>
              Copy
            </button>
          </div>
        )}

        <div style={{fontSize:11,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase",marginBottom:10}}>Members · {convoy.members.length}</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
          {/* Member ready status buttons for self */}
          {isUpcoming&&myMember&&(
            <div style={{background:T.raised,border:`1px solid ${T.border}`,borderRadius:14,padding:"12px 14px",marginBottom:4}}>
              <div style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase",marginBottom:8}}>Your Status</div>
              <div style={{display:"flex",gap:6}}>
                {STATUS_OPTS.map(o=>{
                  const active = memberStatuses[myMember.id] === o.key;
                  return (
                    <button key={o.key} onClick={()=>setMemberStatuses(s=>({...s,[myMember.id]:o.key}))}
                      style={{flex:1,padding:"7px 4px",borderRadius:10,border:`1.5px solid ${active?o.color:T.border}`,background:active?o.color+"22":T.card,color:active?o.color:T.muted,fontSize:10,fontWeight:700,cursor:"pointer",transition:"all .15s"}}>
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {convoy.members.map(m=>{
            const st = memberStatuses[m.id];
            const stInfo = STATUS_OPTS.find(o=>o.key===st);
            return (
            <div key={m.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"11px 14px",display:"flex",alignItems:"center",gap:11}}>
              <Avatar name={m.name} color={m.color} size={38}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:13,fontWeight:700,color:T.text}}>{m.name}</span>
                  {m.role==="admin"&&<span style={{background:T.accentLo,color:T.accent,fontSize:9,fontWeight:800,padding:"1px 7px",borderRadius:10}}>ADMIN</span>}
                  {isMe(m)&&<span style={{background:T.blueLo,color:T.blue,fontSize:9,fontWeight:800,padding:"1px 7px",borderRadius:10}}>YOU</span>}
                </div>
                <div style={{fontSize:11,color:T.muted,marginTop:2}}>{m.car}</div>
              </div>
              {isUpcoming&&stInfo&&(
                <span style={{fontSize:10,fontWeight:700,color:stInfo.color,background:stInfo.color+"22",border:`1px solid ${stInfo.color}44`,borderRadius:20,padding:"3px 9px",flexShrink:0}}>{stInfo.label}</span>
              )}
            </div>
            );
          })}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {isUpcoming&&onStartConvoy&&(
            <button onClick={()=>onStartConvoy(convoy)} style={{padding:"14px",borderRadius:14,background:"#1a3a25",border:"1.5px solid #3DD68C",color:"#3DD68C",fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              🚀 Start Convoy
            </button>
          )}
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
const FormSheet = ({ convoy, onSave, onClose, allConvoys=[], authUser=null, profileMembers=[] }) => {
  const T=useT();
  const editing=!!convoy?.id;
  const makeDefaultMembers=()=>{
    if(!authUser?.name) return [];
    const n=authUser.name.trim().replace(/\b\w/g,c=>c.toUpperCase());
    const initials=n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
    return [{id:Date.now(),name:n,initials,phone:authUser.phone||"",car:"",color:"#3DD68C",role:"admin",isOwner:true}];
  };
  const blank={name:"",startingPoint:"",startCoords:null,destination:"",destCoords:null,distance:0,date:"",endDate:"",time:"",alertKm:5,notes:"",color:T.accent,status:"upcoming",members:[]};
  const [form,setForm]=useState(convoy?{...convoy,members:convoy.members.map(m=>({...m}))}:{...blank,members:makeDefaultMembers()});
  const [tab,setTab]=useState("details");
  const [mName,setMName]=useState(""); const [mCar,setMCar]=useState(""); const [mPhone,setMPhone]=useState("");
  const [phoneErr,setPhoneErr]=useState(false);
  const [showExisting,setShowExisting]=useState(false);
  const [exSearch,setExSearch]=useState("");
  const [showAddForm,setShowAddForm]=useState(false);
  const [showMapPicker,setShowMapPicker]=useState(false);
  const [showStartPicker,setShowStartPicker]=useState(false);
  const [pitStops, setPitStops] = useState(convoy?.pitStops||[]);
  const [pitStopInput, setPitStopInput] = useState("");

  // Deduplicated members from all other convoys, not already in current form
  const existingPool = (() => {
    const seen = new Set();
    const pool = [];
    allConvoys.forEach(c => {
      if(c.id===convoy?.id) return;
      c.members.forEach(m => {
        const key = m.name.toLowerCase();
        if(!seen.has(key) && !form.members.find(fm=>fm.name.toLowerCase()===key)){
          seen.add(key); pool.push({...m});
        }
      });
    });
    return pool;
  })();

  const filteredPool = exSearch.trim()
    ? existingPool.filter(m=>m.name.toLowerCase().includes(exSearch.toLowerCase())||m.car?.toLowerCase().includes(exSearch.toLowerCase()))
    : existingPool;

  const addExisting = m => {
    if(form.members.find(fm=>fm.name.toLowerCase()===m.name.toLowerCase())) return;
    const newM={...m,id:Date.now()+Math.random(),color:MC[form.members.length%MC.length],role:"member"};
    set("members",[...form.members,newM]);
  };
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const today=new Date().toISOString().split("T")[0];
  const valid=form.name.trim()&&form.destination.trim()&&form.date&&form.endDate;
  const canAdd=mName.trim()&&mPhone.trim().length>=10;
  const addMember=()=>{
    if(!mName.trim()) return;
    if(mPhone.trim().length<10){ setPhoneErr(true); return; }
    setPhoneErr(false);
    const initials=mName.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
    const newMember={id:Date.now(),name:mName.trim(),initials,phone:mPhone.trim(),car:mCar.trim()||"Vehicle TBD",color:MC[form.members.length%MC.length],role:"member"};
    set("members",[...form.members,newMember]);
    // Open WhatsApp with invite link
    const msg=encodeURIComponent(`Hi ${mName.trim()}! 👋 You've been invited to join the "${form.name||"Convoy"}" trip on Convoy App.\n\n📍 Destination: ${form.destination||"TBD"}\n📅 Start: ${form.date||"TBD"}${form.endDate?`  →  End: ${form.endDate}`:""}\n🕐 Departure: ${form.time||"TBD"}\n\nDownload the app & join: https://convoy.app/join/link\n\nSee you on the road! 🚗`);
    const phone=mPhone.trim().replace(/\D/g,"");
    window.open(`https://wa.me/${phone}?text=${msg}`,"_blank");
    setMName(""); setMCar(""); setMPhone(""); setPhoneErr(false);
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

              {/* Route row: Starting Point → Destination */}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {/* Starting Point */}
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  <label style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase",textAlign:"left"}}>Starting Point</label>
                  <button onClick={()=>setShowStartPicker(true)}
                    style={{background:T.raised,border:`1.5px solid ${form.startingPoint?T.blue:T.border}`,borderRadius:10,padding:"11px 13px",fontSize:13,color:form.startingPoint?T.text:T.muted,width:"100%",boxSizing:"border-box",fontFamily:"inherit",textAlign:"left",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:16,flexShrink:0}}>🟢</span>
                    <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{form.startingPoint||"Tap to select on map"}</span>
                    {form.startingPoint&&<Ic d={ICONS.edit} size={13} color={T.blue}/>}
                  </button>
                </div>

                {/* Arrow connector + live distance */}
                <div style={{display:"flex",alignItems:"center",gap:8,paddingLeft:13}}>
                  <div style={{width:2,height:18,background:`linear-gradient(to bottom,${T.blue},${T.accent})`,borderRadius:2,flexShrink:0}}/>
                  <span style={{fontSize:10,color:T.muted,fontWeight:600}}>to</span>
                  {form.distance>0&&(
                    <span style={{marginLeft:"auto",fontSize:11,fontWeight:800,color:T.accent,fontFamily:"'Space Mono',monospace",background:T.accentLo,borderRadius:20,padding:"2px 10px",border:`1px solid ${T.accent}33`}}>
                      {form.distance} km
                    </span>
                  )}
                </div>

                {/* Destination */}
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  <label style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase",textAlign:"left"}}>Destination</label>
                  <button onClick={()=>setShowMapPicker(true)}
                    style={{background:T.raised,border:`1.5px solid ${form.destination?T.accent:T.border}`,borderRadius:10,padding:"11px 13px",fontSize:13,color:form.destination?T.text:T.muted,width:"100%",boxSizing:"border-box",fontFamily:"inherit",textAlign:"left",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:16,flexShrink:0}}>🏁</span>
                    <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{form.destination||"Tap to select on map"}</span>
                    {form.destination&&<Ic d={ICONS.edit} size={13} color={T.accent}/>}
                  </button>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Field label="Start Date" type="date" value={form.date}
                  onChange={v=>{set("date",v); if(form.endDate&&form.endDate<v) set("endDate",v);}}
                  min={today}/>
                <Field label="End Date" type="date" value={form.endDate}
                  onChange={v=>set("endDate",v)}
                  min={form.date||today}/>
              </div>
              <Field label="Departure Time" type="time" value={form.time} onChange={v=>set("time",v)}/>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase",marginBottom:8,textAlign:"left"}}>Alert Distance</div>
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

              {/* ── Pit Stops ── */}
              <div>
                <div style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase",marginBottom:8,textAlign:"left"}}>Pit Stops</div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <input value={pitStopInput} onChange={e=>setPitStopInput(e.target.value)}
                    placeholder="Add a pit stop (place name)"
                    onKeyDown={e=>{ if(e.key==="Enter"&&pitStopInput.trim()){ const ps={id:Date.now(),name:pitStopInput.trim()}; setPitStops(ps=>[...ps,{id:Date.now(),name:pitStopInput.trim()}]); setPitStopInput(""); } }}
                    style={{flex:1,background:T.raised,border:`1.5px solid ${T.border}`,borderRadius:10,padding:"10px 12px",fontSize:13,color:T.text,outline:"none",fontFamily:"inherit"}}/>
                  <button onClick={()=>{ if(pitStopInput.trim()){ setPitStops(ps=>[...ps,{id:Date.now(),name:pitStopInput.trim()}]); setPitStopInput(""); } }}
                    style={{padding:"10px 14px",borderRadius:10,background:T.accentLo,border:`1.5px solid ${T.accent}`,color:T.accent,fontSize:13,fontWeight:700,cursor:"pointer",flexShrink:0}}>
                    + Add
                  </button>
                </div>
                {pitStops.length>0&&(
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {pitStops.map(ps=>(
                      <div key={ps.id} style={{display:"flex",alignItems:"center",gap:5,background:T.raised,border:`1px solid ${T.border}`,borderRadius:20,padding:"5px 10px"}}>
                        <span style={{fontSize:12,color:T.text}}>⛽ {ps.name}</span>
                        <button onClick={()=>setPitStops(p=>p.filter(x=>x.id!==ps.id))} style={{background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center"}}>
                          <Ic d={ICONS.close} size={11} color={T.red}/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {tab==="members"&&(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {/* Members header with + button */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:11,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase"}}>Members · {form.members.length}</div>
                <button onClick={()=>{setShowAddForm(s=>!s);setMName("");setMPhone("");setMCar("");setPhoneErr(false);}}
                  style={{width:30,height:30,borderRadius:9,background:showAddForm?T.accent:T.accentLo,border:`1.5px solid ${T.accent}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:showAddForm?(T.isDark?"#080B12":"#fff"):T.accent,flexShrink:0,transition:"all .15s"}}>
                  {showAddForm?"✕":"+"}
                </button>
              </div>
              {/* Add new member — inline form (shown when + tapped) */}
              {showAddForm&&(
                <div style={{background:T.card,border:`1.5px solid ${T.accent}44`,borderRadius:18,padding:"20px 16px",display:"flex",flexDirection:"column",gap:12}}>
                  <div style={{fontSize:15,fontWeight:800,color:T.text,textAlign:"center"}}>New Member</div>
                  <input value={mName} onChange={e=>setMName(e.target.value)} placeholder="Name"
                    style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:12,padding:"12px 14px",fontSize:13,color:T.text,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
                  <div style={{position:"relative"}}>
                    <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:12,color:T.muted,pointerEvents:"none",display:"flex",alignItems:"center",gap:4}}>
                      <span>📱</span><span style={{fontWeight:600}}>+91</span>
                    </span>
                    <input type="tel" value={mPhone} onChange={e=>{setMPhone(e.target.value);setPhoneErr(false);}} placeholder="Mobile number"
                      style={{width:"100%",background:T.surface,border:`1.5px solid ${phoneErr?T.red:T.border}`,borderRadius:12,padding:"12px 14px 12px 60px",fontSize:13,color:T.text,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
                  </div>
                  {phoneErr&&<span style={{fontSize:10,color:T.red,fontWeight:700}}>⚠ Valid mobile number is required</span>}
                  <button onClick={()=>{addMember();if(canAdd)setShowAddForm(false);}} disabled={!canAdd}
                    style={{padding:"13px",borderRadius:12,background:canAdd?"#25D366":T.raised,border:`1.5px solid ${canAdd?"#25D366":T.border}`,color:canAdd?"#fff":T.muted,fontSize:13,fontWeight:800,cursor:canAdd?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:7,transition:"all .15s"}}>
                    <span>📲</span> Add & Send Invite on WhatsApp
                  </button>
                </div>
              )}
              {form.members.length===0&&!showAddForm&&<div style={{textAlign:"center",padding:"20px 0",fontSize:12,color:T.muted}}>No members yet.</div>}
              {form.members.map(m=>(
                <div key={m.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"11px 12px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:m.phone?8:0}}>
                    <Avatar name={m.name} color={m.color} size={36}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontSize:13,fontWeight:700,color:T.text}}>{m.name}</span>
                        {m.role==="admin"&&<span style={{background:T.accentLo,color:T.accent,fontSize:9,fontWeight:800,padding:"1px 7px",borderRadius:10}}>ADMIN</span>}
                        {m.isOwner&&<span style={{background:T.blueLo,color:T.blue,fontSize:9,fontWeight:800,padding:"1px 7px",borderRadius:10}}>YOU</span>}
                      </div>
                      {m.car&&<div style={{fontSize:11,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"left"}}>{m.car}</div>}
                    </div>
                    {!m.isOwner&&<button onClick={()=>set("members",form.members.filter(x=>x.id!==m.id))} style={{width:28,height:28,borderRadius:8,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <Ic d={ICONS.close} size={12} color={T.red}/>
                    </button>}
                  </div>
                  {m.phone&&(
                    <div style={{display:"flex",alignItems:"center",gap:8,paddingTop:8,borderTop:`1px solid ${T.border}`}}>
                      <Ic d={ICONS.phone} size={12} color={T.muted}/>
                      <span style={{fontSize:11,color:T.muted,flex:1,textAlign:"left"}}>{m.phone}</span>
                      <button onClick={()=>{
                        const msg=encodeURIComponent(`Hi ${m.name}! 👋 Reminder: join the "${form.name}" convoy trip on Convoy App.\n\nDownload & join: https://convoy.app/join/link 🚗`);
                        window.open(`https://wa.me/${m.phone.replace(/\D/g,"")}?text=${msg}`,"_blank");
                      }} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:20,background:"#25D36614",border:"1px solid #25D36633",cursor:"pointer"}}>
                        <span style={{fontSize:13}}>📲</span>
                        <span style={{fontSize:10,fontWeight:800,color:"#25D366"}}>Resend</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {/* ── Profile Members (with checkboxes) ── */}
              {(()=>{const pm=profileMembers.filter(m=>m.name.toLowerCase()!==authUser?.name?.toLowerCase());return pm.length>0&&(
                <div style={{borderRadius:14,border:`1.5px solid ${T.border}`,overflow:"hidden",marginBottom:2}}>
                  <div style={{padding:"12px 14px",background:T.card,borderBottom:`1px solid ${T.border}`,textAlign:"left"}}>
                    <div style={{fontSize:12,fontWeight:800,color:T.accent}}>My Members</div>
                    <div style={{fontSize:10,color:T.muted,marginTop:1}}>{pm.length} from your profile — tap to add</div>
                  </div>
                  {pm.map(m=>{
                    const already=!!form.members.find(fm=>fm.name.toLowerCase()===m.name.toLowerCase());
                    const toggle=()=>{
                      if(already){ set("members",form.members.filter(fm=>fm.name.toLowerCase()!==m.name.toLowerCase())); }
                      else {
                        const newM={...m,id:Date.now()+Math.random(),color:MC[form.members.length%MC.length],role:"member"};
                        set("members",[...form.members,newM]);
                      }
                    };
                    return(
                      <div key={m.id} onClick={toggle} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderBottom:`1px solid ${T.border}`,cursor:"pointer",background:already?T.accentLo:"transparent",transition:"background .15s"}}>
                        <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${already?T.accent:T.border}`,background:already?T.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s"}}>
                          {already&&<Ic d={ICONS.check} size={11} color={T.isDark?"#080B12":"#fff"} sw={2.5}/>}
                        </div>
                        <div style={{width:34,height:34,borderRadius:10,background:`#4A9EFF22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#4A9EFF",flexShrink:0}}>
                          {(m.initials||(m.name[0]||"?").toUpperCase())}
                        </div>
                        <div style={{flex:1,minWidth:0,textAlign:"left"}}>
                          <div style={{fontSize:13,fontWeight:700,color:T.text}}>{m.name}</div>
                          <div style={{fontSize:10,color:T.muted,marginTop:1}}>{m.phone}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );})()}

              {/* ── Existing members picker ── */}
              {existingPool.length>0&&(
                <div style={{borderRadius:14,border:`1.5px solid ${showExisting?T.accent:T.border}`,overflow:"hidden",transition:"border-color .2s"}}>
                  <button onClick={()=>{setShowExisting(s=>!s);setExSearch("");}}
                    style={{width:"100%",padding:"12px 14px",background:showExisting?T.accentLo:T.card,border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:10,justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:28,height:28,borderRadius:8,background:T.accentLo,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <Ic d={ICONS.users} size={14} color={T.accent} sw={2}/>
                      </div>
                      <div style={{textAlign:"left"}}>
                        <div style={{fontSize:12,fontWeight:800,color:T.accent}}>Add from existing members</div>
                        <div style={{fontSize:10,color:T.muted,marginTop:1}}>{existingPool.length} people from your other convoys</div>
                      </div>
                    </div>
                    <Ic d={showExisting?ICONS.chevron:ICONS.plus} size={14} color={T.accent} sw={2}/>
                  </button>
                  {showExisting&&(
                    <div style={{borderTop:`1px solid ${T.border}`,background:T.card}}>
                      {/* Search */}
                      <div style={{padding:"10px 12px 6px",position:"relative"}}>
                        <div style={{position:"absolute",left:22,top:"50%",transform:"translateY(-50%)"}}><Ic d={ICONS.search} size={13}/></div>
                        <input value={exSearch} onChange={e=>setExSearch(e.target.value)} placeholder="Search members…"
                          style={{width:"100%",background:T.raised,border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 10px 8px 32px",fontSize:12,color:T.text,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
                      </div>
                      {/* Member rows */}
                      <div style={{maxHeight:220,overflowY:"auto",padding:"0 12px 10px"}}>
                        {filteredPool.length===0
                          ?<div style={{textAlign:"center",padding:"16px 0",fontSize:12,color:T.muted}}>No matches</div>
                          :filteredPool.map(m=>{
                            const already=!!form.members.find(fm=>fm.name.toLowerCase()===m.name.toLowerCase());
                            return(
                              <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
                                {m.avatar
                                  ?<img src={m.avatar} alt="" style={{width:36,height:36,borderRadius:"50%",objectFit:"cover",border:`2px solid ${m.color}66`,flexShrink:0}}/>
                                  :<Avatar name={m.name} color={m.color} size={36}/>}
                                <div style={{flex:1,minWidth:0}}>
                                  <div style={{fontSize:13,fontWeight:700,color:T.text}}>{m.name}</div>
                                  <div style={{fontSize:10,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.car||"Vehicle TBD"}</div>
                                </div>
                                <button onClick={()=>addExisting(m)} disabled={already}
                                  style={{flexShrink:0,padding:"5px 12px",borderRadius:20,background:already?T.raised:T.accentLo,border:`1.5px solid ${already?T.border:T.accent}`,color:already?T.muted:T.accent,fontSize:11,fontWeight:800,cursor:already?"not-allowed":"pointer"}}>
                                  {already?"Added":"+ Add"}
                                </button>
                              </div>
                            );
                          })
                        }
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </div>
        <div style={{padding:"12px 18px 20px",borderTop:`1px solid ${T.border}`}}>
          <button onClick={()=>valid&&onSave({...form,id:convoy?.id||Date.now(),pitStops})} disabled={!valid}
            style={{width:"100%",padding:"15px",borderRadius:14,background:valid?T.accent:T.muted,border:"none",color:valid?(T.isDark?"#080B12":"#fff"):T.surface,fontSize:15,fontWeight:800,cursor:valid?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Ic d={ICONS.check} size={17} color={valid?(T.isDark?"#080B12":"#fff"):T.surface} sw={2.5}/>{editing?"Save Changes":"Create Convoy"}
          </button>
        </div>
      </div>
      {/* Starting point picker overlay */}
      {showStartPicker&&(
        <LocationPickerMap
          value={form.startingPoint}
          onChange={({label,lat,lng})=>{
            const newCoords={lat,lng};
            setForm(f=>{
              const dist=(newCoords&&f.destCoords)?haversineKm(lat,lng,f.destCoords.lat,f.destCoords.lng):f.distance;
              return {...f,startingPoint:label,startCoords:newCoords,distance:dist};
            });
          }}
          onClose={()=>setShowStartPicker(false)}
          accentColor={T.blue}
          pinColor="#4A9EFF"
          title="Pick Starting Point"
        />
      )}
      {/* Destination picker overlay */}
      {showMapPicker&&(
        <LocationPickerMap
          value={form.destination}
          onChange={({label,lat,lng})=>{
            const newCoords={lat,lng};
            setForm(f=>{
              const dist=(newCoords&&f.startCoords)?haversineKm(f.startCoords.lat,f.startCoords.lng,lat,lng):f.distance;
              return {...f,destination:label,destCoords:newCoords,distance:dist};
            });
          }}
          onClose={()=>setShowMapPicker(false)}
        />
      )}
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
    <div onClick={()=>onTap(convoy)} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,cursor:"pointer",transition:"box-shadow .15s",overflow:"hidden"}}
      onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 4px 20px ${convoy.color}22`}
      onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
      {/* Top accent bar — clipped to card's rounded corners by overflow:hidden */}
      <div style={{height:4,background:convoy.color}}/>
      <div style={{padding:"14px 15px"}}>
        {/* Row 1: name + badge + actions — all vertically centered */}
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:15,fontWeight:800,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"left"}}>{convoy.name}</div>
          </div>
          <Badge status={convoy.status}/>
          <button onClick={e=>{e.stopPropagation();onEdit(convoy);}} style={{width:28,height:28,borderRadius:8,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Ic d={ICONS.edit} size={12} color={T.accent}/>
          </button>
          <button onClick={e=>{e.stopPropagation();onDelete(convoy);}} style={{width:28,height:28,borderRadius:8,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Ic d={ICONS.trash} size={12} color={T.red}/>
          </button>
        </div>
        {/* Row 2: route (startingPoint → destination) */}
        {convoy.startingPoint ? (
          <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:8,overflow:"hidden"}}>
            <span style={{fontSize:10,flexShrink:0}}>🟢</span>
            <span style={{fontSize:11,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:"0 1 auto",maxWidth:"40%"}}>{convoy.startingPoint.split(",")[0]}</span>
            <span style={{fontSize:10,color:T.muted,flexShrink:0,margin:"0 2px"}}>→</span>
            <span style={{fontSize:10,flexShrink:0}}>🏁</span>
            <span style={{fontSize:11,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{convoy.destination}</span>
          </div>
        ) : (
          <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:8}}>
            <Ic d={ICONS.map} size={11} color={T.muted}/>
            <span style={{fontSize:11,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{convoy.destination}</span>
          </div>
        )}
        {/* Row 3: date · time · distance */}
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}>
          <span style={{fontSize:11,color:T.sub}}>📅 {convoy.date}{convoy.endDate&&convoy.endDate!==convoy.date?` → ${convoy.endDate}`:""}</span>
          <span style={{fontSize:11,color:T.sub}}>🕐 {convoy.time}</span>
          <span style={{fontSize:11,color:convoy.color,fontWeight:700,fontFamily:"'Space Mono',monospace"}}>{convoy.distance}km</span>
        </div>
        {/* Row 4: avatars + member count */}
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

// ── Members Modal ─────────────────────────────────────────────────────────────
const MembersModal = ({ allMembers, onClose }) => {
  const T = useT();
  const members = allMembers;
  return (
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)",zIndex:300,display:"flex",flexDirection:"column",justifyContent:"flex-end"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.bg,borderRadius:"24px 24px 0 0",maxHeight:"80%",display:"flex",flexDirection:"column"}}>
        {/* Drag handle */}
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0 0"}}>
          <div style={{width:36,height:4,borderRadius:2,background:T.border}}/>
        </div>
        {/* Header */}
        <div style={{padding:"12px 20px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${T.border}`}}>
          <div style={{textAlign:"left"}}>
            <div style={{fontSize:17,fontWeight:800,color:T.text}}>All Members</div>
            <div style={{fontSize:12,color:T.muted,marginTop:2}}>{members.length} unique across all convoys</div>
          </div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:10,border:"none",background:T.card,color:T.muted,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        {/* List */}
        <div style={{overflowY:"auto",flex:1,padding:"8px 20px 24px"}}>
          {members.length===0?(
            <div style={{textAlign:"left",padding:"32px 0",color:T.muted}}>
              <div style={{fontSize:36,marginBottom:10}}>👥</div>
              <div style={{fontSize:14,fontWeight:700,color:T.sub,marginBottom:4}}>No members yet</div>
              <div style={{fontSize:12}}>Add members from your Profile</div>
            </div>
          ):members.map((m,i)=>(
            <div key={m.id||i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<members.length-1?`1px solid ${T.border}`:"none"}}>
              <div style={{width:44,height:44,borderRadius:14,background:`${T.accent}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:700,color:T.accent,flexShrink:0,overflow:"hidden"}}>
                {m.avatar?<img src={m.avatar} style={{width:44,height:44,objectFit:"cover"}}/>:(m.name[0]||"?").toUpperCase()}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                  <span style={{fontSize:14,fontWeight:700,color:T.text}}>{m.name}</span>
                  {m.role==="admin"&&<span style={{fontSize:9,fontWeight:800,color:T.accent,background:T.accentLo,padding:"2px 6px",borderRadius:6}}>ADMIN</span>}
                </div>
                <div style={{fontSize:11,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {m.phone||"No phone"}{m.convoys?.filter(Boolean).length?` · ${m.convoys.filter(Boolean).join(", ")}` : ""}
                </div>
              </div>
              {m.phone&&(
                <button onClick={()=>{
                  const msg=encodeURIComponent(`Hi ${m.name}! 👋 Join the convoy on Convoy App: https://convoy.app/join/link 🚗`);
                  window.open(`https://wa.me/${m.phone.replace(/\D/g,"")}?text=${msg}`,"_blank");
                }} style={{width:34,height:34,borderRadius:10,background:"#25D36614",border:"1px solid #25D36644",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>
                  📲
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Home Screen ───────────────────────────────────────────────────────────────
const HomeScreen = ({ convoys, onTap, onEdit, onDelete, onNew, isPremium, onOpenPricing }) => {
  const T=useT();
  const [search,setSearch]=useState(""), [filter,setFilter]=useState("all");
  const [showMembers,setShowMembers]=useState(false);
  const filtered=convoys.filter(c=>(filter==="all"||c.status===filter)&&(c.name.toLowerCase().includes(search.toLowerCase())||c.destination.toLowerCase().includes(search.toLowerCase())));
  const live=convoys.filter(c=>c.status==="live");
  const allMembers=Object.values(convoys.flatMap(c=>c.members).reduce((acc,m)=>{
    if(!acc[m.name]){acc[m.name]={...m,convoys:[]};}
    acc[m.name].convoys.push(convoys.find(c=>c.members.some(mm=>mm.name===m.name))?.name||"");
    return acc;
  },{}))
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>
      <div style={{padding:"16px 18px 12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div>
            <div style={{fontSize:22,fontWeight:800,color:T.text,lineHeight:1.1,textAlign:"left"}}>My Convoys</div>
            <div style={{fontSize:12,color:T.muted,marginTop:3,textAlign:"left"}}>{convoys.length} trips · {live.length} live</div>
          </div>
          <button onClick={onNew} style={{width:40,height:40,borderRadius:13,background:T.accent,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 20px ${T.accent}44`,flexShrink:0}}>
            <Ic d={ICONS.plus} size={18} color={T.isDark?"#080B12":"#fff"} sw={2.5}/>
          </button>
        </div>
        {live.length>0&&(
          <div onClick={()=>onTap(live[0])} style={{background:`linear-gradient(135deg,${live[0].color}18,${live[0].color}06)`,border:`1px solid ${live[0].color}40`,borderRadius:16,padding:"12px 14px",marginBottom:14,cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:live[0].color,animation:"pulse 1.4s infinite",display:"inline-block"}}/>
              <span style={{fontSize:12,fontWeight:800,color:live[0].color}}>LIVE NOW</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:12,background:`${live[0].color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🚗</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700,color:T.text}}>{live[0].name}</div>
                <div style={{fontSize:11,color:T.sub,marginTop:2}}>{live[0].members.length} members · {live[0].distance}km remaining</div>
              </div>
              <Ic d={ICONS.chevron} size={16} color={live[0].color}/>
            </div>
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
        {(()=>{
          const scope = filter==="all" ? convoys : convoys.filter(c=>c.status===filter);
          const scopeMembers = Object.values(scope.flatMap(c=>c.members).reduce((acc,m)=>{acc[m.name]=m;return acc},{}));
          return [
            {label:"Total",   val:scope.length,                                       color:T.accent, onClick:null},
            {label:"Live",    val:scope.filter(c=>c.status==="live").length,           color:T.red,    onClick:null},
            {label:"Upcoming",val:scope.filter(c=>c.status==="upcoming").length,       color:T.blue,   onClick:null},
            {label:"Members", val:scopeMembers.length,                                color:T.violet, onClick:()=>setShowMembers(true)},
          ].map(s=>(
            <div key={s.label} onClick={s.onClick||undefined} style={{flexShrink:0,background:T.card,border:`1px solid ${s.onClick?T.violet:T.border}`,borderRadius:14,padding:"10px 16px",minWidth:70,textAlign:"center",boxShadow:T.isDark?"none":"0 2px 8px rgba(0,0,0,.06)",cursor:s.onClick?"pointer":"default",transition:"all .15s"}}>
              <div style={{fontSize:20,fontWeight:800,color:s.color,fontFamily:"'Space Mono',monospace"}}>{s.val}</div>
              <div style={{fontSize:10,color:T.muted,fontWeight:700,marginTop:2}}>{s.label}</div>
            </div>
          ));
        })()}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"0 18px 10px"}}>
        {filtered.length===0?(
          <div style={{textAlign:"center",padding:"40px 0",color:T.muted}}>
            <div style={{fontSize:36,marginBottom:12}}>🚘</div>
            <div style={{fontSize:14,fontWeight:700,color:T.sub,marginBottom:6}}>No convoys found</div>
            <div style={{fontSize:12}}>Tap + to create your first convoy</div>
          </div>
        ):filtered.map((c, idx)=>{
          // Free users: show first convoy normally, lock the rest
          const locked = !isPremium && idx >= 1;
          return (
            <div key={c.id} style={{marginBottom:12,position:"relative"}}>
              <div style={{opacity:locked?.35:1,pointerEvents:locked?"none":"auto"}}>
                <ConvoyCard convoy={c} onTap={onTap} onEdit={onEdit} onDelete={onDelete}/>
              </div>
              {locked&&(
                <div onClick={onOpenPricing} style={{position:"absolute",inset:0,borderRadius:18,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,cursor:"pointer",background:`${T.isDark?"rgba(8,11,18,.6)":"rgba(255,255,255,.6)"}`,backdropFilter:"blur(3px)",border:"1.5px solid #4A9EFF44"}}>
                  <span style={{fontSize:24}}>🔒</span>
                  <span style={{fontSize:12,fontWeight:800,color:"#4A9EFF"}}>Upgrade to unlock</span>
                  <span style={{fontSize:10,color:T.muted}}>Premium · ₹299/month</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Members Modal */}
      {showMembers&&(
        <MembersModal allMembers={allMembers} onClose={()=>setShowMembers(false)}/>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAP SCREEN — all convoys on one live map
// ══════════════════════════════════════════════════════════════════════════════
const DEST_COORDS = {
  1: [28.6448, 77.2167], // New Delhi (live convoy destination)
  2: [15.2993, 74.1240], // Goa
  3: [32.2396, 77.1887], // Manali
  4: [26.9124, 75.7873], // Jaipur
};

const MapScreen = ({ convoys, onTapConvoy }) => {
  const T = useT();
  const wrapRef      = useRef(null);
  const mapRef       = useRef(null);
  const layerGrpRef  = useRef(null); // holds all markers/polylines, cleared on filter change
  const [selId,   setSelId]   = useState(null);
  const [filter,  setFilter]  = useState("all");

  const liveConvoy = convoys.find(c => c.status === "live");
  const filtered   = filter === "all" ? convoys : convoys.filter(c => c.status === filter);

  // ── Init map once ──
  useEffect(() => {
    loadLeaflet().then(L => {
      if (mapRef.current || !wrapRef.current) return;
      const map = L.map(wrapRef.current, {
        zoomControl: false, attributionControl: false,
        dragging: true, scrollWheelZoom: true,
      });
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
      layerGrpRef.current = L.layerGroup().addTo(map);
      map.setView([22.5, 78.9], 5);
    });
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  // ── Re-render markers whenever filter changes ──
  useEffect(() => {
    if (!window.L) { setTimeout(() => {}, 200); return; }
    const L = window.L;
    if (!mapRef.current || !layerGrpRef.current) return;

    layerGrpRef.current.clearLayers();
    const bounds = [];

    filtered.forEach(c => {
      const isLive = c.status === "live";

      if (isLive) {
        // Road-following route via OSRM
        const startCoord = LIVE_COORDS[c.members[0]?.id];
        const destCoord  = DEST_COORDS[c.id];
        if (startCoord && destCoord) {
          fetchOSRMRoute([
            [startCoord.lat, startCoord.lng],
            destCoord,
          ]).then(coords => {
            if (!layerGrpRef.current) return;
            // Add animated dashed underlay + solid overlay for a "road" look
            L.polyline(coords, { color: c.color, weight: 5, opacity: .15 }).addTo(layerGrpRef.current);
            L.polyline(coords, { color: c.color, weight: 3, opacity: .85 }).addTo(layerGrpRef.current);
          });
        }

        // Member markers
        c.members.forEach((m, i) => {
          const coord = LIVE_COORDS[m.id];
          if (!coord) return;
          bounds.push([coord.lat, coord.lng]);
          const isMe = i === 0;
          const sz = isMe ? 40 : 34;
          const inner = m.avatar
            ? `<img src="${m.avatar}" crossorigin="anonymous"
                style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;"/>`
            : `<span style="font-size:${isMe?12:10}px;font-weight:800;color:#fff;">${m.initials}</span>`;
          const html = `<div style="position:relative;width:${sz}px;height:${sz}px;
            border-radius:50%;background:${m.color};border:3px solid #fff;
            box-shadow:0 0 0 2px ${m.color},0 3px 10px rgba(0,0,0,.3);
            display:flex;align-items:center;justify-content:center;
            overflow:hidden;cursor:pointer;">
            ${inner}
            ${isMe?`<div style="position:absolute;inset:-7px;border-radius:50%;
              background:${m.color}28;animation:lf-pulse 2s ease-in-out infinite;pointer-events:none;"></div>`:""}
            <div style="position:absolute;top:calc(100% + 3px);left:50%;transform:translateX(-50%);
              background:rgba(8,11,18,.88);color:${m.color};font-size:9px;font-weight:800;
              white-space:nowrap;padding:2px 7px;border-radius:20px;">${isMe?"★ You":m.name}</div>
          </div>`;
          const icon = L.divIcon({ className:"", iconSize:[isMe?40:34,isMe?40:34], iconAnchor:[isMe?20:17,isMe?20:17], html });
          L.marker([coord.lat,coord.lng],{icon,zIndexOffset:isMe?1000:i*10}).addTo(layerGrpRef.current);
        });

        // Destination pin
        const dc = DEST_COORDS[c.id];
        if (dc) {
          bounds.push(dc);
          const dHtml = `<div style="width:32px;height:32px;background:${c.color};border-radius:50%;
            border:3px solid #fff;display:flex;align-items:center;justify-content:center;
            font-size:18px;box-shadow:0 0 0 3px ${c.color}44,0 4px 12px rgba(0,0,0,.25);">🏁</div>`;
          L.marker(dc, { icon: L.divIcon({ className:"", iconSize:[32,32], iconAnchor:[16,16], html:dHtml }) })
            .addTo(layerGrpRef.current)
            .bindPopup(`<b>${c.destination}</b><br>Destination`);
        }

      } else {
        // Non-live convoy: destination pin only
        const coord = DEST_COORDS[c.id];
        if (!coord) return;
        bounds.push(coord);
        const done = c.status === "completed";
        const pinHtml = `<div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
          <div style="width:38px;height:38px;border-radius:50%;background:${c.color}${done?"66":"bb"};
            border:3px solid ${c.color};display:flex;align-items:center;justify-content:center;
            font-size:15px;box-shadow:0 3px 12px ${c.color}44;">${done?"✓":"📍"}</div>
          <div style="margin-top:4px;background:rgba(8,11,18,.88);color:${c.color};
            font-size:9px;font-weight:800;white-space:nowrap;padding:2px 8px;
            border-radius:20px;max-width:96px;overflow:hidden;text-overflow:ellipsis;">${c.name}</div>
        </div>`;
        const icon = L.divIcon({ className:"", iconSize:[38,38], iconAnchor:[19,19], html:pinHtml });
        L.marker(coord, { icon }).addTo(layerGrpRef.current)
          .on("click", () => setSelId(id => id === c.id ? null : c.id));
      }
    });

    if (bounds.length > 0) {
      mapRef.current.fitBounds(L.latLngBounds(bounds).pad(0.28));
    } else {
      mapRef.current.setView([22.5, 78.9], 5);
    }
    setSelId(null);
  }, [filter, convoys]);

  const selConvoy = selId ? convoys.find(c => c.id === selId) : null;

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>

      {/* ── Header ── */}
      <div style={{padding:"14px 16px 10px",background:T.surface,borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div>
            <div style={{fontSize:17,fontWeight:800,color:T.text}}>Live Map</div>
            <div style={{fontSize:11,color:T.muted,marginTop:1}}>{convoys.length} convoys · {convoys.filter(c=>c.status==="live").length} live</div>
          </div>
          {liveConvoy && (
            <div style={{display:"flex",alignItems:"center",gap:6,background:T.accentLo,borderRadius:20,padding:"5px 12px",border:`1px solid ${T.accent}33`}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:T.accent,animation:"pulse 1.4s infinite",display:"inline-block"}}/>
              <span style={{fontSize:11,fontWeight:700,color:T.accent}}>LIVE</span>
            </div>
          )}
        </div>

        {/* Filter chips */}
        <div style={{display:"flex",gap:7,overflowX:"auto",scrollbarWidth:"none"}}>
          {[["all","All"],["live","Live"],["upcoming","Upcoming"],["completed","Done"]].map(([val,lbl])=>(
            <button key={val} onClick={()=>setFilter(val)}
              style={{flexShrink:0,padding:"5px 14px",borderRadius:20,border:`1.5px solid ${filter===val?T.accent:T.border}`,background:filter===val?T.accentLo:T.card,color:filter===val?T.accent:T.muted,fontSize:12,fontWeight:700,cursor:"pointer"}}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* ── Map ── */}
      <div style={{flex:1,position:"relative",overflow:"hidden"}}>
        <div ref={wrapRef} style={{width:"100%",height:"100%"}}/>

        {/* Zoom controls */}
        <div style={{position:"absolute",right:12,top:12,display:"flex",flexDirection:"column",gap:6,zIndex:10}}>
          {["+","−"].map((lbl,i)=>(
            <button key={i} onClick={()=>mapRef.current?.[i===0?"zoomIn":"zoomOut"]()}
              style={{width:36,height:36,borderRadius:10,background:T.isDark?"rgba(10,13,20,.92)":"rgba(255,255,255,.94)",border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:T.text,boxShadow:"0 2px 8px rgba(0,0,0,.2)"}}>
              {lbl}
            </button>
          ))}
        </div>

        {/* My Location button */}
        <button
          onClick={()=>{
            if (!mapRef.current || !window.L) return;
            const L = window.L;
            mapRef.current.locate({ setView: true, maxZoom: 15 });
            mapRef.current.once("locationfound", e => {
              const youHtml = `<div style="width:32px;height:32px;border-radius:50%;background:#4A9EFF;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 0 0 4px #4A9EFF44;">📍</div>`;
              const youIcon = L.divIcon({ className:"", iconSize:[32,32], iconAnchor:[16,16], html:youHtml });
              L.marker(e.latlng, { icon: youIcon }).addTo(layerGrpRef.current).bindPopup("You are here").openPopup();
            });
          }}
          style={{position:"absolute",left:12,bottom:14,width:42,height:42,borderRadius:12,background:T.isDark?"rgba(10,13,20,.92)":"rgba(255,255,255,.94)",border:`1.5px solid ${T.blue}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 2px 12px rgba(0,0,0,.25)",zIndex:10}}>
          📍
        </button>

        {/* Live convoy speed chip */}
        {liveConvoy && (
          <div style={{position:"absolute",top:12,left:12,background:T.isDark?"rgba(10,13,20,.92)":"rgba(255,255,255,.94)",borderRadius:12,padding:"8px 12px",border:`1px solid ${T.accent}44`,backdropFilter:"blur(8px)",zIndex:10}}>
            <div style={{fontSize:18,fontWeight:900,color:T.accent,fontFamily:"'Space Mono',monospace",lineHeight:1}}>62</div>
            <div style={{fontSize:8,color:T.muted,fontWeight:700,letterSpacing:.8}}>KM/H</div>
          </div>
        )}
      </div>

      {/* ── Convoy list drawer ── */}
      <div style={{background:T.surface,borderTop:`1px solid ${T.border}`,flexShrink:0,maxHeight:220,overflowY:"auto"}}>
        {/* Empty state */}
        {!selConvoy && filtered.length === 0 && (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 20px",gap:8}}>
            <div style={{fontSize:32}}>🗺</div>
            <div style={{fontSize:14,fontWeight:800,color:T.sub}}>No convoys to show</div>
            <div style={{fontSize:11,color:T.muted,textAlign:"center"}}>Try a different filter or create a new convoy.</div>
          </div>
        )}
        {/* Selected convoy detail */}
        {selConvoy ? (
          <div style={{padding:"12px 16px",animation:"slideDown .2s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:selConvoy.color,flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:800,color:T.text}}>{selConvoy.name}</div>
                <div style={{fontSize:11,color:T.muted}}>{selConvoy.destination}</div>
              </div>
              <button onClick={()=>setSelId(null)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}>
                <Ic d={ICONS.close} size={14} color={T.muted}/>
              </button>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              {[{label:"DISTANCE",val:`${selConvoy.distance}km`,c:selConvoy.color},{label:"MEMBERS",val:selConvoy.members.length,c:T.blue},{label:"DATE",val:selConvoy.date,c:T.muted}].map(s=>(
                <div key={s.label} style={{flex:1,background:T.raised,borderRadius:10,padding:"8px 6px",textAlign:"center"}}>
                  <div style={{fontSize:13,fontWeight:800,color:s.c,fontFamily:"'Space Mono',monospace",lineHeight:1}}>{s.val}</div>
                  <div style={{fontSize:8,color:T.muted,fontWeight:700,letterSpacing:.5,marginTop:3}}>{s.label}</div>
                </div>
              ))}
            </div>
            <button onClick={()=>onTapConvoy(selConvoy)}
              style={{width:"100%",padding:"11px",borderRadius:12,background:T.accentLo,border:`1.5px solid ${T.accent}`,color:T.accent,fontSize:13,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Ic d={ICONS.map} size={14} color={T.accent} sw={2}/> Open Convoy
            </button>
          </div>
        ) : (
          /* Horizontal scrollable convoy cards */
          <div style={{display:"flex",gap:10,padding:"12px 16px",overflowX:"auto",scrollbarWidth:"none"}}>
            {filtered.map(c => {
              const live = c.status === "live";
              return (
                <button key={c.id} onClick={()=>{ setSelId(c.id); if(live) onTapConvoy(c); }}
                  style={{flexShrink:0,width:130,background:T.card,border:`1.5px solid ${live?c.color:T.border}`,borderRadius:14,padding:"10px 10px 10px",cursor:"pointer",textAlign:"left",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:c.color}}/>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6,marginTop:2}}>
                    <span style={{width:7,height:7,borderRadius:"50%",background:c.color,flexShrink:0,...(live?{animation:"pulse 1.4s infinite"}:{})}}/>
                    <span style={{fontSize:9,fontWeight:800,color:c.color,letterSpacing:.4}}>{c.status.toUpperCase()}</span>
                  </div>
                  <div style={{fontSize:12,fontWeight:800,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:3}}>{c.name}</div>
                  <div style={{fontSize:10,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:6}}>{c.destination}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <AvatarStack members={c.members} max={3}/>
                    <span style={{fontSize:10,fontWeight:700,color:c.color,fontFamily:"'Space Mono',monospace"}}>{c.distance}km</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ALERTS SCREEN
// ══════════════════════════════════════════════════════════════════════════════
const ALERT_SEED = [
  { id:1,  type:"sos",      convoy:"Delhi Road Trip",  convoyColor:"#3DD68C", member:"Rohan",   avatar:"https://i.pravatar.cc/150?img=11", title:"SOS Alert",              body:"Rohan triggered an SOS on Delhi Road Trip.",          time:"2m ago",   unread:true  },
  { id:2,  type:"gap",      convoy:"Delhi Road Trip",  convoyColor:"#3DD68C", member:"Aman",    avatar:"https://i.pravatar.cc/150?img=68", title:"Member Too Far",         body:"Aman is 5.4 km behind — beyond the 5 km alert limit.", time:"8m ago",   unread:true  },
  { id:3,  type:"stopped",  convoy:"Delhi Road Trip",  convoyColor:"#3DD68C", member:"Priya",   avatar:"https://i.pravatar.cc/150?img=47", title:"Member Stopped",         body:"Priya has stopped moving for more than 3 minutes.",    time:"12m ago",  unread:true  },
  { id:4,  type:"live",     convoy:"Delhi Road Trip",  convoyColor:"#3DD68C", member:"Rohan",   avatar:"https://i.pravatar.cc/150?img=11", title:"Convoy Started",         body:"Delhi Road Trip is now live. 4 members tracking.",     time:"1h ago",   unread:false },
  { id:5,  type:"joined",   convoy:"Goa Beach Weekend",convoyColor:"#4A9EFF", member:"Vikram",  avatar:null,                               title:"New Member Joined",      body:"Vikram joined Goa Beach Weekend convoy.",              time:"2h ago",   unread:false },
  { id:6,  type:"gap",      convoy:"Delhi Road Trip",  convoyColor:"#3DD68C", member:"Rahul",   avatar:"https://i.pravatar.cc/150?img=52", title:"Member Too Far",         body:"Rahul was 3.2 km behind the convoy leader.",          time:"3h ago",   unread:false },
  { id:7,  type:"upcoming", convoy:"Goa Beach Weekend",convoyColor:"#4A9EFF", member:null,      avatar:null,                               title:"Trip Tomorrow",          body:"Goa Beach Weekend departs tomorrow at 06:30 AM.",      time:"1d ago",   unread:false },
  { id:8,  type:"upcoming", convoy:"Manali Expedition",convoyColor:"#9B6EFF", member:null,      avatar:null,                               title:"Trip in 3 Weeks",        body:"Manali Expedition on 15 Aug — time to prepare!",       time:"2d ago",   unread:false },
  { id:9,  type:"done",     convoy:"Jaipur Day Trip",  convoyColor:"#F5A623", member:null,      avatar:null,                               title:"Convoy Completed",       body:"Jaipur Day Trip completed. Total time: 5h 20m.",       time:"3w ago",   unread:false },
  { id:10, type:"joined",   convoy:"Manali Expedition",convoyColor:"#9B6EFF", member:"Anjali",  avatar:null,                               title:"New Member Joined",      body:"Anjali joined the Manali Expedition convoy.",          time:"3w ago",   unread:false },
];

const ALERT_META = {
  sos:      { icon:"🆘", iconBg:"#FF4F4F22", iconColor:"#FF4F4F", label:"SOS"      },
  gap:      { icon:"⚠️", iconBg:"#F5A62322", iconColor:"#F5A623", label:"Gap"      },
  stopped:  { icon:"⏸",  iconBg:"#F5A62322", iconColor:"#F5A623", label:"Stopped"  },
  live:     { icon:"🟢", iconBg:"#3DD68C22", iconColor:"#3DD68C", label:"Live"     },
  joined:   { icon:"👤", iconBg:"#4A9EFF22", iconColor:"#4A9EFF", label:"Joined"   },
  upcoming: { icon:"📅", iconBg:"#9B6EFF22", iconColor:"#9B6EFF", label:"Upcoming" },
  done:     { icon:"✅", iconBg:"#3DD68C22", iconColor:"#3DD68C", label:"Done"     },
};

const AlertsScreen = ({ onTapConvoy, convoys, alertUnread, onAlertUnreadChange, onGoJoin }) => {
  const T = useT();
  const [alerts, setAlerts] = useState(ALERT_SEED);
  const [filter, setFilter] = useState("all"); // all | unread | sos | gap

  const filtered = alerts.filter(a => {
    if (filter === "unread") return a.unread;
    if (filter === "sos")    return a.type === "sos";
    if (filter === "gap")    return a.type === "gap" || a.type === "stopped";
    return true;
  });

  const unreadCount = alerts.filter(a => a.unread).length;

  // Sync unread count up to parent
  useEffect(() => {
    if (onAlertUnreadChange) onAlertUnreadChange(unreadCount);
  }, [unreadCount]);

  const markRead   = id  => setAlerts(as => as.map(a => a.id === id ? {...a, unread:false} : a));
  const dismiss    = id  => setAlerts(as => as.filter(a => a.id !== id));
  const markAllRead = () => setAlerts(as => as.map(a => ({...a, unread:false})));
  const clearAll    = () => setAlerts([]);

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg}}>

      {/* ── Header ── */}
      <div style={{padding:"14px 16px 10px",background:T.surface,borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:17,fontWeight:800,color:T.text}}>Alerts</span>
              {unreadCount > 0 && (
                <span style={{background:T.red,color:"#fff",fontSize:10,fontWeight:800,borderRadius:20,padding:"2px 8px",minWidth:20,textAlign:"center"}}>{unreadCount}</span>
              )}
            </div>
            <div style={{fontSize:11,color:T.muted,marginTop:2}}>{alerts.length} notifications</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {unreadCount > 0 && (
              <button onClick={markAllRead}
                style={{padding:"6px 12px",borderRadius:10,background:T.accentLo,border:`1px solid ${T.accent}33`,cursor:"pointer",fontSize:11,fontWeight:700,color:T.accent}}>
                Mark all read
              </button>
            )}
            {alerts.length > 0 && (
              <button onClick={clearAll}
                style={{padding:"6px 12px",borderRadius:10,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",fontSize:11,fontWeight:700,color:T.muted}}>
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filter chips */}
        <div style={{display:"flex",gap:7,overflowX:"auto",scrollbarWidth:"none"}}>
          {[["all","All"],["unread","Unread"],["sos","SOS"],["gap","Warnings"]].map(([val,lbl])=>(
            <button key={val} onClick={()=>setFilter(val)}
              style={{flexShrink:0,padding:"5px 14px",borderRadius:20,border:`1.5px solid ${filter===val?T.accent:T.border}`,background:filter===val?T.accentLo:T.card,color:filter===val?T.accent:T.muted,fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
              {lbl}
              {val==="unread"&&unreadCount>0&&<span style={{background:T.red,color:"#fff",fontSize:9,fontWeight:800,borderRadius:10,padding:"1px 5px"}}>{unreadCount}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Simulate Join Invite button ── */}
      <div style={{padding:"10px 14px 0",flexShrink:0}}>
        <button onClick={onGoJoin}
          style={{width:"100%",padding:"11px 14px",borderRadius:12,background:T.blueLo,border:`1.5px solid ${T.blue}44`,cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:10,background:T.blueLo,border:`1px solid ${T.blue}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🚗</div>
          <div style={{flex:1,textAlign:"left"}}>
            <div style={{fontSize:12,fontWeight:800,color:T.blue}}>Convoy Invite — Goa Beach Weekend</div>
            <div style={{fontSize:10,color:T.muted,marginTop:1}}>Sneha invited you · Tap to view invite</div>
          </div>
          <button onClick={e=>{e.stopPropagation();onGoJoin();}} style={{padding:"5px 12px",borderRadius:20,background:T.blue,border:"none",color:"#fff",fontSize:11,fontWeight:800,cursor:"pointer",flexShrink:0}}>View Invite</button>
        </button>
      </div>

      {/* ── Alert list ── */}
      <div style={{flex:1,overflowY:"auto",padding:"12px 14px"}}>
        {filtered.length === 0 ? (
          <div style={{textAlign:"center",padding:"60px 20px",color:T.muted,display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{width:72,height:72,borderRadius:20,background:T.raised,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,marginBottom:16}}>🔔</div>
            <div style={{fontSize:16,fontWeight:800,color:T.sub,marginBottom:6}}>All caught up!</div>
            <div style={{fontSize:12,color:T.muted,lineHeight:1.5}}>
              {filter==="unread"?"No unread alerts right now.":filter==="sos"?"No SOS alerts.":filter==="gap"?"No distance warnings.":"You have no notifications."}
            </div>
          </div>
        ) : filtered.map((a, idx) => {
          const meta = ALERT_META[a.type] || ALERT_META.live;
          return (
            <div key={a.id} onClick={()=>markRead(a.id)}
              style={{background:a.unread?T.raised:T.card,border:`1px solid ${a.unread?T.borderHi:T.border}`,borderRadius:16,padding:"13px 13px",marginBottom:10,cursor:"pointer",position:"relative",transition:"background .2s",animation:`slideDown .25s ease ${idx*.04}s both`}}>

              {/* Unread dot */}
              {a.unread && <div style={{position:"absolute",top:14,right:13,width:7,height:7,borderRadius:"50%",background:T.accent}}/>}

              <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>

                {/* Icon or avatar */}
                <div style={{position:"relative",flexShrink:0}}>
                  {a.avatar ? (
                    <img src={a.avatar} alt="" style={{width:42,height:42,borderRadius:"50%",objectFit:"cover",border:`2px solid ${a.convoyColor}66`}}/>
                  ) : (
                    <div style={{width:42,height:42,borderRadius:14,background:meta.iconBg,border:`1px solid ${meta.iconColor}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>
                      {meta.icon}
                    </div>
                  )}
                  {/* type badge on avatar */}
                  {a.avatar && (
                    <div style={{position:"absolute",bottom:-2,right:-2,width:18,height:18,borderRadius:"50%",background:meta.iconBg,border:`1.5px solid ${T.card}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10}}>
                      {meta.icon}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                    <span style={{fontSize:13,fontWeight:800,color:a.unread?T.text:T.sub}}>{a.title}</span>
                    <span style={{fontSize:10,color:T.muted,marginLeft:8,flexShrink:0}}>{a.time}</span>
                  </div>
                  <div style={{fontSize:12,color:T.muted,lineHeight:1.45,marginBottom:7}}>{a.body}</div>

                  {/* Convoy tag */}
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:5,background:T.bg,borderRadius:20,padding:"3px 9px 3px 6px",border:`1px solid ${T.border}`}}>
                      <span style={{width:6,height:6,borderRadius:"50%",background:a.convoyColor,flexShrink:0,...(a.type==="live"||a.type==="sos"||a.type==="gap"||a.type==="stopped"?{animation:"pulse 1.4s infinite"}:{})}}/>
                      <span style={{fontSize:10,fontWeight:700,color:T.sub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:120}}>{a.convoy}</span>
                    </div>
                    <button onClick={e=>{e.stopPropagation();dismiss(a.id);}}
                      style={{background:"none",border:"none",cursor:"pointer",padding:"2px 4px",color:T.muted,fontSize:11,fontWeight:700}}>
                      <Ic d={ICONS.close} size={12} color={T.muted}/>
                    </button>
                  </div>
                </div>
              </div>

              {/* SOS action bar */}
              {a.type === "sos" && (
                <div style={{display:"flex",gap:8,marginTop:10,paddingTop:10,borderTop:`1px solid ${T.border}`}}>
                  <button style={{flex:1,padding:"8px 0",borderRadius:10,background:`${T.red}14`,border:`1px solid ${T.red}44`,cursor:"pointer",fontSize:11,fontWeight:800,color:T.red}}>
                    📍 View Location
                  </button>
                  <button style={{flex:1,padding:"8px 0",borderRadius:10,background:T.accentLo,border:`1px solid ${T.accent}44`,cursor:"pointer",fontSize:11,fontWeight:800,color:T.accent}}>
                    🚗 I'm On My Way
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ── Add Member Card (used inside ProfileScreen) ────────────────────────────
const AddMemberCard = () => {
  const T = useT();
  const [mName,    setMName]    = useState("");
  const [mPhone,   setMPhone]   = useState("");
  const [phoneErr, setPhoneErr] = useState(false);
  const [sent,     setSent]     = useState(false);

  const invite = () => {
    if(!mName.trim()) return;
    if(mPhone.trim().replace(/\D/g,"").length<10){ setPhoneErr(true); return; }
    setPhoneErr(false);
    const msg=encodeURIComponent(`Hi ${mName.trim()}! 👋 You've been invited to join a convoy trip on Convoy App.\n\nDownload the app & join: https://convoy.app/download 🚗`);
    window.open(`https://wa.me/${mPhone.trim().replace(/\D/g,"")}?text=${msg}`,"_blank");
    setMName(""); setMPhone("");
    setSent(true); setTimeout(()=>setSent(false),3000);
  };

  return (
    <div style={{marginTop:20,marginBottom:4}}>
      <div style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase",marginBottom:10}}>Add Member</div>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"16px",display:"flex",flexDirection:"column",gap:12}}>
        <input value={mName} onChange={e=>setMName(e.target.value)} placeholder="Name"
          style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:12,padding:"11px 14px",fontSize:13,color:T.text,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:12,color:T.muted,pointerEvents:"none"}}>📱 +91</span>
          <input value={mPhone} onChange={e=>{setMPhone(e.target.value);setPhoneErr(false);}} placeholder="Mobile number" type="tel"
            style={{width:"100%",background:T.surface,border:`1.5px solid ${phoneErr?T.red:T.border}`,borderRadius:12,padding:"11px 14px 11px 68px",fontSize:13,color:T.text,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
        </div>
        {phoneErr&&<div style={{fontSize:11,color:T.red,marginTop:-4}}>Enter a valid 10-digit mobile number</div>}
        <button onClick={invite} style={{padding:"13px",borderRadius:12,background:T.accent,border:"none",color:T.isDark?"#080B12":"#fff",fontSize:13,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          📲 Add & Send Invite on WhatsApp
        </button>
        {sent&&<div style={{textAlign:"center",fontSize:12,fontWeight:700,color:T.accent}}>✓ Invite sent via WhatsApp!</div>}
      </div>
    </div>
  );
};

// PROFILE SCREEN
// ══════════════════════════════════════════════════════════════════════════════
const PROFILE_DEFAULT = {
  name:"Rohan Sharma", username:"@rohan_convoy", phone:"+91 98765 43210",
  email:"rohan@example.com", vehicle:"Swift Dzire", plate:"DL 4C 1234",
  emergency:"+91 91234 56789", city:"New Delhi",
  bio:"Road trip enthusiast 🚗 Love exploring new routes.",
  avatar:"https://i.pravatar.cc/150?img=11",
  shareLocation:true, alerts:true, lowBattery:true,
};

const ProfileScreen = ({ onSignOut, onOpenSettings, onOpenPricing, isPremium, authUser=null, onProfileUpdate=null, profileMembers=[], onProfileMembersChange=null, isDark=false, onToggleDark=null, convoys=[] }) => {
  const T = useT();
  const [profile,     setProfile]     = useState({...PROFILE_DEFAULT});
  const [editing,     setEditing]     = useState(false);
  const [draft,       setDraft]       = useState(null);
  const [saved,       setSaved]       = useState(false);
  const [section,     setSection]     = useState("profile");
  const setProfileMembers = (updater) => onProfileMembersChange?.(typeof updater==="function"?updater(profileMembers):updater);
  const [pmOpen, setPmOpen] = useState(false);
  const [pmEditId, setPmEditId] = useState(null);
  const [pmName, setPmName] = useState(""); const [pmPhone, setPmPhone] = useState(""); const [pmPhoneErr, setPmPhoneErr] = useState(false); const [pmSent, setPmSent] = useState(false);
  const openPmEdit = (m) => { setPmEditId(m.id); setPmName(m.name); setPmPhone(m.phone); setPmPhoneErr(false); setPmOpen(true); };
  const addProfileMember = () => {
    if(!pmName.trim()) return;
    if(pmPhone.trim().replace(/\D/g,"").length<10){ setPmPhoneErr(true); return; }
    setPmPhoneErr(false);
    if(pmEditId){
      const initials=pmName.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
      setProfileMembers(ms=>ms.map(m=>m.id===pmEditId?{...m,name:pmName.trim(),initials,phone:pmPhone.trim()}:m));
      setPmEditId(null); setPmName(""); setPmPhone(""); setPmOpen(false); return;
    }
    const initials=pmName.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
    setProfileMembers(ms=>[...ms,{id:Date.now(),name:pmName.trim(),initials,phone:pmPhone.trim(),color:"#4A9EFF"}]);
    const msg=encodeURIComponent(`Hi ${pmName.trim()}! 👋 You've been invited to join a convoy trip on Convoy App.\n\nDownload the app & join: https://convoy.app/download 🚗`);
    window.open(`https://wa.me/${pmPhone.trim().replace(/\D/g,"")}?text=${msg}`,"_blank");
    setPmName(""); setPmPhone(""); setPmOpen(false); setPmSent(true); setTimeout(()=>setPmSent(false),3000);
  };
  const [activeField, setActiveField] = useState(null); // inline field edit
  const [fieldVal,    setFieldVal]    = useState("");
  const inputRef = useRef(null);

  const fileInputRef = useRef(null);

  // Sync authUser name/phone into profile whenever authUser changes
  useEffect(()=>{
    if(authUser?.name){
      setProfile(p=>({...p, name:authUser.name, ...(authUser.phone?{phone:authUser.phone}:{})}));
    }
  },[authUser?.name, authUser?.phone]);

  const startEdit  = () => { setDraft({...profile}); setEditing(true); };
  const cancelEdit = () => { setDraft(null); setEditing(false); };
  const saveEdit   = () => {
    setProfile({...draft}); setEditing(false); setDraft(null);
    setSaved(true); setTimeout(()=>setSaved(false), 2200);
    // Persist name/phone back to authUser and localStorage
    if(draft?.name){
      const updated={...(authUser||{}), name:draft.name, phone:draft.phone||authUser?.phone||""};
      localStorage.setItem("convoy_user", JSON.stringify(updated));
      onProfileUpdate?.(updated);
    }
  };
  const set = (k,v) => setDraft(d=>({...d,[k]:v}));

  const handlePhotoChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target.result;
      setProfile(p => ({...p, avatar: dataUrl}));
      if (editing) set("avatar", dataUrl);
      setSaved(true); setTimeout(() => setSaved(false), 2200);
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // reset so same file can be picked again
  };
  const P = editing ? draft : profile;

  // Inline field edit helpers
  const openField = (field) => {
    setActiveField(field);
    setFieldVal(profile[field]||"");
    setTimeout(()=>inputRef.current?.focus(), 50);
  };
  const saveField = () => {
    setProfile(p=>({...p,[activeField]:fieldVal}));
    setActiveField(null);
    setSaved(true); setTimeout(()=>setSaved(false),2200);
  };
  const cancelField = () => setActiveField(null);

  const TabBtn = ({id,label,icon}) => (
    <button onClick={()=>setSection(id)} style={{flex:1,background:"none",border:"none",padding:"9px 0",fontSize:12,fontWeight:700,color:section===id?T.accent:T.muted,borderBottom:`2px solid ${section===id?T.accent:"transparent"}`,cursor:"pointer",marginBottom:-1,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
      <Ic d={icon} size={13} color={section===id?T.accent:T.muted} sw={section===id?2:1.6}/>{label}
    </button>
  );

  const Row = ({icon,label,field,placeholder,type="text"}) => {
    const isActive = !editing && activeField===field;
    return (
      <div style={{padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
        {/* Label always above the row */}
        <div style={{fontSize:10,fontWeight:700,color:isActive||editing?T.accent:T.muted,letterSpacing:.7,textTransform:"uppercase",marginBottom:5,textAlign:"left",paddingLeft:48}}>{label}</div>

        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {/* Icon */}
          <div style={{width:36,height:36,borderRadius:10,background:isActive||editing?T.accentLo:T.raised,border:`1px solid ${isActive||editing?T.accent+"44":T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>
            <Ic d={icon} size={15} color={isActive||editing?T.accent:T.muted}/>
          </div>

          {/* Content */}
          <div style={{flex:1,minWidth:0}}>
            {editing ? (
              <input value={P[field]||""} onChange={e=>set(field,e.target.value)} placeholder={placeholder} type={type}
                style={{width:"100%",background:T.raised,border:`1.5px solid ${T.accent}44`,borderRadius:9,padding:"9px 11px",fontSize:13,color:T.text,outline:"none",fontFamily:"inherit",boxSizing:"border-box",transition:"border-color .2s"}}
                onFocus={e=>e.target.style.borderColor=T.accent}
                onBlur={e=>e.target.style.borderColor=T.accent+"44"}/>
            ) : isActive ? (
              <input ref={inputRef} value={fieldVal} onChange={e=>setFieldVal(e.target.value)} placeholder={placeholder} type={type}
                onKeyDown={e=>{if(e.key==="Enter")saveField();if(e.key==="Escape")cancelField();}}
                style={{width:"100%",background:T.raised,border:`1.5px solid ${T.accent}`,borderRadius:9,padding:"9px 11px",fontSize:13,color:T.text,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
            ) : (
              <div style={{fontSize:13,color:P[field]?T.text:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"left"}}>{P[field]||"Not set"}</div>
            )}
          </div>

          {/* Action buttons */}
          {!editing&&(
            isActive ? (
              <div style={{display:"flex",gap:6,flexShrink:0}}>
                <button onClick={saveField} style={{width:30,height:30,borderRadius:8,background:T.accentLo,border:`1px solid ${T.accent}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Ic d={ICONS.check} size={13} color={T.accent} sw={2.5}/>
                </button>
                <button onClick={cancelField} style={{width:30,height:30,borderRadius:8,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Ic d={ICONS.close} size={13} color={T.muted}/>
                </button>
              </div>
            ) : (
              <button onClick={()=>openField(field)} style={{width:30,height:30,borderRadius:8,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Ic d={ICONS.edit} size={12} color={T.muted}/>
              </button>
            )
          )}
        </div>
      </div>
    );
  };

  const Toggle = ({field,icon,label,sub}) => (
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0",borderBottom:`1px solid ${T.border}`}}>
      <div style={{width:36,height:36,borderRadius:11,background:P[field]?T.accentLo:T.raised,border:`1px solid ${P[field]?T.accent+"44":T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>
        <Ic d={icon} size={16} color={P[field]?T.accent:T.muted}/>
      </div>
      <div style={{flex:1,minWidth:0,textAlign:"left"}}>
        <div style={{fontSize:13,fontWeight:700,color:T.text,textAlign:"left"}}>{label}</div>
        <div style={{fontSize:11,color:T.muted,marginTop:1,textAlign:"left"}}>{sub}</div>
      </div>
      <button onClick={()=>editing?set(field,!P[field]):setProfile(prev=>({...prev,[field]:!prev[field]}))}
        style={{width:44,height:26,borderRadius:13,background:P[field]?T.accent:T.raised,border:`1px solid ${P[field]?T.accent:T.border}`,cursor:"pointer",display:"flex",alignItems:"center",padding:3,transition:"all .25s",flexShrink:0}}>
        <div style={{width:20,height:20,borderRadius:"50%",background:P[field]?(T.isDark?"#080B12":"#fff"):"#fff",marginLeft:P[field]?18:0,transition:"margin .25s",boxShadow:"0 1px 4px rgba(0,0,0,.25)"}}/>
      </button>
    </div>
  );

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg,position:"relative"}}>

      {/* ── Header ── */}
      <div style={{padding:"14px 18px 0",background:T.surface,borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontSize:18,fontWeight:800,color:T.text}}>My Profile</div>
          {editing && (
            <div style={{display:"flex",gap:8}}>
              <button onClick={cancelEdit} style={{padding:"7px 14px",borderRadius:10,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",fontSize:12,fontWeight:700,color:T.sub}}>Cancel</button>
              <button onClick={saveEdit} style={{padding:"7px 14px",borderRadius:10,background:T.accent,border:"none",cursor:"pointer",fontSize:12,fontWeight:800,color:T.isDark?"#080B12":"#fff",display:"flex",alignItems:"center",gap:5}}>
                <Ic d={ICONS.check} size={12} color={T.isDark?"#080B12":"#fff"} sw={2.5}/>Save
              </button>
            </div>
          )}
        </div>
        <div style={{display:"flex",borderBottom:`1px solid ${T.border}`}}>
          <TabBtn id="profile" label="Profile" icon={ICONS.person}/>
          <TabBtn id="vehicle" label="Vehicle"  icon={ICONS.car2}/>
          <TabBtn id="members" label="Members"  icon={ICONS.group||ICONS.person}/>
          <TabBtn id="privacy" label="Privacy"  icon={ICONS.shield}/>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{flex:1,overflowY:"auto",padding:"0 18px 24px"}}>

        {section==="profile" && (
          <>
            {/* Hidden file input */}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{display:"none"}}/>

            {/* Avatar */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 0 16px"}}>
              <div style={{position:"relative",marginBottom:12}}>
                <img src={P.avatar} alt="" style={{width:88,height:88,borderRadius:"50%",objectFit:"cover",border:`3px solid ${T.accent}`,boxShadow:`0 0 0 4px ${T.accentLo},0 8px 24px rgba(0,0,0,.3)`}}/>
                {/* Camera button — always visible, tappable */}
                <button onClick={()=>fileInputRef.current?.click()}
                  style={{position:"absolute",bottom:0,right:0,width:30,height:30,borderRadius:"50%",background:T.accent,border:`2.5px solid ${T.surface}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,.25)"}}>
                  <Ic d={ICONS.camera} size={14} color={T.isDark?"#080B12":"#fff"} sw={2}/>
                </button>
              </div>
              {!editing ? (
                <>
                  <div style={{fontSize:20,fontWeight:900,color:T.text,marginBottom:2}}>{P.name}</div>
                  <div style={{fontSize:12,color:T.muted,marginBottom:8}}>{P.username}</div>
                  <div style={{display:"flex",alignItems:"center",gap:5,background:T.accentLo,borderRadius:20,padding:"4px 14px",border:`1px solid ${T.accent}33`}}>
                    <span style={{width:5,height:5,borderRadius:"50%",background:T.accent,display:"inline-block"}}/>
                    <span style={{fontSize:11,fontWeight:700,color:T.accent}}>Trip Organizer</span>
                  </div>
                </>
              ) : (
                <div style={{width:"100%",display:"flex",flexDirection:"column",gap:8}}>
                  <input value={P.name} onChange={e=>set("name",e.target.value)} placeholder="Full name"
                    style={{textAlign:"center",background:T.raised,border:`1.5px solid ${T.border}`,borderRadius:10,padding:"9px",fontSize:14,fontWeight:700,color:T.text,outline:"none",width:"100%",boxSizing:"border-box",fontFamily:"inherit"}}
                    onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
                  <input value={P.username} onChange={e=>set("username",e.target.value)} placeholder="@username"
                    style={{textAlign:"center",background:T.raised,border:`1.5px solid ${T.border}`,borderRadius:10,padding:"8px",fontSize:12,color:T.muted,outline:"none",width:"100%",boxSizing:"border-box",fontFamily:"inherit"}}
                    onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
                </div>
              )}
            </div>

            {/* Premium / Upgrade banner */}
            {!editing&&(
              <div onClick={onOpenPricing} style={{display:"flex",alignItems:"center",gap:12,background:isPremium?"linear-gradient(135deg,#4A9EFF18,#9B6EFF10)":"linear-gradient(135deg,#F5A62318,#FF4F4F10)",border:`1.5px solid ${isPremium?"#4A9EFF44":"#F5A62344"}`,borderRadius:16,padding:"12px 14px",marginBottom:16,cursor:"pointer"}}>
                <div style={{width:36,height:36,borderRadius:11,background:isPremium?"linear-gradient(135deg,#4A9EFF,#9B6EFF)":"linear-gradient(135deg,#F5A623,#FF4F4F)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                  {isPremium?"👑":"🚀"}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:800,color:isPremium?"#4A9EFF":"#F5A623"}}>{isPremium?"Premium Active":"Upgrade to Premium"}</div>
                  <div style={{fontSize:11,color:T.muted,marginTop:1}}>{isPremium?"Unlimited convoys & features":"₹299/month · First convoy free"}</div>
                </div>
                {!isPremium&&<Ic d={ICONS.chevron} size={15} color="#F5A623"/>}
                {isPremium&&<span style={{fontSize:11,fontWeight:800,color:"#4A9EFF"}}>ACTIVE</span>}
              </div>
            )}

            {/* Stats */}
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              {(()=>{
                const totalKm = convoys.reduce((sum,c)=>sum+(c.distance||0),0);
                const completed = convoys.filter(c=>c.status==="completed").length;
                return [{val:convoys.length,lbl:"Convoys"},{val:completed,lbl:"Trips"},{val:totalKm,lbl:"KM"},{val:profileMembers.length,lbl:"Friends"}];
              })().map(s=>(
                <div key={s.lbl} style={{flex:1,background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"10px 4px",textAlign:"center"}}>
                  <div style={{fontSize:17,fontWeight:800,color:T.accent,fontFamily:"'Space Mono',monospace",lineHeight:1}}>{s.val}</div>
                  <div style={{fontSize:9,color:T.muted,fontWeight:700,marginTop:3,letterSpacing:.4}}>{s.lbl.toUpperCase()}</div>
                </div>
              ))}
            </div>

            {/* Bio */}
            <div style={{marginBottom:4}}>
              <div style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase",marginBottom:7}}>About</div>
              {editing ? (
                <textarea value={P.bio} onChange={e=>set("bio",e.target.value)} rows={2} placeholder="Tell your convoy friends about you…"
                  style={{width:"100%",background:T.raised,border:`1.5px solid ${T.border}`,borderRadius:10,padding:"10px 13px",fontSize:13,color:T.text,outline:"none",boxSizing:"border-box",fontFamily:"inherit",resize:"none"}}
                  onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
              ) : (
                <div style={{fontSize:13,color:T.sub,lineHeight:1.55}}>{P.bio||<span style={{color:T.muted}}>No bio added yet</span>}</div>
              )}
            </div>

            <Row icon={ICONS.phone}  label="Phone"             field="phone"     placeholder="+91 00000 00000" type="tel"/>
            <Row icon={ICONS.note}   label="Email"             field="email"     placeholder="you@email.com"   type="email"/>
            <Row icon={ICONS.locate} label="City"              field="city"      placeholder="Your city"/>
            <Row icon={ICONS.sos}    label="Emergency Contact" field="emergency" placeholder="+91 00000 00000" type="tel"/>

            {/* ── Refer the App ── */}
            {!editing&&(
              <div style={{marginTop:20,marginBottom:4}}>
                <div style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase",marginBottom:10}}>Refer & Earn</div>
                <div style={{background:`linear-gradient(135deg,${T.accent}18,${T.blue}10)`,border:`1px solid ${T.accent}30`,borderRadius:18,padding:"18px 16px"}}>
                  {/* Header */}
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                    <div style={{width:46,height:46,borderRadius:14,background:`linear-gradient(135deg,${T.accent},${T.blue})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                      🎁
                    </div>
                    <div>
                      <div style={{fontSize:14,fontWeight:800,color:T.text}}>Invite Friends to Convoy</div>
                      <div style={{fontSize:11,color:T.muted,marginTop:2}}>Share the app & travel together!</div>
                    </div>
                  </div>

                  {/* Referral code */}
                  <div style={{background:T.isDark?"rgba(0,0,0,.25)":"rgba(255,255,255,.7)",borderRadius:12,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between",border:`1px dashed ${T.accent}55`}}>
                    <div>
                      <div style={{fontSize:9,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase",marginBottom:3}}>Your Referral Code</div>
                      <div style={{fontSize:18,fontWeight:900,color:T.accent,fontFamily:"'Space Mono',monospace",letterSpacing:2}}>ROHAN287</div>
                    </div>
                    <button onClick={()=>{
                      navigator.clipboard?.writeText("ROHAN287").catch(()=>{});
                      setSaved(true); setTimeout(()=>setSaved(false),2000);
                    }} style={{padding:"7px 14px",borderRadius:10,background:T.accentLo,border:`1.5px solid ${T.accent}`,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                      <Ic d={ICONS.note} size={13} color={T.accent} sw={2}/>
                      <span style={{fontSize:12,fontWeight:800,color:T.accent}}>Copy</span>
                    </button>
                  </div>

                  {/* Share buttons */}
                  <div style={{display:"flex",gap:8}}>
                    {/* WhatsApp */}
                    <button onClick={()=>{
                      const msg=encodeURIComponent(`Hey! 👋 I use Convoy App to track road trips with friends. Join me using my referral code ROHAN287 and download the app here: https://convoy.app/download?ref=ROHAN287 🚗`);
                      window.open(`https://wa.me/?text=${msg}`,"_blank");
                    }} style={{flex:1,padding:"11px 0",borderRadius:12,background:"#25D36614",border:"1.5px solid #25D36633",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                      <span style={{fontSize:18}}>💬</span>
                      <span style={{fontSize:12,fontWeight:800,color:"#25D366"}}>WhatsApp</span>
                    </button>

                    {/* Native share / copy link */}
                    <button onClick={()=>{
                      const shareData={title:"Join Convoy App",text:"Track road trips with your convoy! Use my code ROHAN287",url:"https://convoy.app/download?ref=ROHAN287"};
                      if(navigator.share){navigator.share(shareData).catch(()=>{});}
                      else{navigator.clipboard?.writeText(shareData.url).catch(()=>{});}
                    }} style={{flex:1,padding:"11px 0",borderRadius:12,background:T.raised,border:`1.5px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                      <span style={{fontSize:18}}>🔗</span>
                      <span style={{fontSize:12,fontWeight:800,color:T.sub}}>Share Link</span>
                    </button>
                  </div>

                  {/* SMS invite */}
                  <button onClick={()=>{
                    const msg=encodeURIComponent(`Join me on Convoy App! Use code ROHAN287 to download: https://convoy.app/download?ref=ROHAN287`);
                    window.open(`sms:?body=${msg}`,"_blank");
                  }} style={{width:"100%",marginTop:8,padding:"11px 0",borderRadius:12,background:T.raised,border:`1.5px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
                    <span style={{fontSize:18}}>📱</span>
                    <span style={{fontSize:12,fontWeight:800,color:T.sub}}>Invite via SMS</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {section==="vehicle" && (
          <>
            <div style={{background:`linear-gradient(135deg,${T.accent}14,${T.accent}05)`,border:`1px solid ${T.accent}30`,borderRadius:20,padding:"20px",margin:"16px 0 18px",textAlign:"center"}}>
              <div style={{fontSize:44,marginBottom:10}}>🚗</div>
              <div style={{fontSize:18,fontWeight:800,color:T.text,marginBottom:6}}>{P.vehicle||"No vehicle set"}</div>
              <div style={{display:"inline-flex",background:T.isDark?"rgba(0,0,0,.3)":"rgba(0,0,0,.06)",borderRadius:10,padding:"6px 18px"}}>
                <span style={{fontSize:15,fontWeight:900,color:T.accent,fontFamily:"'Space Mono',monospace",letterSpacing:2}}>{P.plate||"— — —"}</span>
              </div>
            </div>
            <Row icon={ICONS.car2} label="Vehicle Model" field="vehicle" placeholder="e.g. Swift Dzire"/>
            <Row icon={ICONS.flag} label="Number Plate"  field="plate"   placeholder="e.g. DL 4C 1234"/>
            <div style={{marginTop:16}}>
              <div style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase",marginBottom:10}}>Active Convoys</div>
              {[{name:"Delhi Road Trip",st:"live",c:"#3DD68C"},{name:"Goa Beach Weekend",st:"upcoming",c:"#4A9EFF"}].map(cv=>(
                <div key={cv.name} style={{display:"flex",alignItems:"center",gap:12,padding:"12px",background:T.card,borderRadius:14,marginBottom:8,border:`1px solid ${T.border}`}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:cv.c,flexShrink:0,...(cv.st==="live"?{animation:"pulse 1.4s infinite"}:{})}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:T.text}}>{cv.name}</div>
                    <div style={{fontSize:10,color:T.muted,marginTop:1}}>{cv.st==="live"?"Currently Live":"Upcoming"}</div>
                  </div>
                  <Ic d={ICONS.chevron} size={13} color={T.muted}/>
                </div>
              ))}
            </div>
          </>
        )}

        {section==="members" && (
          <>
            {/* Header row with + button */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:16,marginBottom:12}}>
              <div style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase"}}>Members · {profileMembers.length}</div>
              <button onClick={()=>{setPmOpen(o=>!o);setPmName("");setPmPhone("");setPmPhoneErr(false);setPmEditId(null);}}
                style={{width:32,height:32,borderRadius:10,background:pmOpen?T.accent:T.accentLo,border:`1.5px solid ${T.accent}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:pmOpen?(T.isDark?"#080B12":"#fff"):T.accent,transition:"all .15s"}}>
                {pmOpen?"✕":"+"}
              </button>
            </div>

            {/* Collapsible add form */}
            {pmOpen&&(
              <div style={{marginBottom:16,background:T.card,border:`1.5px solid ${T.accent}44`,borderRadius:18,padding:"16px",display:"flex",flexDirection:"column",gap:12}}>
                <div style={{fontSize:13,fontWeight:800,color:T.text}}>{pmEditId?"Edit Member":"New Member"}</div>
                <input value={pmName} onChange={e=>setPmName(e.target.value)} placeholder="Name"
                  style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:12,padding:"11px 14px",fontSize:13,color:T.text,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:12,color:T.muted,pointerEvents:"none"}}>📱 +91</span>
                  <input value={pmPhone} onChange={e=>{setPmPhone(e.target.value);setPmPhoneErr(false);}} placeholder="Mobile number" type="tel"
                    style={{width:"100%",background:T.surface,border:`1.5px solid ${pmPhoneErr?T.red:T.border}`,borderRadius:12,padding:"11px 14px 11px 68px",fontSize:13,color:T.text,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
                </div>
                {pmPhoneErr&&<div style={{fontSize:11,color:T.red,marginTop:-4}}>Enter a valid 10-digit mobile number</div>}
                <button onClick={addProfileMember} style={{padding:"13px",borderRadius:12,background:T.accent,border:"none",color:T.isDark?"#080B12":"#fff",fontSize:13,fontWeight:800,cursor:"pointer"}}>
                  {pmEditId?"✓ Save Changes":"📲 Add & Send Invite on WhatsApp"}
                </button>
              </div>
            )}
            {pmSent&&<div style={{textAlign:"center",fontSize:12,fontWeight:700,color:T.accent,marginBottom:10}}>✓ Invite sent via WhatsApp!</div>}

            {/* Members list */}
            {profileMembers.length===0?(
              <div style={{textAlign:"center",padding:"32px 0",color:T.muted}}>
                <div style={{fontSize:32,marginBottom:8}}>👥</div>
                <div style={{fontSize:13}}>No members added yet</div>
              </div>
            ):profileMembers.map((m,i)=>(
              <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<profileMembers.length-1?`1px solid ${T.border}`:"none"}}>
                <div style={{width:42,height:42,borderRadius:13,background:`${m.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:m.color,flexShrink:0}}>
                  {m.initials}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:700,color:T.text}}>{m.name}</div>
                  <div style={{fontSize:11,color:T.muted,marginTop:1}}>{m.phone}</div>
                </div>
                <button onClick={()=>openPmEdit(m)} style={{width:34,height:34,borderRadius:10,background:T.accentLo,border:`1px solid ${T.accent}44`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Ic d={ICONS.edit} size={13} color={T.accent}/>
                </button>
                <button onClick={()=>{
                  const msg=encodeURIComponent(`Hi ${m.name}! 👋 Join the convoy: https://convoy.app/download 🚗`);
                  window.open(`https://wa.me/${m.phone.replace(/\D/g,"")}?text=${msg}`,"_blank");
                }} style={{width:34,height:34,borderRadius:10,background:"#25D36614",border:"1px solid #25D36644",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>📲</button>
                <button onClick={()=>setProfileMembers(ms=>ms.filter(x=>x.id!==m.id))} style={{width:34,height:34,borderRadius:10,background:T.redLo,border:`1px solid ${T.red}33`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Ic d={ICONS.close} size={13} color={T.red}/>
                </button>
              </div>
            ))}
          </>
        )}

        {section==="privacy" && (
          <>
            <div style={{padding:"16px 0 4px",fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase"}}>Appearance</div>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0",borderBottom:`1px solid ${T.border}`}}>
              <div style={{width:36,height:36,borderRadius:11,background:T.raised,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>
                {isDark?"🌙":"☀️"}
              </div>
              <div style={{flex:1,textAlign:"left"}}>
                <div style={{fontSize:13,fontWeight:700,color:T.text,textAlign:"left"}}>{isDark?"Dark Mode":"Light Mode"}</div>
                <div style={{fontSize:11,color:T.muted,marginTop:1,textAlign:"left"}}>Tap to switch theme</div>
              </div>
              <button onClick={onToggleDark}
                style={{width:44,height:26,borderRadius:13,background:isDark?T.accent:T.raised,border:`1px solid ${isDark?T.accent:T.border}`,cursor:"pointer",display:"flex",alignItems:"center",padding:3,transition:"all .25s",flexShrink:0}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:isDark?(T.isDark?"#080B12":"#fff"):"#fff",marginLeft:isDark?18:0,transition:"margin .25s",boxShadow:"0 1px 4px rgba(0,0,0,.25)"}}/>
              </button>
            </div>

            <div style={{padding:"16px 0 4px",fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase"}}>Tracking & Alerts</div>
            <Toggle field="shareLocation" icon={ICONS.locate} label="Share Live Location" sub="Visible to convoy members during trips"/>
            <Toggle field="alerts"        icon={ICONS.bell}   label="Distance Alerts"      sub="Notify when members are too far"/>
            <Toggle field="lowBattery"    icon={ICONS.shield} label="Low Battery Warnings" sub="Alert others when battery below 20%"/>

            <div style={{padding:"20px 0 4px",fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase"}}>Account</div>
            {[
              {icon:ICONS.bell,  label:"App Settings",  action:onOpenSettings, accent:false},
              {icon:ICONS.flag,  label:isPremium?"👑 Premium — Active":"👑 Upgrade to Premium", action:onOpenPricing, accent:true},
              {icon:ICONS.note,  label:"Terms of Service", action:null, accent:false},
              {icon:ICONS.shield,label:"Privacy Policy",   action:null, accent:false},
            ].map(item=>(
              <div key={item.label} onClick={item.action||undefined} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 0",borderBottom:`1px solid ${T.border}`,cursor:item.action?"pointer":"default"}}>
                <div style={{width:36,height:36,borderRadius:11,background:item.accent?"#4A9EFF18":item.action?T.accentLo:T.raised,border:`1px solid ${item.accent?"#4A9EFF44":item.action?T.accent+"33":T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Ic d={item.icon} size={16} color={item.accent?"#4A9EFF":item.action?T.accent:T.muted}/>
                </div>
                <span style={{flex:1,fontSize:13,fontWeight:item.accent?800:700,color:item.accent?"#4A9EFF":T.text,textAlign:"left"}}>{item.label}</span>
                <Ic d={ICONS.chevron} size={14} color={T.muted}/>
              </div>
            ))}
            <button onClick={onSignOut} style={{width:"100%",marginTop:20,padding:"14px",borderRadius:14,background:T.redLo,border:`1.5px solid ${T.red}44`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Ic d={ICONS.logout} size={16} color={T.red} sw={2}/>
              <span style={{fontSize:14,fontWeight:800,color:T.red}}>Sign Out</span>
            </button>
          </>
        )}
      </div>

      {/* ── Sticky Save/Cancel bar when global edit is active ── */}
      {editing&&(
        <div style={{padding:"12px 18px 16px",background:T.surface,borderTop:`1px solid ${T.border}`,flexShrink:0,display:"flex",gap:10,animation:"slideDown .2s ease"}}>
          <button onClick={cancelEdit}
            style={{flex:1,padding:"13px",borderRadius:13,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",fontSize:14,fontWeight:700,color:T.sub}}>
            Cancel
          </button>
          <button onClick={saveEdit}
            style={{flex:2,padding:"13px",borderRadius:13,background:T.accent,border:"none",cursor:"pointer",fontSize:14,fontWeight:800,color:T.isDark?"#080B12":"#fff",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Ic d={ICONS.check} size={15} color={T.isDark?"#080B12":"#fff"} sw={2.5}/>
            Save Changes
          </button>
        </div>
      )}

      {/* Save toast */}
      {saved&&!editing&&(
        <div style={{position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",background:T.accentLo,border:`1px solid ${T.accent}`,borderRadius:12,padding:"10px 18px",display:"flex",alignItems:"center",gap:8,boxShadow:"0 8px 24px rgba(0,0,0,.3)",animation:"slideUp .3s ease",whiteSpace:"nowrap",zIndex:50}}>
          <Ic d={ICONS.check} size={14} color={T.accent} sw={2.5}/>
          <span style={{fontSize:13,fontWeight:700,color:T.accent}}>Profile saved!</span>
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ONBOARDING / LOGIN SCREEN
// ══════════════════════════════════════════════════════════════════════════════
const ONBOARD_SLIDES = [
  {
    emoji:"🚗",
    title:"Welcome to Convoy",
    subtitle:"The smartest way to plan and track group road trips with friends & family.",
    bg:"#3DD68C",
  },
  {
    emoji:"📍",
    title:"Live GPS Tracking",
    subtitle:"See every member's real-time location on the map. Know exactly who's ahead, behind, or stopped.",
    bg:"#4A9EFF",
  },
  {
    emoji:"🆘",
    title:"SOS Emergency Alerts",
    subtitle:"One tap sends an emergency alert with your live location to all convoy members instantly.",
    bg:"#FF4F4F",
  },
  {
    emoji:"📲",
    title:"Easy Invites",
    subtitle:"Invite members via WhatsApp. They get a link, download the app, and join your convoy in seconds.",
    bg:"#25D366",
  },
];

const OnboardingScreen = ({ onDone }) => {
  const T = useT();
  const [step,     setStep]     = useState(0); // 0-3 = slides, 4 = auth
  const [authTab,  setAuthTab]  = useState("signup");
  const [name,     setName]     = useState("");
  const [phone,    setPhone]    = useState("");
  const [password, setPassword] = useState("");
  const [err,      setErr]      = useState("");

  const isLastSlide = step === ONBOARD_SLIDES.length - 1;
  const slide       = ONBOARD_SLIDES[step] || {};

  const handleSubmit = () => {
    if (authTab==="signup" && !name.trim()) { setErr("Please enter your name."); return; }
    if (!phone.trim() || phone.replace(/\D/g,"").length < 10) { setErr("Enter a valid 10-digit phone number."); return; }
    if (!password.trim() || password.length < 4) { setErr("Password must be at least 4 characters."); return; }
    setErr("");
    const storedName = JSON.parse(localStorage.getItem("convoy_user")||"null")?.name;
    const rawName = authTab==="signup" ? name.trim() : (storedName||"");
    const user = { name: rawName.replace(/\b\w/g,c=>c.toUpperCase()), phone: phone.trim() };
    localStorage.setItem("convoy_user", JSON.stringify(user));
    localStorage.setItem("convoy_authed","1");
    onDone(user);
  };

  /* ── AUTH SCREEN ── */
  if (step >= ONBOARD_SLIDES.length) return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg}}>
      {/* Back button */}
      <div style={{padding:"14px 16px 0",flexShrink:0}}>
        <button onClick={()=>setStep(ONBOARD_SLIDES.length-1)}
          style={{width:34,height:34,borderRadius:10,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Ic d={ICONS.back} size={16}/>
        </button>
      </div>

      {/* Header */}
      <div style={{padding:"20px 24px 16px",flexShrink:0,textAlign:"center"}}>
        <div style={{fontSize:36,marginBottom:8}}>🚗</div>
        <div style={{fontSize:22,fontWeight:900,color:T.text,marginBottom:4}}>
          {authTab==="signup"?"Create Account":"Welcome Back"}
        </div>
        <div style={{fontSize:13,color:T.muted}}>
          {authTab==="signup"?"Join thousands of convoy travellers":"Sign in to your Convoy account"}
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",margin:"0 20px",background:T.raised,borderRadius:14,padding:4,flexShrink:0,border:`1px solid ${T.border}`}}>
        {[["signup","Sign Up"],["signin","Sign In"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>{setAuthTab(id);setErr("");}}
            style={{flex:1,padding:"9px 0",borderRadius:11,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,background:authTab===id?T.surface:T.raised,color:authTab===id?T.text:T.muted,boxShadow:authTab===id?"0 2px 8px rgba(0,0,0,.1)":"none",transition:"all .2s"}}>
            {lbl}
          </button>
        ))}
      </div>

      {/* Form */}
      <div style={{flex:1,overflowY:"auto",padding:"20px 22px"}}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {authTab==="signup"&&<Field label="Full Name" value={name} onChange={v=>{setName(v);setErr("");}} placeholder="Your full name"/>}
          <Field label="Phone Number" value={phone} onChange={v=>{setPhone(v);setErr("");}} placeholder="+91 98765 43210" type="tel"/>
          <Field label="Password" value={password} onChange={v=>{setPassword(v);setErr("");}} placeholder="At least 4 characters" type="password"/>

          {err&&<div style={{fontSize:12,color:T.red,fontWeight:600,background:T.redLo,borderRadius:8,padding:"8px 12px",border:`1px solid ${T.red}44`}}>{err}</div>}

          <button onClick={handleSubmit}
            style={{width:"100%",padding:"15px",borderRadius:14,background:T.accent,border:"none",color:T.isDark?"#080B12":"#fff",fontSize:15,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:4,boxShadow:`0 4px 20px ${T.accent}44`}}>
            <Ic d={ICONS.check} size={17} color={T.isDark?"#080B12":"#fff"} sw={2.5}/>
            {authTab==="signup"?"Create Account 🚗":"Sign In"}
          </button>

          <div style={{textAlign:"center",fontSize:12,color:T.muted}}>
            {authTab==="signup"?"Already have an account? ":"Don't have an account? "}
            <button onClick={()=>{setAuthTab(authTab==="signup"?"signin":"signup");setErr("");}}
              style={{background:"none",border:"none",color:T.accent,fontWeight:700,cursor:"pointer",fontSize:12,padding:0}}>
              {authTab==="signup"?"Sign In":"Sign Up"}
            </button>
          </div>

          <div style={{textAlign:"center",fontSize:11,color:T.muted,marginTop:4,lineHeight:1.5}}>
            By continuing you agree to our Terms of Service & Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );

  /* ── SLIDE SCREENS ── */
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg,animation:"fsIn .3s ease"}}>

      {/* Slide visual */}
      <div style={{flex:1,background:`linear-gradient(160deg,${slide.bg}22,${slide.bg}08)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 32px",position:"relative"}}>
        {/* Skip button */}
        <button onClick={()=>setStep(ONBOARD_SLIDES.length)}
          style={{position:"absolute",top:16,right:16,background:"none",border:"none",cursor:"pointer",fontSize:12,fontWeight:700,color:T.muted,padding:"6px 12px"}}>
          Skip
        </button>

        {/* Emoji bubble */}
        <div style={{width:130,height:130,borderRadius:40,background:`${slide.bg}20`,border:`3px solid ${slide.bg}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:64,marginBottom:32,boxShadow:`0 20px 60px ${slide.bg}30`}}>
          {slide.emoji}
        </div>

        <div style={{fontSize:24,fontWeight:900,color:T.text,textAlign:"center",lineHeight:1.2,marginBottom:14}}>
          {slide.title}
        </div>
        <div style={{fontSize:14,color:T.muted,textAlign:"center",lineHeight:1.65,maxWidth:280}}>
          {slide.subtitle}
        </div>
      </div>

      {/* Dots + buttons */}
      <div style={{padding:"24px 24px 36px",background:T.surface,borderTop:`1px solid ${T.border}`,flexShrink:0}}>
        {/* Progress dots */}
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:24}}>
          {ONBOARD_SLIDES.map((_,i)=>(
            <div key={i} onClick={()=>setStep(i)} style={{width:i===step?22:8,height:8,borderRadius:4,background:i===step?slide.bg:T.border,transition:"all .3s",cursor:"pointer"}}/>
          ))}
        </div>

        {/* Next / Get Started */}
        <button onClick={()=>setStep(s=>s+1)}
          style={{width:"100%",padding:"15px",borderRadius:14,background:slide.bg,border:"none",color:["#3DD68C","#25D366"].includes(slide.bg)?(T.isDark?"#080B12":"#fff"):"#fff",fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:`0 4px 20px ${slide.bg}44`,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          {isLastSlide?"Get Started 🚀":"Next →"}
        </button>

        {step===0&&(
          <button onClick={()=>{setStep(ONBOARD_SLIDES.length);setAuthTab("signin");}}
            style={{width:"100%",marginTop:10,padding:"12px",borderRadius:14,background:"none",border:`1px solid ${T.border}`,color:T.muted,fontSize:13,fontWeight:700,cursor:"pointer"}}>
            Already have an account? Sign In
          </button>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// PRICING SCREEN
// ══════════════════════════════════════════════════════════════════════════════
const PLANS = [
  {
    id:"free",
    name:"Free",
    price:"₹0",
    period:"forever",
    color:"#3DD68C",
    emoji:"🆓",
    highlight:true,
    features:[
      {ok:true,  text:"1 convoy"},
      {ok:true,  text:"Up to 4 members per convoy"},
      {ok:true,  text:"Live GPS tracking"},
      {ok:true,  text:"SOS alerts"},
      {ok:true,  text:"WhatsApp invite"},
      {ok:false, text:"Multiple convoys"},
      {ok:false, text:"Unlimited members"},
      {ok:false, text:"Trip history & summary"},
      {ok:false, text:"Priority support"},
    ],
  },
  {
    id:"premium",
    name:"Premium",
    price:"₹299",
    period:"per month",
    yearlyPrice:"₹2,499",
    yearlyPeriod:"per year  (save 30%)",
    color:"#4A9EFF",
    emoji:"👑",
    highlight:false,
    features:[
      {ok:true, text:"Unlimited convoys"},
      {ok:true, text:"Unlimited members per convoy"},
      {ok:true, text:"Live GPS tracking"},
      {ok:true, text:"SOS alerts"},
      {ok:true, text:"WhatsApp invite"},
      {ok:true, text:"Trip history & summary"},
      {ok:true, text:"Route analytics"},
      {ok:true, text:"Priority support"},
      {ok:true, text:"Early access to new features"},
    ],
  },
];

const PricingScreen = ({ onBack, onUpgrade, isPremium }) => {
  const T = useT();
  const [billing, setBilling] = useState("monthly"); // monthly | yearly

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg}}>
      {/* Header */}
      <div style={{padding:"14px 16px 12px",display:"flex",alignItems:"center",gap:12,background:T.surface,borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        {onBack&&<button onClick={onBack} style={{width:34,height:34,borderRadius:10,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Ic d={ICONS.back} size={16}/>
        </button>}
        <div style={{flex:1}}>
          <div style={{fontSize:16,fontWeight:800,color:T.text}}>Choose Your Plan</div>
          <div style={{fontSize:11,color:T.muted}}>First convoy is always free</div>
        </div>
        {isPremium&&<span style={{fontSize:11,fontWeight:800,color:"#4A9EFF",background:"#4A9EFF18",padding:"4px 10px",borderRadius:20,border:"1px solid #4A9EFF44"}}>👑 Premium</span>}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"16px"}}>

        {/* Hero */}
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:36,marginBottom:8}}>🚗</div>
          <div style={{fontSize:20,fontWeight:900,color:T.text,marginBottom:4}}>Convoy Plans</div>
          <div style={{fontSize:13,color:T.muted,lineHeight:1.5}}>Start free. Upgrade when your convoy grows.</div>
        </div>

        {/* Billing toggle */}
        <div style={{display:"flex",background:T.raised,borderRadius:14,padding:4,marginBottom:20,border:`1px solid ${T.border}`}}>
          {[["monthly","Monthly"],["yearly","Yearly 🔥 Save 30%"]].map(([val,lbl])=>(
            <button key={val} onClick={()=>setBilling(val)}
              style={{flex:1,padding:"9px 0",borderRadius:11,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:billing===val?T.surface:T.raised,color:billing===val?T.text:T.muted,boxShadow:billing===val?"0 2px 8px rgba(0,0,0,.1)":"none",transition:"all .2s"}}>
              {lbl}
            </button>
          ))}
        </div>

        {/* Plan cards */}
        {PLANS.map(plan=>(
          <div key={plan.id} style={{background:T.card,border:`2px solid ${plan.highlight?plan.color:"transparent"}`,borderRadius:20,marginBottom:14,overflow:"hidden",boxShadow:plan.highlight?`0 8px 32px ${plan.color}22`:"none",position:"relative"}}>
            <div style={{height:4,background:plan.color}}/>
            <div style={{padding:"18px 16px"}}>
              {/* Plan name + price */}
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{fontSize:22}}>{plan.emoji}</span>
                    <span style={{fontSize:18,fontWeight:900,color:T.text}}>{plan.name}</span>
                  </div>
                  <div style={{fontSize:11,color:T.muted}}>
                    {plan.id==="free"?"No credit card needed":"Cancel anytime"}
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:26,fontWeight:900,color:plan.color,lineHeight:1}}>
                    {plan.id==="premium"&&billing==="yearly"?plan.yearlyPrice:plan.price}
                  </div>
                  <div style={{fontSize:10,color:T.muted,marginTop:2}}>
                    {plan.id==="premium"&&billing==="yearly"?plan.yearlyPeriod:plan.period}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
                {plan.features.map((f,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:20,height:20,borderRadius:"50%",background:f.ok?`${plan.color}20`:T.raised,border:`1px solid ${f.ok?plan.color:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:11}}>
                      {f.ok?"✓":"✕"}
                    </div>
                    <span style={{fontSize:13,color:f.ok?T.text:T.muted,fontWeight:f.ok?500:400}}>{f.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA button */}
              {plan.id==="free"?(
                <div style={{padding:"12px 0",borderRadius:13,background:T.raised,border:`1px solid ${T.border}`,textAlign:"center",fontSize:13,fontWeight:700,color:T.muted}}>
                  {isPremium?"Downgrade":"Current Plan ✓"}
                </div>
              ):(
                isPremium?(
                  <div style={{padding:"12px 0",borderRadius:13,background:`${"#4A9EFF"}18`,border:`1.5px solid ${"#4A9EFF"}`,textAlign:"center",fontSize:13,fontWeight:800,color:"#4A9EFF"}}>
                    👑 Active Plan
                  </div>
                ):(
                  <button onClick={()=>onUpgrade&&onUpgrade(billing)}
                    style={{width:"100%",padding:"14px 0",borderRadius:13,background:"#4A9EFF",border:"none",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",boxShadow:"0 4px 16px #4A9EFF44"}}>
                    Upgrade to Premium 👑
                  </button>
                )
              )}
            </div>
          </div>
        ))}

        {/* FAQ */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px 16px",marginBottom:8}}>
          <div style={{fontSize:12,fontWeight:800,color:T.text,marginBottom:10}}>Frequently Asked</div>
          {[
            {q:"Can I cancel anytime?",a:"Yes — cancel from your account settings. You keep Premium until the billing period ends."},
            {q:"What happens to my data if I downgrade?",a:"Your convoys stay. You just won't be able to create new ones beyond 1."},
            {q:"Is my first convoy really free forever?",a:"Yes — one convoy, free forever. No credit card needed."},
          ].map((item,i)=>(
            <div key={i} style={{marginBottom:i<2?10:0,paddingBottom:i<2?10:0,borderBottom:i<2?`1px solid ${T.border}`:"none"}}>
              <div style={{fontSize:12,fontWeight:700,color:T.text,marginBottom:3}}>❓ {item.q}</div>
              <div style={{fontSize:11,color:T.muted,lineHeight:1.5}}>{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Paywall Modal — shown when free user tries to create 2nd convoy ───────────
const PaywallModal = ({ onUpgrade, onClose }) => {
  const T = useT();
  return (
    <div style={{position:"absolute",inset:0,zIndex:80,display:"flex",flexDirection:"column",background:`rgba(4,6,10,${T.isDark?.75:.5})`,backdropFilter:"blur(8px)",alignItems:"center",justifyContent:"flex-end"}}>
      <div style={{width:"100%",background:T.surface,borderRadius:"24px 24px 0 0",padding:"24px 20px 32px",boxShadow:`0 -24px 60px rgba(74,158,255,.2)`}}>
        <div style={{width:36,height:4,background:T.border,borderRadius:4,margin:"0 auto 20px"}}/>

        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:44,marginBottom:10}}>👑</div>
          <div style={{fontSize:20,fontWeight:900,color:T.text,marginBottom:8}}>Upgrade to Premium</div>
          <div style={{fontSize:13,color:T.muted,lineHeight:1.6}}>
            You've used your <strong style={{color:T.text}}>1 free convoy</strong>.<br/>
            Upgrade to create unlimited convoys & trips.
          </div>
        </div>

        {/* Mini feature list */}
        <div style={{background:T.raised,borderRadius:14,padding:"14px",marginBottom:20,border:`1px solid ${T.border}`}}>
          {["Unlimited convoys","Unlimited members","Trip history & analytics","Priority support"].map((f,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:i<3?10:0}}>
              <span style={{fontSize:14,color:"#4A9EFF"}}>✓</span>
              <span style={{fontSize:13,color:T.text,fontWeight:500}}>{f}</span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div style={{background:"#4A9EFF14",border:"1.5px solid #4A9EFF44",borderRadius:14,padding:"10px 16px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:12,color:T.muted}}>Premium Plan</div>
            <div style={{fontSize:11,color:T.muted,marginTop:1}}>₹2,499/year saves 30%</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:22,fontWeight:900,color:"#4A9EFF"}}>₹299</div>
            <div style={{fontSize:10,color:T.muted}}>/month</div>
          </div>
        </div>

        <button onClick={onUpgrade}
          style={{width:"100%",padding:"15px",borderRadius:14,background:"#4A9EFF",border:"none",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",marginBottom:10,boxShadow:"0 4px 20px #4A9EFF44"}}>
          Upgrade Now 👑
        </button>
        <button onClick={onClose}
          style={{width:"100%",padding:"13px",borderRadius:14,background:T.raised,border:`1px solid ${T.border}`,color:T.sub,fontSize:14,fontWeight:700,cursor:"pointer"}}>
          Maybe Later
        </button>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SETTINGS SCREEN
// ══════════════════════════════════════════════════════════════════════════════
const SETTINGS_DEFAULT = {
  notifyDistanceAlert: true,
  notifySOS: true,
  notifyMemberJoin: true,
  notifyConvoyStart: true,
  locationInterval: 10,   // seconds: 5 | 10 | 30 | 60
  unit: "km",             // "km" | "mi"
  autoEndConvoy: false,
};

const SettingsScreen = ({ onBack }) => {
  const T = useT();
  const [s, setS] = useState(() => {
    try { return {...SETTINGS_DEFAULT,...JSON.parse(localStorage.getItem("convoy_settings")||"{}")}; }
    catch { return SETTINGS_DEFAULT; }
  });
  const [saved, setSaved] = useState(false);

  const upd = (k, v) => {
    const next = {...s, [k]: v};
    setS(next);
    localStorage.setItem("convoy_settings", JSON.stringify(next));
    setSaved(true); setTimeout(() => setSaved(false), 1600);
  };

  const Toggle = ({field, label, sub, icon}) => (
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 0",borderBottom:`1px solid ${T.border}`}}>
      <div style={{width:36,height:36,borderRadius:11,background:s[field]?T.accentLo:T.raised,border:`1px solid ${s[field]?T.accent+"44":T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16}}>
        {icon}
      </div>
      <div style={{flex:1,minWidth:0,textAlign:"left"}}>
        <div style={{fontSize:13,fontWeight:700,color:T.text,textAlign:"left"}}>{label}</div>
        {sub&&<div style={{fontSize:11,color:T.muted,marginTop:1,textAlign:"left"}}>{sub}</div>}
      </div>
      <button onClick={()=>upd(field,!s[field])}
        style={{width:44,height:26,borderRadius:13,background:s[field]?T.accent:T.raised,border:`1px solid ${s[field]?T.accent:T.border}`,cursor:"pointer",display:"flex",alignItems:"center",padding:3,transition:"all .25s",flexShrink:0}}>
        <div style={{width:20,height:20,borderRadius:"50%",background:s[field]?(T.isDark?"#080B12":"#fff"):"#fff",marginLeft:s[field]?18:0,transition:"margin .25s",boxShadow:"0 1px 4px rgba(0,0,0,.25)"}}/>
      </button>
    </div>
  );

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg}}>
      {/* Header */}
      <div style={{padding:"14px 16px 12px",display:"flex",alignItems:"center",gap:12,background:T.surface,borderBottom:`1px solid ${T.border}`,flexShrink:0,position:"relative"}}>
        <button onClick={onBack} style={{width:34,height:34,borderRadius:10,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Ic d={ICONS.back} size={16}/>
        </button>
        <div style={{flex:1}}>
          <div style={{fontSize:16,fontWeight:800,color:T.text}}>Settings</div>
          <div style={{fontSize:11,color:T.muted}}>App preferences & notifications</div>
        </div>
        {saved&&<span style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",fontSize:11,fontWeight:700,color:T.accent}}>✓ Saved</span>}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"0 18px 24px"}}>

        {/* Notifications */}
        <div style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase",padding:"18px 0 4px"}}>Notifications</div>
        <Toggle field="notifySOS"          label="SOS Alerts"            sub="Immediate alert when a member sends SOS"     icon="🆘"/>
        <Toggle field="notifyDistanceAlert" label="Distance Warnings"     sub="Notify when a member exceeds the gap limit"  icon="⚠️"/>
        <Toggle field="notifyMemberJoin"   label="Member Joined"         sub="Alert when someone joins your convoy"        icon="👤"/>
        <Toggle field="notifyConvoyStart"  label="Convoy Started"        sub="Notify when a trip goes live"               icon="🚗"/>

        {/* Location */}
        <div style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase",padding:"20px 0 8px"}}>Location Sharing</div>
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px"}}>
          <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:4}}>Update Interval</div>
          <div style={{fontSize:11,color:T.muted,marginBottom:12}}>How often your location is shared with convoy members</div>
          <div style={{display:"flex",gap:8}}>
            {[5,10,30,60].map(v=>(
              <button key={v} onClick={()=>upd("locationInterval",v)}
                style={{flex:1,padding:"10px 0",borderRadius:10,border:`1.5px solid ${s.locationInterval===v?T.accent:T.border}`,background:s.locationInterval===v?T.accentLo:T.raised,color:s.locationInterval===v?T.accent:T.muted,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                {v}s
              </button>
            ))}
          </div>
        </div>

        {/* Units */}
        <div style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase",padding:"20px 0 8px"}}>Distance Units</div>
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px"}}>
          <div style={{display:"flex",gap:10}}>
            {[["km","Kilometres (km)"],["mi","Miles (mi)"]].map(([val,lbl])=>(
              <button key={val} onClick={()=>upd("unit",val)}
                style={{flex:1,padding:"12px 0",borderRadius:12,border:`1.5px solid ${s.unit===val?T.accent:T.border}`,background:s.unit===val?T.accentLo:T.raised,color:s.unit===val?T.accent:T.muted,fontSize:13,fontWeight:700,cursor:"pointer"}}>
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* Other */}
        <div style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase",padding:"20px 0 4px"}}>Trip Behaviour</div>
        <Toggle field="autoEndConvoy" label="Auto-end when all arrive" sub="Convoy marks complete when everyone reaches destination" icon="🏁"/>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// TRIP SUMMARY SCREEN
// ══════════════════════════════════════════════════════════════════════════════
const TripSummaryScreen = ({ convoy, onClose, onBack }) => {
  const T = useT();
  const wrapRef = useRef(null);
  const mapRef  = useRef(null);
  const [shared, setShared] = useState(false);

  const totalMembers = convoy.members.length;
  const totalHours   = convoy.distance ? Math.round(convoy.distance / 55 * 10) / 10 : 5.3;
  const avgSpeed     = convoy.distance ? Math.round(convoy.distance / totalHours) : 53;
  const fuelEst      = convoy.distance ? Math.round(convoy.distance * 0.085) : 24; // ~8.5L/100km

  useEffect(() => {
    loadLeaflet().then(L => {
      if (mapRef.current || !wrapRef.current) return;
      const map = L.map(wrapRef.current, {
        zoomControl: false, attributionControl: false,
        dragging: false, scrollWheelZoom: false,
        center: [28.60, 77.27], zoom: 10,
      });
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);

      const startPt = DEST_COORDS[1] || [28.5672, 77.3211];
      const endPt   = DEST_COORDS[1] || [28.6448, 77.2167];

      fetchOSRMRoute([[28.5672,77.3211],[28.6448,77.2167]]).then(coords => {
        if (!mapRef.current) return;
        L.polyline(coords, { color: convoy.color, weight: 4, opacity: .85 }).addTo(map);

        // Start marker
        L.marker([28.5672,77.3211], { icon: L.divIcon({ className:"", iconSize:[24,24], iconAnchor:[12,12],
          html:`<div style="width:24px;height:24px;background:${T.blue};border-radius:50%;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:11px;box-shadow:0 2px 8px rgba(0,0,0,.3);">🟢</div>` }) }).addTo(map);

        // End marker
        L.marker([28.6448,77.2167], { icon: L.divIcon({ className:"", iconSize:[28,28], iconAnchor:[14,14],
          html:`<div style="width:28px;height:28px;background:${convoy.color};border-radius:50%;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,.3);">🏁</div>` }) }).addTo(map);

        map.fitBounds(L.latLngBounds([[28.5672,77.3211],[28.6448,77.2167]]).pad(0.25));
      });
    });
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  const handleShare = () => {
    const text = `🚗 Trip Complete!\n${convoy.name}\n📍 ${convoy.startingPoint||"Start"} → ${convoy.destination}\n📏 ${convoy.distance}km · ⏱ ${totalHours}h · 👥 ${totalMembers} members\n\nShared via Convoy App`;
    if (navigator.share) navigator.share({ title: convoy.name, text }).catch(()=>{});
    else navigator.clipboard?.writeText(text).catch(()=>{});
    setShared(true); setTimeout(()=>setShared(false), 2000);
  };

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg}}>
      {/* Header */}
      <div style={{padding:"14px 16px 12px",display:"flex",alignItems:"center",gap:12,background:T.surface,borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <button onClick={onBack||onClose} style={{width:34,height:34,borderRadius:10,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Ic d={ICONS.back} size={16}/>
        </button>
        <div style={{flex:1}}>
          <div style={{fontSize:16,fontWeight:800,color:T.text}}>Trip Summary</div>
          <div style={{fontSize:11,color:T.accent,fontWeight:700}}>✓ Completed</div>
        </div>
        <button onClick={handleShare}
          style={{padding:"7px 14px",borderRadius:10,background:shared?T.accentLo:T.raised,border:`1.5px solid ${shared?T.accent:T.border}`,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:14}}>🔗</span>
          <span style={{fontSize:12,fontWeight:700,color:shared?T.accent:T.sub}}>{shared?"Copied!":"Share"}</span>
        </button>
      </div>

      <div style={{flex:1,overflowY:"auto"}}>
        {/* Hero banner */}
        <div style={{background:`linear-gradient(135deg,${convoy.color}22,${convoy.color}08)`,padding:"24px 18px 18px",borderBottom:`1px solid ${convoy.color}30`,textAlign:"center"}}>
          <div style={{fontSize:42,marginBottom:8}}>🎉</div>
          <div style={{fontSize:18,fontWeight:900,color:T.text,marginBottom:4}}>{convoy.name}</div>
          <div style={{fontSize:12,color:T.muted}}>{convoy.date}{convoy.endDate&&convoy.endDate!==convoy.date?` → ${convoy.endDate}`:""}</div>
        </div>

        {/* Stats grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"16px 16px 0"}}>
          {[
            {icon:"📏",label:"Distance",val:`${convoy.distance} km`,c:convoy.color},
            {icon:"⏱",label:"Trip Duration",val:`${totalHours}h`,c:T.blue},
            {icon:"⚡",label:"Avg Speed",val:`${avgSpeed} km/h`,c:T.violet},
            {icon:"👥",label:"Members",val:totalMembers,c:T.accent},
            {icon:"⛽",label:"Est. Fuel",val:`~${fuelEst}L`,c:T.amber},
            {icon:"📅",label:"Days",val:convoy.endDate&&convoy.endDate!==convoy.date?`${Math.ceil((new Date(convoy.endDate)-new Date(convoy.date))/(1000*60*60*24))+1} days`:"1 day",c:T.blue},
          ].map(s=>(
            <div key={s.label} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px 12px",display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:22,flexShrink:0}}>{s.icon}</span>
              <div>
                <div style={{fontSize:16,fontWeight:900,color:s.c,fontFamily:"'Space Mono',monospace",lineHeight:1}}>{s.val}</div>
                <div style={{fontSize:10,color:T.muted,fontWeight:700,marginTop:3}}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Route map */}
        <div style={{margin:"16px 16px 0",borderRadius:16,overflow:"hidden",border:`1px solid ${T.border}`,height:180}}>
          <div ref={wrapRef} style={{width:"100%",height:"100%"}}/>
        </div>

        {/* Route label */}
        <div style={{margin:"10px 16px 0",background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:T.blue,flexShrink:0}}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{convoy.startingPoint||"Starting Point"}</div>
          </div>
          <div style={{fontSize:12,color:T.muted,flexShrink:0}}>→</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,color:T.text,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{convoy.destination}</div>
          </div>
          <div style={{width:10,height:10,borderRadius:"50%",background:convoy.color,flexShrink:0}}/>
        </div>

        {/* Members who completed */}
        <div style={{padding:"16px 16px 0"}}>
          <div style={{fontSize:11,fontWeight:700,color:T.muted,letterSpacing:.9,textTransform:"uppercase",marginBottom:10}}>Completed Together</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {convoy.members.map((m,i)=>(
              <div key={m.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
                {m.avatar
                  ? <img src={m.avatar} alt="" style={{width:38,height:38,borderRadius:"50%",objectFit:"cover",border:`2px solid ${m.color}66`,flexShrink:0}}/>
                  : <Avatar name={m.name} color={m.color} size={38}/>}
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:13,fontWeight:700,color:T.text}}>{m.name}</span>
                    {m.role==="admin"&&<span style={{background:T.accentLo,color:T.accent,fontSize:9,fontWeight:800,padding:"1px 6px",borderRadius:8}}>ADMIN</span>}
                    {i===0&&<span style={{background:T.blueLo,color:T.blue,fontSize:9,fontWeight:800,padding:"1px 6px",borderRadius:8}}>YOU</span>}
                  </div>
                  <div style={{fontSize:11,color:T.muted,marginTop:1}}>{m.car||"Vehicle TBD"}</div>
                </div>
                <span style={{fontSize:18}}>✅</span>
              </div>
            ))}
          </div>
        </div>

        {/* Done button */}
        <div style={{padding:"20px 16px 24px"}}>
          <button onClick={onClose}
            style={{width:"100%",padding:"14px",borderRadius:14,background:T.accent,border:"none",color:T.isDark?"#080B12":"#fff",fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Ic d={ICONS.check} size={16} color={T.isDark?"#080B12":"#fff"} sw={2.5}/>
            Done — Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// JOIN CONVOY SCREEN
// ══════════════════════════════════════════════════════════════════════════════
const SAMPLE_INVITE = {
  convoyName: "Goa Beach Weekend",
  date: "2025-07-04",
  endDate: "2025-07-07",
  destination: "Goa",
  color: "#4A9EFF",
  invitedBy: "Sneha",
  members: [
    { id:5,  name:"Sneha",  color:"#4A9EFF" },
    { id:6,  name:"Vikram", color:"#9B6EFF" },
  ],
};

const JoinConvoyScreen = ({ invite=SAMPLE_INVITE, onAccept, onDecline, onBack, convoys=[], authUser=null, onJoin }) => {
  const T = useT();
  const [joined, setJoined] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [foundConvoy, setFoundConvoy] = useState(null);
  const [mode, setMode] = useState("invite"); // "invite" | "code"

  const handleCodeJoin = () => {
    const code = codeInput.trim();
    if(code.length !== 6) { setCodeError("Please enter a 6-digit code"); return; }
    const match = convoys.find(c => c.inviteCode === code);
    if(!match) { setCodeError("No convoy found with this code"); return; }
    setCodeError("");
    setFoundConvoy(match);
    if(onJoin && authUser) { onJoin(match, authUser); }
    setJoined(true);
  };

  if (joined) {
    const nm = foundConvoy || invite;
    return (
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px",gap:16,background:T.bg}}>
        <div style={{fontSize:56}}>🎉</div>
        <div style={{fontSize:20,fontWeight:900,color:T.text}}>You've Joined!</div>
        <div style={{fontSize:13,color:T.muted,textAlign:"center",lineHeight:1.6}}>You are now part of <strong style={{color:T.text}}>{nm.convoyName||nm.name}</strong>. See you on the road!</div>
        <button onClick={onAccept} style={{marginTop:8,padding:"14px 32px",borderRadius:14,background:T.accent,border:"none",color:T.isDark?"#080B12":"#fff",fontSize:14,fontWeight:800,cursor:"pointer"}}>
          Go to Convoy
        </button>
      </div>
    );
  }

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg}}>
      {/* Header */}
      <div style={{padding:"14px 16px 12px",display:"flex",alignItems:"center",gap:10,background:T.surface,borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <button onClick={onBack} style={{width:34,height:34,borderRadius:10,background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Ic d={ICONS.back} size={16}/>
        </button>
        <div style={{flex:1}}>
          <div style={{fontSize:15,fontWeight:800,color:T.text}}>Convoy Invite</div>
          <div style={{fontSize:11,color:T.muted}}>Join via invite or code</div>
        </div>
        {/* Mode toggle */}
        <div style={{display:"flex",background:T.raised,borderRadius:10,padding:2,border:`1px solid ${T.border}`}}>
          {[["invite","Invite"],["code","Code"]].map(([m,l])=>(
            <button key={m} onClick={()=>setMode(m)} style={{padding:"5px 12px",borderRadius:8,background:mode===m?T.accent:"transparent",border:"none",cursor:"pointer",fontSize:11,fontWeight:700,color:mode===m?(T.isDark?"#080B12":"#fff"):T.muted,transition:"all .15s"}}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"20px 18px"}}>

        {/* ── Code join mode ── */}
        {mode==="code"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{textAlign:"center",marginBottom:8}}>
              <div style={{fontSize:36,marginBottom:8}}>🔑</div>
              <div style={{fontSize:17,fontWeight:800,color:T.text}}>Enter Invite Code</div>
              <div style={{fontSize:12,color:T.muted,marginTop:4}}>Ask the convoy admin for the 6-digit code</div>
            </div>
            <input
              value={codeInput}
              onChange={e=>{ setCodeInput(e.target.value.replace(/\D/g,"").slice(0,6)); setCodeError(""); }}
              placeholder="000000"
              maxLength={6}
              style={{textAlign:"center",fontSize:28,fontWeight:800,letterSpacing:8,background:T.raised,border:`2px solid ${codeError?T.red:codeInput.length===6?T.accent:T.border}`,borderRadius:14,padding:"16px",color:T.text,outline:"none",fontFamily:"'Space Mono',monospace",width:"100%",boxSizing:"border-box"}}
            />
            {codeError&&<div style={{fontSize:11,color:T.red,fontWeight:700,textAlign:"center"}}>⚠ {codeError}</div>}
            <button onClick={handleCodeJoin}
              style={{width:"100%",padding:"15px",borderRadius:14,background:T.accent,border:"none",color:T.isDark?"#080B12":"#fff",fontSize:15,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Ic d={ICONS.check} size={17} color={T.isDark?"#080B12":"#fff"} sw={2.5}/>
              Join Convoy
            </button>
          </div>
        )}

        {/* ── Standard invite mode ── */}
        {mode==="invite"&&(
          <>
            {/* Invite card */}
            <div style={{background:T.card,border:`2px solid ${invite.color}55`,borderRadius:22,overflow:"hidden",marginBottom:20,boxShadow:`0 8px 32px ${invite.color}22`}}>
              <div style={{height:5,background:invite.color}}/>
              <div style={{padding:"20px"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,marginBottom:16,textAlign:"center"}}>
                  <div style={{width:52,height:52,borderRadius:16,background:`${invite.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>🚗</div>
                  <div style={{fontSize:18,fontWeight:900,color:T.text}}>{invite.convoyName}</div>
                  <div style={{fontSize:12,color:T.muted}}>Invited by <strong style={{color:T.sub}}>{invite.invitedBy}</strong></div>
                </div>

                {/* Route */}
                <div style={{background:T.raised,borderRadius:12,padding:"12px 14px",marginBottom:12,border:`1px solid ${T.border}`,textAlign:"center"}}>
                  <div style={{fontSize:9,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase",marginBottom:6}}>Destination</div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    <span style={{fontSize:14}}>🏁</span>
                    <span style={{fontSize:14,fontWeight:800,color:T.text}}>{invite.destination}</span>
                  </div>
                </div>

                {/* Date */}
                <div style={{background:T.raised,borderRadius:12,padding:"12px 14px",marginBottom:12,border:`1px solid ${T.border}`,textAlign:"center"}}>
                  <div style={{fontSize:9,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase",marginBottom:6}}>Date</div>
                  <div style={{fontSize:13,fontWeight:700,color:T.text,textAlign:"center"}}>
                    📅 {invite.date}{invite.endDate && invite.endDate !== invite.date ? ` → ${invite.endDate}` : ""}
                  </div>
                </div>

                {/* Members */}
                <div style={{background:T.raised,borderRadius:12,padding:"12px 14px",border:`1px solid ${T.border}`,textAlign:"center"}}>
                  <div style={{fontSize:9,fontWeight:700,color:T.muted,letterSpacing:.7,textTransform:"uppercase",marginBottom:8}}>Members · {invite.members.length}</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
                    {invite.members.map(m=>(
                      <div key={m.id} style={{display:"flex",alignItems:"center",gap:6,background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:"4px 10px 4px 4px"}}>
                        <Avatar name={m.name} color={m.color} size={22}/>
                        <span style={{fontSize:11,fontWeight:700,color:T.text}}>{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <button onClick={()=>{
                  // Add the invited convoy to the convoys list
                  const newConvoy = {
                    id: Date.now(),
                    name: invite.convoyName,
                    destination: invite.destination,
                    date: invite.date,
                    endDate: invite.endDate||invite.date,
                    time: "",
                    status: "upcoming",
                    distance: 0,
                    alertKm: 5,
                    color: invite.color||"#4A9EFF",
                    notes: "",
                    members: [
                      ...invite.members,
                      authUser?{id:Date.now()+1,name:authUser.name,initials:(authUser.name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),color:"#3DD68C",role:"member"}:null
                    ].filter(Boolean),
                  };
                  onJoin?.(newConvoy);
                  onAccept?.();
                }}
                style={{width:"100%",padding:"15px",borderRadius:14,background:T.accent,border:"none",color:T.isDark?"#080B12":"#fff",fontSize:15,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <Ic d={ICONS.check} size={17} color={T.isDark?"#080B12":"#fff"} sw={2.5}/>
                Accept & Join
              </button>
              <button onClick={onDecline}
                style={{width:"100%",padding:"14px",borderRadius:14,background:T.redLo,border:`1.5px solid ${T.red}44`,color:T.red,fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <Ic d={ICONS.close} size={15} color={T.red} sw={2}/>
                Decline
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [isDark,  setIsDark]  = useState(false);
  const T = isDark ? DARK : LIGHT;

  // ── Auth state ──
  const [authed, setAuthed] = useState(false); // always show onboarding first
  const [authUser, setAuthUser] = useState(null); // set only after onboarding completes

  const [convoys,    setConvoys]   = useState([]);
  const [screen,     setScreen]    = useState("home");
  const [activeC,    setActiveC]   = useState(null);
  const [sheet,      setSheet]     = useState(null);
  const [delTarget,  setDelTarget] = useState(null);
  const [toast,      setToast]     = useState(null);
  const [navTab,     setNavTab]    = useState("home");
  const [isPremium,  setIsPremium] = useState(false); // default free plan
  const [showPaywall,setShowPaywall]=useState(false);
  const [profileMembers, setProfileMembers] = useState([]);

  // ── Global alert unread count (lifted) ──
  const [alertUnread, setAlertUnread] = useState(() => ALERT_SEED.filter(a=>a.unread).length);

  const flash=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),2600)};

  const handleAuthDone = (user) => { setAuthUser(user); setAuthed(true); };
  const handleProfileUpdate = (updated) => { setAuthUser(updated); };

  const handleSave=data=>{
    if(convoys.find(c=>c.id===data.id)){
      setConvoys(cs=>cs.map(c=>c.id===data.id?{...c,...data}:c));
      if(activeC?.id===data.id) setActiveC(prev=>({...prev,...data}));
      flash(`"${data.name}" updated`);
    } else {
      const newConvoy={...data,distance:data.distance||0,inviteCode:data.inviteCode||Math.floor(100000+Math.random()*900000).toString()};
      setConvoys(cs=>[newConvoy,...cs]);
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
      {/* Page background */}
      <div style={{position:"fixed",inset:0,background:isDark?"#04060A":"#CBD5E8",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans','Nunito',system-ui,sans-serif"}}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700;800&family=Space+Mono:wght@700&display=swap" rel="stylesheet"/>

        {/* Phone shell */}
        <div style={{width:"100%",maxWidth:390,height:"100%",maxHeight:844,background:T.bg,borderRadius:44,overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 32px 80px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.08)",position:"relative",transition:"background .3s"}}>

        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative",background:T.bg}}>

          {/* ── Status Bar ── */}
          <div style={{padding:"14px 20px 8px",display:"flex",justifyContent:"space-between",alignItems:"center",background:T.surface,borderBottom:`1px solid ${T.border}`}}>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:12,fontWeight:700,color:T.accent,letterSpacing:1.2}}>CONVOY</span>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {authed&&<>
                {/* Bell icon with unread badge */}
                <button onClick={()=>{setNavTab("bell");setScreen("alerts");setActiveC(null);}}
                  style={{width:28,height:28,borderRadius:"50%",background:T.raised,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",flexShrink:0}}>
                  <Ic d={ICONS.bell} size={13} color={navTab==="bell"?T.accent:T.sub} sw={1.8}/>
                  {alertUnread>0&&<span style={{position:"absolute",top:-1,right:-1,width:8,height:8,borderRadius:"50%",background:T.red,border:`1.5px solid ${T.surface}`}}/>}
                </button>
                <button onClick={()=>{setNavTab("profile");setScreen("profile");setActiveC(null);}}
                  style={{width:26,height:26,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,color:isDark?"#080B12":"#fff",border:`2px solid ${T.surface}`,cursor:"pointer"}}>
                  {authUser?.name?.slice(0,2).toUpperCase()||"ME"}
                </button>
              </>}
            </div>
          </div>

          {/* ── Screen content ── */}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg}}>
            {!authed ? (
              <OnboardingScreen onDone={handleAuthDone}/>
            ) : (
              <>
                {screen==="home"&&(
                  <HomeScreen convoys={convoys} onTap={c=>{setActiveC(c);setScreen("detail");}} onEdit={c=>setSheet(c)} onDelete={c=>setDelTarget(c)}
                    isPremium={isPremium} onOpenPricing={()=>setScreen("pricing")}
                    onNew={()=>{
                      const activeConvoys = convoys.filter(c=>c.status!=="completed").length;
                      if(!isPremium && activeConvoys>=1){ setShowPaywall(true); }
                      else { setSheet("create"); }
                    }}/>
                )}
                {screen==="detail"&&activeC&&(
                  (convoys.find(c=>c.id===activeC.id)||activeC).status==="live"
                    ?<LiveDetailScreen
                        convoy={convoys.find(c=>c.id===activeC.id)||activeC}
                        onBack={()=>{setScreen("home");setActiveC(null);}}
                        onEdit={c=>setSheet(c)}
                        onDelete={c=>setDelTarget(c)}
                        authUser={authUser}
                        onEndConvoy={c=>{
                          setConvoys(cs=>cs.map(cv=>cv.id===c.id?{...cv,status:"completed"}:cv));
                          setScreen("summary");
                        }}/>
                    :<DetailScreen convoy={convoys.find(c=>c.id===activeC.id)||activeC} onBack={()=>{setScreen("home");setActiveC(null);}} onEdit={c=>setSheet(c)} onDelete={c=>setDelTarget(c)} authUser={authUser} onStartConvoy={c=>{ setConvoys(cs=>cs.map(cv=>cv.id===c.id?{...cv,status:"live"}:cv)); setActiveC(prev=>({...prev,status:"live"})); flash("Convoy started! 🚀"); }}/>
                )}
                {screen==="map"&&<MapScreen convoys={convoys} onTapConvoy={c=>{setActiveC(c);setScreen("detail");setNavTab("home");}}/>}
                {screen==="alerts"&&<AlertsScreen convoys={convoys} alertUnread={alertUnread} onAlertUnreadChange={setAlertUnread} onTapConvoy={c=>{setActiveC(c);setScreen("detail");setNavTab("home");}} onGoJoin={()=>setScreen("join")}/>}
                {screen==="profile"&&<ProfileScreen isPremium={isPremium} authUser={authUser} onProfileUpdate={handleProfileUpdate} profileMembers={profileMembers} onProfileMembersChange={setProfileMembers} isDark={isDark} onToggleDark={()=>setIsDark(d=>!d)} convoys={convoys} onSignOut={()=>{localStorage.removeItem("convoy_authed");localStorage.removeItem("convoy_user");setAuthed(false);setAuthUser(null);}} onOpenSettings={()=>setScreen("settings")} onOpenPricing={()=>setScreen("pricing")}/>}
                {screen==="settings"&&<SettingsScreen onBack={()=>setScreen("profile")}/>}
                {screen==="pricing"&&<PricingScreen isPremium={isPremium} onBack={()=>setScreen("profile")} onUpgrade={()=>{localStorage.setItem("convoy_premium","1");setIsPremium(true);setScreen("profile");flash("🎉 Welcome to Premium!");}}/>}
                {screen==="summary"&&activeC&&<TripSummaryScreen convoy={convoys.find(c=>c.id===activeC.id)||activeC} onClose={()=>{setScreen("home");setActiveC(null);setNavTab("home");}} onBack={()=>setScreen("detail")}/>}
                {screen==="join"&&<JoinConvoyScreen convoys={convoys} authUser={authUser}
                  onJoin={(newConvoy)=>{ setConvoys(cs=>[newConvoy,...cs]); flash(`Joined "${newConvoy.name}"! 🎉`); }}
                  onAccept={()=>{setScreen("home");setNavTab("home");setActiveC(null);}}
                  onDecline={()=>{setScreen("alerts");setNavTab("bell");}}
                  onBack={()=>{setScreen("alerts");setNavTab("bell");}}/>}
              </>
            )}
          </div>

          {/* ── Bottom Nav (only when authed) ── */}
          {authed && (
          <div style={{background:T.surface,borderTop:`1px solid ${T.border}`,padding:"10px 8px 18px",display:"flex"}}>
            {[{id:"home",icon:ICONS.home,label:"Convoys",scr:"home"},{id:"map",icon:ICONS.map,label:"Map",scr:"map"},{id:"bell",icon:ICONS.bell,label:"Alerts",scr:"alerts"},{id:"profile",icon:ICONS.person,label:"Profile",scr:"profile"}].map(n=>(
              <button key={n.id} onClick={()=>{setNavTab(n.id);if(n.scr){setScreen(n.scr);setActiveC(null);}}}
                style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"6px 4px"}}>
                <div style={{width:40,height:30,borderRadius:10,background:navTab===n.id?T.accentLo:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"background .2s",position:"relative"}}>
                  <Ic d={n.icon} size={17} color={navTab===n.id?T.accent:T.muted} sw={navTab===n.id?2:1.6}/>
                  {n.id==="profile"&&<div style={{position:"absolute",top:2,right:6,width:7,height:7,borderRadius:"50%",background:T.accent,border:`2px solid ${T.surface}`}}/>}
                  {n.id==="bell"&&alertUnread>0&&<div style={{position:"absolute",top:1,right:5,width:7,height:7,borderRadius:"50%",background:T.red,border:`2px solid ${T.surface}`}}/>}
                </div>
                <span style={{fontSize:10,fontWeight:navTab===n.id?700:500,color:navTab===n.id?T.accent:T.muted}}>{n.label}</span>
              </button>
            ))}
          </div>
          )}

          {sheet!==null&&<FormSheet convoy={sheet==="create"?null:sheet} onSave={handleSave} onClose={()=>setSheet(null)} allConvoys={convoys} authUser={authUser} profileMembers={profileMembers}/>}
          {delTarget&&<DeleteSheet convoy={delTarget} onConfirm={handleDelete} onClose={()=>setDelTarget(null)}/>}
          {showPaywall&&<PaywallModal onUpgrade={()=>{setShowPaywall(false);setScreen("pricing");}} onClose={()=>setShowPaywall(false)}/>}

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
      </div>
    </ThemeCtx.Provider>
  );
}
