import { Check, Zap, Building2, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

const plans = [
  {
    name: "BASIC",
    price: "49.000",
    description: "Sempurna untuk UMKM yang baru mulai.",
    icon: Zap,
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-100 dark:bg-slate-800/50",
    features: [
      "Aplikasi Kasir (POS)",
      "Riwayat Transaksi",
      "Laporan Dasar",
      "Support Email"
    ],
    buttonText: "Pakai Basic",
    current: false
  },
  {
    name: "PRO",
    price: "149.000",
    description: "Untuk warung yang ingin berkembang pesat.",
    icon: Crown,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    features: [
      "Semua fitur Basic",
      "Analytics Realtime",
      "Multi User (5 Akun)",
      "Export Data (CSV/PDF)",
      "Customer Display"
    ],
    buttonText: "Plan Saat Ini",
    current: true
  },
  {
    name: "ENTERPRISE",
    price: "499.000",
    description: "Solusi lengkap untuk banyak cabang.",
    icon: Building2,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    features: [
      "Semua fitur Pro",
      "Multi Cabang / Outlet",
      "API Integration",
      "Priority Support 24/7",
      "White Label System"
    ],
    buttonText: "Hubungi Sales",
    current: false
  }
];

const Subscription = () => {
  const handleUpgrade = (planName) => {
    toast.success(`Berhasil mengajukan upgrade ke paket ${planName}!`, {
      description: 'Tim kami akan segera memproses langganan Anda.'
    });
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-8 max-w-6xl mx-auto"
    >
      <motion.div variants={itemVariants} className="text-center max-w-2xl mx-auto mt-4">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight mb-4">Pilih Paket Berlangganan</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Tingkatkan performa bisnis Anda dengan fitur lengkap WarungPOS. Pilih paket yang sesuai dengan ukuran warung atau toko Anda.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <motion.div 
              variants={itemVariants}
              key={plan.name} 
              className={`relative bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 transition-all duration-300
                ${plan.current 
                  ? 'border-blue-500 dark:border-blue-500 shadow-xl shadow-blue-500/10 scale-105 z-10' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 shadow-sm'}
              `}
            >
              {plan.current && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-md shadow-blue-500/30">
                  Pilihan Populer
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${plan.bgColor} ${plan.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 dark:text-white tracking-wider">{plan.name}</h3>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Rp {plan.price}</span>
                <span className="text-slate-500 dark:text-slate-400 font-semibold"> / bulan</span>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-8 min-h-[40px]">{plan.description}</p>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm font-semibold">
                    <Check size={18} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleUpgrade(plan.name)}
                disabled={plan.current}
                className={`w-full py-3.5 rounded-2xl font-bold transition-all
                  ${plan.current 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-transparent' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-[0.98] border border-blue-500'}
                `}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Subscription;
