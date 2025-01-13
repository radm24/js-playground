'use strict';

(function () {
  // If window less than 800px then stop app execution
  if (window.innerWidth < 800) return;

  // Elements
  const activeToolEl = document.querySelector('.active-tool');
  const btnBrush = document.getElementById('brush');
  const brushColorPicker = document.getElementById('brushColor');
  const brushThicknessEl = document.querySelector('.brush-thickness');
  const brushThicknessRange = document.getElementById('brushThickness');
  const btnBucket = document.getElementById('bucketFill');
  const bucketColorPicker = document.getElementById('bucketFillColor');
  const btnEraser = document.getElementById('eraser');
  const btnClearCanvas = document.getElementById('clearCanvas');
  const btnSaveLocalStorage = document.getElementById('saveLocalStorage');
  const btnLoadLocalStorage = document.getElementById('loadLocalStorage');
  const btnClearLocalStorage = document.getElementById('clearLocalStorage');
  const btnDownloadImage = document.getElementById('downloadImage');

  // Constants
  const toolbarHeight = 50;
  const brushInitialColor = '#3f48cc';
  const bucketInitialColor = '#ffffff';
  const lineCap = 'round';
  const eraserColor = 'rgba(255,255,255,1)';
  const messageDuration = 2000;
  const brushCompositeOperation = 'source-over';
  const eraserCompositeOperation = 'destination-out';

  // Canvas
  let canvas = null;
  let ctx = null;

  // State
  let isMouseDown = false;
  let activeTool = 'brush';
  let thickness = 10;
  let brushColor = brushInitialColor;
  let bucketColor = bucketInitialColor;
  let canvasRect = null;
  let timeoutId = null;

  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - toolbarHeight;
    canvas.style.backgroundColor = bucketColor;
    ctx = canvas.getContext('2d');
    ctx.lineCap = lineCap;
    canvas.addEventListener('focus', (e) => console.log('focus'));
    canvas.addEventListener('mousedown', canvasMouseDownHandler);
    canvas.addEventListener('mousemove', canvasMouseMoveHandler);
    canvas.addEventListener('mouseup', () => (isMouseDown = false));
    document.body.append(canvas);
    canvasRect = canvas.getBoundingClientRect();
  }

  function canvasMouseDownHandler(e) {
    if (document.querySelector('.jscolor-picker')) return e.preventDefault();
    isMouseDown = true;
    const { x, y } = canvasRect;
    ctx.beginPath();
    ctx.moveTo(e.pageX - x, e.pageY - y);
    ctx.strokeStyle = activeTool === 'brush' ? brushColor : eraserColor;
    ctx.lineWidth = thickness;
    draw(e.pageX - x, e.pageY - y);
  }

  function canvasMouseMoveHandler(e) {
    if (!isMouseDown) return;
    const { x, y } = canvasRect;
    draw(e.pageX - x, e.pageY - y);
  }

  function draw(x, y) {
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showMessage('Canvas Cleared');
  }

  function toggleActiveTool(tool) {
    if (activeTool === tool) return;
    activeTool = tool;
    activeToolEl.textContent = tool[0].toUpperCase() + tool.slice(1);
    btnBrush.classList.toggle('active');
    btnEraser.classList.toggle('active');
  }

  function showMessage(msg) {
    activeToolEl.textContent = msg;
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(
      () =>
        (activeToolEl.textContent =
          activeTool[0].toUpperCase() + activeTool.slice(1)),
      messageDuration
    );
  }

  function saveBlobLocalStorage() {
    canvas.toBlob((blob) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const drawing = {
          fillColor: bucketColor,
          imageUrl: e.target.result,
        };
        localStorage.setItem('canvasDrawing', JSON.stringify(drawing));
        showMessage('Drawing Saved');
      };
      reader.onerror = (err) => {
        showMessage('Error Occured');
      };
      reader.readAsDataURL(blob);
    });
  }

  function loadDrawingLocalStorage() {
    const data = JSON.parse(localStorage.getItem('canvasDrawing'));
    if (!data) return showMessage('No Drawing Found');
    clearCanvas();
    const { fillColor, imageUrl } = data;
    // Restore background color
    bucketColorPicker.jscolor.fromString(fillColor);
    bucketColor = fillColor;
    canvas.style.backgroundColor = bucketColor;
    // Load image
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      if (activeTool === 'eraser')
        ctx.globalCompositeOperation = brushCompositeOperation;

      ctx.drawImage(img, 0, 0);
      if (activeTool === 'eraser')
        ctx.globalCompositeOperation = eraserCompositeOperation;
      showMessage('Drawing Loaded');
    };
  }

  function clearLocalStorage() {
    localStorage.removeItem('canvasDrawing');
    showMessage('Local Storage Cleared');
  }

  function downloadImage() {
    canvas.toBlob(
      (blobNoBackground) => {
        // Creating an image with the drawing and selected background color
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - toolbarHeight;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = bucketColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const img = new Image();
        img.src = URL.createObjectURL(blobNoBackground);
        img.onload = () => {
          ctx.drawImage(img, 0, 0);

          // Download image
          canvas.toBlob(
            (blobBackground) => {
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blobBackground);
              link.download = 'image.jpeg';
              link.click();
              showMessage('Image Saved');

              URL.revokeObjectURL(blobBackground);
              URL.revokeObjectURL(blobNoBackground);
            },
            'image/jpeg',
            1
          );
        };
      },
      'image/png',
      1
    );
  }

  // Event Listeners
  // Color Pickers
  brushColorPicker.addEventListener('change', (e) => {
    brushColor = e.target.jscolor.toHEXString();
  });
  bucketColorPicker.addEventListener('change', (e) => {
    bucketColor = e.target.jscolor.toHEXString();
    canvas.style.backgroundColor = bucketColor;
  });

  // Brush Thickness
  brushThicknessRange.addEventListener('input', (e) => {
    const { value } = e.target;
    thickness = value;
    brushThicknessEl.textContent = value;
  });

  // Buttons
  btnBrush.addEventListener('click', () => {
    toggleActiveTool('brush');
    ctx.globalCompositeOperation = brushCompositeOperation;
  });
  btnEraser.addEventListener('click', () => {
    toggleActiveTool('eraser');
    ctx.globalCompositeOperation = eraserCompositeOperation;
  });
  btnBucket.addEventListener('click', () => bucketColorPicker.jscolor.show());
  btnClearCanvas.addEventListener('click', clearCanvas);

  btnSaveLocalStorage.addEventListener('click', saveBlobLocalStorage);
  btnLoadLocalStorage.addEventListener('click', loadDrawingLocalStorage);
  btnClearLocalStorage.addEventListener('click', clearLocalStorage);

  btnDownloadImage.addEventListener('click', downloadImage);

  // Set up color pickers
  brushColorPicker.value = brushInitialColor;
  bucketColorPicker.value = bucketInitialColor;

  createCanvas();
})();
