
import React, { useState } from 'react';
import { OvertimeRequest } from '../../types';
import { DAY_TYPES } from '../../constants';
import { calculateHoursBetween } from '../../utils';
import { Clock, ChevronLeft, Send, AlertCircle } from 'lucide-react';

interface OvertimeFormProps {
  onSubmit: (data: OvertimeRequest) => void;
  onCancel: () => void;
  initialData?: OvertimeRequest | null;
}

export const OvertimeForm: React.FC<OvertimeFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<Partial<OvertimeRequest>>({
    date: '',
    timeIn: '',
    timeOut: '',
    dayType: 'Regular Workday',
    remarks: '',
    ...initialData
  });

  const [error, setError] = useState<string | null>(null);

  const hours = calculateHoursBetween(formData.timeIn || '', formData.timeOut || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { date, timeIn, timeOut, remarks } = formData;

    // Basic required fields check
    if (!date || !timeIn || !timeOut) {
      setError("Please fill in all required time and date fields (*).");
      return;
    }

    // 1. Remarks field requirement
    if (!remarks || remarks.trim() === '') {
      setError("The Remarks field is required. Please provide a reason for the overtime work.");
      return;
    }

    // 2. Date restriction: cannot be more than 7 days prior
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const timeDiff = today.getTime() - selectedDate.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);

    if (dayDiff > 7) {
      setError("Overtime entries cannot be submitted for dates more than 7 days in the past.");
      return;
    }

    // Hours validation
    if (hours <= 0) {
      setError("Total OT Hours must be greater than 0. Please check your Time In and Time Out.");
      return;
    }

    const request: OvertimeRequest = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      type: 'Overtime',
      status: 'Pending',
      createdAt: initialData?.createdAt || new Date().toISOString(),
      date: date!,
      timeIn: timeIn!,
      timeOut: timeOut!,
      hours,
      dayType: formData.dayType as any,
      remarks: remarks.trim(),
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
        <h2 className="text-xl font-bold tracking-tight">Overtime Form</h2>
        <Clock size={24} />
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-700 animate-in zoom-in-95 duration-200">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <p className="text-sm font-semibold leading-relaxed">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700 ml-1">Date of Overtime *</label>
          <input
            type="date"
            required
            className={inputClasses}
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Time In *</label>
            <input
              type="time"
              required
              className={inputClasses}
              value={formData.timeIn}
              onChange={e => setFormData({ ...formData, timeIn: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Time Out *</label>
            <input
              type="time"
              required
              className={inputClasses}
              value={formData.timeOut}
              onChange={e => setFormData({ ...formData, timeOut: e.target.value })}
            />
          </div>
        </div>

        {hours > 0 && (
          <div className="bg-primary-50 p-4 rounded-xl flex items-center justify-between border border-primary-100 animate-in slide-in-from-top-2">
            <span className="text-primary-700 font-semibold">Calculated Duration:</span>
            <span className="text-primary-800 font-extrabold text-lg">{hours} Hrs</span>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700 ml-1">Type of Day *</label>
          <select
            className={inputClasses}
            value={formData.dayType}
            onChange={e => setFormData({ ...formData, dayType: e.target.value as any })}
          >
            {DAY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700 ml-1">Remarks (Reason for OT) *</label>
          <textarea
            required
            className={`${inputClasses} min-h-[100px]`}
            placeholder="Explain why the overtime was necessary..."
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
            {initialData ? 'Update OT' : 'Submit OT'}
          </button>
        </div>
      </form>
    </div>
  );
};
