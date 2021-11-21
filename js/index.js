/* Buttons */
const start = document.querySelector("#btn-start");
const backBtn = document.querySelectorAll(".menu__btn-back");
const howToPlay = document.querySelector("#btn-how-to-play");
const credits = document.querySelector("#btn-credits");
const settings = document.querySelector("#btn-settings");

const menu = document.querySelector(".menu__container");
const carousel = document.querySelector("#carousel-container");
const howToPlayBlock = document.querySelector(".menu__how-to-play");
const creditsBlock = document.querySelector(".menu__credits");
const settingsBlock = document.querySelector(".menu__settings");

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
  let colour;
  if (checked.checked) {
    colour = "black";
  } else {
    colour = "white";
  }

  localStorage.setItem("colourChoice", JSON.stringify(colour));
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
let difficultyChoice = 1;

easy.onclick = function () {
  difficultyChoice = 0.5;
  click.play();
  easy.style.opacity = "1";
  medium.style.opacity = "0.5";
  hard.style.opacity = "0.5";
};

medium.onclick = function () {
  difficultyChoice = 1;
  click.play();
  medium.style.opacity = "1";
  easy.style.opacity = "0.5";
  hard.style.opacity = "0.5";
};

hard.onclick = function () {
  difficultyChoice = 1.5;
  click.play();
  hard.style.opacity = "1";
  easy.style.opacity = "0.5";
  medium.style.opacity = "0.5";
};

// Change colour of buttons
const checked = document.querySelector("#black-colour");

checked.addEventListener("input", function () {
  const statusChecked = document.querySelector("#black-colour").checked;

  if (statusChecked) {
    document.querySelector("#btn-start").src = "images/btn-start-black.png";
    document.querySelector("#btn-how-to-play").src = "images/btn-how_to_play-black.png";
    document.querySelector("#btn-settings").src = "images/btn-settings-black.png";
    document.querySelector("#btn-credits").src = "images/btn-credits-black.png";
    const backBtn = document.querySelectorAll(".menu__btn-back");

    backBtn.forEach(function (btn) {
      btn.src = "images/btn-back-black.png";
    });
  } else {
    document.querySelector("#btn-start").src = "images/btn-start.png";
    document.querySelector("#btn-how-to-play").src = "images/btn-how_to_play.png";
    document.querySelector("#btn-settings").src = "images/btn-settings.png";
    document.querySelector("#btn-credits").src = "images/btn-credits.png";
    const backBtn = document.querySelectorAll(".menu__btn-back");

    backBtn.forEach(function (btn) {
      btn.src = "images/btn-back.png";
    });
  }
});
