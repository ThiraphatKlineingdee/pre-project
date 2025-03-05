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
