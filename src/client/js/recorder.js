const startBtn = document.querySelector("#startBtn");
const video = document.querySelector("#preview");

let stream;

const handleStop = () => {
    startBtn.innerText = "Play Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleStart);
};

const handleStart = () => {
    startBtn.innerText = "Stop Recording"
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);
    const recorder = new MediaRecorder(stream);
    
    recorder.ondataavailable = (e) => {
        console.log("Recorder Done");
        console.log(e);
        console.log(e.data);
    }
    console.log(recorder);
    recorder.start();
    console.log(recorder);
    setTimeout(()=>{
        recorder.stop();
    }, 10000)
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