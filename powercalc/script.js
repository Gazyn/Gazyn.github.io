document.addEventListener("DOMContentLoaded", function(event) {
    //////////
    var exponents = ["K", "M", "B", "T", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "aa", "ab", "ac", "ad", "ae", "af", "ag", "ah", "ai", "aj", "ak", "al", "am", "an", "ao", "ap", "aq", "ar", "as", "at", "au", "av", "aw", "ax", "ay", "az", "ba", "bb", "bc", "bd", "be", "bf", "bg", "bh", "bi", "bj", "bk", "bl", "bm", "bn", "bo", "bp", "bq", "br", "bs", "bt", "bu", "bv", "bw", "bx", "by", "bz"];
	tab1button.addEventListener("click", function() {
        tab1.style.visibility = "visible";
        tab2.style.visibility = "hidden";
        tab3.style.visibility = "hidden";
		tab4.style.visibility = "hidden";
    });
    tab2button.addEventListener("click", function() {
        tab1.style.visibility = "hidden";
        tab2.style.visibility = "visible";
        tab3.style.visibility = "hidden";
		tab4.style.visibility = "hidden";
    });
    tab3button.addEventListener("click", function() {
        tab1.style.visibility = "hidden";
        tab2.style.visibility = "hidden";
        tab3.style.visibility = "visible";
		tab4.style.visibility = "hidden";
    });
	tab4button.addEventListener("click", function() {
		tab1.style.visibility = "hidden";
		tab2.style.visibility = "hidden";
		tab3.style.visibility = "hidden";
		tab4.style.visibility = "visible";
	});
	//////////
    function updateawakening1() {
        if (input1.value > 70) {
            input1.value = 70;
        }
        var total = input1.value * 10 + input1.value * (input1.value - 1);
        var lasttotal = total-((input1.value-1)*2+10);
        eff1.textContent = ("Effect: " + Math.floor(total) + "%");
        if (input1.value > 1) {
            lasteff1.textContent = ("Last level's effect: " + Math.floor(lasttotal) + "%");
            rel1.textContent = ("Relative increase from last level: " + ((total / lasttotal - 1) * 100).toPrecision(3) + "%");
        } else {
            lasteff1.textContent = ("Last level's effect: N/A");
            rel1.textContent = ("Relative increase from last level: N/A");
        }
        return total / 100 + 1;
    }
    //////////
    function updateawakening2() {
        if (input2.value > 30) {
            input2.value = 30;
        }
        var total = input2.value * 10 + input2.value * (input2.value - 1);
        var lasttotal = total-((input2.value-1)*2+10);
        eff2.textContent = ("Effect: " + Math.floor(total) + "%");
        if (input2.value > 1) {
            lasteff2.textContent = ("Last level's effect: " + Math.floor(lasttotal) + "%");
            rel2.textContent = ("Relative increase from last level: " + ((total / lasttotal - 1) * 100).toPrecision(3) + "%");
        } else {
            lasteff2.textContent = ("Last level's effect: N/A");
            rel2.textContent = ("Relative increase from last level: N/A");
        }
        return total / 100 + 1;
    }
    //////////
    function updatemithrilsword() {
        if (input3.value > 45) {
            input3.value = 45;
        }
        var level = input3.value;
        var ghostlevel = level;
        var total = 1;
        if (ghostlevel >= 45) {
            total = 0.35;
            ghostlevel = 0;
        } else if (ghostlevel > 20) {
            total -= 0.4;
            ghostlevel -= 20;
			total -= ghostlevel * 0.01;
			ghostlevel = 0;
        } else {
			total -= ghostlevel * 0.02;
			ghostlevel = 0;
		}
        if (level <= 20) {
            var lasttotal = total + 0.02;
        } else {
            var lasttotal = total + 0.01;
        }
        var displaytotal = 100 - (total * 100).toPrecision(3);
        var displaylasttotal = 100 - (lasttotal * 100).toPrecision(3);
        var exp = (lasttotal / total * 100 - 100).toPrecision(3);
        eff3.textContent = ("Effect: -" + Math.round(displaytotal) + "%");
        if (level > 1) {
            lasteff3.textContent = ("Last level's Effect: -" + Math.round(displaylasttotal) + "%");
            rel3.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff3.textContent = ("Last level's Effect: N/A");
            rel3.textContent = ("Relative increase from last level: N/A");
        }
        return 1 / total;
    }
    //////////
    function updatemistilteinn() {
        if (input4.value > 105) {
            input4.value = 105;
        }
        var level = input4.value;
        var ghostlevel = level;
        var total = 1;
        if (ghostlevel >= 105) {
            total = 0.125;
            ghostlevel = 0;
        } else if (ghostlevel > 75) {
            total -= 0.8;
            ghostlevel -= 75;
            total -= ghostlevel * 0.0025;
            ghostlevel = 0;
        } else if (ghostlevel > 45) {
            total -= 0.65;
            ghostlevel -= 45;
            total -= ghostlevel * 0.005;
            ghostlevel = 0;
        } else if (ghostlevel > 20) {
            total -= 0.4;
            ghostlevel -= 20;
            total -= ghostlevel * 0.01;
            ghostlevel = 0;
        } else if (ghostlevel <= 20) {
            total -= ghostlevel * 0.02;
            ghostlevel = 0;
        }
        if (level > 75) {
            var lasttotal = total + 0.0025;
        } else if (level > 45) {
            var lasttotal = total + 0.005;
        } else if (level > 20) {
            var lasttotal = total + 0.01;
        } else {
            var lasttotal = total + 0.02;
        }
        var displaytotal = 100 - (Math.floor(total * 10000) / 100);
        var displaylasttotal = 100 - (Math.floor(lasttotal * 10000) / 100);
        var exp = Math.floor(lasttotal / total * 10000 - 10000) / 100;
        eff4.textContent = ("Effect: -" + (Math.floor(displaytotal * 20) / 20) + "%");
        if (level > 1) {
            lasteff4.textContent = ("Last level's Effect: -" + (Math.floor(displaylasttotal * 20) / 20) + "%");
            rel4.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff4.textContent = ("Last level's Effect: N/A");
            rel4.textContent = ("Relative increase from last level: N/A");
        }
        return 1 / total;
    }
    //////////
    function updategoldengloves() {
        var level = input5.value;
        var ghostlevel = level;
        var total = 0;
        if (ghostlevel >= 200) {
            total += 3000;
            ghostlevel -= 200;
            total += ghostlevel * 10;
			ghostlevel = 0;
        } else {
            total += ghostlevel * 15;
			ghostlevel = 0;
        }
        if (level > 200) {
            var lasttotal = total - 10;
        } else {
            var lasttotal = total - 15;
        }
        var displaytotal = Math.floor(total);
        var displaylasttotal = Math.floor(lasttotal);
        var exp = (total / lasttotal * 100 - 100).toPrecision(3);
        eff5.textContent = ("Effect: " + Math.round(displaytotal) + "%");
        if (level > 1) {
            lasteff5.textContent = ("Last level's Effect: " + Math.round(displaylasttotal) + "%");
            rel5.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff5.textContent = ("Last level's Effect: N/A");
            rel5.textContent = ("Relative increase from last level: N/A");
        }
        return total / 100 + 1;
    }
    //////////
    function updategoldvessels() {
        var level = input6.value;
        var ghostlevel = level;
        var total = 0;
        if (ghostlevel >= 100) {
            total += 1000;
            ghostlevel -= 100;
            total += ghostlevel * 5;
			ghostlevel = 0;
        } else {
            total += ghostlevel * 10;
			ghostlevel = 0;
        }
        if (level > 100) {
            var lasttotal = total - 5;
        } else {
            var lasttotal = total - 10;
        }
        var displaytotal = Math.floor(total);
        var displaylasttotal = Math.floor(lasttotal);
        var exp = (total / lasttotal * 100 - 100).toPrecision(3);
        eff6.textContent = ("Effect: " + Math.round(displaytotal) + "%");
        if (level > 1) {
            lasteff6.textContent = ("Last level's Effect: " + Math.round(displaylasttotal) + "%");
            rel6.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff6.textContent = ("Last level's Effect: N/A");
            rel6.textContent = ("Relative increase from last level: N/A");
        }
        return total / 100 + 1;
    }
    //////////
    function updatephilostone() {
        var level = input7.value;
        var ghostlevel = level;
        var total = 0;
        if (ghostlevel >= 500) {
            total += 5000;
            ghostlevel -= 500;
            total += ghostlevel * 2;
			ghostlevel = 0;
        } else {
            total += ghostlevel * 10;
			ghostlevel = 0;
        }
        if (level > 500) {
            var lasttotal = total - 2;
        } else {
            var lasttotal = total - 10;
        }
        var displaytotal = Math.floor(total);
        var displaylasttotal = Math.floor(lasttotal);
        var exp = (total / lasttotal * 100 - 100).toPrecision(3);
        eff7.textContent = ("Effect: " + Math.round(displaytotal) + "%");
        if (level > 1) {
            lasteff7.textContent = ("Last level's Effect: " + Math.round(displaylasttotal) + "%");
            rel7.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff7.textContent = ("Last level's Effect: N/A");
            rel7.textContent = ("Relative increase from last level: N/A");
        }
        return total / 100 + 1;
    }
    //////////
    function updatehalberd() {
        var level = input8.value;
        var ghostlevel = level;
        var total = 0;
        if (ghostlevel >= 100) {
            total += 1000;
            ghostlevel -= 100;
            total += ghostlevel * 5;
			ghostlevel = 0;
        } else {
            total += ghostlevel * 10;
			ghostlevel = 0;
        }
        if (level > 100) {
            var lasttotal = total - 5;
        } else {
            var lasttotal = total - 10;
        }
        var displaytotal = Math.floor(total);
        var displaylasttotal = Math.floor(lasttotal);
        var exp = (total / lasttotal * 100 - 100).toPrecision(3);
        eff8.textContent = ("Effect: " + Math.round(displaytotal) + "%");
        if (level > 1) {
            lasteff8.textContent = ("Last level's Effect: " + Math.round(displaylasttotal) + "%");
            rel8.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff8.textContent = ("Last level's Effect: N/A");
            rel8.textContent = ("Relative increase from last level: N/A");
        }
        return total / 100 + 1;
    }
    //////////
    function updatecaduceus() {
        if (input9.value > 600) {
            input9.value = 600;
        }
        var level = input9.value;
        var ghostlevel = level;
        var total = 0;
        if (ghostlevel == 600) {
            total = 28;
            ghostlevel = 0;
        } else if (ghostlevel > 200) {
            total += 20;
            ghostlevel -= 200;
            total += ghostlevel * 0.02;
			ghostlevel = 0;
        } else {
            total += ghostlevel * 0.1;
			ghostlevel = 0;
		}
        if (level > 200) {
            var lasttotal = total - 0.02;
        } else {
            var lasttotal = total - 0.1;
        }
        var displaytotal = Math.round(total * 100);
        var displaylasttotal = Math.round(lasttotal * 100);
        var exp = (total / lasttotal * 100 - 100).toPrecision(3);
        eff9.textContent = ("Effect: " + Math.round(displaytotal) + "%");
        if (level > 1) {
            lasteff9.textContent = ("Last level's Effect: " + Math.round(displaylasttotal) + "%");
            rel9.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff9.textContent = ("Last level's Effect: N/A");
            rel9.textContent = ("Relative increase from last level: N/A");
        }
        return total + 1;
    }
    //////////
    function updatecoatofgold() {
        if (input10.value > 300) {
            input10.value = 300;
        }
        var level = input10.value;
        var ghostlevel = level;
        var total = 0;
        if (ghostlevel == 300) {
            total = 9;
            ghostlevel = 0;
        } else if (ghostlevel > 100) {
            total += 5;
            ghostlevel -= 100;
            total += ghostlevel * 0.02;
			ghostlevel = 0;
        } else
            total += ghostlevel * 0.05;
			ghostlevel = 0;
        if (level > 100) {
            var lasttotal = total - 0.02;
        } else {
            var lasttotal = total - 0.05;
        }
        var displaytotal = Math.round(total * 100);
        var displaylasttotal = Math.round(lasttotal * 100);
        var exp = (total / lasttotal * 100 - 100).toPrecision(3);
        eff10.textContent = ("Effect: " + Math.round(displaytotal) + "%");
        if (level > 1) {
            lasteff10.textContent = ("Last level's Effect: " + Math.round(displaylasttotal) + "%");
            rel10.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff10.textContent = ("Last level's Effect: N/A");
            rel10.textContent = ("Relative increase from last level: N/A");
        }
        return total + 1;
    }
    //////////
	function updatePower() {
		var baseattack = baseattackinput.value / 100 + 1;
        var awakening1power = updateawakening1();
        var awakening2power = updateawakening2();
        var mithrilswordpower = updatemithrilsword();
        var mistilteinnpower = updatemistilteinn();
        var goldvesselspower = updategoldvessels();
        var halberdpower = updatehalberd();
        var philostonepower = updatephilostone();
        var goldenglovespower = updategoldengloves();
        var caduceuspower = updatecaduceus();
        var coatofgoldpower = updatecoatofgold();
        var totalpower = baseattack * awakening1power * awakening2power * mithrilswordpower * mistilteinnpower * goldvesselspower * halberdpower * philostonepower * goldenglovespower * caduceuspower * coatofgoldpower;
        totalpowerdisplay.textContent = ("Total Power: " + totalpower.toPrecision(3));
	}
    function updateFloor() {
		if (!powerinput.value == "") {
            var log = 1 + (1.585 + topfloorinput.value * 0.001117) / 100
            var lowestimate = Math.round(Math.log(powerinput.value) / Math.log(log) * 0.98 / 5) * 5;
            var highestimate = Math.round(Math.log(powerinput.value) / Math.log(log) * 1.02 / 5) * 5;
            floorestimateoutput.textContent = lowestimate + " - " + highestimate;
        }
	}
	function updateGoldBox() {
		if (!goldboxinput.value == "") {
            var level = goldboxinput.value;
            var tiergoal = 10
            var tier = 1;
            var five = true;
            while (level >= tiergoal) {
                if (five) {
                    tier += 1;
                    tiergoal *= 5;
                    five = false;
                } else {
                    tier += 1;
                    tiergoal *= 2;
                    five = true;
                }
            }
            var result = Math.pow(4, tier - 1) * Math.pow(level, 2) + Math.pow(4, tier) * level;
            if (result > 1e250) {
                var exponent = exponents[82];
            } else {
                var exponent = exponents[Math.floor((Math.floor(Math.log(result) / Math.log(10))) / 3) - 1];
            };
            var resultnoexpo = (result / Math.pow(10, ((exponents.indexOf(exponent) + 1) * 3))).toFixed(3);
            var decimalposition = resultnoexpo.toString().indexOf(".");
            if (result >= 1e3) {
                var finalresult = "";
                for (var i = 0; i < resultnoexpo.toString().length; i++) {
                    if (i == decimalposition) {
                        finalresult = finalresult + exponent;
                    } else {
                        finalresult = finalresult + resultnoexpo[i];
                    }
                }
                if (result >= 1e6) {
                    finalresult = finalresult + exponents[exponents.indexOf(exponent) - 1];
                }
            } else {
                var finalresult = result;
            }
            goldboxoutput.textContent = finalresult + " gold on new dungeon";
        }
	}
	function parseAttack() {
		var input=expin.value;
		if (!input == "") {
			for(var i=exponents.length; i>0; i-=1) {
				if(!input.indexOf(exponents[i-1])==-1) {
					console.log(exponents[i-1]);
				}
			}
		}
	}
	setInterval(function() {
        parseAttack();
		updatePower();
        updateFloor();
		updateGoldBox();
    }, 200);
});