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
        nextBtn   = document.getElementById('next-btn'),
        scaleUp   = document.getElementById('scale-up'),
        scaleDown = document.getElementById('scale-down'),
        container = document.querySelector('.camera-container');

  const overlays = ['overlay1.png','overlay2.png'];
  let currentIndex = 0;
  let scale = 0.75; // initial relative size (75%)
  const overlayImgs = overlays.map(src => { const img = new Image(); img.src = src; return img; });

  function updatePreview() {
    const small = currentIndex === 0;
    overlayEl.src = overlays[currentIndex];
    overlayEl.className = small ? 'overlay-small' : 'overlay-full';
    scaleUp.style.display = scaleDown.style.display = small ? 'inline-flex' : 'none';
    if (small) {
      overlayEl.style.width = `${scale * 100}%`;
    } else {
      overlayEl.style.width = '';
      overlayEl.style.left = overlayEl.style.top = '';
      overlayEl.style.bottom = overlayEl.style.right = '';
    }
  }
  updatePreview();

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + overlays.length) % overlays.length;
    scale = 0.75;
    updatePreview();
  });
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % overlays.length;
    scale = 0.75;
    updatePreview();
  });

  // drag logic
  let dragging = false, offsetX = 0, offsetY = 0;
  overlayEl.addEventListener('pointerdown', e => {
    if (currentIndex !== 0) return;
    dragging = true;
    const rect = overlayEl.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    overlayEl.setPointerCapture(e.pointerId);
  });
  overlayEl.addEventListener('pointermove', e => {
    if (!dragging) return;
    const cr = container.getBoundingClientRect();
    let x = e.clientX - cr.left - offsetX;
    let y = e.clientY - cr.top - offsetY;
    x = Math.max(0, Math.min(cr.width - overlayEl.offsetWidth, x));
    y = Math.max(0, Math.min(cr.height - overlayEl.offsetHeight, y));
    overlayEl.style.left = `${x}px`;
    overlayEl.style.top = `${y}px`;
    overlayEl.style.bottom = overlayEl.style.right = '';
  });
  overlayEl.addEventListener('pointerup', e => {
    dragging = false;
    overlayEl.releasePointerCapture(e.pointerId);
  });

  // scale controls
  scaleUp.addEventListener('click', () => {
    scale = Math.min(2, scale + 0.1);
    overlayEl.style.width = `${scale * 100}%`;
  });
  scaleDown.addEventListener('click', () => {
    scale = Math.max(0.1, scale - 0.1);
    overlayEl.style.width = `${scale * 100}%`;
  });

  let currentFacing = 'user', streamRef = null;
  async function startCamera(fm) {
    if (streamRef) streamRef.getTracks().forEach(t => t.stop());
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: fm } });
      streamRef = stream;
      video.srcObject = stream;
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

  capture.addEventListener('click', () => {
    const w = video.videoWidth, h = video.videoHeight, ctx = canvas.getContext('2d');
    canvas.width = w; canvas.height = h;
    ctx.drawImage(video, 0, 0, w, h);

    if (currentIndex === 0) {
      const cr = container.getBoundingClientRect(),
            or = overlayEl.getBoundingClientRect(),
            scaleX = w / cr.width, scaleY = h / cr.height,
            dx = (or.left - cr.left) * scaleX,
            dy = (or.top - cr.top) * scaleY,
            dw = overlayEl.offsetWidth * scaleX,
            dh = overlayEl.offsetHeight * scaleY;
      ctx.drawImage(overlayImgs[0], dx, dy, dw, dh);
    } else {
      ctx.drawImage(overlayImgs[1], 0, 0, w, h);
    }

    [video, overlayEl, prevBtn, nextBtn, flipBtn, capture, scaleUp, scaleDown]
      .forEach(el => el.style.display = 'none');
    canvas.style.display = 'block';
    download.style.display = 'inline-block';
    retakeBtn.style.display = 'inline-flex';
    download.href = canvas.toDataURL('image/png');
    download.download = 'malcolm_x_100.png';
  });

  retakeBtn.addEventListener('click', () => {
    currentIndex = 0; scale = 0.75;
    updatePreview();
    [canvas, download, retakeBtn].forEach(el => el.style.display = 'none');
    video.style.display = 'block';
    [prevBtn, nextBtn, flipBtn, capture].forEach(el => el.style.display = el.id.startsWith('prev')||el.id.startsWith('next') ? 'flex' : 'inline-flex');
  });
})();
