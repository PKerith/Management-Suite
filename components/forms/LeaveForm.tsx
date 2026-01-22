
import React, { useState, useMemo } from 'react';
import { LeaveRequest, EmployeeProfile, AnyRequest } from '../../types';
import { calculateDaysBetween } from '../../utils';
import { Calendar, ChevronLeft, Send, AlertCircle, Info } from 'lucide-react';

interface LeaveFormProps {
  onSubmit: (data: LeaveRequest) => void;
  onCancel: () => void;
  initialData?: LeaveRequest | null;
  profile: EmployeeProfile | null;
  requests: AnyRequest[];
}

const INITIAL_CREDITS = {
  'Sick Leave': 15,
  'Vacation Leave': 15,
  'Solo Parent Leave': 7
};

export const LeaveForm: React.FC<LeaveFormProps> = ({ onSubmit, onCancel, initialData, profile, requests }) => {
  const [formData, setFormData] = useState<Partial<LeaveRequest>>({
    startDate: '',
    endDate: '',
    leaveType: 'Vacation Leave',
    remarks: '',
    ...initialData
  });

  const [error, setError] = useState<string | null>(null);

  const days = useMemo(() => calculateDaysBetween(formData.startDate || '', formData.endDate || ''), [formData.startDate, formData.endDate]);

  // Calculate current balances by deducting used days from initial credits
  // Only applies to Sick Leave, Vacation Leave, and Solo Parent Leave
  const balances = useMemo(() => {
    const used = {
      'Sick Leave': 0,
      'Vacation Leave': 0,
      'Solo Parent Leave': 0
    };

    requests.forEach(req => {
      // Deduct only from Leave Management requests that are Pending or Approved
      // Skip the record currently being edited to avoid self-deduction
      if (req.type === 'Leave Management' && req.id !== initialData?.id && (req.status === 'Pending' || req.status === 'Approved')) {
        const type = req.leaveType as keyof typeof used;
        if (used.hasOwnProperty(type)) {
          used[type] += req.days;
        }
      }
    });

    return {
      'Sick Leave': Math.max(0, INITIAL_CREDITS['Sick Leave'] - used['Sick Leave']),
      'Vacation Leave': Math.max(0, INITIAL_CREDITS['Vacation Leave'] - used['Vacation Leave']),
      'Solo Parent Leave': Math.max(0, INITIAL_CREDITS['Solo Parent Leave'] - used['Solo Parent Leave'])
    };
  }, [requests, initialData]);

  // Handle leave type visibility based on profile attributes
  const availableLeaveTypes = useMemo(() => {
    const types = [
      { label: 'Sick Leave', value: 'Sick Leave' },
      { label: 'Vacation Leave', value: 'Vacation Leave' },
      { label: 'Leave Without Pay', value: 'Leave Without Pay' }
    ];

    if (profile?.gender === 'Male') {
      types.push({ label: 'Paternity Leave', value: 'Paternity Leave' });
    }
    if (profile?.gender === 'Female') {
      types.push({ label: 'Maternity Leave', value: 'Maternity Leave' });
    }
    if (profile?.soloParent === 'Yes') {
      types.push({ label: 'Solo Parent Leave', value: 'Solo Parent Leave' });
    }

    return types;
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { startDate, endDate, leaveType } = formData;

    if (!startDate || !endDate || !leaveType) {
      setError("Required fields are missing. Please provide dates and leave type.");
      return;
    }

    // 1. Precise Date Validation
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      setError("Submission failed: The End Date cannot be earlier than the Start Date.");
      return;
    }

    if (start > end) {
      setError("Submission failed: The Start Date cannot be after the End Date.");
      return;
    }

    // 2. Leave Credit Balance Validation
    const lType = leaveType as keyof typeof balances;
    if (balances.hasOwnProperty(lType)) {
      if (days > balances[lType]) {
        setError(`Insufficient credits. You only have ${balances[lType]} credits remaining for ${String(lType)}.`);
        return;
      }
    }

    const request: LeaveRequest = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      type: 'Leave Management',
      status: 'Pending',
      createdAt: initialData?.createdAt || new Date().toISOString(),
      startDate: startDate!,
      endDate: endDate!,
      days,
      leaveType: leaveType as any,
      remarks: formData.remarks,
    };
    
    onSubmit(request);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-tertiary max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-primary-500 p-6 flex items-center justify-between text-white">
        <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors" type="button">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold tracking-tight">Leave Management</h2>
        <Calendar size={24} />
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-700 animate-in zoom-in-95 duration-200">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <p className="text-sm font-semibold leading-relaxed">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Start Date *</label>
            <input
              type="date"
              required
              className="w-full px-4 py-3.5 bg-tertiary border border-tertiary rounded-xl focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all font-medium text-slate-800"
              value={formData.startDate}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">End Date *</label>
            <input
              type="date"
              required
              className={`w-full px-4 py-3.5 bg-tertiary border rounded-xl focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all font-medium text-slate-800 ${
                formData.startDate && formData.endDate && new Date(formData.endDate!) < new Date(formData.startDate!) ? 'border-rose-400' : 'border-tertiary'
              }`}
              value={formData.endDate}
              onChange={e => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
        </div>

        {days > 0 && (
          <div className="bg-primary-50 p-4 rounded-xl flex items-center justify-between border border-primary-100 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Info size={18} className="text-primary-500" />
              <span className="text-primary-700 font-semibold">Leave Duration:</span>
            </div>
            <span className="text-primary-800 font-extrabold text-lg">{days} Day{days !== 1 ? 's' : ''}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-slate-700 ml-1 mb-3">Type of Leave *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableLeaveTypes.map(type => {
              const balanceKey = type.value as keyof typeof balances;
              const hasBalance = balances.hasOwnProperty(balanceKey);
              const balanceValue = hasBalance ? balances[balanceKey] : null;
              const isSelected = formData.leaveType === type.value;

              return (
                <label 
                  key={type.value} 
                  className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-500' 
                      : 'border-tertiary bg-white hover:bg-tertiary/50'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold ${isSelected ? 'text-primary-800' : 'text-slate-700'}`}>
                      {type.label}
                    </span>
                    {hasBalance && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-primary-600' : 'text-slate-400'}`}>
                        Remaining: {balanceValue}
                      </span>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="leaveType"
                    className="hidden"
                    checked={isSelected}
                    onChange={() => setFormData({ ...formData, leaveType: type.value as any })}
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'border-primary-500 bg-primary-500' : 'border-slate-300'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 ml-1 mb-2">Remarks (Optional)</label>
          <textarea
            className="w-full px-4 py-3.5 bg-tertiary border border-tertiary rounded-xl focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all min-h-[100px] font-medium text-slate-800"
            placeholder="Reason for leave or specific hand-over notes..."
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
            {initialData ? 'Update Request' : 'Submit Leave'}
          </button>
        </div>
      </form>
    </div>
  );
};
