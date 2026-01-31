const { createCanvas } = require('canvas');
const fs = require('fs');

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  // Coral color
  const coral = '#E8A598';
  ctx.strokeStyle = coral;
  ctx.fillStyle = coral;

  // Scale stroke width based on icon size (24-32px at 1024, scaled down)
  const strokeWidth = size * 0.028;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const centerX = size / 2;
  const centerY = size / 2 + size * 0.05;
  const bowlWidth = size * 0.5;
  const bowlHeight = size * 0.28;

  // Draw bowl (curved bottom, open top)
  ctx.beginPath();
  // Left side of bowl
  ctx.moveTo(centerX - bowlWidth / 2, centerY - bowlHeight * 0.3);
  // Left edge going down
  ctx.lineTo(centerX - bowlWidth / 2 + size * 0.05, centerY + bowlHeight * 0.2);
  // Bottom curve (arc)
  ctx.quadraticCurveTo(centerX, centerY + bowlHeight * 0.7, centerX + bowlWidth / 2 - size * 0.05, centerY + bowlHeight * 0.2);
  // Right edge going up
  ctx.lineTo(centerX + bowlWidth / 2, centerY - bowlHeight * 0.3);
  ctx.stroke();

  // Draw 3 circular food shapes inside bowl
  const foodRadius = size * 0.055;
  const foodY = centerY + bowlHeight * 0.05;

  // Left food circle
  ctx.beginPath();
  ctx.arc(centerX - bowlWidth * 0.22, foodY, foodRadius, 0, Math.PI * 2);
  ctx.fill();

  // Center food circle
  ctx.beginPath();
  ctx.arc(centerX, foodY - size * 0.02, foodRadius, 0, Math.PI * 2);
  ctx.fill();

  // Right food circle
  ctx.beginPath();
  ctx.arc(centerX + bowlWidth * 0.22, foodY, foodRadius, 0, Math.PI * 2);
  ctx.fill();

  // Draw 2 wavy steam lines using bezier curves
  const steamStartY = centerY - bowlHeight * 0.45;
  const steamHeight = size * 0.18;
  const steamWaveWidth = size * 0.04;

  // Left steam line
  ctx.beginPath();
  ctx.moveTo(centerX - size * 0.08, steamStartY);
  ctx.bezierCurveTo(
    centerX - size * 0.08 - steamWaveWidth, steamStartY - steamHeight * 0.33,
    centerX - size * 0.08 + steamWaveWidth, steamStartY - steamHeight * 0.66,
    centerX - size * 0.08, steamStartY - steamHeight
  );
  ctx.stroke();

  // Right steam line
  ctx.beginPath();
  ctx.moveTo(centerX + size * 0.08, steamStartY);
  ctx.bezierCurveTo(
    centerX + size * 0.08 + steamWaveWidth, steamStartY - steamHeight * 0.33,
    centerX + size * 0.08 - steamWaveWidth, steamStartY - steamHeight * 0.66,
    centerX + size * 0.08, steamStartY - steamHeight
  );
  ctx.stroke();

  return canvas.toBuffer('image/png');
}

// Generate icons
const sizes = [1024, 512, 192, 180];
sizes.forEach(size => {
  const buffer = generateIcon(size);
  const filename = size === 180 ? 'apple-touch-icon.png' : `icon-${size}.png`;
  fs.writeFileSync(filename, buffer);
  console.log(`Created ${filename}`);
});

console.log('Icons generated!');
