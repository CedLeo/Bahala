'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFloodStore } from '@/lib/store';
import {
  FloodSeverity,
  WaterDepth,
  FloodTrend,
  SEVERITY_CONFIG,
  WATER_DEPTH_LABELS,
  TREND_CONFIG,
  FloodReportFormData,
} from '@/types/flood';
import DynamicLocationPickerMap from '@/components/map/DynamicLocationPickerMap';
import Button from '@/components/ui/Button';
import {
  MapPin,
  Navigation,
  Camera,
  AlertTriangle,
  Droplets,
  TrendingUp,
  FileText,
  CheckCircle,
} from 'lucide-react';

export default function FloodReportForm() {
  const router = useRouter();
  const { addReport } = useFloodStore();

  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [locationName, setLocationName] = useState('');
  const [roadName, setRoadName] = useState('');
  const [severity, setSeverity] = useState<FloodSeverity | ''>('');
  const [waterDepth, setWaterDepth] = useState<WaterDepth | ''>('');
  const [trend, setTrend] = useState<FloodTrend | ''>('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedPosition([lat, lng]);
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedPosition([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          alert('Unable to get your location. Please select manually on the map.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPosition || !severity || !waterDepth || !trend) {
      alert('Please fill in all required fields and select a location.');
      return;
    }

    setIsSubmitting(true);

    // Simulate a brief delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const formData: FloodReportFormData = {
      latitude: selectedPosition[0],
      longitude: selectedPosition[1],
      location: locationName || `${selectedPosition[0].toFixed(4)}, ${selectedPosition[1].toFixed(4)}`,
      road: roadName || locationName || 'Unknown Road',
      severity: severity as FloodSeverity,
      waterDepth: waterDepth as WaterDepth,
      trend: trend as FloodTrend,
      description,
      image: imageFile,
    };

    addReport(formData);
    setIsSubmitting(false);
    setIsSubmitted(true);

    // Redirect after brief success state
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Report Submitted!</h2>
        <p className="text-slate-500 text-center max-w-md">
          Thank you for helping the community. Your flood report is now visible on the map.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Location Section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-900">Location</h2>
        </div>
        <p className="text-sm text-slate-500 mb-3">
          Click on the map to select the flood location, or use your current location.
        </p>

        <div className="flex gap-2 mb-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleUseCurrentLocation}
          >
            <Navigation className="w-3.5 h-3.5" />
            Use Current Location
          </Button>
        </div>

        <DynamicLocationPickerMap
          onLocationSelect={handleLocationSelect}
          selectedPosition={selectedPosition}
        />

        {selectedPosition && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Location name (optional)
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g., Near Ateneo Gate, Quezon City"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <label className="block text-sm font-medium text-slate-700 mb-1 mt-3">
              Affected road/street
            </label>
            <input
              type="text"
              value={roadName}
              onChange={(e) => setRoadName(e.target.value)}
              placeholder="e.g., Katipunan Avenue"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-xs text-slate-400 mt-1">
              Coordinates: {selectedPosition[0].toFixed(4)}, {selectedPosition[1].toFixed(4)}
            </p>
          </div>
        )}
      </section>

      {/* Severity Section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h2 className="text-lg font-semibold text-slate-900">Flood Severity</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(SEVERITY_CONFIG) as [FloodSeverity, typeof SEVERITY_CONFIG[FloodSeverity]][]).map(
            ([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSeverity(key)}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  severity === key
                    ? `${config.borderColor} ${config.bgColor} ${config.color}`
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: config.markerColor }}
                />
                {config.label}
              </button>
            )
          )}
        </div>
      </section>

      {/* Water Depth Section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Droplets className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-900">Water Depth</h2>
        </div>
        <div className="space-y-2">
          {(Object.entries(WATER_DEPTH_LABELS) as [WaterDepth, string][]).map(
            ([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setWaterDepth(key)}
                className={`w-full text-left px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                  waterDepth === key
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>
      </section>

      {/* Trend Section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-slate-900">Flood Trend</h2>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(Object.entries(TREND_CONFIG) as [FloodTrend, typeof TREND_CONFIG[FloodTrend]][]).map(
            ([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTrend(key)}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  trend === key
                    ? `border-blue-500 bg-blue-50 text-blue-700`
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-lg">{config.icon}</span>
                <span>{config.label}</span>
              </button>
            )
          )}
        </div>
      </section>

      {/* Description Section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">Description</h2>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the flood situation (optional)..."
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
        />
      </section>

      {/* Photo Section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Camera className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">Photo (optional)</h2>
        </div>
        <div className="flex items-center gap-4">
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
            <Camera className="w-4 h-4" />
            <span>Upload photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          {imagePreview && (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* Submit */}
      <div className="pt-4 border-t border-slate-200">
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!selectedPosition || !severity || !waterDepth || !trend || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Flood Report'}
        </Button>
        <p className="text-xs text-slate-400 text-center mt-2">
          Your report will be immediately visible on the community map.
        </p>
      </div>
    </form>
  );
}
