import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportToPdf(elementId, filename = "OculusZero-Merchant.pdf") {
    const element = document.getElementById(elementId);
    if (!element) throw new Error("Export element not found in DOM");
    
    try {
        const canvas = await html2canvas(element, { 
            scale: 2, 
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png', 1.0);
        
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [210, 315] 
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(filename);
    } catch (error) {
        console.error("PDF Export error:", error);
        throw error;
    }
}
