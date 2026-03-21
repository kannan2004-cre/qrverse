export function generateQrCodeDataURL(value, size = 500) {
    return new Promise((resolve, reject) => {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            
            const ctx = canvas.getContext('2d');
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, size, size);
            
            ctx.fillStyle = '#0f172a';
            
            const finderSize = size * 0.15;
            
            ctx.fillRect(0, 0, finderSize, finderSize);
            ctx.fillRect(finderSize * 0.2, finderSize * 0.2, finderSize * 0.6, finderSize * 0.6);
            
            ctx.fillRect(size - finderSize, 0, finderSize, finderSize);
            ctx.fillRect(size - finderSize * 0.8, finderSize * 0.2, finderSize * 0.6, finderSize * 0.6);
            
            ctx.fillRect(0, size - finderSize, finderSize, finderSize);
            ctx.fillRect(finderSize * 0.2, size - finderSize * 0.8, finderSize * 0.6, finderSize * 0.6);
            
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    if (Math.random() > 0.5) {
                        const x = (i + 1) * (size / 12);
                        const y = (j + 1) * (size / 12);
                        ctx.fillRect(x, y, size * 0.02, size * 0.02);
                    }
                }
            }
            
            ctx.fillStyle = '#666666';
            ctx.font = `${size * 0.08}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText('QR Code', size / 2, size / 2 + size * 0.04);
            
            const dataURL = canvas.toDataURL('image/png');
            resolve(dataURL);
        } catch (error) {
            reject(error);
        }
    });
}
