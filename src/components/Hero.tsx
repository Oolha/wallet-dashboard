"use client";

import { useEffect, useState } from "react";

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative overflow-hidden py-10 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-300 rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        <div className="text-3xl mb-4 opacity-30 text-amber-500">✦</div>

        <h1 className="text-5xl md:text-6xl font-serif text-purple-900 mb-4 tracking-wide">
          Grimoire of Digital Assets
        </h1>

        <p className="text-xl text-purple-700 font-light max-w-2xl mx-auto mb-8">
          Track your magical artifacts across the blockchain realm
        </p>

        <div className="flex justify-center items-center gap-4 text-amber-600 opacity-40">
          <span className="text-2xl">✦</span>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
          <span className="text-2xl">◆</span>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
          <span className="text-2xl">✦</span>
        </div>
      </div>
    </div>
  );
}
