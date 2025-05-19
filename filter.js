// filter.js
(async () => {
  const video     = document.getElementById('video'),
        canvas    = document.getElementById('canvas'),
        capture   = document.getElementById('capture-btn'),
        flipBtn   = document.getElementById('flip-btn'),
        download  = document.getElementById('download'),
        retakeBtn = document.getElementById('retake-btn'),
        overlayEl = document.getElementById('overlay'),
        prevBtn   = document.getElementById('prev-btn'),
        nextBtn   = document.getElementById('next-btn');

  const overlays = ['overlay1.png', 'overlay2.png'];
  let currentIndex = 0;
  const overlayImgs = overlays.map(src => { const img = new Image(); img.src = src; return img; });

  // --- Drag & Pinch state ---
  let overlayPos = {x: 0, y: 0};
  let overlayScale = 1;
  let isDragging = false, dragStart = {x:0, y:0}, overlayStart = {x:0, y:0};
  let pointers = {};
  let initialDist = 0, initialScale = 1;

  function setOverlayTransform() {
    if (currentIndex === 0) {
      overlayEl.style.transform = `translate(${overlayPos.x}px,${overlayPos.y}px) scale(${overlayScale})`;
    } else {
      overlayEl.style.transform = '';
    }
  }

  function updatePreview() {
    const small = currentIndex === 0;
    overlayEl.src = overlays[currentIndex];
    overlayEl.className = small ? 'overlay-small' : 'overlay-full';
    if (small) {
      overlayScale = 1;
      overlayPos = {x: 0, y: 0};
      setOverlayTransform();
    } else {
      overlayEl.style.transform = '';
    }
  }

  updatePreview();

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + overlays.length) % overlays.length;
    updatePreview();
  });
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % overlays.length;
    updatePreview();
  });

  let currentFacing = 'user', streamRef = null;

  async function startCamera(fm) {
    if (streamRef) streamRef.getTracks().forEach(t => t.stop());
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: fm } });
      streamRef = stream; video.srcObject = stream;
    } catch (e) {
      alert('Please allow camera access.');
      console.error(e);
    }
  }
  await startCamera(currentFacing);

  flipBtn.addEventListener('click', async () => {
    currentFacing = currentFacing === 'user' ? 'environment' : 'user';
    await startCamera(currentFacing);
  });

  // --- Pointer events for drag and pinch ---
  overlayEl.addEventListener('pointerdown', e => {
    if (currentIndex !== 0) return;
    pointers[e.pointerId] = e;
    overlayEl.setPointerCapture(e.pointerId);

    if (Object.keys(pointers).length === 1) {
      // Start drag
      isDragging = true;
      dragStart = {x: e.clientX, y: e.clientY};
      overlayStart = {...overlayPos};
    } else if (Object.keys(pointers).length === 2) {
      // Start pinch
      const [a, b] = Object.values(pointers);
      initialDist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
      initialScale = overlayScale;
      isDragging = false;
    }
  });

  overlayEl.addEventListener('pointermove', e => {
    if (currentIndex !== 0) return;
    if (!pointers[e.pointerId]) return;
    pointers[e.pointerId] = e;

    if (Object.keys(pointers).length === 1 && isDragging) {
      // Drag
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      overlayPos.x = overlayStart.x + dx;
      overlayPos.y = overlayStart.y + dy;
      setOverlayTransform();
    } else if (Object.keys(pointers).length === 2) {
      // Pinch
      const [a, b] = Object.values(pointers);
      const dist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
      overlayScale = Math.max(0.1, Math.min(3, initialScale * (dist / initialDist)));
      setOverlayTransform();
    }
  });

  overlayEl.addEventListener('pointerup', e => {
    if (currentIndex !== 0) return;
    delete pointers[e.pointerId];
    overlayEl.releasePointerCapture(e.pointerId);
    if (Object.keys(pointers).length === 0) {
      isDragging = false;
    }
  });

  overlayEl.addEventListener('pointercancel', e => {
    if (currentIndex !== 0) return;
    delete pointers[e.pointerId];
    overlayEl.releasePointerCapture(e.pointerId);
    isDragging = false;
  });

  capture.addEventListener('click', () => {
    const w = video.videoWidth, h = video.videoHeight, ctx = canvas.getContext('2d');
    canvas.width = w; canvas.height = h;
    ctx.drawImage(video, 0, 0, w, h);

    if (currentIndex === 0) {
      // Medallion: use overlayPos and overlayScale
      const container = document.querySelector('.camera-container');
      const cr = container.getBoundingClientRect();
      const or = overlayEl.getBoundingClientRect();
      const scaleX = w / cr.width, scaleY = h / cr.height;
      // Calculate overlay position and size in video/canvas coordinates
      const dx = (or.left - cr.left) * scaleX;
      const dy = (or.top - cr.top) * scaleY;
      const dw = overlayEl.offsetWidth * scaleX;
      const dh = overlayEl.offsetHeight * scaleY;
      ctx.drawImage(overlayImgs[0], dx, dy, dw, dh);
    } else {
      ctx.drawImage(overlayImgs[1], 0, 0, w, h);
    }

    // Hide live UI
    [video, overlayEl, prevBtn, nextBtn, flipBtn, capture].forEach(el => el.style.display = 'none');
    // Show result UI
    canvas.style.display = 'block';
    download.style.display = 'inline-block';
    retakeBtn.style.display = 'inline-block';
    download.href = canvas.toDataURL('image/png');
    download.download = 'malcolm_x_100.png';
  });

  retakeBtn.addEventListener('click', () => {
    [canvas, download, retakeBtn].forEach(el => el.style.display = 'none');
    video.style.display = 'block';
    updatePreview();
    [prevBtn, nextBtn, flipBtn, capture].forEach(el => el.style.display = el.classList.contains('nav-arrow') ? 'flex' : 'inline-flex');
  });
})();
