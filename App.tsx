
import React, { useState, useEffect } from 'react';
import { EmployeeProfile, FormType, AnyRequest } from './types';
import { Layout } from './components/Layout';
import { ProfileSetup } from './components/ProfileSetup';
import { FormSelection } from './components/FormSelection';
import { LeaveForm } from './components/forms/LeaveForm';
import { BusinessTripForm } from './components/forms/BusinessTripForm';
import { OvertimeForm } from './components/forms/OvertimeForm';
import { AttendanceForm } from './components/forms/AttendanceForm';
import { LetterForm } from './components/forms/LetterForm';
import { HistoryDashboard } from './components/HistoryDashboard';

const App: React.FC = () => {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [currentPage, setCurrentPage] = useState<'profile' | 'selection' | 'form' | 'history'>('profile');
  const [activeFormType, setActiveFormType] = useState<FormType | null>(null);
  const [requests, setRequests] = useState<AnyRequest[]>([]);
  const [editingRequest, setEditingRequest] = useState<AnyRequest | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('emp_profile');
    const savedRequests = localStorage.getItem('emp_requests');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setCurrentPage('selection');
    }
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    }
  }, []);

  const handleProfileSubmit = (data: EmployeeProfile) => {
    setProfile(data);
    localStorage.setItem('emp_profile', JSON.stringify(data));
    setCurrentPage('selection');
  };

  const handleFormSelect = (type: FormType) => {
    setActiveFormType(type);
    setCurrentPage('form');
  };

  const addRequest = (req: AnyRequest) => {
    const updated = [req, ...requests];
    setRequests(updated);
    localStorage.setItem('emp_requests', JSON.stringify(updated));
    setCurrentPage('history');
  };

  const updateRequest = (req: AnyRequest) => {
    const updated = requests.map(r => r.id === req.id ? req : r);
    setRequests(updated);
    localStorage.setItem('emp_requests', JSON.stringify(updated));
    setEditingRequest(null);
    setCurrentPage('history');
  };

  const deleteRequest = (id: string) => {
    const updated = requests.filter(r => r.id !== id);
    setRequests(updated);
    localStorage.setItem('emp_requests', JSON.stringify(updated));
  };

  const handleEditRequest = (req: AnyRequest) => {
    setEditingRequest(req);
    setActiveFormType(req.type);
    setCurrentPage('form');
  };

  const logout = () => {
    localStorage.removeItem('emp_profile');
    setProfile(null);
    setCurrentPage('profile');
  };

  const renderForm = () => {
    const props = {
      onSubmit: editingRequest ? updateRequest : addRequest,
      onCancel: () => {
        setEditingRequest(null);
        setCurrentPage('selection');
      },
      initialData: editingRequest
    };

    switch (activeFormType) {
      case 'Leave Management': 
        return <LeaveForm {...props} profile={profile} requests={requests} />;
      case 'Official Business Trip': 
        return <BusinessTripForm {...props} />;
      case 'Overtime': 
        return <OvertimeForm {...props} />;
      case 'Attendance Regularization': 
        return <AttendanceForm {...props} />;
      case 'Letter Request': 
        return <LetterForm {...props} />;
      default: 
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {currentPage === 'profile' ? (
        <div className="flex items-center justify-center min-h-screen p-4 bg-primary-500">
           <ProfileSetup onSubmit={handleProfileSubmit} />
        </div>
      ) : (
        <Layout profile={profile} onLogout={logout} onGoHome={() => setCurrentPage('selection')} onGoHistory={() => setCurrentPage('history')}>
          <div className="max-w-5xl mx-auto py-8 px-4">
            {currentPage === 'selection' && <FormSelection onSelect={handleFormSelect} />}
            {currentPage === 'form' && renderForm()}
            {currentPage === 'history' && (
              <HistoryDashboard 
                requests={requests} 
                onEdit={handleEditRequest} 
                onDelete={deleteRequest} 
              />
            )}
          </div>
        </Layout>
      )}
    </div>
  );
};

export default App;
