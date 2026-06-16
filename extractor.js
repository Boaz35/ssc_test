// extractor.js — paste body into figma_execute (Desktop Bridge) to pull every
// top-level FRAME on the current page into a compact, render-ready spec tree.
// Output is JSON: array of frames, each a nested node tree with absolute-ish
// child offsets (relative to parent), text/font/color/fill/stroke/radius.

function rgba(c) {
  if (!c) return null;
  const r = Math.round(c.r * 255), g = Math.round(c.g * 255), b = Math.round(c.b * 255);
  const a = c.a == null ? 1 : c.a;
  return a >= 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${+a.toFixed(2)})`;
}
function fillStr(fills) {
  if (!fills || !fills.length) return null;
  const f = fills[0];
  if (f.visible === false) return null;
  if (f.type === 'SOLID') return rgba({ ...f.color, a: f.opacity != null ? f.opacity : (f.color.a != null ? f.color.a : 1) });
  if (f.type && f.type.startsWith('GRADIENT')) {
    const stops = (f.gradientStops || []).map(s => `${rgba(s.color)} ${Math.round(s.position * 100)}%`).join(', ');
    const ang = f.type === 'GRADIENT_LINEAR' ? '180deg' : '135deg';
    return `linear-gradient(${ang}, ${stops})`;
  }
  return null;
}
function strokeStr(n) {
  if (!n.strokes || !n.strokes.length) return null;
  const s = n.strokes[0];
  if (s.visible === false || s.type !== 'SOLID') return null;
  return { color: rgba({ ...s.color, a: s.opacity != null ? s.opacity : 1 }), w: n.strokeWeight || 1 };
}
function node(n) {
  const o = { id: n.id, name: n.name, type: n.type, x: Math.round(n.x), y: Math.round(n.y), w: Math.round(n.width), h: Math.round(n.height) };
  if (n.opacity != null && n.opacity < 1) o.opacity = +n.opacity.toFixed(2);
  if ('cornerRadius' in n && typeof n.cornerRadius === 'number' && n.cornerRadius) o.radius = n.cornerRadius;
  if (n.clipsContent) o.clip = true;
  const bg = fillStr(n.fills); if (bg && n.type !== 'TEXT') o.bg = bg;
  const st = strokeStr(n); if (st) o.stroke = st;
  // prototype reactions -> navigation
  if (n.reactions && n.reactions.length) {
    const links = [];
    n.reactions.forEach(r => {
      if (r.action && (r.action.destinationId || r.action.type === 'NODE')) {
        links.push({ trigger: (r.trigger && r.trigger.type) || 'ON_CLICK', dest: r.action.destinationId || null, transition: r.action.transition ? r.action.transition.type : null });
      }
    });
    if (links.length) o.links = links;
  }
  if (n.type === 'TEXT') {
    const s = n.fontName !== figma.mixed ? n.fontName : null;
    o.text = n.characters;
    o.font = {
      family: s ? s.family : 'mixed', style: s ? s.style : 'mixed',
      size: n.fontSize !== figma.mixed ? Math.round(n.fontSize) : 16,
      align: n.textAlignHorizontal,
      lh: (n.lineHeight && n.lineHeight.value) ? Math.round(n.lineHeight.value) : null,
      ls: (n.letterSpacing && n.letterSpacing.value) ? +n.letterSpacing.value.toFixed(2) : 0
    };
    o.color = fillStr(n.fills) || 'rgb(0,0,0)';
  }
  return o;
}
function walk(n, depth, maxDepth) {
  const o = node(n);
  if (depth < maxDepth && 'children' in n && n.children.length) {
    const kids = n.children.filter(c => c.visible !== false).map(c => walk(c, depth + 1, maxDepth));
    if (kids.length) o.children = kids;
  }
  return o;
}
const page = figma.currentPage;
const frames = page.children.filter(n => n.type === 'FRAME');
return frames.map(f => walk(f, 0, 8));
