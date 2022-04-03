let audioContext;
let oscillator;
let gain;
let sounding = false;
let oscillatorIsStarted = false;
let antialiasing = false;

function init() {
  audioContext = new AudioContext()

  oscillator = audioContext.createOscillator();
  oscillator.type = "sine";

  gain = audioContext.createGain();
  gain.gain.setValueAtTime(0.0, audioContext.currentTime);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
}

function setAntialising(newState) {
  antialiasing = newState;
}

function setFrequency(frequency) {
  if (oscillator) {
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  }
}

function start() {
  if (sounding) return;

  if (!oscillatorIsStarted) {
    oscillator.start();
    oscillatorIsStarted = true;
  };

  if (antialiasing) {
    gain.gain.setValueAtTime(0.0, audioContext.currentTime + 0.01);
    gain.gain.linearRampToValueAtTime(1.0, audioContext.currentTime + 0.04);
  } else {
    gain.gain.setValueAtTime(1.0, audioContext.currentTime);
  }

  sounding = true;
}

function stop() {
  if (!sounding) return;

  if (antialiasing) {
    gain.gain.setValueAtTime(1.0, audioContext.currentTime + 0.01);
    gain.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + 0.04);
  } else {
    gain.gain.setValueAtTime(0.0, audioContext.currentTime);
  }

  sounding = false;
}

export default { init, setAntialising, setFrequency, start, stop };
