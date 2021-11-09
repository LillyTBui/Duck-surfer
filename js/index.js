/* Knapper */
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

/* surfebrett */
const surfGreen = document.querySelector("#surfboard-green");
const surfGray = document.querySelector("#surfboard-gray");
const surfPink = document.querySelector("#surfboard-pink");

/* audio */
const click = document.querySelector("#click");

//clear score
localStorage.clear("highscore");

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

carousel.onclick = function (event) {
  const id = event.target.dataset.id;
  localStorage.setItem("surfboard", JSON.stringify(id));
  console.log(id);
};

function toGame() {
  window.location.href = "game.html";
}

surfGreen.addEventListener("click", toGame);
surfGray.addEventListener("click", toGame);
surfPink.addEventListener("click", toGame);

/* music settings */
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
