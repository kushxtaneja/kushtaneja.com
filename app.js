const toggle = document.querySelector("#master-toggle");
const sliders = [...document.querySelectorAll("[data-sound]")];
const timerButtons = [...document.querySelectorAll("[data-minutes]")];

let audio;
let gains;
let playing = false;
let timer;
let birds;

function noiseBuffer(context) {
  const length = context.sampleRate * 3;
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function loopNoise(context, buffer, type, frequency) {
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  source.buffer = buffer;
  source.loop = true;
  filter.type = type;
  filter.frequency.value = frequency;
  source.connect(filter);
  source.start();
  return filter;
}

function createAudio() {
  audio = new AudioContext();
  const master = audio.createGain();
  master.gain.value = 0.72;
  master.connect(audio.destination);

  const noise = noiseBuffer(audio);
  gains = Object.fromEntries(["rain", "ocean", "forest"].map((name) => {
    const gain = audio.createGain();
    gain.gain.value = 0;
    gain.connect(master);
    return [name, gain];
  }));

  loopNoise(audio, noise, "highpass", 2600).connect(gains.rain);

  const ocean = loopNoise(audio, noise, "lowpass", 520);
  const oceanSwell = audio.createGain();
  const swell = audio.createOscillator();
  swell.frequency.value = 0.09;
  oceanSwell.gain.value = 0.34;
  swell.connect(oceanSwell.gain);
  ocean.connect(oceanSwell).connect(gains.ocean);
  swell.start();

  const forest = loopNoise(audio, noise, "bandpass", 900);
  forest.Q.value = 0.35;
  forest.connect(gains.forest);

  birds = setInterval(() => {
    if (!playing || Math.random() < 0.45) return;
    const chirp = audio.createOscillator();
    const envelope = audio.createGain();
    const now = audio.currentTime;
    chirp.type = "sine";
    chirp.frequency.setValueAtTime(1700 + Math.random() * 900, now);
    chirp.frequency.exponentialRampToValueAtTime(2600 + Math.random() * 900, now + 0.12);
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(0.025, now + 0.025);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    chirp.connect(envelope).connect(gains.forest);
    chirp.start(now);
    chirp.stop(now + 0.22);
  }, 1800);

  sliders.forEach(updateSound);
}

function updateSound(slider) {
  slider.style.setProperty("--value", `${slider.value}%`);
  if (!audio) return;
  const level = Number(slider.value) / 100;
  const ceiling = slider.dataset.sound === "rain" ? 0.24 : 0.38;
  gains[slider.dataset.sound].gain.setTargetAtTime(
    level * ceiling,
    audio.currentTime,
    0.08,
  );
}

async function setPlaying(next) {
  if (!audio) createAudio();
  playing = next;
  await (playing ? audio.resume() : audio.suspend());
  toggle.classList.toggle("playing", playing);
  toggle.querySelector(".play-label").textContent = playing
    ? "Pause soundscape"
    : "Begin listening";
}

function setTimer(minutes, button) {
  clearTimeout(timer);
  timerButtons.forEach((item) => item.classList.toggle("active", item === button));
  if (minutes) timer = setTimeout(() => setPlaying(false), minutes * 60_000);
}

toggle.addEventListener("click", () => setPlaying(!playing));
sliders.forEach((slider) => {
  updateSound(slider);
  slider.addEventListener("input", () => updateSound(slider));
});
timerButtons.forEach((button) => {
  button.addEventListener("click", () => setTimer(Number(button.dataset.minutes), button));
});

document.querySelector("#year").textContent = new Date().getFullYear();
window.addEventListener("pagehide", () => clearInterval(birds));
