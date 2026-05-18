gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const panels = gsap.utils.toArray('.panel');
let currentIndex = 0;
let isAnimating = false;

// 1スクロールで1画面移動
function goToPanel(index) {
  if (index < 0 || index >= panels.length || isAnimating) return;

  isAnimating = true;
  currentIndex = index;

  gsap.to(window, {
    scrollTo: {
      y: panels[index],
      autoKill: false,
    },
    duration: 0.9,
    ease: 'power3.inOut',
    onComplete: () => {
      setTimeout(() => {
        isAnimating = false;
      }, 500);
    },
  });
}
window.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();

    if (e.deltaY > 0) {
      goToPanel(currentIndex + 1);
    } else {
      goToPanel(currentIndex - 1);
    }
  },
  { passive: false }
);

// 各画面内の画像パララックス
panels.forEach((panel) => {
  const img = panel.querySelector('.parallax-img img');

  gsap.fromTo(
    img,
    {
      yPercent: -10,
    },
    {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: panel,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    }
  );
});