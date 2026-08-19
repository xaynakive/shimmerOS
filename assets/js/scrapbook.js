/* ===== ShimmerOS · Scrapbook =====
   A tiny frontend paint app with emoji stickers. No image assets, no backend. */
(function () {
  'use strict';

  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  // ---- State ----
  const state = {
    tool: 'brush',
    color: '#8b8fd9',
    size: 6,
    paper: '#ffffff',
    sticker: '😺',
    drawing: false,
    startX: 0,
    startY: 0,
    snapshot: null   // for live shape preview
  };

  // ---- Palettes (soft / dreamy) ----
  const COLORS = [
    ['Ink',        '#3a3550'],
    ['Lilac',      '#b6a4e6'],
    ['Lavender',   '#8b8fd9'],
    ['Dusky',      '#6f6aa8'],
    ['Icy blue',   '#a9d3f0'],
    ['Sky',        '#7fb8e6'],
    ['Mint',       '#a9e0c9'],
    ['Sage',       '#bcd3a8'],
    ['Peach',      '#f5c9a6'],
    ['Golden',     '#f0c46a'],
    ['Rose',       '#efa9bd'],
    ['Cherry',     '#e0708f'],
    ['Cream',      '#f7f0e2'],
    ['White',      '#ffffff']
  ];

  const PAPERS = [
    ['White', '#ffffff'],
    ['Cream', '#fbf5e9'],
    ['Blush', '#fcecef'],
    ['Mint',  '#eaf6ef'],
    ['Sky',   '#eaf2fb'],
    ['Lilac', '#f1edfb']
  ];

  const STICKERS = [
    '😺','😻','😸','🙀','🐱','🐈','🐈‍⬛','🐾',
    '🌸','🌷','🌹','💐','🌺','🌻','🏵️',
    '✨','⭐','🌙','💫','🌈','☁️','🫧',
    '💗','💜','🤍','💛','🎀','🧸',
    '🍒','🍑','🍓','🍰','🧁','☕',
    '📸','💌','🕯️','🔮','🦋'
  ];

  // ---- Undo / redo ----
  const undoStack = [];
  const redoStack = [];
  const MAX_STATES = 25;

  function snapshotData() {
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
  function saveState() {
    undoStack.push(snapshotData());
    if (undoStack.length > MAX_STATES) undoStack.shift();
    redoStack.length = 0;
    refreshUndoRedo();
  }
  function undo() {
    if (!undoStack.length) return;
    redoStack.push(snapshotData());
    ctx.putImageData(undoStack.pop(), 0, 0);
    refreshUndoRedo();
  }
  function redo() {
    if (!redoStack.length) return;
    undoStack.push(snapshotData());
    ctx.putImageData(redoStack.pop(), 0, 0);
    refreshUndoRedo();
  }
  function refreshUndoRedo() {
    document.getElementById('undoBtn').disabled = undoStack.length === 0;
    document.getElementById('redoBtn').disabled = redoStack.length === 0;
  }

  // ---- Canvas helpers ----
  function fillPaper(color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (canvas.width / r.width),
      y: (e.clientY - r.top) * (canvas.height / r.height)
    };
  }

  // ---- Drawing primitives ----
  function strokeStyle() {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = state.size;
    ctx.strokeStyle = state.tool === 'eraser' ? state.paper : state.color;
    ctx.fillStyle = state.tool === 'eraser' ? state.paper : state.color;
  }

  function dot(x, y) {
    strokeStyle();
    ctx.beginPath();
    ctx.arc(x, y, Math.max(0.5, state.size / 2), 0, Math.PI * 2);
    ctx.fill();
  }

  function drawShape(x0, y0, x1, y1) {
    strokeStyle();
    ctx.beginPath();
    if (state.tool === 'line') {
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    } else if (state.tool === 'rect') {
      ctx.strokeRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
    } else if (state.tool === 'ellipse') {
      ctx.ellipse((x0 + x1) / 2, (y0 + y1) / 2, Math.abs(x1 - x0) / 2, Math.abs(y1 - y0) / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function stampSticker(x, y) {
    const px = Math.max(24, state.size * 6);
    ctx.save();
    ctx.font = px + 'px "Mali", "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.sticker, x, y);
    ctx.restore();
  }

  // ---- Flood fill (bucket) ----
  function hexToRgba(hex) {
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 255];
  }

  function floodFill(sx, sy, hex) {
    sx = Math.floor(sx); sy = Math.floor(sy);
    const w = canvas.width, h = canvas.height;
    if (sx < 0 || sy < 0 || sx >= w || sy >= h) return;
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    const idx = (x, y) => (y * w + x) * 4;
    const start = idx(sx, sy);
    const target = [d[start], d[start + 1], d[start + 2], d[start + 3]];
    const fill = hexToRgba(hex);
    if (target[0] === fill[0] && target[1] === fill[1] && target[2] === fill[2] && target[3] === fill[3]) return;

    const tol = 32; // tolerance so anti-aliased edges get filled too
    const match = (i) =>
      Math.abs(d[i] - target[0]) <= tol &&
      Math.abs(d[i + 1] - target[1]) <= tol &&
      Math.abs(d[i + 2] - target[2]) <= tol &&
      Math.abs(d[i + 3] - target[3]) <= tol;

    const stack = [[sx, sy]];
    while (stack.length) {
      const [x, y] = stack.pop();
      let ny = y;
      // move up to top of the fillable span
      while (ny >= 0 && match(idx(x, ny))) ny--;
      ny++;
      let reachL = false, reachR = false;
      while (ny < h && match(idx(x, ny))) {
        const i = idx(x, ny);
        d[i] = fill[0]; d[i + 1] = fill[1]; d[i + 2] = fill[2]; d[i + 3] = fill[3];
        if (x > 0) {
          if (match(idx(x - 1, ny))) { if (!reachL) { stack.push([x - 1, ny]); reachL = true; } }
          else reachL = false;
        }
        if (x < w - 1) {
          if (match(idx(x + 1, ny))) { if (!reachR) { stack.push([x + 1, ny]); reachR = true; } }
          else reachR = false;
        }
        ny++;
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  // ---- Pointer handling ----
  function onDown(e) {
    e.preventDefault();
    const p = pos(e);
    saveState();

    if (state.tool === 'fill') {
      floodFill(p.x, p.y, state.color);
      return;
    }
    if (state.tool === 'sticker') {
      stampSticker(p.x, p.y);
      return;
    }

    state.drawing = true;
    state.startX = p.x;
    state.startY = p.y;

    if (state.tool === 'brush' || state.tool === 'eraser') {
      dot(p.x, p.y);
    } else {
      // shape tools: keep a snapshot to redraw the preview against
      state.snapshot = snapshotData();
    }
    canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
  }

  function onMove(e) {
    if (!state.drawing) return;
    e.preventDefault();
    const p = pos(e);

    if (state.tool === 'brush' || state.tool === 'eraser') {
      strokeStyle();
      ctx.beginPath();
      ctx.moveTo(state.startX, state.startY);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      state.startX = p.x;
      state.startY = p.y;
    } else if (state.snapshot) {
      ctx.putImageData(state.snapshot, 0, 0);      // restore, then live-preview
      drawShape(state.startX, state.startY, p.x, p.y);
    }
  }

  function onUp(e) {
    if (!state.drawing) return;
    const p = pos(e);
    if ((state.tool === 'line' || state.tool === 'rect' || state.tool === 'ellipse') && state.snapshot) {
      ctx.putImageData(state.snapshot, 0, 0);
      drawShape(state.startX, state.startY, p.x, p.y);
    }
    state.drawing = false;
    state.snapshot = null;
  }

  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointerleave', function () {
    // finish freehand strokes if the pointer leaves while not captured
    if (state.drawing && (state.tool === 'brush' || state.tool === 'eraser')) state.drawing = false;
  });

  // ---- Tool selection ----
  function setTool(tool) {
    state.tool = tool;
    document.querySelectorAll('.tool-btn[data-tool]').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.tool === tool));
    });
    canvas.style.cursor = tool === 'sticker' ? 'copy' : 'crosshair';
  }
  document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
    btn.addEventListener('click', () => setTool(btn.dataset.tool));
  });

  // ---- Build colour swatches ----
  const swatchWrap = document.getElementById('swatches');
  COLORS.forEach(([name, hex], i) => {
    const b = document.createElement('button');
    b.className = 'swatch';
    b.style.background = hex;
    b.setAttribute('aria-label', name);
    b.setAttribute('aria-pressed', String(hex === state.color));
    b.addEventListener('click', () => {
      state.color = hex;
      document.getElementById('customColor').value = hex.length === 7 ? hex : state.color;
      swatchWrap.querySelectorAll('.swatch').forEach(s => s.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', 'true');
      if (state.tool === 'eraser') setTool('brush');
    });
    swatchWrap.appendChild(b);
  });

  document.getElementById('customColor').addEventListener('input', (e) => {
    state.color = e.target.value;
    swatchWrap.querySelectorAll('.swatch').forEach(s => s.setAttribute('aria-pressed', 'false'));
    if (state.tool === 'eraser') setTool('brush');
  });

  // ---- Build paper swatches ----
  const paperWrap = document.getElementById('papers');
  PAPERS.forEach(([name, hex]) => {
    const b = document.createElement('button');
    b.className = 'swatch paper-swatch';
    b.style.background = hex;
    b.setAttribute('aria-label', name + ' paper');
    b.setAttribute('aria-pressed', String(hex === state.paper));
    b.addEventListener('click', () => {
      saveState();
      state.paper = hex;
      fillPaper(hex);
      paperWrap.querySelectorAll('.swatch').forEach(s => s.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', 'true');
    });
    paperWrap.appendChild(b);
  });

  // ---- Build sticker tray ----
  const stickerScroll = document.getElementById('stickerScroll');
  STICKERS.forEach((emo, i) => {
    const b = document.createElement('button');
    b.className = 'sticker-btn';
    b.textContent = emo;
    b.setAttribute('aria-label', 'Sticker ' + emo);
    b.setAttribute('aria-pressed', String(i === 0));
    b.addEventListener('click', () => {
      state.sticker = emo;
      stickerScroll.querySelectorAll('.sticker-btn').forEach(s => s.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', 'true');
      setTool('sticker');
    });
    stickerScroll.appendChild(b);
  });

  // ---- Size ----
  const sizeRange = document.getElementById('sizeRange');
  const sizeValue = document.getElementById('sizeValue');
  sizeRange.addEventListener('input', () => {
    state.size = parseInt(sizeRange.value, 10);
    sizeValue.textContent = sizeRange.value;
  });

  // ---- Actions ----
  document.getElementById('undoBtn').addEventListener('click', undo);
  document.getElementById('redoBtn').addEventListener('click', redo);
  document.getElementById('clearBtn').addEventListener('click', () => {
    saveState();
    fillPaper(state.paper);
  });
  document.getElementById('saveBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'shimmer-scrapbook.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  // ---- Keyboard shortcuts ----
  const KEYS = { b: 'brush', e: 'eraser', f: 'fill', l: 'line', r: 'rect', o: 'ellipse', s: 'sticker' };
  window.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); return; }
    const t = KEYS[e.key.toLowerCase()];
    if (t) setTool(t);
  });

  // ---- Clock ----
  function tick() {
    const el = document.getElementById('menuTime');
    if (el) el.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  tick();
  setInterval(tick, 1000);

  // ---- Init ----
  fillPaper(state.paper);
  refreshUndoRedo();
})();