
import React from 'react';
import { LeaderboardEntry, UserStats } from '../types';
import { MOCK_LEADERBOARD, COLORS } from '../constants';
import { Trophy, Flame, Map as MapIcon, Calendar } from 'lucide-react';

interface DashboardProps {
  userStats: UserStats;
  onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userStats, onBack }) => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="text-gray-400 hover:text-black">
            <MapIcon size={24} />
          </button>
          <h1 className="text-xl font-extrabold">Adventure Stats</h1>
          <div className="w-6"></div>
        </div>

        {/* User Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-center">
            <Flame className="text-[#F37021] mr-3" size={24} />
            <div>
              <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Streak</p>
              <p className="text-xl font-black text-orange-800">{userStats.streak} Hari</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center">
            <Trophy className="text-gray-400 mr-3" size={24} />
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Distance</p>
              <p className="text-xl font-black">{userStats.totalKm} KM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 bg-gray-50/50">
        <h2 className="text-lg font-black mb-4">Leaderboard Global</h2>
        <div className="space-y-3">
          {MOCK_LEADERBOARD.map((entry, idx) => {
            const isUser = entry.name === userStats.name;
            const rankEmoji = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : null;
            
            return (
              <div 
                key={entry.name}
                className={`flex items-center p-4 rounded-2xl transition-all ${
                  isUser ? 'bg-black text-white scale-105 shadow-xl ring-2 ring-black' : 'bg-white border border-gray-100'
                }`}
              >
                <div className="w-8 font-black text-lg">
                  {rankEmoji || entry.rank}
                </div>
                <div className="flex-1 ml-2">
                  <p className="font-bold">{entry.name}</p>
                  <p className={`text-[10px] ${isUser ? 'text-gray-400' : 'text-gray-400'}`}>{entry.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm">{entry.km} KM</p>
                  <p className="text-[10px] opacity-70">{entry.streak} Day Streak</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reward Card */}
        <div className="mt-8 bg-[#F37021] p-6 rounded-3xl text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-2">Target Berikutnya! 🎁</h3>
            <p className="text-sm opacity-90 mb-4">Capai 2000 KM untuk mendapatkan Voucher Diskon 50% untuk koleksi Tas Torch terbaru!</p>
            <button className="bg-white text-[#F37021] px-6 py-2 rounded-full font-bold text-sm">Lihat Hadiah</button>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-20">
             <Trophy size={150} />
          </div>
        </div>

        {/* Streak Calendar Mockup */}
        <div className="mt-8 p-4 bg-white rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold flex items-center gap-2">
               <Calendar size={18} className="text-[#F37021]" />
               Riwayat Streak
             </h3>
             <span className="text-[10px] font-bold text-[#F37021]">Update every 3 days!</span>
          </div>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div key={day} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                  day <= userStats.streak ? 'bg-[#F37021] text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {day}
                </div>
                <span className="text-[8px] uppercase text-gray-400">Day</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
