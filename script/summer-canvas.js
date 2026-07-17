/**
 * summer-canvas.js
 * 전역 배경에 여름 느낌의 청량한 물방울(Bubble) 및 마우스 물결 인터랙션을 적용하는 독립형 모듈
 */
(function () {
  const anchor = document.getElementById("summer-canvas-anchor");
  if (!anchor) return;

  // 캔버스 생성 및 스타일링 (화면 전체 덮기, 포인터 이벤트 통과로 클릭 방해 없음)
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  anchor.appendChild(canvas);

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // 1. 물방울 파티클 생성 (여름 테마)
  const bubbles = [];
  const BUBBLE_COUNT = 25; // 브라우저 부하 최소화를 위한 알맞은 수량

  for (let i = 0; i < BUBBLE_COUNT; i++) {
    bubbles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 8 + 3,
      speedY: Math.random() * 1 + 0.3,
      speedX: Math.sin(Math.random() * Math.PI) * 0.5,
      opacity: Math.random() * 0.4 + 0.1,
    });
  }

  // 2. 마우스 따라다니는 이펙트 (물결)
  const mouseRipples = [];
  window.addEventListener("mousemove", (e) => {
    if (Math.random() < 0.2) {
      // 마우스 이동 시 일정 간격으로 생성하여 과부하 방지
      mouseRipples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 2,
        maxRadius: 24,
        opacity: 0.6,
      });
    }
  });

  // 애니메이션 루프
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // 물방울 상승 그리기
    bubbles.forEach((b) => {
      b.y -= b.speedY;
      b.x += Math.sin(b.y * 0.02) * 0.5;

      if (b.y + b.radius < 0) {
        b.y = height + b.radius;
        b.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(63, 108, 99, ${b.opacity})`;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(255, 255, 255, ${b.opacity * 1.5})`;
      ctx.stroke();
    });

    // 마우스 물결 그려주기
    for (let i = mouseRipples.length - 1; i >= 0; i--) {
      const r = mouseRipples[i];
      r.radius += 0.8;
      r.opacity -= 0.02;

      if (r.opacity <= 0 || r.radius >= r.maxRadius) {
        mouseRipples.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(63, 108, 99, ${r.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
