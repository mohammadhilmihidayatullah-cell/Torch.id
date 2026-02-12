
import React, { useState, useEffect } from 'react';
import { UserStats, Marker, UserCategory } from './types';
import Onboarding from './components/Onboarding';
import MapComponent from './components/MapComponent';
import { MOCK_LEADERBOARD, PRODUCT_COLLECTIONS } from './constants';
import { 
  Trophy, Flame, Calendar, Award, Map as MapIcon, 
  ChevronRight, Users, Settings, MapPin, Navigation, 
  ShoppingBag, ExternalLink, X, Info, Sparkles, MessageSquare
} from 'lucide-react';

const MOCK_CITIES = ['Jakarta', 'Bandung', 'Yogyakarta', 'Surabaya', 'Bali', 'Medan', 'Makassar', 'Semarang', 'Tokyo', 'Sydney', 'Paris', 'London'];

const App: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [isGearDrawerOpen, setIsGearDrawerOpen] = useState(false);
  const [buddyMessage, setBuddyMessage] = useState("Halo! Sudah siap menjelajah hari ini?");

  useEffect(() => {
    const savedUser = localStorage.getItem('torch_user');
    const savedMarkers = localStorage.getItem('torch_markers');
    if (savedUser) setUserStats(JSON.parse(savedUser));
    if (savedMarkers) setMarkers(JSON.parse(savedMarkers));
  }, []);

  useEffect(() => {
    if (userStats) {
      localStorage.setItem('torch_user', JSON.stringify(userStats));
      if (userStats.streak >= 5) {
        setBuddyMessage("Wah, 5 hari berturut-turut! Kamu hebat sekali!");
      } else if (userStats.totalKm > 100) {
        setBuddyMessage("Sudah lebih dari 100KM! Terus melangkah bersama Torch!");
      }
    }
    if (markers.length > 0) localStorage.setItem('torch_markers', JSON.stringify(markers));
  }, [userStats, markers]);

  const handleDropMarker = (lat: number, lng: number) => {
    if (!userStats) return;

    const randomCity = MOCK_CITIES[Math.floor(Math.random() * MOCK_CITIES.length)];

    const newMarker: Marker = {
      id: Math.random().toString(36).substr(2, 9),
      lat,
      lng,
      userName: userStats.name,
      category: userStats.category,
      timestamp: Date.now(),
      cityName: randomCity
    };

    setMarkers(prev => [...prev, newMarker]);

    setUserStats(prev => {
      if (!prev) return null;
      const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
      const isStreakValid = (Date.now() - prev.lastUpdate) < threeDaysMs;
      
      const newCities = [...prev.visitedCities];
      if (!newCities.includes(randomCity)) {
        newCities.push(randomCity);
      }

      setBuddyMessage(`Hore! Baru saja menandai lokasi di ${randomCity}. Keren banget!`);

      return {
        ...prev,
        totalKm: prev.totalKm + Math.floor(Math.random() * 50) + 10,
        streak: isStreakValid ? prev.streak + 1 : 1,
        lastUpdate: Date.now(),
        visitedCities: newCities
      };
    });
  };

  if (!userStats) {
    return <Onboarding onComplete={setUserStats} />;
  }

  const allUsers = [...MOCK_LEADERBOARD];
  const currentUserIndex = allUsers.findIndex(u => u.name === userStats.name);
  if (currentUserIndex === -1) {
    allUsers.push({ rank: 0, name: userStats.name, category: userStats.category, km: userStats.totalKm, streak: userStats.streak });
  } else {
    allUsers[currentUserIndex] = { ...allUsers[currentUserIndex], km: userStats.totalKm, streak: userStats.streak };
  }
  const sortedLeaderboard = allUsers.sort((a, b) => b.km - a.km).map((u, i) => ({ ...u, rank: i + 1 }));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-[1600px] bg-white shadow-2xl min-h-screen flex flex-col relative overflow-hidden">
        
        {/* Full Width Map Area */}
        <div className="relative h-[65vh] w-full">
          <MapComponent 
            markers={markers} 
            onDrop={handleDropMarker} 
            userCategory={userStats.category}
          />

          {/* Floating Sidebar Toggle Button */}
          <button 
            onClick={() => setIsGearDrawerOpen(true)}
            className="absolute top-24 right-6 z-[2000] bg-[#006F8E] text-white p-6 rounded-[32px] shadow-2xl hover:bg-[#005a75] transition-all flex items-center gap-4 group ring-4 ring-white"
          >
            <ShoppingBag size={28} />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-black whitespace-nowrap uppercase tracking-[0.2em] text-sm">Cek Gear Saya</span>
          </button>
        </div>

        {/* Sliding Gear & Shop Drawer */}
        <div className={`fixed inset-0 z-[5000] transition-opacity duration-300 ${isGearDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsGearDrawerOpen(false)}></div>
          <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 transform ${isGearDrawerOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="bg-[#E0F2F1] p-3 rounded-2xl text-[#006F8E]">
                  <ShoppingBag size={28} />
                </div>
                <h2 className="text-3xl font-black tracking-tighter">Torch Gear</h2>
              </div>
              <button onClick={() => setIsGearDrawerOpen(false)} className="p-2 text-gray-400 hover:text-black transition-colors">
                <X size={32} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Hero Lifestyle Image */}
              <div className="w-full h-72 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=1974&auto=format&fit=crop" 
                  className="w-full h-full object-cover" 
                  alt="Torch Lifestyle"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#006F8E]/90 via-transparent to-transparent flex items-end p-8">
                  <div>
                    <p className="text-white font-black text-3xl tracking-tighter leading-none mb-1 uppercase">Travel with Buddy</p>
                    <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.3em]">#SobalTorch Adventure</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-12">
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Tas Yang Digunakan</h3>
                    <div className="flex items-center gap-2 bg-[#E8F5E9] px-4 py-1.5 rounded-full border border-green-100">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] text-green-800 font-black uppercase tracking-widest">VERIFIED</span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-[48px] p-10 border-2 border-gray-50 shadow-2xl relative overflow-hidden group">
                    <div className="aspect-square bg-gray-50 rounded-[32px] overflow-hidden mb-8 border border-gray-100 flex items-center justify-center p-6 transition-all group-hover:bg-white">
                      <img 
                        src="https://torch.id/cdn/shop/products/Kashiwa_Grey_1_800x.jpg?v=1655716186" 
                        alt="Kashiwa Grey Backpack"
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="relative z-10 text-center">
                      <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#006F8E] bg-[#E0F2F1] px-4 py-2 rounded-xl mb-4 inline-block">
                        BACKPACK ADVENTURE
                      </span>
                      <h3 className="font-black text-gray-900 leading-tight mb-8 text-2xl tracking-tighter">Kashiwa Tas Ransel Foldable 19L</h3>
                      <a 
                        href="https://torch.id/collections/backpack" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full bg-[#006F8E] text-white text-center py-5 rounded-[24px] font-black text-sm hover:bg-[#005a75] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] shadow-xl"
                      >
                        Beli Koleksi Lain <ExternalLink size={18} />
                      </a>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Kategori Produk Lainnya</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {PRODUCT_COLLECTIONS.map((collection) => (
                      <a
                        key={collection}
                        href={`https://torch.id/search?q=${collection}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-6 bg-white border border-gray-100 rounded-[32px] flex justify-between items-center group hover:border-[#006F8E] hover:bg-blue-50/50 transition-all shadow-sm hover:shadow-lg"
                      >
                        <span className="font-black text-lg text-gray-700 group-hover:text-[#006F8E] tracking-tight">{collection}</span>
                        <div className="bg-gray-50 p-2.5 rounded-xl group-hover:bg-[#006F8E] group-hover:text-white transition-all shadow-inner">
                          <ChevronRight size={20} />
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content Section */}
        <div className="flex-1 p-6 md:p-10 -mt-10 relative z-[2000]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Column: Stats & Mascot Buddy */}
            <div className="lg:col-span-1 space-y-10">
              
              {/* Mascot Buddy Section (Centered and Prominent) */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4 w-full flex flex-col items-center">
                   {/* Speech Bubble */}
                  <div className="bg-white p-6 rounded-[32px] rounded-bl-none shadow-2xl border-4 border-[#006F8E] text-[#006F8E] font-black text-sm mb-4 max-w-[90%] relative animate-fade-in">
                    <div className="flex items-start gap-2">
                      <MessageSquare size={18} className="shrink-0 mt-0.5" />
                      <p className="leading-relaxed">"{buddyMessage}"</p>
                    </div>
                    {/* Triangle pointer */}
                    <div className="absolute -bottom-4 left-0 w-0 h-0 border-l-[15px] border-l-transparent border-t-[15px] border-t-[#006F8E]"></div>
                  </div>
                  
                  {/* Mascot Image */}
                  <img 
                    src="https://images.squarespace-cdn.com/content/v1/5b329486360810168343e06a/1592398687498-Y8U1S7T8U1S7T8U1S7T8/Mascot_Final_01.png" 
                    alt="Torch Buddy" 
                    className="h-56 drop-shadow-[0_25px_25px_rgba(0,111,142,0.3)] hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => setBuddyMessage("Ayo kita berkeliling lagi!")}
                  />
                </div>
              </div>

              <div className="bg-white rounded-[48px] p-10 shadow-2xl border border-gray-50">
                <h2 className="text-3xl font-black tracking-tighter mb-10 flex items-center justify-between">
                  My Progress
                  <Award size={32} className="text-[#006F8E]" />
                </h2>

                <div className="space-y-6">
                  <div className={`p-10 rounded-[40px] border-2 transition-all ${userStats.streak >= 5 ? 'border-[#006F8E] bg-[#E0F2F1]/50 shadow-2xl' : 'border-gray-50 bg-gray-50'}`}>
                    <div className="flex items-center gap-6">
                      <div className={`p-6 rounded-[24px] ${userStats.streak >= 5 ? 'bg-[#006F8E] text-white animate-bounce' : 'bg-gray-200 text-gray-500'}`}>
                        <Flame size={40} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Streak Hari</p>
                        <p className="text-4xl font-black">{userStats.streak}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-10 rounded-[40px] bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-6">
                      <div className="p-6 bg-gray-200 rounded-[24px] text-gray-500">
                        <Trophy size={40} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Total Jarak</p>
                        <p className="text-4xl font-black">{userStats.totalKm} <span className="text-sm">KM</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Leaderboard */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[48px] p-10 shadow-2xl border border-gray-50 h-full">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter uppercase">Leaderboard</h2>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mt-2">Peringkat Sobat Torch Global</p>
                  </div>
                  <div className="bg-[#006F8E]/10 p-4 rounded-[24px] text-[#006F8E]">
                    <Sparkles size={28} />
                  </div>
                </div>

                <div className="space-y-6">
                  {sortedLeaderboard.map((entry) => {
                    const isUser = entry.name === userStats.name;
                    const maxKm = Math.max(...sortedLeaderboard.map(e => e.km));
                    const progress = (entry.km / maxKm) * 100;

                    return (
                      <div 
                        key={entry.name}
                        className={`group relative overflow-hidden p-8 rounded-[40px] transition-all border-2 ${
                          isUser ? 'border-[#006F8E] bg-[#E0F2F1]/30 ring-8 ring-[#E0F2F1]/40' : 'border-gray-50 bg-white hover:border-gray-100'
                        }`}
                      >
                        <div 
                          className={`absolute bottom-0 left-0 h-2 transition-all duration-1000 ${isUser ? 'bg-[#006F8E]' : 'bg-gray-100 group-hover:bg-gray-200'}`} 
                          style={{ width: `${progress}%` }}
                        />

                        <div className="flex items-center gap-8">
                          <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center font-black text-2xl ${
                            entry.rank === 1 ? 'bg-yellow-400 text-white shadow-xl shadow-yellow-200' : 
                            entry.rank === 2 ? 'bg-gray-300 text-white shadow-xl shadow-gray-100' : 
                            entry.rank === 3 ? 'bg-orange-300 text-white shadow-xl shadow-orange-100' : 
                            'bg-gray-50 text-gray-400'
                          }`}>
                            {entry.rank}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-4">
                              <p className={`font-black text-2xl tracking-tighter ${isUser ? 'text-[#006F8E]' : 'text-gray-900'}`}>{entry.name}</p>
                              {isUser && <span className="text-[10px] bg-[#006F8E] text-white px-3 py-1.5 rounded-xl uppercase font-black tracking-widest shadow-lg">YOU</span>}
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">{entry.category}</p>
                          </div>

                          <div className="text-right">
                            <p className="font-black text-2xl tracking-tighter">{entry.km.toLocaleString()} <span className="text-xs text-gray-400">KM</span></p>
                            <p className={`text-[10px] font-black flex items-center gap-2 justify-end uppercase tracking-[0.2em] mt-1 ${entry.streak >= 5 ? 'text-[#006F8E]' : 'text-gray-400'}`}>
                              <Flame size={14} /> {entry.streak} DAYS
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Banner Promo */}
                <div className="mt-12 bg-gradient-to-br from-[#006F8E] to-[#004a5f] rounded-[48px] p-12 text-white relative overflow-hidden group shadow-2xl">
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <span className="bg-white/20 px-5 py-2.5 rounded-[20px] text-[11px] font-black uppercase tracking-[0.3em] border border-white/10">CHAMPIONSHIP</span>
                    </div>
                    <h3 className="text-5xl font-black mb-6 tracking-tighter leading-[0.9] uppercase">Dapatkan Tas <br/>Gratis Sekarang!</h3>
                    <p className="text-lg opacity-80 max-w-sm mb-12 font-bold leading-relaxed">Jadilah 3 teratas dan menangkan Tas Torch Kashiwa Limited Edition.</p>
                    <button className="bg-white text-[#006F8E] px-14 py-6 rounded-[28px] font-black text-lg hover:scale-105 transition-all uppercase tracking-[0.3em] shadow-2xl">
                      IKUTI RACE
                    </button>
                  </div>
                  <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-all duration-1000 -rotate-12 pointer-events-none">
                    <Sparkles size={250} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Nav */}
        <div className="bg-white border-t border-gray-100 p-8 flex justify-around items-center sticky bottom-0 z-[3000]">
          <button className="text-[#006F8E] p-5 bg-[#E0F2F1] rounded-[32px] shadow-lg ring-8 ring-[#E0F2F1]/50 transition-all">
            <MapIcon size={32} />
          </button>
          <button className="text-gray-300 hover:text-[#006F8E] transition-all p-5">
            <Users size={32} />
          </button>
          <button className="text-gray-300 hover:text-[#006F8E] transition-all p-5">
            <Settings size={32} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
