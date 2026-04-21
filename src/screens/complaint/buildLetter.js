import { PWD_STATE } from '../../data/pwd.js';

const EVIDENCE_LABELS = {
  history: 'Road score history (last 12 months)',
  gps: 'GPS-mapped pothole locations',
  timeline: 'Deterioration timeline log',
  sla: 'Authority SLA breach record',
  photo: 'Photographic evidence',
  prev: 'Previous complaint reference',
};

export function buildSubject(area, road, issueType) {
  return `Urgent: Road maintenance failure — ${road}, ${area.name} (${area.ward})`;
}

export function buildLetter({ area, road, issueType, name, address, mobile, evidence, reference, dateStr }) {
  const subject = buildSubject(area, road, issueType);

  const evidenceList = evidence.length
    ? evidence.map(id => `  • ${EVIDENCE_LABELS[id] || id}`).join('\n')
    : '  • (none selected)';

  return `${dateStr}

To:
${area.wardOfficer}
Assistant Commissioner, ${area.ward}
${area.wardAddress}
Email: ${area.wardEmail}
Phone: ${area.wardPhone}

CC:
${PWD_STATE.additionalCS}, Additional Chief Secretary
${PWD_STATE.dept}
Email: ${PWD_STATE.additionalCSEmail}

${PWD_STATE.minister}, Hon'ble Minister for Public Works
${PWD_STATE.dept}
Email: ${PWD_STATE.ministerEmail}

Subject: ${subject}

Respected Sir/Madam,

I am writing to formally report a serious and continuing failure of road maintenance on ${road}, located in ${area.name}, under the jurisdiction of ${area.ward}. As of today, this stretch of road carries a documented condition score of ${area.score}/100 (${area.severity}), with ${area.potholes} active potholes reported by the Better Roads civic monitoring platform. The surface has now remained unaddressed for ${area.daysUnaddressed} consecutive days, and the BMC's statutory 14-day service-level agreement for pothole repair stands breached by ${area.slaBreach} days. This constitutes a documented failure of municipal road maintenance obligations and an unacceptable risk to public safety, commuter wellbeing, and local commerce.

The specific issue being reported is: ${issueType}. In support of this complaint, the following evidence is enclosed and will be made available on request:

${evidenceList}

In light of the above, I formally demand: (a) a site inspection by the ward engineering team within 72 hours of receipt of this letter; (b) a written acknowledgement along with a tentative timeline for remedial works; and (c) commencement of repair works within 14 days, in compliance with the BMC pothole SLA.

Failing the above, this matter will be escalated to the State Public Works Department, followed by RTI filing and public disclosure through citizen-accountability platforms including Better Roads.

Yours sincerely,

${name}
${address}
Mobile: ${mobile}
Date: ${dateStr}

—
Better Roads Reference: ${reference}
Tracked via: betterroads.in · Public civic-monitoring platform
`;
}
