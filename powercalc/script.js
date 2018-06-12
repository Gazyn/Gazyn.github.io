document.addEventListener("DOMContentLoaded", function(event) {
    //////////
    var exponents = ["K", "M", "B", "T", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "aa", "ab", "ac", "ad", "ae", "af", "ag", "ah", "ai", "aj", "ak", "al", "am", "an", "ao", "ap", "aq", "ar", "as", "at", "au", "av", "aw", "ax", "ay", "az", "ba", "bb", "bc", "bd", "be", "bf", "bg", "bh", "bi", "bj", "bk", "bl", "bm", "bn", "bo", "bp", "bq", "br", "bs", "bt", "bu", "bv", "bw", "bx", "by", "bz"];
	var claymore = {
		tier1: {
			bonus: 2.5,
			base: 0,
		},
		tier2: {
			bonus: 2.2,
			base: 3000,
		},
		tier3: {
			bonus: 1.804,
			base: 11460,
		},
		tier4: {
			bonus: 1.37104,
			base: 32709.6,
		},
		tier5: {
			bonus: 0.959728,
			base: 172896.72,
		},
		tier6: {
			bonus: 0.5758368,
			base: 503738.032,
		},
		tier7: {
			bonus: 0.34550208,
			base: 4302242.8192,
		},
		tier8: {
			bonus: 0.207301248,
			base: 42581345.6915,
		}
	}
	var flamberge = {
		tier1: {
			bonus: 5,
			base: 0
		},
		tier2: {
			bonus: 4.4,
			base: 3000,
		},
		tier3: {
			bonus: 3.63,
			base: 10725,
		},
		tier4: {
			bonus: 2.7951,
			base: 31258.25,
		},
		tier5: {
			bonus: 1.9984965,
			base: 159849.64875,
		},
		tier6: {
			bonus: 1.259052795,
			base: 470705.278713,
		},
		tier7: {
			bonus: 0.8057937888,
			base: 3901251.62838,
		},
		tier8: {
			bonus: 0.52376596272,
			base: 37535813.5584,
		}
	}
	var tomahawk = {
		tier1: {
            bonus: 5.5,
            base: 0,
        },
		tier2: {
			bonus: 4.84,
			base: 3000,
		},
		tier3: {
			bonus: 3.993,
			base: 10725,
		},
		tier4: {
			bonus: 3.07461,
			base: 31258.25,
		},
		tier5: {
			bonus: 2.19834615,
			base: 159849.64875,
		},
		tier6: {
			bonus: 1.3849580745,
			base: 470705.278713,
		},
		tier7: {
			bonus: 0.88637316768,
			base: 3901251.62838,
		},
		tier8: {
			bonus: 0.576142558992,
			base: 37535813.5584,
		}
    };
	var ingamenumbers = false;
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
		if(ingamenumbers==true) {
			eff5.textContent = ("Effect: " + formatNumber(Math.round(displaytotal)) + "%");
		} else {
			eff5.textContent = ("Effect: " + Math.round(displaytotal) + "%");
        }
		if (level > 1) {
			if(ingamenumbers==true) {
				lasteff5.textContent = ("Last level's Effect: " + formatNumber(Math.round(displaylasttotal)) + "%");
			} else {
				lasteff5.textContent = ("Last level's Effect: " + Math.round(displaylasttotal) + "%");
			}
			rel5.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff5.textContent = ("Last level's Effect: N/A");
            rel5.textContent = ("Relative increase from last level: N/A");
        }
        return total / 100 + 1;
    }
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
		if(ingamenumbers==true) {
			eff6.textContent = ("Effect: " + formatNumber(Math.round(displaytotal)) + "%");
		} else {
			eff6.textContent = ("Effect: " + Math.round(displaytotal) + "%");
		}
        if (level > 1) {
			if(ingamenumbers==true) {
				lasteff6.textContent = ("Last level's Effect: " + formatNumber(Math.round(displaylasttotal)) + "%");
			} else {
				lasteff6.textContent = ("Last level's Effect: " + Math.round(displaylasttotal) + "%");
            }
			rel6.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff6.textContent = ("Last level's Effect: N/A");
            rel6.textContent = ("Relative increase from last level: N/A");
        }
        return total / 100 + 1;
    }
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
		if(ingamenumbers==true) {
			eff7.textContent = ("Effect: " + formatNumber(Math.round(displaytotal)) + "%");
		} else {
			eff7.textContent = ("Effect: " + Math.round(displaytotal) + "%");
        }
		if (level > 1) {
			if(ingamenumbers==true) {
				lasteff7.textContent = ("Last level's Effect: " + formatNumber(Math.round(displaylasttotal)) + "%");
			} else {
				lasteff7.textContent = ("Last level's Effect: " + Math.round(displaylasttotal) + "%");
            }
			rel7.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff7.textContent = ("Last level's Effect: N/A");
            rel7.textContent = ("Relative increase from last level: N/A");
        }
        return total / 100 + 1;
    }
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
		if(ingamenumbers==true) {
			eff8.textContent = ("Effect: " + formatNumber(Math.round(displaytotal)) + "%");
		} else {
			eff8.textContent = ("Effect: " + Math.round(displaytotal) + "%");
        }
		if (level > 1) {
			if(ingamenumbers==true) {
				lasteff8.textContent = ("Last level's Effect: " + formatNumber(Math.round(displaylasttotal)) + "%");
			} else {
				lasteff8.textContent = ("Last level's Effect: " + Math.round(displaylasttotal) + "%");
			}
            
            rel8.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff8.textContent = ("Last level's Effect: N/A");
            rel8.textContent = ("Relative increase from last level: N/A");
        }
        return total / 100 + 1;
    }
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
	function formatNumber(input) {
		input = parseInt(input);
		var exponent = exponents[Math.floor((Math.floor(Math.log(input) / Math.log(10))) / 3) - 1];
        var noexpo = (input / Math.pow(10, ((exponents.indexOf(exponent) + 1) * 3))).toFixed(3);
        var decimalposition = noexpo.toString().indexOf(".");
        if (input >= 1e3) {
            var finalresult = "";
            for (var i = 0; i < noexpo.toString().length; i++) {
                if (i == decimalposition) {
                   finalresult = finalresult + exponent;
                } else {
                    finalresult = finalresult + noexpo[i];
                }
            }
            if (input >= 1e6) {
                finalresult = finalresult + exponents[exponents.indexOf(exponent) - 1];
            }
        } else {
            var finalresult = input;
        }
		return finalresult;
	}
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
			//Ok I have NO idea why the below always acts as if it is checked. I'll deal with it later, the checkbox was added mainly for attack per run anyways
			if(ingamenumbers==true && numberscheck.checked==true) {
				goldboxoutput.textContent = formatNumber(result) + " gold on new dungeon";
			} else {
				goldboxoutput.textContent = result + " gold on new dungeon";
			}
		}
	}
	function calcAttack(type, level) {
		level = parseInt(level);
		if(type==1) {
			if(level==1) {
				return 30;
			}
			if(level==2) {
				return 65;
			}
			if(level==3) {
				return 100;
			}
			if(level==4) {
				return 140;
			}
			if(level==5) {
				return 185;
			}
			if(level==6) {
				return 230;
			}
			if(level==7) {
				return 280;
			}
			if(level==8) {
				return 330;
			}
			if(level==9) {
				return 385;
			}
			if(level==10) {
				return 460;
			}
			if(level==11) {
				return 535;
			}
			if(level==12) {
				return 610;
			}
			if(level==13) {
				return 690;
			}
			if(level==14) {
				return 770;
			}
			if(level==15) {
				return 850;
			}
			if(level==16) {
				return 935;
			}
			if(level==17) {
				return 1030;
			}
			if(level==18) {
				return 1130;
			}
			if(level>=19 && level<=96) {
				var tier = "tier1";
			}
			if(level>=97 && level<=142) {
				var tier = "tier2";
			}
			if(level>=143 && level<=218) {
				var tier = "tier3";
			}
			if(level>=219 && level<=580) {
				var tier = "tier4";
			}
			if(level>=581 && level<=924) {
				var tier = "tier5";
			}
			if(level>=925 && level<=4057) {
				var tier = "tier6";
			}
			if(level>=4058 && level<=16639) {
				var tier = "tier7";
			}
			if(level>=16640) {
				var tier = "tier8";
			}
			return Math.round(Math.round(claymore[tier].bonus*level*(7+level)+claymore[tier].base)/5)*5;
		}
		if(type==2) {
			if(level<=47) {
				var tier = "tier1";
			}
			if(level>=48 && level<=77) {
				var tier = "tier2";
			}
			if(level>=78 && level<=130) {
				var tier = "tier3";
			}
			if(level>=131 && level<=381) {
				var tier = "tier4";
			}
			if(level>=382 && level<=619) {
				var tier = "tier5";
			}
			if(level>=620 && level<=2721) {
				var tier = "tier6";
			}
			if(level>=2722 && level<=10891) {
				var tier = "tier7";
			}
			if(level>=10892) {
				var tier = "tier8";
			}
			return Math.round(Math.round(flamberge[tier].bonus*level*(59+level)+flamberge[tier].base)/5)*5;
		}
		if(type==3) {
			if(level<=13) {
				var tier = "tier1";
			}
			if(level>=14 && level<=27) {
				var tier = "tier2";
			}
			if(level>=28 && level<=58) {
				var tier = "tier3";
			}
			if(level>=59 && level<=260) {
				var tier = "tier4";
			}
			if(level>=261 && level<=476) {
				var tier = "tier5";
			}
			if(level>=477 && level<=2465) {
				var tier = "tier6";
			}
			if(level>=2466 && level<=10250) {
				var tier = "tier7";
			}
			if(level>=10251) {
				var tier = "tier8";
			}
			return Math.round(Math.round(tomahawk[tier].bonus*level*(326.27272728+level)+tomahawk[tier].base)/5)*5;
		}
	}
	function updateAttacks() {
		if(ingamenumbers==true) {
			if(!claymoreInput.value=="") {
			claymoreeff.textContent = "Effect: "+formatNumber(calcAttack(1, claymoreInput.value))+"%";
			if(claymoreInput.value>1) {
				claymorerel.textContent = "Relative increase from last level: "+(calcAttack(1, claymoreInput.value)/calcAttack(1, claymoreInput.value-1)*100-100).toPrecision(3)+"%";
				claymoreinc.textContent = "Last level's effect: "+formatNumber(calcAttack(1, claymoreInput.value-1))+"%";
			} else {
				claymorerel.textContent = "Relative increase from last level: N/A"
				claymoreinc.textContent = "Last level's effect: N/A";
			}
			}
			if(!flambergeInput.value=="") {
			flambergeeff.textContent = "Effect: "+formatNumber(calcAttack(2, flambergeInput.value))+"%";
			if(flambergeInput.value>1) {
				flambergerel.textContent = "Relative increase from last level: "+(calcAttack(2, flambergeInput.value)/calcAttack(2, flambergeInput.value-1)*100-100).toPrecision(3)+"%";
				flambergeinc.textContent = "Last level's effect: "+formatNumber(calcAttack(2, flambergeInput.value-1))+"%";
			} else {
				tomahawkrel.textContent = "Relative increase from last level: N/A"
				tomahawkinc.textContent = "Last level's effect: N/A";
			}
			}
			if(!tomahawkInput.value=="") {
			tomahawkeff.textContent = "Effect: "+formatNumber(calcAttack(3, tomahawkInput.value))+"%";
			if(tomahawkInput.value>1) {
				tomahawkrel.textContent = "Relative increase from last level: "+(calcAttack(3, tomahawkInput.value)/calcAttack(3, tomahawkInput.value-1)*100-100).toPrecision(3)+"%";
				tomahawkinc.textContent = "Last level's effect: "+formatNumber(calcAttack(3, tomahawkInput.value-1))+"%";
			} else {
				tomahawkrel.textContent = "Relative increase from last level: N/A"
				tomahawkinc.textContent = "Last level's effect: N/A";
			}
			}
		} else {
			if(!claymoreInput=="") {
			claymoreeff.textContent = "Effect: "+calcAttack(1, claymoreInput.value)+"%";
			if(claymoreInput.value>1) {
				claymorerel.textContent = "Relative increase from last level: "+(calcAttack(1, claymoreInput.value)/calcAttack(1, claymoreInput.value-1)*100-100).toPrecision(3)+"%";
				claymoreinc.textContent = "Last level's effect: "+calcAttack(1, claymoreInput.value-1)+"%";
			} else {
				claymorerel.textContent = "Relative increase from last level: N/A"
				claymoreinc.textContent = "Last level's effect: N/A";
			}
			}
			if(!flambergeInput=="") {
			flambergeeff.textContent = "Effect: "+calcAttack(2, flambergeInput.value)+"%";
			if(flambergeInput.value>1) {
				flambergerel.textContent = "Relative increase from last level: "+(calcAttack(2, flambergeInput.value)/calcAttack(2, flambergeInput.value-1)*100-100).toPrecision(3)+"%";
				flambergeinc.textContent = "Last level's effect: "+calcAttack(2, flambergeInput.value-1)+"%";
			} else {
				flambergerel.textContent = "Relative increase from last level: N/A"
				flambergeinc.textContent = "Last level's effect: N/A";
			}
			}
			if(!tomahawkInput=="") {
			tomahawkeff.textContent = "Effect: "+calcAttack(3, tomahawkInput.value)+"%";
			if(tomahawkInput.value>1) {
				tomahawkrel.textContent = "Relative increase from last level: "+(calcAttack(3, tomahawkInput.value)/calcAttack(3, tomahawkInput.value-1)*100-100).toPrecision(3)+"%";
				tomahawkinc.textContent = "Last level's effect: "+calcAttack(3, tomahawkInput.value-1)+"%";
			} else {
				tomahawkrel.textContent = "Relative increase from last level: N/A"
				tomahawkinc.textContent = "Last level's effect: N/A";
			}
			}
		}
	}
	function updateRunAttack() {
		var claymoreNewLevel = parseInt(claymoreInput.value)+parseInt(claymoreGainInput.value);
		var claymoreGain = calcAttack(1, claymoreNewLevel)-calcAttack(1, claymoreInput.value);
		var flambergeNewLevel = parseInt(flambergeInput.value)+parseInt(flambergeGainInput.value);
		var flambergeGain = calcAttack(2, flambergeNewLevel)-calcAttack(2, flambergeInput.value);
		var tomahawkNewLevel = parseInt(tomahawkInput.value)+parseInt(tomahawkGainInput.value);
		var tomahawkGain = calcAttack(3, tomahawkNewLevel)-calcAttack(3, tomahawkInput.value);
		if(ingamenumbers==true) {
			claymoreAfter.textContent = formatNumber(claymoreGain) + "%";
			flambergeAfter.textContent = formatNumber(flambergeGain) + "%";
			tomahawkAfter.textContent = formatNumber(tomahawkGain) + "%";
			totalAttackPerRun.textContent = formatNumber(claymoreGain+flambergeGain+tomahawkGain)+"%";
		} else {
			claymoreAfter.textContent = claymoreGain + "%";
			flambergeAfter.textContent = flambergeGain + "%";
			tomahawkAfter.textContent = tomahawkGain + "%";
			totalAttackPerRun.textContent = claymoreGain+flambergeGain+tomahawkGain+"%";
		}
	}
	setInterval(function() {
		if(numberscheck.checked==true) {
			ingamenumbers=true;
		} else {
			ingamenumbers=false;
		}
		updatePower();
        updateFloor();
		updateGoldBox();
		updateAttacks();
		updateRunAttack();
    }, 200);
});