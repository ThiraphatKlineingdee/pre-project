let timeLeft = 300; // เริ่มต้นที่ 5 นาที
let timer;
let isRunning = false;

document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startButton");
    const pauseButton = document.getElementById("pauseButton");
    const resetButton = document.getElementById("resetButton");
    const timerDisplay = document.getElementById("timer");
    const bellAudio = document.getElementById("bellAudio");
    const timeSelect = document.getElementById("timeSelect");
    const soundSelect = document.getElementById("soundSelect");

    let natureAudio = new Audio(soundSelect.value); // สร้างออปเจกต์เสียงธรรมชาติ
    natureAudio.loop = true; // ตั้งค่าให้เพลงเล่นวนลูป

    // เลือกเวลา
    timeSelect.addEventListener("change", function () {
        timeLeft = parseInt(timeSelect.value);
        updateTimerDisplay();
    });

    // เลือกเสียงธรรมชาติ
    soundSelect.addEventListener("change", function () {
        natureAudio.pause(); // หยุดเสียงเดิม
        natureAudio = new Audio(soundSelect.value); // โหลดเสียงใหม่
        natureAudio.loop = true; // ตั้งค่าให้เพลงเล่นวนลูป
        if (isRunning) {
            natureAudio.play(); // ถ้ากำลังเล่นอยู่ ให้เล่นเสียงใหม่ทันที
        }
    });

    // เริ่มนับเวลา
    startButton.addEventListener("click", function () {
        if (isRunning) return; // ถ้ากำลังทำงานอยู่ ให้หยุดการทำงาน

        isRunning = true;
        natureAudio.play(); // เล่นเสียงธรรมชาติ

        timer = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timer);
                natureAudio.pause(); // หยุดเสียงธรรมชาติ
                bellAudio.play(); // เล่นเสียงกริ่ง
                alert("Meditation session completed!");
                isRunning = false;
            } else {
                timeLeft--; // ลบเวลาทีละ 1 วินาที
                updateTimerDisplay(); // อัปเดตการแสดงผลเวลา
            }
        }, 1000); // อัปเดตทุก 1 วินาที
    });

    // หยุดนับเวลา
    pauseButton.addEventListener("click", function () {
        if (isRunning) {
            clearInterval(timer);
            natureAudio.pause(); // หยุดเสียงธรรมชาติ
            isRunning = false;
        }
    });

    // รีเซ็ต
    resetButton.addEventListener("click", function () {
        clearInterval(timer);
        natureAudio.pause(); // หยุดเสียงธรรมชาติ
        natureAudio.currentTime = 0; // รีเซ็ตเสียงธรรมชาติ
        timeLeft = parseInt(timeSelect.value);
        updateTimerDisplay();
        isRunning = false;
    });

    // อัปเดตตัวจับเวลา
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
});

// ฟังก์ชันสำหรับวิเคราะห์อารมณ์
function analyzeEmotion() {
    alert("การวิเคราะห์อารมณ์จะถูกเพิ่มในอนาคต");
}

// ฟังก์ชันสำหรับบันทึกไดอารี่
function saveDiaryEntry() {
    const entry = document.getElementById('diaryEntry').value;
    if (entry) {
        alert("บันทึกเรียบร้อย!");
        // บันทึกข้อมูลลง Local Storage หรือเซิร์ฟเวอร์
    } else {
        alert("กรุณาเขียนข้อความก่อนบันทึก");
    }
}

let model;

// โหลดโมเดล Blazeface
async function loadModel() {
    model = await blazeface.load();
    console.log('โมเดล Blazeface โหลดเรียบร้อยแล้ว');
}

// เริ่มการวิเคราะห์อารมณ์
async function startAnalysis() {
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    const emotionResult = document.getElementById('emotionResult');
    const advice = document.getElementById('advice');

    // ตรวจจับใบหน้า
    const predictions = await model.estimateFaces(video, false);
    if (predictions.length > 0) {
        emotionResult.innerHTML = 'พบใบหน้าในภาพ';
        emotionResult.classList.remove('no-face');
        advice.innerHTML = 'คำแนะนำ: คุณดูปกติ ลองทำกิจกรรมที่คุณชอบเพื่อเพิ่มความสุข';

        // วาดกรอบใบหน้า
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;

        for (const prediction of predictions) {
            const start = prediction.topLeft;
            const end = prediction.bottomRight;
            const size = [end[0] - start[0], end[1] - start[1]];

            // ปรับขนาดและตำแหน่งของกรอบให้ตรงกับวิดีโอ
            const scaleX = canvas.width / video.videoWidth;
            const scaleY = canvas.height / video.videoHeight;

            const scaledStart = [start[0] * scaleX, start[1] * scaleY];
            const scaledSize = [size[0] * scaleX, size[1] * scaleY];

            ctx.strokeRect(scaledStart[0], scaledStart[1], scaledSize[0], scaledSize[1]);
        }
    } else {
        emotionResult.innerHTML = 'ไม่พบใบหน้าในภาพ';
        emotionResult.classList.add('no-face');
        advice.innerHTML = '';
    }

    // เรียกฟังก์ชันวิเคราะห์อารมณ์ทุก ๆ 1 วินาที
    requestAnimationFrame(startAnalysis);
}
// เริ่มใช้งาน Webcam
async function startWebcam() {
    const video = document.getElementById('webcam');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error('ไม่สามารถเปิด Webcam ได้:', err);
    }
}

// โหลดโมเดลและเริ่ม Webcam เมื่อหน้าเว็บโหลด
window.onload = async () => {
    await loadModel();
    await startWebcam();
    startAnalysis(); // เริ่มการวิเคราะห์อารมณ์
};

document.addEventListener("DOMContentLoaded", loadDiaryEntries);

function addDiaryEntry() {
    let title = document.getElementById("diaryTitle").value;
    let content = document.getElementById("diaryEntry").value;
    let imageInput = document.getElementById("diaryImage");

    if (!title || !content) {
        alert("กรุณากรอกหัวข้อและเนื้อหาก่อนบันทึก!");
        return;
    }

    let imageUrl = "";
    if (imageInput.files.length > 0) {
        let reader = new FileReader();
        reader.onload = function (e) {
            saveEntry(title, content, e.target.result);
            displayEntries();
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        saveEntry(title, content, imageUrl);
        displayEntries();
    }

    // ล้างช่องป้อนข้อมูล
    document.getElementById("diaryTitle").value = "";
    document.getElementById("diaryEntry").value = "";
    document.getElementById("diaryImage").value = "";
}

function saveEntry(title, content, imageUrl) {
    let diaryEntries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
    diaryEntries.push({ title, content, imageUrl });
    localStorage.setItem("diaryEntries", JSON.stringify(diaryEntries));
}

function loadDiaryEntries() {
    displayEntries();
}

function displayEntries() {
    let diaryList = document.getElementById("diaryList");
    diaryList.innerHTML = "";

    let diaryEntries = JSON.parse(localStorage.getItem("diaryEntries")) || [];

    diaryEntries.forEach((entry, index) => {
        let entryDiv = document.createElement("div");
        entryDiv.classList.add("diary-item");

        entryDiv.innerHTML = `
            <h3>${entry.title}</h3>
            <p>${entry.content}</p>
            ${entry.imageUrl ? `<img src="${entry.imageUrl}" alt="รูปไดอารี่" style="max-width: 100px;">` : ""}
            <button onclick="deleteEntry(${index})">🗑 ลบ</button>
            <hr>
        `;

        diaryList.appendChild(entryDiv);
    });
}

function deleteEntry(index) {
    let diaryEntries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
    diaryEntries.splice(index, 1);
    localStorage.setItem("diaryEntries", JSON.stringify(diaryEntries));
    displayEntries();
}

function changeBackground() {
    const colors = ['#ffcccc', '#ccffcc', '#ccccff', '#ffcc99', '#99ccff'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;
}
