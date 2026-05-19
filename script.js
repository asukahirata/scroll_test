// GSAPのプラグインを有効化
// ScrollTrigger → スクロール連動アニメーション
// ScrollToPlugin → 指定位置へなめらかに移動
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);



// ================================
// セクション取得
// ================================

// .panel が付いてる要素を全部取得
// これが「1画面」扱いになる
const panels = gsap.utils.toArray('.panel');



// ================================
// 現在状態
// ================================

// 今何枚目にいるか
// 最初は0（=1枚目）
let currentIndex = 0;

// スクロール中かどうか
// true中は次のスクロールを禁止
let isAnimating = false;



// ================================
// ページ番号UI
// ================================

// 現在番号
const currentEl = document.getElementById('current');

// 総枚数
const totalEl = document.getElementById('total');


// 総枚数を表示
// 03 みたいに2桁表示
if (totalEl) {
  totalEl.textContent = String(panels.length).padStart(2, '0');
}


// 現在の番号を更新する関数
function updateIndicator(index) {

  // current が無かったら終了
  if (!currentEl) return;

  // index は0始まりなので +1
  currentEl.textContent = String(index + 1).padStart(2, '0');
}


// 初期表示
updateIndicator(currentIndex);



// ================================
// 1スクロールで1画面移動
// ================================

function goToPanel(index) {

  // 範囲外なら止める
  // index < 0 → 1枚目より前
  // index >= panels.length → 最後より後
  // isAnimating → アニメーション中
  if (index < 0 || index >= panels.length || isAnimating) return;


  // アニメーション中にする
  isAnimating = true;

  // 現在番号更新
  currentIndex = index;

  // UIの数字更新
  updateIndicator(index);


  // スクロール移動アニメーション
  gsap.to(window, {

    // どこへ移動するか
    scrollTo: {

      // 対象セクション
      y: panels[index],

      // スクロール途中で止まらない
      autoKill: false,
    },


    // =========================
    // ここ触ると移動速度変わる
    // =========================

    // 小さい → 速い
    // 大きい → ゆっくり
    duration: 1.2,


    // =========================
    // 動き方
    // =========================

    // power3 → 標準
    // expo → 高級感
    // none → 一定速度
    ease: 'power3.inOut',


    // スクロール終了後
    onComplete: () => {

      // 連続スクロール防止
      setTimeout(() => {

        // 次のスクロール許可
        isAnimating = false;

      // =========================
      // ここ触ると連続スクロール感度変わる
      // =========================

      // 小さい → 連続で動きやすい
      // 大きい → 落ち着く
      }, 500);
    },
  });
}



// ================================
// マウスホイール検知
// ================================

window.addEventListener(
  'wheel',
  (e) => {

    // 普通のスクロール停止
    e.preventDefault();


    // アニメーション中なら止める
    if (isAnimating) return;


    // 小さいスクロール無視
    // Macトラックパッド対策
    if (Math.abs(e.deltaY) < 30) return;


    // 下スクロール
    if (e.deltaY > 0) {

      // 次の画面へ
      goToPanel(currentIndex + 1);

    } else {

      // 前の画面へ
      goToPanel(currentIndex - 1);
    }
  },

  // preventDefaultを有効にするため必要
  { passive: false }
);



// ================================
// パララックス
// ================================

panels.forEach((panel) => {

  // メイン画像
  const img = panel.querySelector('.parallax-img img');

  // 背景
  const bg = panel.querySelector('.bg');



  // ================================
  // メイン画像パララックス
  // ================================

  if (img) {

    gsap.fromTo(

      img,

      // 開始状態
      {
        // 上方向位置
        // マイナス大きいほど上から来る
        yPercent: -30,

        // 初期拡大率
        // 大きいほどズーム状態
        scale: 1.15,
      },


      // 終了状態
      {
        // 下方向へ移動
        // 大きいほど動く
        yPercent: 30,

        // 最終サイズ
        scale: 1,

        // 一定速度
        ease: 'none',

        scrollTrigger: {

          // このセクションで発火
          trigger: panel,


          // =========================
          // 開始位置
          // =========================

          // top bottom
          // セクション上端が画面下端に来た時
          start: 'top bottom',


          // =========================
          // 終了位置
          // =========================

          // セクション下端が画面上端に来た時
          end: 'bottom top',


          // =========================
          // スクロール量に連動
          // =========================

          // true → スクロール同期
          scrub: true,
        },
      }
    );
  }



  // ================================
  // 背景パララックス
  // ================================

  if (bg) {

    gsap.fromTo(

      bg,

      // 開始状態
      {
        // 下から上がってくる感じ
        yPercent: 30,

        // 少し拡大
        scale: 1.15,
      },


      // 終了状態
      {
        // 上へ抜ける
        yPercent: -10,

        // 元サイズへ
        scale: 1,

        ease: 'none',

        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  }
});