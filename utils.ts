
export const calculateDaysBetween = (start: string, end: string): number => {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  const diffTime = Math.abs(e.getTime() - s.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 0;
};

export const calculateHoursBetween = (timeIn: string, timeOut: string): number => {
  if (!timeIn || !timeOut) return 0;
  const [inH, inM] = timeIn.split(':').map(Number);
  const [outH, outM] = timeOut.split(':').map(Number);
  
  let totalMinutes = (outH * 60 + outM) - (inH * 60 + inM);
  // Simple check for day crossing
  if (totalMinutes < 0) totalMinutes += 24 * 60;
  
  return Number((totalMinutes / 60).toFixed(2));
};

export const isEditable = (createdAt: string, status: string): boolean => {
  if (status === 'Approved' || status === 'Rejected') return false;
  const created = new Date(createdAt).getTime();
  const now = new Date().getTime();
  const hoursPassed = (now - created) / (1000 * 60 * 60);
  return hoursPassed <= 24;
};

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
