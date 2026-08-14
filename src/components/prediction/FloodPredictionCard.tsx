'use client';

import { FloodPrediction, PREDICTION_TREND_CONFIG } from '@/types/prediction';
import { SEVERITY_CONFIG } from '@/types/flood';
import Card from '@/components/ui/Card';
import { Brain, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  prediction: FloodPrediction;
  index?: number;
}

export default function FloodPredictionCard({ prediction, index = 0 }: Props) {
  const currentConfig = SEVERITY_CONFIG[prediction.currentRisk];
  const predictedConfig = SEVERITY_CONFIG[prediction.predictedRisk];
  const trendConfig = PREDICTION_TREND_CONFIG[prediction.trend];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{prediction.road}</h3>
              <p className="text-xs text-slate-500">{prediction.location}</p>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
            AI Prediction
          </span>
        </div>

        {/* Risk comparison */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-slate-50 rounded-lg p-2.5">
            <p className="text-xs text-slate-500 mb-1">Current Risk</p>
            <span className={`text-sm font-semibold ${currentConfig.color}`}>
              {currentConfig.label}
            </span>
          </div>
          <div className="bg-slate-50 rounded-lg p-2.5">
            <p className="text-xs text-slate-500 mb-1">Predicted Risk</p>
            <span className={`text-sm font-bold ${predictedConfig.color}`}>
              {predictedConfig.label}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
            <span>Trend: <strong className={trendConfig.color}>{trendConfig.icon} {trendConfig.label}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Estimated: <strong>{prediction.estimatedTime}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-3.5 h-3.5 text-slate-400" />
            <span>Confidence: <strong>{prediction.confidence}%</strong></span>
          </div>
        </div>

        {/* Basis */}
        <p className="text-xs text-slate-400 mt-3 pt-2 border-t border-slate-100 leading-relaxed">
          {prediction.basedOn}
        </p>

        {/* Disclaimer */}
        <p className="text-xs text-amber-600 mt-2 bg-amber-50 rounded px-2 py-1.5 border border-amber-100">
          ⚠️ Prediction is an estimate and may not reflect actual flood conditions.
        </p>
      </Card>
    </motion.div>
  );
}
