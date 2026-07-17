// weatherAPI.js
// open-meteo 무료 API로부터 날씨 데이터를 가져오는 역할만 담당합니다.
// 화면(DOM)에 대한 내용은 전혀 다루지 않고, 순수하게 데이터만 반환합니다.

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * 위도/경도를 받아 open-meteo에서 현재 기온/습도를 가져옵니다.
 * @param {number} lat 위도
 * @param {number} lon 경도
 * @returns {Promise<{ temperature: number, humidity: number, time: string }>}
 */
export async function fetchWeather(lat, lon) {
  const url =
    `${BASE_URL}?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `날씨 데이터를 불러오지 못했습니다. (status: ${response.status})`,
    );
  }

  const data = await response.json();

  if (!data.current) {
    throw new Error("날씨 데이터 형식이 올바르지 않습니다.");
  }

  return {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    time: data.current.time,
  };
}
