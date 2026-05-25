export const SERVICE_CATEGORIES = [
  'TV Installation',
  'CCTV Installation',
  'Lighting Installation',
  'Paid Repair Service',
  'Warranty Repair Service'
];

export const INSTALLATION_CATEGORIES = [
  'TV Installation',
  'CCTV Installation',
  'Lighting Installation'
];

export const REPAIR_CATEGORIES = ['Paid Repair Service', 'Warranty Repair Service'];

export const INSTALLATION_STATUS_OPTIONS = [
  'Request Received',
  'Technician Assigned',
  'Visit Scheduled',
  'Installation in Progress',
  'Completed'
];

export const REPAIR_STATUS_OPTIONS = [
  'Request Received',
  'Diagnosis',
  'Repair in Progress',
  'Part Required',
  'Ready',
  'Delivered'
];

export const STATUS_OPTIONS = Array.from(new Set([...INSTALLATION_STATUS_OPTIONS, ...REPAIR_STATUS_OPTIONS]));

export function getStatusOptions(serviceType) {
  return INSTALLATION_CATEGORIES.includes(serviceType) ? INSTALLATION_STATUS_OPTIONS : REPAIR_STATUS_OPTIONS;
}

export function normalizeStatusForService(serviceType, status) {
  const options = getStatusOptions(serviceType);
  return options.includes(status) ? status : options[0];
}

export const STATUS_COLORS = {
  'Request Received': 'bg-slate-500/20 text-slate-200 border-slate-400/30',
  'Technician Assigned': 'bg-blue-500/20 text-blue-100 border-blue-300/30',
  'Visit Scheduled': 'bg-indigo-500/20 text-indigo-100 border-indigo-300/30',
  'Installation in Progress': 'bg-cyan-500/20 text-cyan-100 border-cyan-300/30',
  Diagnosis: 'bg-blue-500/20 text-blue-100 border-blue-300/30',
  'Repair in Progress': 'bg-cyan-500/20 text-cyan-100 border-cyan-300/30',
  'Part Required': 'bg-amber-500/20 text-amber-100 border-amber-300/30',
  Ready: 'bg-emerald-500/20 text-emerald-100 border-emerald-300/30',
  Completed: 'bg-green-500/20 text-green-100 border-green-300/30',
  Delivered: 'bg-violet-500/20 text-violet-100 border-violet-300/30'
};
