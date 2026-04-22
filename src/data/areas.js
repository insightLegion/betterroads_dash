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

// ---- Road-level contract / tender data (deterministic per road name) ----

const CONTRACTORS = [
  { name: 'J Kumar Infraprojects Ltd', reg: 'BMC-RD-2019-JKI' },
  { name: 'IRB Infrastructure Developers', reg: 'BMC-RD-2020-IRB' },
  { name: 'ITD Cementation India Ltd', reg: 'BMC-RD-2021-ITD' },
  { name: 'Relcon Infraprojects Ltd', reg: 'BMC-RD-2020-REL' },
  { name: 'NCC Limited (Nagarjuna)', reg: 'BMC-RD-2022-NCC' },
  { name: 'Afcons Infrastructure Ltd', reg: 'BMC-RD-2021-AFC' },
  { name: 'Roadway Solutions India Ltd', reg: 'BMC-RD-2023-RSI' },
  { name: 'Ashoka Buildcon Ltd', reg: 'BMC-RD-2022-ABL' },
];

const WORK_TYPES = [
  'Mastic asphalt relaying',
  'Bitumen pothole repair (AMC)',
  'Full-depth concretisation',
  'Micro-surfacing overlay',
  'UTWT polymer-modified overlay',
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function formatINR(lakhs) {
  if (lakhs >= 100) {
    const cr = lakhs / 100;
    return `₹${cr.toFixed(2)} Cr`;
  }
  return `₹${lakhs.toFixed(2)} L`;
}

function addDays(iso, days) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function roadScore(areaScore, salt) {
  const delta = ((salt * 37) % 21) - 10;
  return Math.max(0, Math.min(100, areaScore + delta));
}

/**
 * Returns a deterministic contract/tender record for a given road in an area.
 * The same area + road name always yields the same record.
 */
export function getRoadDetails(areaId, roadName, monthIndex = 11) {
  const area = AREAS[areaId];
  if (!area) return null;

  const h = hash(`${areaId}:${roadName}`);
  const contractor = CONTRACTORS[h % CONTRACTORS.length];
  const workType = WORK_TYPES[(h >>> 3) % WORK_TYPES.length];

  // Tender amount ₹2.40 Cr to ₹27.60 Cr in lakhs
  const tenderLakhs = 240 + ((h >>> 5) % 2520);
  // Contract duration 18–36 months, starting 8–34 months before Apr 2026
  const durationMonths = 18 + ((h >>> 7) % 19);
  const startOffsetMonths = 8 + ((h >>> 11) % 26);
  const startDateIso = addDays('2026-04-01', -startOffsetMonths * 30);
  const endDateIso = addDays(startDateIso, durationMonths * 30);

  const now = new Date('2026-04-23');
  const end = new Date(endDateIso);
  const daysElapsed = Math.round((now - new Date(startDateIso)) / (1000 * 60 * 60 * 24));
  const daysTotal = durationMonths * 30;
  const progressPct = Math.min(100, Math.max(0, Math.round((daysElapsed / daysTotal) * 100)));
  const contractStatus = now > end ? 'Expired' : progressPct > 70 ? 'Late stage' : 'Active';

  const roadIdx = Math.max(0, area.roads.indexOf(roadName));
  const score = roadScore(area.history[monthIndex] ?? area.score, roadName.length + roadIdx);
  const severity = scoreToSeverity(score);

  const slaDays = severity === 'Severe' ? 14 : severity === 'Poor' ? 21 : 30;
  const potholes = severity === 'Severe' ? 6 + (h % 6) : severity === 'Poor' ? 3 + (h % 4) : severity === 'Minor' ? 1 + (h % 3) : 0;

  const tenderId = `BMC/RD/${area.ward.replace(/[^A-Z]/g, '')}/2024-${String((h % 90) + 10).padStart(3, '0')}`;

  return {
    name: roadName,
    areaId,
    areaName: area.name,
    ward: area.ward,

    score,
    severity,
    potholes,

    contractor: contractor.name,
    contractorReg: contractor.reg,
    tenderId,
    tenderAmount: formatINR(tenderLakhs),
    tenderAmountLakhs: tenderLakhs,
    workType,
    contractStart: formatDate(startDateIso),
    contractEnd: formatDate(endDateIso),
    contractStatus,
    progressPct,

    // Accountability
    responsibleOfficer: area.wardOfficer,
    responsibleRole: `Executive Engineer (Roads & Traffic), ${area.ward}`,
    officerEmail: area.wardEmail,
    officerPhone: area.wardPhone,
    awardedBy: 'Brihanmumbai Municipal Corporation (BMC)',
    sanctionAuthority: 'Standing Committee, BMC',

    slaDays,

    // Resolution path
    resolution: [
      {
        title: 'File grievance with BMC',
        body: `Lodge a public complaint on the BMC 1916 portal or via mail to ${area.wardEmail} citing tender ${tenderId}. SLA is ${slaDays} days for ${severity.toLowerCase()}-severity defects.`,
      },
      {
        title: 'Escalate to Ward Executive Engineer',
        body: `If unresolved within ${slaDays} days, escalate to ${area.wardOfficer} (${area.ward}) at ${area.wardPhone}. Attach the road-score history and SLA breach record.`,
      },
      {
        title: 'Invoke contract penalty clause',
        body: `Request BMC Roads Dept. invoke liquidated damages under the ${workType} contract (${tenderId}) — typical LD is 0.5% of tender value per week of delay.`,
      },
      {
        title: 'Escalate beyond ward',
        body: 'If no action in 60 days, file RTI under Sec 4 RTI Act for SLA records, copy Municipal Commissioner, and approach the Lokayukta or Bombay HC PIL cell.',
      },
    ],
  };
}

