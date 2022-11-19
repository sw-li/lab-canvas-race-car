
// we need an object to carry all the dynamical informations
let canvasObj = {
  clear: function(){
    this.ctx.clearRect(0,0,500,700)
  },
  stop: function(){
    clearInterval(this.interval)
  }
}

let player = undefined
//later add function to the button to pause and restart the game
window.onload = () => {
  document.getElementById('start-button').onclick = () => {
    startGame();
  };

  function startGame() {
    //get canvas in a global variable and initiate all properties
    canvasObj.element = document.getElementById("canvas")
    canvasObj.ctx = canvasObj.element.getContext("2d")
    canvasObj.element.parentNode.style.visibility = "visible"
    // creat player
    const carImg = new Image()
    carImg.src = "images/car.png"
    player = new Player(225,630,50,70,carImg)
    //start loading obstacles and listen the events
    loadListeners()
    //also execute the updateGame function in a fixed intervals
    canvasObj.interval = setInterval(updateGame, 20)
  }
};




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
    ctx.fillRecT(this.x,this.y,this.width,this.height)
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
    ctx.drawImage(this.img,this.x, this.y,50,70)
  }
}


function updateGame(){
  canvasObj.clear()
  player.newPos()
  player.update()
}

function loadListeners(){
  document.onkeydown= function(e){
    console.log("keydown")
    switch(e.keyCode){
      case 37:
        player.speed -=2;
        break;
      case 39:
        player.speed +=2;
        break;
    }

  }
  document.onkeyup=function(e){
    console.log("keyup")
    player.speed = 0
  }
}