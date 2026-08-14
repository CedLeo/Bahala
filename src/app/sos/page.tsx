'use client';

import { useFloodStore } from '@/lib/store';
import SOSConfirmation from '@/components/sos/SOSConfirmation';
import SOSActivePanel from '@/components/sos/SOSActivePanel';
import { AlertTriangle, Phone } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';

export default function SOSPage() {
  const { sosAlert, activateSOS, cancelSOS } = useFloodStore();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  const handleConfirmSOS = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          activateSOS(position.coords.latitude, position.coords.longitude);
          setShowConfirmation(false);
        },
        () => {
          activateSOS(14.5995, 120.9842);
          setShowConfirmation(false);
        }
      );
    } else {
      activateSOS(14.5995, 120.9842);
      setShowConfirmation(false);
    }
  }, [activateSOS]);

  // If SOS is active show active state
  if (sosAlert && sosAlert.status === 'active') {
    return (
      <div className="max-w-md mx-auto w-full px-4 py-8">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <span className="w-4 h-4 bg-red-600 rounded-full animate-pulse" />
          </div>
          <h1 className="text-xl font-bold text-red-700 mb-2">SOS Active</h1>
          <p className="text-sm text-red-600">Your location has been shared with the community.</p>
        </div>

        <SOSActivePanel sosAlert={sosAlert} onCancel={cancelSOS} />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Emergency SOS</h1>
        <p className="text-slate-500 mt-2 text-sm">
          If you are in immediate danger due to flooding, activate SOS to share your location and find nearby help.
        </p>
      </div>

      {/* Activate SOS */}
      <Card className="mb-6 text-center">
        <button
          onClick={() => setShowConfirmation(true)}
          className="w-32 h-32 mx-auto bg-red-600 hover:bg-red-700 rounded-full shadow-xl flex items-center justify-center text-white font-black text-2xl transition-all active:scale-95"
        >
          SOS
        </button>
        <p className="text-xs text-slate-400 mt-4">Tap to activate emergency SOS</p>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Phone className="w-5 h-5 text-slate-600" />
          <h2 className="text-sm font-semibold text-slate-900">Emergency Contacts</h2>
        </div>
        <div className="space-y-2">
          {[
            { label: 'National Emergency', number: '911' },
            { label: 'Philippine Red Cross', number: '143' },
            { label: 'Fire Department', number: '160' },
            { label: 'NDRRMC', number: '(02) 8911-5061' },
          ].map((contact) => (
            <div key={contact.number} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <span className="text-sm text-slate-600">{contact.label}</span>
              <a
                href={`tel:${contact.number}`}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                {contact.number}
              </a>
            </div>
          ))}
        </div>
      </Card>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 text-center mt-6 px-4">
        This is a community alert system. It does not automatically contact emergency services.
        Call 911 for immediate assistance.
      </p>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <SOSConfirmation
          onConfirm={handleConfirmSOS}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
}
