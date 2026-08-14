'use client';

import { AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SOSConfirmation({ onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-2">Emergency SOS</h2>
        <p className="text-slate-600 text-sm mb-6">
          Are you in immediate danger? This will share your location with the community and show nearby evacuation centers.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
          <p className="text-xs text-amber-700">
            This is a community alert system. It does NOT automatically contact emergency services.
            If you need immediate help, call <strong>911</strong>.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} className="flex-1">
            CONFIRM SOS
          </Button>
        </div>
      </div>
    </div>
  );
}
