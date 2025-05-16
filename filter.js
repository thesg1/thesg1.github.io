// filter.js
(async () => {
  const video    = document.getElementById('video');
  const canvas   = document.getElementById('canvas');
  const btn      = document.getElementById('capture-btn');
  const download = document.getElementById('download');
  const stampImg = document.getElementById('stamp');
  const seal     = new Image();
  seal.src       = 'seal.png';

  // Start camera
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    video.srcObject = stream;
  } catch (err) {
    alert('Please allow camera access to use this filter.');
    console.error(err);
    return;
  }

  btn.addEventListener('click', () => {
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // Draw the live frame
    ctx.drawImage(video, 0, 0, w, h);

    // Draw the seal
    const sealW = w * 0.22;
    const sealH = sealW * (seal.height / seal.width);
    const x     = w - sealW - 10;
    const y     = h - sealH - 10;
    ctx.drawImage(seal, x, y, sealW, sealH);

    // Hide live view, show result
    video.style.display     = 'none';
    stampImg.style.display  = 'none';
    btn.style.display       = 'none';
    canvas.style.display    = 'block';

    // Prepare download link
    const dataURL = canvas.toDataURL('image/png');
    download.href         = dataURL;
    download.download     = 'malcolm_x_100.png';
    download.style.display = 'inline-block';
  });
})();
