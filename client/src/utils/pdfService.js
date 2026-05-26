import jsPDF from 'jspdf'

export function downloadReviewPdf({summary, issues, improvedCode}){
  const doc = new jsPDF()
  doc.setFontSize(14)
  doc.text('Automated Code Review', 14, 20)
  doc.setFontSize(12)
  doc.text('Summary:', 14, 36)
  doc.text(summary || '', 14, 44, { maxWidth: 180 })
  doc.text('Issues:', 14, 80)
  doc.text(JSON.stringify(issues, null, 2), 14, 88, { maxWidth: 180 })
  doc.addPage()
  doc.text('Improved Code', 14, 20)
  doc.setFontSize(10)
  doc.text(improvedCode || '', 14, 28, { maxWidth: 180 })
  doc.save('review.pdf')
}
