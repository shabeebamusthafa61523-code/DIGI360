import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Exports a proposal DOM element to a perfectly formatted, single-page A4 PDF.
 * Mathematically scales both width and height to guarantee 100% fit on 1 A4 sheet without overflow.
 */
export async function exportProposalToPdf(element, filename = 'Proposal.pdf') {
  if (!element) {
    throw new Error('Proposal document element not found for export');
  }

  // Ensure images and fonts are loaded
  await new Promise(resolve => setTimeout(resolve, 150));

  // Temporarily adjust shadow / borders for clean export
  const originalBoxShadow = element.style.boxShadow;
  element.style.boxShadow = 'none';

  try {
    const canvas = await html2canvas(element, {
      scale: 2.5, // High resolution for crisp print/PDF text
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Restore original box shadow on screen
    element.style.boxShadow = originalBoxShadow;

    // Standard A4 dimensions in mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;

    // Margin in mm
    const margin = 6;
    const printableWidth = pageWidth - (margin * 2); // 198 mm
    const printableHeight = pageHeight - (margin * 2); // 285 mm

    // Compute uniform scale factor so the document fits both width and height
    const scaleWidth = printableWidth / canvas.width;
    const scaleHeight = printableHeight / canvas.height;
    const scale = Math.min(scaleWidth, scaleHeight);

    const finalWidth = canvas.width * scale;
    const finalHeight = canvas.height * scale;

    // Center on the page
    const posX = (pageWidth - finalWidth) / 2;
    const posY = (pageHeight - finalHeight) / 2;

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    pdf.addImage(imgData, 'JPEG', posX, posY, finalWidth, finalHeight, undefined, 'FAST');

    pdf.save(filename);
    return true;
  } catch (err) {
    element.style.boxShadow = originalBoxShadow;
    console.error('Direct single-page PDF export error:', err);
    throw err;
  }
}
