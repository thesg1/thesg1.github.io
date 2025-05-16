// filter.js
(async () => {
  const video    = document.getElementById('video');
  const canvas   = document.getElementById('canvas');
  const capture  = document.getElementById('capture-btn');
  const flipBtn  = document.getElementById('flip-btn');
  const download = document.getElementById('download');
  const stampImg = document.getElementById('stamp');
  const seal     = new Image();
  seal.src       = 'seal.png';

  let currentFacing = 'user'; // start with front camera
  let streamRef     = null;

  // function to start camera with given facingMode
  async function startCamera(facingMode) {
    if (streamRef) {
      // stop all tracks of existing stream
      streamRef.getTracks().forEach(t => t.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });
      streamRef = stream;
      video.srcObject = stream;
    } catch (err) {
      alert('Please allow camera access to use this filter.');
      console.error(err);
    }
  }

  // initialize front camera
  await startCamera(currentFacing);

  // flip button toggles facingMode and restarts camera
  flipBtn.addEventListener('click', async () => {
    currentFacing = currentFacing === 'user' ? 'environment' : 'user';
    await startCamera(currentFacing);
  });

  // capture button draws both video + seal into canvas
  capture.addEventListener('click', () => {
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // draw live frame
    ctx.drawImage(video, 0, 0, w, h);
    // draw seal
    const sealW = w * 0.22;
    const sealH = sealW * (seal.height / seal.width);
    const x     = w - sealW - 10;
    const y     = h - sealH - 10;
    ctx.drawImage(seal, x, y, sealW, sealH);

    // hide live view
    video.style.display    = 'none';
    stampImg.style.display = 'none';
    flipBtn.style.display  = 'none';
    capture.style.display  = 'none';
    // show result
    canvas.style.display = 'block';

    // setup download
    const dataURL = canvas.toDataURL('image/png');
    download.href       = dataURL;
    download.download   = 'malcolm_x_100.png';
    download.style.display = 'inline-block';
  });
})();
