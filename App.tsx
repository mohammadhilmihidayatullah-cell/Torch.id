
import React, { useState, useEffect } from 'react';
import { UserStats, Marker, UserCategory } from './types';
import Onboarding from './components/Onboarding';
import MapComponent from './components/MapComponent';
import { MOCK_LEADERBOARD, PRODUCT_COLLECTIONS } from './constants';
import { 
  Trophy, Flame, Award, Map as MapIcon, 
  ChevronRight, Users, Settings, MapPin, Navigation, 
  ShoppingBag, ExternalLink, X, Sparkles, MessageSquare
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

          {/* Floating Gear Access Button */}
          <button 
            onClick={() => setIsGearDrawerOpen(true)}
            className="absolute top-24 right-6 z-[2000] bg-[#006F8E] text-white p-6 rounded-[32px] shadow-2xl hover:bg-[#005a75] transition-all flex items-center gap-4 group ring-4 ring-white"
          >
            <ShoppingBag size={28} />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-black whitespace-nowrap uppercase tracking-[0.2em] text-sm">Gunakan Gear</span>
          </button>
        </div>

        {/* Sliding Shop Drawer */}
        <div className={`fixed inset-0 z-[5000] transition-opacity duration-300 ${isGearDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsGearDrawerOpen(false)}></div>
          <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 transform ${isGearDrawerOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="bg-[#E0F2F1] p-3 rounded-2xl text-[#006F8E]">
                  <ShoppingBag size={28} />
                </div>
                <h2 className="text-3xl font-black tracking-tighter uppercase">Torch Store</h2>
              </div>
              <button onClick={() => setIsGearDrawerOpen(false)} className="p-2 text-gray-400 hover:text-black transition-colors">
                <X size={32} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="w-full h-72 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=1974&auto=format&fit=crop" 
                  className="w-full h-full object-cover" 
                  alt="Torch Lifestyle"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#006F8E]/90 via-transparent to-transparent flex items-end p-8">
                  <div>
                    <p className="text-white font-black text-3xl tracking-tighter leading-none mb-1 uppercase">EXPLORE WITH BUDDY</p>
                    <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.3em]">#TorchAdventureID</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-12">
                <section>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Gear Aktif</h3>
                  <div className="bg-white rounded-[48px] p-10 border-2 border-gray-50 shadow-2xl relative overflow-hidden group">
                    <div className="aspect-square bg-gray-50 rounded-[32px] overflow-hidden mb-8 flex items-center justify-center p-6">
                      <img 
                        src="https://torch.id/cdn/shop/products/Kashiwa_Grey_1_800x.jpg?v=1655716186" 
                        alt="Kashiwa Grey"
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-black text-gray-900 leading-tight mb-8 text-2xl tracking-tighter">Kashiwa Foldable 19L</h3>
                      <a 
                        href="https://torch.id/collections/backpack" 
                        target="_blank" 
                        className="w-full bg-[#006F8E] text-white text-center py-5 rounded-[24px] font-black text-sm block uppercase tracking-[0.2em] shadow-xl"
                      >
                        Beli Koleksi Lain <ExternalLink size={18} className="inline ml-2 mb-1" />
                      </a>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Explore Koleksi</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {PRODUCT_COLLECTIONS.map((collection) => (
                      <a
                        key={collection}
                        href={`https://torch.id/search?q=${collection}`}
                        target="_blank"
                        className="p-6 bg-white border border-gray-100 rounded-[32px] flex justify-between items-center group hover:border-[#006F8E] hover:bg-blue-50/50 transition-all"
                      >
                        <span className="font-black text-lg text-gray-700 tracking-tight">{collection}</span>
                        <ChevronRight size={20} className="text-gray-300 group-hover:text-[#006F8E]" />
                      </a>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 md:p-10 -mt-10 relative z-[2000]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Column: Mascot & Stats */}
            <div className="lg:col-span-1 space-y-10">
              <div className="flex flex-col items-center">
                <div className="relative mb-4 w-full flex flex-col items-center">
                  <div className="bg-white p-6 rounded-[32px] rounded-bl-none shadow-2xl border-4 border-[#006F8E] text-[#006F8E] font-black text-sm mb-4 max-w-[90%] relative animate-fade-in">
                    <div className="flex items-start gap-2">
                      <MessageSquare size={18} className="shrink-0 mt-0.5" />
                      <p className="leading-relaxed">"{buddyMessage}"</p>
                    </div>
                  </div>
                  <img 
                    src="https://images.squarespace-cdn.com/content/v1/5b329486360810168343e06a/1592398687498-Y8U1S7T8U1S7T8U1S7T8/Mascot_Final_01.png" 
                    alt="Buddy" 
                    className="h-56 drop-shadow-[0_25px_25px_rgba(0,111,142,0.3)] hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => setBuddyMessage("Ayo kita berkeliling lagi!")}
                  />
                </div>
              </div>

              <div className="bg-white rounded-[48px] p-10 shadow-2xl border border-gray-50">
                <h2 className="text-3xl font-black tracking-tighter mb-10">Statistik Saya</h2>
                <div className="space-y-6">
                  <div className="p-10 rounded-[40px] bg-[#E0F2F1]/50 border-2 border-[#006F8E] shadow-xl">
                    <div className="flex items-center gap-6">
                      <div className="p-6 bg-[#006F8E] text-white rounded-[24px]">
                        <Flame size={40} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Streak Hari</p>
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
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Jarak</p>
                        <p className="text-4xl font-black">{userStats.totalKm} KM</p>
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
                  <h2 className="text-4xl font-black tracking-tighter uppercase">Leaderboard</h2>
                  <Sparkles size={32} className="text-[#006F8E]" />
                </div>
                <div className="space-y-6">
                  {sortedLeaderboard.map((entry) => {
                    const isUser = entry.name === userStats.name;
                    return (
                      <div 
                        key={entry.name}
                        className={`p-8 rounded-[40px] border-2 flex items-center gap-8 transition-all ${
                          isUser ? 'border-[#006F8E] bg-[#E0F2F1]/30 ring-8 ring-[#E0F2F1]/40 shadow-xl' : 'border-gray-50 bg-white hover:border-gray-200'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center font-black text-2xl ${
                          entry.rank === 1 ? 'bg-yellow-400 text-white' : 'bg-gray-50 text-gray-400'
                        }`}>
                          {entry.rank}
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-2xl tracking-tighter">{entry.name}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase mt-1">{entry.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-2xl">{entry.km.toLocaleString()} KM</p>
                          <p className="text-[10px] font-black text-gray-400 mt-1">{entry.streak} DAYS</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-white border-t border-gray-100 p-8 flex justify-around items-center sticky bottom-0 z-[3000]">
          <button className="text-[#006F8E] p-5 bg-[#E0F2F1] rounded-[32px] shadow-lg">
            <MapIcon size={32} />
          </button>
          <button className="text-gray-300 p-5"><Users size={32} /></button>
          <button className="text-gray-300 p-5"><Settings size={32} /></button>
        </div>
      </div>
    </div>
  );
};

export default App;
