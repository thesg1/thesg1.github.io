// filter.js
(async () => {
  const video     = document.getElementById('video');
  const canvas    = document.getElementById('canvas');
  const capture   = document.getElementById('capture-btn');
  const flipBtn   = document.getElementById('flip-btn');
  const download  = document.getElementById('download');
  const overlayEl = document.getElementById('overlay');

  // Load overlay image for final canvas draw
  const overlayImg = new Image();
  overlayImg.src   = 'overlay2.png';

  let currentFacing = 'user';
  let streamRef     = null;

  // Start or restart camera with the given facing mode
  async function startCamera(facingMode) {
    if (streamRef) {
      streamRef.getTracks().forEach(t => t.stop());
    }
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

  // Initialize front camera
  await startCamera(currentFacing);

  // Flip between front/back camera
  flipBtn.addEventListener('click', async () => {
    currentFacing = currentFacing === 'user' ? 'environment' : 'user';
    await startCamera(currentFacing);
  });

  // Capture frame + overlay
  capture.addEventListener('click', () => {
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // Draw live video
    ctx.drawImage(video, 0, 0, w, h);
    // Draw overlay stretched to full canvas
    ctx.drawImage(overlayImg, 0, 0, w, h);

    // Hide live preview elements
    video.style.display     = 'none';
    overlayEl.style.display = 'none';
    flipBtn.style.display   = 'none';
    capture.style.display   = 'none';

    // Show result canvas and download link
    canvas.style.display    = 'block';
    const dataURL = canvas.toDataURL('image/png');
    download.href           = dataURL;
    download.download       = 'malcolm_x_100.png';
    download.style.display  = 'inline-block';
  });
})();
