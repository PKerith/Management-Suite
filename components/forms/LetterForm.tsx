
import React, { useState } from 'react';
import { LetterRequest } from '../../types';
import { LETTER_TYPES, COE_TEMPLATES } from '../../constants';
import { FileText, ChevronLeft, Send, AlertCircle } from 'lucide-react';

interface LetterFormProps {
  onSubmit: (data: LetterRequest) => void;
  onCancel: () => void;
  initialData?: LetterRequest | null;
}

export const LetterForm: React.FC<LetterFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<Partial<LetterRequest>>({
    letterType: 'Certificate of Employment (COE)',
    templateName: '',
    dateNeeded: '',
    remarks: '',
    ...initialData
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { letterType, dateNeeded, templateName } = formData;

    if (!letterType || !dateNeeded) {
      setError("Letter type and date needed are required.");
      return;
    }

    if (letterType === 'Certificate of Employment (COE)' && !templateName) {
      setError("Please select a template name for your COE request.");
      return;
    }

    // Date validation: Date Needed must not be earlier than current date
    const needed = new Date(dateNeeded);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (needed < today) {
      setError("The 'Date Needed' cannot be in the past. Please select today or a future date.");
      return;
    }

    const request: LetterRequest = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      type: 'Letter Request',
      status: 'Pending',
      createdAt: initialData?.createdAt || new Date().toISOString(),
      letterType: letterType as any,
      templateName: templateName,
      dateNeeded: dateNeeded!,
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
        <h2 className="text-xl font-bold tracking-tight">Letter Request</h2>
        <FileText size={24} />
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-700 animate-in zoom-in-95 duration-200">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <p className="text-sm font-semibold leading-relaxed">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-slate-700 ml-1 mb-3">Letter Type *</label>
          <div className="flex flex-col sm:flex-row gap-4">
            {LETTER_TYPES.map(type => {
              const isSelected = formData.letterType === type;
              return (
                <label 
                  key={type} 
                  className={`flex-1 flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-500' 
                      : 'border-tertiary bg-white hover:bg-tertiary/50'
                  }`}
                >
                  <span className={`text-sm font-bold ${isSelected ? 'text-primary-800' : 'text-slate-700'}`}>
                    {type}
                  </span>
                  <input
                    type="radio"
                    name="letterType"
                    className="hidden"
                    checked={isSelected}
                    onChange={() => setFormData({ ...formData, letterType: type as any, templateName: '' })}
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

        {formData.letterType === 'Certificate of Employment (COE)' && (
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Template Name *</label>
            <select
              required
              className={inputClasses}
              value={formData.templateName}
              onChange={e => setFormData({ ...formData, templateName: e.target.value })}
            >
              <option value="">Select a template...</option>
              {COE_TEMPLATES.map(tmpl => <option key={tmpl} value={tmpl}>{tmpl}</option>)}
            </select>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700 ml-1">Date Needed *</label>
          <input
            type="date"
            required
            className={inputClasses}
            value={formData.dateNeeded}
            onChange={e => setFormData({ ...formData, dateNeeded: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700 ml-1">Remarks (Optional)</label>
          <textarea
            className={`${inputClasses} min-h-[100px]`}
            placeholder="Specify any additional requirements or urgent details..."
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
            {initialData ? 'Update Request' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};
