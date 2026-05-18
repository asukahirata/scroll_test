gsap.registerPlugin(ScrollTrigger);

// Lenis 初期化
const lenis = new Lenis({
  duration: 1.2,
  smoothWheel: true,
});

// Lenis と GSAP を連携
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// 画像がスクロールで出てくるアニメーション
gsap.utils.toArray('.reveal-img').forEach((wrap) => {
  const img = wrap.querySelector('img');

  gsap.fromTo(
    wrap,
    {
      clipPath: 'inset(20% 0 20% 0)',
      y: 80,
      opacity: 0,
    },
    {
      clipPath: 'inset(0% 0 0% 0)',
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: wrap,
        start: 'top 80%',
        end: 'top 35%',
        scrub: 1,
      },
    }
  );

  gsap.fromTo(
    img,
    {
      scale: 1.2,
    },
    {
      scale: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: wrap,
        start: 'top 80%',
        end: 'bottom 40%',
        scrub: 1,
      },
    }
  );
});