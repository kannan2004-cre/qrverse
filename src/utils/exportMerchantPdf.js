import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

const getBase64ImageFromUrl = async (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.drawImage(img, 0, 0);
      
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${imageUrl}`));
    img.src = imageUrl.startsWith('/') ? window.location.origin + imageUrl : imageUrl;
  });
};

const getSafeQrBase64 = async (qrType, targetUrl, imageUrl) => {
  if (qrType === 'standard' || !imageUrl) {
    return await QRCode.toDataURL(targetUrl, { width: 1000, margin: 1 });
  }

  try {
    const proxiedUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`;
    const response = await fetch(proxiedUrl);
    
    if (!response.ok) throw new Error(`Proxy fetch failed: ${response.status}`);
    
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read AI image blob'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("AI QR Fetch Error:", error);
    throw new Error("Failed to download the AI image for export.");
  }
};

export async function exportMerchantPDF(qrType, targetUrl, imageUrl, merchantName) {
    try {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const templateBase64 = await getBase64ImageFromUrl('/QRverse.png');
        const qrBase64 = await getSafeQrBase64(qrType, targetUrl, imageUrl);

        doc.addImage(templateBase64, 'PNG', 0, 0, pageWidth, pageHeight);

        const qrSize = pageWidth * 0.55;
        const qrX = (pageWidth - qrSize) / 2;
        const qrY = pageHeight * 0.31;

        doc.addImage(qrBase64, 'PNG', qrX, qrY, qrSize, qrSize);

        const fontSize = 22;
        doc.setFontSize(fontSize);
        doc.setFont(undefined, 'bold');
        
        const textY = qrY + qrSize + 15;
        
        doc.setTextColor(0, 0, 0);
        
        const textWidth = doc.getTextWidth(merchantName);
        const textX = (pageWidth - textWidth) / 2;
        
        doc.text(merchantName, textX, textY);

    doc.save('QRverse-Merchant.pdf');
    
} catch (error) {
    console.error('PDF Export failed:', error);
    throw new Error('Failed to export PDF. Please try again.');
}
}

export async function exportPersonalPDF(qrType, targetUrl, imageUrl) {
    try {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const templateBase64 = await getBase64ImageFromUrl('/personal.png');
        const qrBase64 = await getSafeQrBase64(qrType, targetUrl, imageUrl);

        doc.addImage(templateBase64, 'PNG', 0, 0, pageWidth, pageHeight);

        const qrSize = pageWidth * 0.65;
        const qrX = (pageWidth - qrSize) / 2;
        const qrY = pageHeight * 0.27;

        doc.addImage(qrBase64, 'PNG', qrX, qrY, qrSize, qrSize);

        doc.save('Personal-QRverse.pdf');
        
    } catch (error) {
        console.error('PDF Export failed:', error);
        throw new Error('Failed to export PDF. Please try again.');
    }
}
