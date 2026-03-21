import { QRCodeCanvas } from 'qrcode.react';

export function MerchantExportCard({ id, url, merchantName, isAI, imageUrl }) {
    return (
        <div
            id={id}
            className="bg-white flex flex-col items-center justify-between pointer-events-none"
            style={{
                width: '800px',
                height: '1200px',
                padding: '100px 60px',
                fontFamily: 'sans-serif',
                position: 'absolute',
                left: '-9999px',
                top: '0',
                zIndex: -50
            }}
        >
            {/* Top: Brand Header */}
            <div className="text-center w-full mt-8">
                <h1 className="text-[5rem] font-black tracking-tighter text-slate-900 mb-6" style={{ fontFamily: 'sans-serif' }}>QRVerse</h1>
                <div className="h-2 w-48 bg-slate-900 mx-auto rounded-full"></div>
            </div>

            {/* Middle: QR Code Display safely scaled */}
            <div className="flex-1 flex items-center justify-center w-full my-8">
                <div className="bg-white rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center justify-center overflow-hidden aspect-square relative" style={{ width: '500px', height: '500px' }}>

                    <div className="relative z-10 p-6 bg-white rounded-3xl shadow-2xl w-[400px] h-[400px] flex items-center justify-center">
                        {isAI && imageUrl && !imageUrl.includes('pollinations.ai') ? (
                            <img src={imageUrl} alt="AI QR Code" className="w-full h-full object-cover rounded-2xl" crossOrigin="anonymous" />
                        ) : (
                            <QRCodeCanvas
                                value={url || "https://qrverse.app"}
                                size={360}
                                level="H"
                                includeMargin={false}
                                fgColor={isAI ? "#8b5cf6" : "#0f172a"}
                                bgColor="#ffffff"
                                imageSettings={isAI && imageUrl ? {
                                    src: imageUrl,
                                    height: 100,
                                    width: 100,
                                    excavate: true
                                } : undefined}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom: Merchant Title perfectly wrapped or empty for standard QRs */}
            {merchantName && (
                <div className="text-center w-full mb-8">
                    <p className="text-3xl font-semibold text-slate-500 tracking-widest uppercase mb-4" style={{ fontFamily: 'sans-serif' }}>Verified Merchant</p>
                    {/* Remove truncate and use standard text wrapping to prevent cutting off names */}
                    <h2 className="text-[4rem] px-8 font-bold text-slate-900 leading-tight break-words" style={{ fontFamily: 'sans-serif' }}>{merchantName}</h2>
                </div>
            )}
        </div>
    );
}
