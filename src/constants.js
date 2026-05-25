export const SERVICE_CATEGORIES = [
  'TV Installation',
  'CCTV Installation',
  'Lighting Installation',
  'On Site Service',
  'Paid Repair Service',
  'Warranty Repair Service'
];

export const INSTALLATION_CATEGORIES = [
  'TV Installation',
  'CCTV Installation',
  'Lighting Installation'
];

export const REPAIR_CATEGORIES = ['Paid Repair Service', 'Warranty Repair Service'];

export const ON_SITE_CATEGORIES = ['On Site Service'];

export const INSTALLATION_STATUS_OPTIONS = [
  'Request Received',
  'Technician Assigned',
  'Visit Scheduled',
  'Installation in Progress',
  'Completed'
];

export const REPAIR_STATUS_OPTIONS = [
  'Request Received',
  'Repair In Process',
  'Ready To Collect',
  'Delivered'
];

export const ON_SITE_STATUS_OPTIONS = [
  'Request Received',
  'Technician Assigned',
  'Site Visit Will Be Done Soon',
  'Site Visited',
  'Problem Cleared'
];

export const STATUS_OPTIONS = Array.from(new Set([...INSTALLATION_STATUS_OPTIONS, ...ON_SITE_STATUS_OPTIONS, ...REPAIR_STATUS_OPTIONS]));

export const COMPLETED_STATUS_OPTIONS = ['Completed', 'Delivered', 'Problem Cleared'];

export const IN_PROGRESS_STATUS_OPTIONS = [
  'Technician Assigned',
  'Visit Scheduled',
  'Installation in Progress',
  'Repair In Process',
  'Ready To Collect',
  'Site Visit Will Be Done Soon',
  'Site Visited'
];

export function getStatusOptions(serviceType) {
  if (INSTALLATION_CATEGORIES.includes(serviceType)) return INSTALLATION_STATUS_OPTIONS;
  if (ON_SITE_CATEGORIES.includes(serviceType)) return ON_SITE_STATUS_OPTIONS;
  return REPAIR_STATUS_OPTIONS;
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
  'Repair In Process': 'bg-cyan-500/20 text-cyan-100 border-cyan-300/30',
  'Ready To Collect': 'bg-amber-500/20 text-amber-100 border-amber-300/30',
  'Site Visit Will Be Done Soon': 'bg-indigo-500/20 text-indigo-100 border-indigo-300/30',
  'Site Visited': 'bg-cyan-500/20 text-cyan-100 border-cyan-300/30',
  'Problem Cleared': 'bg-green-500/20 text-green-100 border-green-300/30',
  Completed: 'bg-green-500/20 text-green-100 border-green-300/30',
  Delivered: 'bg-violet-500/20 text-violet-100 border-violet-300/30'
};
