let pills = [];
let score = 0;
let gameTime = 30; 
let startTime;
let gameState = "start"; // "start", "playing", "gameover"
let bg = null;

function preload(){
  bg = loadImage("res/imgs/pattern_3.jpg");
}

function setup() {
  // createCanvas(500, 500);
   /* Storing user's device details in a variable*/
  let details = navigator.userAgent;

  /* Creating a regular expression 
  containing some mobile devices keywords 
  to search it in details string*/
  let regexp = /android|iphone|kindle|ipad/i;

  /* Using test() method to search regexp in details
  it returns boolean value*/
  let isMobileDevice = regexp.test(details);

//   let r = 1920/1080;
//   let w = 600;

//   if (isMobileDevice) {
//       print("Mobile " + windowWidth);
//     r = 1;
//     w = 300;
//   } else {
//       print("Desktop " + windowWidth);
//   }
//   let h = w/r;
//   createCanvas(w, h);
  
  createCanvas(500,500);
  textAlign(CENTER, CENTER);
  
}

function draw() {
  background(120,150,80);
  
  image(bg,0,0);
  
  if (gameState === "start") {
    drawStartScreen();
  } 
  else if (gameState === "playing") {
    drawGameScreen();
  } 
  else if (gameState === "gameover") {
    drawGameOverScreen();
  }
}

function drawStartScreen() {
  textSize(28);
  noStroke();
  fill(255,125);
  rect(width/2-textWidth("Pill Picker")/2 - 28, height/2 - 60 -28, textWidth("Pill Picker")+56,80);
  fill(0);
  text("Pill Picker", width/2, height/2 - 60);
  textSize(18);
  text("Spot the Fake Pills!", width/2, height/2 - 30);

  // Button
  fill(100, 170, 100);
  rect(width/2 - 75, height/2, 150, 50, 10);
  fill(255);
  textSize(20);
  text("Start Game", width/2, height/2 + 25);
}

function drawGameScreen() {
  let timeLeft = gameTime - int((millis() - startTime) / 1000);

  textSize(16);
  fill(0,125);
  text("Time: " + max(0, timeLeft), width/2, 20);
  text("Score: " + score, width/2, 40);

  // Spawn pills
  if (frameCount % 60 === 0) {
    pills.push(new Pill(random(50, width-50), -20));
  }

  // Update & draw pills
  for (let i = pills.length - 1; i >= 0; i--) {
    pills[i].update();
    pills[i].show();
    if (pills[i].y > height) {
      pills.splice(i, 1);
    }
  }

  // End game
  if (timeLeft <= 0) {
    gameState = "gameover";
  }
}

function drawGameOverScreen() {
  textSize(24);
  fill(0,125);
  text("Game Over!", width/2, height/2 - 40);
  text("Final Score: " + score, width/2, height/2);

  // Restart button
  fill(200, 50, 50);
  rect(width/2 - 75, height/2 + 40, 150, 50, 10);
  fill(255);
  textSize(20);
  text("Play Again", width/2, height/2 + 65);
}

function mousePressed() {
  if (gameState === "start") {
    if (mouseX > width/2 - 75 && mouseX < width/2 + 75 &&
        mouseY > height/2 && mouseY < height/2 + 50) {
      startGame();
    }
  } 
  else if (gameState === "playing") {
    for (let i = pills.length - 1; i >= 0; i--) {
      if (pills[i].clicked(mouseX, mouseY)) {
        if (pills[i].isReal) score++;
        else score--;
        pills.splice(i, 1);
      }
    }
  } 
  else if (gameState === "gameover") {
    if (mouseX > width/2 - 75 && mouseX < width/2 + 75 &&
        mouseY > height/2 + 40 && mouseY < height/2 + 90) {
      resetGame();
    }
  }
}

function startGame() {
  score = 0;
  pills = [];
  startTime = millis();
  gameState = "playing";
}

function resetGame() {
  gameState = "start";
}

class Pill {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isReal = random() > 0.5;
    this.rand = abs(random()*10);
    this.rand -= this.rand%1;
    // print(this.rand);
    this.real_pills = [
        "Aspirin",
        "Paracetamol",
        "Ibuprofen",
        "Amoxicillin",
        "Metformin",
        "Lisinopril",
        "Omeprazole",
        "Atorvastatin",
        "Simvastatin",
        "Levothyroxine"
    ];

    this.fake_pills = [
        "Asperin",
        "Paracitamol",
        "Ibuprophen",
        "Amoxcillin",
        "Metfomin",
        "Lisinoprilol",
        "Omeprazol",
        "Atorvastatine",
        "Simvastatine",
        "Levothyroxin"
    ];

    this.label = this.isReal ? this.real_pills[this.rand] :this.fake_pills[this.rand];
  }
  update() {
    this.y += 2;
  }
  show() {
    fill(this.isReal ? "blue" : "red");
    ellipse(this.x, this.y, textWidth(this.label)+20, 50);
    fill(255);
    textSize(16);
    text(this.label, this.x, this.y);
  }
  clicked(mx, my) {
    return dist(mx, my, this.x, this.y) < 30;
  }
}
