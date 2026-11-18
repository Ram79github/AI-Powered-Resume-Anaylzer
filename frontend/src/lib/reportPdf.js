import { jsPDF } from 'jspdf';

export function downloadReport(report) {
  const pdf = new jsPDF();
  const lines = [
    'RESUME ANALYSIS',
    '',
    `Role: ${report.jobTitle}`,
    `Resume: ${report.resumeName}`,
    `Match score: ${report.score}/100`,
    '',
    report.summary,
    '',
    'MATCHED KEYWORDS',
    ...(report.matchedKeywords.length ? report.matchedKeywords : ['None detected']),
    '',
    'KEYWORDS TO ADDRESS',
    ...(report.missingKeywords.length ? report.missingKeywords : ['No missing keywords detected']),
    '',
    'SUGGESTIONS',
    ...report.suggestions.map((item, index) => `${index + 1}. ${item}`),
  ];
  let y = 18;
  for (const line of lines) {
    const wrapped = pdf.splitTextToSize(line, 175);
    if (y + wrapped.length * 7 > 280) {
      pdf.addPage();
      y = 18;
    }
    pdf.text(wrapped, 18, y);
    y += wrapped.length * 7;
  }
  pdf.save('resume-analysis.pdf');
}
