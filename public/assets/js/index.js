import { fuzzySearch } from "./fuzzySearch.js";
import names from "./data.js";

const rolls = Object.keys(names);

const intro = document.getElementById("intro");
const game = document.getElementById("game");
const outro = document.getElementById("outro");

const nameInput = document.getElementById("theName");
new fuzzySearch(nameInput, Object.values(names));

document.querySelector(".autocomplete-items").style.maxHeight = `${
  Math.floor(window.innerHeight - nameInput.getBoundingClientRect().bottom) - 20
}px`;

const startTimer = seconds => {
  const timerDiv = document.getElementById("timer");
  timerDiv.style.opacity = "1";
  const toCount = Date.now() + seconds * 1000;
  return new Promise(resolve => {
    const updateTimer = () => {
      if (toCount < Date.now()) {
        timerDiv.innerText = "0:000";
        timerDiv.style.opacity = "0";
        resolve();
      } else {
        let timeLeft = toCount - Date.now();
        let ms = `${timeLeft % 1000}`.padStart(3, "0");
        timerDiv.innerText = `${Math.floor(timeLeft / 1000)}:${ms}`;
        setTimeout(updateTimer, 77);
      }
    };
    setTimeout(updateTimer, 77);
  });
};

// I wrote the js below a bit sleepy, do not murder me!
const url = new URL(location.href);
const playerId = url.searchParams.get("id");

let points, current;

const gradients = [
  ["#E44D26", "#F16529"],
  ["#D66D75", "#E29587"],
  ["#20002c", "#cbb4d4"],
  ["#C33764", "#1D2671"],
  ["#F7971E", "#FFD200"],
  ["#34e89e", "#0f3443"],
  ["#200122", "#200122"],
  ["#093028", "#237A57"],
  ["#DCE35B", "#45B649"],
  ["#41295a", "#2F0743"],
];

const bgoverlay = document.querySelector(".overlay");
const changeBg = (color1, color2) => {
  bgoverlay.style.opacity = "0";
  document.body.style.backgroundImage = `linear-gradient(to bottom right, ${color1}, ${color2})`;
  setTimeout(() => {
    bgoverlay.style.backgroundImage = document.body.style.backgroundImage;
    bgoverlay.style.opacity = "1";
  }, 300);
};

changeBg("#50a3a2", "#53e3a6");

const resultDiv = document.getElementById("prevresult");
const prepareSlide = (number, result) => {
  document.getElementById("rnoq").innerText = `Who is roll no ${number}?`;
  resultDiv.innerText = result || "";
  resultDiv.style.opacity = "0.9";
  setTimeout(() => (resultDiv.style.opacity = "0"), 1000);
};

const slide = result => {
  let randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
  changeBg(randomGradient[0], randomGradient[1]);
  current = rolls[Math.floor(Math.random() * rolls.length)];
  prepareSlide(current, result);
  nameInput.value = "";
  nameInput.focus();
};
const endGame = () => {
  changeBg("#50a3a2", "#53e3a6");
  game.classList.add("hidden");
  outro.querySelector(".points").innerText = `${points} Points`;
  outro.classList.remove("hidden");
  fetch(`./highscore/${points}?id=${playerId}`);
};

const handleSubmit = e => {
  e.preventDefault();
  let result = `${names[current]} is #${current}.`;
  if (nameInput.value == names[current]) {
    points += 1;
    result = "Correct!";
  }
  slide(result);
};

document.querySelector(".submit").addEventListener("click", handleSubmit);
document.querySelector(".pass").addEventListener("click", handleSubmit);
document.body.addEventListener("submit", handleSubmit);

const startGame = () => {
  points = 0;
  slide();
  game.classList.remove("hidden");
  nameInput.focus();
  startTimer(60).then(endGame);
};

const playHandler = e => {
  intro.classList.add("hidden");
  outro.classList.add("hidden");
  startGame();
};
document.getElementById("playbutton").addEventListener("click", playHandler);
document.getElementById("replaybutton").addEventListener("click", playHandler);

console.info("Made with :love: by radiantly");
