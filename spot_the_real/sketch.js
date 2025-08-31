let state = {start:0, playing:1, end:2};
let curr_state = state.start;
let fonts = {};
let colors = {white: [255,255,255],
              black: [0,0,0],
              red: [255,0,0],
              blue: [0,0,255],
              green: [0,255,0],
               indigo: [75, 0, 130],
               t: [255,255,255,0]
             };
let rounds = {
  true: [],
  false: []
}


// only this variable matters and changing this will changes different states inside the game
let screens={
  start:{
    btn:null,
    text: ["CAN YOU GUESS","THE AUTHENTIC DRUG?"],
    text_btns: [null, null],
    bg: null,
    favicon: null,
  },
  playing:{
    played: 0,
    max_play: 5,
    option_a: null,
    option_b: null,
    text: ["Click on the drug you", "believe is authentic"],
    text_btns: [null, null]
  },
  end:{
    next_round:null,
    end_game: null,
    text: ["Counterfeit drugs are getting better at replicating authentic packaging. Protect yourself. Use CounterCheck to verify medications."],
    text_btns: [null],
    answer: true,
    answer_btn: null
  }
};




function preload() {
  fonts.thin = loadFont('res/fonts/Roboto-Thin.ttf');
  fonts.regular = loadFont('res/fonts/Roboto-Regular.ttf');
  fonts.bold = loadFont('res/fonts/Roboto-Bold.ttf');
  fonts.extrabold = loadFont('res/fonts/Roboto-ExtraBold.ttf');
  fonts.black = loadFont('res/fonts/Roboto-Black.ttf');
  
  screens.start.bg = loadImage("res/imgs/pattern.png");
  screens.start.favicon = loadImage("res/imgs/favicon.png");
  
  for(let i=0 ; i<screens.playing.max_play ; i++){
    rounds.true.push(loadImage(`res/imgs/true/${i+1}.png`));
    rounds.false.push(loadImage(`res/imgs/false/${i+1}.png`));
  }
}

function setup() {
  
  /* Storing user's device details in a variable*/
  let details = navigator.userAgent;

  /* Creating a regular expression 
  containing some mobile devices keywords 
  to search it in details string*/
//   let regexp = /android|iphone|kindle|ipad/i;

//   /* Using test() method to search regexp in details
//   it returns boolean value*/
//   let isMobileDevice = regexp.test(details);

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
    screens.playing.played = 0;
  };
  
  for(let i=0 ; i<screens.start.text.length ; i++){
    screens.start.text_btns[i] = new Button(width/2, height*(3+i)/8, screens.start.text[i]);
    screens.start.text_btns[i].font = fonts.black;
    screens.start.text_btns[i].font_size = 24;
  }
  
  
  screens.end.next_round = new Button(width*2/6, height*3/4, "Next");
  screens.end.next_round.onClick = ()=>{
    curr_state = state.playing;
    screens.playing.played++;
    screens.playing.played = screens.playing.played % screens.playing.max_play;
    // screens.playing.played = 0;
    
    // console.log(rounds.true.length);
  };
  
  screens.end.end_game = new Button(width*4/6, height*3/4, "End Game");
  screens.end.end_game.onClick = ()=>{
    curr_state = state.start;
  };
  
  screens.end.answer_btn = new Button(width/2, height*1/4, "Wrong Answer");
  
  
  
  screens.playing.option_a = new Button(width*2/6, height*3/4, "A");
  screens.playing.option_a.onClick = ()=>{
    // if(screens.playing.played == screens.playing.max_play-1)
    curr_state = state.end;
    screens.end.answer = false;
  }
  
  screens.playing.option_b = new Button(width*4/6, height*3/4, "B");
  screens.playing.option_b.onClick = ()=>{
    
    // if(screens.playing.played == screens.playing.max_play-1)
    curr_state = state.end;
    screens.end.answer = true;
  }
  
  
  for(let i=0 ; i<screens.start.text.length ; i++){
    screens.playing.text_btns[i] = new Button(width/2, height*(1+i)/16, screens.start.text[i]);
    screens.playing.text_btns[i].font = fonts.bold;
    screens.playing.text_btns[i].font_size = 20;
  }
  
}

function draw() {
  background(colors.white);
  
  if(curr_state == state.start){ // Start
    push();
    {  
      for(let i=0 ; i<screens.start.text.length ; i++){
        screens.start.text_btns[i].draw(colors.t, colors.indigo);
      }
       
      let factor = 1.3;
      image(screens.start.bg, -width*0.1, 0, width*factor, height*factor);
      screens.start.btn.draw(colors.indigo, colors.white);
      image(screens.start.favicon, width-50, height-50, 40, 40);
    }
    
    pop();
  }else if (curr_state == state.end){ // END
    push();
    {
      if(screens.end.answer){
        background(colors.green);
        screens.end.answer_btn.text = "Correct Answer";
      }else{
        background(colors.red);
        screens.end.answer_btn.text = "Wrong Answer";
      }
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
      if(screens.playing.played == screens.playing.max_play-1){
        // screens.end.next_round.draw(colors.indigo, colors.white);
        screens.end.end_game.draw(colors.indigo, colors.white);
      }else{
        screens.end.next_round.draw(colors.indigo, colors.white);
        screens.end.end_game.draw(colors.indigo, colors.white);
      }
    }
    pop();
  }else if (curr_state == state.playing){ // Playing
    push();
    {
      
      background(colors.white);
      
      image(rounds.false[screens.playing.played],width*1/8,height*1/8, width*3/8, height*5/8);
      
       image(rounds.true[screens.playing.played],width*4/8,height*1/8, width*3/8, height*5/8);
      
      for(let i=0 ; i<screens.start.text.length ; i++){
        screens.playing.text_btns[i].draw(colors.t, colors.indigo);
      }
      textFont(fonts.extrabold);
      text(`Round: ${screens.playing.played+1}`, width-80, height-20);
      
      translate(0,-6);
      screens.playing.option_a.draw(colors.indigo, colors.white);
      translate(0,4);
      screens.playing.option_a.draw(colors.white, colors.white);
      translate(0,2);
      screens.playing.option_a.draw(colors.indigo, colors.white);
      
      translate(0,-6);
      screens.playing.option_b.draw(colors.indigo, colors.white);
      translate(0,4);
      screens.playing.option_b.draw(colors.white, colors.white);
      translate(0,2);
      screens.playing.option_b.draw(colors.indigo, colors.white);
    }
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
