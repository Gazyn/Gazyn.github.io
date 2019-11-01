var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
var exponents = [];
for(var a=0; a<26; a+=1) {
	var letter = letters[a];
	for(var b=0; b<26; b+=1) {
		exponents.push(letter+letters[b]);
	}
}
for(var a=0; a<26; a+=1) {
	var letter = letters[a];
	for(var b=0; b<26; b+=1) {
		var letter2 = letters[b];
		for(var c=0; c<26; c+=1) {
			exponents.push(letter+letter2+letters[c]);
		}
	}
}
function Random(min, max) {
	return Math.random() * (max - min) + min;
} //Random with a range!
function calcBuyBulk(f, n) { //f is factor - 20% increase is 0.2. n is amount
	return (Decimal(1).plus(f)).toPower(n).minus(1).div(f);
}
function getStatUpgradesBought(nametemp) {
	var result = new Array();
	var name = new Array();
	nametemp.constructor === Array ? name = nametemp : name = [upgrades[nametemp].user, upgrades[nametemp].stat]; //have array with [user, stat]
	var statUpgradesStat = statUpgrades[name[0]][name[1]];
	for(var i in statUpgradesStat) {
		result.push(upgrades[statUpgradesStat[i]].bought);
	}
	return result;
}
function updateStatss() {
	for(var a in statUpgrades) {
		for(var b in statUpgrades[a]) {
			var upgradeObjNames = statUpgrades[a][b];
			var result = new Decimal(0);
			for(var c in upgradeObjNames) {
				var tar = upgradeObjNames[c]
				if(upgrades[tar].base.eq(-1)) {
					upgradesTar = upgrades[tar];
					result = result.plus(upgradesTar.flatGain).times(upgradesTar.expoGain);
				} else {
					result = upgradesTar.base.plus(upgradesTar.flatGain).times(upgradesTar.expoGain);
				}
			}
			window[a][b] = result;
		}
	}
}
var DecInfinity = new Decimal("1e"+Decimal.maxE);
var scaling = { //Scalings must be decimals so effect=effect.times(scaling.toPower(X)) isn't undefined.
	upCost: new Decimal(1.04375),
	dmg1: new Decimal(1.016),
	dmg2: new Decimal(1.016), //gosh what an upgrade
	maxHp: new Decimal(1.018/1.0075),
	armor1: new Decimal(1.0075),
	armor2: new Decimal(1.008),
	healUp: new Decimal(1.018/1.0075),
	healUpMana: new Decimal(1.02),
	healCost: new Decimal(0.99), //1.0099/0.99 = effectively 1.020101 times more mana per upgrade
	maxMana: new Decimal(1.0099),
	crit: new Decimal(0.9965402628278679), //500 upgrades = 0.5x multiplier to total. with 0.4 flat scaling, caps at 500 upgrades for 100.00000000000381
	critCost: new Decimal(1.025),
	enemyMaxHp: new Decimal(1.09),
	enemyDmg: new Decimal(1.1),
	enemyGold: new Decimal(1.2384), //1e93 by level 1000
	enemyExp: new Decimal(1.025), //0.95 multiplier to end result for each level below max level(the first level below max is skipped)
	xpPow: new Decimal(1.01),
	xpReq: new Decimal(1.08)
}
var enemybalancefactor = 1.15;
scaling.enemyMaxHp=scaling.enemyMaxHp.toPower(enemybalancefactor);
scaling.enemyDmg=scaling.enemyDmg.toPower(enemybalancefactor);
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
	freePLvls: new Decimal(0),
	lastTime: new Decimal(Date.parse(Date())/1000)
}
var prefs = ["30", "30", false, false];
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
	baseGold: new Decimal(10),
	armor: new Decimal(1),
	xp: new Decimal(2),
	attackReq: new Decimal(0),
	attackSpeed: new Decimal(1000)
}
class Upgrade {
	constructor(all) {
		if(all===undefined) {all={}};
		all.user!== undefined ? this.user = all.user : this.user = "game";
		all.stat!== undefined ? this.stat = all.stat : this.stat = undefined;
		all.base!== undefined ? this.base = all.base : this.stat = new Decimal(-1);
		all.flatScaling!== undefined ? this.flatScaling = all.flatScaling : this.flatScaling = new Decimal(0);
		all.scaling!==undefined ? this.scaling = all.scaling : scaling[this]!==undefined ? this.scaling = scaling[this] : this.scaling = new Decimal(1);
		this.bought = 0;
		all.maxLevel!== undefined ? this.maxLevel = all.maxLevel : this.maxLevel = -1;
		all.scalesWithXp!== undefined ? this.scalesWithXp = all.scalesWithXp : this.scalesWithXp = false;
	}
	get flatGain() {
		return this.flatScaling.times(this.bought);
	}
	get expoGain() {
		return this.scaling.toPower(this.bought);
	}
}
var upgrades = {
	dmg1: {
		user: "archer",
		stat: "dmg",
		base: new Decimal(8),
		flatScaling: new Decimal(0.64),
		maxLevel: 2500,
		scalesWithXp: true,
		tooltip: "Increases the archer's damage.",
		tooltipStatName: "Damage",
		buttonText: "+X damage",
		minEnemyLevel: 0
	},
	maxHp: {
		user: "knight",
		stat: "maxHp",
		base: new Decimal(2000),
		baseCost: new Decimal(15),
		flatScaling: new Decimal(110),
		scalesWithXp: true,
		tooltip: "Increases the knight's maximum health.",
		tooltipStatName: "Max Health",
		buttonText: "+X max health"
	},
	armor1: {
		user: "knight",
		stat: "armor",
		base: new Decimal(1),
		baseCost: new Decimal(25),
		flatScaling: new Decimal(0.003),
		maxLevel: 1500,
		tooltip: "Increases armor, which divides all incoming damage by itself.",
		tooltipStatName: "Armor",
		buttonText: "+X armor"
	},
	healUp: {
		user: "priest",
		stat: "power",
		base: new Decimal(500),
		baseCost: new Decimal(125),
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
		baseCost: new Decimal(200),
		flatScaling: new Decimal(10),
		baseCost: new Decimal(150),
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
		baseCost: new Decimal(500),
		costScaling: new Decimal(1.05),
		maxLevel: 100, //Caps at 5x attack speed
		tooltip: "Increases the archer's attack speed.",
		tooltipStatName: "Attacks per second",
		tooltipCalc: "calc(\"attackSpeed\", getStatUpgradesBought([\"archer\", \"attackSpeed\"])).div(1000)",
		buttonText: "+X attack speed",
		buttonCalc: "calc(\"attackSpeed\", upgrades.attackSpeed.bought+1).minus(calc(\"attackSpeed\", upgrades.attackSpeed.bought)).div(1000)"
	},
	healCost: {
		user: "priest",
		stat: "healCost",
		base: new Decimal(25),
		flatScaling: new Decimal(0.15),
		baseCost: new Decimal(1500),
		tooltip: "Makes healing cost less mana.",
		tooltipStatName: "Heal Cost",
		tooltipCalc: "calc(\"healCost\", upgrades.healCost.bought+1)",
		buttonText: "-X heal cost",
		buttonCalc: "calc(\"healCost\", upgrades.healCost.bought).minus(calc(\"healCost\", upgrades.healCost.bought+1))"
	},
	critChance: {
		user: "archer",
		stat: "critChance",
		base: new Decimal(0),
		flatScaling: new Decimal(1),
		baseCost: new Decimal(2500),
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
		baseCost: Decimal(25000),
		costScaling: scaling.critCost,
		maxLevel: 200,
		tooltip: "Gives a chance to block, dividing incoming damage. (base: 2)",
		tooltipStatName: "Block Chance",
		buttonText: "+X% block chance"
	},
	castSpeed1: {
		user: "priest",
		stat: "castSpeed",
		base: priest.baseCastSpeed,
		flatScaling: new Decimal(5),
		scaling: new Decimal(1.0174796921026863), //2x at level 40
		baseCost: new Decimal(100000),
		costScaling: new Decimal(1.075),
		maxLevel: 40, //800 -> 2000; 1.25s to 0.5s
		tooltip: "Decreases the amount of time spent casting, increasing healing speed.",
		tooltipStatName: "Cast Time",
		tooltipCalc: "Decimal(1).div(calc(\"castSpeed1\", upgrades.castSpeed1.bought+1).div(1000))",
		buttonText: "Xs cast time",
		buttonCalc: "Decimal(1000).div(calc(\"castSpeed1\", upgrades.castSpeed1.bought+1)).minus(Decimal(1000).div(calc(\"castSpeed1\", upgrades.castSpeed1.bought))).toNumber()"
	},
	priestCritChance: {
		user: "priest",
		stat: "critChance",
		base: new Decimal(0),
		flatScaling: new Decimal(1),
		scaling: scaling.crit,
		baseCost: Decimal(1e6),
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
		baseCost: Decimal(1e7),
		costScaling: new Decimal(1.07),
		maxLevel: 50,
		tooltip: "Regenerates a portion of maximum mana each second.",
		tooltipStatName: "Mana Regen",
		buttonText: "+0.04% mana regen"
	},
	critFactor1: {
		user: "archer",
		stat: "critFactor",
		base: new Decimal(2),
		flatScaling: new Decimal(0.04),
		costScaling: new Decimal(1.045), //a bit over 3 upgrades per enemy level
		maxLevel: 450, //20x, lasting 240 enemy levels.
		tooltip: "Increases the multiplication factor of crits.",
		tooltipStatName: "Crit Factor",
		buttonText: "+4% crit factor"
	},
	blockFactor1: {
		user: "knight",
		stat: "blockFactor",
		base: new Decimal(2),
		flatScaling: new Decimal(0.04),
		costScaling: new Decimal(1.045),
		maxLevel: 450, //20x, lasting 240 enemy levels
		tooltip: "Increases the division factor of blocks.",
		tooltipStatName: "Block Factor",
		buttonText: "+4% block factor"
	},
	corrosion: {
		user: "knight",
		stat: "corrosion",
		base: new Decimal(1),
		flatScaling: new Decimal(0.00125),
		costScaling: new Decimal(1.6),
		maxLevel: 10,
		tooltip: "Reduces the enemy's damage each time the knight is attacked.",
		tooltipStatName: "Corrosion Factor",
		tooltipCalc: "(calc(\"corrosion\", upgrades.corrosion.bought+1).minus(1)).times(100)",
		buttonText: "+0.125% corrosion"
	},
	learning: {
		user: "archer",
		stat: "learning",
		base: new Decimal(1),
		flatScaling: new Decimal(0.00035),
		costScaling: new Decimal(1.3),
		maxLevel: 25,
		tooltip: "Learn the monsters' weaknesses, decreasing their effective defense with each attack.",
		tooltipStatName: "Damage Growth",
		tooltipCalc: "(calc(\"learning\", upgrades.learning.bought+1).minus(1)).times(100)",
		buttonText: "+0.035% dmg growth"
	},
	critFactor2: {
		user: "archer",
		stat: "critFactor",
		flatScaling: new Decimal(0.1),
		costScaling: new Decimal(1.07), //2 upgrades per enemy level
		baseCost: new Decimal(1e17),
		maxLevel: 300, //50x, lasting 150 enemy levels.
		tooltip: "Further increase the multiplication factor of crits.",
		tooltipStatName: "Crit Factor",
		tooltipCalc: "archer.critFactor.plus(0.1)",
		buttonText: "+10% crit factor"
	},
	blockFactor2: {
		user: "knight",
		stat: "blockFactor",
		flatScaling: new Decimal(0.16666666666666667), // ;) Would rather have 75.000000001 than 74.999999999
		costScaling: new Decimal(1.07),
		baseCost: new Decimal(1e18),
		maxLevel: 330, //75x, lasting 165 enemy levels.
		tooltip: "Further increase division factor of blocks.",
		tooltipStatName: "Block Factor",
		tooltipCalc: "knight.blockFactor.plus(0.16666666666666667)",
		buttonText: "+16.6% block factor"
	},
	fireMagic: {
		user: "priest",
		stat: "fireMagic",
		base: new Decimal(0),
		flatScaling: new Decimal(1),
		costScaling: new Decimal(1.25), //1 upgrade every ~1.6 enemy levels
		maxLevel: 100, //100%, lasting 165 enemy levels.
		tooltip: "Melts enemies, increasing gold income but also increasing mana usage.",
		tooltipStatName: "Fire Magic Power",
		buttonText: "+1% fire magic power"
	},
	armor2: {
		user: "knight",
		stat: "armor",
		flatScaling: new Decimal(2500),
		baseCost: new Decimal(1e24),
		tooltip: "Increases armor, which divides all incoming damage by itself.",
		tooltipStatName: "Armor",
		buttonText: "+X armor"
	},
	critFactor3: {
		user: "archer",
		stat: "critFactor",
		flatScaling: new Decimal(0.25),
		costScaling: new Decimal(1.15), //1 upgrades per enemy level
		maxLevel: 200, //100x, lasting 200 enemy levels.
		baseCost: new Decimal(1e26),
		tooltip: "Reach maximum crit power.",
		tooltipStatName: "Crit Factor",
		tooltipCalc: "archer.critFactor.plus(0.25)",
		buttonText: "+25% crit factor"
	},
	blockFactor3: {
		user: "knight",
		stat: "blockFactor",
		flatScaling: new Decimal(0.5),
		costScaling: new Decimal(1.15),
		maxLevel: 150, //150x, lasting 150 enemy levels.
		baseCost: new Decimal(1e28),
		tooltip: "Reach maximum block power.",
		tooltipStatName: "Block Factor",
		tooltipCalc: "knight.blockFactor.plus(0.5)",
		buttonText: "+50% block factor"
	},
	castSpeed2: {
		user: "priest",
		stat: "castSpeed",
		flatScaling: new Decimal(10), //+2000
		maxLevel: 200, //2000 -> 4000; 0.5s to 0.25s
		baseCost: new Decimal(1e32),
		tooltip: "Decreases the time needed to cast, increasing healing.",
		tooltipStatName: "Cast Speed",
		tooltipCalc: "Decimal(1).div(calc(\"castSpeed2\", upgrades.castSpeed2.bought+1).div(1000))",
		buttonText: "Xs cast time",
		buttonCalc: "Decimal(1000).div(calc(\"castSpeed2\", upgrades.castSpeed2.bought+1)).minus(Decimal(1000).div(calc(\"castSpeed2\", upgrades.castSpeed2.bought))).toNumber()"
	},
	curse: {
		user: "priest",
		stat: "curse",
		base: new Decimal(0),
		flatScaling: new Decimal(2.5), //250% at level 100
		scaling: new Decimal(0.9903708200658815), //0.38x at level 100
		costScaling: new Decimal(1.1),
		maxLevel: 100, //roughly 140 enemy levels
		baseCost: new Decimal(1e34),
		tooltip: "Permanently curse all enemies, reducing their damage and defense.",
		tooltipStatName: "Curse Power",
		buttonText: "+X% curse power"
	},
	dmg2: {
		user: "archer",
		stat: "dmg",
		flatScaling: new Decimal(1e20),
		maxLevel: 5000,
		baseCost: new Decimal(1e38),
		tooltip: "Increases the archer's damage.",
		tooltipStatName: "Damage",
		buttonText: "+X damage"
	},
	milestone1: {
		user: "player",
		stat: "freePLvls",
		base: new Decimal(0),
		flatScaling: new Decimal(10),
		baseCost: new Decimal(2.5e11),
		maxLevel: 1,
		minEnemyLevel: 100,
		tooltip: "Gain 10 group levels, increasing max hp, heal power and dmg by roughly 10.4%.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+10 group levels"
	},
	milestone2: {
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(20),
		baseCost: new Decimal(3e16),
		maxLevel: 1,
		minEnemyLevel: 200,
		tooltip: "Gain 20 group levels, increasing primary stats by roughly 22%.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+20 group levels"
	},
	milestone3: {
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(30),
		baseCost: new Decimal(2e22),
		maxLevel: 1,
		minEnemyLevel: 300,
		tooltip: "Gain 30 group levels, increasing primary stats by roughly 34.8%.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+30 group levels"
	},
	milestone4: {
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(40),
		baseCost: new Decimal(1.5e29),
		maxLevel: 1,
		minEnemyLevel: 400,
		tooltip: "Gain 40 group levels, increasing primary stats by roughly 48.8%.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+40 group levels"
	},
	milestone5: {
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(50),
		baseCost: new Decimal(8.5e35),
		maxLevel: 1,
		minEnemyLevel: 500,
		tooltip: "Gain 50 group levels, increasing primary stats by roughly 64.5%.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+50 group levels"
	},
	milestone6: {
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(75),
		baseCost: new Decimal(4.8e52),
		minEnemyLevel: 750,
		maxLevel: 1,
		tooltip: "Gain 75 group levels - 110.9% primary stats.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+75 group levels"
	},
	milestone10: {
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(100),
		baseCost: new Decimal(1e96),
		minEnemyLevel: 1000,
		maxLevel: 1,
		tooltip: "Gain 100 group levels - 170.5% primary stats.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+100 group levels"
	}
}
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
		upgrades[i].minEnemyLevel = Math.ceil((upgradesKeys.indexOf(i)+1)**1.87);
	}
	if(upgrades[i].baseCost === undefined) {
		upgrades[i].baseCost=scaling.upCost.toPower(upgrades[i].minEnemyLevel*4);
	} else {
		upgrades[i].baseCost=Decimal(upgrades[i].baseCost).div(10);
	}
	if(upgrades[i].flatScaling === undefined) {
		upgrades[i].flatScaling = new Decimal(0);
	}
	if(upgrades[i].scaling === undefined) {
		if(scaling[i]===undefined) {
			upgrades[i].scaling=new Decimal(1);
		} else {
			upgrades[i].scaling = scaling[i];
		}
	}
	if(upgrades[i].base === undefined) {
		upgrades[i].base = new Decimal(-1);
	}
	if(upgrades[i].tooltipCalc === undefined) {
		upgrades[i].tooltipCalc = "calc(\""+i+"\", upgrades."+i+".bought+1)"
	}
	if(upgrades[i].buttonCalc === undefined) {
		upgrades[i].buttonCalc = "calc(\""+i+"\", upgrades."+i+".bought+1).minus(calc(\""+i+"\", upgrades."+i+".bought))";
	}
}
prev = 0;
for(var i = 0; i<upgradesKeys.length; i+=1) {
var curr = upgrades[upgradesKeys[i]].minEnemyLevel;
console.log(upgradesKeys[i]+": "+curr+", increase of "+(curr-prev));
var prev = curr;
}
statUpgrades = {player: {}, archer: {}, knight: {}, priest: {}};
for(var i in upgrades) {
	var user = upgrades[i].user;
	if(!statUpgrades[user].hasOwnProperty(upgrades[i].stat)) {
		statUpgrades[user][upgrades[i].stat] = new Array(i);
	} else {
		statUpgrades[user][upgrades[i].stat].push(i);
	}
}
//START
function gotoLevel(i) {
	i = Decimal(i);
	player.level = i;
	clearInterval(deathDelay);
	document.getElementById("pause").checked = false;
	if(i.gt(50)) { //General slowdown, and counter to crit/block factor upgrades giving a linearly increasing multiplier to damage and survivability.
		enemy.maxHp = enemy.baseMaxHp.times(1 + (i.minus(50)) * 0.05);
		enemy.dmg = enemy.baseDmg.times(1 + (i.minus(50)) * 0.0045);
		enemy.attackSpeed = Decimal(1000).plus(i.minus(50).times(3));
	} else {
		enemy.maxHp = enemy.baseMaxHp;
		enemy.dmg = enemy.baseDmg;
	}
	enemy.gold = (enemy.baseGold.times(scaling.enemyGold.toPower(i.minus(1))).times(1+upgrades.fireMagic.bought/100));
	if(i.lt(41)) { //gold multiplier that starts at 1x at the start, then grows to 2x at level 25, then fades back to 1x at level 50.
		enemy.gold = enemy.gold.times(1+(-((i-1)**2) + 50*(i-1))/625);
		console.log("Early gold multiplier of "+(1+(-((i-1)**2) + 50*(i-1))/625)+"x")
	}
	enemy.maxHp = enemy.maxHp.times(scaling.enemyMaxHp.toPower(i.minus(1)));
	enemy.dmg = enemy.dmg.times(scaling.enemyDmg.toPower(i.minus(1)));
	enemy.power = Decimal(1).times(100-priest.curse).div(100);
	enemy.xp = (Decimal(2).plus((i.minus(1)).times(0.5))).times(scaling.enemyExp.toPower(i.minus(1)));
	if(player.level.lt(player.maxLevel)) {enemy.xp = enemy.xp.times(Decimal(0.95).toPower(player.maxLevel.minus(1).minus(player.level)))};
	if(i.toNumber() % 10 === 0) {
		enemy.maxHp = enemy.maxHp.times(2);
		enemy.dmg = enemy.dmg.times(1.5);
	}
	enemy.hp = enemy.maxHp;
	enemy.armor = Decimal(1).times(100-priest.curse).div(100);
	knight.hp = knight.maxHp;
	priest.mana = priest.maxMana;
	enemy.attackReq = Decimal(0);
	archer.attackReq = Decimal(0);
	priest.castReq = Decimal(0);
	if(upgrades.corrosion.bought>0) {
		$("#enemyPower").text("Enemy Damage: "+format(Decimal(1).times(100-priest.curse))+"%");
	}
	if(upgrades.learning.bought>0) {
		$("#enemyDefense").text("Enemy Defense: "+format(Decimal(1).times(100-priest.curse))+"%");
	}
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
function calc(up, lvl) {
	var result;
	var target = upgrades[up];
	switch (up) {
		case "healCost":
			result = target.base.plus(target.flatScaling.times(target.bought)).times(target.scaling.toPower(lvl)).times(scaling.healUpMana.toPower(upgrades.healUp.bought)).times(1+upgrades.fireMagic.bought/100);
			break;
		default:
			var targetStatUpgrades = statUpgrades[target.user][target.stat];
			for(var i in targetStatUpgrades) {
				var tar = upgrades[targetStatUpgrades[i]];
				var providedLevel = lvl[i];
				if(!tar.base.eq(-1)) {
					result = tar.base.plus(tar.flatScaling.times(providedLevel)).times(tar.scaling.toPower(providedLevel));
				} else {
					result = result.plus(tar.flatScaling.times(providedLevel)).times(tar.scaling.toPower(providedLevel));
				}
			}
			break;
	}
	if(target.scalesWithXp) {
		result = result.times(scaling.xpPow.toPower(player.pLvl.plus(player.freePLvls).minus(1)))
	}
	return result;
}
function getStep(num) {
	num = Decimal(num);
	var result = 0;
	while(num.gte(1e3)) {
		num = num.dividedBy(1e3);
		result += 1;
	}
	if(num.lte(1e3) && num.gte(999)) {
		num=Decimal.floor(num);
	}
	return [result, num.toPrecision(3)];
}
function pause() {
	if(document.getElementById("pause").checked) {
		document.getElementById("pause").checked=false;
	} else {
		document.getElementById("pause").checked=true;
	}
}
function format(num, places, lowplaces) {
	var num = new Decimal(num);
	if(places===undefined) {places=3}
	if(lowplaces===undefined) {lowplaces=2}
	var result;
	var thing = [-1, 0];
	if(num.lt(1)) {
		result = num.toNumber().toPrecision(lowplaces);
	} else if(num.lt(1e3)) {
		if(num.gt(999)) {
			result = Decimal.floor(num).toNumber().toPrecision(places);
		} else {
			result = num.toNumber().toPrecision(places);
		}
		return result;
	} else {
		if(num.lt(DecInfinity)) { //Nothing works other than setting an upper limit. So I set it to 1e9e15
			var thing = getStep(Decimal(num));
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
				if(document.getElementById("scientific").checked) {
					result = num.toExponential(2).replace("+","");
				} else {
					result = thing[1] + exponents[Number(thing[0])-5];
				}
				break;
		}
	}
	return result;
}
function buyUpgrade(tar) {
	if(player.gold.gte(upgrades[tar].cost) && player.maxLevel.gt(upgrades[tar].minEnemyLevel)) {
		upgrades[tar].bought += buyBulk;
		player.gold = player.gold.minus(upgrades[tar].cost.times(calcBuyBulk(upgrades[tar].costScaling.minus(1), buyBulk)));
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
		if((target.bought<target.maxLevel || target.maxLevel===-1) && player.maxLevel.gt(target.minEnemyLevel)) {
			target.cost = Decimal(10).times(target.baseCost).times(1+target.bought*0.01).times(target.costScaling.toPower(target.bought));
		} else {
			target.cost = Decimal(Infinity);
			$("#"+i+"Button").css("display","none");
		}
		switch(i) {
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
		target.textContent = "\n" + format(upgrades[i].cost.times(calcBuyBulk(upgrades[i].costScaling.minus(1), buyBulk))) + " Gold";
		target = document.getElementById(i + "ButtonTooltip");
		switch(i) { //This is currently the only thing that can't be directly controlled from the upgrades object. Maybe fix that?
			case "attackSpeed": //Divided by 1e3
				target.textContent = upgrades[i].tooltip + "\n\n" + upgrades[i].tooltipStatName + ":\n" + format(window[upgrades[i].user][upgrades[i].stat].div(1e3)) + " -> " +format(eval(upgrades[i].tooltipCalc)) + "\n\nBought: "+upgrades[i].bought;
				break;
			case "castSpeed1":
			case "castSpeed2":
				target.textContent = upgrades[i].tooltip + "\n\n" + upgrades[i].tooltipStatName + ":\n" + format(Decimal(1).div(window[upgrades[i].user][upgrades[i].stat].div(1000))) + "s -> " +format(eval(upgrades[i].tooltipCalc)) + "s\n\nBought: "+upgrades[i].bought;
				break;
			case "critChance": 
			case "blockChance":
			case "priestCritChance":
			case "manaRegen":
			case "fireMagic": //Add % to end of tooltip
			case "curse":
				target.textContent = upgrades[i].tooltip + "\n\n" + upgrades[i].tooltipStatName + ":\n" + format(window[upgrades[i].user][upgrades[i].stat]) + "% -> " +format(eval(upgrades[i].tooltipCalc)) + "%\n\nBought: "+upgrades[i].bought;
				break;
			case "corrosion":
			case "learning": // (value-1)*100, precision (4,3)
				target.textContent = upgrades[i].tooltip + "\n\n" + upgrades[i].tooltipStatName + ":\n" + format((window[upgrades[i].user][upgrades[i].stat].minus(1)).times(100), 4, 3) + "% -> " +format(eval(upgrades[i].tooltipCalc), 4, 3) + "%\n\nBought: "+upgrades[i].bought;
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
		if(knight.hp.lte(knight.maxHp.minus(priest.power)) && priest.castReq.lt(0.001)) {
			priest.castReq=Decimal(0.001);
		}
		if(priest.castReq.gte(0.001) && priest.mana.gte(priest.healCost) && player.maxLevel.gte(15)) {
			priest.castReq=priest.castReq.plus(priest.castSpeed.div(player.fps));
		}
		if(priest.castReq.gte(1000)) {
			knight.hp=knight.hp.plus(priest.power);
			priest.mana=priest.mana.minus(priest.healCost)
			priest.castReq=Decimal(0);
		}
		while(enemy.attackReq.gte(1000)) {
			knight.hp = knight.hp.minus((enemy.dmg.times(enemy.power)).div(knight.armor));
			enemy.power=enemy.power.div(knight.corrosion);
			if(upgrades.corrosion.bought>0) {
				$("#enemyPower").text("Enemy Damage: "+format(enemy.power*100)+"%");
			}
			enemy.attackReq=enemy.attackReq.minus(1000);
		}
		while(archer.attackReq.gte(1000)) {
			enemy.hp = enemy.hp.minus(archer.dmg.div(enemy.armor));
			enemy.armor = enemy.armor.div(archer.learning);
			if(upgrades.learning.bought>0) {
				$("#enemyDefense").text("Enemy Defense: "+format(enemy.armor*100)+"%");
			}
			if(Random(0, 100) < archer.critChance) {
				enemy.hp = enemy.hp.minus(archer.dmg.times(archer.critFactor.minus(1)).times(enemy.armor))
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
var slowVisuals = false;
var buyBulk = 1;
function updateStatistic(name) {
	var tar = document.getElementById(name + "Statistics");
	tar.textContent = "";
	window[name+"Header"] = document.createElement("span");
	window[name+"Header"].textContent = (name.charAt(0).toUpperCase() + name.slice(1)) + " Stats";
	tar.appendChild(window[name+"Header"]);
	tar.appendChild(document.createElement("br"));
	var object = window[name];
	for(var a in object) {
		var elem = document.createElement("span");
		elem.textContent = a + ": " + format(object[a], 4, 3);
		tar.appendChild(elem);
		tar.appendChild(document.createElement("br"));
	}
}
function updateStatistics() {
	updateStatistic("player");
	updateStatistic("archer");
	updateStatistic("knight");
	updateStatistic("priest");
	updateStatistic("enemy");
}
function updateInactiveVisuals() {
	for(var i in upgrades) {
		if(upgrades[i].cost.times(calcBuyBulk(upgrades[i].costScaling.minus(1), buyBulk)).gt(player.gold)) {
			$("#"+i+"Button").css("background-color","#CC9999");
		} else {
			$("#"+i+"Button").css("background-color","#EEEEEE");
		}
	}
	player.fps = Decimal($("#fpsSlider")[0].value);
	slowVisuals = document.getElementById("slowVisuals").checked;
	if(slowVisuals) {
		player.visualFps = Decimal(1);
	} else {
		player.visualFps = player.fps;
	}
	$("#fpsCount").text("FPS: " + player.fps.toNumber());
	$("#visualFpsCount").text("Visual FPS: " + player.visualFps.toNumber());
	if(player.maxLevel.gte(5)) {
		$("#autoProgress, #autoProgressText, #buyEverythingButton").css("display", "inline");
	}
	showEnemyGold = document.getElementById("showEnemyGold").checked;
	if(showEnemyGold) {
		$("#gold").text(format(player.gold) + " \(" + format(enemy.gold) + "\)");
	} else {
		$("#gold").text(format(player.gold));
	}
	if(player.maxLevel.gt(upgrades.dmg1.minEnemyLevel)) {
		$("#archerUpgrades, #gold, #goldimg, .tabButton").css("display", "inline");
		$("#tab2Button").css("display", "none");
	}
	if(player.maxLevel.gt(upgrades.maxHp.minEnemyLevel)) {
		$("#knightUpgrades").css("display", "inline");
	}
	if(player.maxLevel.gt(upgrades.healUp.minEnemyLevel)) {
		$("#priestUpgrades").css("display", "inline");
	}
	if(player.maxLevel.gt(upgrades.milestone1.minEnemyLevel)) {
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
	$("#xpLevel").text("Group Level: "+player.pLvl.plus(player.freePLvls));
	updateStats();
	updateButtonText();
}
function updateVisuals() {
	$("#enemyHp").text(format(enemy.hp) + " / " + format(enemy.maxHp));
	$("#enemyHp").css({
		"width": ((enemy.hp.div(enemy.maxHp)) * 450)
	});
	$("#archerAttackBar").css({
		"width": ((archer.attackReq / 1000) * 450),
		"display": "inline"
	});
	if(player.maxLevel>=5) {
	$("#knightHp").text(format(knight.hp) + " / " + format(knight.maxHp));
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
	$("#mana").text(format(priest.mana) + " / " + format(priest.maxMana));
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
	for(var i in upgrades) {
		if(upgrades[i].maxLevel<upgrades[i].bought && upgrades[i].maxLevel>0) {
			upgrades[i].bought=upgrades[i].maxLevel;
		}
	}
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
		case "d":
		case "D":
			updateStatistics();
			document.getElementById("tab2Button").click();
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
	prefsSave.push(slowVisuals);
	prefsSave.push(showEnemyGold);
	prefsSave.push(scientific.checked);
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
	document.getElementById("slowVisuals").checked=prefs[1];
	document.getElementById("showEnemyGold").checked=prefs[2];
	document.getElementById("scientific").checked=prefs[3];
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
document.title = "Level " + player.level;
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
	document.title = "Level " + player.level;
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
function getDPS() {
	if(archer.critChance.gte(100)) {
		return archer.dmg.times(archer.attackSpeed).div(1e3).times(archer.critFactor);
	} else { //I'll add crit chance some other time, okay? The biggest effect it can have is a 49% reduction in output, since you'll have to sit at 99% crit chance.
		return archer.dmg.times(archer.attackSpeed).div(1e3);
	}
}
var timeSum = 0;
function timeDecay(x) {
	var result = (x*5.8)**0.7; //anything <= to 1 minute is 100%, 6 minutes = 58.5%, 60 minutes = 29.3%, 600 minutes = 14.7%, 6000 minutes = 7.4%
	if(result/x>1) {result = x}; //Offline progress is nice and all but for this game I feel it can ruin the experience when you return to a mound of gold appropriate for someone 20 levels above you.
	return result; //so now, 10x more time = 5x more gold(when offline).
}
setInterval(function() {
	if(timeSum>15 && document.getElementById("offlineProgressWrapper").style.display=="inline") {
		document.title = format(gain) + " unclaimed gold";
	} else {
		document.title = "Level " + player.level;
	}
	newTime = Decimal(Date.parse(Date())/1000).minus(1);
	timePassed = newTime-player.lastTime;
	offlineKills = getDPS().div(enemy.maxHp).times(timeDecay(timePassed));
	gain = (enemy.gold.times(offlineKills));
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
if(localStorage.preferences===undefined) {
	document.getElementById("slowVisuals").checked=false;
	document.getElementById("showEnemyGold").checked=false;
	document.getElementById("scientifc").checked=false;
}