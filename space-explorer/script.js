// Load env then initialize
importScript('../shared/env-loader.js').then(() => {
    initApp();
});

function importScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

let apiKey = "";

async function initApp() {
    const env = await loadEnv();
    apiKey = env.NASA_API_KEY || "yzz5pPKnxWIR3j6ObnpIBVsBYLY0NVp1sAvrPeJG";
    fetchAPOD(); // Initial Load after key is ready
}

const datePicker = document.getElementById('datePicker');
const getImageBtn = document.getElementById('getImage');
const mediaContainer = document.getElementById('mediaContainer');
const imgDate = document.getElementById('imgDate');
const imgTitle = document.getElementById('imgTitle');
const imgExplanation = document.getElementById('imgExplanation');

// Set max date to today
datePicker.max = new Date().toISOString().split("T")[0];
datePicker.value = new Date().toISOString().split("T")[0];

getImageBtn.addEventListener('click', () => {
    fetchAPOD(datePicker.value);
});

async function fetchAPOD(date) {
    if (!apiKey) return;

    // Show Loading
    mediaContainer.innerHTML = '<div class="loader"></div>';
    imgTitle.innerText = "Scanning the cosmos...";
    imgExplanation.innerText = "";
    imgDate.innerText = "";

    const url = date
        ? `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`
        : `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error(error);
        mediaContainer.innerHTML = '<p style="color:var(--neon-pink)">Error contacting NASA servers.</p>';
    }
}

function updateUI(data) {
    imgDate.innerText = data.date;
    imgTitle.innerText = data.title;
    imgExplanation.innerText = data.explanation;

    if (data.media_type === "image") {
        mediaContainer.innerHTML = `
            <img src="${data.hdurl || data.url}" alt="${data.title}">
        `;
    } else if (data.media_type === "video") {
        mediaContainer.innerHTML = `
            <iframe src="${data.url}" frameborder="0" allowfullscreen style="width:100%; height:100%;"></iframe>
        `;
    }
}

// Initial load handled in initApp
