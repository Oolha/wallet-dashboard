import { WalletConnect } from "@/components/WalletConnect";
import { BalanceCard } from "@/components/BalanceCard";
import { TokenList } from "@/components/TokenList";
import { TransactionList } from "@/components/TransactionList";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img
            src="/hero.png"
            alt=""
            decoding="async"
            loading="eager"
            className="
      h-full w-full
      object-cover
      object-[70%_50%]
      opacity-75
    "
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-sky-50 via-purple-50/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-50/25 via-transparent to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/5 via-pink-200/5 to-blue-200/5 animate-aurora" />
      </div>

      <div className="relative z-10">
        <WalletConnect />
        <Hero />

        <div className="container mx-auto px-4 pb-16">
          <div className="px-4 py-5 md:px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif text-purple-900 mb-2">
                Your Magical Treasury
              </h2>
              <div className="flex justify-center items-center gap-3 text-amber-600 opacity-40">
                <span>✦</span>
                <div className="w-16 h-px bg-amber-400" />
                <span>✦</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <BalanceCard />
              <TokenList />
              <TransactionList />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-purple-400/40 font-serif pointer-events-none z-0">
        ✦ Magic is just another application of knowledge ✦
      </div>
    </main>
  );
}
