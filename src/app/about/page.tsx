'use client';

import Card from '@/components/ui/Card';
import { Droplets, Users, Shield, MapPin, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: MapPin,
    title: 'Real-time Flood Map',
    description:
      'See current flood conditions on an interactive map. Know which areas are affected before you travel.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Users,
    title: 'Community-Driven',
    description:
      'Reports come directly from people in the area. The community verifies and confirms conditions.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: TrendingUp,
    title: 'Flood Pulse',
    description:
      'Every report shows water level, trend, community confidence, and freshness — understand the situation in seconds.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Shield,
    title: 'Community Verification',
    description:
      'Confirm or dispute reports. High community confidence means the information is trustworthy.',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Clock,
    title: 'Freshness Indicators',
    description:
      'Older reports become less prominent. You always know how current the information is.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Droplets,
    title: 'Simple Reporting',
    description:
      'Report flooding in under a minute. Select location, severity, water depth, and trend — done.',
    color: 'bg-cyan-50 text-cyan-600',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8 sm:py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
          <Droplets className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          Bahala
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          A community-driven flood awareness platform for the Philippines. Report, verify, and track
          flooding in your area so everyone stays informed and safe.
        </p>
      </motion.div>

      {/* How it works */}
      <Card className="mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-4">How It Works</h2>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2">
          {[
            { step: '1', label: 'See Flood', emoji: '👀' },
            { step: '2', label: 'Report It', emoji: '📝' },
            { step: '3', label: 'Community Confirms', emoji: '✅' },
            { step: '4', label: 'Everyone Gets Updated', emoji: '📢' },
          ].map((item, i) => (
            <div key={item.step} className="flex items-center gap-2 sm:flex-col sm:text-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg flex-shrink-0">
                {item.emoji}
              </div>
              <div>
                <p className="text-xs text-blue-600 font-semibold">Step {item.step}</p>
                <p className="text-sm font-medium text-slate-700">{item.label}</p>
              </div>
              {i < 3 && (
                <span className="hidden sm:block text-slate-300 text-xl mx-2">→</span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Features Grid */}
      <h2 className="text-lg font-bold text-slate-900 mb-4">Features</h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10"
      >
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div key={feature.title} variants={itemVariants}>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-full">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${feature.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">{feature.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Community Note */}
      <Card>
        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Built for the Community</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Bahala is designed to help Filipino communities share critical flood information quickly
            and reliably. No AI predictions, no complex algorithms — just real people helping real
            people stay safe during floods.
          </p>
          <p className="text-xs text-slate-400 mt-4">
            &quot;Bahala&quot; — a Filipino expression of trust, resilience, and community support.
          </p>
        </div>
      </Card>
    </div>
  );
}
