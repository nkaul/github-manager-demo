'use strict';
(() => {
  const viewport = document.querySelector('.podcast-embed');
  const player = document.querySelector('.drive-audio');
  if (!viewport || !player) return;
  let lastWidth = -1;
  function fitPlayer() {
    const width = viewport.clientWidth;
    if (width === lastWidth) return;
    lastWidth = width;
    const playerWidth = Math.max(600, width);
    const scale = width / playerWidth;
    player.style.width = playerWidth + 'px';
    player.style.transform = 'scale(' + scale + ')';
    viewport.style.height = 240 * scale + 'px';
  }
  new ResizeObserver(() => requestAnimationFrame(fitPlayer)).observe(viewport);
  fitPlayer();
})();
