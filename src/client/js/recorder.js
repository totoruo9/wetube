const startBtn = document.querySelector("#startBtn");
const video = document.querySelector("#preview");

let stream;
let recorder;

const handleStop = () => {
    startBtn.innerText = "Play Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleStart);

    recorder.stop();
};

const handleStart = () => {
    startBtn.innerText = "Stop Recording"
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);
    recorder = new MediaRecorder(stream);
    
    recorder.ondataavailable = (event) => {
        const videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    }
    recorder.start();
};

const init = async() => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio:false,
        video:true
    });
    video.srcObject = stream;
    video.play();
};

init();

startBtn.addEventListener("click", handleStart);