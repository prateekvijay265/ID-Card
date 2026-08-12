import { useState, useRef, useCallback, useEffect, type ChangeEvent } from 'react';
import * as htmlToImage from 'html-to-image';
import PageTransition from '../components/PageTransition';
import IdCard from '../components/IdCard';
import {
  drawPFP,
  CANVAS_SIZES,
  type Format,
  type CardData,
} from '../canvasRenderer';

export type { CardData };

async function convertHEIC(file: File): Promise<Blob> {
  const heic2any = (await import('heic2any')).default;
  const result = await heic2any({ blob: file, toType: 'image/png' });
  return Array.isArray(result) ? result[0] : result;
}

export default function Generator() {
  const [format, setFormat] = useState<Format>('card');
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState('');
  const [userImg, setUserImg] = useState<HTMLImageElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [status, setStatus] = useState<{ text: string; ok: boolean } | null>(null);
  const [cardData, setCardData] = useState<CardData>({ 
    name: 'PRATEEK VIJAY', 
    stackRoleList: 'Python, Machine Learning, Data Analytics, AI Engineering', 
    builderTitle: 'ALGORITHM NAVIGATOR',
    builderSubtext: 'Turning logic into impact, one line at a time.',
    qrLink: 'https://hhgoa.com',
    barcodeText: 'HHGOA2026-001'
  });
  const [pfpBgImg, setPfpBgImg] = useState<HTMLImageElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef   = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const i2 = new Image(); i2.onload = () => setPfpBgImg(i2); i2.src = '/pfp_frame_transparent.png?t=' + Date.now();
  }, []);

  /* ─── intersection observer (reveal) ─── */
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('anim-in'); obs.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    document.querySelectorAll('[data-anim]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ─── canvas redraw (only for PFP now) ─── */
  useEffect(() => {
    let active = true;
    const draw = async () => {
      if (format !== 'pfp') return; // ID card is DOM-rendered now
      const canvas = canvasRef.current; if (!canvas) return;
      const { w, h } = CANVAS_SIZES['pfp'];
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      drawPFP(ctx, userImg, pfpBgImg);
    };
    document.fonts.ready.then(() => {
      if (active) draw();
    });
    return () => { active = false; };
  }, [format, userImg, cardData, pfpBgImg]);

  /* ─── file handling ─── */
  const loadImg = useCallback((src: string) => {
    const img = new Image();
    img.onload = () => setUserImg(img);
    img.onerror = () => setStatus({ text: 'Could not load image', ok: false });
    img.src = src;
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setIsConverting(true); setStatus(null);
    try {
      let blob: Blob = file;
      if (/heic|heif/i.test(file.type + file.name)) {
        setStatus({ text: 'Converting HEIC...', ok: true });
        blob = await convertHEIC(file);
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPhotoSrc(dataUrl); setPhotoName(file.name); loadImg(dataUrl); setStatus(null);
      };
      reader.onerror = () => {
        setStatus({ text: 'Failed to read image.', ok: false });
      };
      reader.readAsDataURL(blob);
    } catch { setStatus({ text: 'Failed. Try JPG or PNG.', ok: false }); }
    finally { setIsConverting(false); }
  }, [loadImg]);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) handleFile(f); };
  const onDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); };

  const download = async () => {
    setStatus({ text: 'Generating...', ok: true });
    if (format === 'card') {
      const node = document.getElementById('id-card-node');
      if (!node) {
        setStatus({ text: 'Error: Card not found', ok: false });
        return;
      }
      try {
        // Need to temporarily unscale it for export
        const oldTransform = node.style.transform;
        node.style.transform = 'none';
        await document.fonts.ready;
        const dataUrl = await htmlToImage.toPng(node, {
          quality: 1,
          width: 682,
          height: 1024,
          pixelRatio: 2,
          cacheBust: true,
        });
        node.style.transform = oldTransform;
        
        const a = document.createElement('a');
        a.download = 'hh-goa-card.png';
        a.href = dataUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (err) {
        console.error("Export failed", err);
        setStatus({ text: 'Export failed. Please try again.', ok: false });
        return;
      }
    } else {
      const c = canvasRef.current; 
      if (!c) {
        setStatus({ text: 'Error: Canvas not found', ok: false });
        return;
      }
      const a = document.createElement('a');
      a.download = 'hh-goa-pfp.png';
      a.href = c.toDataURL('image/png');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    setStatus({ text: '✓ Downloaded', ok: true });
    setTimeout(() => setStatus(null), 3000);
  };

  const shareX = () => {
    const txt = encodeURIComponent(`Just got my HH Goa 2026 builder card! 🌴\n\nShipping in paradise this Oct. See you there 👀\n\n#FrameInGoa #HackerHouseGoa`);
    const url = `https://twitter.com/intent/tweet?text=${txt}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const hasPhoto = !!userImg;
  const sz = CANVAS_SIZES[format];

  return (
    <PageTransition>
      <div style={{ paddingTop: 'var(--nav-h)', minHeight: '80vh' }}>
        <section className="gen-section" style={{ borderTop: 'none' }}>
          <div className="gen-header">
            <h2 className="section-title" data-anim="up">Claim your access.</h2>
            <p style={{ color: 'var(--beige-mute)', marginBottom: 32 }} data-anim="up" data-delay="1">
              Generate your personalized HH Goa 2026 boarding pass and profile frame.
            </p>

            <div className="gen-format-toggle" data-anim="up" data-delay="2">
              <button className={`gen-toggle-btn${format === 'card' ? ' active' : ''}`} onClick={() => setFormat('card')}>
                ID Card (2:3)
              </button>
              <button className={`gen-toggle-btn${format === 'pfp' ? ' active' : ''}`} onClick={() => setFormat('pfp')}>
                PFP Frame (1:1)
              </button>
            </div>
          </div>

          <div className="gen-body" data-anim="fade" data-delay="3">
            {/* Left: upload + form */}
            <div className="upload-panel">
              <p className="panel-heading">1. Select Photo</p>
              {photoSrc ? (
                <div className="photo-thumb-row" onClick={() => fileRef.current?.click()} tabIndex={0} role="button">
                  <img className="photo-thumb-img" src={photoSrc} alt="Your uploaded photo" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="photo-thumb-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{photoName}</div>
                  </div>
                  <span className="photo-thumb-action">Change</span>
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" style={{ display: 'none' }} onChange={onFileChange} />
                </div>
              ) : (
                <label className={`upload-zone${isDragOver ? ' drag-over' : ''}`} onDrop={onDrop} onDragOver={e => { e.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)}>
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" onChange={onFileChange} style={{ display: 'none' }} />
                  <div className="upload-icon">{isConverting ? '⏳' : '📷'}</div>
                  <div className="upload-title">{isConverting ? 'Processing...' : 'Upload your best headshot'}</div>
                  <div className="upload-sub">JPG, PNG, WebP, HEIC supported</div>
                </label>
              )}

              {format === 'card' && (
                <>
                  <p className="panel-heading" style={{ marginTop: 40 }}>2. Enter Details</p>
                  <div className="field-group">
                    <div>
                      <label className="field-label" htmlFor="field-name">Name</label>
                      <input id="field-name" className="field-input" type="text" placeholder="Prateek Vijay" maxLength={28}
                        value={cardData.name} onChange={e => setCardData(d => ({ ...d, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="field-stack">Stack / Role (Comma separated)</label>
                      <input id="field-stack" className="field-input" type="text" placeholder="Python, Machine Learning, UI/UX" maxLength={100}
                        value={cardData.stackRoleList} onChange={e => setCardData(d => ({ ...d, stackRoleList: e.target.value }))} />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="field-title">Builder Title</label>
                      <input id="field-title" className="field-input" type="text" placeholder="Algorithm Navigator" maxLength={30}
                        value={cardData.builderTitle} onChange={e => setCardData(d => ({ ...d, builderTitle: e.target.value }))} />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="field-subtext">Builder Title Subtext</label>
                      <input id="field-subtext" className="field-input" type="text" placeholder="Turning logic into impact, one line at a time." maxLength={50}
                        value={cardData.builderSubtext} onChange={e => setCardData(d => ({ ...d, builderSubtext: e.target.value }))} />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="field-qr">QR Code Link / Text</label>
                      <input id="field-qr" className="field-input" type="text" placeholder="https://hhgoa.com"
                        value={cardData.qrLink} onChange={e => setCardData(d => ({ ...d, qrLink: e.target.value }))} />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="field-barcode">Barcode Text</label>
                      <input id="field-barcode" className="field-input" type="text" placeholder="HHGOA2026" maxLength={20}
                        value={cardData.barcodeText} onChange={e => setCardData(d => ({ ...d, barcodeText: e.target.value }))} />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right: preview */}
            <div className="preview-panel">
              <p className="panel-heading" style={{ alignSelf: 'flex-start' }}>Preview</p>
              
              {format === 'card' ? (
                <div style={{ width: 682 * 0.45, height: 1024 * 0.45, position: 'relative', margin: '0 auto' }}>
                  <div style={{ transform: 'scale(0.45)', transformOrigin: 'top left', width: 682, height: 1024, position: 'absolute', top: 0, left: 0 }}>
                    <IdCard data={cardData} userPhoto={photoSrc} />
                  </div>
                </div>
              ) : (
                <div className="preview-wrap">
                  {!hasPhoto && (
                    <div className="preview-empty">
                      <span style={{ fontSize: '2rem', marginBottom: 10 }}>📷</span>
                      <span>Upload a photo</span>
                    </div>
                  )}
                  <canvas ref={canvasRef} id="preview-canvas" width={sz.w} height={sz.h} />
                </div>
              )}
            </div>
          </div>

          <div className="gen-actions">
            <button className="btn btn-primary" onClick={download} disabled={format === 'pfp' && !hasPhoto}>↓ Download</button>
            <button className="btn btn-pink" onClick={shareX}>Share to X</button>
          </div>
          {status && (
            <div style={{ textAlign: 'center', paddingBottom: 20, color: status.ok ? 'var(--yellow)' : 'var(--pink)', fontWeight: 'bold' }}>
              {status.text}
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  );
}
