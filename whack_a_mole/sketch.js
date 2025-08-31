let state = {start:0, playing:1, end:2};
let curr_state = state.start;
let fonts = {};
let colors = {white: [255,255,255],
              black: [0,0,0],
              red: [255,0,0],
              blue: [0,0,255],
              green: [200,255,50],
               indigo: [75, 0, 130],
               t: [255,255,255,0],
              b1: [255,193,140],
              b2: [132, 36, 12],
              b3: [218, 109, 66]
             };
// let rounds = {
//   true: [],
//   false: []
// }
let timer = null;
let mole = null;
let mole_timer = null, mole_clear = null;
let mole_rate = 1;
let mole_true = 0;
let r1=0, c1=0, w1,h1;

this.real_pills = [
    "Aspirin",      // 7 letters
    "Paracetam",    // shortened from Paracetamol → 9 letters
    "Ibuprofen",    // 9 letters
    "Metformin",    // 9 letters
    "Omeprazol"     // 9 letters
];

this.fake_pills = [
    "Asperin",      // 7 letters
    "Paracitam",    // shortened from Paracitamol → 9 letters
    "Ibuproph",     // shortened from Ibuprophen → 9 letters
    "Metfomin",     // 8 letters
    "Omeprazol"     // 9 letters
];

// only this variable matters and changing this will changes different states inside the game
let screens={
  start:{
    btn:null,
    text: ["Whack-A-Drug","Are they AUTHENTIC?"],
    text_btns: [null, null],
    bg: null,
    favicon: null,
  },
  playing:{
    score: 0,
    time: 60,
    text: ["Whack-a-Drug"],
    text_btns: []
  },
  end:{
    end_game: null,
    text: ["Counterfeit drugs are getting better at replicating authentic packaging. Protect yourself. Use CounterCheck to verify medications."],
    text_btns: [null],
    // answer: true,
    answer_btn: null
  }
};




function preload() {
  fonts.thin = loadFont('res/fonts/Roboto-Thin.ttf');
  fonts.regular = loadFont('res/fonts/Roboto-Regular.ttf');
  fonts.bold = loadFont('res/fonts/Roboto-Bold.ttf');
  fonts.extrabold = loadFont('res/fonts/Roboto-ExtraBold.ttf');
  fonts.black = loadFont('res/fonts/Roboto-Black.ttf');
  
  screens.start.bg = loadImage("res/imgs/pattern_2.jpg");
  screens.start.favicon = loadImage("res/imgs/favicon.png");
  
  // for(let i=0 ; i<screens.playing.max_play ; i++){
  //   rounds.true.push(loadImage(`res/imgs/true/${i+1}.png`));
  //   rounds.false.push(loadImage(`res/imgs/false/${i+1}.png`));
  // }
}

function setup() {
  
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
  rectMode(CENTER);
  
  
  
  // btn = new Button(width/2,height/2,"Hello World");
  screens.start.btn = new Button(width/2, height*3/4, "Start Game");
  screens.start.btn.font = fonts.bold;
  screens.start.btn.onClick = ()=>{
    curr_state = state.playing;
    screens.playing.score = 0;
    screens.playing.time = 60;
    timer = setInterval(()=>{
      screens.playing.time--;
      
      if(screens.playing.time <= 0){
        curr_state = state.end;
        clearTimeout(timer);
      }
    },1000)
  };
  
  for(let i=0 ; i<screens.start.text.length ; i++){
    screens.start.text_btns[i] = new Button(width/2, height*(3+i)/8, screens.start.text[i]);
    screens.start.text_btns[i].font = fonts.black;
    screens.start.text_btns[i].font_size = 24;
  }
  
  
  screens.end.end_game = new Button(width*4/6, height*3/4, "End Game");
  screens.end.end_game.onClick = ()=>{
    curr_state = state.start;
  };
  
  screens.end.answer_btn = new Button(width/2, height*1/4, "Score: 0");
  

  
  
  for(let i=0 ; i<screens.start.text.length ; i++){
    screens.playing.text_btns[i] = new Button(width/2, height*(1+i)/16, screens.start.text[i]);
    screens.playing.text_btns[i].font = fonts.bold;
    screens.playing.text_btns[i].font_size = 20;
  }
  
  
  mole = new Button(100,100,"Aspirin");
  mole.is_there = false;
  mole.onClick = ()=>{
    if(mole_true == 0){
      screens.playing.score -= 1;
    }else{
      screens.playing.score += 1;
    }
    mole.is_there = false;
  };
}
  
  
function moleShow() {
    // Clear previous interval if it exists
    if (mole_timer) clearInterval(mole_timer);
    if(mole_clear){
      clearInterval(mole_clear);
      mole_rate -= 0.013;
      if(mole_rate < 0.35) mole_rate = 0.35;
    }
  
    let disp = 0;
    // Start a new interval
    mole_timer = setInterval(() => {
        mole.del_pos(0,-mole_rate*2);
      // print(mole.x, mole.y);
      disp += mole_rate;
      if(disp >= 16){
        clearInterval(mole_timer);
        
      mole.is_there = false;
      }
      // console.log("hhh");
    }, 100);
  
    mole.is_there = true;
  
  mole_clear = setTimeout(()=>{
    clearInterval(mole_timer);
    mole_rate -= 0.013;
    if(mole_rate < 0.35) mole_rate = 0.35;
      mole.is_there = false;
  },16*mole_rate*100);
}

function draw() {
  background(colors.white);
  
  if(curr_state == state.start){ // Start
    push();
    {  
      
      let factor = 1.3;
      image(screens.start.bg, -width*0.1, 0, width*factor, height*factor);
      for(let i=0 ; i<screens.start.text.length ; i++){
        screens.start.text_btns[i].draw(colors.green, colors.red);
      }
       
      screens.start.btn.draw(colors.red, colors.white);
      image(screens.start.favicon, width-50, height-50, 40, 40);
    }
    
    pop();
  }else if (curr_state == state.end){ // END
    push();
    {
      screens.end.answer_btn.text = "Score: " + screens.playing.score;
      screens.end.answer_btn.draw(colors.white, colors.black);
      push();
      {
        textFont(fonts.regular);
        textSize(16);
        textAlign(CENTER, CENTER);
        noStroke();
        fill(colors.white);
        rect(width/2, height/2, width/2, height/4+40);
        fill(colors.black);
        text(screens.end.text[0],width/2, height/2, width/2, height/4);
      }
      screens.end.end_game.draw(colors.indigo, colors.white);
    }
    pop();
  }else if (curr_state == state.playing){ // Playing
    push();
    {
      
      background(colors.white);
      for(let i=0 ; i<screens.start.text.length ; i++){
        screens.playing.text_btns[i].draw(colors.t, colors.indigo);
      }
      text("Time Left: "+screens.playing.time, 10,10);
      text("Score: "+screens.playing.score, 10,30);
      w1 = width/7;
      h1 = height/6;
      for(let i=0 ; i<5; i++){
        for(let j=0 ; j<4; j++){
          fill(colors.b2);
          stroke(colors.black);
          rect(w1/2+w1*(i+1),h1*2/3+h1*(j+2),w1,h1*1.5);
          fill(colors.b3);
          noStroke();
          ellipse(w1/2+w1*(i+1),h1*(0.9+(j+1)/5)+h1*(j+1),w1*1.2,h1*(0.9+(j+1)/5));
        }
      }
      
      
      for(let i=0 ; i<5; i++){
        for(let j=0 ; j<4; j++){
          
          fill(colors.b1);
          noStroke();
          ellipse(w1/2+w1*(i+1),h1+h1*(j+1),w1*0.95,0.9*h1);
        }
      }
      
    }
  
    if(!mole.is_there){
      // print("skkks");
      let row = abs(random()*4);
      row -= row%1;
      r1 = row;
      
      let col = abs(random()*5);
      col -= col%1;
      c1 = col;
      
      w1 = width/7;
      h1 = height/6;
      
      mole_true = abs(random()*2);
      mole_true -= mole_true%1;
      
      let mole_pill = abs(random()*5);
      mole_pill -= mole_pill%1;
      
      mole.text = mole_true == 0 ? fake_pills[mole_pill]:real_pills[mole_pill];
      
      mole.pos(w1/2+w1*(col+1),h1+h1*(row+1));
      moleShow();
    }
    
    mole.draw(mole_true == 0 ? colors.red : colors.blue, colors.white);
    stroke(mole_true == 0 ? colors.red : colors.blue);
    line(w1/2+w1*(c1+1),h1+h1*(r1+1)+12,mole.x,mole.y);
    // line(0,0,100,100)
    // print(w1/2+w1*(c1+1),h1+h1*(r1+1),mole.x,mole.y);
    pop();
  }
  
  mouseIsReleased = false;
}


class Button{
  
  constructor(x, y, t){
    this.x = x;
    this.y = y;
    
    this.text = t || "Dummy";
    this.font = fonts.regular;
    this.font_size = 16;
    
    
    this.onClick = ()=>{};
  }
  
  del_pos(dx, dy){
    this.x += dx;
    this.y += dy;
  }
  
  pos(x,y){
    this.x = x;
    this.y = y;
  }
  
  
  draw(c,s){
    // c = fill color
    // s = text color
    
    push();
    {
      textFont(this.font);
      textSize(this.font_size);
      textWidth(this.font_size);
      let w = textWidth(this.text)+20;
      let h = this.font_size+20;
      fill(...c);
      noStroke();
      rect(this.x,this.y, w, h, 10, 10);
      fill(...s);
      textAlign(CENTER, CENTER);
      text(this.text, this.x, this.y, w, h);
    }
    pop();
    
    if(mouseIsReleased && this.collided(mouseX, mouseY)){
      this.onClick();
    }
    
  }
  
  collided(mx, my){
    let w = textWidth(this.text)+20;
    let h = this.font_size+20;
    
    
    return mx > this.x-w/2 && mx < this.x+w/2 && my > this.y-h/2 && my < this.y+h/2;
  }
  
  
}

let mouseIsReleased = false;

function mouseReleased(){
  mouseIsReleased = true;
}
