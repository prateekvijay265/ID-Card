import QRCode from 'qrcode';

export type Format = 'pfp' | 'card';

export interface CardData {
  name: string;
  stackRoleList: string; // Comma separated list of stack/role items
  builderTitle: string; 
  builderSubtext: string;
  qrLink: string;       // URL for QR code
  barcodeText: string;  // Text for barcode
}

export const CANVAS_SIZES = {
  pfp:  { w: 1080, h: 1080 },
  card: { w: 1080, h: 1350 },
};

const C = {
  green:      '#0C2318',
  teal:       '#16504b',
  yellow:     '#f7a600', // orange-ish yellow
  orange:     '#d15222',
  beige:      '#ebd9be',
  paper:      '#f1e6cf',
  white:      '#FFFFFF',
  black:      '#000000',
};

// Cover-crop: fill rect with image, center-cropped
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number, y: number, w: number, h: number,
) {
  const iAr = img.naturalWidth / img.naturalHeight;
  const tAr = w / h;
  let sw = img.naturalWidth, sh = img.naturalHeight, sx = 0, sy = 0;
  if (iAr > tAr) { sw = sh * tAr; sx = (img.naturalWidth - sw) / 2; }
  else            { sh = sw / tAr; sy = (img.naturalHeight - sh) / 2; }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function clipCircle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ══════════════════════════════════════════════════════════════
// PFP FORMAT — 1080×1080 (Keeping the previous one)
// ══════════════════════════════════════════════════════════════
export function drawPFP(
  ctx: CanvasRenderingContext2D,
  userImg: HTMLImageElement | null,
  bgImg: HTMLImageElement | null
) {
  const W = 1080, H = 1080;
  
  // Clear canvas
  ctx.fillStyle = '#0F3820'; // Matching green just in case
  ctx.fillRect(0, 0, W, H);

  if (bgImg && userImg) {
    // 1. Draw the user photo FIRST (behind the frame)
    // Draw it large enough (750x750) to fully cover the transparent hole and bleed safely behind the HACKER HOUSE badge
    ctx.save();
    const cx = 540;
    const cy = 496; // Center of the gold ring
    const boxSize = 750;
    drawCover(ctx, userImg, cx - boxSize/2, cy - boxSize/2, boxSize, boxSize);
    ctx.restore();

    // 2. Draw the transparent PNG frame ON TOP!
    // Because bgImg is now a transparent PNG, the frame naturally overlaps the photo
    // and the HACKER text perfectly covers the bottom of the user's photo!
    drawCover(ctx, bgImg, 0, 0, W, H);
  } else if (bgImg) {
    // No user photo? Just draw the background normally
    drawCover(ctx, bgImg, 0, 0, W, H);
  }
}

// ══════════════════════════════════════════════════════════════
// NEW BUILDER ID CARD (Vintage Poster Style) — 1080×1350
// ══════════════════════════════════════════════════════════════
export async function drawCard(
  ctx: CanvasRenderingContext2D,
  userImg: HTMLImageElement | null,
  data: CardData,
  bgImg: HTMLImageElement | null
) {
  const W = 1080, H = 1350;
  
  // 1. Background
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, W, H);

  // Background Image (bottom half, tropical scene)
  if (bgImg) {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    const bgH = H * 0.45;
    drawCover(ctx, bgImg, 0, H - bgH - 60, W, bgH + 60);
    // Gradient fade from beige to transparent to blend the top of the image
    const fade = ctx.createLinearGradient(0, H - bgH - 60, 0, H - bgH + 100);
    fade.addColorStop(0, C.paper);
    fade.addColorStop(1, 'transparent');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = fade;
    ctx.fillRect(0, H - bgH - 60, W, 160);
    ctx.restore();
  }

  // Border Outer Dark Green
  ctx.strokeStyle = C.green;
  ctx.lineWidth = 14;
  roundRect(ctx, 15, 15, W - 30, H - 30, 24);
  ctx.stroke();

  // Tiny corner yellow stars
  ctx.fillStyle = C.yellow;
  const drawStar = (x: number, y: number) => {
    ctx.font = '16px "Space Mono"';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('✦', x, y);
  };
  drawStar(25, 25); drawStar(W - 25, 25);
  drawStar(25, H - 25); drawStar(W - 25, H - 25);

  // 2. Header Area
  // Left: Palm Tree & HH Goa 2026
  ctx.font = '60px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText('🌴', 160, 60);
  
  ctx.font = 'bold 44px "Space Mono", monospace';
  ctx.fillStyle = C.white;
  ctx.fillText('HH', 160, 130);
  ctx.fillStyle = C.green;
  ctx.fillText('HH', 160, 130); // Need shadow/outline? Just solid green
  ctx.fillStyle = C.yellow;
  ctx.fillText('GOA', 160, 180);
  ctx.fillStyle = C.teal;
  ctx.fillText('2026', 160, 230);

  // Wavy lines under palm tree
  ctx.beginPath();
  let wx = 80;
  ctx.moveTo(wx, 120);
  for (let i=0; i<4; i++) {
    ctx.quadraticCurveTo(wx + 20, 100, wx + 40, 120);
    wx += 40;
  }
  ctx.strokeStyle = C.yellow;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Center: "HACKER HOUSE"
  ctx.textAlign = 'left';
  ctx.fillStyle = C.green;
  ctx.font = 'bold 160px "Bebas Neue", "Impact", sans-serif';
  ctx.fillText('HACKER', 360, 60);
  ctx.fillText('HOUSE', 640, 200);

  // Hindi "गोवा"
  ctx.fillStyle = C.orange;
  ctx.font = 'italic bold 140px "DM Serif Display", serif';
  ctx.fillText('गोवा', 400, 200);

  // Right Stamp "BUILD IN GOA / SHIP FROM PARADISE"
  const stampCx = W - 140;
  const stampCy = 140;
  ctx.strokeStyle = C.green;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(stampCx, stampCy, 80, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(stampCx, stampCy, 72, 0, Math.PI * 2); ctx.stroke();
  
  ctx.font = '50px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('🌴', stampCx, stampCy);

  ctx.fillStyle = C.green;
  ctx.font = 'bold 14px "Space Mono", monospace';
  const textStamp1 = 'BUILD IN GOA • ';
  const textStamp2 = 'SHIP FROM PARADISE • ';
  ctx.save();
  ctx.translate(stampCx, stampCy);
  for (let i=0; i<textStamp1.length; i++) {
    ctx.save(); ctx.rotate(-Math.PI/2 + (i - textStamp1.length/2)*0.25);
    ctx.fillText(textStamp1[i], 0, -60); ctx.restore();
  }
  for (let i=0; i<textStamp2.length; i++) {
    ctx.save(); ctx.rotate(Math.PI/2 - (textStamp2.length/2 - i)*0.22);
    ctx.fillText(textStamp2[i], 0, 60); ctx.restore();
  }
  ctx.restore();

  // Pinned Note "Let's Build:"
  ctx.save();
  ctx.translate(W - 220, 400);
  ctx.rotate(-0.1);
  ctx.fillStyle = '#dda85e'; // darker beige
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 10; ctx.shadowOffsetX = 4; ctx.shadowOffsetY = 4;
  ctx.fillRect(-80, -60, 160, 100);
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = C.green;
  ctx.font = 'italic 32px "DM Serif Display", serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText("Let's", 0, -20);
  ctx.fillText("Build:", 0, 20);
  ctx.restore();

  // 3. Photo Section
  const pCx = 260;
  const pCy = 480;
  const pR = 210;

  ctx.save();
  ctx.beginPath(); ctx.arc(pCx, pCy, pR + 12, 0, Math.PI * 2);
  ctx.fillStyle = C.green;
  ctx.fill();
  ctx.beginPath(); ctx.arc(pCx, pCy, pR + 4, 0, Math.PI * 2);
  ctx.fillStyle = C.yellow;
  ctx.fill();
  
  clipCircle(ctx, pCx, pCy, pR);
  if (userImg) {
    drawCover(ctx, userImg, pCx - pR, pCy - pR, pR * 2, pR * 2);
  } else {
    ctx.fillStyle = C.white;
    ctx.fillRect(pCx - pR, pCy - pR, pR * 2, pR * 2);
  }
  ctx.restore();

  // 4. Name & Role Pills
  const rx = 520;
  let ry = 480;

  // Name Pill
  ctx.fillStyle = C.green;
  roundRect(ctx, rx, ry, 480, 60, 16);
  ctx.fill();
  ctx.fillStyle = C.white;
  ctx.font = 'bold 36px "Space Mono", monospace';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText((data.name || 'YOUR NAME').toUpperCase(), rx + 240, ry + 30);

  ry += 70;
  // Role Pill
  ctx.fillStyle = C.orange;
  roundRect(ctx, rx, ry, 480, 50, 12);
  ctx.fill();
  ctx.fillStyle = C.white;
  ctx.font = 'bold 28px "Space Mono", monospace';
  ctx.fillText((data.stackRoleList || 'FULL STACK DEVELOPER').toUpperCase(), rx + 240, ry + 25);

  // 5. 3-Column Info Grid
  ry += 90;
  
  ctx.strokeStyle = '#c4b69b'; // grid line color
  ctx.lineWidth = 2;
  // Dashed lines between columns
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(rx + 150, ry); ctx.lineTo(rx + 150, ry + 220);
  ctx.moveTo(rx + 330, ry); ctx.lineTo(rx + 330, ry + 220);
  ctx.stroke();
  ctx.setLineDash([]);

  // Col 1: Builder Class
  ctx.textAlign = 'center';
  ctx.fillStyle = C.green;
  ctx.fillRect(rx + 40, ry, 70, 40); // Icon bg
  ctx.fillStyle = C.white;
  ctx.font = 'bold 24px "Space Mono"';
  ctx.fillText('>_', rx + 75, ry + 20);
  
  ctx.fillStyle = C.black;
  ctx.font = 'bold 18px "Space Mono"';
  ctx.fillText('BUILDER', rx + 75, ry + 60);
  ctx.fillText('CLASS', rx + 75, ry + 80);

  ctx.fillStyle = C.teal;
  ctx.font = 'bold 20px "Space Mono"';
  const cTitle = data.builderTitle || 'TERMINAL WIZARD';
  const cWords = cTitle.split(' ');
  ctx.fillText(cWords[0] || 'TERMINAL', rx + 75, ry + 120);
  if (cWords[1]) ctx.fillText(cWords.slice(1).join(' '), rx + 75, ry + 145);

  // Col 2: Beach Bag
  const c2 = rx + 240;
  ctx.font = '36px sans-serif';
  ctx.fillText('🥥', c2, ry + 20); // icon
  
  ctx.fillStyle = C.black;
  ctx.font = 'bold 18px "Space Mono"';
  ctx.fillText('BEACH BAG', c2, ry + 60);

  ctx.font = 'bold 14px "Space Mono"';
  ctx.textAlign = 'left';
  // item 1
  ctx.fillText('🥥', c2 - 60, ry + 110);
  ctx.fillText('COCONUT', c2 - 20, ry + 110);
  // item 2
  ctx.fillStyle = C.green;
  roundRect(ctx, c2 - 60, ry + 130, 30, 20, 4); ctx.fill();
  ctx.fillStyle = C.white;
  ctx.fillText('</>', c2 - 58, ry + 145);
  ctx.fillStyle = C.black;
  ctx.fillText('VS CODE', c2 - 20, ry + 145);
  // item 3
  ctx.fillText('🎧', c2 - 60, ry + 180);
  ctx.fillText('LO-FI BEATS', c2 - 20, ry + 180);

  // Col 3: Currently Shipping
  const c3 = rx + 400;
  ctx.textAlign = 'center';
  ctx.font = 'bold 28px "Space Mono"';
  ctx.fillText('</>', c3, ry + 20); // icon
  
  ctx.fillStyle = C.black;
  ctx.font = 'bold 18px "Space Mono"';
  ctx.fillText('CURRENTLY', c3, ry + 60);
  ctx.fillText('SHIPPING', c3, ry + 80);

  ctx.fillStyle = C.orange;
  ctx.font = 'bold 20px "Space Mono"';
  const sTitle = data.builderSubtext || 'BUILDING THE FUTURE';
  const sWords = sTitle.split(' ');
  let l1 = sWords.slice(0, 2).join(' ');
  let l2 = sWords.slice(2).join(' ');
  if (!l2 && l1.length > 10) {
    l1 = sWords[0];
    l2 = sWords.slice(1).join(' ');
  }
  ctx.fillText(l1, c3, ry + 120);
  if (l2) ctx.fillText(l2, c3, ry + 145);

  // 6. Footer Layout
  const fY = H - 360;

  // Left: Wooden Signs (Simulated)
  ctx.save();
  ctx.translate(60, fY + 40);
  ctx.fillStyle = '#8b5a2b';
  // Pole
  ctx.fillRect(80, -20, 20, 280);
  
  const drawSign = (y: number, text: string) => {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(160, y);
    ctx.lineTo(180, y + 25);
    ctx.lineTo(160, y + 50);
    ctx.lineTo(0, y + 50);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#5c3a21'; ctx.lineWidth = 3; ctx.stroke();
    
    ctx.fillStyle = C.white;
    ctx.font = 'bold 26px "Space Mono"';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, 90, y + 25);
    ctx.fillStyle = '#8b5a2b';
  };
  
  drawSign(0, 'BUILD');
  drawSign(70, 'SHIP');
  drawSign(140, 'REPEAT');
  ctx.restore();

  // Center: QR Code
  // Note: We generate QR as Data URL, then load and draw it
  try {
    const qrUrl = await QRCode.toDataURL(data.qrLink || 'https://hhgoa.com', {
      errorCorrectionLevel: 'M',
      margin: 1,
      color: { dark: C.green, light: C.paper }
    });
    
    // We must wait for the image to load
    const qrImg = new Image();
    await new Promise((resolve, reject) => {
      qrImg.onload = resolve;
      qrImg.onerror = reject;
      qrImg.src = qrUrl;
    });

    const qrSize = 220;
    const qrX = W/2 - qrSize/2 - 40;
    const qrY = fY + 30;
    
    // Draw QR border
    ctx.fillStyle = C.beige; // lighter beige border
    roundRect(ctx, qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 16);
    ctx.fill();
    ctx.strokeStyle = C.green; ctx.lineWidth = 4;
    ctx.stroke();

    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

    // Overlay Palm Tree in center of QR
    ctx.fillStyle = C.paper;
    ctx.fillRect(qrX + qrSize/2 - 25, qrY + qrSize/2 - 25, 50, 50);
    ctx.font = '40px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🌴', qrX + qrSize/2, qrY + qrSize/2);
  } catch (err) {
    console.error("QR Draw Error", err);
  }

  // Right: Builder ID Barcode
  const bcX = W - 420;
  const bcY = fY + 160;
  
  ctx.fillStyle = C.green;
  ctx.font = 'bold 20px "Space Mono"';
  ctx.textAlign = 'center';
  ctx.fillText('BUILDER ID', bcX + 150, bcY);
  ctx.fillText('#HH-GOA-' + (Math.floor(Math.random() * 9000) + 1000), bcX + 150, bcY + 24);

  // Draw fake barcode
  const bw = 300;
  const bh = 50;
  let cx = bcX;
  ctx.fillStyle = C.green;
  while (cx < bcX + bw) {
    const w = Math.random() * 6 + 2;
    if (cx + w > bcX + bw) break;
    ctx.fillRect(cx, bcY + 40, w, bh);
    cx += w + Math.random() * 4 + 2;
  }

  // Bottom text "#FRAMEINGOA"
  ctx.fillStyle = C.green;
  ctx.fillRect(15, H - 70, W - 30, 55);
  ctx.fillStyle = C.yellow;
  ctx.font = 'bold 28px "Space Mono"';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('✦   #FRAMEINGOA   ✦', W/2, H - 42);
}
