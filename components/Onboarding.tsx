
import React, { useState } from 'react';
import { UserCategory, UserStats } from '../types';
import { CATEGORY_ICONS } from '../constants';

interface OnboardingProps {
  onComplete: (stats: UserStats) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [voucher, setVoucher] = useState('');
  const [category, setCategory] = useState<UserCategory | null>(null);

  // Menggunakan URL yang valid dan representatif
  const torchLogo = "https://torch.id/cdn/shop/files/Logo_Torch_Primary_Black_150x.png?v=1614300445";
  const mascotUrl = "https://i.ibb.co/vYm6p6j/mascot-blue-fuzzy.png"; // Placeholder representasi mascot biru fuzzy

  const handleNext = () => {
    if (step === 1 && email.includes('@')) {
      setStep(2);
    } else if (step === 2 && name.trim()) {
      setStep(3);
    } else if (step === 3 && category) {
      onComplete({
        name,
        email,
        category,
        totalKm: 0,
        streak: 1,
        lastUpdate: Date.now(),
        visitedCities: [],
        voucherCode: voucher,
        currentProduct: {
          name: 'Kashiwa Tas Ransel Foldable 19L',
          category: 'Backpack',
          image: 'https://torch.id/cdn/shop/products/Kashiwa_Grey_1_800x.jpg?v=1655716186'
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 overflow-hidden">
      {step === 3 && (
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt="Adventure background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/80 to-[#006F8E]/90 backdrop-blur-[2px]"></div>
        </div>
      )}

      <div className={`w-full max-w-2xl p-8 relative z-10 transition-all duration-500 ${step === 3 ? 'text-white' : 'text-black'}`}>
        <div className="flex flex-col items-center mb-6">
           <img 
            src={torchLogo} 
            alt="Torch Logo" 
            className={`h-12 mb-6 transition-all ${step === 3 ? 'invert brightness-200' : 'hue-rotate-[160deg] saturate-[3] brightness-[0.8]'}`}
          />
          
          {(step === 1 || step === 2) && (
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full bg-[#E0F2F1] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg animate-bounce">
                <img 
                  src="https://images.squarespace-cdn.com/content/v1/5b329486360810168343e06a/1592398687498-Y8U1S7T8U1S7T8U1S7T8/Mascot_Final_01.png" // Menggunakan karakter 3D friendly
                  className="w-full h-full object-contain"
                  alt="Mascot Blue" 
                />
              </div>
            </div>
          )}
        </div>
        
        {step === 1 && (
          <div className="space-y-6 animate-fade-in text-center max-w-md mx-auto">
            <h1 className="text-4xl font-black tracking-tight mb-2">Halo Adventurer!</h1>
            <p className="text-gray-500 mb-8 font-semibold leading-relaxed">
              Aku akan menemanimu mencatat setiap langkah perjalananmu bersama Torch.
            </p>
            <div className="text-left space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Email Anda</label>
                <input
                  type="email"
                  placeholder="masukkan email..."
                  className="w-full p-5 mt-1 border-2 border-gray-100 rounded-[28px] focus:outline-none focus:border-[#006F8E] transition-all font-bold text-lg shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={handleNext}
              disabled={!email.includes('@')}
              className="w-full py-6 bg-[#006F8E] text-white font-black rounded-[28px] shadow-2xl disabled:opacity-30 hover:bg-[#005a75] transition-all text-xl uppercase tracking-[0.2em] mt-4"
            >
              Mulai Sekarang
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in max-w-md mx-auto">
            <h1 className="text-3xl font-black text-center tracking-tight">Siapa Namamu?</h1>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Contoh: Adi Pratama"
                  className="w-full p-5 mt-1 border-2 border-gray-100 rounded-[28px] focus:outline-none focus:border-[#006F8E] transition-all font-bold text-lg shadow-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Kode Referral</label>
                <input
                  type="text"
                  placeholder="OPSIONAL"
                  className="w-full p-5 mt-1 border-2 border-gray-50 bg-gray-50 rounded-[28px] focus:outline-none focus:border-[#006F8E] transition-all font-bold uppercase"
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={handleNext}
              disabled={!name.trim()}
              className="w-full py-6 bg-[#006F8E] text-white font-black rounded-[28px] shadow-2xl disabled:opacity-30 hover:bg-[#005a75] transition-all text-xl uppercase tracking-[0.2em]"
            >
              Simpan & Lanjut
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase">PILIH KARAKTER</h1>
              <p className="text-blue-200 font-bold opacity-80 uppercase tracking-widest text-xs">Sesuaikan dengan gaya jalan-jalanmu</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(UserCategory).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center p-6 border-2 rounded-[32px] transition-all duration-300 backdrop-blur-sm ${
                    category === cat ? 'border-[#006F8E] bg-[#006F8E]/60 translate-x-1 shadow-xl' : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`p-4 rounded-2xl mr-4 transition-colors ${category === cat ? 'bg-white text-[#006F8E]' : 'bg-white/10 text-white'}`}>
                    {CATEGORY_ICONS[cat]}
                  </div>
                  <div className="text-left">
                    <p className="font-black text-xl leading-none">{cat}</p>
                    <p className="text-[10px] uppercase font-bold text-blue-200 mt-2 tracking-widest opacity-60">Adventure Mode</p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!category}
              className="w-full py-6 bg-white text-[#006F8E] font-black rounded-[32px] shadow-2xl disabled:opacity-30 hover:bg-blue-50 transition-all text-2xl uppercase tracking-[0.3em] mt-4"
            >
              GASKEUN!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
