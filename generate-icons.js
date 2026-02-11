const { createCanvas } = require('canvas');
const fs = require('fs');

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const s = size;

  // Black background (matches app OLED dark theme)
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, s, s);

  // Scale factor
  const unit = s / 100;

  // Optical center (shifted up slightly for iOS icon mask)
  const cx = s * 0.48;
  const cy = s * 0.47;

  // --- COLORS ---
  const bananaColor = '#5EC490';       // App green
  const bananaHighlight = '#6DD69E';   // Lighter green highlight
  const outlineColor = '#2D6B4A';      // Dark green outline
  const stemColor = '#3D7A57';         // Stem dark green

  // Stroke weight — thicker for small sizes for legibility
  const strokeW = size <= 64 ? Math.max(s * 0.03, 2) : Math.max(s * 0.02, 2);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // --- BANANA BODY ---
  // Classic banana shape: pronounced crescent curve, wide belly bowing right,
  // narrow tips at top and bottom, tilted ~30deg upper-right to lower-left
  function drawBananaBody() {
    ctx.beginPath();

    // Start at the top tip (narrow, upper-right)
    ctx.moveTo(cx + 10 * unit, cy - 30 * unit);

    // Outer curve (right/back side) — the defining banana arc
    // This bows far to the right, creating the crescent shape
    ctx.bezierCurveTo(
      cx + 24 * unit, cy - 20 * unit,   // cp1: pulls far right and down
      cx + 26 * unit, cy + 4 * unit,    // cp2: maximum belly, far right
      cx + 10 * unit, cy + 24 * unit    // end: curves back in toward bottom tip
    );

    // Bottom tip — rounded, curves left
    ctx.bezierCurveTo(
      cx + 4 * unit, cy + 30 * unit,    // cp1: sweeps down
      cx - 6 * unit, cy + 32 * unit,    // cp2: pulls left
      cx - 12 * unit, cy + 28 * unit    // end: bottom-left tip
    );

    // Inner curve (left/belly side) — concave, tighter curve back up
    ctx.bezierCurveTo(
      cx - 6 * unit, cy + 20 * unit,    // cp1: tucks in from tip
      cx + 2 * unit, cy + 4 * unit,     // cp2: belly of inner curve
      cx + 2 * unit, cy - 10 * unit     // end: mid-body heading up
    );

    // Continue inner curve back to top tip
    ctx.bezierCurveTo(
      cx + 2 * unit, cy - 20 * unit,    // cp1: straight up
      cx + 5 * unit, cy - 28 * unit,    // cp2: narrowing toward tip
      cx + 10 * unit, cy - 30 * unit    // end: close at top tip
    );

    ctx.closePath();
  }

  // Fill banana body
  drawBananaBody();
  ctx.fillStyle = bananaColor;
  ctx.fill();

  // Inner ridge line (the natural seam running along the banana)
  ctx.beginPath();
  ctx.moveTo(cx + 6 * unit, cy - 22 * unit);
  ctx.bezierCurveTo(
    cx + 4 * unit, cy - 8 * unit,
    cx + 0 * unit, cy + 8 * unit,
    cx - 4 * unit, cy + 22 * unit
  );
  ctx.strokeStyle = outlineColor;
  ctx.lineWidth = strokeW * 0.7;
  ctx.stroke();

  // Subtle highlight on the outer curve (lighter strip catching light)
  ctx.beginPath();
  ctx.moveTo(cx + 14 * unit, cy - 20 * unit);
  ctx.bezierCurveTo(
    cx + 22 * unit, cy - 10 * unit,
    cx + 22 * unit, cy + 2 * unit,
    cx + 14 * unit, cy + 18 * unit
  );
  ctx.strokeStyle = bananaHighlight;
  ctx.lineWidth = strokeW * 2.0;
  ctx.globalAlpha = 0.3;
  ctx.stroke();
  ctx.globalAlpha = 1.0;

  // Outline the banana body
  drawBananaBody();
  ctx.strokeStyle = outlineColor;
  ctx.lineWidth = strokeW;
  ctx.stroke();

  // --- STEM ---
  ctx.beginPath();
  ctx.moveTo(cx + 10 * unit, cy - 30 * unit);
  ctx.bezierCurveTo(
    cx + 11 * unit, cy - 33 * unit,
    cx + 10 * unit, cy - 36 * unit,
    cx + 7 * unit, cy - 38 * unit
  );
  ctx.strokeStyle = stemColor;
  ctx.lineWidth = strokeW * 1.6;
  ctx.stroke();

  // Stem cap (small bulb at top)
  ctx.beginPath();
  ctx.arc(cx + 7 * unit, cy - 38.5 * unit, strokeW * 1.0, 0, Math.PI * 2);
  ctx.fillStyle = stemColor;
  ctx.fill();

  return canvas.toBuffer('image/png');
}

// Generate all icon sizes including small sizes for optimization
const sizes = [1024, 512, 192, 180, 64, 48, 32];
sizes.forEach(size => {
  const buffer = generateIcon(size);
  let filename;
  if (size === 180) {
    filename = 'apple-touch-icon.png';
  } else {
    filename = `icon-${size}.png`;
  }
  fs.writeFileSync(filename, buffer);
  console.log(`Created ${filename} (${size}x${size})`);
});

console.log('Icons generated!');
