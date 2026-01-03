import React from "react";

const Hero = () => {
  return (
    <section className="px-4 pt-6 max-w-md mx-auto">
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-6 rounded-[2rem] text-white shadow-xl shadow-stone-200 relative overflow-hidden isolate">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/20 border border-orange-500/30 px-3 py-1 rounded-full mb-3 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <p className="text-orange-400 font-bold text-[10px] uppercase tracking-widest">Đặt món siêu tốc</p>
          </div>
          <h2 className="text-2xl font-bold leading-tight mb-2">
            Quét mã đặt trước,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Tới là lấy luôn!</span>
          </h2>
          <p className="text-stone-400 text-xs font-medium leading-relaxed max-w-[80%]">
            Không đợi chờ  Không trễ làm  Đậm đà nguyên bản
          </p>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-orange-600/30 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>
    </section>
  );
};

export default Hero;
