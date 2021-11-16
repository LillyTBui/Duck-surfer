/* Buttons */
const start = document.querySelector("#btn-start");
const backBtn = document.querySelectorAll(".btn-back");
const howToPlay = document.querySelector("#btn-how-to-play");
const credits = document.querySelector("#btn-credits");
const settings = document.querySelector("#btn-settings");

const menu = document.querySelector(".menu");
const carousel = document.querySelector("#carousel-container");
const howToPlayBlock = document.querySelector(".how-to-play");
const creditsBlock = document.querySelector(".credits");
const settingsBlock = document.querySelector(".settings");

/* Boards */
const surfGreen = document.querySelector("#surfboard-green");
const surfGray = document.querySelector("#surfboard-gray");
const surfPink = document.querySelector("#surfboard-pink");

/* Audio */
const click = document.querySelector("#click");

//clear score
localStorage.clear("highscore");

// Button functionalities:

start.onclick = () => {
  click.play();
  menu.style.display = "none";
  carousel.style.display = "block";
};

howToPlay.onclick = () => {
  click.play();
  menu.style.display = "none";
  howToPlayBlock.style.display = "flex";
};

settings.onclick = () => {
  click.play();
  menu.style.display = "none";
  settingsBlock.style.display = "flex";
};

credits.onclick = () => {
  click.play();
  menu.style.display = "none";
  creditsBlock.style.display = "flex";
};

for (buttons of backBtn) {
  buttons.addEventListener("click", () => {
    menu.style.display = "flex";
    click.play();
    creditsBlock.style.display = "none";
    settingsBlock.style.display = "none";
    howToPlayBlock.style.display = "none";
  });
}

// Save selected surfboard for use in game.html
carousel.onclick = function (event) {
  const id = event.target.dataset.id;
  localStorage.setItem("surfboard", JSON.stringify(id));
};

function toGame() {
  localStorage.setItem("difficultySetting", JSON.stringify(difficultyChoice));
  window.location.href = "game.html";
}

surfGreen.addEventListener("click", toGame);
surfGray.addEventListener("click", toGame);
surfPink.addEventListener("click", toGame);

/* Music settings */
const backgroundSong = document.querySelector("#backgroundSong");
let volume = document.querySelector(".volume");
localStorage.setItem("volume", JSON.stringify(volume.value));

window.onclick = function () {
  backgroundSong.play();
};

volume.addEventListener("input", function () {
  backgroundSong.volume = volume.value;
  localStorage.setItem("volume", JSON.stringify(volume.value));
});

// Difficulty settings
const easy = document.querySelector("#easy");
const medium = document.querySelector("#medium");
const hard = document.querySelector("#hard");
let difficultyChoice = 2;

easy.onclick = function () {
  difficultyChoice = 1;
  click.play();
  easy.style.opacity = "1";
  medium.style.opacity = "0.5";
  hard.style.opacity = "0.5";
};

medium.onclick = function () {
  difficultyChoice = 2;
  click.play();
  medium.style.opacity = "1";
  easy.style.opacity = "0.5";
  hard.style.opacity = "0.5";
};

hard.onclick = function () {
  difficultyChoice = 3;
  click.play();
  hard.style.opacity = "1";
  easy.style.opacity = "0.5";
  medium.style.opacity = "0.5";
};
