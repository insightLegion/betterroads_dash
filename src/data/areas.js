export const AREAS = {
  'andheri-west': {
    name: 'Andheri West', ward: 'K/West Ward', wardOfficer: 'Parag Masurkar',
    wardEmail: 'ac.kw@mcgm.gov.in', wardPhone: '022-26237932',
    wardAddress: 'Paliram Road, Opp. Andheri Bus Depot, Near S.V. Road, Andheri (W), Mumbai 400058',
    lat: 19.1297, lng: 72.8464,
    score: 22, severity: 'Severe', potholes: 8, daysUnaddressed: 102, slaBreach: 88, complaints: 34,
    lastGood: 'Dec 2025', deteriorationStart: 'Jan 5, 2026', authorityNotified: 'Feb 3, 2026',
    repairStarted: null, lastRepaired: 'Sep 2024', timeToDeteriorate: '3.5 months',
    roads: ['Veera Desai Road', 'New Link Road', 'S.V. Road', 'Lokhandwala Marg', 'Andheri-Kurla Road'],
    history: [72,70,65,52,68,78,44,30,24,28,20,22],
    historyLabels: ['Apr 25','May 25','Jun 25','Jul 25','Aug 25','Sep 25','Oct 25','Nov 25','Dec 25','Jan 26','Feb 26','Apr 26'],
    stats: { total: 34, resolved: 2, pending: 8, noResponse: 24, avgDays: 62 }
  },
  'bandra-west': {
    name: 'Bandra West', ward: 'H/West Ward', wardOfficer: 'Ward Officer H/West',
    wardEmail: 'ac.hw@mcgm.gov.in', wardPhone: '022-26422311',
    wardAddress: 'St. Martin Road, Behind Bandra Police Station, Bandra (W), Mumbai 400050',
    lat: 19.0596, lng: 72.8295,
    score: 41, severity: 'Poor', potholes: 6, daysUnaddressed: 68, slaBreach: 54, complaints: 21,
    lastGood: 'Oct 2025', deteriorationStart: 'Nov 12, 2025', authorityNotified: 'Dec 1, 2025',
    repairStarted: null, lastRepaired: 'Jul 2024', timeToDeteriorate: '4 months',
    roads: ['Linking Road', 'Turner Road', 'Hill Road', 'Pali Hill Road', 'Waterfield Road'],
    history: [78,76,74,58,72,80,58,44,40,44,38,41],
    historyLabels: ['Apr 25','May 25','Jun 25','Jul 25','Aug 25','Sep 25','Oct 25','Nov 25','Dec 25','Jan 26','Feb 26','Apr 26'],
    stats: { total: 21, resolved: 3, pending: 10, noResponse: 8, avgDays: 44 }
  },
  'dadar-west': {
    name: 'Dadar West', ward: 'G/South Ward', wardOfficer: 'Ward Officer G/South',
    wardEmail: 'ac.gs@mcgm.gov.in', wardPhone: '022-24306262',
    wardAddress: 'Cadell Road, Dadar West, Mumbai 400028',
    lat: 19.0178, lng: 72.8478,
    score: 19, severity: 'Severe', potholes: 11, daysUnaddressed: 118, slaBreach: 104, complaints: 52,
    lastGood: 'Nov 2025', deteriorationStart: 'Dec 10, 2025', authorityNotified: 'Jan 2, 2026',
    repairStarted: null, lastRepaired: 'Aug 2024', timeToDeteriorate: '4 months',
    roads: ['Gokhale Road', 'Cadell Road', 'Senapati Bapat Marg', 'Ranade Road', 'L.J. Road'],
    history: [70,68,50,32,74,60,40,24,20,18,16,19],
    historyLabels: ['Apr 25','May 25','Jun 25','Jul 25','Aug 25','Sep 25','Oct 25','Nov 25','Dec 25','Jan 26','Feb 26','Apr 26'],
    stats: { total: 52, resolved: 1, pending: 6, noResponse: 45, avgDays: 78 }
  },
  'borivali-west': {
    name: 'Borivali West', ward: 'R/North Ward', wardOfficer: 'Ward Officer R/North',
    wardEmail: 'ac.rn@mcgm.gov.in', wardPhone: '1916',
    wardAddress: 'R/North Ward Office, Borivali West, Mumbai 400091',
    lat: 19.2307, lng: 72.8567,
    score: 18, severity: 'Severe', potholes: 13, daysUnaddressed: 124, slaBreach: 110, complaints: 61,
    lastGood: 'Nov 2025', deteriorationStart: 'Dec 5, 2025', authorityNotified: 'Dec 28, 2025',
    repairStarted: null, lastRepaired: 'Jul 2024', timeToDeteriorate: '5 months',
    roads: ['Chandavarkar Road', 'L.T. Road', 'IC Colony Road', 'Shimpoli Road', 'M.G. Road'],
    history: [68,70,52,30,72,70,38,20,16,14,12,18],
    historyLabels: ['Apr 25','May 25','Jun 25','Jul 25','Aug 25','Sep 25','Oct 25','Nov 25','Dec 25','Jan 26','Feb 26','Apr 26'],
    stats: { total: 61, resolved: 1, pending: 5, noResponse: 55, avgDays: 84 }
  },
  'vile-parle': {
    name: 'Vile Parle West', ward: 'K/West Ward', wardOfficer: 'Parag Masurkar',
    wardEmail: 'ac.kw@mcgm.gov.in', wardPhone: '022-26239499',
    wardAddress: 'Paliram Road, Opp. Andheri Bus Depot, Near S.V. Road, Andheri (W), Mumbai 400058',
    lat: 19.1075, lng: 72.8263,
    score: 64, severity: 'Minor', potholes: 2, daysUnaddressed: 28, slaBreach: 14, complaints: 7,
    lastGood: 'Feb 2026', deteriorationStart: 'Mar 15, 2026', authorityNotified: 'Mar 20, 2026',
    repairStarted: 'Work order raised', lastRepaired: 'Dec 2024', timeToDeteriorate: '5 months',
    roads: ['S.V. Road VP', 'Irla Road', 'Hanuman Road', 'Nehru Road', 'Telang Road'],
    history: [68,70,72,65,68,70,72,68,70,65,45,64],
    historyLabels: ['Apr 25','May 25','Jun 25','Jul 25','Aug 25','Sep 25','Oct 25','Nov 25','Dec 25','Jan 26','Feb 26','Apr 26'],
    stats: { total: 7, resolved: 4, pending: 3, noResponse: 0, avgDays: 18 }
  },
  'kurla': {
    name: 'Kurla', ward: 'L Ward', wardOfficer: 'Ward Officer L Ward',
    wardEmail: 'ac.l@mcgm.gov.in', wardPhone: '022-26505103',
    wardAddress: 'Kurla Municipal Market Building, S.G. Barve Road, Kurla (W), Mumbai 400070',
    lat: 19.0728, lng: 72.8826,
    score: 38, severity: 'Poor', potholes: 6, daysUnaddressed: 44, slaBreach: 30, complaints: 18,
    lastGood: 'Jan 2026', deteriorationStart: 'Feb 8, 2026', authorityNotified: 'Feb 20, 2026',
    repairStarted: null, lastRepaired: 'Oct 2024', timeToDeteriorate: '4 months',
    roads: ['LBS Marg', 'Kurla-Andheri Road', 'Nehru Nagar Road', 'Sion-Kurla Road', 'BKC Link Road'],
    history: [66,68,64,44,68,72,44,66,68,65,32,38],
    historyLabels: ['Apr 25','May 25','Jun 25','Jul 25','Aug 25','Sep 25','Oct 25','Nov 25','Dec 25','Jan 26','Feb 26','Apr 26'],
    stats: { total: 18, resolved: 2, pending: 6, noResponse: 10, avgDays: 38 }
  }
};

export function getSeverityColor(severity) {
  switch (severity) {
    case 'Good': return 'var(--good)';
    case 'Minor': return 'var(--minor)';
    case 'Poor': return 'var(--poor)';
    case 'Severe': return 'var(--severe)';
    default: return 'var(--text-muted)';
  }
}

export function scoreToSeverity(score) {
  if (score >= 60) return 'Good';
  if (score >= 45) return 'Minor';
  if (score >= 30) return 'Poor';
  return 'Severe';
}

export function severityColorHex(severity) {
  switch (severity) {
    case 'Good': return '#639922';
    case 'Minor': return '#EF9F27';
    case 'Poor': return '#D85A30';
    case 'Severe': return '#E24B4A';
    default: return '#6b7280';
  }
}
