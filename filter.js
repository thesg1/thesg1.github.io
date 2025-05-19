// filter.js
(async () => {
  const video     = document.getElementById('video');
  const canvas    = document.getElementById('canvas');
  const capture   = document.getElementById('capture-btn');
  const flipBtn   = document.getElementById('flip-btn');
  const download  = document.getElementById('download');
  const overlayEl = document.getElementById('overlay');
  const prevBtn   = document.getElementById('prev-btn');
  const nextBtn   = document.getElementById('next-btn');

  // List your overlay filenames here, in order
  const overlays = ['overlay2.png', 'overlay3.png'];
  let currentIndex = 0;

  // Preload images
  const overlayImgs = overlays.map(src => {
    const img = new Image();
    img.src = src;
    return img;
  });

  // Update the <img> and the Image used for canvas draw
  function setOverlay(index) {
    currentIndex = index;
    overlayEl.src = overlays[index];
  }

  // Initialize to first overlay
  setOverlay(0);

  // Navigation handlers
  prevBtn.addEventListener('click', () => {
    const idx = (currentIndex - 1 + overlays.length) % overlays.length;
    setOverlay(idx);
  });
  nextBtn.addEventListener('click', () => {
    const idx = (currentIndex + 1) % overlays.length;
    setOverlay(idx);
  });

  let currentFacing = 'user';
  let streamRef     = null;

  async function startCamera(facingMode) {
    if (streamRef) streamRef.getTracks().forEach(t => t.stop());
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });
      streamRef = stream;
      video.srcObject = stream;
    } catch (err) {
      alert('Please allow camera access.');
      console.error(err);
    }
  }

  // Start front camera
  await startCamera(currentFacing);

  // Flip camera
  flipBtn.addEventListener('click', async () => {
    currentFacing = currentFacing === 'user' ? 'environment' : 'user';
    await startCamera(currentFacing);
  });

  // Capture frame + current overlay
  capture.addEventListener('click', () => {
    const w = video.videoWidth, h = video.videoHeight;
    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(video, 0, 0, w, h);
    // Draw currently selected overlay, stretched
    ctx.drawImage(overlayImgs[currentIndex], 0, 0, w, h);

    // Hide live preview
    video.style.display     = 'none';
    overlayEl.style.display = 'none';
    prevBtn.style.display   = 'none';
    nextBtn.style.display   = 'none';
    flipBtn.style.display   = 'none';
    capture.style.display   = 'none';

    // Show result + download
    canvas.style.display    = 'block';
    const dataURL = canvas.toDataURL('image/png');
    download.href           = dataURL;
    download.download       = 'malcolm_x_100.png';
    download.style.display  = 'inline-block';
  });
})();
