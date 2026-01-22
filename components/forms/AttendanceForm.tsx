
import React, { useState, useMemo } from 'react';
import { AttendanceRequest, EmployeeProfile } from '../../types';
import { ATTENDANCE_CATEGORIES } from '../../constants';
import { UserCheck, ChevronLeft, Send, AlertCircle, Clock } from 'lucide-react';

interface AttendanceFormProps {
  onSubmit: (data: AttendanceRequest) => void;
  onCancel: () => void;
  initialData?: AttendanceRequest | null;
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({ onSubmit, onCancel, initialData }) => {
  // Fetch profile from localStorage to adhere to the "no modification of other modules" rule
  const [profile] = useState<EmployeeProfile | null>(() => {
    const saved = localStorage.getItem('emp_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [formData, setFormData] = useState<Partial<AttendanceRequest>>({
    category: 'Work from Home',
    fromDate: '',
    endDate: '',
    timeIn: '',
    timeOut: '',
    remarks: '',
    ...initialData
  });

  const [error, setError] = useState<string | null>(null);

  const isExemptPosition = useMemo(() => {
    if (!profile) return false;
    const exemptTitles = ['Executive', 'Manager', 'Supervisor', 'Team Leader', 'Assistant Team Leader'];
    return exemptTitles.some(title => profile.position.toLowerCase().includes(title.toLowerCase()));
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { fromDate, endDate, timeIn, timeOut, category, remarks } = formData;

    if (!fromDate || !endDate || !timeIn || !timeOut) {
      setError("Please fill in all required date and time fields (*).");
      return;
    }

    // 1. Date Validation: Prevent more than 7 days prior
    const selectedFromDate = new Date(fromDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const timeDiff = today.getTime() - selectedFromDate.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);

    if (dayDiff > 7) {
      setError("Attendance entries cannot be submitted for dates more than 7 days in the past.");
      return;
    }

    // 2. Date Order Validation
    const start = new Date(fromDate);
    const end = new Date(endDate);
    if (start > end) {
      setError("The 'From Date' must not be later than the 'End Date'.");
      return;
    }

    // 3. Time In Validation for Work From Home
    let processedRemarks = remarks || '';
    if (category === 'Work from Home') {
      const [hours, minutes] = timeIn.split(':').map(Number);
      const timeInValue = hours * 60 + minutes;
      const lateThreshold = 9 * 60 + 30; // 9:30 AM

      if (timeInValue > lateThreshold && !isExemptPosition) {
        // User is considered late
        if (!processedRemarks.includes('[LATE]')) {
          processedRemarks = `[LATE] ${processedRemarks}`.trim();
        }
      }
    }

    const request: AttendanceRequest = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      type: 'Attendance Regularization',
      status: 'Pending',
      createdAt: initialData?.createdAt || new Date().toISOString(),
      category: category as any,
      fromDate: fromDate!,
      endDate: endDate!,
      timeIn: timeIn!,
      timeOut: timeOut!,
      remarks: processedRemarks,
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
        <h2 className="text-xl font-bold tracking-tight">Attendance Regularization</h2>
        <UserCheck size={24} />
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-700 animate-in zoom-in-95 duration-200">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <p className="text-sm font-semibold leading-relaxed">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700 ml-1">Regularization Category *</label>
          <select
            className={inputClasses}
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value as any })}
          >
            {ATTENDANCE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">From Date *</label>
            <input
              type="date"
              required
              className={inputClasses}
              value={formData.fromDate}
              onChange={e => setFormData({ ...formData, fromDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">End Date *</label>
            <input
              type="date"
              required
              className={`${inputClasses} ${
                formData.fromDate && formData.endDate && new Date(formData.endDate!) < new Date(formData.fromDate!) ? 'border-rose-400' : 'border-tertiary'
              }`}
              value={formData.endDate}
              onChange={e => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Time In *</label>
            <div className="relative group">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
              <input
                type="time"
                required
                className={`${inputClasses} pl-12`}
                value={formData.timeIn}
                onChange={e => setFormData({ ...formData, timeIn: e.target.value })}
              />
            </div>
            {formData.category === 'Work from Home' && formData.timeIn && !isExemptPosition && (
               <p className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${
                 (() => {
                    const [h, m] = formData.timeIn.split(':').map(Number);
                    return (h * 60 + m) > (9 * 60 + 30) ? 'text-rose-500' : 'text-emerald-500';
                 })()
               }`}>
                 {(() => {
                    const [h, m] = formData.timeIn.split(':').map(Number);
                    return (h * 60 + m) > (9 * 60 + 30) ? 'Status: Late' : 'Status: On Time';
                 })()}
               </p>
            )}
            {formData.category === 'Work from Home' && isExemptPosition && (
              <p className="text-[10px] font-bold uppercase tracking-wider ml-1 text-primary-400">Exempt from time constraint</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Time Out *</label>
            <div className="relative group">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
              <input
                type="time"
                required
                className={`${inputClasses} pl-12`}
                value={formData.timeOut}
                onChange={e => setFormData({ ...formData, timeOut: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700 ml-1">Remarks (Optional)</label>
          <textarea
            className={`${inputClasses} min-h-[100px]`}
            placeholder="Explain the reason for regularization..."
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
            {initialData ? 'Update Records' : 'Submit Regularization'}
          </button>
        </div>
      </form>
    </div>
  );
};
