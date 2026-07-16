/**
 * confetti.js
 * Vanilla JS Canvas Confetti
 */

const confetti = (() => {

    let canvas = null;
    let ctx = null;
    let animationId = null;

    let width = 0;
    let height = 0;

    let pieces = [];

    const config = {
        count: 50,
        gravity: 0.18,
        fade: 0.02,
        duration: 1500
    };

    class Piece {

constructor(x, y) {

    this.x = x;
    this.y = y;

    this.vx = (Math.random() - 0.5) * 2;

    this.vy = Math.random() * 2 + 2;

    this.width = 5 + Math.random() * 5;
    this.height = 8 + Math.random() * 6;

    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2;

    this.swing = Math.random() * Math.PI * 2;

    this.alpha = 1;

    this.color =
        `hsl(${Math.random()*360},85%,60%)`;
}

        update() {

    this.swing += 0.08;

    this.x += this.vx + Math.sin(this.swing) * 0.8;

    this.y += this.vy;

    this.rotation += this.rotationSpeed;

}
        draw(ctx) {

            ctx.save();

            ctx.globalAlpha = this.alpha;

            ctx.translate(this.x, this.y);

            ctx.rotate(this.rotation);

            ctx.fillStyle = this.color;

            ctx.fillRect(
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );

            ctx.restore();
        }

get dead() {

    return this.y > height + 40;

}

    }

    function resize() {

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

    }

    function animate() {

        animationId = requestAnimationFrame(animate);

        ctx.clearRect(0, 0, width, height);

        pieces.forEach(piece => {

            piece.update();
            piece.draw(ctx);

        });

        pieces = pieces.filter(piece => !piece.dead);

    }

    function mount() {

        if (canvas) return;

        const layer = document.createElement("div");

        Object.assign(layer.style, {
            position: "fixed",
            inset: "0",
            pointerEvents: "none",
            zIndex: "99999"
        });

        canvas = document.createElement("canvas");

        layer.appendChild(canvas);

        document.body.appendChild(layer);

        ctx = canvas.getContext("2d");

        resize();

        window.addEventListener("resize", resize);

        animate();

    }

    function launch() {

    if (!canvas)
        mount();

    const duration = 3000;
    const interval = 80;

    const timer = setInterval(() => {

        for (let i = 0; i < 6; i++) {

            pieces.push(
                new Piece(
                    Math.random() * width,
                    -20
                )
            );

        }

    }, interval);

    setTimeout(() => {

        clearInterval(timer);

    }, duration);

}

    function destroy() {

        cancelAnimationFrame(animationId);

        window.removeEventListener(
            "resize",
            resize
        );

        canvas?.parentElement.remove();

        canvas = null;
        ctx = null;
        pieces = [];

    }

    return {
        mount,
        launch,
        destroy
    };

})();