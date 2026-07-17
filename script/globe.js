/**
 * Canvas Globe *
 * - 3D sphere point projection
 * - Globe rotation
 * - Depth sorting
 */

import { continents } from "../assets/landData.js";
const canvas = document.getElementById("globe");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let dpr = window.devicePixelRatio || 1;
let time = 0;
let dragVelocity = 0;
const globe = {
  x: 0,
  y: 0,

  radius: 0,

  rotation: 0,

  // 실제 현재 회전량
  rotationSpeed: 0.003,

  // 자동 회전 목표값
  autoRotationSpeed: 0.003,

  // hover 시 목표
  targetRotationSpeed: 0.003,

  dragging: false,
  tilt: (-23.5 * Math.PI) / 180,
};
let drag = {
  active: false,

  startX: 0,

  lastX: 0,

  velocity: 0,
};
let points = [];
const cities = [
  {
    name: "Adiyaman",
    lat: -37.7648,
    lon: -38.2763,

    color: "#fb7185",

    url: "https://www.google.com/maps?q=Adiyaman",
  },

  {
    name: "Athens",
    lat: -37.9838,
    lon: -23.7275,

    color: "#facc15",

    url: "https://www.google.com/maps?q=Athens",
  },

  {
    name: "Ninh Binh",
    lat: -20.2506,
    lon: -105.9745,

    color: "#4ade80",

    url: "https://www.google.com/maps?q=Ninh+Binh",
  },
];

let hoveredCity = null;
let cityPoints = [];
const routes = [
  {
    from: "Adiyaman",
    to: "Athens",
  },

  {
    from: "Athens",
    to: "Ninh Binh",
  },
];

function latLonToXYZ(lat, lon) {
  const phi = (-lat * Math.PI) / 180;

  const theta = (lon * Math.PI) / 180;

  return {
    x: Math.cos(phi) * Math.cos(theta),

    y: Math.sin(phi),

    z: -Math.cos(phi) * Math.sin(theta),
  };
}
let continentPoints = [];

function createContinents() {
  continentPoints = continents.map((continent) => {
    return continent.flatMap((point, index) => {
      const next = continent[(index + 1) % continent.length];

      const result = [];

      const steps = 5;

      for (let i = 0; i < steps; i++) {
        const t = i / steps;

        result.push(
          latLonToXYZ(
            point[1] * (1 - t) + next[1] * t,

            point[0] * (1 - t) + next[0] * t,
          ),
        );
      }

      return result;
    });
  });
}
function drawContinents() {
  continentPoints.forEach((continent) => {
    ctx.beginPath();

    continent.forEach((point, index) => {
      const p = project(point);

      if (p.z <= 0) return;

      if (index === 0) {
        ctx.moveTo(p.x, p.y);
      } else {
        ctx.lineTo(p.x, p.y);
      }
    });

    ctx.strokeStyle = "rgba(74,222,128,0.8)";

    ctx.lineWidth = 1.5;

    ctx.stroke();
  });
}

/**
 * Sphere point 생성
 */
function createSpherePoints() {
  points = [];

  const density = 18;

  for (let lat = -90; lat <= 90; lat += density) {
    for (let lon = -180; lon <= 180; lon += density) {
      const phi = (lat * Math.PI) / 180;

      const theta = (lon * Math.PI) / 180;

      points.push({
        x: Math.cos(phi) * Math.cos(theta),

        y: Math.sin(phi),

        z: Math.cos(phi) * Math.sin(theta),
      });
    }
  }
}
function getMousePosition(event) {
  const rect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,

    y: event.clientY - rect.top,
  };
}
function findCity(x, y) {
  let found = null;

  cityPoints.forEach((city) => {
    const p = project(city);

    if (p.z <= 0) return;

    const distance = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2));

    if (distance < 15) {
      found = city;
    }
  });

  return found;
}
canvas.addEventListener("mousemove", (e) => {
  const pos = getMousePosition(e);

  hoveredCity = findCity(pos.x, pos.y);

  canvas.style.cursor = hoveredCity ? "pointer" : "grab";
});

canvas.addEventListener("mouseenter", () => {
  globe.targetRotationSpeed = 0;
});

canvas.addEventListener("mouseleave", () => {
  if (!globe.dragging) {
    globe.targetRotationSpeed = globe.autoRotationSpeed;
  }
});
function createCityPoints() {
  cityPoints = cities.map((city) => {
    const lat = (city.lat * Math.PI) / 180;

    const lon = (city.lon * Math.PI) / 180;

    return {
      name: city.name,

      x: Math.cos(lat) * Math.cos(lon),

      y: Math.sin(lat),

      z: Math.cos(lat) * Math.sin(lon),
    };
  });
}

/**
 * resize
 */
function resize() {
  width = canvas.clientWidth;
  height = canvas.clientHeight;

  dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = width * dpr;

  canvas.height = height * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  globe.x = width / 2;

  globe.y = height / 2;

  globe.radius = Math.min(width, height) * 0.25;
}

let arcs = [];
function createRoutes() {
  arcs = [];

  routes.forEach((route) => {
    const from = cityPoints.find((c) => c.name === route.from);

    const to = cityPoints.find((c) => c.name === route.to);

    arcs.push(getArcPoints(from, to));
  });
}
canvas.addEventListener("click", () => {
  if (!hoveredCity) return;

  const target = cities.find((c) => c.name === hoveredCity.name);

  if (target?.url) {
    window.open(target.url, "_blank", "noopener,noreferrer");
  }
});
canvas.addEventListener("mousedown", (e) => {
  drag.active = true;

  globe.dragging = true;

  drag.startX = e.clientX;

  drag.lastX = e.clientX;

  drag.velocity = 0;

  canvas.style.cursor = "grabbing";
});
canvas.addEventListener("mousemove", (e) => {
  if (!drag.active) return;

  const delta = e.clientX - drag.lastX;

  globe.rotation -= delta * 0.005;

  drag.velocity = -delta * 0.005;

  drag.lastX = e.clientX;
});
canvas.addEventListener("mouseup", () => {
  drag.active = false;

  globe.dragging = false;

  canvas.style.cursor = "grab";
});

canvas.addEventListener("mouseleave", () => {
  drag.active = false;

  globe.dragging = false;
});
function drawRoutes() {
  arcs.forEach((points) => {
    ctx.beginPath();

    points.forEach((point, index) => {
      const p = project(point);

      if (index === 0) {
        ctx.moveTo(p.x, p.y);
      } else {
        ctx.lineTo(p.x, p.y);
      }
    });

    ctx.strokeStyle = "rgba(56,189,248,0.7)";

    ctx.lineWidth = 1.5;

    ctx.shadowBlur = 10;

    ctx.shadowColor = "#38bdf8";

    ctx.stroke();
  });
}
window.addEventListener("resize", resize);

function getArcPoints(a, b, segments = 40) {
  const result = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;

    let x = a.x * (1 - t) + b.x * t;

    let y = a.y * (1 - t) + b.y * t;

    let z = a.z * (1 - t) + b.z * t;

    /*
            중앙 부분을 지구 바깥으로 띄움
        */

    const length = Math.sqrt(x * x + y * y + z * z);

    const lift = 1 + Math.sin(Math.PI * t) * 0.25;

    x = (x / length) * lift;

    y = (y / length) * lift;

    z = (z / length) * lift;

    result.push({
      x,
      y,
      z,
    });
  }

  return result;
}

/**
 * 3D rotation + projection
 */
function project(point) {
  /*
        1. Y축 회전
    */

  const cosY = Math.cos(globe.rotation);

  const sinY = Math.sin(globe.rotation);

  let x = point.x * cosY - point.z * sinY;

  let z = point.x * sinY + point.z * cosY;

  let y = point.y;

  /*
        2. 지구 자전축 기울기
    */

  const cosX = Math.cos(globe.tilt);

  const sinX = Math.sin(globe.tilt);

  const tiltedY = y * cosX - z * sinX;

  const tiltedZ = y * sinX + z * cosX;

  return {
    x: globe.x + x * globe.radius,

    y: globe.y + tiltedY * globe.radius,

    z: tiltedZ,
  };
}
function drawCities() {
  cityPoints.forEach((city) => {
    const p = project(city);

    // 지구 뒤쪽 숨김

    if (p.z <= 0) return;

    const source = cities.find((c) => c.name === city.name);

    const pulse = (Math.sin(time * 2) + 1) / 2;

    const radius = 5 + pulse * 8;

    /*
            Glow
        */

    ctx.save();

    ctx.globalAlpha = 0.25;

    ctx.beginPath();

    const isHover = hoveredCity && hoveredCity.name === source.name;

    ctx.arc(p.x, p.y, isHover ? 7 : 4, 0, Math.PI * 2);

    ctx.fillStyle = source.color;

    ctx.fill();

    ctx.restore();

    /*
            Core point
        */

    ctx.save();

    ctx.shadowBlur = 8;

    ctx.shadowColor = source.color;

    ctx.beginPath();

    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);

    ctx.fillStyle = source.color;

    ctx.fill();

    ctx.restore();

    /*
            Label
        */

    ctx.font = "12px sans-serif";

    ctx.fillStyle = "rgba(255,255,255,0.9)";

    ctx.fillText(
      source.name,

      p.x + 10,

      p.y - 10,
    );
  });
}

/**
 * draw points
 */
function drawPoints() {
  const projected = points.map(project);

  projected.sort((a, b) => a.z - b.z);

  projected.forEach((p) => {
    const front = p.z > 0;

    ctx.beginPath();

    ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);

    ctx.fillStyle = front ? "rgba(125,211,252,0.8)" : "rgba(125,211,252,0.15)";

    ctx.fill();
  });
}

/**
 * globe background
 */
function drawSphere() {
  const gradient = ctx.createRadialGradient(
    globe.x - globe.radius * 0.35,
    globe.y - globe.radius * 0.35,
    0,
    globe.x,
    globe.y,
    globe.radius,
  );

  gradient.addColorStop(0, "#38bdf8");

  gradient.addColorStop(1, "#020617");

  ctx.save();

  ctx.shadowBlur = 22;

  ctx.shadowColor = "rgba(56,189,248,0.5)";

  ctx.beginPath();

  ctx.arc(globe.x, globe.y, globe.radius, 0, Math.PI * 2);

  ctx.fillStyle = gradient;

  ctx.fill();

  ctx.restore();
}

function animate() {
  if (!globe.dragging) {
    globe.rotation += drag.velocity;

    drag.velocity *= 0.92;

    if (Math.abs(drag.velocity) < 0.0001) {
      drag.velocity = 0;
    }
  }
  // requestAnimationFrame(
  //     animate
  // );
  time += 0.05;
  if (!globe.dragging) {
    globe.rotationSpeed +=
      (globe.targetRotationSpeed - globe.rotationSpeed) * 0.05;

    globe.rotation += globe.rotationSpeed;

    globe.rotation += dragVelocity;

    dragVelocity *= 0.92;
  }

  ctx.clearRect(0, 0, width, height);

  drawSphere();

  drawPoints();

  drawContinents();

  drawRoutes();

  drawCities();
  if (isGlobeVisible) {
    rafId = requestAnimationFrame(animate);
  } else {
    rafId = null;
  }
}

resize();

createSpherePoints();

createCityPoints();

createContinents();

createRoutes();

let isGlobeVisible = false;
let rafId = null;

const globeVisibilityObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      isGlobeVisible = entry.isIntersecting;
      if (isGlobeVisible && rafId === null) {
        rafId = requestAnimationFrame(animate);
      }
    });
  },
  { rootMargin: "400px 0px", threshold: 0 },
);
globeVisibilityObserver.observe(canvas);
