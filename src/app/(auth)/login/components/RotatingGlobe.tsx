'use client';

import React, { useEffect, useRef } from 'react';
import worldPointsData from './worldPoints.json';

// Global Trade Hubs
const HUBS = [
  { name: 'New York', lon: -74.0, lat: 40.7 },
  { name: 'London', lon: -0.1, lat: 51.5 },
  { name: 'Frankfurt', lon: 8.7, lat: 50.1 },
  { name: 'Tokyo', lon: 139.7, lat: 35.7 },
  { name: 'Singapore', lon: 103.8, lat: 1.3 },
  { name: 'Sao Paulo', lon: -46.6, lat: -23.5 },
  { name: 'Dubai', lon: 55.3, lat: 25.2 },
  { name: 'Sydney', lon: 151.2, lat: -33.9 },
];

// Great-circle Trade Route Pairs
const ROUTES = [
  [0, 1], // New York <-> London
  [1, 2], // London <-> Frankfurt
  [2, 6], // Frankfurt <-> Dubai
  [6, 4], // Dubai <-> Singapore
  [4, 3], // Singapore <-> Tokyo
  [0, 5], // New York <-> Sao Paulo
  [4, 7], // Singapore <-> Sydney
];

// Convert degree to radian
const toRad = (deg: number) => (deg * Math.PI) / 180;

// Intermediate points along a Great Circle for realistic curved routes
function calculateGreatCircleArc(
  p1: { lon: number; lat: number },
  p2: { lon: number; lat: number },
  steps = 20
) {
  const pts: { lon: number; lat: number }[] = [];
  const lon1 = toRad(p1.lon);
  const lat1 = toRad(p1.lat);
  const lon2 = toRad(p2.lon);
  const lat2 = toRad(p2.lat);

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2
      )
    );

  if (d === 0) return [{ lon: p1.lon, lat: p1.lat }];

  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lon = Math.atan2(y, x);
    pts.push({ lon: (lon * 180) / Math.PI, lat: (lat * 180) / Math.PI });
  }
  return pts;
}

export function RotatingGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotation = 0; // Current longitude rotation in radians
    const rotSpeed = 0.0035; // Continuous smooth rotation (~30s full revolution)
    const axialTilt = -0.22; // ~-12.6 degree realistic Earth axis tilt

    // Precompute route arc paths
    const precomputedRoutes = ROUTES.map(([i1, i2]) =>
      calculateGreatCircleArc(HUBS[i1], HUBS[i2], 18)
    );

    // Precompute background cosmic dust / star pinpoints
    const stars = Array.from({ length: 48 }, () => ({
      x: Math.random() * 600,
      y: Math.random() * 600,
      size: Math.random() * 1.5 + 0.6,
      opacity: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      phase: Math.random() * Math.PI * 2,
    }));

    // Sizing parameters - Perfectly centered within 600x600 canvas
    const size = 600;
    const cx = 300;
    const cy = 300;
    const R = 196; // Globe radius

    // Handle high-DPI displays
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let lastTime = performance.now();

    function render(now: number) {
      if (!ctx) return;
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Update rotation
      rotation += rotSpeed;
      if (rotation > Math.PI * 2) rotation -= Math.PI * 2;

      ctx.clearRect(0, 0, size, size);

      // ── 1. Background Cosmic Stars & Ambient Pink Dust ──
      stars.forEach((star) => {
        const pulse = 0.7 + 0.3 * Math.sin(now * 0.002 * star.pulseSpeed * 60 + star.phase);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 185, 205, ${star.opacity * pulse})`;
        ctx.fill();
      });

      // ── 2. Atmospheric Outer Halo (Planetary Magenta Glow) ──
      const atmGlow = ctx.createRadialGradient(
        cx + R * 0.15,
        cy - R * 0.15,
        R * 0.9,
        cx,
        cy,
        R * 1.32
      );
      atmGlow.addColorStop(0, 'rgba(255, 77, 121, 0.25)');
      atmGlow.addColorStop(0.5, 'rgba(232, 93, 117, 0.1)');
      atmGlow.addColorStop(1, 'rgba(232, 93, 117, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = atmGlow;
      ctx.fill();

      // ── 3. Base Globe Body (Deep Obsidian Plum Sphere) ──
      const sphereGrad = ctx.createRadialGradient(
        cx - R * 0.25,
        cy - R * 0.25,
        R * 0.1,
        cx,
        cy,
        R
      );
      sphereGrad.addColorStop(0, '#2D0E22');
      sphereGrad.addColorStop(0.45, '#1B0816');
      sphereGrad.addColorStop(0.8, '#12040E');
      sphereGrad.addColorStop(1, '#090207');

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();
      ctx.clip(); // Clip all continents & routes to sphere horizon

      // ── 4. Latitude / Longitude 3D Graticule Rings ──
      ctx.strokeStyle = 'rgba(232, 93, 117, 0.08)';
      ctx.lineWidth = 1;
      [-40, -20, 0, 20, 40].forEach((lat) => {
        const rad = toRad(lat);
        const yOff = -R * Math.sin(rad) * Math.cos(axialTilt);
        const rx = R * Math.cos(rad);
        const ry = rx * Math.sin(axialTilt + 0.35);
        ctx.beginPath();
        ctx.ellipse(cx, cy + yOff, rx, Math.abs(ry), 0, 0, Math.PI * 2);
        ctx.stroke();
      });

      // ── 6. Project & Render 3D Dotted Continents ──
      const cosTilt = Math.cos(axialTilt);
      const sinTilt = Math.sin(axialTilt);

      const pts = worldPointsData as [number, number][];
      for (let i = 0; i < pts.length; i++) {
        const lon = pts[i][0];
        const lat = pts[i][1];

        const lonRad = toRad(lon) + rotation;
        const latRad = toRad(lat);

        // 3D coordinates on unit sphere
        const cosLat = Math.cos(latRad);
        const sinLat = Math.sin(latRad);
        const cosLon = Math.cos(lonRad);
        const sinLon = Math.sin(lonRad);

        const x0 = R * cosLat * sinLon;
        const y0 = -R * sinLat;
        const z0 = R * cosLat * cosLon;

        // Apply axial tilt
        const x1 = x0 * cosTilt - y0 * sinTilt;
        const y1 = x0 * sinTilt + y0 * cosTilt;
        const z1 = z0;

        // Visible on front hemisphere
        if (z1 > -R * 0.05) {
          const depth = Math.max(0, z1 / R); // 0 at horizon, 1 at center
          const dotRadius = 0.95 + 1.5 * depth;
          const alpha = 0.35 + 0.65 * depth;

          ctx.beginPath();
          ctx.arc(cx + x1, cy + y1, dotRadius, 0, Math.PI * 2);
          if (depth > 0.68) {
            ctx.fillStyle = `rgba(255, 140, 175, ${alpha})`;
          } else {
            ctx.fillStyle = `rgba(232, 93, 117, ${alpha})`;
          }
          ctx.fill();

          // Sparkle peak dots facing viewer
          if (depth > 0.85 && i % 6 === 0) {
            ctx.beginPath();
            ctx.arc(cx + x1, cy + y1, dotRadius * 0.65, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
            ctx.fill();
          }
        }
      }

      // ── 7. Great Circle Global Trade Routes & Traveling Pulses ──
      const packetTime = (now * 0.001) % 1;

      precomputedRoutes.forEach((routePts, rIdx) => {
        let drawing = false;
        ctx.beginPath();

        routePts.forEach((pt) => {
          const lonRad = toRad(pt.lon) + rotation;
          const latRad = toRad(pt.lat);

          const cosLat = Math.cos(latRad);
          const sinLat = Math.sin(latRad);
          const cosLon = Math.cos(lonRad);
          const sinLon = Math.sin(lonRad);

          const x0 = R * cosLat * sinLon;
          const y0 = -R * sinLat;
          const z0 = R * cosLat * cosLon;

          const x1 = x0 * cosTilt - y0 * sinTilt;
          const y1 = x0 * sinTilt + y0 * cosTilt;
          const z1 = z0;

          if (z1 > 0) {
            const px = cx + x1;
            const py = cy + y1;
            if (!drawing) {
              ctx.moveTo(px, py);
              drawing = true;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            drawing = false;
          }
        });

        ctx.strokeStyle = 'rgba(255, 105, 140, 0.6)';
        ctx.lineWidth = 1.3;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Traveling Data Packet along route
        const pIdx = Math.floor(((packetTime + rIdx * 0.18) % 1) * (routePts.length - 1));
        const pPt = routePts[pIdx];
        if (pPt) {
          const lonRad = toRad(pPt.lon) + rotation;
          const latRad = toRad(pPt.lat);
          const cosLat = Math.cos(latRad);
          const sinLat = Math.sin(latRad);
          const cosLon = Math.cos(lonRad);
          const sinLon = Math.sin(lonRad);

          const x0 = R * cosLat * sinLon;
          const y0 = -R * sinLat;
          const z0 = R * cosLat * cosLon;

          const x1 = x0 * cosTilt - y0 * sinTilt;
          const y1 = x0 * sinTilt + y0 * cosTilt;
          const z1 = z0;

          if (z1 > 0) {
            const px = cx + x1;
            const py = cy + y1;
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 105, 140, 0.4)';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(px, py, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
          }
        }
      });

      // ── 8. Global Trade Hubs, Pulsing Beacons & 4-Point Star Glints ──
      HUBS.forEach((hub, hIdx) => {
        const lonRad = toRad(hub.lon) + rotation;
        const latRad = toRad(hub.lat);

        const cosLat = Math.cos(latRad);
        const sinLat = Math.sin(latRad);
        const cosLon = Math.cos(lonRad);
        const sinLon = Math.sin(lonRad);

        const x0 = R * cosLat * sinLon;
        const y0 = -R * sinLat;
        const z0 = R * cosLat * cosLon;

        const x1 = x0 * cosTilt - y0 * sinTilt;
        const y1 = x0 * sinTilt + y0 * cosTilt;
        const z1 = z0;

        if (z1 > 0) {
          const depth = z1 / R;
          const px = cx + x1;
          const py = cy + y1;

          // Pulsing ping ring
          const pingPhase = ((now * 0.0018) + hIdx * 0.25) % 1;
          const pingRadius = 3 + pingPhase * 11;
          const pingAlpha = (1 - pingPhase) * depth * 0.75;

          ctx.beginPath();
          ctx.arc(px, py, pingRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 133, 161, ${pingAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Hub Node Halo
          ctx.beginPath();
          ctx.arc(px, py, 3.2 * depth + 1.2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 83, 118, 0.45)';
          ctx.fill();

          // Core Hub Node
          ctx.beginPath();
          ctx.arc(px, py, 1.8 * depth + 0.8, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();

          // 4-Point Sparkle Flare on prominent front-facing hubs
          if (depth > 0.6) {
            const flareLen = (6 + 4 * depth);
            const flareAlpha = 0.55 * depth;
            ctx.strokeStyle = `rgba(255, 255, 255, ${flareAlpha})`;
            ctx.lineWidth = 1;
            // Horizontal beam
            ctx.beginPath();
            ctx.moveTo(px - flareLen, py);
            ctx.lineTo(px + flareLen, py);
            ctx.stroke();
            // Vertical beam
            ctx.beginPath();
            ctx.moveTo(px, py - flareLen);
            ctx.lineTo(px, py + flareLen);
            ctx.stroke();
          }
        }
      });

      // Subtle shadow on lower-left hemisphere (gives 3D depth)
      const shadowGrad = ctx.createRadialGradient(
        cx - R * 0.5,
        cy + R * 0.5,
        R * 0.15,
        cx,
        cy,
        R
      );
      shadowGrad.addColorStop(0, 'rgba(9, 2, 7, 0.45)');
      shadowGrad.addColorStop(0.7, 'rgba(9, 2, 7, 0.15)');
      shadowGrad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = shadowGrad;
      ctx.fill();

      ctx.restore(); // Restore clip

      // ── 9. Luminous Atmospheric Rim Stroke ──
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 115, 145, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // ── 10. Multi-Angle 3D Orbital Network Rings & Satellites ──
      const orbitTime = now * 0.0006;

      // Orbit 1: Major ellipse tilted -28 deg
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.48);
      ctx.beginPath();
      ctx.ellipse(0, 0, R * 1.18, R * 0.52, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(232, 93, 117, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Satellites on Orbit 1
      [0, Math.PI * 0.65, Math.PI * 1.35].forEach((offset) => {
        const satAngle = orbitTime * 1.2 + offset;
        const satX = R * 1.18 * Math.cos(satAngle);
        const satY = R * 0.52 * Math.sin(satAngle);

        ctx.beginPath();
        ctx.arc(satX, satY, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 133, 161, 0.3)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(satX, satY, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(satX, satY, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = '#FF5376';
        ctx.fill();
      });
      ctx.restore();

      // Orbit 2: Secondary ellipse tilted +37 deg (Counter-spinning)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(0.65);
      ctx.beginPath();
      ctx.ellipse(0, 0, R * 1.25, R * 0.42, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 133, 161, 0.4)';
      ctx.lineWidth = 1.0;
      ctx.setLineDash([3, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Satellites on Orbit 2
      [Math.PI * 0.3, Math.PI * 1.1, Math.PI * 1.7].forEach((offset) => {
        const satAngle = -orbitTime * 0.9 + offset;
        const satX = R * 1.25 * Math.cos(satAngle);
        const satY = R * 0.42 * Math.sin(satAngle);

        ctx.beginPath();
        ctx.arc(satX, satY, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(232, 93, 117, 0.25)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(satX, satY, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      });
      ctx.restore();

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
      <canvas
        ref={canvasRef}
        className="w-[420px] xl:w-[500px] 2xl:w-[560px] h-[420px] xl:h-[500px] 2xl:h-[560px]"
        style={{ width: '100%', height: '100%', maxWidth: '580px', maxHeight: '580px' }}
      />
    </div>
  );
}