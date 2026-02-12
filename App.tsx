
import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { 
  Trophy, Flame, Map as MapIcon, ShoppingBag, 
  X, Sparkles, MessageSquare, ChevronRight, LocateFixed,
  Plane, GraduationCap, Moon, Briefcase, Coffee
} from 'lucide-react';

// --- TYPES ---
enum UserCategory {
  TRAVELING = 'Traveling',
  BACK_TO_SCHOOL = 'Back to School',
  UMRAH_IBADAH = 'Umrah & Ibadah',
  KANTORAN = 'Kantoran',
  HANGOUT = 'Hangout'
}

interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  userName: string;
  category: UserCategory;
}

interface UserData {
  name: string;
  email: string;
  category: UserCategory;
  totalKm: number;
  streak: number;
  currentProduct: {
    name: string;
    image: string;
  };
}

// --- CONSTANTS ---
const torchLogo = "https://torch.id/cdn/shop/files/Logo_Torch_Primary_Black_150x.png?v=1614300445";
const mascotUrl = "https://images.squarespace-cdn.com/content/v1/5b329486360810168343e06a/1592398687498-Y8U1S7T8U1S7T8U1S7T8/Mascot_Final_01.png";

const CATEGORY_META: Record<UserCategory, { icon: React.ReactNode, desc: string }> = {
  [UserCategory.TRAVELING]: { icon: <Plane size={24} />, desc: "Petualang Sejati" },
  [UserCategory.BACK_TO_SCHOOL]: { icon: <GraduationCap size={24} />, desc: "Pelajar Aktif" },
  [UserCategory.UMRAH_IBADAH]: { icon: <Moon size={24} />, desc: "Ibadah Nyaman" },
  [UserCategory.KANTORAN]: { icon: <Briefcase size={24} />, desc: "Profesional Muda" },
  [UserCategory.HANGOUT]: { icon: <Coffee size={24} />, desc: "Anak Nongkrong" },
};

const MOCK_LEADERBOARD = [
  { name: 'Adi Pratama', category: UserCategory.TRAVELING, km: 1240 },
  { name: 'Siti Aminah', category: UserCategory.KANTORAN, km: 850 },
  { name: 'Budi Santoso', category: UserCategory.HANGOUT, km: 420 },
];

// --- COMPONENT: ONBOARDING ---
const OnboardingView = ({ onComplete }: { onComplete: (u: UserData) => void }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<UserCategory | null>(null);

  const handleFinish = () => {
    if (category) {
      onComplete({
        name, email, category,
        totalKm: 0, streak: 1,
        currentProduct: {
          name: 'Kashiwa Backpack 19L',
          image: 'https://torch.id/cdn/shop/products/Kashiwa_Grey_1_800x.jpg?v=1655716186'
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
      <div className="max-w-sm w-full space-y-8 py-10">
        <img src={torchLogo} alt="Torch" className="h-10 mx-auto brightness-0" />
        
        {step < 3 && (
          <div className="w-32 h-32 bg-teal-50 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-xl">
            <img src={mascotUrl} className="h-24 animate-bounce" alt="Buddy" />
          </div>
        )}

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {step === 1 ? 'Halo Sobat!' : step === 2 ? 'Kenalan Yuk!' : 'Pilih Karakter'}
          </h1>
          <p className="text-gray-400 font-medium">Siap untuk petualangan baru hari ini?</p>
        </div>

        <div className="space-y-4">
          {step === 1 && (
            <input 
              type="email" placeholder="Email kamu..." 
              className="w-full p-5 rounded-3xl border-2 border-gray-100 focus:border-[#006F8E] outline-none font-bold text-lg text-center"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          )}
          {step === 2 && (
            <input 
              type="text" placeholder="Nama lengkap..." 
              className="w-full p-5 rounded-3xl border-2 border-gray-100 focus:border-[#006F8E] outline-none font-bold text-lg text-center"
              value={name} onChange={e => setName(e.target.value)}
            />
          )}
          {step === 3 && (
            <div className="grid grid-cols-1 gap-3">
              {(Object.keys(CATEGORY_META) as UserCategory[]).map(cat => (
                <button 
                  key={cat} onClick={() => setCategory(cat)}
                  className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all text-left ${category === cat ? 'border-[#006F8E] bg-teal-50 shadow-md' : 'border-gray-50 bg-white'}`}
                >
                  <div className={`p-3 rounded-xl ${category === cat ? 'bg-[#006F8E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {CATEGORY_META[cat].icon}
                  </div>
                  <div>
                    <p className={`font-black leading-none ${category === cat ? 'text-[#006F8E]' : 'text-gray-700'}`}>{cat}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{CATEGORY_META[cat].desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={() => step < 3 ? setStep(step + 1) : handleFinish()}
          disabled={(step === 1 && !email.includes('@')) || (step === 2 && !name) || (step === 3 && !category)}
          className="w-full py-5 bg-[#006F8E] text-white font-black rounded-3xl shadow-xl disabled:opacity-30 uppercase tracking-widest active:scale-95 transition-all"
        >
          {step === 3 ? 'Ayo Mulai!' : 'Lanjut'}
        </button>
      </div>
    </div>
  );
};

// --- COMPONENT: APP ---
const App: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const layerInstance = useRef<L.LayerGroup | null>(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('torch_vfinal');
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.user) setUser(d.user);
        if (d.markers) setMarkers(d.markers);
      } catch (e) { console.error("Restore failed", e); }
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('torch_vfinal', JSON.stringify({ user, markers }));
    }
  }, [user, markers]);

  // Map Initialization
  useEffect(() => {
    if (!user || !mapContainer.current || mapInstance.current) return;

    mapInstance.current = L.map(mapContainer.current, {
      zoomControl: false, attributionControl: false
    }).setView([-2.5489, 118.0149], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(mapInstance.current);
    layerInstance.current = L.layerGroup().addTo(mapInstance.current);

    mapInstance.current.on('click', (e: any) => dropTorch(e.latlng.lat, e.latlng.lng));

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [user]);

  // Marker Sync
  useEffect(() => {
    if (!layerInstance.current) return;
    layerInstance.current.clearLayers();

    markers.forEach(m => {
      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div class="flex flex-col items-center">
            <div class="bg-black text-white px-2 py-0.5 rounded text-[8px] font-bold mb-1 shadow-lg">${m.userName}</div>
            <div class="w-8 h-8 bg-[#006F8E] rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white">📍</div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });
      L.marker([m.lat, m.lng], { icon }).addTo(layerInstance.current!);
    });
  }, [markers]);

  const dropTorch = (lat: number, lng: number) => {
    if (!user) return;
    const m: MarkerData = {
      id: Math.random().toString(36).substr(2, 9),
      lat, lng, userName: user.name, category: user.category
    };
    setMarkers(prev => [...prev, m]);
    setUser(prev => prev ? ({ ...prev, totalKm: prev.totalKm + 15, streak: prev.streak + 1 }) : null);
  };

  if (!user) return <OnboardingView onComplete={setUser} />;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
      {/* Map Header */}
      <div className="relative h-[55vh] w-full bg-gray-100 shadow-inner overflow-hidden">
        <div ref={mapContainer} className="h-full w-full z-0" />
        
        {/* Navigation Overlays */}
        <div className="absolute top-6 left-6 right-6 z-[1000] flex justify-between pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-3 pointer-events-auto border border-gray-100">
            <img src={torchLogo} alt="Logo" className="h-4 brightness-0" />
            <div className="w-[1px] h-3 bg-gray-200" />
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Adventure Map</span>
          </div>
          <button 
            onClick={() => mapInstance.current?.locate({setView: true, maxZoom: 12})}
            className="bg-white p-4 rounded-2xl shadow-xl text-[#006F8E] active:scale-90 transition-transform pointer-events-auto"
          >
            <LocateFixed size={20} />
          </button>
        </div>

        {/* Drop Button */}
        <div className="absolute bottom-8 left-0 right-0 z-[1000] flex justify-center pointer-events-none">
          <button 
            onClick={() => {
              const center = mapInstance.current?.getCenter();
              if (center) dropTorch(center.lat, center.lng);
            }}
            className="pulse-btn pointer-events-auto bg-[#006F8E] text-white px-10 py-5 rounded-full font-black text-lg shadow-2xl flex items-center gap-3 active:scale-95 transition-all"
          >
            📍 DROP TORCH
          </button>
        </div>
      </div>

      {/* Main Stats Area */}
      <div className="flex-1 p-6 space-y-8 -mt-6 bg-white rounded-t-[40px] relative z-[1001] shadow-2xl border-t border-gray-50">
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-teal-50 p-6 rounded-[32px] flex items-center gap-4">
            <div className="bg-[#006F8E] text-white p-4 rounded-2xl shadow-lg shadow-teal-700/20"><Flame size={24} /></div>
            <div>
              <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Streak</p>
              <p className="text-2xl font-black">{user.streak}</p>
            </div>
          </div>
          <div className="bg-orange-50 p-6 rounded-[32px] flex items-center gap-4">
            <div className="bg-orange-500 text-white p-4 rounded-2xl shadow-lg shadow-orange-700/20"><Trophy size={24} /></div>
            <div>
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Distance</p>
              <p className="text-2xl font-black">{user.totalKm} <span className="text-sm">KM</span></p>
            </div>
          </div>
        </div>

        {/* Mascot Greeting */}
        <div className="bg-gray-50 p-6 rounded-[32px] flex items-center gap-6 border border-gray-100">
          <img src={mascotUrl} className="h-16" alt="Buddy" />
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-[#006F8E] tracking-widest flex items-center gap-2">
              <MessageSquare size={12} /> Buddy Torch
            </p>
            <p className="font-bold text-gray-700 leading-tight">"Sobat {user.name.split(' ')[0]}, ayo gas terus petualanganmu hari ini!"</p>
          </div>
        </div>

        {/* Reward Progress Card */}
        <div className="bg-gradient-to-br from-[#006F8E] to-teal-800 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-teal-900/20">
          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h4 className="text-2xl font-black leading-none uppercase italic">Misi Mingguan</h4>
                <p className="text-xs opacity-70 mt-1 font-bold">Klaim Voucher Diskon 20%</p>
              </div>
              <Sparkles className="text-teal-300" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-80">
                <span>Progress</span>
                <span>{user.totalKm} / 500 KM</span>
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min((user.totalKm / 500) * 100, 100)}%` }} 
                />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 scale-150">
            <Trophy size={180} />
          </div>
        </div>

        {/* Global Rankings */}
        <div className="space-y-4">
          <h3 className="text-xl font-black tracking-tight uppercase px-2">Global Explorers</h3>
          <div className="space-y-3">
            {MOCK_LEADERBOARD.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl group hover:border-[#006F8E] transition-all">
                <div className="flex items-center gap-4">
                  <span className="w-8 font-black text-gray-300 group-hover:text-[#006F8E]">{idx + 1}</span>
                  <div>
                    <p className="font-black text-gray-900">{entry.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{entry.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg">{entry.km} <span className="text-[10px] text-gray-400">KM</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="h-20" /> {/* Spacer for bottom bar */}
      </div>

      {/* Bottom Sticky Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-6 flex justify-around items-center z-[5000]">
        <button className="text-[#006F8E] p-4 bg-teal-50 rounded-2xl shadow-xl ring-4 ring-teal-50/50 scale-110">
          <MapIcon size={28} />
        </button>
        <button 
          onClick={() => setIsStoreOpen(true)}
          className="text-gray-300 p-4 hover:text-[#006F8E] transition-colors"
        >
          <ShoppingBag size={28} />
        </button>
      </div>

      {/* Store Drawer (Side Menu) */}
      {isStoreOpen && (
        <div className="fixed inset-0 z-[6000] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsStoreOpen(false)} />
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl p-8 flex flex-col animate-slide-left">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">Torch Gear</h2>
              <button onClick={() => setIsStoreOpen(false)} className="p-2 text-gray-300 hover:text-black transition-colors">
                <X size={32} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-10 pr-2">
              <div className="bg-gray-50 p-8 rounded-[40px] text-center space-y-6 border border-gray-100">
                <img src={user.currentProduct.image} alt="Bag" className="w-48 mx-auto drop-shadow-2xl" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Gear Terpakai</p>
                  <p className="text-xl font-black leading-tight text-gray-900">{user.currentProduct.name}</p>
                </div>
                <button className="w-full py-4 bg-[#006F8E] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-900/10">Beli Baru</button>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Koleksi Pilihan</p>
                {['Backpack', 'Travel Bag', 'Messenger Bag', 'Sling Bag'].map(item => (
                  <div key={item} className="flex justify-between items-center p-6 bg-white border border-gray-100 rounded-3xl hover:border-[#006F8E] group cursor-pointer transition-all">
                    <span className="font-bold text-gray-700 group-hover:text-[#006F8E]">{item}</span>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-[#006F8E] group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Official Torch Website</p>
              <a href="https://torch.id" target="_blank" className="text-[#006F8E] font-black text-sm">www.torch.id</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
