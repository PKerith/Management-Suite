
import React from 'react';
import { FormType } from '../types';
import { FORM_TYPES } from '../constants';
import { Calendar, Briefcase, Clock, UserCheck, FileText, ChevronRight } from 'lucide-react';

interface FormSelectionProps {
  onSelect: (type: FormType) => void;
}

const ICONS: Record<string, React.ReactNode> = {
  'Leave Management': <Calendar className="text-primary-500" />,
  'Official Business Trip': <Briefcase className="text-primary-500" />,
  'Overtime': <Clock className="text-primary-500" />,
  'Attendance Regularization': <UserCheck className="text-primary-500" />,
  'Letter Request': <FileText className="text-primary-500" />
};

const DESCRIPTIONS: Record<string, string> = {
  'Leave Management': 'Apply for vacation, sick, or other types of time off.',
  'Official Business Trip': 'Log travel details for authorized business activities.',
  'Overtime': 'Record extra working hours for regularization and payment.',
  'Attendance Regularization': 'Correct missing logs or work from home attendance.',
  'Letter Request': 'Request BIR 2316 or Employment Certificates (COE).'
};

export const FormSelection: React.FC<FormSelectionProps> = ({ onSelect }) => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900">What do you need help with?</h2>
        <p className="text-slate-500 mt-2">Choose a form below to submit a new request.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FORM_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className="group p-6 bg-white border border-tertiary rounded-2xl shadow-sm hover:shadow-md hover:border-primary-300 transition-all text-left flex items-start gap-4"
          >
            <div className="p-3 bg-tertiary rounded-xl group-hover:bg-primary-50 transition-colors">
              {ICONS[type]}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-slate-800 flex items-center justify-between">
                {type}
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 transform group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                {DESCRIPTIONS[type]}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
