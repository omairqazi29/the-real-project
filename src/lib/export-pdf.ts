import type { Property } from '@/types/property'
import type { BRRRResult, YearProjection } from '@/types/calculations'
import { formatCurrency, formatPercent } from '@/lib/format'

/**
 * Generate a PDF report for a property analysis using jsPDF.
 * This runs client-side to avoid server-side rendering issues.
 */
export async function generatePropertyPDF(
  property: Property,
  brrr: BRRRResult,
  projections: YearProjection[]
): Promise<void> {
  const { default: jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  let y = margin

  const addText = (text: string, x: number, yPos: number, opts?: { fontSize?: number; fontStyle?: string; color?: number[] }) => {
    doc.setFontSize(opts?.fontSize || 10)
    if (opts?.fontStyle) doc.setFont('helvetica', opts.fontStyle)
    else doc.setFont('helvetica', 'normal')
    if (opts?.color) doc.setTextColor(opts.color[0], opts.color[1], opts.color[2])
    else doc.setTextColor(250, 250, 250)
    doc.text(text, x, yPos)
  }

  const addLine = (yPos: number) => {
    doc.setDrawColor(64, 64, 64)
    doc.line(margin, yPos, pageWidth - margin, yPos)
  }

  const addRow = (label: string, value: string, yPos: number) => {
    addText(label, margin, yPos, { fontSize: 9, color: [163, 163, 163] })
    addText(value, pageWidth - margin, yPos, { fontSize: 9 })
    doc.setFont('helvetica', 'normal')
    // Right-align value
    const valWidth = doc.getTextWidth(value)
    doc.text(value, pageWidth - margin - valWidth, yPos)
    return yPos + 5
  }

  const checkPage = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      y = margin
    }
  }

  // Background
  doc.setFillColor(10, 10, 10)
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F')

  // Header
  addText('THE REAL PROJECT', margin, y, { fontSize: 18, fontStyle: 'bold', color: [220, 38, 38] })
  y += 6
  addText('Property Investment Analysis Report', margin, y, { fontSize: 10, color: [163, 163, 163] })
  y += 4
  addText(`Generated: ${new Date().toLocaleDateString()}`, margin, y, { fontSize: 8, color: [115, 115, 115] })
  y += 8
  addLine(y)
  y += 8

  // Property Info
  addText(property.name, margin, y, { fontSize: 16, fontStyle: 'bold' })
  y += 6
  if (property.address) {
    const addr = [property.address, property.city, property.state, property.zip].filter(Boolean).join(', ')
    addText(addr, margin, y, { fontSize: 9, color: [163, 163, 163] })
    y += 5
  }
  addText(`${property.property_type} | ${property.beds || '-'} bed / ${property.baths || '-'} bath | ${property.sqft?.toLocaleString() || '-'} sqft`, margin, y, { fontSize: 9, color: [163, 163, 163] })
  y += 10

  // Deal Summary
  addText('DEAL SUMMARY', margin, y, { fontSize: 12, fontStyle: 'bold', color: [220, 38, 38] })
  y += 8

  y = addRow('Purchase Price', formatCurrency(brrr.purchasePrice), y)
  y = addRow('Down Payment', formatCurrency(brrr.downPayment), y)
  y = addRow('Loan Amount', formatCurrency(brrr.loanAmount), y)
  y = addRow('Closing Costs', formatCurrency(brrr.closingCosts), y)
  y = addRow('Rehab Budget', formatCurrency(brrr.rehabBudget), y)
  y = addRow('Total Cash Invested', formatCurrency(brrr.totalCashInvested), y)
  y += 3
  addLine(y)
  y += 8

  // Cash Flow
  addText('CASH FLOW ANALYSIS', margin, y, { fontSize: 12, fontStyle: 'bold', color: [220, 38, 38] })
  y += 8

  y = addRow('Monthly Rent', formatCurrency(brrr.monthlyRent), y)
  y = addRow('Monthly Expenses', formatCurrency(brrr.monthlyExpenses), y)
  y = addRow('Monthly Debt Service', formatCurrency(brrr.monthlyDebtService), y)
  y = addRow('Monthly Cash Flow', formatCurrency(brrr.monthlyCashFlow), y)
  y = addRow('Annual Cash Flow', formatCurrency(brrr.annualCashFlow), y)
  y += 3

  // Returns
  y = addRow('Cap Rate', formatPercent(brrr.capRate), y)
  y = addRow('Cash-on-Cash Return', formatPercent(brrr.initialCoCReturn), y)
  y += 3
  addLine(y)
  y += 8

  // BRRR Metrics
  if (brrr.arv > 0) {
    checkPage(50)
    addText('BRRR STRATEGY METRICS', margin, y, { fontSize: 12, fontStyle: 'bold', color: [220, 38, 38] })
    y += 8

    y = addRow('After Repair Value (ARV)', formatCurrency(brrr.arv), y)
    y = addRow('Forced Equity', formatCurrency(brrr.forcedEquity), y)
    y = addRow('New Loan Amount', formatCurrency(brrr.newLoanAmount), y)
    y = addRow('Net Cash Out', formatCurrency(brrr.netCashOut), y)
    y = addRow('Cash Left in Deal', formatCurrency(brrr.cashLeftInDeal), y)
    y = addRow('Post-Refi Cash Flow', formatCurrency(brrr.postRefiCashFlow) + '/mo', y)
    y = addRow('Post-Refi CoC Return', brrr.infiniteReturn ? 'Infinite' : formatPercent(brrr.postRefiCoCReturn), y)
    y += 3
    addLine(y)
    y += 8
  }

  // 10-Year Projections Table
  checkPage(80)
  addText('10-YEAR PROJECTIONS', margin, y, { fontSize: 12, fontStyle: 'bold', color: [220, 38, 38] })
  y += 8

  // Table header
  const cols = ['Year', 'Value', 'Equity', 'Cash Flow', 'CoC', 'Total ROI']
  const colWidths = [15, 25, 25, 25, 20, 22]
  let x = margin
  cols.forEach((col, i) => {
    addText(col, x, y, { fontSize: 7, fontStyle: 'bold', color: [163, 163, 163] })
    x += colWidths[i]
  })
  y += 2
  addLine(y)
  y += 4

  projections.forEach(proj => {
    checkPage(6)
    x = margin
    const values = [
      `${proj.year}`,
      formatCurrency(proj.propertyValue, { compact: true }),
      formatCurrency(proj.equityTotal, { compact: true }),
      formatCurrency(proj.annualCashFlow, { compact: true }),
      formatPercent(proj.cocReturn),
      formatPercent(proj.totalROI),
    ]
    values.forEach((val, i) => {
      addText(val, x, y, { fontSize: 7 })
      x += colWidths[i]
    })
    y += 5
  })

  y += 5
  addLine(y)
  y += 8

  // Footer
  checkPage(15)
  addText('Every number, explained.', margin, y, { fontSize: 8, fontStyle: 'italic', color: [220, 38, 38] })
  y += 4
  addText('Generated by The Real Project - therealproject.app', margin, y, { fontSize: 7, color: [115, 115, 115] })

  // Save
  const fileName = `${property.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-analysis.pdf`
  doc.save(fileName)
}
