
import React from 'react';
import { AnyRequest } from '../types';
import { formatDate, isEditable } from '../utils';
import { Edit2, Trash2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface HistoryDashboardProps {
  requests: AnyRequest[];
  onEdit: (req: AnyRequest) => void;
  onDelete: (id: string) => void;
}

const STATUS_STYLING = {
  Pending: { icon: <Clock size={16} />, classes: 'bg-amber-50 text-amber-700 border-amber-100' },
  Approved: { icon: <CheckCircle size={16} />, classes: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  Rejected: { icon: <XCircle size={16} />, classes: 'bg-rose-50 text-rose-700 border-rose-100' }
};

export const HistoryDashboard: React.FC<HistoryDashboardProps> = ({ requests, onEdit, onDelete }) => {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-tertiary rounded-3xl">
        <div className="p-4 bg-tertiary rounded-full mb-4">
          <AlertCircle size={40} className="text-primary-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">No requests yet</h3>
        <p className="text-slate-500">Your application history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-slate-900">Request History</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {requests.map((req) => {
          const style = STATUS_STYLING[req.status];
          const canEdit = isEditable(req.createdAt, req.status) || (req.type === 'Official Business Trip' && req.status === 'Pending');

          return (
            <div key={req.id} className="bg-white border border-tertiary rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-primary-500 uppercase tracking-wider">{req.type}</span>
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.classes}`}>
                    {style.icon}
                    {req.status}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  {req.type === 'Leave Management' && `${req.leaveType} (${req.days} days)`}
                  {req.type === 'Official Business Trip' && `Trip to ${req.destination}`}
                  {req.type === 'Overtime' && `${req.hours} Hours OT - ${req.dayType}`}
                  {req.type === 'Attendance Regularization' && `${req.category}`}
                  {req.type === 'Letter Request' && `Request for ${req.letterType}`}
                </h4>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-2">
                  <p>Submitted: {formatDate(req.createdAt)}</p>
                  {req.remarks && <p className="italic">"{req.remarks}"</p>}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-tertiary">
                {canEdit ? (
                  <>
                    <button
                      onClick={() => onEdit(req)}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-slate-600 hover:bg-tertiary hover:text-primary-600 rounded-lg transition-all text-sm font-medium"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this request?')) onDelete(req.id);
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all text-sm font-medium"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-slate-400 bg-tertiary px-3 py-1.5 rounded-lg">Immutable</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
