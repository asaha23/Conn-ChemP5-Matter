function CalculateKE() {
 var Totalvel = [];
 var Ke = 0;
 var TotalKE =0;
 for(i = 0 ; i< 20 ; i++)
 { 
 Totalvel[i] = Math.sqrt((bodynumber[i].velocity.x)*(bodynumber[i].velocity.x) + (bodynumber[i].velocity.y)*(bodynumber[i].velocity.y));
 Ke =  0.5*18*2*Totalvel[i]*Totalvel[i];
 TotalKE += Ke;
 
 }
 var averageKE = TotalKE/20;
systemtemp = ((averageKE*2*100)/(1.5*1.38*6.022)) - 19;
//console.log("averageKE",systemtemp,averageKE);

}


