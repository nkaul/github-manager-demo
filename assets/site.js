'use strict';
(() => {
  const motion = document.getElementById('motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let pausePreference = false;
  try {pausePreference = localStorage.getItem('ghm-demo-motion') === 'paused';} catch {}
  function renderMotion() {
    const paused = pausePreference || reduced.matches;
    document.body.classList.toggle('motion-paused', paused);
    motion.setAttribute('aria-pressed', String(paused));
    motion.textContent = reduced.matches ? 'Reduced motion enabled' : paused ? 'Play animations' : 'Pause animations';
    motion.disabled = reduced.matches;
  }
  motion.addEventListener('click', () => {
    pausePreference = !pausePreference;
    try {localStorage.setItem('ghm-demo-motion', pausePreference ? 'paused' : 'playing');} catch {}
    renderMotion();
  });
  reduced.addEventListener('change', renderMotion);
  renderMotion();
  const video = document.getElementById('video');
  if (!video) return;
  const audio = document.getElementById('audio');
  const list = document.getElementById('chapters');
  const status = document.getElementById('playback-status');
  const search = document.getElementById('chapter-search');
  const count = document.getElementById('chapter-count');
  let chapters = [];
  let pendingSeek = null;
  let currentId = null;
  const stamp = value => String(Math.floor(value / 60)).padStart(2, '0') + ':' + String(Math.floor(value % 60)).padStart(2, '0');
  function playVideo() {
    video.play().then(() => {
      status.textContent = 'Use fullscreen for the clearest view of repository tables and settings.';
    }).catch(error => {
      if (error.name === 'NotAllowedError') status.textContent = 'Chapter selected. Press Play in the video controls to begin.';
    });
  }

  function updateChapter() {
    const chapter = chapters.find(c => video.currentTime >= c.start && video.currentTime < c.end);
    if (!chapter || chapter.id === currentId) return;
    currentId = chapter.id;
    document.getElementById('current-chapter').textContent = chapter.id + ' · ' + chapter.title;
    list.querySelectorAll('button').forEach(button => button.setAttribute('aria-current', String(button.dataset.id === chapter.id)));
  }
  function seek(chapter, play) {
    if (!chapter) return;
    pendingSeek = {time: chapter.start, play};
    if (video.readyState >= 1) {
      video.currentTime = pendingSeek.time;
      pendingSeek = null;
      updateChapter();
      if (play) playVideo();
    } else if (play) video.load();
  }
  function applyHash(play) {
    const match = /^#chapter-(\d{2})$/.exec(location.hash);
    if (match) {
      const chapter = chapters.find(c => c.id === match[1]);
      if (!chapter) return;
      seek(chapter, play);
      document.getElementById('watch').scrollIntoView({behavior: play ? 'auto' : 'instant'});
    }
  }
  video.addEventListener('loadedmetadata', () => {
    if (pendingSeek) {
      const pending = pendingSeek;
      pendingSeek = null;
      video.currentTime = pending.time;
      updateChapter();
      if (pending.play) playVideo();
    }
  });
  video.addEventListener('timeupdate', updateChapter);
  video.addEventListener('play', () => audio.pause());
  audio.addEventListener('play', () => video.pause());
  video.addEventListener('error', () => {status.textContent = 'Video playback is unavailable in this browser. Download the video or try the audio and transcript links.';});
  window.addEventListener('hashchange', () => applyHash(true));
  document.getElementById('fullscreen').addEventListener('click', async () => {
    try {
      if (video.requestFullscreen) await video.requestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
      else status.textContent = 'Use the fullscreen control in your browser’s video player.';
    } catch {status.textContent = 'Use the fullscreen control in your browser’s video player.';}
  });
  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    list.querySelectorAll('button').forEach(button => {
      button.hidden = !button.textContent.toLowerCase().includes(query);
      if (!button.hidden) visible++;
    });
    count.textContent = query ? visible + '/' + chapters.length : String(chapters.length);
    const empty = document.getElementById('chapter-empty');
    if (empty) empty.hidden = visible > 0;
  });
  fetch('recordings/cedar-v2/chapters.json').then(response => {
    if (!response.ok) throw new Error('Chapter list unavailable');
    return response.json();
  }).then(data => {
    chapters = data;
    list.replaceChildren();
    chapters.forEach(chapter => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chapter-button';
      button.dataset.id = chapter.id;
      button.setAttribute('aria-current', 'false');
      const time = document.createElement('span');
      time.className = 'chapter-time';
      time.textContent = stamp(chapter.start);
      const title = document.createElement('span');
      title.className = 'chapter-title';
      title.textContent = chapter.id + ' · ' + chapter.title;
      button.append(time, title);
      button.addEventListener('click', () => {
        history.replaceState(null, '', '#chapter-' + chapter.id);
        seek(chapter, true);
      });
      list.append(button);
    });
    const empty = document.createElement('p');
    empty.id = 'chapter-empty';
    empty.className = 'helper-text';
    empty.textContent = 'No chapters match. Try another feature name.';
    empty.hidden = true;
    list.append(empty);
    count.textContent = String(chapters.length);
    updateChapter();
    applyHash(false);
  }).catch(() => {
    list.textContent = 'The chapter list could not load. You can still use the video controls and transcript.';
    search.disabled = true;
  });
  fetch('recordings/cedar-v2/verification.json').then(response => response.ok ? response.json() : null).then(data => {
    if (!data) return;
    const hosted = data.hosted_playback;
    document.getElementById('hosted-status').textContent = hosted.status === 'PASS'
      ? 'Hosted playback verified · ' + hosted.date + ' · ' + hosted.chapter_seeks + ' chapter seeks'
      : 'Hosted playback validation pending. Recorded local checks are shown above.';
  }).catch(() => {
    document.getElementById('hosted-status').textContent = 'Hosted verification data is unavailable; recorded local checks are shown above.';
  });
})();
