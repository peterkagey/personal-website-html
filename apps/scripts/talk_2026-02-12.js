Reveal.initialize({
  hash: true,
  slideNumber: true,
  // transition: 'fade',
  width: 1920,
  height: 1080,
  margin: 0,
  minScale: 0.1,
  maxScale: 1
});

document.querySelectorAll('img[data-rotate-group]').forEach(img => {
  img.addEventListener('click', () => {
    const group = img.dataset.rotateGroup;
    const currentRotation = parseInt(img.dataset.rotation || '0');
    const newRotation = currentRotation + 90;

    document.querySelectorAll(`img[data-rotate-group="${group}"]`).forEach(sameGroupImg => {
      const flipped = sameGroupImg.dataset.flipped === 'true';
      sameGroupImg.style.transform = `scaleX(${flipped ? -1 : 1}) rotate(${newRotation}deg)`;
      sameGroupImg.dataset.rotation = newRotation;
    });
  });

  img.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const group = img.dataset.rotateGroup;

    document.querySelectorAll(`img[data-rotate-group="${group}"]`).forEach(sameGroupImg => {
      const rotation = parseInt(sameGroupImg.dataset.rotation || '0');
      const flipped = sameGroupImg.dataset.flipped === 'true';
      const newFlipped = !flipped;

      sameGroupImg.style.transform = `scaleX(${newFlipped ? -1 : 1}) rotate(${rotation}deg)`;
      sameGroupImg.dataset.flipped = newFlipped;
    });
  });
});
