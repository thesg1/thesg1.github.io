// filter.js
(async () => {
  const video     = document.getElementById('video');
  const canvas    = document.getElementById('canvas');
  const capture   = document.getElementById('capture-btn');
  const flipBtn   = document.getElementById('flip-btn');
  const download  = document.getElementById('download');
  const retakeBtn = document.getElementById('retake-btn');
  const overlayEl = document.getElementById('overlay');
  const prevBtn   = document.getElementById('prev-btn');
  const nextBtn   = document.getElementById('next-btn');

  const overlays = ['overlay2.png', 'overlay3.png'];
  let currentIndex = 0;
  const overlayImgs = overlays.map(src => {
    const img = new Image();
    img.src = src;
    return img;
  });
  function setOverlay(i) {
    currentIndex = i;
    overlayEl.src = overlays[i];
  }
  setOverlay(0);

  prevBtn.addEventListener('click', () => {
    setOverlay((currentIndex - 1 + overlays.length) % overlays.length);
  });
  nextBtn.addEventListener('click', () => {
    setOverlay((currentIndex + 1) % overlays.length);
  });

  let currentFacing = 'user';
  let streamRef     = null;
  async function startCamera(facingMode) {
    if (streamRef) streamRef.getTracks().forEach(t => t.stop());
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
      streamRef = stream;
      video.srcObject = stream;
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
    const w = video.videoWidth, h = video.videoHeight;
    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(video, 0, 0, w, h);
    ctx.drawImage(overlayImgs[currentIndex], 0, 0, w, h);

    // Hide live UI
    video.style.display     = 'none';
    overlayEl.style.display = 'none';
    prevBtn.style.display   = 'none';
    nextBtn.style.display   = 'none';
    flipBtn.style.display   = 'none';
    capture.style.display   = 'none';

    // Show result & post-capture UI
    canvas.style.display    = 'block';
    download.style.display  = 'inline-block';
    retakeBtn.style.display = 'inline-block';

    const dataURL = canvas.toDataURL('image/png');
    download.href         = dataURL;
    download.download     = 'malcolm_x_100.png';
  });

  retakeBtn.addEventListener('click', () => {
    // Hide post-capture UI
    canvas.style.display    = 'none';
    download.style.display  = 'none';
    retakeBtn.style.display = 'none';

    // Show live UI
    video.style.display     = 'block';
    overlayEl.style.display = 'block';
    prevBtn.style.display   = 'flex';
    nextBtn.style.display   = 'flex';
    flipBtn.style.display   = 'inline-flex';
    capture.style.display   = 'inline-flex';
  });
})();
