var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Composite = Matter.Composite;
var Composites = Matter.Composites;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraifnt;
var engine;
var world;
var bodies;
var gcoll = 0;
var canvas;
var pageTitle = document.getElementById("title").innerHTML;
var totalRows;
var totalmol = 20;
var totlmolecules;

if (pageTitle == "Physical Changes")
{ 
totalRows = 6;
}
else
{
totalRows = 4;
}

totlmolecules = totalRows*5;

//body global variables 
var minTemp = -20;
var bodynumber = [];

var bodyPositionX = [];
var bodyPositionY = [];
var bodycolgrnd = [];
var Totalvel = [];
var Ke = 0;
var TotalKE =0;
var firstb;
var secondb;
var input;
var test =[];
var mouseConstraint;
var img;
var systemtemp;
var val;
var started = false;
var molID = 1;
var randomnum;
var mol1;
var mol2;
var idealRoomTemp= 25.00; //vikas
var currRoomTemp = idealRoomTemp;
var intVal;
var OneNegUnit = 8.8;
var OnePosUnit = 47.70;
var RateOfChangeNeg = OneNegUnit/40;
var RateOfChangePos = OnePosUnit/40;
var currRateChange =0;
var currScaleUnit = 0;
var collisionHeight =0;

var molarray = [];
if (pageTitle == "Chemical Changes")
{ 
molID = 2;
}
else
{
molID = 1;
}
var canvasHeight;

//# loading IMAGE for different options
function preload(){
if (molID == 1){
img = loadImage('Water.png');
}
else if (molID ==2){
img = loadImage('HydrogenPeroxide.png');
img1 = loadImage('Water.png');
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
  
  //set gravity parameters
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
      mass : 18,
      collideFlag : -1
      
      }
    return Bodies.circle(x, y,20, params);
    this.x = x;
    this.y = y;
    }
  
  // x, y, columns, rows, column gap, row gap
  var stack = Composites.stack(200,30, 5, totalRows, 0, 0, makeCircle);
  bodies = stack.bodies;
  
  for (var i = 0; i < bodies.length; i++){
  bodynumber[i] = stack.bodies[i];
  bodyPositionX[i] = stack.bodies[i].position.x;
  bodyPositionY[i] = stack.bodies[i].position.y;
  //console.log(bodynumber[i]);
  }
  
 //adding heat slider
 Heatslider = createSlider(-5,5,0);
 Heatslider.position(100,600);

 
 //value for heatslider
 input = createInput(val);
 input.position(40,500);

 //add all of the bodies to the world
  World.add(world, stack);
}

//DRAW
function draw() {

  if(started){
  Engine.update(engine);
  background(51);
  //setgravity();
  //drawcircle();
  
  
  
  for (var i =0;i< bodies.length;i++){ 
  for (var j =0;j< bodies.length;j++){
  if(i != j){
  test = intersects(bodynumber[i],bodynumber[j]);
  //var firstb = test.firstb;
  //var secondb = test.secondb;
  randomnum = Math.floor((Math.random() * 100) + 1);
  if (test != undefined && pageTitle=="Chemical Changes")//that means collision occured
  { 
    
    console.log("intersects",i,j);
    if(val > 1 && randomnum > 95 ) //randommnum is probability of conversion
    {
       if((molarray.indexOf(i) == -1)&&(molarray.indexOf(j) == -1))
        {
        molarray.push(i);
        molarray.push(j);
        mol1 = i;
        mol2 = j;
        test = [];
    }
    }
  } 
  
  
  }
  }
  }
  
//heat slider value
 val = Heatslider.value();
 
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
}
}  
}

//collision with ground collideRectRect(x, y, width, height, x2, y2, width2, height2 )
 for ( i = 0; i < bodies.length ; i++)
 {
     console.log("collision flag of body : ",i,"is :", bodynumber[i].collideFlag);
    collides(bodynumber[i]);
    

 }
 
 function collides(circlebody){ //implements ground collision
 
 collisionHeight = (circlebody.position.y + 20);
 console.log("collision height is : ", height -35);
 
 if (collisionHeight >= (height - 35) && circlebody.collideFlag == -1)
 {
     
    //console.log("body is ", circlebody);
    gcoll += 1;
    circlebody.collideFlag = 1;
 
    intVal = parseInt(document.getElementById("sliderVal").innerHTML);
    
    if (intVal == 0)
    {
        intVal = idealRoomTemp; 
    }
    else
    {
        intVal = intVal < 0 ? intVal * OneNegUnit + idealRoomTemp : intVal * OnePosUnit + idealRoomTemp;
    }
    
         
       
    //set current rate change according to currRoomTemp
    currRateChange = currRoomTemp < idealRoomTemp ? RateOfChangeNeg : RateOfChangePos;
    
    if(currRoomTemp > intVal)
    {
            currRoomTemp = currRoomTemp - currRateChange ;
            console.log("Current temp is",currRoomTemp, "and curr rate change is",currRateChange);
            if (currRoomTemp < intVal)
            {
                currRoomTemp = intVal;
            }
    }
    if(currRoomTemp < intVal )
    {
        currRoomTemp = currRoomTemp + currRateChange ;
          if (currRoomTemp > intVal)
            {
                currRoomTemp = intVal;
            }
    }
      
    console.log("Total collison so far is : ",gcoll);
    document.getElementById("temperature").innerHTML = currRoomTemp.toFixed(3) ;
    
  /*  
    intVal = parseInt(document.getElementById("sliderVal").innerHTML);
    //obtain the current scale of unit
    currScaleUnit = intVal < 0 ? OneNegUnit:OnePosUnit;
    //obtain the current rate of change as per slider position
    currRateChange = intVal < 0 ? RateOfChangeNeg:RateOfChangePos;
    //increment or decrement of current temperature
    console.log("rate of change",currRateChange);
    printtemp = printtemp +  currRateChange;
    
    if(Math.abs(printtemp) < Math.abs(intVal)* currScaleUnit)
    {
        document.getElementById("temperature").innerHTML=printtemp;
       
    }
    else
    {
        document.getElementById("temperature").innerHTML = intVal * Math.abs(currScaleUnit);
    }
    console.log("Total collison so far is : ",gcoll);
    console.log("Temp is ",printtemp); */
    
    /*----
    
    
    printtemp=printtemp + intVal /20 ;
    console.log("molecular temp is ", printtemp);
    if(printtemp < (intVal+1) * 25)
    {
        document.getElementById("temperature").innerHTML=printtemp;
        console.log("slider temp is ",(intVal+1)  * 25);
    }
    else 
    {
        document.getElementById("temperature").innerHTML = (intVal+1)  * 25;
        console.log("here in else ");
    }
         ---Vikas */
    //console.log("Total collison so far is : ",gcoll);
    //console.log("Temp is ",printtemp);
    
    
    bodycolgrnd.push(circlebody);
    //CalculateKE((intVal+1)*25);            //vikas
    //Totalvel = Math.sqrt((circlebody.velocity.x)*(circlebody.velocity.x) + (circlebody.velocity.y)*(circlebody.velocity.y));
    //Ke =  0.5*18*2*Totalvel*Totalvel;
    if(val == 0)
    {
        circlebody.velocity.y = -abs(circlebody.velocity.x);
    }
    else if(val > 0)
    {
        circlebody.velocity.y = -2 * abs(circlebody.velocity.x);
        Ke += Ke;
    }
    else if (val < 0)
    {
        Ke -= Ke;
    }
 }
 else
 {
     
    // console.log("Here in else and collision height of molecule is ", collisionHeight);
     
     if ((circlebody.position.y + 20) < (height - 35))
     {
         console.log("Here in else and collision height of molecule is ", collisionHeight);
          circlebody.collideFlag = -1;
      }
      else // if collision not detected only due to the reason it was already in collided positon 
      {
           if( intVal < idealRoomTemp) // special case to deal for negative slider position, because molecules will remain in touch with bar
            {
                    //Probability for detection should be managed in case of negative slider position
                   if ((Math.random() * (11-1) + 1) < 3)// generate random num b/w 1 and 10
                   {
                       circlebody.collideFlag = -1;
                   }
                /*   else
                   {
                       circlebody.collideFlag = 1; 
                   } */
        }
      }
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
 
  //text
  input.html(Heatslider.value());
  document.getElementById("sliderVal").innerHTML = Heatslider.value();
  //text(Heatslider.value(),40,500);
  
  
  if(Heatslider.value() == -5)
  {
  stroke('0000ff');
  line(0,canvasHeight-30,600,canvasHeight-30);
  }
     if(Heatslider.value() == -4)
  {
  stroke('2233ff');
  line(0,canvasHeight-30,600,canvasHeight-30);
  }
    if(Heatslider.value() == -3)
  {
  stroke('1a1aff');
  line(0,canvasHeight-30,600,canvasHeight-30);
  }
   if(Heatslider.value() == -2)
  {
  stroke('3333ff');
  line(0,canvasHeight-30,600,canvasHeight-30);
  }
  if(Heatslider.value() == -1)
  {
  stroke('4d4dff');
  line(0,canvasHeight-30,600,canvasHeight-30);
  }
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

  
//check circle collision
function intersects(first,other){
    var d = dist(first.position.x, first.position.y ,other.position.x, other.position.y);
    if( d <= 40) {
    first.velocity.x = -abs(first.velocity.x);
    first.velocity.y = -abs(first.velocity.y);
    other.velocity.x = -abs(other.velocity.x);
    other.velocity.y = -abs(other.velocity.y);
    return [first,other];
     }
    }


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

console.log("IN RESET pos 1");
var params1 = {
    isStatic: true,
    restitution : 1.0
    }
  
  var params = {
    isStatic: true
    };
     var ground = Bodies.rectangle(width / 2, height, width, 50, params1);
     var wall1 = Bodies.rectangle(0, height / 2, 30, height, params);
     var wall2 = Bodies.rectangle(width, height / 2, 30, height, params);
     var top = Bodies.rectangle(width / 2, 0, width, 30, params);
     World.add(world, [ground,wall1,wall2,top]);

  //add circle stack
  function makeCircle(x, y) 
  {
      var params = {
      restitution: 1.0,
      friction: 0,
      offset : 0,
      mass : 18,
      collideFlag : -1
        };
    return Bodies.circle(x, y,totalmol, params);
    this.x = x;
    this.y = y;
    
    }
     console.log("IN RESET pos 2");
  
   
  // x, y, columns, rows, column gap, row gap
  var stack = Composites.stack(200,30, 5, totalRows, 0, 0, makeCircle);
  bodies = stack.bodies;

   //handle start button after reset
  document.getElementById("start").innerHTML = "<b>START</b>";
  started = true;

  //restart timer
  document.getElementById("timer").innerHTML = 00 + ":" + 00 + ":" + 00;
  clearInterval(timerVar);
  timerfunction();
  
  //reset room Temperature
  document.getElementById("temperature").innerHTML = 25.00;
  
  //reset Heat Slider
  Heatslider.elt.value = 0;
          
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
    /*if(molarray.indexOf(i) == -1)
    {*/
    var circle = bodies[i];
    var pos = circle.position;
    var r = 20;
    var angle = circle.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    if (molarray.indexOf(i) != -1)//( i == mol1 || i == mol2)
    {
    image(img1,0,0,40,28);
    }
    else
    {
    image(img,0,0,40,28);
    }
    //ellipse(0, 0, 40, 40);
    //line(0, 0, r, 0);
    pop(); 
    } 
    //}
    
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
