'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFloodStore } from '@/lib/store';
import {
  LatLng,
  FloodSeverity,
  WaterDepth,
  FloodTrend,
  FloodReportFormData,
} from '@/types/flood';
import { getRoadSegmentBetweenPoints, RoadSegmentResult } from '@/lib/roadService';
import DynamicFloodReportMap from '@/components/map/DynamicFloodReportMap';
import type { SelectionState } from '@/components/map/FloodReportMap';
import FloodLocationSummary from '@/components/reports/FloodLocationSummary';
import FloodSeveritySelector from '@/components/reports/FloodSeveritySelector';
import WaterDepthSelector from '@/components/reports/WaterDepthSelector';
import FloodTrendSelector from '@/components/reports/FloodTrendSelector';
import PhotoUpload from '@/components/reports/PhotoUpload';
import Button from '@/components/ui/Button';
import {
  AlertTriangle,
  Droplets,
  TrendingUp,
  FileText,
  CheckCircle,
  MapPin,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportPage() {
  const router = useRouter();
  const { addReport } = useFloodStore();

  // Map / road selection state
  const [selectionState, setSelectionState] = useState<SelectionState>('selecting-a');
  const [pointA, setPointA] = useState<LatLng | null>(null);
  const [pointB, setPointB] = useState<LatLng | null>(null);
  const [roadResult, setRoadResult] = useState<RoadSegmentResult | null>(null);
  const [isLoadingRoad, setIsLoadingRoad] = useState(false);

  // Form state
  const [severity, setSeverity] = useState<FloodSeverity | ''>('');
  const [waterDepth, setWaterDepth] = useState<WaterDepth | ''>('');
  const [trend, setTrend] = useState<FloodTrend | ''>('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle map click — selects Point A or B
  const handleMapClick = useCallback(
    async (latlng: LatLng) => {
      if (selectionState === 'selecting-a' || selectionState === 'idle') {
        setPointA(latlng);
        setPointB(null);
        setRoadResult(null);
        setSelectionState('selecting-b');
      } else if (selectionState === 'selecting-b') {
        setPointB(latlng);
        setIsLoadingRoad(true);

        try {
          const result = await getRoadSegmentBetweenPoints(pointA!, latlng);
          setRoadResult(result);
          setSelectionState('complete');
        } catch {
          // If road matching fails, create a simple segment
          setRoadResult({
            roadName: 'Road location selected',
            geometry: [pointA!, latlng],
            distanceMeters: 0,
            isExactMatch: false,
          });
          setSelectionState('complete');
        } finally {
          setIsLoadingRoad(false);
        }
      }
    },
    [selectionState, pointA]
  );

  // Reset selection
  const handleReset = useCallback(() => {
    setPointA(null);
    setPointB(null);
    setRoadResult(null);
    setSelectionState('selecting-a');
  }, []);

  // Image handling
  const handleImageSelect = useCallback((file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleImageClear = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
  }, []);

  // Form validation
  const isFormValid =
    selectionState === 'complete' &&
    roadResult &&
    severity !== '' &&
    waterDepth !== '' &&
    trend !== '';

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !pointA || !pointB || !roadResult) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const formData: FloodReportFormData = {
      latitude: pointA[0],
      longitude: pointA[1],
      location: roadResult.roadName,
      road: roadResult.roadName,
      roadGeometry: roadResult.geometry,
      severity: severity as FloodSeverity,
      waterDepth: waterDepth as WaterDepth,
      trend: trend as FloodTrend,
      description,
      image: imageFile,
    };

    addReport(formData);
    setIsSubmitting(false);
    setIsSubmitted(true);

    setTimeout(() => router.push('/reports'), 1500);
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Report Submitted!</h2>
          <p className="text-slate-500 max-w-md">
            Thank you for helping the community. Your flood report is now visible on the map.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
      {/* MAP: Shows first on mobile (order-first), right side on desktop */}
      <div className="w-full lg:flex-1 h-[50vh] lg:h-auto min-h-[300px] lg:min-h-0 lg:order-2">
        <DynamicFloodReportMap
          selectionState={selectionState}
          pointA={pointA}
          pointB={pointB}
          roadGeometry={roadResult?.geometry ?? null}
          severity={severity}
          onMapClick={handleMapClick}
          onReset={handleReset}
        />
      </div>

      {/* FORM: Below map on mobile, left side on desktop */}
      <div className="w-full lg:w-[38%] xl:w-[35%] overflow-y-auto border-t lg:border-t-0 lg:border-r border-slate-200 bg-white flex-1 lg:flex-none lg:order-1">
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 lg:p-6 space-y-5 lg:space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-xl font-bold text-slate-900">Report Flooding</h1>
            <p className="text-sm text-slate-500 mt-1">
              Select the flooded road section on the map, then describe the conditions.
            </p>
          </div>

          {/* Safety notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Only report if it is safe to do so. Do not enter floodwaters.
            </p>
          </div>

          {/* Section 1: Road Selection */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-semibold text-slate-900">Flooded Road</h2>
            </div>

            {selectionState === 'complete' && roadResult && pointA && pointB ? (
              <FloodLocationSummary
                roadName={roadResult.roadName}
                pointA={pointA}
                pointB={pointB}
                distanceMeters={roadResult.distanceMeters}
                onReset={handleReset}
              />
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                {isLoadingRoad ? (
                  <p className="text-sm text-slate-500 animate-pulse">Identifying road...</p>
                ) : (
                  <>
                    <div className="w-10 h-10 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-sm text-slate-600 font-medium">
                      {selectionState === 'selecting-a' && 'Select Point A on the map →'}
                      {selectionState === 'selecting-b' && 'Now select Point B on the map →'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Click two points to define the flooded road section
                    </p>
                  </>
                )}
              </div>
            )}
          </section>

          {/* Section 2: Severity */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h2 className="text-base font-semibold text-slate-900">Flood Severity</h2>
            </div>
            <FloodSeveritySelector value={severity} onChange={setSeverity} />
          </section>

          {/* Section 3: Water Depth */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-semibold text-slate-900">Water Depth</h2>
            </div>
            <WaterDepthSelector value={waterDepth} onChange={setWaterDepth} />
          </section>

          {/* Section 4: Trend */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-semibold text-slate-900">Flood Trend</h2>
            </div>
            <FloodTrendSelector value={trend} onChange={setTrend} />
          </section>

          {/* Section 5: Description */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-slate-600" />
              <h2 className="text-base font-semibold text-slate-900">Description</h2>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Water is covering both lanes and motorcycles are having difficulty passing."
              rows={3}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />
          </section>

          {/* Section 6: Photo */}
          <section>
            <h2 className="text-base font-semibold text-slate-900 mb-3">Photo (optional)</h2>
            <PhotoUpload
              imagePreview={imagePreview}
              onImageSelect={handleImageSelect}
              onImageClear={handleImageClear}
            />
          </section>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200">
            {!isFormValid && (
              <p className="text-xs text-amber-600 mb-3 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
                {selectionState !== 'complete'
                  ? 'Please select the beginning and end of the flooded road on the map.'
                  : !severity
                  ? 'Please select a flood severity level.'
                  : !waterDepth
                  ? 'Please select the water depth.'
                  : 'Please select the flood trend.'}
              </p>
            )}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Flood Report'}
            </Button>
            <p className="text-xs text-slate-400 text-center mt-2">
              Your report will be immediately visible as a highlighted road on the map.
            </p>
          </div>
        </form>
      </div>

    </div>
  );
}
