const themeBtn = document.getElementById('themeBtn');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeBtn.innerHTML = '<span>☀️</span> โหมดสว่าง';
}

function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeBtn.innerHTML = '<span>🌙</span> โหมดกลางคืน';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeBtn.innerHTML = '<span>☀️</span> โหมดสว่าง';
    }
}

async function loadWeather() {
    const wrapper = document.getElementById('weather-wrapper');
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=13.7563&longitude=100.5018&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia%2FBangkok');
        if (!response.ok) throw new Error('API server error');
        const data = await response.json();
        const cur = data.current;
        const weatherMeta = getWeatherDetail(cur.weather_code);

        wrapper.innerHTML = `
            <div class="weather-container">
                <div class="weather-icon">${weatherMeta.emoji}</div>
                <div class="weather-info">
                    <h4>ภาพรวมสภาพอากาศประเทศไทย</h4>
                    <div class="temp">${cur.temperature_2m} <span>°C</span></div>
                    <div class="desc">${weatherMeta.text} &bull; ความชื้นสัมพัทธ์ ${cur.relative_humidity_2m}%</div>
                </div>
            </div>
        `;
    } catch (err) {
        wrapper.innerHTML = `
            <div class="weather-container weather-error">
                ⚠️ ไม่สามารถเชื่อมต่อ API สภาพอากาศได้ในขณะนี้
            </div>
        `;
        console.error(err);
    }
}

function getWeatherDetail(code) {
    if (code === 0) return { emoji: '☀️', text: 'ท้องฟ้าแจ่มใส แดดแรง' };
    if ([1,2,3].includes(code)) return { emoji: '⛅', text: 'มีเมฆบางส่วนถึงเมฆมาก' };
    if ([45,48].includes(code)) return { emoji: '🌫️', text: 'มีหมอกลง' };
    if ([51,53,55,61,63,65].includes(code)) return { emoji: '🌧️', text: 'มีฝนตก' };
    if ([80,81,82,95,96,99].includes(code)) return { emoji: '⛈️', text: 'ฝนฟ้าคะนอง' };
    return { emoji: '🌡️', text: 'สภาพอากาศปกติ' };
}

loadWeather();