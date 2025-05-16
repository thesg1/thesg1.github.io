;(async () => {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const btn    = document.getElementById('capture-btn');
  const dl     = document.getElementById('download');
  const stamp  = document.getElementById('stamp');
  const seal   = new Image();
  seal.src     = 'seal.png';

  // Start camera
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    alert('📸 Please allow camera access to use this filter.');
    console.error(err);
    return;
  }

  btn.addEventListener('click', () => {
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // draw video frame
    ctx.drawImage(video, 0, 0, w, h);
    // draw seal
    const sealW = w * 0.2;
    const sealH = sealW * (seal.height / seal.width);
    const x     = w - sealW - 10;
    const y     = h - sealH - 10;
    ctx.drawImage(seal, x, y, sealW, sealH);

    // hide live elements
    video.style.display  = 'none';
    stamp.style.display  = 'none';      // ← hide the overlay too
    btn.style.display    = 'none';

    // show captured canvas + download link
    canvas.style.display = 'block';
    const dataURL = canvas.toDataURL('image/png');
    dl.href       = dataURL;
    dl.download   = 'malcolm_x_100.png';
    dl.textContent= '📥 Download Your Commemorative Photo';
    dl.style.display = 'inline-block';
  });
})();
