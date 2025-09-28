/*
  Cat landing animation:
  - Starts at bottom with body partly clipped
  - Performs 3 jumps
  - During each jump, swaps to body_2.png while midair
  - After the 3rd jump, switches to happy.png and stays
*/

(function () {
  const IS_REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const frames = {
    idle: 'assets/body.png',
    mid: 'assets/body_2.png',
    happy: 'assets/happy.png'
  };

  const cat = document.getElementById('cat');
  const img = document.getElementById('catImg');

  // Ensure images are preloaded
  [frames.idle, frames.mid, frames.happy].forEach(src => { const i = new Image(); i.src = src; });

  // Base transform pieces. We keep translateX in all keyframes so it doesn't get lost.
  // Start with a slight downward offset so the cat is clipped by the bottom edge.
  const baseX = '-50%';
  const groundY = 140;      // on-screen landing position (larger = lower)
  const happyLift = 120;    // how much higher the happy pose rests vs. ground
  const happyY = groundY - happyLift;
  let offscreenY = 200;     // will be recomputed to place cat fully below the viewport
  const peakY = -160;      // jump height (negative goes up)

  function keyframeTransform(y) {
    return `translateX(${baseX}) translateY(${y}px)`;
  }

  function doJump(duration = 1200, isFinal = false) {
    // Switch to midair sprite near ascent
    img.src = frames.mid;

    const targetY = isFinal ? happyY : groundY;
    const animation = cat.animate([
      { transform: keyframeTransform(groundY) },
      { transform: keyframeTransform(peakY), offset: 0.5 },
      { transform: keyframeTransform(targetY) }
    ], {
      duration,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)', // out-back-ish
      fill: 'forwards'
    });

    // Swap sprite near/at landing
    let timeout;
    if (!isFinal) {
      // For non-final jumps, revert to idle slightly before the end
      timeout = setTimeout(() => { img.src = frames.idle; }, Math.max(0, duration * 0.85));
      return animation.finished.finally(() => clearTimeout(timeout));
    } else {
      // For the final jump, set happy at the end of the jump
      return animation.finished.then(() => { img.src = frames.happy; });
    }
  }

  async function run() {
    // If reduced motion is requested, skip animation and show final state.
    if (IS_REDUCED) {
      img.src = frames.happy;
      cat.style.transform = `translateX(${baseX}) translateY(${happyY}px)`;
      return;
    }

    // Ensure layout is ready and compute a starting Y that places the cat fully below the viewport.
    // Wait for the image to be decoded and layout to stabilize.
    try { await img.decode(); } catch (_) {}
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    // Use the rendered height of the image to push it entirely below the bottom edge.
    const rect = img.getBoundingClientRect();
    offscreenY = Math.max(groundY + 40, rect.height + 40);

    // Place cat offscreen below
    cat.style.transform = `translateX(${baseX}) translateY(${offscreenY}px)`;

    // Lift cat onto the page to ground before first jump (quick entrance)
    await cat.animate([
      { transform: keyframeTransform(offscreenY) },
      { transform: keyframeTransform(groundY) }
    ], {
      duration: 450,
      easing: 'cubic-bezier(0.33, 1, 0.68, 1)',
      fill: 'forwards'
    }).finished;

    // Jumps in sequence. Use an explicit durations array so we know the final jump.
    const jumpDurations = [1200, 1300];
    for (let i = 0; i < jumpDurations.length; i++) {
      const isFinal = i === jumpDurations.length - 1;
      await doJump(jumpDurations[i], isFinal);
      if (!isFinal) { await new Promise(r => setTimeout(r, 120)); }
    }
    // Final state is already at happyY from the last jump; no extra transition needed.
  }

  // Start after DOM is ready (defer ensures this, but extra safety)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
