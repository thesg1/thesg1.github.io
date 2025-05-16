// filter.js
;(async () => {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const btn    = document.getElementById('capture-btn');
  const dl     = document.getElementById('download');
  const seal   = new Image();
  seal.src     = 'seal.png';  // make sure this matches your file name

  // 1) Request camera access
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    alert('📸 Please allow camera access to use this filter.');
    console.error(err);
    return;
  }

  // 2) When “Capture Photo” is clicked:
  btn.addEventListener('click', () => {
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // draw the current video frame
    ctx.drawImage(video, 0, 0, w, h);

    // compute seal size & position
    const sealW = w * 0.2;                     // 20% of photo width
    const sealH = sealW * (seal.height / seal.width);
    const x     = w - sealW - 10;               // 10px from right
    const y     = h - sealH - 10;               // 10px from bottom

    ctx.drawImage(seal, x, y, sealW, sealH);

    // show the canvas in place of the video
    canvas.style.display = 'block';
    video.style.display  = 'none';
    btn.style.display    = 'none';

    // prep download link
    const dataURL = canvas.toDataURL('image/png');
    dl.href       = dataURL;
    dl.download   = 'malcolm_x_100.png';
    dl.textContent= '📥 Download Your Commemorative Photo';
    dl.style.display = 'inline-block';
  });
})();
