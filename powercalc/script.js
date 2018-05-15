$(document).ready(function() {
///////////
function updateawakening1() {
if($("#input1")[0].value>70) {
	$("#input1")[0].value=70;
}
var level = $("#input1")[0].value;
var ghostlevel=level;
var curr=10;
var total=0;
while(ghostlevel>0) {
	total+=curr;
  curr+=2;
	ghostlevel-=1;
}
var lasttotal=total-curr+2;
var displaytotal = Math.floor(total);
var displaylasttotal=Math.floor(lasttotal);
var exp=Math.floor((total/lasttotal-1)*10000)/100;
$("#eff1").text("Effect: " + displaytotal + "%");
if(level>1) {
	$("#lasteff1").text("Last level's effect: " + displaylasttotal + "%")
	$("#rel1").text("Relative increase from last level: " + exp + "%")
} else {
	$("#lasteff1").text("Last level's effect: N/A")
	$("#rel1").text("Relative increase from last level: N/A")
}
return total/100+1;
}
//////////
function updateawakening2() {
if($("#input2")[0].value>30) {
	$("#input2")[0].value=30;
}
var level = $("#input2")[0].value;
var ghostlevel=level;
var curr=10;
var total=0;
while(ghostlevel>0) {
	total+=curr;
	curr+=2;
	ghostlevel-=1;
}
var lasttotal=total-curr+2;
var displaytotal = Math.floor(total);
var displaylasttotal=Math.floor(lasttotal);
var exp=Math.floor((total/lasttotal-1)*10000)/100;
$("#eff2").text("Effect: " + displaytotal + "%");
if(level>1) {
	$("#lasteff2").text("Last level's effect: " + displaylasttotal + "%")
	$("#rel2").text("Relative increase from last level: " + exp + "%")
} else {
	$("#lasteff2").text("Last level's effect: N/A")
	$("#rel2").text("Relative increase from last level: N/A")
}
return total/100+1;
}
//////////
function updatemithrilsword() {
if($("#input3")[0].value>45) {
	$("#input3")[0].value=45;
}
var level = $("#input3")[0].value;
var ghostlevel=level;
var total=1;
if(ghostlevel>=45) {
	total=0.35;
	ghostlevel=0;
} else if(ghostlevel>20) {
	total-=0.4;
	ghostlevel-=20;
}
while(ghostlevel>0) {
	if(level<=20) {
		total-=0.02;
		ghostlevel-=1;
	} else {
		total-=0.01;
		ghostlevel-=1;
	}
}
if(level<20) {
	var lasttotal=total+0.02;
} else {
	var lasttotal=total+0.01;
};
var displaytotal = 100-(Math.floor(total*10000)/100);
var displaylasttotal = 100-(Math.floor(lasttotal*10000)/100);
var exp=Math.floor(lasttotal/total*10000-10000)/100;
$("#eff3").text("Effect: -" + Math.round(displaytotal) + "%");
if(level>1) {
	$("#lasteff3").text("Last level's Effect: -" + Math.round(displaylasttotal) + "%")
	$("#rel3").text("Relative increase from last level: " + exp + "%")
} else {
	$("#lasteff3").text("Last level's Effect: N/A")
	$("#rel3").text("Relative increase from last level: N/A")
}
return 1/total;
}
//////////
function updatemistilteinn() {
if($("#input4")[0].value>105) {
	$("#input4")[0].value=105;
}
var level = $("#input4")[0].value;
var ghostlevel=level;
var total=1;
if(ghostlevel>=105) {
	total=0.125;
	ghostlevel=0;
} else if(ghostlevel>75) {
	total-=0.8;
	ghostlevel-=75;
	while(ghostlevel>0) {
		total-=0.0025;
		ghostlevel-=1;
	}
} else if(ghostlevel>45) {
	total-=0.65;
	ghostlevel-=45;
	while(ghostlevel>0) {
		total-=0.005;
		ghostlevel-=1;
	}
} else if(ghostlevel>20) {
	total-=0.4;
	ghostlevel-=20;
	while(ghostlevel>0) {
		total-=0.01;
		ghostlevel-=1;
	}
} else if(ghostlevel<=20) {
	while(ghostlevel>0) {
		total-=0.02;
		ghostlevel-=1;
	}
}
if(level>75) {
	var lasttotal=total+0.0025;
} else if(level>45) {
	var lasttotal=total+0.005;
} else if(level>20) {
	var lasttotal=total+0.01;
} else {
	var lasttotal=total+0.02;
}
var displaytotal = 100-(Math.floor(total*10000)/100);
var displaylasttotal = 100-(Math.floor(lasttotal*10000)/100);
var exp=Math.floor(lasttotal/total*10000-10000)/100;
$("#eff4").text("Effect: -" + (Math.floor(displaytotal*20)/20) + "%");
if(level>1) {
	$("#lasteff4").text("Last level's Effect: -" + (Math.floor(displaylasttotal*20)/20) + "%")
	$("#rel4").text("Relative increase from last level: " + exp + "%")
} else {
	$("#lasteff4").text("Last level's Effect: N/A")
	$("#rel4").text("Relative increase from last level: N/A")
}
return 1/total;
}
//////////
function updategoldengloves() {
var level = $("#input5")[0].value;
var ghostlevel=level;
var total=0;
if(ghostlevel>=200) {
	total+=3000;
	ghostlevel-=200;
	while(ghostlevel>0) {
		total+=10;
		ghostlevel-=1;
	}
} else {
	while(ghostlevel>0) {
		total+=15;
		ghostlevel-=1;
	}
}
if(level>200) {
	lasttotal=total-10;
} else {
	lasttotal=total-15;
}
var displaytotal = Math.floor(total);
var displaylasttotal = Math.floor(lasttotal);
var exp = Math.floor(total/lasttotal*1000000-1000000)/10000;
$("#eff5").text("Effect: " + Math.round(displaytotal) + "%");
if(level>1) {
	$("#lasteff5").text("Last level's Effect: " + Math.round(displaylasttotal) + "%")
	$("#rel5").text("Relative increase from last level: " + exp + "%")
} else {
	$("#lasteff5").text("Last level's Effect: N/A")
	$("#rel5").text("Relative increase from last level: N/A")
}
return total/100+1;
}
//////////
function updategoldvessels() {
var level = $("#input6")[0].value;
var ghostlevel=level;
var total=0;
if(ghostlevel>=100) {
	total+=1000;
	ghostlevel-=100;
	while(ghostlevel>0) {
		total+=5;
		ghostlevel-=1;
	}
} else {
	while(ghostlevel>0) {
		total+=10;
		ghostlevel-=1;
	}
}
if(level>100) {
	lasttotal=total-5;
} else {
	lasttotal=total-10;
}
var displaytotal = Math.floor(total);
var displaylasttotal = Math.floor(lasttotal);
var exp = Math.floor(total/lasttotal*1000000-1000000)/10000;
$("#eff6").text("Effect: " + Math.round(displaytotal) + "%");
if(level>1) {
	$("#lasteff6").text("Last level's Effect: " + Math.round(displaylasttotal) + "%")
	$("#rel6").text("Relative increase from last level: " + exp + "%")
} else {
	$("#lasteff6").text("Last level's Effect: N/A")
	$("#rel6").text("Relative increase from last level: N/A")
}
return total/100+1;
}
//////////
function updatephilostone() {
var level = $("#input7")[0].value;
var ghostlevel=level;
var total=0;
if(ghostlevel>=500) {
	total+=5000;
	ghostlevel-=500;
	while(ghostlevel>0) {
		total+=2;
		ghostlevel-=1;
	}
} else {
	while(ghostlevel>0) {
		total+=10;
		ghostlevel-=1;
	}
}
if(level>500) {
	lasttotal=total-2;
} else {
	lasttotal=total-10;
}
var displaytotal = Math.floor(total);
var displaylasttotal = Math.floor(lasttotal);
var exp = Math.floor(total/lasttotal*1000000-1000000)/10000;
$("#eff7").text("Effect: " + Math.round(displaytotal) + "%");
if(level>1) {
	$("#lasteff7").text("Last level's Effect: " + Math.round(displaylasttotal) + "%")
	$("#rel7").text("Relative increase from last level: " + exp + "%")
} else {
	$("#lasteff7").text("Last level's Effect: N/A")
	$("#rel7").text("Relative increase from last level: N/A")
}
return total/100+1;
}
//////////
function updatehalberd() {
var level = $("#input8")[0].value;
var ghostlevel=level;
var total=0;
if(ghostlevel>=100) {
	total+=1000;
	ghostlevel-=100;
	while(ghostlevel>0) {
		total+=5;
		ghostlevel-=1;
	}
} else {
	while(ghostlevel>0) {
		total+=10;
		ghostlevel-=1;
	}
}
if(level>100) {
	lasttotal=total-5;
} else {
	lasttotal=total-10;
}
var displaytotal = Math.floor(total);
var displaylasttotal = Math.floor(lasttotal);
var exp = Math.floor(total/lasttotal*1000000-1000000)/10000;
$("#eff8").text("Effect: " + Math.round(displaytotal) + "%");
if(level>1) {
	$("#lasteff8").text("Last level's Effect: " + Math.round(displaylasttotal) + "%")
	$("#rel8").text("Relative increase from last level: " + exp + "%")
} else {
	$("#lasteff8").text("Last level's Effect: N/A")
	$("#rel8").text("Relative increase from last level: N/A")
}
return total/100+1;
}
//////////
setInterval(function() {
	var baseattack = $("#baseattackinput")[0].value;
	baseattack = baseattack/100+1;
	var awakening1power = updateawakening1();
	var awakening2power = updateawakening2();
	var mithrilswordpower = updatemithrilsword();
	var mistilteinnpower = updatemistilteinn();
	var goldvesselspower = updategoldvessels();
	var halberdpower = updatehalberd();
	var philostonepower = updatephilostone();
	var goldenglovespower = updategoldengloves();
	var totalpower = baseattack*awakening1power*awakening2power*mithrilswordpower*mistilteinnpower*goldvesselspower*halberdpower*philostonepower*goldenglovespower;
	if(totalpower>1e20) {	
		var totalpowerexp = Math.log10(totalpower);
		var totalpowerstring = totalpower.toString();
		console.log(totalpowerstring);
		var totalpowernum = totalpowerstring[0] + "." + totalpowerstring[2] + totalpowerstring[3] + totalpowerstring[4] + totalpowerstring[5];
		$("#totalpower").text("Total Power: " + totalpowernum + "e+" + Math.floor(totalpowerexp));
	} else if(totalpower<1e20) {
		var totalpowerexp = Math.log10(totalpower);
		var totalpowerstring = totalpower.toString();
		console.log(totalpowerstring);
		var totalpowernum = totalpowerstring[0] + "." + totalpowerstring[1] + totalpowerstring[2] + totalpowerstring[3] + totalpowerstring[4];
		$("#totalpower").text("Total Power: " + totalpowernum + "e" + Math.floor(totalpowerexp));
		if(totalpower<1e5) {
		$("#totalpower").text("Total Power: " + (Math.floor(totalpower*100)/100));
		}
	}
}, 200)
});
