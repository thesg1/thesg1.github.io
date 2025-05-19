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

  // Only two templates now
  const overlays = ['overlay1.png','overlay2.png'];
  let currentIndex = 0;
  const overlayImgs = overlays.map(src => { const img=new Image(); img.src=src; return img; });

  function updatePreview() {
    const isMedal = currentIndex===0;
    overlayEl.src = overlays[currentIndex];
    overlayEl.className = isMedal ? 'overlay-small' : 'overlay-full';
  }

  updatePreview();

  prevBtn.addEventListener('click',()=>{
    currentIndex = (currentIndex-1+overlays.length)%overlays.length;
    updatePreview();
  });
  nextBtn.addEventListener('click',()=>{
    currentIndex = (currentIndex+1)%overlays.length;
    updatePreview();
  });

  let currentFacing='user', streamRef=null;
  async function startCamera(fm){
    if(streamRef) streamRef.getTracks().forEach(t=>t.stop());
    try{
      const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:fm}});
      streamRef=s; video.srcObject=s;
    }catch(e){
      alert('Please allow camera access.');
      console.error(e);
    }
  }
  await startCamera(currentFacing);

  flipBtn.addEventListener('click',async()=>{
    currentFacing=currentFacing==='user'?'environment':'user';
    await startCamera(currentFacing);
  });

  capture.addEventListener('click',()=>{
    const w=video.videoWidth, h=video.videoHeight, ctx=canvas.getContext('2d');
    canvas.width=w; canvas.height=h;
    ctx.drawImage(video,0,0,w,h);
    if(currentIndex===0){
      const size=w*0.30, x=w-size-10, y=h-size-10;
      ctx.drawImage(overlayImgs[0],x,y,size,size);
    } else {
      ctx.drawImage(overlayImgs[1],0,0,w,h);
    }
    // hide live UI
    [video,overlayEl,prevBtn,nextBtn,flipBtn,capture].forEach(el=>el.style.display='none');
    // show result
    canvas.style.display='block';
    download.style.display='inline-block';
    retakeBtn.style.display='inline-block';
    download.href=canvas.toDataURL('image/png');
    download.download='malcolm_x_100.png';
  });

  retakeBtn.addEventListener('click',()=>{
    [canvas,download,retakeBtn].forEach(el=>el.style.display='none');
    video.style.display='block';
    updatePreview();
    [prevBtn,nextBtn,flipBtn,capture].forEach(el=>el.style.display= el.classList.contains('nav-arrow')?'flex':'inline-flex');
  });
})();
