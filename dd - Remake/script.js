function Random(min, max) {
	return Math.random() * (max - min) + min;
} //Random with a range!
var DecInfinity = new Decimal("1e"+Decimal.maxE);
var scaling = { //Scalings must be decimals so effect=effect.times(scaling.toPower(X)) isn't undefined.
	upCost: new Decimal(1.034),
	dmg: new Decimal(1.016375),
	maxHp: new Decimal(1.0183/1.0075), //1.09^1/5 total hp scaling per upgrade
	armor: new Decimal(1.0075),
	healUp: new Decimal(1.0183/1.0075),
	healUpMana: new Decimal(1.02),
	healCost: new Decimal(0.99), //1.0098/0.99 = effectively 1.02 times more mana per upgrade
	maxMana: new Decimal(1.0098),
	crit: new Decimal(0.9965402628278679), //500 upgrades = 0.5x multiplier to total. with 0.4 flat scaling, caps at 500 upgrades for 100.00000000000381
	critCost: new Decimal(1.025),
	enemyMaxHp: new Decimal(1.09),
	enemyDmg: new Decimal(1.1),
	enemyGold: new Decimal(1.138),
	enemyExp: new Decimal(1.005),
	xpPow: new Decimal(1.005),
	xpReq: new Decimal(1.025) //xp req = one pLvl every ~3.555 enemy levels, but all other scaling will act as if you get one every 2 levels
}
var player = {
	gold: new Decimal(0),
	totalGold: new Decimal(0),
	level: new Decimal(1),
	maxLevel: new Decimal(1),
	kills: new Decimal(0),
	deaths: new Decimal(0),
	fps: new Decimal(30),
	visualFps: new Decimal(30),
	bulkAmount: 1,
	xp: new Decimal(0),
	xpReq: new Decimal(100),
	pLvl: new Decimal(1),
	lastTime: new Decimal(Date.parse(Date())/1000)
}
var prefs = ["30", "30", false];
var archer = {
	attackReq: new Decimal(0),
	attackSpeed: new Decimal(1000)
};
var knight = {};
var priest = {
	castReq: new Decimal(0),
	baseCastSpeed: new Decimal(800)
};
var enemy = {
	baseDmg: new Decimal(60),
	baseMaxHp: new Decimal(120),
	baseGold: new Decimal(15),
	xp: new Decimal(2),
	attackReq: new Decimal(0),
	attackSpeed: new Decimal(1000)
}
var upgrades = {
	dmg: {
		user: "archer",
		stat: "dmg",
		base: new Decimal(8),
		flatScaling: new Decimal(0.64),
		scalesWithXp: true,
		tooltip: "Increases the archer's damage.",
		tooltipStatName: "Damage",
		buttonText: "+X damage"
	},
	maxHp: {
		user: "knight",
		stat: "maxHp",
		base: new Decimal(3000),
		flatScaling: new Decimal(150),
		scalesWithXp: true,
		tooltip: "Increases the knight's maximum health.",
		tooltipStatName: "Max Health",
		buttonText: "+X max health"
	},
	armor: {
		user: "knight",
		stat: "armor",
		base: new Decimal(1),
		flatScaling: new Decimal(0.015),
		tooltip: "Increases armor, which divides all incoming damage by itself.",
		tooltipStatName: "Armor",
		buttonText: "+X armor"
	},
	healUp: {
		user: "priest",
		stat: "power",
		base: new Decimal(750),
		flatScaling: new Decimal(25),
		scalesWithXp: true,
		tooltip: "Increases the power of healing, at the cost of increased mana usage.",
		tooltipStatName: "Heal Power",
		buttonText: "+X heal power"
	},
	maxMana: {
		user: "priest",
		stat: "maxMana",
		base: new Decimal(200),
		flatScaling: new Decimal(5),
		tooltip: "Increases maximum mana.",
		tooltipStatName: "Max Mana",
		buttonText: "+X max mana"
	},
	attackSpeed: {
		user: "archer",
		stat: "attackSpeed",
		base: new Decimal(1000),
		flatScaling: new Decimal(15),
		scaling: new Decimal(1.006955550056719),
		costScaling: new Decimal(1.05),
		maxLevel: 100, //Caps at 5x attack speed
		tooltip: "Increases the archer's attack speed.",
		tooltipStatName: "Attacks per second",
		tooltipCalc: "calc(\"attackSpeed\", upgrades.attackSpeed.bought+1).div(1000)",
		buttonText: "+X attack speed",
		buttonCalc: "calc(\"attackSpeed\", upgrades.attackSpeed.bought+1).minus(calc(\"attackSpeed\", upgrades.attackSpeed.bought)).div(1000)"
	},
	healCost: {
		user: "priest",
		stat: "healCost",
		base: new Decimal(30),
		flatScaling: new Decimal(0),
		tooltip: "Makes healing cost less mana.",
		tooltipStatName: "Heal Cost",
		tooltipCalc: "calc(\"healCost\", upgrades.healCost.bought+1, upgrades.healUp.bought)",
		buttonText: "-X heal cost",
		buttonCalc: "calc(\"healCost\", upgrades.healCost.bought, upgrades.healUp.bought).minus(calc(\"healCost\", upgrades.healCost.bought+1, upgrades.healUp.bought))"
	},
	critChance: {
		user: "archer",
		stat: "critChance",
		base: new Decimal(0),
		flatScaling: new Decimal(1),
		scaling: scaling.crit,
		costScaling: scaling.critCost,
		maxLevel: 200,
		tooltip: "Gives a chance to crit, multiplying damage. (base: 2x)",
		tooltipStatName: "Crit Chance",
		buttonText: "+X% crit chance"
	},
	blockChance: {
		user: "knight",
		stat: "blockChance",
		base: new Decimal(0),
		flatScaling: new Decimal(1),
		scaling: scaling.crit,
		costScaling: scaling.critCost,
		maxLevel: 200,
		tooltip: "Gives a chance to block, dividing incoming damage. (base: 2)",
		tooltipStatName: "Block Chance",
		buttonText: "+X% block chance"
	},
	castSpeed: {
		user: "priest",
		stat: "castSpeed",
		base: priest.baseCastSpeed,
		flatScaling: new Decimal(5),
		scaling: new Decimal(1.0174796921026863),
		costScaling: new Decimal(1.075),
		maxLevel: 40,
		tooltip: "Decreases the amount of time spent casting, increasing healing speed.",
		tooltipStatName: "Cast Time",
		tooltipCalc: "Decimal(1).div(calc(\"castSpeed\", upgrades.castSpeed.bought+1).div(1000))",
		buttonText: "X cast time",
		buttonCalc: "Decimal(1000).div(calc(\"castSpeed\", upgrades.castSpeed.bought+1)).minus(Decimal(1000).div(calc(\"castSpeed\", upgrades.castSpeed.bought))).toNumber()"
	},
	priestCritChance: {
		user: "priest",
		stat: "critChance",
		base: new Decimal(0),
		flatScaling: new Decimal(1),
		scaling: scaling.crit,
		costScaling: scaling.critCost,
		maxLevel: 200,
		tooltip: "Gives a chance to crit, doubling healing.",
		tooltipStatName: "Crit Chance",
		buttonText: "+X% crit chance"
	},
	manaRegen: {
		user: "priest",
		stat: "manaRegen",
		base: Decimal(0),
		flatScaling: Decimal(0.04),
		scaling: new Decimal(1),
		costScaling: new Decimal(1.03),
		maxLevel: 50,
		tooltip: "Regenerates a portion of maximum mana each second.",
		tooltipStatName: "Mana Regen",
		buttonText: "+0.04% mana regen"
	},
	critFactor: {
		user: "archer",
		stat: "critFactor",
		base: new Decimal(2),
		flatScaling: new Decimal(0.025),
		scaling: new Decimal(1),
		tooltip: "Increases the multiplication factor of crits.",
		tooltipStatName: "Crit Factor",
		buttonText: "+2.5% crit factor"
	},
	blockFactor: {
		user: "knight",
		stat: "blockFactor",
		base: new Decimal(2),
		flatScaling: new Decimal(0.025),
		scaling: new Decimal(1),
		tooltip: "Increases the division factor of blocks.",
		tooltipStatName: "Block Factor",
		buttonText: "+2.5% block factor"
	}
}
var yza = 0.05;
var upgradesKeys = Object.keys(upgrades);
for(var i in upgrades) {
	if(upgrades[i].scalesWithXp === undefined) {
		upgrades[i].scalesWithXp = false;
	}
	if(upgrades[i].costScaling === undefined) {
		upgrades[i].costScaling = scaling.upCost;
	}
	if(upgrades[i].bought === undefined) {
		upgrades[i].bought = 0;
	}
	if(upgrades[i].maxLevel === undefined) {
		upgrades[i].maxLevel = -1;
	}
	if(upgrades[i].minEnemyLevel === undefined) {
		upgrades[i].minEnemyLevel = upgradesKeys.indexOf(i)*5;
	}
	if(upgrades[i].baseCostInc === undefined) {
		upgrades[i].baseCostInc=(upgrades[i].minEnemyLevel*4)*(1+yza);
	}
	if(upgrades[i].scaling === undefined) {
		upgrades[i].scaling = scaling[i];
	}
	console.log(upgrades[i].baseCostInc);
	console.log("Multiplying "+i+" by "+(1+yza));
	upgrades[i].baseCostInc *= 1+(yza);
	yza+=0.025;
	yza*=1.02;
	if(upgrades[i].tooltipCalc === undefined) {
		upgrades[i].tooltipCalc = "calc(\""+i+"\", upgrades."+i+".bought+1)"
	}
	if(upgrades[i].buttonCalc === undefined) {
		upgrades[i].buttonCalc = "calc(\""+i+"\", upgrades."+i+".bought+1).minus(calc(\""+i+"\", upgrades."+i+".bought))";
	}
}
function gotoLevel(i) {
	i = Decimal(i);
	player.level = i;
	clearInterval(deathDelay);
	document.getElementById("pause").checked = false;
	if(i.gt(20)) {
		enemy.maxHp = enemy.baseMaxHp.times(1 + (i.minus(20)) * 0.125);
		enemy.dmg = enemy.baseDmg.times(1 + (i.minus(20)) * 0.125);
	} else {
		enemy.maxHp = enemy.baseMaxHp;
		enemy.dmg = enemy.baseDmg;
	}
	enemy.gold = (enemy.baseGold.plus((i.minus(1))*0.5)).times(scaling.enemyGold.toPower(i.minus(1)));
	if(i.toNumber() % 10 === 0) {
		enemy.maxHp = enemy.maxHp.times(2);
		enemy.dmg = enemy.dmg.times(1.5);
	}
	enemy.maxHp = enemy.maxHp.times(scaling.enemyMaxHp.toPower(i.minus(1)));
	enemy.dmg = enemy.dmg.times(scaling.enemyDmg.toPower(i.minus(1)));
	enemy.gold = (enemy.baseGold.plus((i.minus(1))*0.5)).times(scaling.enemyGold.toPower(i.minus(1)));
	enemy.xp = (Decimal(2).plus((i.minus(1)).times(0.5))).times(scaling.enemyExp.toPower(i.minus(1)));
	enemy.hp = enemy.maxHp;
	knight.hp = knight.maxHp;
	priest.mana = priest.maxMana;
	enemy.attackReq = Decimal(0);
	archer.attackReq = Decimal(0);
	priest.castReq = Decimal(0);
}
function switchTab(tar) {
	$("#tab1").css("display", "none");
	$("#tab2").css("display", "none");
	$("#tab3").css("display", "none");
	switch (tar) {
		case 1:
			$("#tab1").css("display", "inline");
			break;
		case 2:
			$("#tab2").css("display", "inline");
			break;
		case 3:
			$("#tab3").css("display", "inline");
			break;
	}
}
function calc(up, lvl, lvl2) {
	var result;
	var target = upgrades[up];
	switch (up) {
		case "healCost":
			result = (target.base.plus(target.flatScaling.times(lvl))).times(target.scaling.toPower(lvl)).times(scaling.healUpMana.toPower(upgrades.healUp.bought));
			break;
		default:
			result = (target.base.plus(target.flatScaling.times(lvl))).times(target.scaling.toPower(lvl));
			break;
	}
	if(target.scalesWithXp) {
		result = result.times(scaling.xpPow.toPower(player.pLvl-1))
	}
	return result;
}
function getStep(num) {
	var result = 0;
	while(num.gte(1e3)) {
		num = num.dividedBy(1e3);
		result += 1;
	}
	return [result, num.toFixed(2)];
}
function format(num) {
	var num = new Decimal(num);
	var result;
	var thing = [-1, 0];
	if(num.lt(1)) {
		result = num.toNumber().toPrecision(2);
	} else if(num.lt(1e3)) {
		result = num.toNumber().toPrecision(3);
		return result;
	} else {
		if(num.lt(1e18)) {
			thing = getStep(num);
		}
		switch (thing[0]) {
			case 0:
				result = num.trunc();
				break;
			case 1:
				result = thing[1] + "K";
				break;
			case 2:
				result = thing[1] + "M";
				break;
			case 3:
				result = thing[1] + "B";
				break;
			case 4:
				result = thing[1] + "T";
				break;
			default:
				result = num.toExponential(2).toString().replace("+", "");
				break;
		}
	}
	return result;
}
function buyUpgrade(tar) {
	if(player.gold.gte(upgrades[tar].cost) && player.maxLevel.gte(upgrades[tar].minEnemyLevel)) {
		upgrades[tar].bought += 1;
		player.gold = player.gold.minus(upgrades[tar].cost);
		updateStats();
		$("#"+tar+"Button").css("animation-name","blink");
		setTimeout(function(){
			$("#"+tar+"Button").css("animation-name","");
		},200);
	}
}
function createButton(tar) {
	var elem = document.createElement("div");
	elem.id = tar + "Button";
	elem.className = "upgradeButton";
	elem.onclick = function() {
		buyUpgrade(tar);
	}
	elem.onmouseover = function() {
		$("#"+tar+"ButtonTooltip").css("display","inline-block");
	}
	elem.onmouseout = function() {
		$("#"+tar+"ButtonTooltip").css("display","none");
	}
	var user = document.getElementById(upgrades[tar].user + "Upgrades");
	var text1 = document.createElement("span");
	var text2 = document.createElement("span");
	var image = document.createElement("img");
	text1.id = tar + "ButtonText1";
	text1.className = "upgradeText1";
	text2.id = tar + "ButtonText2"
	text2.className = "upgradeText2";
	image.id = tar + "ButtonImage";
	image.className = "upgradeButtonImage";
	elem.appendChild(text1);
	elem.appendChild(text2);
	elem.appendChild(image);
	user.appendChild(elem);
	var tooltip = document.createElement("div");
	tooltip.id = tar + "ButtonTooltip";
	tooltip.className = "tooltip";
	user.appendChild(tooltip);
}
function updateStats() {
	for(var i in upgrades) {
		var target = upgrades[i];
		if(target.minEnemyLevel > player.maxLevel) {
			upgrades[i].cost = Decimal(Infinity);
			$("#"+i+"Button").css("display","none");
		} else {
			$("#"+i+"Button").css("display","inline-block");
		}
		if(target.bought<target.maxLevel || target.maxLevel===-1) {
			//This comment is to easily find this via search - updateCosts()
			target.cost = (Decimal(10).plus(Decimal(0.025).times(target.bought))).times(target.costScaling.toPower(target.bought)).times(scaling.upCost.toPower(target.baseCostInc));
		} else {
			target.cost = Decimal(Infinity);
			$("#"+i+"Button").css("display","none");
		}
		switch(i) {
			case "healCost":
				priest.healCost = calc("healCost", upgrades.healCost.bought, upgrades.healCost.bought);
			default:
				window[target.user][target.stat] = calc(i, target.bought);
				break;
		}
	}
}
for(var i in upgrades) {
	createButton(i);
}
function updateButtonText() {
	for(var i in upgrades) {
		var target = document.getElementById(i + "ButtonText1");
		target.textContent = upgrades[i].buttonText.replace("X", format(eval(upgrades[i].buttonCalc)));
		target = document.getElementById(i + "ButtonText2");
		target.textContent = "\n" + format(upgrades[i].cost) + " Gold";
		target = document.getElementById(i + "ButtonTooltip");
		switch(i) { //This is currently the only thing that can't be directly controlled from the upgrades object. Maybe fix that?
			case "attackSpeed":
				target.textContent = upgrades[i].tooltip + "\n\n" + upgrades[i].tooltipStatName + ":\n" + format(window[upgrades[i].user][upgrades[i].stat].div(1000)) + " -> " +format(eval(upgrades[i].tooltipCalc)) + "\n\nBought: "+upgrades[i].bought;
				break;
			case "castSpeed":
				target.textContent = upgrades[i].tooltip + "\n\n" + upgrades[i].tooltipStatName + ":\n" + format(Decimal(1).div(window[upgrades[i].user][upgrades[i].stat].div(1000))) + "s -> " +format(eval(upgrades[i].tooltipCalc)) + "s\n\nBought: "+upgrades[i].bought;
				break;
			case "critChance":
			case "blockChance":
			case "priestCritChance":
			case "manaRegen":
				target.textContent = upgrades[i].tooltip + "\n\n" + upgrades[i].tooltipStatName + ":\n" + format(window[upgrades[i].user][upgrades[i].stat]) + "% -> " +format(eval(upgrades[i].tooltipCalc)) + "%\n\nBought: "+upgrades[i].bought;
				break;
			default:
				target.textContent = upgrades[i].tooltip + "\n\n" + upgrades[i].tooltipStatName + ":\n" + format(window[upgrades[i].user][upgrades[i].stat]) + " -> " +format(eval(upgrades[i].tooltipCalc)) + "\n\nBought: "+upgrades[i].bought;
				break;
		}
	}
}
function combat() {
	if(!document.getElementById("pause").checked) {
		if(priest.maxMana.gte(priest.mana.plus(priest.maxMana.times(priest.manaRegen.div(100))))) {
			priest.mana=priest.mana.plus(priest.maxMana.times(priest.manaRegen.div(100).div(player.fps)));
		}
		archer.attackReq=archer.attackReq.plus(archer.attackSpeed.div(player.fps));
		enemy.attackReq=enemy.attackReq.plus(enemy.attackSpeed.div(player.fps));
		if(knight.hp.lte(knight.maxHp.minus(priest.power)) && priest.castReq.lt(1)) {
			priest.castReq=Decimal(1);
		}
		if(priest.castReq.gte(1) && priest.mana.gte(priest.healCost) && player.maxLevel.gte(15)) {
			priest.castReq=priest.castReq.plus(priest.castSpeed.div(player.fps));
		}
		if(priest.castReq.gte(1000)) {
			knight.hp=knight.hp.plus(priest.power);
			priest.mana=priest.mana.minus(priest.healCost)
			priest.castReq=Decimal(0);
		}
		while(enemy.attackReq.gte(1000)) {
			knight.hp = knight.hp.minus(enemy.dmg.div(knight.armor));
			enemy.attackReq=enemy.attackReq.minus(1000);
		}
		while(archer.attackReq.gte(1000)) {
			enemy.hp = enemy.hp.minus(archer.dmg)
			if(Random(0, 100) < archer.critChance) {
				enemy.hp = enemy.hp.minus(archer.dmg.times(archer.critFactor.minus(1)))
			}
			archer.attackReq=archer.attackReq.minus(1000);
		}
		if(knight.hp.lte(knight.maxHp.plus(priest.power)))
		checkDeath();
	}
}
var deathDelay;
function checkDeath() {
	if(knight.hp.lte(1)) {
		knight.hp = Decimal(0);
	} 
	if(enemy.hp.lte(1)) {
		enemy.hp = Decimal(0);
	}
	if(knight.hp.lte(1) || enemy.hp.lte(1)) {
		document.getElementById("pause").checked = true;
		deathTimer = 5e5/archer.attackSpeed;
		if(knight.hp.lte(1)) {
				player.deaths = player.deaths.plus(1);
		} else if(enemy.hp.lte(1)) {
				player.kills = player.kills.plus(1);
				player.gold = player.gold.plus(enemy.gold);
				player.totalGold = player.totalGold.plus(enemy.gold);
				player.xp = player.xp.plus(enemy.xp)
		}
		deathDelay = setTimeout(function() {
			if(knight.hp.lte(1)) {
				player.level === 1 ? gotoLevel(player.level) : gotoLevel(player.level.minus(1));
				document.getElementById("autoProgress").checked=false;
			} else if(enemy.hp.lte(1)) {
				if(player.level.eq(player.maxLevel)) {
					player.maxLevel=player.maxLevel.plus(1);
				}
				if(document.getElementById("autoProgress").checked) {
					gotoLevel(player.maxLevel);
				} else {
					gotoLevel(player.level)
				}
			}
			document.getElementById("pause").checked = false;
		}, deathTimer)
	}
}
var showEnemyGold = false;
function updateInactiveVisuals() {
	for(var i in upgrades) {
		if(upgrades[i].cost.gt(player.gold)) {
			$("#"+i+"Button").css("background-color","#CC9999");
		} else {
			$("#"+i+"Button").css("background-color","#EEEEEE");
		}
	}
	player.fps = Decimal($("#fpsSlider")[0].value);
	player.visualFps = Decimal($("#visualFpsSlider")[0].value);
	$("#fpsCount").text("FPS: " + player.fps.toNumber());
	$("#visualFpsCount").text("Visual FPS: " + player.visualFps.toNumber());
	if(player.maxLevel.gte(5)) {
		$("#autoProgress, #autoProgressText, #buyEverythingButton").css("display", "inline");
	}
	showEnemyGold = document.getElementById("showEnemyGold").checked;
	if(showEnemyGold) {
		$("#gold").text("Gold: " + format(player.gold) + " \(" + format(enemy.gold) + "\)");
	} else {
		$("#gold").text("Gold: " + format(player.gold));
	}
	if(player.maxLevel.gte(5)) {
		$("#knightUpgrades").css("display", "inline");
	}
	if(player.maxLevel.gte(15)) {
		$("#priestUpgrades").css("display", "inline");
	}
	if(player.maxLevel.gte(45)) {
		$("#playerUpgrades").css("display", "inline");
	}
	if(player.maxLevel.gte(1e3)) {
		$("#level").css("font-size", "18px");
	}
	if(player.maxLevel.gte(1e4)) {
		$("#level").css("font-size", "16px");
	}
	if(player.maxLevel.gte(1e5)) {
		$("#level").css("font-size", "15px");
	}
	if(player.maxLevel.gte(1e6)) {
		$("#level").css("font-size", "13px");
	}
	if(player.maxLevel.gte(1e7)) {
		$("#level").css("font-size", "11px");
	}
	if(player.bulkAmount > 1) {
		$("#buyEverythingButton").text("Buy " + player.bulkAmount + " cheapest upgrades");
	} else {
		$("#buyEverythingButton").text("Buy cheapest upgrade");
	}
	$("#level").text("Level: " + player.level + "/" + player.maxLevel);
	$("#xpLevel").text("Group Level: "+player.pLvl);
	updateStats();
	updateButtonText();
}
function updateVisuals() {
	$("#enemyHp").text(format(enemy.hp) + "/" + format(enemy.maxHp));
	$("#enemyHp").css({
		"width": ((enemy.hp.div(enemy.maxHp)) * 450)
	});
	$("#archerAttackBar").css({
		"width": ((archer.attackReq / 1000) * 450),
		"display": "inline"
	});
	if(player.maxLevel>=5) {
	$("#knightHp").text(format(knight.hp) + "/" + format(knight.maxHp));
	$("#knightHp").css({
		"width": ((knight.hp.div(knight.maxHp)) * 450),
		"display": "inline"
	});
	$("#enemyAttackBar").css({
		"width": ((enemy.attackReq / 1000) * 450),
		"display": "inline"
	});
	}
	if(player.maxLevel>=15) {
	$("#mana").text(format(priest.mana) + "/" + format(priest.maxMana));
	$("#mana").css({
		"width": ((priest.mana / priest.maxMana) * 450),
		"display": "inline"
	});
	var castTime = Decimal(1000).div(priest.castSpeed) //In seconds
	if(priest.castReq.gt(1)) {
		$("#castBar").text(format(priest.castReq.times(castTime).div(1000)) + " / " + format(castTime));
	} else {
		$("#castBar").text("0.00 / "+format(castTime));
	}
	$("#castBar").css({
		"width": ((priest.castReq / 1000) * 450),
		"display": "inline"
	})
	}
	$("#xpText").text(format(player.xp)+" / "+format(player.xpReq));
	$("#xpBar").css("width", (player.xp.div(player.xpReq)*100)+"%");
}
function checkOverflow() {
	if(knight.hp.gt(knight.maxHp)) {knight.hp=knight.maxHp};
	if(enemy.hp.gt(enemy.maxHp)) {enemy.hp=enemy.maxHp};
	if(priest.mana.gt(priest.maxMana)) {priest.mana=priest.maxMana};
	if(priest.mana.lte(1)) {priest.mana=Decimal(0)};
	player.xpReq=Decimal(500).plus(Decimal(100).times(player.pLvl-1)).times(scaling.xpReq.toPower(player.pLvl-1));
	while(player.xp.gte(player.xpReq)) {
		player.pLvl=player.pLvl.plus(1);
		player.xp=player.xp.minus(player.xpReq);
		player.xpReq=Decimal(500).plus(Decimal(100).times(player.pLvl-1)).times(scaling.xpReq.toPower(player.pLvl-1));
	}
}
function loop() {
	combat();
	checkOverflow();
	window.setTimeout(loop, 1000 / player.fps);
}
function visualLoop() {
	updateVisuals();
	window.setTimeout(visualLoop, 1000 / player.visualFps);
}
$("#prevLevel").on("click", function() {
	document.getElementById("autoProgress").checked = false;
	if(player.level.gt(1)) {
		gotoLevel(player.level.minus(1))
	}
});
$("#nextLevel").on("click", function() {
	document.getElementById("autoProgress").checked = false;
	if(player.level.lt(player.maxLevel)) {
		gotoLevel(player.level.plus(1))
	}
});
function buyEverything() {
	var keys = Object.keys(upgrades);
	for(var x=0;x<player.bulkAmount;x++) {
	var value = upgrades[keys[x]].cost;
	var index = 0;
	for(var i = 1; i < keys.length; i++) {
		if(upgrades[keys[i]].cost.lt(value)) {
			value = upgrades[keys[i]].cost;
			index = i;
		}
	}
	buyUpgrade(keys[index]);
	}
}
$("#buyEverythingButton").on("click", buyEverything)
$(window).keydown(function(e) {
	switch(e.key) {
		case "a":
		case "A":
			document.getElementById("autoProgress").click();
			break;
		case "b":
		case "B":
			buyEverything();
			break;
		case "ArrowLeft":
			$("#prevLevel").click();
			break;
		case "ArrowRight":
			$("#nextLevel").click();
			break;
	}
});
var playerVarsBL = ["bulkAmount"];
function save() {
	var playersave = {};
	for(var i in player) {
		if(playerVarsBL.indexOf(i)===-1) {
			playersave[i]=player[i];
		}
	}
	var upgradessave = {};
	for(var i in upgrades) {
		upgradessave[i] = {bought: upgrades[i].bought};
	}
	var prefsSave = [];
	prefsSave.push(player.fps);
	prefsSave.push(player.visualFps);
	prefsSave.push(showEnemyGold);
	localStorage.setItem("playersave", JSON.stringify(playersave));
	localStorage.setItem("upgradessave", JSON.stringify(upgradessave));
	localStorage.setItem("preferences", JSON.stringify(prefsSave));
	console.log("Saved!");
}
function load() {
	var upgradessave = JSON.parse(localStorage.getItem("upgradessave"));
	var playersave = JSON.parse(localStorage.getItem("playersave"));
	var prefsSave = JSON.parse(localStorage.getItem("preferences"));
	for(var a in playersave) {player[a]=Decimal(playersave[a])};
	for(var b in upgradessave) {upgrades[b].bought=upgradessave[b].bought};
	for(var c in prefsSave) {prefs[c]=prefsSave[c]};
	document.getElementById("fpsSlider").value=prefs[0];
	document.getElementById("visualFpsSlider").value=prefs[1];
	document.getElementById("showEnemyGold").checked=prefs[2];
	updateStats();
	gotoLevel(player.level);
	console.log("Loaded!");
}
var stopSaving = false;
function deleteSave() {
	localStorage.clear();
	stopSaving = true;
	location.reload();
}
updateStats();
gotoLevel(player.level);
loop();
visualLoop();
document.title = "Level " + player.level + " | " + format(player.gold) + " Gold";
setInterval(function() {
	updateInactiveVisuals();
}, 333);
//Offline progression and progression in another tab starts here
//There's probably a more elegant solution to this, but what it does is this:
//This is meant to run every second, but while in another tab(in firefox) it occasionally takes 2 seconds.
//On average it will start running every 1.5 seconds
//newTime is fetched every second, which is the current unix time-1.
//the previous newTime is saved as player.lastTime.
//timePassed is newTime-player.lastTime.
//timeArray stores the last 10 timePassed instances.
//if the sum of timeArray is greater than 13(average seconds between each second is 1.3)...
//offline progression kicks in, and stops updating player.lastTime
//The reason it does this is so that coming back to the tab won't reset the time passed.
//Once you claim your gold it resets timeArray to a sum of 10 seconds(not 0 so you can leave again right after claiming)
var gain = new Decimal(0);
var newTime = (Date.parse(Date())/1000)-1;
var timeArray = new Array;
newTime-player.lastTime>=60 ? timeArray = [60,1,1,1,1,1,1,1,1,1] : timeArray = [1,1,1,1,1,1,1,1,1,1]; //Don't reset player.lastTime if it's over 60 seconds behind current time.
$("#offlineProgressButton").on("click", function() {
	player.gold=player.gold.plus(gain);
	var newTime = Decimal(Date.parse(Date())/1000).minus(1);
	player.lastTime = newTime;
	timePassed = 0;
	timeArray = [1,1,1,1,1,1,1,1,1,1];
	document.getElementById("pause").checked=false;
	$("#offlineProgressWrapper").css("display", "none");
});
function add(a,b) {return a+b};
function formatTime(t) {
	var hours = Math.floor(t/3600);
	var seconds = t-hours*3600;
	var minutes = Math.floor(seconds/60);
	seconds -= minutes*60;
	return [seconds, minutes, hours];
}
setInterval(function() {
	document.title = "Level " + player.level;
	newTime = Decimal(Date.parse(Date())/1000).minus(1);
	timePassed = newTime-player.lastTime;
	gain = (enemy.gold.div(enemy.maxHp.div(archer.dmg))).times(timePassed/3); //I'm not quite sure if this works the way it should, either way it's too powerful on its own.
	timeArray.push(timePassed);
	if(timeArray.length>10) {
		timeArray.shift();
	}
	timeSum = timeArray.reduce(add,0);
	if(timeSum>15) {
		$("#offlineProgressWrapper").css("display", "inline");
		document.getElementById("pause").checked=true;
	} else {
		player.lastTime = newTime;
	}
	var displayTimePassed = formatTime(timePassed);
	var textElem = $("#offlineProgressText");
	textElem.text("You've been offline for "+displayTimePassed[2]);
	if(displayTimePassed[2]===1) {
		textElem.text(textElem.text() + " hour and "+displayTimePassed[1]);
	} else {
		textElem.text(textElem.text() + " hours and "+displayTimePassed[1]);
	}
	if(displayTimePassed[1]===1) {
		textElem.text(textElem.text() + " minute");
	} else {
		textElem.text(textElem.text() + " minutes");
	}
	textElem.text(textElem.text() + ", earning you "+format(gain)+" gold!");
}, 1000);
load();
updateStats();
gotoLevel(player.level);
setInterval(function() {
	if(!stopSaving) {
		save();
	}
},30000);
window.onbeforeunload = function(e) {
	if(!stopSaving) {
		save();
	}
}
for(var i in upgrades) {
	document.getElementById(i+"ButtonImage").src = "dat/"+i+".png";
}