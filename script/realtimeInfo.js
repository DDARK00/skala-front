// realtimeInfo.js
// weatherAPI.js에서 데이터를 받아와 화면(DOM)에 그리는 역할만 담당합니다.

import { fetchWeather } from "./weatherAPI.js";

const citySelect = document.querySelector("#citySelect");
const weatherBox = document.querySelector("#weather-box");

// 도시 이름 + 좌표를 먼저 즉시 표시합니다.
function renderCoords(cityName, lat, lon) {
  weatherBox.innerHTML = `
        <p class="weather-city-name">📍 ${cityName}</p>
        <p class="weather-coords">위도 <span>${lat}</span> · 경도 <span>${lon}</span></p>
        <p class="weather-loading">⏳ 날씨 정보를 불러오는 중<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span></p>
    `;
}

// 로딩 중 표시된 부분만 결과로 교체합니다.
function renderLoadingReplace(html) {
  const loadingEl = weatherBox.querySelector(".weather-loading");
  if (loadingEl) {
    loadingEl.outerHTML = html;
  } else {
    weatherBox.insertAdjacentHTML("beforeend", html);
  }
}

function renderWeatherResult({ temperature, humidity, time }) {
  const html = `
        <div class="weather-result">
            <p class="weather-temp">🌡 ${temperature}°C</p>
            <p class="weather-humid">💧 습도 ${humidity}%</p>
            <p class="weather-time">기준 시각: ${time?.replace("T", " ") ?? "-"}</p>
        </div>
    `;
  renderLoadingReplace(html);
}

function renderError(message) {
  const html = `<p class="weather-error">⚠ ${message}</p>`;
  renderLoadingReplace(html);
}

async function handleCityChange() {
  const option = citySelect.selectedOptions[0];
  const cityName = option.textContent.trim();
  const lat = option.dataset.lat;
  const lon = option.dataset.lon;

  // 1) 좌표는 즉시 표시 + 로딩 메시지 표시
  renderCoords(cityName, lat, lon);

  // 2) open-meteo에서 실시간 날씨 요청
  try {
    const weather = await fetchWeather(lat, lon);
    renderWeatherResult(weather);
  } catch (error) {
    renderError(error.message);
  }
}

citySelect.addEventListener("change", handleCityChange);

// 페이지 진입 시 기본 선택 도시의 날씨를 바로 보여줍니다.
handleCityChange();
