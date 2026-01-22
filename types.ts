
// Shared type definitions for the EmployeeCare application

export type EmploymentType = 'Regular' | 'Probationary' | 'Part-time';

export type FormType = 
  | 'Leave Management'
  | 'Official Business Trip'
  | 'Overtime'
  | 'Attendance Regularization'
  | 'Letter Request';

export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface EmployeeProfile {
  name: string;
  employmentType: EmploymentType;
  department: string;
  team: string;
  position: string;
  gender: 'Male' | 'Female';
  civilStatus: 'Single' | 'Married' | 'Widowed' | 'Separated' | 'Annulled';
  soloParent: 'Yes' | 'No';
  username: string;
  password?: string;
}

export interface BaseRequest {
  id: string;
  type: FormType;
  status: RequestStatus;
  createdAt: string;
  remarks?: string;
}

export interface LeaveRequest extends BaseRequest {
  type: 'Leave Management';
  startDate: string;
  endDate: string;
  days: number;
  leaveType: 'Sick Leave' | 'Vacation Leave' | 'Maternity Leave' | 'Paternity Leave' | 'Bereavement Leave' | 'Leave Without Pay' | 'Solo Parent Leave';
}

export interface BusinessTripRequest extends BaseRequest {
  type: 'Official Business Trip';
  destination: string;
  departureDate: string;
  returnDate: string;
  purpose: string;
}

export interface OvertimeRequest extends BaseRequest {
  type: 'Overtime';
  date: string;
  timeIn: string;
  timeOut: string;
  hours: number;
  dayType: 'Regular Workday' | 'Rest Day' | 'Special Non-Working Holiday' | 'Regular Holiday';
}

export interface AttendanceRequest extends BaseRequest {
  type: 'Attendance Regularization';
  category: 'Branch Visit' | 'Business Meeting' | 'Field Work' | 'School Visit' | 'Seminar' | 'Training' | 'Technical Assistance' | 'Work from Home';
  fromDate: string;
  endDate: string;
  timeIn: string;
  timeOut: string;
}

export interface LetterRequest extends BaseRequest {
  type: 'Letter Request';
  letterType: 'BIR 2316' | 'Certificate of Employment (COE)';
  templateName?: string;
  dateNeeded: string;
}

export type AnyRequest = 
  | LeaveRequest 
  | BusinessTripRequest 
  | OvertimeRequest 
  | AttendanceRequest 
  | LetterRequest;
