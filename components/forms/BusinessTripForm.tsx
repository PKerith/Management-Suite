
import React, { useState } from 'react';
import { BusinessTripRequest } from '../../types';
import { Briefcase, ChevronLeft, Send, MapPin, AlertCircle } from 'lucide-react';

interface BusinessTripFormProps {
  onSubmit: (data: BusinessTripRequest) => void;
  onCancel: () => void;
  initialData?: BusinessTripRequest | null;
}

export const BusinessTripForm: React.FC<BusinessTripFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<Partial<BusinessTripRequest>>({
    destination: '',
    departureDate: '',
    returnDate: '',
    purpose: '',
    remarks: '',
    ...initialData
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { destination, departureDate, returnDate, purpose } = formData;

    if (!destination || !departureDate || !returnDate || !purpose) {
      setError("Please fill in all required fields marked with an asterisk (*).");
      return;
    }

    // 1. Date Validation
    const depDate = new Date(departureDate);
    const retDate = new Date(returnDate);

    if (depDate > retDate) {
      setError("Departure Date must not be later than the Return Date.");
      return;
    }

    if (retDate < depDate) {
      setError("Return Date must not be earlier than the Departure Date.");
      return;
    }

    // 2. Purpose character limit validation
    if (purpose.length > 300) {
      setError("Purpose must not exceed 300 characters.");
      return;
    }

    const request: BusinessTripRequest = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      type: 'Official Business Trip',
      status: 'Pending',
      createdAt: initialData?.createdAt || new Date().toISOString(),
      destination: destination!,
      departureDate: departureDate!,
      returnDate: returnDate!,
      purpose: purpose!,
      remarks: formData.remarks,
    };
    onSubmit(request);
  };

  const inputClasses = "w-full px-4 py-3.5 bg-tertiary border border-tertiary rounded-xl focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all font-medium text-slate-800";

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-tertiary max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-primary-500 p-6 flex items-center justify-between text-white">
        <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors" type="button">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold tracking-tight">Official Business Trip</h2>
        <Briefcase size={24} />
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-700 animate-in zoom-in-95 duration-200">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <p className="text-sm font-semibold leading-relaxed">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700 ml-1">Destination *</label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input
              type="text"
              required
              className={`${inputClasses} pl-12`}
              placeholder="e.g. Makati Branch Office"
              value={formData.destination}
              onChange={e => setFormData({ ...formData, destination: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Departure Date *</label>
            <input
              type="date"
              required
              className={inputClasses}
              value={formData.departureDate}
              onChange={e => setFormData({ ...formData, departureDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Return Date *</label>
            <input
              type="date"
              required
              className={`${inputClasses} ${
                formData.departureDate && formData.returnDate && new Date(formData.returnDate!) < new Date(formData.departureDate!) ? 'border-rose-400' : 'border-tertiary'
              }`}
              value={formData.returnDate}
              onChange={e => setFormData({ ...formData, returnDate: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="block text-sm font-bold text-slate-700">Purpose *</label>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              (formData.purpose?.length || 0) > 300 ? 'text-rose-500' : 'text-slate-400'
            }`}>
              {formData.purpose?.length || 0} / 300
            </span>
          </div>
          <textarea
            required
            maxLength={305}
            className={`${inputClasses} min-h-[120px] resize-none`}
            placeholder="Details of the business trip..."
            value={formData.purpose}
            onChange={e => setFormData({ ...formData, purpose: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700 ml-1">Remarks (Optional)</label>
          <textarea
            className={`${inputClasses} min-h-[80px]`}
            placeholder="Any additional notes or specific requests..."
            value={formData.remarks}
            onChange={e => setFormData({ ...formData, remarks: e.target.value })}
          />
        </div>

        <div className="pt-4 flex gap-4">
          <button 
            type="button" 
            onClick={onCancel} 
            className="flex-1 px-6 py-4 border border-tertiary text-slate-600 font-bold rounded-xl hover:bg-tertiary transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-100 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
          >
            <Send size={18} /> 
            {initialData ? 'Update Trip' : 'Log Trip'}
          </button>
        </div>
      </form>
    </div>
  );
};
