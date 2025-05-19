// filter.js
(async () => {
  const video     = document.getElementById('video'),
        container = document.querySelector('.camera-container'),
        overlayEl = document.getElementById('overlay'),
        capture   = document.getElementById('capture-btn'),
        flipBtn   = document.getElementById('flip-btn'),
        download  = document.getElementById('download'),
        retakeBtn = document.getElementById('retake-btn'),
        prevBtn   = document.getElementById('prev-btn'),
        nextBtn   = document.getElementById('next-btn');

  const overlays = ['overlay1.png','overlay2.png'];
  let currentIndex = 0;

  // For drag + pinch
  let pointers = {}, initialDist = 0, initialScale = 0.75;

  function updatePreview() {
    const small = currentIndex === 0;
    overlayEl.src = overlays[currentIndex];
    overlayEl.className = small ? 'overlay-small' : 'overlay-full';
    overlayEl.style.transform = small
      ? `translate(0,0) scale(${initialScale})`
      : '';
    overlayEl.style.left = overlayEl.style.top = '';
    overlayEl.style.bottom = small ? '5px' : '';
    overlayEl.style.right  = small ? '5px' : '';
    download.style.display = retakeBtn.style.display = 'none';
    canvas.style.display = '';
  }

  // Navigation
  prevBtn.onclick = () => { currentIndex = (currentIndex+overlays.length-1)%overlays.length; updatePreview(); };
  nextBtn.onclick = () => { currentIndex = (currentIndex+1)%overlays.length; updatePreview(); };

  // Camera setup omitted for brevity—same as before
  let streamRef, currentFacing='user';
  async function startCamera(f) {
    if(streamRef) streamRef.getTracks().forEach(t=>t.stop());
    try {
      streamRef = await navigator.mediaDevices.getUserMedia({video:{facingMode:f}});
      video.srcObject = streamRef;
    } catch(e){ alert('Allow camera'); }
  }
  await startCamera(currentFacing);
  flipBtn.onclick = async () => { currentFacing = currentFacing==='user'?'environment':'user'; await startCamera(currentFacing); };

  // Pointer events for drag & pinch
  overlayEl.addEventListener('pointerdown', e => {
    pointers[e.pointerId] = e;
    overlayEl.setPointerCapture(e.pointerId);
    if(Object.keys(pointers).length===2){
      const [a,b] = Object.values(pointers);
      initialDist = Math.hypot(b.clientX-a.clientX, b.clientY-a.clientY);
      // extract scale from transform
      const m = new WebKitCSSMatrix(getComputedStyle(overlayEl).transform);
      initialScale = m.a;
    }
  });
  overlayEl.addEventListener('pointermove', e => {
    if(!pointers[e.pointerId]) return;
    pointers[e.pointerId] = e;
    if(Object.keys(pointers).length===1){
      // drag
      const p = pointers[e.pointerId];
      overlayEl.style.left = `${p.clientX - container.getBoundingClientRect().left - (overlayEl.offsetWidth*initialScale)/2}px`;
      overlayEl.style.top  = `${p.clientY - container.getBoundingClientRect().top  - (overlayEl.offsetHeight*initialScale)/2}px`;
      overlayEl.style.bottom = overlayEl.style.right = '';
    } else if(Object.keys(pointers).length===2){
      // pinch
      const [a,b] = Object.values(pointers);
      const dist = Math.hypot(b.clientX-a.clientX, b.clientY-a.clientY);
      let s = initialScale * (dist/initialDist);
      s = Math.max(0.1, Math.min(3, s));
      overlayEl.style.transform = `scale(${s})`;
    }
  });
  overlayEl.addEventListener('pointerup', e => {
    delete pointers[e.pointerId];
    overlayEl.releasePointerCapture(e.pointerId);
    // update initialScale to last scale
    const m = new WebKitCSSMatrix(getComputedStyle(overlayEl).transform);
    initialScale = m.a;
  });

  // Capture
  const canvas = document.getElementById('canvas');
  capture.onclick = () => {
    const w=video.videoWidth, h=video.videoHeight, ctx=canvas.getContext('2d');
    canvas.width=w; canvas.height=h;
    ctx.drawImage(video,0,0,w,h);
    if(currentIndex===0){
      // calculate transform relative to container
      const cr=container.getBoundingClientRect(), or=overlayEl.getBoundingClientRect();
      const scaleX=w/cr.width, scaleY=h/cr.height;
      const dx=(or.left-cr.left)*scaleX, dy=(or.top-cr.top)*scaleY;
      const m = new WebKitCSSMatrix(getComputedStyle(overlayEl).transform);
      const dw=overlayEl.offsetWidth * scaleX * m.a, dh=overlayEl.offsetHeight * scaleY * m.d;
      ctx.drawImage(overlayImgs[0], dx, dy, dw, dh);
    } else {
      ctx.drawImage(overlayImgs[1],0,0,w,h);
    }
    // hide UI
    [video,overlayEl,prevBtn,nextBtn,flipBtn,capture].forEach(el=>el.style.display='none');
    canvas.style.display='block';
    download.style.display='inline-flex';
    retakeBtn.style.display='inline-flex';
    download.href=canvas.toDataURL('image/png');
  };

  // Retake resets to first template + resets scale/position
  retakeBtn.onclick = () => {
    currentIndex=0; initialScale=0.75; pointers={};
    updatePreview();
    [canvas,download,retakeBtn].forEach(el=>el.style.display='none');
    video.style.display='block';
    [prevBtn,nextBtn,flipBtn,capture].forEach(el=>
      el.style.display = el.classList.contains('nav-arrow')?'flex':'inline-flex'
    );
  };
})();
