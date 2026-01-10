import React from "react";
import LoyaltyCard from "./LoyaltyCard";

const Hero = () => {
  return (
    <section className="w-full max-w-md mx-auto px-4 pt-6 pb-2 relative overflow-hidden">
      {/* Background Decorative Elemements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-coffee-50/50 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-brand-red/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      {/* Loyalty Card Container */}
      <div className="relative z-10 transform hover:scale-[1.01] transition-transform duration-500 ease-out">
        <LoyaltyCard />
      </div>
    </section>
  );
};

export default Hero;
