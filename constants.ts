
import { FormType, EmploymentType } from './types';

export const EMPLOYMENT_TYPES: EmploymentType[] = ['Regular', 'Probationary', 'Part-time'];

export const FORM_TYPES: FormType[] = [
  'Leave Management',
  'Official Business Trip',
  'Overtime',
  'Attendance Regularization',
  'Letter Request'
];

export const LEAVE_TYPES = [
  'Sick Leave',
  'Vacation Leave',
  'Maternity Leave',
  'Paternity Leave',
  'Bereavement Leave',
  'Leave Without Pay'
];

export const DAY_TYPES = [
  'Regular Workday',
  'Rest Day',
  'Special Non-Working Holiday',
  'Regular Holiday'
];

export const ATTENDANCE_CATEGORIES = [
  'Branch Visit',
  'Business Meeting',
  'Field Work',
  'School Visit',
  'Seminar',
  'Training',
  'Technical Assistance',
  'Work from Home'
];

export const LETTER_TYPES = ['BIR 2316', 'Certificate of Employment (COE)'];

export const COE_TEMPLATES = [
  'Pag-Ibig Multipurpose Loan',
  'Bank Loan/Housing',
  'Credit Card Application',
  'Travel Order',
  'Employee Reference (with or without compensation)',
  'Visa Application'
];
