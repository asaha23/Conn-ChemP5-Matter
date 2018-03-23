var Engine = Matter.Engine;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Composites = Matter.Composites;
var Composite = Matter.Composite;
var Constraint = Matter.Constraint;
var engine;
var bodies;
var world;

var molID;
var molarray = [];
var gcoll = 0;
var totalRows;

var Na;
var Cl;
var NaParticles = [];
var ClParticles = [];

//store propeties of bodies
var bodynumber = [];
var bodyPositionX = [];
var bodyPositionY = [];
var minTemp = -20;
var bodycolgrnd = [];
var Ke = 0;
var TotalKE = 0;
var test = [];
var img;
var systemtemp;
var val=0;
var randomnum;
var mol1;
var mol2;
var idealRoomTemp = 25.00; //vikas
var currRoomTemp = idealRoomTemp;
var intVal;
var OneNegUnit = 8.8;
var OnePosUnit = 47.70;
var RateOfChangeNeg = OneNegUnit / 40;
var RateOfChangePos = OnePosUnit / 40;
var currRateChange = 0;
var collisionHeight = 0;
var totalSeconds = 0;
var timerVar;
var totalMolecules=0;
var stack = [];
var stackCounter = 0;

// loading IMAGE for different options
function preload() {
img = loadImage('Water.png');
img1 = loadImage('Sodium-I.png');
img2 = loadImage('Chloride.png');
}

function setup() {

    imageMode(CENTER);
    frameRate(15);

    //Create and position the canvas
    canvasHeight = window.innerHeight*0.85;
    canvasWidth = window.innerWidth*0.7;
    
    cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.position(0.3*window.innerWidth, 0.15*window.innerHeight);

    //Setup water molecules by default
    molID == 1
    img = loadImage('Water.png');

    //create an engine
    engine = Engine.create();
    world = engine.world;

    //set gravity parameters
    var gravityX = world.gravity.x;
    var gravityY = world.gravity.y;

    //add rectangles/floors
    var params1 = {
        isStatic: true,
        restitution: 1.0
    }

    var params = {
        isStatic: true
    }
    var ground = Bodies.rectangle(width / 2, height, width, 0.04*height*2, params1);
    var wall1 = Bodies.rectangle(0, height / 2, 0.016*width*2, height, params);
    var wall2 = Bodies.rectangle(width, height / 2, 0.016*width*2, height, params);
    var top = Bodies.rectangle(width / 2, 0, width, 0.025*height*2, params);
    World.add(world, [ground, wall1, wall2, top]);

    //reset bodies to 0
    bodies = [];
    NaParticles = [];
    ClParticles = [];
    
    //add circle stack
    addMolecules(28);
    
    addMoleculesNacl(2);
    
    //RESET
    //slider
    document.getElementById("heatValue").innerHTML=0;
    sliderHeat.setValue(0);

    //timer
    totalSeconds=0;
    clearInterval(timerVar);
    var hour = Math.floor(totalSeconds /3600);
    var minute = Math.floor((totalSeconds - hour*3600)/60);
    seconds = totalSeconds - (hour*3600 + minute*60);
    timervalue = hour + ":" + minute + ":" + seconds;
    document.getElementById("timer").innerHTML = timervalue;

    //Graph
    removeData(myLineChart);
}

function draw() {
    
    background(51);
    engine.timing.timeScale=document.getElementById("speedValue").innerHTML;
    drawinitialsetup();
    Engine.update(engine);

    for (var i = 0; i < bodies.length; i++) {
        for (var j = 0; j < bodies.length; j++) {
           if (i != j) {
                test = intersects(bodynumber[i], bodynumber[j]);
                randomnum = Math.floor((Math.random() * 100) + 1);
                if (test != undefined) //that means collision occured
               {
                    if (val > 1 && randomnum > 95) //randommnum is probability of conversion
                    {
                        if ((molarray.indexOf(i) == -1) && (molarray.indexOf(j) == -1)) {
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
    val = document.getElementById("heatValue").innerHTML;
    var intValtemp = currRoomTemp;

    //heatslider changes with value
    if (intValtemp > 100) {
        world.gravity.y = 0;
    } else if (intValtemp < 0) {
        world.gravity.y = 0.3;
        applyforce(0.005);
    } else if (intValtemp < 100) {
        world.gravity.y = 0.3;
        applyforce(0.00005);
    }
    
   applyforceNaCl(0.001);

    //Applying attractive forces between all molecules
    function applyforce(mag) {
        for (var i = 0; i < bodies.length; i++) {
            for (var j = 0; j < bodies.length; j++) {
                var pvector = createVector((bodynumber[i].position.x), (bodynumber[i].position.y));
                var p2vector = createVector((bodynumber[j].position.x), (bodynumber[j].position.y));
                var distforce = dist(bodynumber[i].position.x, bodynumber[i].position.y, bodynumber[j].position.x, bodynumber[j].position.y);
                var diffvector = p5.Vector.sub(pvector, p2vector);
                diffvector.normalize();
                diffvector.mult(mag);
                //line(diffvector);
                if (distforce > 40) {
                    Matter.Body.applyForce(bodynumber[j], p2vector, diffvector);
                }
            }
        }
    }
    
     //Applying attractive forces between NaCl molecules
    function applyforceNaCl(mag) {
        for (var i = 0; i < NaParticles.length; i++) {
            for (var j = 0; j < NaParticles.length; j++) {
                var pvector = createVector((NaParticles[i].position.x),(NaParticles[i].position.y));
                var p2vector = createVector((NaParticles[j].position.x),(NaParticles[j].position.y));
                var distforce = dist(NaParticles[i].position.x, NaParticles[i].position.y, NaParticles[j].position.x, NaParticles[j].position.y);
                var diffvector = p5.Vector.sub(pvector, p2vector);
                diffvector.normalize();
                diffvector.mult(mag);
                if (distforce > 40) {
                    Matter.Body.applyForce(NaParticles[j], p2vector, diffvector);
                }
            }
        }
        for (var i = 0; i < ClParticles.length; i++) {
            for (var j = 0; j < ClParticles.length; j++) {
                var pvector = createVector((ClParticles[i].position.x),(ClParticles[i].position.y));
                var p2vector = createVector((ClParticles[j].position.x),(ClParticles[j].position.y));
                var distforce = dist(ClParticles[i].position.x, ClParticles[i].position.y, ClParticles[j].position.x, ClParticles[j].position.y);
                var diffvector = p5.Vector.sub(pvector, p2vector);
                diffvector.normalize();
                diffvector.mult(mag);
                if (distforce > 40) {
                    Matter.Body.applyForce(ClParticles[j], p2vector, diffvector);
                }
            }
        }
    }
    
    
    //collision
    for (i = 0; i < bodies.length; i++) {
        collides(bodynumber[i]);
    }

    function collides(circlebody) { //implements ground collision

        collisionHeight = (circlebody.position.y + 20);

        if (collisionHeight >= (height - 35) && circlebody.collideFlag == -1) {

            gcoll += 1;
            circlebody.collideFlag = 1;

            intVal = document.getElementById("heatValue").innerHTML;

            if (intVal == 0) {
                intVal = idealRoomTemp;
            } else {
                intVal = intVal < 0 ? intVal * OneNegUnit + idealRoomTemp : intVal * OnePosUnit + idealRoomTemp;
            }

            //set current rate change according to currRoomTemp
            currRateChange = currRoomTemp < idealRoomTemp ? RateOfChangeNeg : RateOfChangePos;

            if (currRoomTemp > intVal) {
                currRoomTemp = currRoomTemp - currRateChange;
                if (currRoomTemp < intVal) {
                    currRoomTemp = intVal;
                }
            }
            if (currRoomTemp < intVal) {
                currRoomTemp = currRoomTemp + currRateChange;
                if (currRoomTemp > intVal) {
                    currRoomTemp = intVal;
                }
            }

            //Add temperature value onscreen from HARDCODE
            document.getElementById("heat").innerHTML = currRoomTemp.toFixed(3);

            bodycolgrnd.push(circlebody);
            if (val == 0) {
                circlebody.velocity.y = -abs(circlebody.velocity.x);
            } else if (val > 0) {
                circlebody.velocity.y = -2 * abs(circlebody.velocity.x);
                Ke += Ke;
            } else if (val < 0) {
                Ke -= Ke;
            }
        } else {

            if ((circlebody.position.y + 20) < (height - 35)) {
                circlebody.collideFlag = -1;
            } else // if collision not detected only due to the reason it was already in collided positon 
            {
                if (intVal < idealRoomTemp) // special case to deal for negative slider position, because molecules will remain in touch with bar
                {
                    //Probability for detection should be managed in case of negative slider position
                    if ((Math.random() * (11 - 1) + 1) < 3) // generate random num b/w 1 and 10
                    {
                        circlebody.collideFlag = -1;
                    }
                }
            }
        }
    }

    //set forces after and before separation
    if (gcoll == 0) {
        applyforce(0.0008);
        var mag = 0.0008;
    } else {
        applyforce(0);
        mag = 0;
    }

    //check circle collision
    function intersects(first, other) {
        var d = dist(first.position.x, first.position.y, other.position.x, other.position.y);
        if (d <= 40) {
            first.velocity.x = -abs(first.velocity.x);
            first.velocity.y = -abs(first.velocity.y);
            other.velocity.x = -abs(other.velocity.x);
            other.velocity.y = -abs(other.velocity.y);
            return [first, other];
        }
    }

    //Apply force between molecules
    for (var i = 0; i < bodies.length; i++) {
        var positionvec = createVector((bodynumber[i].position.x), (bodynumber[i].position.y));
        var v = createVector((0.02 * random(-1, 1)), (0.05 * random(-1, 1)));
        Matter.Body.applyForce(bodynumber[i], positionvec, v);
    }
}


function drawinitialsetup() {
    
    drawcircle();
    //draw floor
    stroke(108, 108, 108);
    strokeWeight(10);
    
    //bottom wall
    fill(108, 108, 108);
    rect(0, height - 0.04*height, width, 0.04*height);

    //left wall
     fill(108, 108, 108);
     rect(0, 0, 0.016*width, height);

     //right wall
     fill(108, 108, 108);
     rect(width - 15, 0, 0.016*width, height);

     //top wall
     fill(108, 108, 108);
     rect(0, 0, width, 0.025*height);
}

function drawcircle() {
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
        image(img, 0, 0, 40, 28);
        pop();
    }
    
   //Drawing sodium Chloride
    stroke(255);
    strokeWeight(2);
    fill(255, 50);
   for (var i = 0; i < NaParticles.length;i++)
   {
    var Na = NaParticles[i];
    var Cl = ClParticles[i];
    var Napos = Na.position;
    var Clpos = Cl.position;
    var Naangle = Na.angle;
    var Clangle = Cl.angle;
        
        push();
        translate(Napos.x, Napos.y);
        //rotate(Naangle);
        image(img1, 0, 0,30,30);
        pop();
        
        push();
        translate(Clpos.x, Clpos.y);
        //rotate(Clangle);
        image(img2, 0, 0,40,40);
        pop();
    }
    
}
function setHeatSliderVal(){
    document.getElementById("heatValue").innerHTML=document.getElementById("ex4").value;
}
function setSpeedSliderVal(){
    document.getElementById("speedValue").innerHTML=document.getElementById("ex2").value;
}
function setAddMoleculeLabel(){
    document.getElementById("moleculeval").innerHTML=document.getElementById("ex1").value;
}

function addMoleculesBtn(){
    addMolecules(document.getElementById("moleculeval").innerHTML);
}

function addMoleculesBtnNacl(){
    addMoleculesNacl(document.getElementById("moleculevalNacl").innerHTML);
}

function addMoleculesNacl(number)
{
     function particleNa(x, y) {
        var params = {
            restitution: 1.0,
            friction: 0,
            offset: 0,
            mass: 18,
            collideFlag: -1

        }
        return Bodies.circle(x, y, 20, params);
    }
    
    function particleCl(x, y) {
        var params = {
            restitution: 1.0,
            friction: 0,
            offset: 0,
            mass: 18,
            collideFlag: -1

        }
        return Bodies.circle(x, y, 20, params);
    }

  // Na = new particleNa(300,350);
  // Cl = new particleCl(360,370);

   for (var i= 0,x=200,y1 = 100,y2 = 150; i< number;i++,x+=40,y1=150,y2=100)
   {
   console.log(x,y1);
   NaParticles.push(new particleNa(x,y1));
   ClParticles.push(new particleCl(x,y2));
   if (NaParticles.length < 3)
    {
    NaParticles[i].isSleeping = true;
    ClParticles[i].isSleeping = true;
    console.log("working");
    }
   }
   
   console.log(NaParticles.length + "  NA  " +ClParticles.length + "Cl");
    
    for (var i = (NaParticles.length - number)  ; i < NaParticles.length ;i++)
    {
    World.add(world, [NaParticles[i],ClParticles[i]]);
    
    var options = {
    	bodyA : NaParticles[i],
    	bodyB : ClParticles[i],
    	length : 50,
        stiffness : 1.1
        }

    var constraint = Constraint.create(options);
    World.add(world,constraint);
    }
    

}

function addMolecules(number){

    var row=number/4;
    var column=number/row;
    if(number<28){
        row=number/2;
        column=number/row;
    }

    function makeCircle(x, y) {
        var params = {
            restitution: 1.0,
            friction: 0,
            offset: 0,
            mass: 18,
            collideFlag: -1

        }
        return Bodies.circle(x, y, 20, params);
    }

    // x, y, columns, rows, column gap, row gap
    stack[stackCounter] = Composites.stack(350, 30, row, column, 0, 0, makeCircle);
    console.log(stack[stackCounter]);
    totalMolecules+=row*column;
    World.add(world, stack[stackCounter]);
    //Composite.add(stack);
    //Matter.Composite.allBodies(Composite);
    var bodynum=bodynumber.length;
    if(bodies != undefined){
        var oldbodies=bodies;
        var newbodies= stack[stackCounter].bodies;
        bodies=oldbodies.concat(newbodies);
        console.log(bodies);
    }
    else{
        bodies = stack[stackCounter].bodies;
    }

    for (var i = 0; i < bodies.length; i++) {
        bodynumber[i] = bodies[i];
        if (row==7) {
            bodynumber[i].isSleeping = true;
        }
        bodyPositionX[i] = bodies[i].position.x;
        bodyPositionY[i] = bodies[i].position.y;
    }
    stackCounter++;
}
//start simulation
function start(){
    for (var i = 0; i < bodynumber.length ; i++){
        bodynumber[i].isSleeping = false;
    }
    for (var i = 0; i < NaParticles.length ; i++)
    {
    if (NaParticles.length < 3)
    {
    NaParticles[i].isSleeping = false;
    ClParticles[i].isSleeping = false;
    console.log("working");
    }
    }
    timerVar = setInterval(countTimer, 1000);
}
//pause the simulation
function pause(){
    for (var i = 0; i < bodynumber.length ; i++){
        bodynumber[i].isSleeping = true;
    }
    clearInterval(timerVar);
    
    for (var i = 0; i < NaParticles.length ; i++)
    {
    NaParticles[i].isSleeping = true;
    ClParticles[i].isSleeping = true;
    console.log("working");
    }
}

//line Graph
var ctxL = document.getElementById("lineChart").getContext('2d');
var myLineChart = new Chart(ctxL, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: "Water",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            },
        ]
    },
    options: {
        responsive: true
    }    
});

//Add data to graph
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

//Delete Data from graph
function removeData(chart) {

    var count=chart.data.labels.length;
    for (var i = 0; i < count; i++) {
        chart.data.labels.pop();
    }
    chart.data.datasets.forEach((dataset) => {
        for (var i = 0; i < count; i++) {
            dataset.data.pop();
        }
    });
    chart.update();
}

//Timer
function countTimer() {
   ++totalSeconds;
   var hour = Math.floor(totalSeconds /3600);
   var minute = Math.floor((totalSeconds - hour*3600)/60);
   seconds = totalSeconds - (hour*3600 + minute*60);
   timervalue = hour + ":" + minute + ":" + seconds;
   document.getElementById("timer").innerHTML = timervalue;
   //document.getElementById("timer").style.color = "black";
   document.getElementById("timer").style.font = " bold 20px arial,serif";

   //Setting the graph
    addData(myLineChart, timervalue, totalMolecules);
}
