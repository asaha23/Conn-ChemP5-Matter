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

//body global variables 
var bodynumber = [];
var bodyPositionX = [];
var bodyPositionY = [];
var input;
var mouseConstraint;
var img;
var systemtemp;
var val;

//#IMAGE
function preload(){
img = loadImage('Water.png');
}


function setup() {
  imageMode(CENTER);
   frameRate(10);
  cnv = createCanvas(600, 600);
  cnv.position(width/2,0);
  
  //create an engine
  engine = Engine.create();
  world = engine.world;
  world.gravity.y = 0.2;
  
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
     var wall1 = Bodies.rectangle(0, height / 2, 50, height, params);
     var wall2 = Bodies.rectangle(width, height / 2, 50, height, params);
     var top = Bodies.rectangle(width / 2, 0, width, 50, params);
     World.add(world, [ground,wall1,wall2,top]);

  //add circle stack
  function makeCircle(x, y) {
      var params = {
      restitution: 1.0,
      friction: 0,
      offset : 0,
      mass : 18
      }
    return Bodies.circle(x, y, 27, params);
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
 Heatslider.position(30,300);
 
 //value for heatslider
 input = createInput(val);
 input.position(40,500);
 
 
 //adding reset button
 ResetButton = createButton("Reset");
 ResetButton.position(50,260);
 //ResetButton.mousePressed(resetSketch);

 // add all of the bodies to the world
  World.add(world, stack);
  
 //run the engine
 //Engine.run(engine);
}



//DRAW
function draw() {
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
 world.gravity.y = 0.2;
 applyforce(0);
 }
 else if (val < 0)
 {
 world.gravity.y = 0.2;
 applyforce(0.0008);
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
 if ((circlebody.position.y + 30) >= (height - 25)){
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
  
  //draw floor
  stroke(0);
  strokeWeight(1);
  fill(255,50);
  rect((width/2) -300, height -25, width, );

  

  
  //Gravity Adjustments
/*function setgravity(){
if (systemtemp >= 100)  { // Gas case
						world.gravity.y = 0;
						world.gravity.x = 0;
                         } 
else if (systemtemp <= 0) { // Solid case
						world.gravity.y = (100 - systemtemp) / (100 - 0);
						world.gravity.x = world.gravity.y * 0.02;
					      } 
else                    { // Liquid case
						world.gravity.y = (100 - systemtemp) / (100 - 0);
						world.gravity.x = world.gravity.y * 0.6;
					     }
						 
console.log("gravity",systemtemp,world.gravity.y,world.gravity.x);
}*/
  
  
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
for (var i = 0; i < bodies.length; i++) {
bodynumber[i].position.x = bodynumber[i].position.x  + 0.35*random(-1,1);
bodynumber[i].position.y = bodynumber[i].position.y  + 0.35*random(-1,1);
                                         }
   
   
   //move bubbles to give angular vibrations
for (var i = 0; i < bodies.length; i++) {
bodynumber[i].angularVelocity = bodynumber[i].angularVelocity  + 0.50*random(-1,1);
                                         }                                      
                                             
    
    
 
 drawcircle();    
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
    image(img,0,0,40,30);
    //ellipse(0, 0, 30, 30);
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
