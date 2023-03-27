var song
var img
var fft
var particles = []


function preload(){
  song = loadSound('../Assets/PinkFloyd1.mp3')
  img = loadImage('../Assets/DarkSide2.jpg')
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  angleMode(DEGREES)
  imageMode(CENTER)


  rectMode(CENTER)
  fft = new p5.FFT(0.01) //Smoothing factor inside FFT, lower val->alpha layer fade out faster
  //Fast Fourier Transform, every frame fft analyses, the sound will return an array of values
  
  img.filter(BLUR,2)
  
}

function draw() {
  background(0);
  

  translate(width/2,height/2) //Places circle in centre

  fft.analyze()
  amp= fft.getEnergy(20,200)

  push()
if (amp>217){
  rotate(random(-1,1)) //Rotating background
}

  image(img, 0,0,width,height-200)//Try to center prism in the middle of visualizer
  pop()//Push and Pop so rotation only effects the image 

  var alpha = map(amp,0,105,200,150)
  fill(0,alpha)
  noStroke()
  rect(0,0,width,height)

 

  stroke(240)
  strokeWeight(3)
  noFill()
  

  var wave = fft.waveform() //To make spike sharper, decrease number of points in waveform

 for(var t = -1; t<=1; t +=2){//Duplicated and put -ve in front of sin to make other half of the circle
   beginShape()
   for (var i = 0;i <= 180; i+=0.5){ //i+= changes smoothness of line
    //Allows us to put a point from wave on each x coordinate across the screen
    //Make for loop iterate to 180 to make circle shape (width for line)
     var index = floor(map(i, 0, 180, 0, wave.length-1))

     var r = map(wave[index],-1,1,100,300)//Circle dimensions

     var x = r*sin(i) *t//making the half circle *-1 so its a full circle
     var y = r*cos(i) 
     //* whole thing to make the circle smaller
     //* i to change shape
     vertex(x,y)
   }  
 endShape()
}

var p = new Particle()
particles.push(p)

for(var i =particles.length-1; i>=0; i--)//iterate backwards to get ride of flicker{
  if (!particles[i].edges()){//Removes particles off screen
  particles[i].update(amp>225)//Particle Bounce
  particles[i].show()
  }else{
    particles.splice(i,1)
  }
}


function mouseClicked(){
  if (song.isPlaying()){
    song.pause()
    //noLoop()//if you want wave to stick when paused//this is freezing
  }else {
    song.play()
    //song.setVolume(0.8)
  }
}

class Particle{
  constructor(){
    this.pos=p5.Vector.random2D().mult(200)//Where particles start, mult(average of circle dimensions)
    this.vel= createVector(0,0)
    this.acc= this.pos.copy().mult(random(0.0001,0.00001))

    this.w=random(3,5)
    var colors = ['#ff0000','#FF5F1F','#FFFF00','#66FF00','#00D7ff','#9400d3',]
    this.color=colors[Math.floor(Math.random()*colors.length)] //Adding color property to particle class
  }
   update(cond){
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    if(cond) {
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
   }

   edges(){//Remove particles from array when nolonger on screen
    if(this.pos.x<-width/2 || this.pos.x>width/2 ||
     this.pos.y < -height/2 || this.pos.y >height/2){
      return true
     } else{
      return false
     }
   }


  show(){
    noStroke()
    fill(this.color)
    ellipse(this.pos.x, this.pos.y,this.w)
  }
}

