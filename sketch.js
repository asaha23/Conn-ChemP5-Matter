var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Composite = Matter.Composite;
var Composites = Matter.Composites;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;
var engine;
var world;
var bodies;
var gcoll = 0;
var canvas;
var totalmol = 20;

//body global variables 
var bodynumber = [];
var bodyPositionX = [];
var bodyPositionY = [];
var input;
var mouseConstraint;
var img;
var systemtemp;
var val;
var started = false;
var molID = 1;
var canvasHeight;

//#IMAGE
function preload(){
if (molID == 1){
img = loadImage('Water.png');
}
else if (molID ==2){
img = loadImage('HydrogenPeroxide.png');
}
else if (molID ==3){
img = loadImage('Pentane.png');
}
else if (molID ==4){
img = loadImage('Mercury.png');
}
else if (molID ==5){
img = loadImage('Bromine.png');
}
else if (molID ==6){
img = loadImage('Silver.png');
}
else if (molID ==7){
img = loadImage('SiliconDioxide.png');
}
}


function setup() {
  imageMode(CENTER);
  frameRate(5);
  canvasHeight = window.innerHeight;
  cnv = createCanvas(600, window.innerHeight);
  cnv.position((width/2)+50,0);
  
  //create an engine
  engine = Engine.create();
  world = engine.world;
  world.gravity.y = 0.1;
  
  var gravityX = world.gravity.x;
var gravityY = world.gravity.y;
  
  
  //add rectangles/floors
  var params1 = {
    isStatic: true,
    restitution : 1.0
    }
  
  var params = {
    isStatic: true
    }
     var ground = Bodies.rectangle(width / 2, height, width, 50, params1);
     var wall1 = Bodies.rectangle(0, height / 2, 30, height, params);
     var wall2 = Bodies.rectangle(width, height / 2, 30, height, params);
     var top = Bodies.rectangle(width / 2, 0, width, 30, params);
     World.add(world, [ground,wall1,wall2,top]);

  //add circle stack
  function makeCircle(x, y) {
      var params = {
      restitution: 1.0,
      friction: 0,
      offset : 0,
      mass : 18
      }
    return Bodies.circle(x, y, 20, params);
    this.x = x;
    this.y = y;
    
  }
  
  // x, y, columns, rows, column gap, row gap
  var stack = Composites.stack(200,30, 5, 4, 0, 0, makeCircle);
  bodies = stack.bodies;
  
  for (var i = 0; i < bodies.length; i++){
  bodynumber[i] = stack.bodies[i];
  bodyPositionX[i] = stack.bodies[i].position.x;
  bodyPositionY[i] = stack.bodies[i].position.y;
  console.log(bodynumber[i]);
  }
  

 //adding heat slider
 Heatslider = createSlider(-5,5,0);
 Heatslider.position(100,600);
 
 //value for heatslider
 input = createInput(val);
 input.position(40,500);
 
 
 //adding reset button
 //ResetButton = createButton("Reset");
 //ResetButton.position(50,260);
 //ResetButton.mousePressed(resetSketch);

 // add all of the bodies to the world
  World.add(world, stack);
  
 //run the engine
 //Engine.run(engine);
}



//DRAW
function draw() {
if(started){

  Engine.update(engine);
  background(51);
  //setgravity();
  //drawcircle();
  
  CalculateKE();
  //setgravity();
  for (var i =0;i< bodies.length;i++){ 
  for (var j =0;j< bodies.length;j++){
  if(i != j){
  var test = intersects(bodynumber[i],bodynumber[j]);
  }
  }
  }
  
  //heat slider value
 val = Heatslider.value();
 console.log(val);
 
 //heatslider changes with value
 if(val > 0)
 {
 world.gravity.y = 0;
 }
 else if (val == 0)
 {
 world.gravity.y = 0.3;
 applyforce(0);
 }
 else if (val < 0)
 {
 world.gravity.y = 0.3;
 applyforce(0.004);
 }


//try block
function applyforce(mag) {
for ( var i = 0; i < bodies.length ; i++)
{
for( var j = 0; j < bodies.length ; j++){
var pvector = createVector((bodynumber[i].position.x),(bodynumber[i].position.y));
var p2vector = createVector((bodynumber[j].position.x),(bodynumber[j].position.y));
var distforce = dist(bodynumber[i].position.x, bodynumber[i].position.y ,bodynumber[j].position.x, bodynumber[j].position.y);
var diffvector = p5.Vector.sub(pvector,p2vector);
diffvector.normalize();
diffvector.mult(mag);
//line(diffvector);
if(distforce > 40){
Matter.Body.applyForce(bodynumber[j],p2vector,diffvector);
}
console.log(pvector,p2vector,diffvector,bodynumber[0]);

}
}  
}

//collision with ground collideRectRect(x, y, width, height, x2, y2, width2, height2 )
 for ( i = 0; i < bodies.length ; i++)
 {
 collides(bodynumber[i]);
 }
 
 function collides(circlebody){
 if ((circlebody.position.y + 30) >= (height - 35)){
 gcoll += 1;
 if(val == 0){
 circlebody.velocity.y = -abs(circlebody.velocity.x);
 }
 else if(val > 0){
 circlebody.velocity.y = -2 * abs(circlebody.velocity.x);
 }
 else if (val < 0){
 circlebody.velocity.y = -0.20 * abs(circlebody.velocity.x);
 }
 console.log("groundcollide",gcoll);
 }
 }

if (gcoll == 0) {
applyforce(0.0008);
var mag = 0.0008;
}
else
{
applyforce(0); 
mag = 0;
} 
 
 console.log("magnitude",mag);

  //text
  input.html(Heatslider.value());
  text(Heatslider.value(),40,500);
  
  if(Heatslider.value() == 0)
  {
  stroke('6c6c6c');
  line(0,canvasHeight-30,600,canvasHeight-30);
  }
  if(Heatslider.value() == 1)
  {
  stroke('#ff4d4d');
  line(0,canvasHeight-30,600,canvasHeight-30);
  }
  if(Heatslider.value() == 2)
  {
  stroke('#ff3333');
  line(0,canvasHeight-30,600,canvasHeight-30);
  }
  if(Heatslider.value() == 3)
  {
  stroke('#ff1a1a');
  line(0,canvasHeight-30,600,canvasHeight-30);
  }
  if(Heatslider.value() == 4)
  {
  stroke('#ff0000');
  line(0,canvasHeight-30,600,canvasHeight-30);
  }
  if(Heatslider.value() == 5)
  {
  stroke('#b30000');
  line(0,canvasHeight-30,600,canvasHeight-30);
  }
  
  
  //draw floor
  stroke(108,108,108);
  strokeWeight(10);
  fill(108,108,108);
  rect((width/2)-300, height-25, width, 25 );
  
  fill(108,108,108);
  rect(0, 0, 15, height);
  
  fill(108,108,108);
  rect(width-15, 0	, 15, height);
  
  fill(108,108,108);
  rect(0,0, width, 15 );

/*
 var ground = Bodies.rectangle(width / 2, height, width, 50, params1);
     var wall1 = Bodies.rectangle(0, height / 2, 30, height, params);
     var wall2 = Bodies.rectangle(width, height / 2, 30, height, params);
     var top = Bodies.rectangle(width / 2, 0, width, 30, params);
*/
  
  
//check circle collision
function intersects(first,other){
    var d = dist(first.position.x, first.position.y ,other.position.x, other.position.y);
    if( d <= 30) {
    first.velocity.x = -abs(first.velocity.x);
    first.velocity.y = -abs(first.velocity.y);
    other.velocity.x = -abs(other.velocity.x);
    other.velocity.y = -abs(other.velocity.y);
    var test = 1;
    console.log(test);
    }
    }

//move bubbles to give vibrations
/*for (var i = 0; i < bodies.length; i++) {
bodynumber[i].position.x = bodynumber[i].position.x  + 0.35*random(-1,1);
bodynumber[i].position.y = bodynumber[i].position.y  + 0.35*random(-1,1);
                                         }*/
   
   for (var i = 0; i < bodies.length; i++) {
  var positionvec = createVector((bodynumber[i].position.x),(bodynumber[i].position.y));
  var v = createVector((0.02*random(-1,1)),(0.05*random(-1,1)));
  Matter.Body.applyForce(bodynumber[i],positionvec,v);
                                         }
  drawcircle();    
   }
  else 
   {
  drawinitialsetup();
   }
   }

//reset function
function myFunctionR(){
engine.world.gravity.y = 0;
var params1 = {
    isStatic: true,
    restitution : 1.0
    }
  
  var params = {
    isStatic: true
    }
     var ground = Bodies.rectangle(width / 2, height, width, 50, params1);
     var wall1 = Bodies.rectangle(0, height / 2, 30, height, params);
     var wall2 = Bodies.rectangle(width, height / 2, 30, height, params);
     var top = Bodies.rectangle(width / 2, 0, width, 30, params);
     World.add(world, [ground,wall1,wall2,top]);

  //add circle stack
  function makeCircle(x, y) {
      var params = {
      restitution: 1.0,
      friction: 0,
      offset : 0,
      mass : 18
      }
    return Bodies.circle(x, y, 20, params);
    this.x = x;
    this.y = y;
    
     }
  
  // x, y, columns, rows, column gap, row gap
  var stack = Composites.stack(200,30, 5, 4, 0, 0, makeCircle);
  bodies = stack.bodies;

   //handle start button after reset
  document.getElementById("start").innerHTML = "<b>START</b>"
  started = true;

  //restart timer
  document.getElementById("timer").innerHTML = 00 + ":" + 00 + ":" + 00;
  clearInterval(timerVar);
  timerfunction();
}

//draw initial setup
function drawinitialsetup(){
background(51);
drawcircle();
//draw floor
  stroke(108,108,108);
  strokeWeight(10);
  fill(108,108,108);
  rect((width/2)-300, height-25, width, 25 );
  
  fill(108,108,108);
  rect(0, 0, 15, height);
  
  fill(108,108,108);
  rect(width-15, 0	, 15, height);
  
  fill(108,108,108);
  rect(0,0, width, 15 );
  }



 //draw function inside DRAW
 function drawcircle(){
  stroke(255);
  strokeWeight(2);
  fill(255, 50);
  for (var i = 0; i < bodies.length; i++) {
    var circle = bodies[i];
    var pos = circle.position;
    var r = 20;
    var angle = circle.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    image(img,0,0,40,28);
   // ellipse(0, 0, 30, 30);
    //line(0, 0, r, 0);
    pop();  
    }
    
//Attractive forces between all molecules
function attractiveForce(first,other){
var distance = dist(first.position.x, first.position.y ,other.position.x, other.position.y);
var dxx = first.position.x - other.position.x;
var dyy = first.position.y - other.position.y;
var nx = dxx/distance;
var ny = dyy/distance;
}


//instantaneous push to each molecule
function move(){
 for (var i = 0; i < bodies.length; i++) {
 bodynumber[i].position.x = bodynumber[i].position.x  + random(-1,1);
 bodynumber[i].position.y = bodynumber[i].position.y  + random(-1,1);
 }
}

//increasing offset value on each draw() call
 for (var i = 0; i < bodies.length; i++) {
 bodynumber[i].offset = bodynumber[i].offset + 5;
 } 
}
