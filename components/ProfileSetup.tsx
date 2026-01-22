
import React, { useState, useEffect } from 'react';
import { EmployeeProfile, EmploymentType } from '../types';
import { EMPLOYMENT_TYPES } from '../constants';
import { 
  UserCircle, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Lock,
  User,
  Briefcase,
  Layers,
  Users,
  CheckCircle2,
  ChevronRight,
  Heart,
  Baby
} from 'lucide-react';

interface ProfileSetupProps {
  onSubmit: (data: EmployeeProfile) => void;
}

const PREDEFINED_DEPARTMENTS = ['Engineering', 'Marketing', 'Human Resources', 'Finance', 'Operations', 'Product Management', 'Sales', 'Customer Support'];
const PREDEFINED_TEAMS = ['Frontend', 'Backend', 'DevOps', 'Mobile', 'UI/UX Design', 'QA Testing', 'Data Science', 'Growth', 'Strategic Planning'];
const PREDEFINED_POSITIONS = ['Associate', 'Specialist', 'Lead', 'Manager', 'Senior Manager', 'Director', 'VP', 'Individual Contributor', 'Contractor'];

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ onSubmit }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sign-up form data
  const [signupData, setSignupData] = useState({
    name: '',
    employmentType: 'Regular' as EmploymentType,
    department: '',
    team: '',
    position: '',
    gender: 'Male' as 'Male' | 'Female',
    civilStatus: 'Single' as any,
    soloParent: 'No' as any,
    username: '',
    password: '',
    confirmPassword: ''
  });

  // Login form data
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Forgot Password data
  const [forgotPasswordData, setForgotPasswordData] = useState({
    username: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // Reset states when switching modes
  useEffect(() => {
    setError(null);
    setSuccessMsg(null);
    setShowPassword(false);
  }, [mode]);

  const getUsersRegistry = (): EmployeeProfile[] => {
    const registry = localStorage.getItem('emp_users_registry');
    return registry ? JSON.parse(registry) : [];
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { 
      name, department, team, position, username, password, confirmPassword 
    } = signupData;

    if (!name || !department || !team || !position || !username || !password || !confirmPassword) {
      setError("Please fill out all required fields marked with an asterisk (*).");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please ensure both password fields are identical.");
      return;
    }

    const registry = getUsersRegistry();
    if (registry.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      setError("This username is already taken. Please choose a unique username.");
      return;
    }

    const newUser: EmployeeProfile = {
      ...signupData,
      password 
    };

    const updatedRegistry = [...registry, newUser];
    localStorage.setItem('emp_users_registry', JSON.stringify(updatedRegistry));

    setSuccessMsg("Account successfully created! Redirecting to login...");
    
    setTimeout(() => {
      setMode('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { username, password } = loginData;
    if (!username || !password) {
      setError("Username and Password are required to log in.");
      return;
    }

    const registry = getUsersRegistry();
    const user = registry.find(u => u.username === username && u.password === password);

    if (user) {
      onSubmit(user);
    } else {
      setError("Invalid username or password. Please verify your credentials.");
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { username, newPassword, confirmNewPassword } = forgotPasswordData;

    if (!username || !newPassword || !confirmNewPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    const registry = getUsersRegistry();
    const userIndex = registry.findIndex(u => u.username.toLowerCase() === username.toLowerCase());

    if (userIndex === -1) {
      setError("Username not found in our records.");
      return;
    }

    registry[userIndex].password = newPassword;
    localStorage.setItem('emp_users_registry', JSON.stringify(registry));

    setSuccessMsg("Password successfully reset! Redirecting to login...");
    
    setTimeout(() => {
      setMode('login');
      setForgotPasswordData({ username: '', newPassword: '', confirmNewPassword: '' });
    }, 2000);
  };

  const passwordsMatch = mode === 'signup' 
    ? (signupData.password === signupData.confirmPassword)
    : (forgotPasswordData.newPassword === forgotPasswordData.confirmNewPassword);

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 w-full max-w-2xl transition-all duration-300 border border-tertiary">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-tertiary text-primary-500 rounded-2xl mb-4 shadow-sm border border-tertiary">
          {mode === 'login' ? <LogIn size={40} /> : mode === 'signup' ? <UserPlus size={40} /> : <ShieldCheck size={40} />}
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Join EmployeeCare' : 'Reset Password'}
        </h2>
        <p className="text-slate-500 mt-2 font-medium">
          {mode === 'login' ? 'Sign in to manage your requests' : mode === 'signup' ? 'Register your profile to get started' : 'Enter your username to set a new password'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-700 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="shrink-0 mt-0.5" size={20} />
          <p className="text-sm font-semibold leading-relaxed">{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 text-emerald-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="shrink-0 mt-0.5" size={20} />
          <p className="text-sm font-semibold leading-relaxed">{successMsg}</p>
        </div>
      )}

      {mode === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Username*</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-tertiary border border-tertiary rounded-xl focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all font-medium"
                placeholder="Enter your username"
                value={loginData.username}
                onChange={e => setLoginData({ ...loginData, username: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Password*</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-12 pr-12 py-3.5 bg-tertiary border border-tertiary rounded-xl focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all font-medium"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => setMode('forgot-password')}
              className="text-sm font-bold text-primary-500 hover:text-primary-700 transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-100 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg"
          >
            <ShieldCheck size={22} />
            Secure Login
          </button>
        </form>
      ) : mode === 'forgot-password' ? (
        <form onSubmit={handleForgotPassword} className="flex flex-col gap-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 ml-1">Username*</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-tertiary border border-tertiary rounded-xl focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all font-medium"
                placeholder="Enter your username"
                value={forgotPasswordData.username}
                onChange={e => setForgotPasswordData({ ...forgotPasswordData, username: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 ml-1">New Password*</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
              <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-tertiary border border-tertiary rounded-xl focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all font-medium"
                placeholder="New Password"
                value={forgotPasswordData.newPassword}
                onChange={e => setForgotPasswordData({ ...forgotPasswordData, newPassword: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 ml-1">Confirm New Password*</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
              <input
                type="password"
                required
                className={`w-full pl-12 pr-4 py-3.5 bg-tertiary border border-tertiary rounded-xl focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all font-medium ${!passwordsMatch && forgotPasswordData.confirmNewPassword ? 'border-rose-400' : ''}`}
                placeholder="Confirm New Password"
                value={forgotPasswordData.confirmNewPassword}
                onChange={e => setForgotPasswordData({ ...forgotPasswordData, confirmNewPassword: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full font-bold py-4 rounded-xl shadow-lg transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg ${passwordsMatch && forgotPasswordData.newPassword ? 'bg-primary-500 hover:bg-primary-600 text-white' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
          >
            Update Password
          </button>
        </form>
      ) : (
        <form onSubmit={handleSignup} className="flex flex-col gap-6">
          {/* Employee Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 ml-1">Employee Name*</label>
            <div className="relative">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-tertiary border border-tertiary rounded-xl focus:ring-4 focus:ring-primary-50 outline-none transition-all font-medium"
                placeholder="e.g. John Doe"
                value={signupData.name}
                onChange={e => setSignupData({ ...signupData, name: e.target.value })}
              />
            </div>
          </div>

          {/* Employment Type */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 ml-1">Employment Type*</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <select
                required
                className="w-full pl-12 pr-10 py-3.5 bg-tertiary border border-tertiary rounded-xl focus:ring-4 focus:ring-primary-50 outline-none transition-all font-medium appearance-none"
                value={signupData.employmentType}
                onChange={e => setSignupData({ ...signupData, employmentType: e.target.value as EmploymentType })}
              >
                {EMPLOYMENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronRight size={20} className="rotate-90" />
              </div>
            </div>
          </div>

          {/* Department */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 ml-1">Department*</label>
            <div className="relative">
              <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                list="dept-options"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-tertiary border border-tertiary rounded-xl focus:ring-4 focus:ring-primary-50 outline-none transition-all font-medium"
                placeholder="Select or enter department"
                value={signupData.department}
                onChange={e => setSignupData({ ...signupData, department: e.target.value })}
              />
              <datalist id="dept-options">
                {PREDEFINED_DEPARTMENTS.map(d => <option key={d} value={d} />)}
              </datalist>
            </div>
          </div>

          {/* Team */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 ml-1">Team*</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                list="team-options"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-tertiary border border-tertiary rounded-xl focus:ring-4 focus:ring-primary-50 outline-none transition-all font-medium"
                placeholder="Select or enter team"
                value={signupData.team}
                onChange={e => setSignupData({ ...signupData, team: e.target.value })}
              />
              <datalist id="team-options">
                {PREDEFINED_TEAMS.map(t => <option key={t} value={t} />)}
              </datalist>
            </div>
          </div>

          {/* Position */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 ml-1">Position*</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                list="pos-options"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-tertiary border border-tertiary rounded-xl focus:ring-4 focus:ring-primary-50 outline-none transition-all font-medium"
                placeholder="Select or enter position"
                value={signupData.position}
                onChange={e => setSignupData({ ...signupData, position: e.target.value })}
              />
              <datalist id="pos-options">
                {PREDEFINED_POSITIONS.map(p => <option key={p} value={p} />)}
              </datalist>
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 ml-1">Gender*</label>
            <div className="relative">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <select
                required
                className="w-full pl-12 pr-10 py-3.5 bg-tertiary border border-tertiary rounded-xl focus:ring-4 focus:ring-primary-50 outline-none transition-all font-medium appearance-none"
                value={signupData.gender}
                onChange={e => setSignupData({ ...signupData, gender: e.target.value as 'Male' | 'Female' })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Civil Status */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 ml-1">Civil Status*</label>
            <div className="relative">
              <Heart className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <select
                required
                className="w-full pl-12 pr-10 py-3.5 bg-tertiary border border-tertiary rounded-xl focus:ring-4 focus:ring-primary-50 outline-none transition-all font-medium appearance-none"
                value={signupData.civilStatus}
                onChange={e => setSignupData({ ...signupData, civilStatus: e.target.value as any })}
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Separated">Separated</option>
                <option value="Annulled">Annulled</option>
              </select>
            </div>
          </div>

          {/* Solo Parent */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 ml-1">Solo Parent*</label>
            <div className="relative">
              <Baby className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <select
                required
                className="w-full pl-12 pr-10 py-3.5 bg-tertiary border border-tertiary rounded-xl focus:ring-4 focus:ring-primary-50 outline-none transition-all font-medium appearance-none"
                value={signupData.soloParent}
                onChange={e => setSignupData({ ...signupData, soloParent: e.target.value as any })}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 ml-1">Username*</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-tertiary border border-tertiary rounded-xl focus:ring-4 focus:ring-primary-50 outline-none transition-all font-medium"
                placeholder="Choose a username"
                value={signupData.username}
                onChange={e => setSignupData({ ...signupData, username: e.target.value })}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 ml-1">Password*</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="password"
                required
                className={`w-full pl-12 pr-4 py-3.5 bg-tertiary border rounded-xl focus:ring-4 focus:ring-primary-50 outline-none transition-all font-medium ${!passwordsMatch ? 'border-rose-300' : 'border-tertiary'}`}
                placeholder="Create password"
                value={signupData.password}
                onChange={e => setSignupData({ ...signupData, password: e.target.value })}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 ml-1">Confirm Password*</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="password"
                required
                className={`w-full pl-12 pr-4 py-3.5 bg-tertiary border rounded-xl focus:ring-4 focus:ring-primary-50 outline-none transition-all font-medium ${signupData.confirmPassword && !passwordsMatch ? 'border-rose-400 bg-rose-50' : 'border-tertiary'}`}
                placeholder="Confirm password"
                value={signupData.confirmPassword}
                onChange={e => setSignupData({ ...signupData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full font-bold py-4 rounded-xl shadow-lg transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg mt-4 ${passwordsMatch && signupData.password ? 'bg-primary-500 hover:bg-primary-600 text-white' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
          >
            Create My Profile
          </button>
        </form>
      )}

      <div className="mt-8 pt-6 border-t border-tertiary text-center">
        <p className="text-slate-500 font-medium">
          {mode === 'login' ? "New to EmployeeCare?" : "Already have an account?"}
        </p>
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="mt-2 text-primary-500 font-bold hover:text-primary-700 transition-colors underline decoration-2 underline-offset-4"
        >
          {mode === 'login' ? 'Create an account now' : 'Back to login screen'}
        </button>
      </div>
    </div>
  );
};
