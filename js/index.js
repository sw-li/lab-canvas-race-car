
// we need an object to carry all the dynamical informations
let canvasObj = {
  frames: 0,
  clear: function(){
    this.ctx.clearRect(0,0,500,700)
  },
  stop: function(){
    clearInterval(this.interval)
    this.ctx.fillStyle = "red"
    this.ctx.font = "50px Arial"
    this.ctx.textAlign = "center"
    this.ctx.textBaseline = "middle"
    this.ctx.fillText("GAME OVER", 250, 350)
  },
  interval:undefined,
  gameSpeed:1,
  score:0
}

let obstacles = []

let player = undefined
//later add function to the button to pause and restart the game
window.onload = () => {
  document.getElementById('start-button').onclick = () => {
    startGame();
  };

  function startGame() {
    //get canvas in a global variable and initiate all properties
    resetGame()
    canvasObj.element = document.getElementById("canvas")
    canvasObj.ctx = canvasObj.element.getContext("2d")
    canvasObj.clear()
    canvasObj.element.parentNode.style.visibility = "visible"
    // creat player
    const carImg = new Image()
    carImg.src = "images/car.png"
    player = new Player(225,630,50,70,carImg)
    //start loading obstacles and listen the events
    loadListeners()
    //also execute the updateGame function in a fixed intervals
    canvasObj.interval = setInterval(updateGame, 20) // 50 frames every second
  }
};

function resetGame(){
  document.getElementById("canvas").getContext("2d").clearRect(0,0,500,700)
  obstacles = []
  clearInterval(canvasObj.interval)
  canvasObj.score = 0
}


class Componant{
  constructor(x,y,width,height,color){
    this.width = width
    this.height = height
    this.color = color
    this.x = x
    this.y = y
    //there is only one speed, not x axis movement
    this.speed = 0
  }
  newPos(){
    this.x += this.speed
  }
  update(){
    let ctx = canvasObj.ctx;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y,this.width,this.height)
  }
  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }

  crashWith(obstacle) {
    return !(this.bottom() < obstacle.top() || this.top() > obstacle.bottom() || this.right() < obstacle.left() || this.left() > obstacle.right());
  }


}


//start with a block of color, later change it into image
class Player extends Componant{
  constructor(width,height,x,y,img){
    super(width,height,x,y)
    this.img = img
  }
  update(){
    let ctx = canvasObj.ctx;
    // make sure the car dosen't go off the road. 
    if(this.x<0) this.x=0
    if(this.x>450) this.x =450
    ctx.drawImage(this.img,this.x, this.y,50,70)
  }
}


function updateGame(){
  canvasObj.clear()
  player.newPos()
  player.update()
  updateObstacles()
  checkGameOver()
  updateScore()
}

function updateScore(){
  canvasObj.ctx.fillStyle = "Orange"
  canvasObj.ctx.font = "20px Arial"
  canvasObj.ctx.fillText(`Score:${canvasObj.score}`,400, 30)
}

function updateObstacles(){
  //loop through obstacles Array and update their position. 
  for(let i = 0; i< obstacles.length; i++){
    obstacles[i].y += 2* canvasObj.gameSpeed
    obstacles[i].update()
  }
  // everytime it runs, one frame added to the frames

  canvasObj.frames ++
  // decide the frequency of obstacles génération, 
  // start from every 120, 
  if(canvasObj.frames % Math.floor(100/canvasObj.gameSpeed) === 0){
  // the width is 500px, the car is 50px wide. 
  // let the gap be between 80 to 100
  const gap = Math.floor(Math.random()*70 + 80)
  // let obstacles have minimul of 10 px wide. so maximum 500 - 80 - 20 = 400 px. 
  const leftObstacleWidth = Math.floor(Math.random()*380 +20)

  obstacles.push(new Componant(0,0,leftObstacleWidth,10,randomColor()))
  obstacles.push(new Componant(leftObstacleWidth+gap,0,500-leftObstacleWidth-gap,10,randomColor())) 
  }
  // delete used componants when their y is bigger than 700, which add 5 points to the score. 
  for(let i = 0; i< obstacles.length; i++){
    if(obstacles[i].y > 710) {
      canvasObj.score += 1 
      obstacles.splice(i,1)
    } 
  }
}

function randomColor(){
  return `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`
}

//Add listeners onkeydown onkeyup
function loadListeners(){
  document.onkeydown= function(e){
    console.log("keydown")
    switch(e.keyCode){
      case 37:
        while(player.speed > -10){ player.speed -=1};
        break;
      case 39:
        while(player.speed < 10){ player.speed +=1};
        break;
      case 38:
        while(canvasObj.gameSpeed < 2)  canvasObj.gameSpeed += 0.1
        break
      case 40:
        while(canvasObj.gameSpeed >1)  canvasObj.gameSpeed -= 0.1
        break
    }
  }
  document.onkeyup=function(e){
    console.log("keyup")
    player.speed = 0
  }
}

function checkGameOver() {
  const crashed = obstacles.some(function(obstacle) {
    return player.crashWith(obstacle);
  });
  if (crashed) {
    canvasObj.stop();
  }
}