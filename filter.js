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

  // now overlay1 is medallion (small), overlay2 & 3 are full-screen
  const overlays = ['overlay1.png', 'overlay2.png', 'overlay3.png'];
  let currentIndex = 0;

  const overlayImgs = overlays.map(src => { const img = new Image(); img.src = src; return img; });

  function updatePreview() {
    const isSmall = currentIndex === 0;
    overlayEl.src = overlays[currentIndex];
    overlayEl.className = isSmall ? 'overlay-small' : 'overlay-full';
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
  async function startCamera(facingMode) {
    if (streamRef) streamRef.getTracks().forEach(t => t.stop());
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
      streamRef = stream; video.srcObject = stream;
    } catch (err) {
      alert('Please allow camera access.');
      console.error(err);
    }
  }
  await startCamera(currentFacing);

  flipBtn.addEventListener('click', async () => {
    currentFacing = currentFacing === 'user' ? 'environment' : 'user';
    await startCamera(currentFacing);
  });

  capture.addEventListener('click', () => {
    const w = video.videoWidth, h = video.videoHeight,
          ctx = canvas.getContext('2d');
    canvas.width = w; canvas.height = h;
    ctx.drawImage(video, 0, 0, w, h);

    if (currentIndex === 0) {
      // small medallion bottom-right
      const size = w * 0.22, x = w - size - 10, y = h - size - 10;
      ctx.drawImage(overlayImgs[0], x, y, size, size);
    } else {
      // full-screen overlay
      ctx.drawImage(overlayImgs[currentIndex], 0, 0, w, h);
    }

    // hide live UI
    [video, overlayEl, prevBtn, nextBtn, flipBtn, capture].forEach(el => el.style.display = 'none');
    // show canvas & post-capture UI
    canvas.style.display = 'block';
    download.style.display = 'inline-block';
    retakeBtn.style.display = 'inline-block';
    download.href = canvas.toDataURL('image/png');
    download.download = 'malcolm_x_100.png';
  });

  retakeBtn.addEventListener('click', () => {
    // hide post-capture
    [canvas, download, retakeBtn].forEach(el => el.style.display = 'none');
    // show live UI
    video.style.display = 'block';
    updatePreview();
    [prevBtn, nextBtn, flipBtn, capture].forEach(el => el.style.display = el.classList.contains('nav-arrow') ? 'flex' : 'inline-flex');
  });
})();
