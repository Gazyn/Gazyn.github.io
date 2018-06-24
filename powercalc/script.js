"use strict";
var exponents = ["K", "M", "B", "T", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
for(var i = 0; i<26; i++) {
	var letter = exponents[i+4];
	for(var x = 0; x<26; x++) {
		exponents.push(letter + exponents[x+4]);
	}
}
var claymore = {
	tier1: {
		bonus: 2.5,
		base: 0
	},
	tier2: {
		bonus: 2.2,
		base: 3000
	},
	tier3: {
		bonus: 1.804,
		base: 11460
	},
	tier4: {
		bonus: 1.37104,
		base: 32709.6
	},
	tier5: {
		bonus: 0.959728,
		base: 172896.72
	},
	tier6: {
		bonus: 0.5758368,
		base: 503738.032
	},
	tier7: {
		bonus: 0.34550208,
		base: 4302242.8192
	},
	tier8: {
		bonus: 0.207301248,
		base: 42581345.6915
	}
};
var flamberge = {
	tier1: {
		bonus: 5,
		base: 0
	},
	tier2: {
		bonus: 4.4,
		base: 3000
	},
	tier3: {
		bonus: 3.63,
		base: 10725
	},
	tier4: {
		bonus: 2.7951,
		base: 31258.25
	},
	tier5: {
		bonus: 1.9984965,
		base: 159849.64875
	},
	tier6: {
		bonus: 1.259052795,
		base: 470705.278713
	},
	tier7: {
		bonus: 0.8057937888,
		base: 3901251.62838
	},
	tier8: {
		bonus: 0.52376596272,
		base: 37535813.5584
	}
};
var tomahawk = {
	tier1: {
		bonus: 5.5,
		base: 0
	},
	tier2: {
		bonus: 4.84,
		base: 3000
	},
	tier3: {
		bonus: 3.993,
		base: 10725
	},
	tier4: {
		bonus: 3.07461,
		base: 31258.25
	},
	tier5: {
		bonus: 2.19834615,
		base: 159849.64875
	},
	tier6: {
		bonus: 1.3849580745,
		base: 470705.278713
	},
	tier7: {
		bonus: 0.88637316768,
		base: 3901251.62838
	},
	tier8: {
		bonus: 0.576142558992,
		base: 37535813.5584
	}
};
var inGameNumbers = false;
//Most browsers save checkboxes and input boxes when a site is cached. See if this is the case.
numbersCheck.checked ? inGameNumbers = true : inGameNumbers = false;
function switchTab(selected) {
	tab1.style.visibility = "hidden";
	tab2.style.visibility = "hidden";
	tab3.style.visibility = "hidden";
	tab4.style.visibility = "hidden";
	tab5.style.visibility = "hidden";
	switch(selected) {
		case 1:
			tab1.style.visibility = "visible";
			break;
		case 2:
			tab2.style.visibility = "visible";
			break;
		case 3:
			tab3.style.visibility = "visible";
			break;
		case 4:
			tab4.style.visibility = "visible";
			break;
		case 5:
			tab5.style.visibility = "visible";
			break;
	}
}

function updateAwakening1() {
	if(input1.value > 70) {
		input1.value = 70;
	}
	var total = input1.value * 10 + input1.value * (input1.value - 1);
	var lastTotal = total - ((input1.value - 1) * 2 + 10);
	eff1.textContent = ("Effect: " + Math.floor(total) + "%");
	if(input1.value > 1) {
		lasteff1.textContent = ("Last level's effect: " + Math.floor(lastTotal) + "%");
		rel1.textContent = ("Relative increase from last level: " + ((total / lastTotal - 1) * 100).toPrecision(3) + "%");
	} else {
		lasteff1.textContent = ("Last level's effect: N/A");
		rel1.textContent = ("Relative increase from last level: N/A");
	}
	return total / 100 + 1;
}

function updateAwakening2() {
	if(input2.value > 30) {
		input2.value = 30;
	}
	var total = input2.value * 10 + input2.value * (input2.value - 1);
	var lastTotal = total - ((input2.value - 1) * 2 + 10);
	eff2.textContent = ("Effect: " + Math.floor(total) + "%");
	if(input2.value > 1) {
		lasteff2.textContent = ("Last level's effect: " + Math.floor(lastTotal) + "%");
		rel2.textContent = ("Relative increase from last level: " + ((total / lastTotal - 1) * 100).toPrecision(3) + "%");
	} else {
		lasteff2.textContent = ("Last level's effect: N/A");
		rel2.textContent = ("Relative increase from last level: N/A");
	}
	return total / 100 + 1;
}

function updateMithrilSword() {
	if(input3.value > 45) {
		input3.value = 45;
	}
	var level = input3.value;
	var ghostLevel = level;
	var total = 1;
	if(ghostLevel >= 45) {
		total = 0.35;
	} else if(ghostLevel > 20) {
		total -= 0.4;
		ghostLevel -= 20;
		total -= ghostLevel * 0.01;
	} else {
		total -= ghostLevel * 0.02;
	}
	var lastTotal;
	lastTotal = level <= 20 ? total + 0.02 : total + 0.01;
	var displayTotal = 100 - (total * 100).toPrecision(3);
	var displayLastTotal = 100 - (lastTotal * 100).toPrecision(3);
	var exp = (lastTotal / total * 100 - 100).toPrecision(3);
	eff3.textContent = ("Effect: -" + Math.round(displayTotal) + "%");
	if(level > 1) {
		lasteff3.textContent = ("Last level's Effect: -" + Math.round(displayLastTotal) + "%");
		rel3.textContent = ("Relative increase from last level: " + exp + "%");
	} else {
		lasteff3.textContent = ("Last level's Effect: N/A");
		rel3.textContent = ("Relative increase from last level: N/A");
	}
	return 1 / total;
}

function updateMistilteinn() {
	if(input4.value > 105) {
		input4.value = 105;
	}
	var level = input4.value;
	var ghostLevel = level;
	var total = 1;
	if(ghostLevel >= 105) {
		total = 0.125;
	} else if(ghostLevel > 75) {
		total -= 0.8;
		ghostLevel -= 75;
		total -= ghostLevel * 0.0025;
	} else if(ghostLevel > 45) {
		total -= 0.65;
		ghostLevel -= 45;
		total -= ghostLevel * 0.005;
	} else if(ghostLevel > 20) {
		total -= 0.4;
		ghostLevel -= 20;
		total -= ghostLevel * 0.01;
	} else if(ghostLevel <= 20) {
		total -= ghostLevel * 0.02;
	}
	var lastTotal;
	if(level > 75) {
		lastTotal = total + 0.0025;
	} else if(level > 45) {
		lastTotal = total + 0.005;
	} else if(level > 20) {
		lastTotal = total + 0.01;
	} else {
		lastTotal = total + 0.02;
	}
	var displayTotal = 100 - (Math.floor(total * 10000) / 100);
	var displayLastTotal = 100 - (Math.floor(lastTotal * 10000) / 100);
	var exp = Math.floor(lastTotal / total * 10000 - 10000) / 100;
	eff4.textContent = ("Effect: -" + (Math.floor(displayTotal * 20) / 20) + "%");
	if(level > 1) {
		lasteff4.textContent = ("Last level's Effect: -" + (Math.floor(displayLastTotal * 20) / 20) + "%");
		rel4.textContent = ("Relative increase from last level: " + exp + "%");
	} else {
		lasteff4.textContent = ("Last level's Effect: N/A");
		rel4.textContent = ("Relative increase from last level: N/A");
	}
	return 1 / total;
}

function updateGoldenGloves() {
	var level = input5.value;
	var ghostLevel = level;
	var total = 0;
	if(ghostLevel >= 200) {
		total += 3000;
		ghostLevel -= 200;
		total += ghostLevel * 10;
	} else {
		total += ghostLevel * 15;
	}
	var lastTotal;
	lastTotal = level > 200 ? total - 10 : total - 15;
	var displayTotal = Math.floor(total);
	var displayLastTotal = Math.floor(lastTotal);
	var exp = (total / lastTotal * 100 - 100).toPrecision(3);
	eff5.textContent = inGameNumbers == true ? ("Effect: " + formatNumber(Math.round(displayTotal)) + "%") : ("Effect: " + Math.round(displayTotal) + "%");
	if(level > 1) {
		if(inGameNumbers == true) {
			lasteff5.textContent = ("Last level's Effect: " + formatNumber(Math.round(displayLastTotal)) + "%");
		} else {
			lasteff5.textContent = ("Last level's Effect: " + Math.round(displayLastTotal) + "%");
		}
		rel5.textContent = ("Relative increase from last level: " + exp + "%");
	} else {
		lasteff5.textContent = ("Last level's Effect: N/A");
		rel5.textContent = ("Relative increase from last level: N/A");
	}
	return total / 100 + 1;
}

function updateGoldVessels() {
	var level = input6.value;
	var ghostLevel = level;
	var total = 0;
	if(ghostLevel >= 100) {
		total += 1000;
		ghostLevel -= 100;
		total += ghostLevel * 5;
	} else {
		total += ghostLevel * 10;
	}
	var lastTotal;
	lastTotal = level > 100 ? total - 5 : total - 10;
	var displayTotal = Math.floor(total);
	var displayLastTotal = Math.floor(lastTotal);
	var exp = (total / lastTotal * 100 - 100).toPrecision(3);
	if(inGameNumbers == true) {
		eff6.textContent = ("Effect: " + formatNumber(Math.round(displayTotal)) + "%");
	} else {
		eff6.textContent = ("Effect: " + Math.round(displayTotal) + "%");
	}
	if(level > 1) {
		lasteff6.textContent = inGameNumbers == true ? ("Last level's Effect: " + formatNumber(Math.round(displayLastTotal)) + "%") : ("Last level's Effect: " + Math.round(displayLastTotal) + "%");
		rel6.textContent = ("Relative increase from last level: " + exp + "%");
	} else {
		lasteff6.textContent = ("Last level's Effect: N/A");
		rel6.textContent = ("Relative increase from last level: N/A");
	}
	return total / 100 + 1;
}

function updatePhilosophersStone() {
	var level = input7.value;
	var ghostLevel = level;
	var total = 0;
	if(ghostLevel >= 500) {
		total += 5000;
		ghostLevel -= 500;
		total += ghostLevel * 2;
	} else {
		total += ghostLevel * 10;
	}
	var lastTotal = level > 500 ? total - 2 : total - 10;
	var displayTotal = Math.floor(total);
	var displayLastTotal = Math.floor(lastTotal);
	var exp = (total / lastTotal * 100 - 100).toPrecision(3);
	eff7.textContent = inGameNumbers == true ? ("Effect: " + formatNumber(Math.round(displayTotal)) + "%") : ("Effect: " + Math.round(displayTotal) + "%");
	if(level > 1) {
		if(inGameNumbers == true) {
			lasteff7.textContent = ("Last level's Effect: " + formatNumber(Math.round(displayLastTotal)) + "%");
		} else {
			lasteff7.textContent = ("Last level's Effect: " + Math.round(displayLastTotal) + "%");
		}
		rel7.textContent = ("Relative increase from last level: " + exp + "%");
	} else {
		lasteff7.textContent = ("Last level's Effect: N/A");
		rel7.textContent = ("Relative increase from last level: N/A");
	}
	return total / 100 + 1;
}

function updateHalberd() {
	var level = input8.value;
	var ghostLevel = level;
	var total = 0;
	if(ghostLevel >= 100) {
		total += 1000;
		ghostLevel -= 100;
		total += ghostLevel * 5;
	} else {
		total += ghostLevel * 10;
	}
	var lastTotal = level > 100 ? total - 5 : total - 10;
	var displayTotal = Math.floor(total);
	var displayLastTotal = Math.floor(lastTotal);
	var exp = (total / lastTotal * 100 - 100).toPrecision(3);
	if(inGameNumbers == true) {
		eff8.textContent = ("Effect: " + formatNumber(Math.round(displayTotal)) + "%");
	} else {
		eff8.textContent = ("Effect: " + Math.round(displayTotal) + "%");
	}
	if(level > 1) {
		if(inGameNumbers == true) {
			lasteff8.textContent = ("Last level's Effect: " + formatNumber(Math.round(displayLastTotal)) + "%");
		} else {
			lasteff8.textContent = ("Last level's Effect: " + Math.round(displayLastTotal) + "%");
		}
		rel8.textContent = ("Relative increase from last level: " + exp + "%");
	} else {
		lasteff8.textContent = ("Last level's Effect: N/A");
		rel8.textContent = ("Relative increase from last level: N/A");
	}
	return total / 100 + 1;
}

function updateCaduceus() {
	if(input9.value > 600) {
		input9.value = 600;
	}
	var level = input9.value;
	var ghostLevel = level;
	var total = 0;
	if(ghostLevel == 600) {
		total = 28;
	} else if(ghostLevel > 200) {
		total += 20;
		ghostLevel -= 200;
		total += ghostLevel * 0.02;
	} else {
		total += ghostLevel * 0.1;
	}
	var lastTotal = level > 200 ? total - 0.02 : total - 0.1;
	var displayTotal = Math.round(total * 100);
	var displayLastTotal = Math.round(lastTotal * 100);
	var exp = (total / lastTotal * 100 - 100).toPrecision(3);
	eff9.textContent = ("Effect: " + Math.round(displayTotal) + "%");
	if(level > 1) {
		lasteff9.textContent = ("Last level's Effect: " + Math.round(displayLastTotal) + "%");
		rel9.textContent = ("Relative increase from last level: " + exp + "%");
	} else {
		lasteff9.textContent = ("Last level's Effect: N/A");
		rel9.textContent = ("Relative increase from last level: N/A");
	}
	return total + 1;
}

function updateCoatOfGold() {
	if(input10.value > 300) {
		input10.value = 300;
	}
	var level = input10.value;
	var ghostLevel = level;
	var total = 0;
	if(ghostLevel == 300) {
		total = 9;
	} else if(ghostLevel > 100) {
		total += 5;
		ghostLevel -= 100;
		total += ghostLevel * 0.02;
	} else
		total += ghostLevel * 0.05;
	var lastTotal = level > 100 ? total - 0.02 : total - 0.05;
	var displayTotal = Math.round(total * 100);
	var displayLastTotal = Math.round(lastTotal * 100);
	var exp = (total / lastTotal * 100 - 100).toPrecision(3);
	eff10.textContent = ("Effect: " + Math.round(displayTotal) + "%");
	if(level > 1) {
		lasteff10.textContent = ("Last level's Effect: " + Math.round(displayLastTotal) + "%");
		rel10.textContent = ("Relative increase from last level: " + exp + "%");
	} else {
		lasteff10.textContent = ("Last level's Effect: N/A");
		rel10.textContent = ("Relative increase from last level: N/A");
	}
	return total + 1;
}

function formatNumber(input) {
	input = parseInt(input);
	if(input >= 1e3) {
		//Floor of log1000 input to get closest(lowest) factor of 1000. 1e6=2, 1e11=3, 1.78399e14=4 etc. Then subtract by 1 because arrays start at 0. variable "Exponent" is now the letter at that position on the exponents array.
		var exponent = exponents[Math.floor(Math.log(input) / Math.log(1000)) - 1];
		//1.78399e12 = 1.783, 1.78399e14 = 178.399
		var noExpo = (input / Math.pow(1000, (exponents.indexOf(exponent) + 1))).toFixed(3);
		//Replace decimal spot with exponent. 1.78399e14 gets turned into 178.399 by noExpo, then the e14 is turned into exponents[3]="T", so 178T399
		var finalResult = noExpo.toString().replace(".", exponent);
		//If it's above 1M, add the the previous exponent to the end.
		if(input >= 1e6) {
			//178T399=178T399B
			finalResult = finalResult + exponents[exponents.indexOf(exponent) - 1];
		}
	} else {
		finalResult = input;
	}
	return finalResult;
}

function updatePower() {
	totalpowerdisplay.textContent = ("Total Power: " + ((baseAttackInput.value / 100 + 1) * updateAwakening1() * updateAwakening2() * updateMithrilSword() * updateMistilteinn() * updateHalberd() * updatePhilosophersStone() * updateGoldenGloves() * updateCaduceus() * updateGoldVessels() * updateCoatOfGold()).toPrecision(3));
}

function updateFloor() {
	//noinspection JSValidateTypes
	if(!powerInput.value.toString() === "") {
		//This is just statistics prediction.
		var log = 1 + (1.585 + topFloorInput.value * 0.001117) / 100;
		var lowEstimate = Math.round(Math.log(powerinput.value) / Math.log(log) * 0.98 / 5) * 5;
		var highEstimate = Math.round(Math.log(powerinput.value) / Math.log(log) * 1.02 / 5) * 5;
		floorEstimateOutput.textContent = lowEstimate + " - " + highEstimate;
	}
}

function updateGoldBox() {
	if(goldboxinput.value != "") {
		//starting at 10, increase tierGoal like this: 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000. Each time goal is reached, increment tier
		var level = goldboxinput.value;
		var tierGoal = 10;
		var tier = 1;
		var five = true;
		while(level >= tierGoal) {
			if(five) {
				tier += 1;
				tierGoal *= 5;
				five = false;
			} else {
				tier += 1;
				tierGoal *= 2;
				five = true;
			}
		}
		var result = Math.pow(4, tier - 1) * Math.pow(level, 2) + Math.pow(4, tier) * level;
		if(inGameNumbers == true) {
			goldBoxOutput.textContent = formatNumber(result) + " gold on new dungeon";
		} else {
			result >= 1e21 ? goldBoxOutput.textContent = result.toPrecision(3) + " gold on new dungeon" : goldBoxOutput.textContent = result + " gold on new dungeon";
		}
	} else {
		goldBoxOutput.textContent = "0 gold on new dungeon";
	}
}

function calcAttack(type, level) {
	if(level != "") {
		level = parseInt(level);
		//Use type as an id for the three basic attack items
		var tier;
		switch(type) {
			case 1:
				if(level <= 18) {
					switch(level) {
						case 0:
							return 0;
						case 1:
							return 30;
						case 2:
							return 65;
						case 3:
							return 100;
						case 4:
							return 140;
						case 5:
							return 185;
						case 6:
							return 230;
						case 7:
							return 280;
						case 8:
							return 330;
						case 9:
							return 385;
						case 10:
							return 460;
						case 11:
							return 535;
						case 12:
							return 610;
						case 13:
							return 690;
						case 14:
							return 770;
						case 15:
							return 850;
						case 16:
							return 935;
						case 17:
							return 1030;
						case 18:
							return 1130;
					}
				}
				if(level >= 19 && level <= 96) {
					tier = "tier1";
				}
				if(level >= 97 && level <= 142) {
					tier = "tier2";
				}
				if(level >= 143 && level <= 218) {
					tier = "tier3";
				}
				if(level >= 219 && level <= 580) {
					tier = "tier4";
				}
				if(level >= 581 && level <= 924) {
					tier = "tier5";
				}
				if(level >= 925 && level <= 4057) {
					tier = "tier6";
				}
				if(level >= 4058 && level <= 16639) {
					tier = "tier7";
				}
				if(level >= 16640) {
					tier = "tier8";
				}
				return Math.round(Math.round(claymore[tier].bonus * level * (7 + level) + claymore[tier].base) / 5) * 5;
			case 2:
				if(level <= 47) {
					tier = "tier1";
				}
				if(level >= 48 && level <= 77) {
					tier = "tier2";
				}
				if(level >= 78 && level <= 130) {
					tier = "tier3";
				}
				if(level >= 131 && level <= 381) {
					tier = "tier4";
				}
				if(level >= 382 && level <= 619) {
					tier = "tier5";
				}
				if(level >= 620 && level <= 2721) {
					tier = "tier6";
				}
				if(level >= 2722 && level <= 10891) {
					tier = "tier7";
				}
				if(level >= 10892) {
					tier = "tier8";
				}
				return Math.round(Math.round(flamberge[tier].bonus * level * (59 + level) + flamberge[tier].base) / 5) * 5;
			case 3:
				if(level <= 13) {
					tier = "tier1";
				}
				if(level >= 14 && level <= 27) {
					tier = "tier2";
				}
				if(level >= 28 && level <= 58) {
					tier = "tier3";
				}
				if(level >= 59 && level <= 260) {
					tier = "tier4";
				}
				if(level >= 261 && level <= 476) {
					tier = "tier5";
				}
				if(level >= 477 && level <= 2465) {
					tier = "tier6";
				}
				if(level >= 2466 && level <= 10250) {
					tier = "tier7";
				}
				if(level >= 10251) {
					tier = "tier8";
				}
				return Math.round(Math.round(tomahawk[tier].bonus * level * (326.27272728 + level) + tomahawk[tier].base) / 5) * 5;
		}
	} else {
		return 0;
	}
}

function updateRunAttack() {
	var claymoreNewLevel = parseInt(claymoreInput.value) + parseInt(claymoreGainInput.value);
	var flambergeNewLevel = parseInt(flambergeInput.value) + parseInt(flambergeGainInput.value);
	var tomahawkNewLevel = parseInt(tomahawkInput.value) + parseInt(tomahawkGainInput.value);
	var claymoreGain,
		flambergeGain,
		tomahawkGain;
	//I just keep finding inconsistencies and things to improve on. Usually a blank input box just doesn't update things but in this case I set it to become 0 instead. Huh.
	//Actually shut up comment above this one, if people were fiddling with the "items gained per run" they probably wouldn't type in 0, it's easier to just empty the field because there are multiple conditions leading to a single result
	//I accidentally did good design wow
	//noinspection JSUnusedAssignment
	claymoreGainInput.value == "" ? claymoreGain = 0 : claymoreGain = calcAttack(1, claymoreNewLevel) - calcAttack(1, claymoreInput.value);
	//noinspection JSUnusedAssignment
	flambergeGainInput.value == "" ? flambergeGain = 0 : flambergeGain = calcAttack(2, flambergeNewLevel) - calcAttack(2, flambergeInput.value);
	//noinspection JSUnusedAssignment
	tomahawkGainInput.value == "" ? tomahawkGain = 0 : tomahawkGain = calcAttack(3, tomahawkNewLevel) - calcAttack(3, tomahawkInput.value);
	if(inGameNumbers == true) {
		claymoreAfter.textContent = formatNumber(claymoreGain) + "%";
		flambergeAfter.textContent = formatNumber(flambergeGain) + "%";
		tomahawkAfter.textContent = formatNumber(tomahawkGain) + "%";
		totalAttackPerRun.textContent = formatNumber(claymoreGain + flambergeGain + tomahawkGain) + "%";
	} else {
		claymoreAfter.textContent = claymoreGain + "%";
		flambergeAfter.textContent = flambergeGain + "%";
		tomahawkAfter.textContent = tomahawkGain + "%";
		totalAttackPerRun.textContent = claymoreGain + flambergeGain + tomahawkGain + "%";
	}
}

function updateAttacks() {
	if(claymoreInput.value == "") {
		claymoreInput.value = 0;
	}
	if(claymoreGainInput.value == "") {
		claymoreGainInput.value = 0;
	}
	if(flambergeInput.value == "") {
		flambergeInput.value = 0;
	}
	if(flambergeGainInput.value == "") {
		flambergeGainInput.value = 0;
	}
	if(tomahawkInput.value == "") {
		tomahawkInput.value = 0;
	}
	if(tomahawkGainInput.value == "") {
		tomahawkGainInput.value = 0;
	}
	if(inGameNumbers == true) {
		if(parseInt(claymoreInput.value) > 1) {
			claymoreeff.textContent = "Effect: " + formatNumber(calcAttack(1, claymoreInput.value)) + "%";
			claymorerel.textContent = "Relative increase from last level: " + (calcAttack(1, claymoreInput.value) / calcAttack(1, claymoreInput.value - 1) * 100 - 100).toPrecision(3) + "%";
			claymoreinc.textContent = "Last levels effect: " + formatNumber(calcAttack(1, claymoreInput.value - 1)) + "%";
		} else if(parseInt(claymoreInput.value) === 1) {
			claymoreeff.textContent = "Effect: 30%";
			claymorerel.textContent = "Relative increase from last level: N/A";
			claymoreinc.textContent = "Last levels effect: N/A";
		} else {
			claymoreeff.textContent = "Effect: 0%";
			claymorerel.textContent = "Relative increase from last level: N/A";
			claymoreinc.textContent = "Last levels effect: N/A";
		}
		if(parseInt(flambergeInput.value) > 1) {
			flambergeeff.textContent = "Effect: " + formatNumber(calcAttack(2, flambergeInput.value)) + "%";
			flambergerel.textContent = "Relative increase from last level: " + (calcAttack(2, flambergeInput.value) / calcAttack(2, flambergeInput.value - 1) * 100 - 100).toPrecision(3) + "%";
			flambergeinc.textContent = "Last levels effect: " + formatNumber(calcAttack(2, flambergeInput.value - 1)) + "%";
		} else if(parseInt(flambergeInput.value) === 1) {
			flambergeeff.textContent = "Effect: 300%";
			flambergerel.textContent = "Relative increase from last level: N/A";
			flambergeinc.textContent = "Last levels effect: N/A";
		} else {
			flambergeeff.textContent = "Effect: 0%";
			flambergerel.textContent = "Relative increase from last level: N/A";
			flambergeinc.textContent = "Last levels effect: N/A";
		}

		if(parseInt(tomahawkInput.value) > 1) {
			tomahawkeff.textContent = "Effect: " + formatNumber(calcAttack(3, tomahawkInput.value)) + "%";
			tomahawkrel.textContent = "Relative increase from last level: " + (calcAttack(3, tomahawkInput.value) / calcAttack(3, tomahawkInput.value - 1) * 100 - 100).toPrecision(3) + "%";
			tomahawkinc.textContent = "Last levels effect: " + formatNumber(calcAttack(3, tomahawkInput.value - 1)) + "%";
		} else if(parseInt(tomahawkInput.value) === 1) {
			tomahawkeff.textContent = "Effect: 1K800%";
			tomahawkrel.textContent = "Relative increase from last level: N/A";
			tomahawkinc.textContent = "Last levels effect: N/A";
		} else {
			tomahawkeff.textContent = "Effect: 0%";
			tomahawkrel.textContent = "Relative increase from last level: N/A";
			tomahawkinc.textContent = "Last levels effect: N/A";
		}
	} else {
		if(parseInt(claymoreInput.value) > 1) {
			claymoreeff.textContent = "Effect: " + (calcAttack(1, claymoreInput.value)) + "%";
			claymorerel.textContent = "Relative increase from last level: " + (calcAttack(1, claymoreInput.value) / calcAttack(1, claymoreInput.value - 1) * 100 - 100).toPrecision(3) + "%";
			claymoreinc.textContent = "Last levels effect: " + (calcAttack(1, claymoreInput.value - 1)) + "%";
		} else if(parseInt(claymoreInput.value) === 1) {
			claymoreeff.textContent = "Effect: 30%";
			claymorerel.textContent = "Relative increase from last level: N/A";
			claymoreinc.textContent = "Last levels effect: N/A";
		} else {
			claymoreeff.textContent = "Effect: 0%";
			claymorerel.textContent = "Relative increase from last level: N/A";
			claymoreinc.textContent = "Last levels effect: N/A";
		}
		if(parseInt(flambergeInput.value) > 1) {
			flambergeeff.textContent = "Effect: " + (calcAttack(2, flambergeInput.value)) + "%";
			flambergerel.textContent = "Relative increase from last level: " + (calcAttack(2, flambergeInput.value) / calcAttack(2, flambergeInput.value - 1) * 100 - 100).toPrecision(3) + "%";
			flambergeinc.textContent = "Last level effect: " + (calcAttack(2, flambergeInput.value - 1)) + "%";
		} else if(parseInt(flambergeInput.value) === 1) {
			flambergeeff.textContent = "Effect: 300%";
			flambergerel.textContent = "Relative increase from last level: N/A";
			flambergeinc.textContent = "Last levels effect: N/A";
		} else {
			flambergeeff.textContent = "Effect: 0%";
			flambergerel.textContent = "Relative increase from last level: N/A";
			flambergeinc.textContent = "Last levels effect: N/A";
		}
		if(parseInt(tomahawkInput.value) > 1) {
			tomahawkeff.textContent = "Effect: " + (calcAttack(3, tomahawkInput.value)) + "%";
			tomahawkrel.textContent = "Relative increase from last level: " + (calcAttack(3, tomahawkInput.value) / calcAttack(3, tomahawkInput.value - 1) * 100 - 100).toPrecision(3) + "%";
			tomahawkinc.textContent = "Last level effect: " + (calcAttack(3, tomahawkInput.value - 1)) + "%";
		} else if(parseInt(tomahawkInput.value) === 1) {
			tomahawkeff.textContent = "Effect: 1800%";
			tomahawkrel.textContent = "Relative increase from last level: N/A";
			tomahawkinc.textContent = "Last levels effect: N/A";
		} else {
			tomahawkeff.textContent = "Effect: 0%";
			tomahawkrel.textContent = "Relative increase from last level: N/A";
			tomahawkinc.textContent = "Last levels effect: N/A";
		}
	}
	updateRunAttack();
}

function updateAll() {
	updatePower();
	updateFloor();
	updateGoldBox();
	updateAttacks(); //A function and a function within a function within a function within a function! Yay! (calcAttack() and formatNumber() within updateRunAttack() within updateAttacks() within updateAll())
	updateNotation();
}

letterInput.value = "";
scientificInput.value = "";

function updateNotation(id) {
	if(id === 1) {
		var letterInputNoNum = (letterInput.value.toString().replace(/[0-9]/g, ""));
		letterInputNoNum = letterInputNoNum.replace(".", "");
		console.log(letterInputNoNum);
		if(letterInput.value===letterInputNoNum) {
			scientificInput.value = "e" + (exponents.indexOf(letterInput.value)*3+3).toString();
		} else {
			scientificInput.value = Math.round(parseFloat(letterInput.value) * Math.pow(1000, exponents.indexOf(letterInputNoNum) + 1)).toPrecision(3);
		}
	}
	if(id === 2) {
		letterInput.value = (scientificInput.value / Math.pow(1000, (Math.floor(Math.log(scientificInput.value) / Math.log(1000))))).toPrecision(3);
		if(scientificInput.value>=1e3) {
			letterInput.value += exponents[Math.floor(Math.log(scientificInput.value) / Math.log(1000)) - 1];
		}
	}
}

function toggleFormat() {
	//Had to make a separate function because adding an onchange event to the checkbox itself didn't work.
	//It would do the updateAll function before the inGameNumbers variable updated, so it would only update things
	//with the proper format once you updated them separately and flicking the box on and off would show the previous setting.
	//noinspection JSUnusedAssignment
	numbersCheck.checked ? inGameNumbers = true : inGameNumbers = false;
	updateAll();
}
updateAll();
