console.log("script loaded");

let canvas = document.querySelector("#game-canvas");

/* Global Variables */
let context = canvas.getContext("2d");

let spriteSheet = "SpaceInvaders-master/Images/sprites.png";

let ded = "  _____" + "\n" +
" /     \\" + "\n" +
"| () () |" + "\n" +
" \\  ^  /" + "\n" +
"  |||||" + "\n" +
"  |||||" + "\n";

let colorArray = [
  "#124e78",
  "#f0f0c9",
  "#f2bb05",
  "#d74e09",
  "#6e0e0a"
];

let levelPopup = document.getElementById("levelPopup");
let levelPopupButton = document.getElementById("levelPopupButton");
let popupOpen = false;

let backgroundImage = new Image();
backgroundImage.src = "SpaceInvaders-master/Images/forest.png";
// let enemySprites = [
//   {
//     char: "SmaInv",       // green
//     x1: 28,  y1: 41,  x2: 295, y2: 41,
//     width: 213, height: 212,
//     animate: 35, hits: 1
//   },
//   {
//     char: "LarInv",       // blue
//     x1: 547, y1: 42,  x2: 800, y2: 41,
//     width: 214, height: 211,
//     animate: 100, hits: 3
//   },
//   {
//     char: "MedInv",       // red
//     x1: 29,  y1: 299, x2: 295, y2: 299,
//     width: 214, height: 212,
//     animate: 70, hits: 2
//   },
// ];

let littleThings = [
  { name: "flower", color: "pink" },
  { name: "trash",  color: "gray" }
];

let explosion = new Audio("SpaceInvaders-master/Sounds/explosion.wav");
let invaderKilled = new Audio("SpaceInvaders-master/Sounds/caw.wav");
let shoot = new Audio("SpaceInvaders-master/Sounds/lightclick.wav");
let enemySounds = [
  new Audio("SpaceInvaders-master/Sounds/crab4.wav"),
  new Audio("SpaceInvaders-master/Sounds/crab2.wav"),
  new Audio("SpaceInvaders-master/Sounds/crab3.wav"),
  new Audio("SpaceInvaders-master/Sounds/crab1.wav")
];

let invaderHit = new Audio("SpaceInvaders-master/Sounds/crabhit.wav");

let audioTick = 0;
let enemyAudioTrack = 0;
let keys = {};
let gameOver = false;
let gameWon = false;
let moveDownNextTick = false;
let gameStart = false;
let gamePaused = false;
let score = 0;
let numOfEnemies = 0;
let level = 1;
// let nextLevelDelay = 0;
let gamePausedDelay = 0;
let message = "";
let messageTimer = 0;
let flowersExamined = 0;
let flowerGoal = 0;
let trashCollected = 0;
let trashGoal = 0;


/* Base Functions (not used for game loop) */
let playSounds = function(sound) {
  if (sound.currentTime > 0) {
    sound.pause();
    sound.currentTime = 0;
  }
  if (sound.paused) sound.play();
}

let allSounds = [explosion, invaderKilled, shoot, invaderHit, ...enemySounds];
let muted = false;

let setMuted = function(value) {
  muted = value;
  allSounds.forEach(s => s.muted = value);
  localStorage.setItem('siteMuted', value);
}

let drawBackground = function() {
  if (backgroundImage.complete && backgroundImage.naturalWidth !== 0) {
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  }
  else {
    context.fillStyle = "#e9c37b";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
}

let pathWidth = 100;
let pathX = (canvas.width-100) / 2;   // calculated from canvas.width and pathWidth
let pathTop = 45;

// let drawPath = function() {
//   context.beginPath();
//   context.rect(pathX, 45, pathWidth, canvas.height);
//   context.fillStyle = "#77520d";
//   context.fill();
// }


/* Classes */
class GamePiece {
  constructor(x, y, dx, dy, width, height, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  getY() {
    return this.y;
  }

  getDy() {
    return this.dy;
  }

  getX() {
    return this.x;
  }

  getDx() {
    return this.dx;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  setY(y) {
    this.y = y;
  }

  setX(x) {
    this.x = x;
  }

  setDx(dx) {
    this.dx = dx;
  }

  setDy(dy) {
    this.dy = dy;
  }

 draw() {
    // by default, draw a rectangle
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Item extends GamePiece {
  constructor(x, y, width, height, type) {
    let color = littleThings.find(item => item.name === type).color;  // look up this type's color
    super(x, y, 0, 0, width, height, color);   // GamePiece stores position, size, color (dx/dy = 0: items don't move)
    this.type = type;                           // "flower" or "trash"
    this.collected = false;                     // not collected yet
  }
  draw() {
    if (this.collected) {
      return;            // collected: draw nothing
    }
    super.draw();        // otherwise draw the rectangle GamePiece knows how to draw
  }
}


class Chaser extends GamePiece {
  constructor(x, y, speed, width, height) {
    super(x, y, speed, speed, width, height, "red");
  }
    update() {
    if (player.getX() > this.x) this.x += this.dx;
    else if (player.getX() < this.x) this.x -= this.dx;

    if (player.getY() > this.y) this.y += this.dy;
    else if (player.getY() < this.y) this.y -= this.dy;
  }
}

class Character extends GamePiece {
  constructor(x, y, dx, dy, width, height, color, laserTotal, enemy, bulletSpeed, imgSrc = "", srcX = 0, srcY = 0, srcWidth = 0, srcHeight = 0) {
    super(x, y, dx, dy, width, height, color);

    // limit the number of shots a character can have on the screen
    this.laserTotal = laserTotal;
    this.lasers = [];
    this.enemy = enemy;
    this.bulletSpeed = bulletSpeed;
    //default sprite to null. if an image source is passed in, set sprite to the image
    this.sprite = null;
    if (imgSrc != "") {
      this.sprite = new Image();
      this.sprite.src = imgSrc;
    }
    this.srcX = srcX;
    this.srcY = srcY;
    this.srcWidth = srcWidth;
    this.srcHeight = srcHeight;
    this.lives = 0;
  }

  setSrcX(srcX) {
    this.srcX = srcX;
  }

  setSrcY(srcY) {
    this.srcY = srcY;
  }

  setSrcWidth(srcWidth) {
    this.srcWidth = srcWidth;
  }

  setSrcHeight(srcHeight) {
    this.srcHeight = srcHeight;
  }

  getLasers() {
    return this.lasers;
  }

  getLives() {
    return this.lives;
  }

  setLives(lives) {
    this.lives = lives;
  }

  //add laser to the character's laser array if the number of lasers on screen are less than the max number of lasers
  addLaser() {
if (this.lasers.length < this.laserTotal) {
    let laserImg = this.enemy ? "SpaceInvaders-master/Images/laser-enemy.png" : "SpaceInvaders-master/Images/laser-player.png";
    this.lasers.push(new Laser(
      Math.floor(this.x + this.width / 2) - 14, this.y,
      this.bulletSpeed, 28, 32, this.enemy, laserImg));
  }}

  clearLasers() {
    for (let i = 0; i < this.lasers.length; i++) {
      this.lasers[i].clear();
    }
    this.lasers = [];
  }

  //remove lasers from the character's laser array as they disappear from the screen
  removeLasers() {
    let removeLasers = [];
    let lasersToRemove = 0;
    for (let i = 0; i < this.lasers.length; i++) {
      this.lasers[i].update();

      if ((!this.enemy && this.lasers[i].getY() <= 50) ||
          (this.enemy && this.lasers[i].getY() >= canvas.height)) {

        lasersToRemove++;
      }
    }

    for (let i = 0; i < lasersToRemove; i++) {
      this.lasers.shift();
    }
  }

  //if an image for the sprite hasn't been passed in, draw a rectangle. otherwise, draw the sprite
  draw() {
    if (this.sprite === null) {
      super.draw();
    }
    else {
      context.drawImage(this.sprite, this.srcX, this.srcY, this.srcWidth, this.srcHeight, this.x, this.y, this.width, this.height);
    }
  }
}

class Laser extends GamePiece {
  constructor(x, y, dy, width, height, enemyLaser, imgSrc = "") {
    let color = enemyLaser ? '#ff3b3b' : '#4ad9ff';
    super(x, y, 0, dy, width, height, color);
    this.enemyLaser = enemyLaser;
    this.hit = false;

    this.sprite = null;
    if (imgSrc !== "") {
      this.sprite = new Image();
      this.sprite.onerror = () => console.error("Failed to load laser image:", imgSrc);
      this.sprite.src = imgSrc;
    }
  }

draw() {
  if (this.sprite === null) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  } else if (this.sprite.complete && this.sprite.naturalWidth !== 0) {
    context.drawImage(this.sprite, this.x, this.y, this.width, this.height);
  }
  // if it's still loading or broken, just skip drawing this frame instead of throwing
}

  getHit() {
    return this.hit;
  }

  setHit(hit) {
    this.hit = hit;
  }

  //removes the laser from play
  clear() {
    this.x = -500;
    this.hit = true;
  }

  //updates the laser's location
  update() {
      if (!this.enemyLaser) {
        if (this.y > 0)
          this.y -= this.dy;
      }
      else this.y += this.dy;

      if (!this.hit && this.x > 0 && this.y > 0)
        this.draw();
  }
}

class Player extends Character {
  constructor(x, dx, width, height, imgSrc = "", srcX = 0, srcY = 0, srcWidth = 0, srcHeight = 0) {
    let color = colorArray[Math.floor(Math.random() * colorArray.length)];
    let y = canvas.height - height;

    super(x, y, dx, dx, width, height, color, 2, false, 9, imgSrc, srcX, srcY, srcWidth, srcHeight);

    this.lives = 4;
    this.ogSrcX = srcX;
    this.ogSrcY = srcY;
    this.ogSrcWidth = srcWidth;
    this.ogSrcHeight = srcHeight;
    this.explodingImg = null;
    this.explodingImgX = 293;
    this.explodingImgY = 571;
    this.explodingImgWidth = 219;
    this.explodingImgHeight = 270;
    this.explodingTick = 0;
  }

  // remove life from player
  loseLife() {
    console.log("You've been hit!");
    this.lives--;

    this.srcX = this.explodingImgX;
    this.srcY = this.explodingImgY;
    this.srcWidth = this.explodingImgWidth;
    this.srcHeight = this.explodingImgHeight;
    this.explodingTick++;

    playSounds(explosion);
    if (this.lives === 0) {
      console.log(ded);
      gameOver = true;
    }
  }

  //update location of player based on which arrow button is pressed. prevent movement that would be out of bounds
  update() {
    if (!gameOver) {
      if (this.explodingTick === 150) {
        this.srcX = this.ogSrcX;
        this.srcY = this.ogSrcY;
        this.srcWidth = this.ogSrcWidth;
        this.srcHeight = this.ogSrcHeight;
        this.explodingTick = 0;
      }
      else if (this.explodingTick != 0) {
        this.explodingTick++;
      }

      if (keys['ArrowDown'] && this.y + this.height + this.dy <= canvas.height)
        this.y += this.dy;
      else if (keys['ArrowUp'] && this.y - this.dy >= 50)
        this.y -= this.dy;

if (keys['ArrowRight'] && this.x + this.width + this.dx <= canvas.width)
        this.x += this.dx;
      else if (keys['ArrowLeft'] && this.x - this.dx >= 0)
        this.x -= this.dx;

      this.draw();
    }
  }
}

class Enemy extends Character {
  constructor(x, y, dx, dy, width, height, shotFreq, imgSrc = "", enemyType = 0) {
    let color = colorArray[Math.floor(Math.random() * colorArray.length)];

    // get sprite info based on what type of enemy it is
    let spriteInfo = enemySprites[enemyType];
    let srcX = spriteInfo.x1;
    let srcY = spriteInfo.y1;
    let srcWidth = spriteInfo.width;
    let srcHeight = spriteInfo.height;

    super(x, y, dx, dy, width, height, color, 4, true, 6, imgSrc, srcX, srcY, srcWidth, srcHeight);

    this.enemyType = enemyType;
    //number of frames between shots
    this.shotFrame = 0;
    this.shotFreq = shotFreq;

    this.hit = false;
    this.hitFrames = 0;
    this.killFrames = 0;
    //number of frames between animations
    this.animationFrame = 0;
    this.animationFreq = enemySprites[enemyType].animate;
    //decides which frame to animate to
    this.firstAniFrame = true;
    this.spriteInfo = spriteInfo;

    //number of lives is based on enemy type and what level it is.
    //if the enemy type is greater than the level, the max lives is the level count
    //if the enemy type is less than or equal to the level, then lives are set to the enemy type
    this.lives = spriteInfo.hits > level ? level : spriteInfo.hits;
    this.ogWidth = width;
    this.ogHeight = height;
    this.killedScale = 1.8;
  } 

  clear() {   // <-- now a proper sibling method, same level as constructor //  //if an ememy is hit, it loses a life. if it runs out of lives, it and its lasers are removed from the screen

    this.lives--;
    if (this.lives === 0) {
      for (let i = 0; i < this.lasers.length; i++) { this.lasers[i].clear(); }
      numOfEnemies--;
      playSounds(invaderKilled);
      this.killFrames++;
      this.hit = true;

      this.srcX = 555;
      this.srcY = 511;
      this.srcWidth = 351;
      this.srcHeight = 361;

      let newWidth = this.ogWidth * this.killedScale;
      let newHeight = this.ogHeight * this.killedScale;
      this.x -= (newWidth - this.width) / 2;
      this.y -= (newHeight - this.height) / 2;
      this.width = newWidth;
      this.height = newHeight;
    }
    else {
      this.hitFrames++;
      playSounds(invaderHit);
    }
  }   // no semicolon after this — methods don't take one

  getHit() {
    return this.hit;
  }

  setHit(hit) {
    this.hit = hit;
  }

  getEnemyType() {
    return this.enemyType;
  }

 

  //update enemies each tick
  update() {
    if (this.x >= -300 && !gamePaused) {
      this.x += this.dx;

      //if an edge is hit, moveDownNextTick lets all enemies know to move down a level
      if ((this.x + this.width >= canvas.width || this.x <= 0)) {
        moveDownNextTick = true;
      }
    }

    if (!gameOver && !this.hit && !gamePaused) {
      //when the number of frames to shoot is met, add a laser to the enemy's array
      this.shotFrame++;
      if (this.shotFrame === this.shotFreq) {
        this.shotFrame = 0;
        this.addLaser();
      }

      //get the next necessary frame for animation if the number of frames necessary is met
      this.animationFrame++;
      if (this.animationFrame === this.animationFreq) {
        this.srcWidth = this.spriteInfo.width;
        this.srcHeight = this.spriteInfo.height;

        if (this.firstAniFrame) {
          this.srcX = this.spriteInfo.x2;
          this.srcY = this.spriteInfo.y2;
          this.firstAniFrame = false;
        }
        else {
          this.srcX = this.spriteInfo.x1;
          this.srcY = this.spriteInfo.y1;
          this.firstAniFrame = true;
        }

        this.animationFrame = 0
      }

      //check if any lasers need to be removed
      this.removeLasers();

      //if the enemy reaches the bottom of the screen, it's an automatic game over
      if (this.y + this.height > canvas.height - (player.getHeight())) {
        gameOver = true;
        player.setLives(0);
        playSounds(explosion);
        console.log(ded);
      }

      //draw the new image
      if (this.hitFrames > 0 && this.hitFrames < 7) {
        this.hitFrames++;
      }
      else {
        this.draw();
        this.hitFrames = 0;
      }
    }

    else if (this.hit && this.killFrames < 15) {
      this.killFrames++;
      this.draw();
    }

    else if (this.hit) {
      this.x = -500;
      this.y = -500;
    }
  }
}

/* Game logic */
let player;
let chaser;
//let enemies = [];
let items = [];
let levels = [];
//let enemyWidth = canvas.width / 19;
//let enemyHeight = canvas.height / 20;

// Creates enemies for each level
// let createEnemies = function(speed, enemynum) {
//   numOfEnemies = 0;
//   enemies = [];
//   for (let i = 0; i < enemynum; i++) {
//     for (let j = 0; j < enemynum; j++) {
//       let enemyType = j % 3;
//       let fireRate = Math.floor(Math.random() * 5000) + 200;
//       let x = i * (2 * enemyWidth * 1.15);
//       let y = j * (1.5 * enemyHeight) + 55;

//       enemies.push(new Enemy(x, y, speed, Math.ceil(enemyHeight * (1 / 2.5)), enemyWidth, enemyHeight, fireRate, spriteSheet, enemyType));
//       numOfEnemies++;
//     }
//   }
// }
let createItems = function(numFlowers, numTrash) {
  items = [];
  for (let i = 0; i < numFlowers; i++) {
    let x = randomBetween(0, canvas.width - 30);
    let y = randomBetween(45, canvas.height - 30);
    items.push(new Item(x, y, 30, 30, "flower"));
  }
  for (let i = 0; i < numTrash; i++) {
    let x = randomBetween(0, canvas.width - 30);
    let y = randomBetween(45, canvas.height - 30);
    items.push(new Item(x, y, 30, 30, "trash"));
  }
}

// levels differ by the speed of the enemies and the number of lives of some enemies
let level1 = function() {
  level = 1;
  flowersExamined = 0;
  flowerGoal = 4;
  trashCollected = 0;
  trashGoal = 3;
  console.log("level1 ran, flowerGoal is", flowerGoal);
  createItems(flowerGoal, trashGoal);
  chaser = new Chaser(10, 55, 1, 30, 30);
}

let level2 = function() {
  level = 2;
  flowersExamined = 0;
  flowerGoal = 4;
  trashCollected = 0;
  trashGoal = 5; 
  createItems(flowerGoal, trashGoal);
  chaser = new Chaser(10, 55, 1, 30, 30);
}

let level3 = function() {
  level = 3;
  flowersExamined = 0;
  flowerGoal = 5;
  trashCollected = 0;
  trashGoal = 5; 
  createItems(flowerGoal, trashGoal);
  chaser = new Chaser(10, 55, 1, 30, 30);
}

let level4 = function() {
  level = 4;
  flowersExamined = 0;
  flowerGoal = 6;
  trashCollected = 0;
  trashGoal = 5; 
  createItems(flowerGoal, trashGoal);
  chaser = new Chaser(10, 55, 1, 30, 30);
}

levels.push(level1);
levels.push(level2);
levels.push(level3);
levels.push(level4);

let randomBetween = function(min, max) {
  return min + Math.random() * (max - min);
}



// initialize the start of the game
let init = function() {
  levels[0]();
  audioTick = 0;
  // nextLevelDelay = 0;
  messageTimer = 0;
  let playerWidth = canvas.width / 10;
  let playerHeight = canvas.height / 12;
  player = new Player((canvas.width / 2) - 25, 4, playerWidth, playerHeight, spriteSheet, 31, 680, 219, 161);
  gamePaused = false;
  gamePausedDelay = 0;
  popupOpen = false;
  levelPopup.style.display = "none";
}

let findTouchedItem = function() {
  for (let i = 0; i < items.length; i++) {
    if (rectsOverlap(player, items[i]) && !items[i].collected) {
      return items[i];     // found one: hand it back and stop
    }
  }
  return null;             // checked every item, touching none
}

let tryAction = function(action) {
  let item = findTouchedItem();

  if (item === null) {
    return;                 // not standing on anything: do nothing
  }

  if (action === "examine" && item.type === "flower") {
    item.collected = true;
    flowersExamined++;
  }
  
  else  if (action === "pickup" && item.type === "trash") {
    item.collected = true;
    trashCollected++;
  }
  else if (action === "pickup" && item.type === "flower") {
    item.collected = false;
    message = "Please don't pick the plants, plants are meant to grow!";
    messageTimer = 200;
  }
    else if (action === "examine" && item.type === "trash") {
    item.collected = false;
    message = "The trash might be interesting to you,\n but it's dangerous to wildlife. Please pick it up!";
    messageTimer = 200;
  }
  
}

let drawMessage = function() {
  if (messageTimer > 0) {
    context.font = "2rem 'Handjet', regular";
    context.fillStyle = "white";
    context.textAlign = "center";
    let lines = message.split("\n");
    for (let i = 0; i < lines.length; i++) {
      context.fillText(lines[i], canvas.width / 3 + 150, 300 + i * 22);
    }
    context.textAlign = "left";
    messageTimer--;
  }
}

  function rectsOverlap(a, b) {
  return a.getX() < b.getX() + b.getWidth() &&
         a.getX() + a.getWidth() > b.getX() &&
         a.getY() < b.getY() + b.getHeight() &&
         a.getY() + a.getHeight() > b.getY();
}

// check collisions
let laserHitCheck = function() {
  let playerLasers = player.getLasers();
  let enemyLasers = [];

  // get all of the enemies' lasers
  for (let i = 0; i < enemies.length; i++) {
    enemyLasers = enemyLasers.concat(enemies[i].getLasers());
  }

  //check if player hit an enemy
for (let i = 0; i < playerLasers.length; i++) {
  for (let j = 0; j < enemies.length; j++) {
    if (rectsOverlap(playerLasers[i], enemies[j]) && !enemies[j].getHit()) {
      playerLasers[i].clear();
      score += 100;
      enemies[j].clear();
    }
  }
}

// enemy hit player
for (let i = 0; i < enemyLasers.length; i++) {
  if (rectsOverlap(enemyLasers[i], player)) {
    enemyLasers[i].clear();
    score -= 1100;
    gamePaused = true;
    player.loseLife();
  }
}
}

//if an edge has been hit, all eneies will be moved down when they update this tick
function moveAllEnemiesDownCheck() {
  if (moveDownNextTick) {
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].setY(enemies[i].getY() + enemies[i].getDy());
      enemies[i].setDx(enemies[i].getDx() * -1);
    }
    moveDownNextTick = false;
  }
}

//draw the "Press Enter To Start" screen when the user navigates to the screen
//the text appears when "flash" is true
var flash = false;
let drawStart = function() {
  drawBackground();
  if (flash) {
    let text = "Press Enter To Start";
    let fontSize = "2.5rem"
    // if (window.innerWidth >= 1000) {
    //   text += " To Start";
    // }
    // if (window.innerWidth >= 1400) {
    //   fontSize = "28px";
    // }
    context.font = `${fontSize} 'Handjet', regular`;
    context.fillStyle = "white";
    context.fillText(text, canvas.width / 2 - 125, canvas.height / 2);
    flash = false;
  }
  else flash = true;
}

//draw prompt to restart game
let drawRestart = function() {
  context.font = "2.5rem 'Handjet', regular";
  context.fillStyle = "white";
      context.textAlign = "center";           // measure/draw relative to the x you give it

    context.fillText("Press ENTER to try again", canvas.width / 2, canvas.height / 2 + 100);
    context.textAlign = "left";              // reset, since other draw calls assume left-aligned

}

//draw the number of lives at the top of the screen along with the line separating the top portion from the game
let life = new Image();
life.src = spriteSheet;
let drawLives = function() {
  //context.beginPath();
  context.moveTo(0, 45);
  context.lineTo(canvas.width, 45);
  context.strokeStyle = "white";
  context.stroke();

  context.font = "2rem 'Handjet', regular";
  context.fillStyle = "white";
  context.fillText("Energy:", canvas.width - 250, 30);

  for (let i = 0; i < player.getLives(); i++) {
    context.drawImage(life, 31, 680, 219, 161, canvas.width - 160 + (i * 40), 8, 30, 25);
  }
}

//draw the user's score
let drawScore = function() {
  context.font = "2rem 'Handjet', regular";
  context.fillStyle = "white";
  context.fillText(`Plants: ${flowersExamined}/${flowerGoal}`, 10, 30);
  context.fillText(`Trash: ${trashCollected}/${trashGoal}`, 225, 30);
}

//draw the text to indicate the user has made it to the next level
// let drawNextLevel = function() {
//   let levelDisplayed = level + 1;
//   context.font = "2rem 'Handjet', regular";
//   context.fillStyle = "white";
//   context.fillText(`Level ${levelDisplayed}`, canvas.width / 2 - 110, canvas.height / 2);
// }

//draw the text indicating that the user has won
let youWin = function() {
  context.fillStyle = "white";
  context.font = "1rem 'Handjet', regular";
  context.fillText("You finished a great day of exploring nature!", canvas.width / 2 - 250, canvas.height / 2 - 100);
  context.font = "2.5rem 'Handjet', regular";
  context.fillText("You Win!!!", canvas.width / 2 - 190, canvas.height / 2);
  drawRestart();

  gameWon = true;
}

//draw the text indicating that the user has won
let checkGamePaused = function() {
  if (gamePaused && !gameOver) {
    if (gamePausedDelay < 150) {
      keys = {};
      player.clearLasers();
      // for (let i = 0; i < enemies.length; i++) {
      //   enemies[i].clearLasers();
      // }
      gamePausedDelay++;
      context.font = "2.5rem 'Handjet', regular";
      context.fillStyle = "white";
      context.fillText(`Energy level: ${player.getLives()}`, canvas.width / 2 - 160, canvas.height / 2);
    }
    else {
      gamePausedDelay = 0;
      gamePaused = false;
      player.setX((canvas.width / 2) - 25);
      player.setY(canvas.height - player.getHeight());
      chaser.setX(10);
      chaser.setY(55);
    }
  }
}

//if gameOver has been set to true, display the game over screen
let checkGameOver = function() {
  if (gameOver) {
    context.fillStyle = "white";
    context.textAlign = "center"; 
    context.font = "2rem 'Handjet', regular";
    context.fillText("You got distracted by a curious neighbor", canvas.width / 2, canvas.height / 2 - 60);
    context.fillText("and couldn't finish your exploration.", canvas.width / 2, canvas.height / 2 - 25);
    context.fillText("That's okay! There's always tomorrow.", canvas.width / 2, canvas.height / 2 + 25);
    context.textAlign = "left";              // reset, since other draw calls assume left-aligned
    drawRestart();
  }
}

//check if all enemies have been defeated. If they have, check if all levels have been beaten
//if all levels have been beaten, display "you win" text. otherwise, display "next level" text and reset necessary variables
let endOfLevelCheck = function() {
  if (flowersExamined >= flowerGoal && trashCollected >= trashGoal && !popupOpen) {
    if (level < levels.length) {
      let allContent = document.querySelectorAll(".level-content");
      for (let i = 0; i < allContent.length; i++) {
        allContent[i].style.display = "none";
      }

      let content = document.getElementById("levelContent" + level);
      if (content) {
        content.style.display = "block";
      }
      levelPopup.style.display = "flex";
      popupOpen = true;
      keys = {};
    }
    else {
      youWin();
    }
  }
}

//function to play enemy sounds while they move
let playEnemyMovementSounds = function() {
  // ticks between sounds decreases by the level
  let maxTick = 15 + Math.floor(50 / level);

  //only play sound or increment the tick count between plays if this condition is met
  let gameCondition = gameStart && !gameOver && !gameWon && !gamePaused && !popupOpen;
  if (audioTick === maxTick && gameCondition) {
    playSounds(enemySounds[enemyAudioTrack]);
    enemyAudioTrack = (enemyAudioTrack + 1) % 4;
    audioTick = 0;
  }
  else if (gameCondition) audioTick++;
  else enemyAudioTrack = 0;
}

let closeLevelPopup = function() {
  if (!popupOpen) return;

  levelPopup.style.display = "none";
  popupOpen = false;
  levelPopupButton.blur();
  player.setX((canvas.width / 2) - 25);
  player.setY(canvas.height - player.getHeight());
  level++;
  levels[level - 1]();
}
//funtion that's run to play game
//updates all of the necessary components to keep game running
let gameLoop = function() {
  requestAnimationFrame(gameLoop);
  drawBackground();
  //drawPath();
  for (let i = 0; i < items.length; i++) {
    items[i].draw();
  }
  chaser.draw();
  if (!gameWon && !gameOver && !popupOpen) {
    player.update();
    if (!gamePaused) {
      chaser.update();
    }
    if (rectsOverlap(player, chaser) && !gamePaused) {
      player.loseLife();
      gamePaused = true;
    }
  }
  drawScore();
  drawLives();
  drawMessage();
  checkGamePaused();
  endOfLevelCheck();
  checkGameOver();
}


/* Runs before game begins to execute */
drawStart();
//Sets an interval to run the drawStart function
var presStart = setInterval(drawStart, 400);


/* Event Listeners */
//spaceDown is used to ensure that the keypress event doesn't cause the function that runs when the sapce bar is pressed to be called multiple times
let keyDown = false;

//sets what key is currently being pressed down (used in player's update function)
document.addEventListener("keydown", (event) => {
    if (popupOpen) {
    if (event.key === 'Enter' && !event.repeat) {
      closeLevelPopup();
    }
    return;
  }
  if (!gamePaused && (event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'ArrowDown' || event.key === 'ArrowUp')){
    keys[event.key] = true;
  }
  if (event.key === ' ' && keyDown == false && player != undefined && !gamePaused && !gameOver && !gameWon) {
    // player.addLaser();
    keyDown = true;
  }
  //press enter either before the game starts or if the game has ended
  else if (event.key === 'Enter') {
    // if game hasn't started, initialize and begin the game loop
    if (!gameStart) {
      clearInterval(presStart);
      init();
      gameLoop();
      gameStart = true;
    }
    else if (gameOver || gameWon) {
      gameOver = false;
      gameWon = false;
      init();
    }
  }
  let playing = gameStart && !gamePaused && !gameOver && !gameWon;

  if (event.key === 'e' && !event.repeat && playing) {
    tryAction("examine");
  }
  if (event.key === 't' && !event.repeat && playing) {
    tryAction("pickup");
  }

});

levelPopupButton.addEventListener("click", closeLevelPopup);

//removes active key so that the player doesn't keep moving after the arrow keys have been released
document.addEventListener("keyup", (event) => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'ArrowDown' || event.key === 'ArrowUp')
    keys[event.key] = false;
});

if (localStorage.getItem('siteMuted') === 'true') {
  setMuted(true);
}

let muteBtn = document.querySelector('#mute-btn');

let updateMuteButton = function() {
  muteBtn.textContent = muted ? '🔇 Let it caw' : '🔊 Mute the game sounds';
}

muteBtn.addEventListener('click', () => {
  setMuted(!muted);
  updateMuteButton();
});

updateMuteButton(); // set correct label on load, in case a saved preference was restored
window.addEventListener("blur", () => { keys = {}; });