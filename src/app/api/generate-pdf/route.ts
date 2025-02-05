import { NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import path from 'path';
import fs from 'fs/promises';
import { formatDuration } from '@/lib/utils'; // Add this import

function sanitizeFilename(name: string): string {
  return name.replace(/[/\\?%*:|"<>]/g, '_').trim();
}

async function getBase64Image(imagePath: string): Promise<string> {
  const fullPath = path.join(process.cwd(), 'public', imagePath);
  const imageBuffer = await fs.readFile(fullPath);
  return `data:image/png;base64,${imageBuffer.toString('base64')}`;
}

export async function POST(request: Request) {
  try {
    const { summary, meetingDetails } = await request.json();
    
    const durationInSeconds = typeof meetingDetails.duration === 'string' ? 
      parseInt(meetingDetails.duration.replace(/[^\d]/g, '')) : 
      Number(meetingDetails.duration);

    const formattedDuration = !isNaN(durationInSeconds) ? 
      formatDuration(durationInSeconds) : 
      'N/A';
    
    // Create PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yOffset = 20;

    // Load both images
    const iconBase64 = await getBase64Image('images/memorio-icon.png');
    const logoBase64 = await getBase64Image('images/memorio-logo.png');

    // Add header background
    doc.setFillColor(247, 248, 250);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Add icon and logo side by side with adjusted dimensions
    doc.addImage(iconBase64, 'PNG', 20, 8, 20, 20); // Smaller icon
    doc.addImage(logoBase64, 'PNG', 45, 10, 60, 16); // Adjusted logo size and position
    
    yOffset += 30; // Reduced from 40 to 30

    // Add "Meeting Summary" title with reduced spacing
    doc.setTextColor(30, 41, 59); // slate-800
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Meeting Summary', 20, yOffset);
    
    yOffset += 15; // Reduced from 30 to 15

    // Add meeting details section
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(20, yOffset, pageWidth - 40, 30, 'F');
    
    doc.setTextColor(30, 41, 59); // slate-800
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(meetingDetails.title, 30, yOffset + 12);
    
    doc.setTextColor(71, 85, 105); // slate-600
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Meeting Duration: ${formattedDuration}`, 30, yOffset + 22);
    doc.text(`Date: ${meetingDetails.date}`, pageWidth - 30, yOffset + 22, { align: 'right' });
    
    yOffset += 50;

    // Add divider
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(20, yOffset - 10, pageWidth - 20, yOffset - 10);

    // Add sections
    Object.entries(summary).forEach(([section, content]) => {
      if (section === 'keyInsights') return;

      // Check for new page
      if (yOffset > pageHeight - 40) {
        doc.addPage();
        yOffset = 20;
      }

      const title = section
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

      // Section title with accent bar
      doc.setFillColor(79, 70, 229, 0.1); // indigo-600 with opacity
      doc.rect(20, yOffset, 3, 10, 'F');
      
      doc.setTextColor(30, 41, 59); // slate-800
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 30, yOffset + 8);
      yOffset += 20;

      // Section content
      doc.setTextColor(51, 65, 85); // slate-700
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');

      if (Array.isArray(content)) {
        content.forEach(item => {
          const lines = doc.splitTextToSize(`• ${item}`, pageWidth - 60);
          
          if (yOffset + (lines.length * 7) > pageHeight - 20) {
            doc.addPage();
            yOffset = 20;
          }
          
          lines.forEach((line: string) => {
            doc.text(line, 30, yOffset);
            yOffset += 6;
          });
          yOffset += 4;
        });
      } else {
        const lines = doc.splitTextToSize(content as string, pageWidth - 60);
        lines.forEach((line: string) => {
          if (yOffset > pageHeight - 20) {
            doc.addPage();
            yOffset = 20;
          }
          doc.text(line, 30, yOffset);
          yOffset += 6;
        });
      }
      yOffset += 15;
    });

    // Update footer with adjusted sizes
    doc.setFillColor(247, 248, 250);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    
    const footerY = pageHeight - 15;
    doc.addImage(iconBase64, 'PNG', pageWidth / 2 - 25, footerY, 8, 8); // Smaller icon in footer
    doc.addImage(logoBase64, 'PNG', pageWidth / 2 - 15, footerY - 1, 30, 8); // Adjusted logo in footer

    // Generate sanitized filename
    const sanitizedTitle = sanitizeFilename(meetingDetails.title);
    const filename = `${sanitizedTitle}_summary.pdf`;
    
    // Convert PDF to blob
    const pdfOutput = doc.output('arraybuffer');
    
    return new NextResponse(pdfOutput, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
