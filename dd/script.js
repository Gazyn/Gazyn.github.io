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
for(var a=0; a<26; a+=1) {
	var letter = letters[a];
	for(var b=0; b<26; b+=1) {
		var letter2 = letters[b];
		for(var c=0; c<26; c+=1) {
			var letter3 = letters[c];
			for(var d=0; d<26; d+=1) {
				exponents.push(letter+letter2+letter3+letters[d]);
			}
		}
	}
}
function Random(min, max) {
	return Math.random() * (max - min) + min;
} //Random with a range!
function calcBuyBulk(f, n) { //f is factor - 20% increase is 0.2. n is amount
	return (Decimal(1).plus(f)).toPower(n).minus(1).div(f);
}
function getStatUpgradesBought(nametemp, provLvl) { //nametemp will either be name of upgrade or an array containing user and stat
	var result = new Array();
	var name = new Array();
	nametemp.constructor === Array ? name = nametemp : name = [upgrades[nametemp].user, upgrades[nametemp].stat]; //make array name with [user, stat] if it doesn't exist
	var statUpgradesStat = statUpgrades[name[0]][name[1]];
	for(var i in statUpgradesStat) {
		if(statUpgradesStat[i] === nametemp && provLvl !== undefined) {
			result.push(upgrades[statUpgradesStat[i]].bought+provLvl)
		} else {
			result.push(upgrades[statUpgradesStat[i]].bought);
		}
	}
	return result;
}
var DecInfinity = new Decimal("1e"+Decimal.maxE);
var scaling = { //Scalings must be decimals so effect=effect.times(scaling.toPower(n)) isn't undefined.
	upCost: new Decimal(1.0405),
	dmg1: new Decimal(1.0169),
	dmg2: new Decimal(1.0167),
	dmg3: new Decimal(1.01725),
	dmg4: new Decimal(1.0178025),
	dmg5: new Decimal(1.019), //every new dmg upgrade gets ~2x damage for every 2000 upgrades bought
	dmg6: new Decimal(1.02),
	maxHp1: new Decimal(1.0112),
	maxHp2: new Decimal(1.0115),
	armor1: new Decimal(1.0075),
	armor2: new Decimal(1.0085),
	healUp1: new Decimal(1.01095),
	healUp2: new Decimal(1.0115),
	healCost: new Decimal(0.99), 
	maxMana: new Decimal(1.0098), //1.0098/0.99 = effectively 1.02 times more mana per upgrade
	healUpMana: new Decimal(1.02035), //  <:
	enemyMaxHp: new Decimal(1.09175),
	enemyDmg: new Decimal(1.1105),
	enemyGoldBase: new Decimal(1.2), //This gets raised to a power of X, where X=1+(log(zone)/log(enemyGoldZoneLog))/enemyGoldScaling
	enemyGoldZoneLog: 2.5, //These names are ridiculous. Acts as the base of the logarithm set on your zone when determining enemy gold scaling.
	enemyGoldScaling: new Decimal(125), //This acts as a division factor to the result of the logarithm set on zone with the above value as base.
	enemyExp: new Decimal(1.025),
	expPow: new Decimal(1.02),
	expReq: new Decimal(1.12)
}
scaling.enemyGold=scaling.enemyGoldBase;
var enemybalancefactor = 1.23; //0.01 = ~2x at zone 560
var levelscalebackfactor = 0.85;
scaling.enemyMaxHp=scaling.enemyMaxHp.toPower(enemybalancefactor);
scaling.enemyDmg=scaling.enemyDmg.toPower(enemybalancefactor);
scaling.enemyMaxHp=scaling.enemyMaxHp.toPower(levelscalebackfactor);
scaling.enemyDmg=scaling.enemyDmg.toPower(levelscalebackfactor);
scaling.enemyGoldBase=scaling.enemyGoldBase.toPower(levelscalebackfactor);
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
	exp: new Decimal(0),
	expReq: new Decimal(100),
	pLvl: new Decimal(1),
	freePLvls: new Decimal(0),
	lastTime: new Decimal(Date.parse(Date())/1000),
	skillPoints: new Decimal(0),
	skillPointsUsed: new Decimal(0)
}
var prefs = ["30", "30", false, false];
var archer = {
	attackReq: new Decimal(0),
	baseAttackSpeed: new Decimal(1)
};
var knight = {};
var priest = {
	castReq: new Decimal(0),
	baseCastSpeed: new Decimal(0.8)
};
var enemy = {
	baseDmg: new Decimal(75),
	baseMaxHp: new Decimal(250),
	baseGold: new Decimal(10),
	armor: new Decimal(1),
	exp: new Decimal(2),
	attackReq: new Decimal(0),
	attackSpeed: new Decimal(1)
}
class Upgrade {
	constructor(all) {
		for(var i in all) {
			this[i]=all[i];
		}
		this.bought === undefined ? this.bought = 0 : this.bought = all.bought; //as if this is ever gonna be predefined lol
		this.maxLevel === undefined ? this.maxLevel = -1 : this.maxLevel = all.maxLevel;
		this.flatScaling === undefined ? this.flatScaling = new Decimal(0) : this.flatScaling = all.flatScaling;
		this.costScaling === undefined ? this.costScaling = scaling.upCost : this.costScaling = all.costScaling;
		this.base === undefined ? this.base = new Decimal(-1) : this.base = all.base;
		this.displayPercentage === undefined ? this.displayPercentage = false : this.displayPercentage = all.displayPercentage;
		this.upgradeUnlocker === undefined ? this.upgradeUnlocker = false : this.upgradeUnlocker = all.upgradeUnlocker;
		this.requiredUpgrade === undefined ? this.requiredUpgrade = "none" : this.requiredUpgrade = all.requiredUpgrade;
		this.flatGain = function(lvl) {
		if(lvl===undefined) {lvl=this.bought};
			return this.flatScaling.times(lvl);
		}
		this.expoGain = function(lvl) {
			if(lvl===undefined) {lvl=this.bought};
			return this.scaling.toPower(lvl);
		}
		this.tooltipCalc = "if(upgrades[i].maxLevel-upgrades[i].bought<buyBulk && upgrades[i].maxLevel!==-1) {calc(i, getStatUpgradesBought(i, upgrades[i].maxLevel-upgrades[i].bought))} else {calc(i, getStatUpgradesBought(i, buyBulk))}"
		this.buttonCalc = function(i) {
			var result;
			var tar = upgrades[i];
			if(tar.maxLevel-tar.bought<buyBulk && tar.maxLevel!==-1) {
				result = calc(i, getStatUpgradesBought(i, tar.maxLevel-tar.bought)).minus(calc(i));
			} else {
				result = calc(i, getStatUpgradesBought(i, buyBulk)).minus(calc(i));
			}
			return result;
		}
	}
}
function thing(text, i) {
	thing = new Array();
	for(var i = 1; i<2**21; i*=2) {
		thing.push({
			level: i,
			scaling: scaling.enemyGoldBase.toPower(Decimal(1).plus(Decimal(i).log(scaling.enemyGoldZoneLog).div(scaling.enemyGoldScaling))).toPrecision(4)
		});
	};
	console.table(thing);
}
var upgrades = {
	dmg1: new Upgrade({
		user: "archer",
		stat: "dmg",
		base: new Decimal(15),
		flatScaling: new Decimal(0.855),
		maxLevel: 2500,
		tooltip: "Increases the archer's damage.",
		tooltipStatName: "Damage",
		buttonText: "+X damage",
		minEnemyLevel: 0
	}),
	maxHp1: new Upgrade({
		user: "knight",
		stat: "maxHp",
		base: new Decimal(2500),
		baseCost: new Decimal(15),
		flatScaling: new Decimal(125),
		maxLevel: 10000,
		tooltip: "Increases the knight's maximum health.",
		tooltipStatName: "Max Health",
		buttonText: "+X max health"
	}),
	armor1: new Upgrade({
		user: "knight",
		stat: "armor",
		base: new Decimal(1),
		baseCost: new Decimal(25),
		flatScaling: new Decimal(0.003),
		costScaling: scaling.upCost.toPower(0.99),
		maxLevel: 2000,
		tooltip: "Increases armor, reducing all incoming damage.",
		tooltipStatName: "Armor",
		buttonText: "+X armor"
	}),
	healUp1: new Upgrade({
		user: "priest",
		stat: "power",
		base: new Decimal(600),
		baseCost: new Decimal(75),
		flatScaling: new Decimal(35),
		maxLevel: 9954,
		tooltip: "Increases the power of healing at the cost of increased mana usage.",
		tooltipStatName: "Heal Power",
		buttonText: "+X heal power"
	}),
	maxMana: new Upgrade({
		user: "priest",
		stat: "maxMana",
		base: new Decimal(200),
		flatScaling: new Decimal(9),
		baseCost: new Decimal(100),
		tooltip: "Increases maximum mana.",
		tooltipStatName: "Max Mana",
		buttonText: "+X max mana"
	}),
	healCost: new Upgrade({
		user: "priest",
		stat: "healCost",
		base: new Decimal(29.999),
		flatScaling: new Decimal(0.2),
		baseCost: new Decimal(1000),
		tooltip: "Makes healing cost less mana.",
		tooltipStatName: "Heal Cost",
		buttonText: "X heal cost",
	}),
	attackSpeed1: new Upgrade({
		user: "archer",
		stat: "attackSpeed",
		base: archer.baseAttackSpeed,
		flatScaling: new Decimal(0.015),
		scaling: new Decimal(1.006955550056719),
		baseCost: new Decimal(400),
		costScaling: new Decimal(1.1),
		maxLevel: 100, //Caps at 5x attack speed
		tooltip: "Increases the archer's attack speed.",
		tooltipStatName: "Attacks per second",
		buttonText: "+X attacks/s",
	}),
	critChance1: new Upgrade({
		user: "archer",
		stat: "critChance",
		base: new Decimal(0),
		flatScaling: new Decimal(1),
		baseCost: new Decimal(5000),
		costScaling: new Decimal(1.07),
		maxLevel: 100,
		tooltip: "Gives a chance to crit, multiplying damage.\n(base factor: 2x)",
		tooltipStatName: "Crit Chance",
		buttonText: "+X% crit chance",
		displayPercentage: true
	}),
	blockChance1: new Upgrade({
		user: "knight",
		stat: "blockChance",
		base: new Decimal(0),
		flatScaling: new Decimal(1),
		baseCost: Decimal(25000),
		costScaling: new Decimal(1.07),
		maxLevel: 100,
		tooltip: "Gives a chance to block, dividing incoming damage.\n(base factor: 2)",
		tooltipStatName: "Block Chance",
		buttonText: "+X% block chance",
		displayPercentage: true
	}),
	castSpeed1: new Upgrade({
		user: "priest",
		stat: "castSpeed",
		base: priest.baseCastSpeed,
		flatScaling: new Decimal(0.2/40),
		scaling: new Decimal(2**(1/40)),
		baseCost: new Decimal(500000),
		costScaling: new Decimal(1.09),
		maxLevel: 40, //0.8 -> 2; 1.25s to 0.5s
		tooltip: "Decreases the amount of time spent casting, increasing healing speed.",
		tooltipStatName: "Casts per second",
		buttonText: "+X casts/s"
	}),
	priestCritChance: new Upgrade({
		user: "priest",
		stat: "critChance",
		base: new Decimal(0),
		flatScaling: new Decimal(1),
		baseCost: Decimal(7.5e6),
		costScaling: new Decimal(1.03),
		scaling: new Decimal(0.5**(1/200)),
		maxLevel: 200,
		tooltip: "Gives a chance to crit, doubling healing.",
		tooltipStatName: "Crit Chance",
		buttonText: "+X% crit chance",
		displayPercentage: true
	}),
	manaRegen: new Upgrade({
		user: "priest",
		stat: "manaRegen",
		base: Decimal(0),
		flatScaling: Decimal(0.04),
		baseCost: Decimal(1e8),
		costScaling: new Decimal(1.08),
		maxLevel: 50,
		tooltip: "Regenerates a portion of maximum mana each second.",
		tooltipStatName: "Mana Regen",
		buttonText: "+0.04% mana regen",
		displayPercentage: true
	}),
	critChance2: new Upgrade({
		user: "archer",
		stat: "critChance",
		flatScaling: new Decimal(0.8),
		baseCost: new Decimal(1e10),
		costScaling: new Decimal(1.085),
		maxLevel: 125,
		tooltip: "Increases the chance to crit. Exceeding 100% will give a chance to crit twice.",
		tooltipStatName: "Crit Chance",
		buttonText: "+X% crit chance",
		displayPercentage: true
	}),
	blockChance2: new Upgrade({
		user: "knight",
		stat: "blockChance",
		flatScaling: new Decimal(0.8),
		costScaling: new Decimal(1.085),
		maxLevel: 125,
		tooltip: "Increases the chance to crit. Exceeding 100% will give a chance to block twice.",
		tooltipStatName: "Block Chance",
		buttonText: "+X% block chance",
		displayPercentage: true
	}),
	corrosion: new Upgrade({
		user: "knight",
		stat: "corrosion",
		base: new Decimal(0),
		flatScaling: new Decimal(0.09),
		baseCost: new Decimal(1e12),
		costScaling: new Decimal(1.4),
		maxLevel: 25,
		tooltip: "Reduces the enemy's damage each second spent in combat.",
		tooltipStatName: "Corrosion Factor",
		buttonText: "+0.09% corrosion",
		displayPercentage: true
	}),
	learning: new Upgrade({
		user: "archer",
		stat: "learning",
		base: new Decimal(0),
		flatScaling: new Decimal(0.075),
		scaling: new Decimal(1.25**(1/20)),
		baseCost: new Decimal(1e12*(1.4**8)),
		costScaling: new Decimal(1.4),
		maxLevel: 20,
		tooltip: "Learn the monsters' weaknesses, increasing the archer's damage each second spent in combat.",
		tooltipStatName: "Damage Growth",
		buttonText: "+X% dmg growth",
		displayPercentage: true
	}),
	critChance3: new Upgrade({
		user: "archer",
		stat: "critChance",
		flatScaling: new Decimal(0.5),
		costScaling: new Decimal(1.075),
		baseCost: new Decimal(1e15),
		maxLevel: 200,
		tooltip: "Increases the chance to crit. Exceeding 200% will give a chance to crit thrice.",
		tooltipStatName: "Crit Chance",
		buttonText: "+0.5% crit chance",
		displayPercentage: true
	}),
	fireMagic: new Upgrade({
		user: "priest",
		stat: "fireMagic",
		base: new Decimal(0),
		flatScaling: new Decimal(3),
		baseCost: new Decimal(2e16),
		costScaling: new Decimal(1.175),
		maxLevel: 100,
		tooltip: "Melts enemies, increasing gold income but also increasing mana usage.",
		tooltipStatName: "Bonus Gold",
		buttonText: "+3% gold, +1% mana cost",
		displayPercentage: true
	}),
	castSpeed2: new Upgrade({
		user: "priest",
		stat: "castSpeed",
		flatScaling: new Decimal(0.008), //+1
		scaling: new Decimal((5/3)**(1/125)), //1.66x, 3 -> 5
		costScaling: new Decimal(1.075),
		maxLevel: 125, //2 -> 5; 0.5s to 0.2s
		baseCost: new Decimal(5e17),
		tooltip: "Decreases the amount of time spent casting, increasing healing speed.",
		tooltipStatName: "Casts per second",
		buttonText: "+X casts/s"
	}),
	critFactor: new Upgrade({
		user: "archer",
		stat: "critFactor",
		base: new Decimal(2),
		flatScaling: new Decimal(0.02),
		scaling: new Decimal((10/22)**(1/1000)),
		costScaling: new Decimal(10),
		maxLevel: 1000,
		baseCost: new Decimal(2.5e19),
		tooltip: "Increase the multiplication factor of crits. Stacks with multiple simultaneous crits.",
		tooltipStatName: "Crit Factor",
		buttonText: "+X crit factor",
	}),
	blockFactor: new Upgrade({
		user: "knight",
		stat: "blockFactor",
		base: new Decimal(2),
		flatScaling: new Decimal(0.02),
		scaling: new Decimal((10/22)**(1/1000)),
		costScaling: new Decimal(9.5),
		maxLevel: 1000,
		baseCost: new Decimal(2.5e19),
		tooltip: "Increase the division factor of blocks. Stacks with multiple simultaneous blocks.",
		tooltipStatName: "Block Factor",
		buttonText: "+X block factor"
	}),
	manaPotion: new Upgrade({
		user: "priest",
		stat: "manaPotionStrength",
		base: new Decimal(0),
		flatScaling: new Decimal(2),
		costScaling: new Decimal(1.5),
		maxLevel: 25,
		baseCost: new Decimal(1e26),
		tooltip: "When falling below 25% mana for the first time, restore a portion of your max mana.",
		tooltipStatName: "Mana Potion Potency",
		buttonText: "+X% mana restored",
		displayPercentage: true
	}),
	dmg2: new Upgrade({
		user: "archer",
		stat: "dmg",
		flatScaling: new Decimal(1e19),
		maxLevel: 5000,
		minEnemyLevel: 580,
		baseCost: new Decimal(1e46),
		tooltip: "Increases the archer's damage.",
		tooltipStatName: "Damage",
		buttonText: "+X damage"
	}),
	attackSpeed2: new Upgrade({
		user: "archer",
		stat: "attackSpeed",
		flatScaling: new Decimal(0.025),
		maxLevel: 200,
		minEnemyLevel: 2500,
		baseCost: new Decimal(1e1000),
		costScaling: new Decimal(1.125),
		tooltip: "Increases the archer's attack speed.",
		tooltipStatName: "Attacks per second",
		buttonText: "+X attacks/s"
	}),
	attackSpeed3: new Upgrade({
		user: "archer",
		stat: "attackSpeed",
		flatScaling: new Decimal(0.075),
		maxLevel: 200,
		minEnemyLevel: 3000,
		baseCost: new Decimal(1e1000),
		costScaling: new Decimal(1.15),
		tooltip: "Increases the archer's attack speed.",
		tooltipStatName: "Attacks per second",
		buttonText: "+X attacks/s"
	}),
	passiveExp1: new Upgrade({
		user: "player",
		stat: "passiveExp",
		base: new Decimal(0),
		flatScaling: new Decimal(1),
		scaling: new Decimal(5**(1/200)),
		maxLevel: 200, //1000%
		minEnemyLevel: 75,
		costScaling: new Decimal(1e7**(1/200)), //Maxed shortly before zone 300
		baseCost: new Decimal(5e6),
		tooltip: "Passively gain exp based on your current enemy.",
		tooltipStatName: "Passive EXP",
		buttonText: "+X% exp/s",
		displayPercentage: true
	}),
	goldBonus: new Upgrade({
		user: "player",
		stat: "goldBonus",
		base: new Decimal(100),
		flatScaling: new Decimal(6.6), //goes up to 1e4% base
		scaling: new Decimal(9.99e10**(1/1500)), //multiplies that 1e4 by 1e10, going up to 100T%
		costScaling: new Decimal(2**(1/3)), //6e225 total cost increase
		minEnemyLevel: 125,
		maxLevel: 1500, //This upgrade won't be maxed for a loooong time.
		baseCost: new Decimal(2.5e10),
		tooltip: "Increase gold dropped by all enemies.",
		tooltipStatName: "Gold",
		buttonText: "+X% gold",
		displayPercentage: true
	}),
	skillsUnlock: new Upgrade({
		user: "player",
		stat: "skillsUnlocked",
		base: new Decimal(0),
		flatScaling: new Decimal(1),
		minEnemyLevel: 500,
		maxLevel: 1,
		baseCost: new Decimal(1e45),
		tooltip: "Unlocks the skill tree. You get a skill point every 500 zones.",
		buttonText: "Unlock skills",
		upgradeUnlocker: true
	}),
	autoBuyUnlock: new Upgrade({
		user: "player",
		stat: "autoBuyUnlocked",
		base: new Decimal(0),
		flatScaling: new Decimal(1),
		baseCost: new Decimal(1e42),
		minEnemyLevel: 500,
		maxLevel: 1,
		tooltip: "Unlocks autobuying, which will buy the cheapest upgrade every 10 seconds.",
		buttonText: "Unlock autobuying",
		upgradeUnlocker: true
	}),
	autoBuyFrequency: new Upgrade({
		user: "player",
		stat: "autoBuyFrequency",
		base: new Decimal(5),
		scaling: new Decimal(0.04**(1/100)),
		baseCost: new Decimal(1e43),
		costScaling: new Decimal(10**0.5),
		requiredUpgrade: "autoBuyUnlock",
		minEnemyLevel: 0,
		maxLevel: 100,
		tooltip: "Increases the frequency of autobuying.",
		tooltipStatName: "Autobuy delay",
		buttonText: "Xs autobuy delay"
	}),
	blockChance3: new Upgrade({
		user: "knight",
		stat: "blockChance",
		flatScaling: new Decimal(0.5),
		costScaling: new Decimal(1.075),
		baseCost: new Decimal(1e15),
		minEnemyLevel: 185,
		maxLevel: 200,
		tooltip: "Increases the chance to crit. Exceeding 200% will give a chance to block thrice.",
		tooltipStatName: "Block Chance",
		buttonText: "+0.5% block chance",
		displayPercentage: true
	}),
	blessing: new Upgrade({
		user: "knight",
		stat: "maxHp",
		scaling: new Decimal(3),
		maxLevel: 1,
		minEnemyLevel: 250,
		baseCost: new Decimal(1e22),
		costScaling: new Decimal(1e15),
		tooltip: "Receive a blessing, tripling the knight's maximum health, the priest's heal power and max mana.",
		tooltipStatName: "Max Health",
		buttonText: "+X max health"
	}),
	cripplingShot: new Upgrade({
		user: "archer",
		stat: "cripple",
		base: new Decimal(100),
		baseCost: new Decimal(5e25),
		scaling: new Decimal(0.25**(1/250)),
		maxLevel: 250,
		minEnemyLevel: 300,
		costScaling: new Decimal(1.095),
		tooltip: "Cripple bosses, lowering their stats.",
		tooltipStatName: "Boss Power",
		buttonText: "X% boss power",
		displayPercentage: true
	}),
	armor2: new Upgrade({
		user: "knight",
		stat: "armor",
		flatScaling: new Decimal(3.07e5),
		baseCost: new Decimal(5e37),
		minEnemyLevel: 460,
		tooltip: "Increases armor, reducing all incoming damage.",
		tooltipStatName: "Armor",
		buttonText: "+X armor"
	}),
	curse: new Upgrade({
		user: "priest",
		stat: "curse",
		base: new Decimal(100),
		scaling: new Decimal(0.00001**(1/1000)), //~1.11% per upgrade. at cap, enemies have a 99.999% reduction
		costScaling: new Decimal(1.25), //1e130 total cost
		minEnemyLevel: 400,
		maxLevel: 1000,
		baseCost: new Decimal(1e33),
		tooltip: "Permanently curse all enemies, reducing their damage and defense.",
		tooltipStatName: "Enemy Power",
		buttonText: "X% enemy power",
		displayPercentage: true
	}),
	slow: new Upgrade({
		user: "priest",
		stat: "slow",
		base: new Decimal(100),
		scaling: new Decimal(0.35**(1/150)), //~0.7% per upgrade. at cap, enemies have 75% reduction in attack speed
		costScaling: new Decimal(1.3),
		minEnemyLevel: 1000,
		maxLevel: 150, //roughly 240 zones.
		baseCost: new Decimal(1.5e80),
		tooltip: "Chill enemies, reducing their attack speed.",
		tooltipStatName: "Enemy attack speed",
		buttonText: "X% enemy attack speed",
		displayPercentage: true
	}),
	dmg3: new Upgrade({
		user: "archer",
		stat: "dmg",
		costScaling: new Decimal(1.042),
		flatScaling: new Decimal(7.5e52),
		baseCost: new Decimal(1e125),
		minEnemyLevel: 1500,
		maxLevel: 2000,
		tooltip: "Increases the archer's damage.",
		tooltipStatName: "Damage",
		buttonText: "+X damage"
	}),
	passiveExp2: new Upgrade({
		user: "player",
		stat: "passiveExp",
		flatScaling: new Decimal(50),
		scaling: new Decimal(10**(1/180)),
		baseCost: new Decimal(1e144),
		maxLevel: 180, //100000%
		minEnemyLevel: 1750,
		costScaling: new Decimal(1.11), //Maxed shortly before zone 1920
		tooltip: "Passively gain exp based on your current enemy.",
		tooltipStatName: "Passive EXP",
		buttonText: "+X% exp/s",
		displayPercentage: true
	}),
	dmg4: new Upgrade({
		user: "archer",
		stat: "dmg",
		flatScaling: new Decimal(1e70),
		baseCost: new Decimal(1.5e162),
		minEnemyLevel: 2000,
		tooltip: "Increases the archer's damage.",
		tooltipStatName: "Damage",
		buttonText: "+X damage"
	}),
	maxHp2: new Upgrade({
		user: "knight",
		stat: "maxHp",
		flatScaling: new Decimal(1.5e52),
		baseCost: new Decimal(1e176),
		minEnemyLevel: 2160,
		tooltip: "Increases the knight's maximum health.",
		tooltipStatName: "Max Health",
		buttonText: "+X max health"
	}),
	healUp2: new Upgrade({
		user: "priest",
		stat: "power",
		flatScaling: new Decimal(7e50),
		baseCost: new Decimal(1e176),
		minEnemyLevel: 2160,
		tooltip: "Increases the power of healing at the cost of increased mana usage.",
		tooltipStatName: "Heal Power",
		buttonText: "+X heal power"
	}),
	passiveExp3: new Upgrade({
		user: "player",
		stat: "passiveExp",
		flatScaling: new Decimal(1e4), //base is 1e5
		scaling: new Decimal(4000**(1/240)),
		baseCost: new Decimal(1e181),
		costScaling: new Decimal(1.125),
		minEnemyLevel: 2222,
		maxLevel: 240,
		tooltip: "Passively gain exp based on your current enemy.",
		tooltipStatName: "Passive EXP",
		buttonText: "+X% exp/s",
		displayPercentage: true
	}),
	milestone1: new Upgrade({
		user: "player",
		stat: "freePLvls",
		base: new Decimal(0),
		flatScaling: new Decimal(5),
		baseCost: new Decimal(1e10),
		maxLevel: 1,
		minEnemyLevel: 100,
		tooltip: "Gain 5 group levels, increasing max hp, heal power and dmg by 10.4%.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+5 group levels"
	}),
	milestone2: new Upgrade({
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(10),
		baseCost: new Decimal(2.5e17),
		maxLevel: 1,
		minEnemyLevel: 200,
		tooltip: "Gain 10 group levels, increasing primary stats by 21.9%.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+10 group levels"
	}),
	milestone3: new Upgrade({
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(15),
		baseCost: new Decimal(2e26),
		maxLevel: 1,
		minEnemyLevel: 300,
		tooltip: "Gain 15 group levels, increasing primary stats by 34.6%.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+15 group levels"
	}),
	milestone4: new Upgrade({
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(20),
		baseCost: new Decimal(2.5e34),
		maxLevel: 1,
		minEnemyLevel: 400,
		tooltip: "Gain 20 group levels, increasing primary stats by 48.6%.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+20 group levels"
	}),
	milestone5: new Upgrade({
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(25),
		baseCost: new Decimal(1e43),
		maxLevel: 1,
		minEnemyLevel: 500,
		tooltip: "Gain 25 group levels, increasing primary stats by 64.1%.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+25 group levels"
	}),
	milestone6: new Upgrade({
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(30),
		baseCost: new Decimal(1e62),
		minEnemyLevel: 750,
		maxLevel: 1,
		tooltip: "Gain 30 group levels - +81.1% primary stats.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+30 group levels"
	}),
	milestone7: new Upgrade({
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(35),
		baseCost: new Decimal(1e82),
		minEnemyLevel: 1000,
		maxLevel: 1,
		tooltip: "Gain 35 group levels - +100% primary stats.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+35 group levels"
	}),
	milestone8: new Upgrade({
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(40),
		baseCost: new Decimal(1e123),
		minEnemyLevel: 1500,
		maxLevel: 1,
		tooltip: "Gain 40 group levels - +121% primary stats.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+40 group levels"
	}),
	milestone9: new Upgrade({
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(45),
		baseCost: new Decimal(5e163),
		minEnemyLevel: 2000,
		maxLevel: 1,
		tooltip: "Gain 45 group levels - +144% primary stats.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+45 group levels"
	}),
	milestone10: new Upgrade({
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(50),
		baseCost: new Decimal(2e230),
		minEnemyLevel: 3000,
		maxLevel: 1,
		tooltip: "Gain 50 group levels - +169% primary stats.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+50 group levels"
	})
}
var upgradesKeys = Object.keys(upgrades);
for(var i in upgrades) {
	if(upgrades[i].minEnemyLevel === undefined) {
		if(upgradesKeys.indexOf(i)<6) {
			upgrades[i].minEnemyLevel = (upgradesKeys.indexOf(i)+1)*5
		} else if(upgradesKeys.indexOf(i)<20) {
			upgrades[i].minEnemyLevel = Math.ceil((upgradesKeys.indexOf(i)+3)**1.77);
		} else {
			upgrades[i].minEnemyLevel = Math.ceil((upgradesKeys.indexOf(i)+4)**(1.77+upgradesKeys.indexOf(i)*0.01-0.2));
		}
		upgrades[i].minEnemyLevel=Math.round(upgrades[i].minEnemyLevel/5)*5;
	}
	if(upgrades[i].baseCost === undefined) {
		upgrades[i].baseCost=scaling.upCost.toPower(upgrades[i].minEnemyLevel*4);
	} else {
		upgrades[i].baseCost=Decimal(upgrades[i].baseCost).div(10);
	}
	if(upgrades[i].scaling === undefined) {
		if(scaling[i]===undefined) {
			upgrades[i].scaling=new Decimal(1);
		} else {
			upgrades[i].scaling = scaling[i];
		}
	}
}
prev = 0;
for(var i = 0; i<upgradesKeys.length; i+=1) {
	var curr = upgrades[upgradesKeys[i]].minEnemyLevel;
	if(i<20) {
		console.log("Index "+i+" "+upgradesKeys[i]+": "+curr+", increase of "+(curr-prev)+", exponent is 1.77");
	} else {
		console.log("Index "+i+" "+upgradesKeys[i]+": "+curr+", increase of "+(curr-prev)+", exponent is "+Math.round((1.77+(i-20)*0.01)*100)/100);
	}
	var prev = curr;
}
var skills = {
	autoBuyUnlock: {
		path: 1,
		position: 1,
		baseCost: new Decimal(1),
		level: 0,
		maxLevel: 1,
		skillPointsUsed: new Decimal(0),
		tooltip: "Unlocks autobuying, which buys the cheapest upgrade every 10s. Upgradable with gold."
	},
	voidMagic: {
		path: 2,
		position: 1,
		baseCost: new Decimal(1),
		level: 0,
		maxLevel: 1,
		skillPointsUsed: new Decimal(0),
		tooltip: "Sacrifice half of your gold income to double max mana and the power of curse."
	},
	gun: {
		path: 3,
		position: 1,
		baseCost: new Decimal(1e30),
		level: 0,
		maxLevel: 1,
		skillPointsUsed: new Decimal(0),
		tooltip: "The priest can no longer heal, but the knight is invulnerable for the first 4 seconds of each fight(doubled for bosses)."
	}
}
for(var i in skills) {
	skills[i].cost = skills[i].baseCost;
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
statUpgrades.scalesWithExp = ["archer.dmg", "knight.maxHp", "priest.power"];
//START
var manaPotionUsed = false;
var pendingManaRegen = new Decimal(0);
var pendingHpRegen = new Decimal(0);
var pendingKnightDmg = new Decimal(0);
var pendingEnemyDmg = new Decimal(0);
function gotoLevel(i) {
	i = Decimal(i);
	player.level = i;
	clearInterval(deathDelay);
	document.getElementById("pause").checked = false;
	if(i.gt(50)) { //General slowdown, and counter to crit/block factor upgrades giving a linearly increasing multiplier to damage and survivability.
		enemy.maxHp = enemy.baseMaxHp.times(1 + (i.minus(50)) * 0.05);
		enemy.dmg = enemy.baseDmg.times(1 + (i.minus(50)) * 0.025);
		enemy.attackSpeed = Decimal(1).plus(i.times(2/175).minus(50*2/175)).times(priest.slow.div(100)); //+4 attacks/s per 400 levels
	} else {
		enemy.maxHp = enemy.baseMaxHp;
		enemy.dmg = enemy.baseDmg;
		enemy.attackSpeed = Decimal(1).times(priest.slow.div(100));
	}
	scaling.enemyGold = scaling.enemyGoldBase.toPower(Decimal(1).plus(player.level.log(scaling.enemyGoldZoneLog).div(scaling.enemyGoldScaling)));
	enemy.gold = (enemy.baseGold.times(scaling.enemyGold.toPower(i.minus(1))).times(1+priest.fireMagic.dividedBy(100).toNumber())).times(player.goldBonus.div(100)).div(0.5).round().times(0.5);
	enemy.maxHp = enemy.maxHp.times(scaling.enemyMaxHp.toPower(i.minus(1))).div(5).round().times(5);
	enemy.dmg = enemy.dmg.times(scaling.enemyDmg.toPower(i.minus(1)));
	enemy.power = (priest.curse).div(100);
	enemy.exp = (Decimal(2).plus((i.minus(1)).times(0.5))).times(scaling.enemyExp.toPower(i.minus(1))); //2+0.5*i, then scaling
	crippleFactor = archer.cripple.toNumber()/100;
	if(i.toNumber() % 10 === 0) { //comments are for no cripple/max cripple.
		enemy.maxHp = enemy.maxHp.times(1+(1.5*crippleFactor)); //2.5x, 1.375x
		enemy.dmg = enemy.dmg.times(1+(1*crippleFactor)); //2x, 1.25x
	}
	if(i.toNumber() % 100 === 0) {
		enemy.maxHp = enemy.maxHp.times(1+(3*crippleFactor)); //4x, 1.75x
		enemy.dmg = enemy.dmg.times(1+(1.5*crippleFactor)); //2.5x, 1.375x
	}
	if(i.toNumber() % 1000 === 0) {
		enemy.maxHp = enemy.maxHp.times(1+(6*crippleFactor)); //7x, 2.5x
		enemy.dmg = enemy.dmg.times(1+(2*crippleFactor)); //3x, 1.5x
	}
	if(i.toNumber() % 10000 === 0) {
		enemy.maxHp = enemy.maxHp.times(1+(9*crippleFactor)); //10x, 3.25x
		enemy.dmg = enemy.dmg.times(1+(4*crippleFactor)); //5x, 2x
	}
	if(i.toNumber() % 100000 === 0) {
		enemy.maxHp = enemy.maxHp.times(1+(16*crippleFactor)); //17x, 5x
		enemy.dmg = enemy.dmg.times(1+(6*crippleFactor)); //7x, 2.5x
	}
	if(i.toNumber() === 10) { //heh
		enemy.maxHp = Decimal(1000);
		enemy.dmg = Decimal(250);
	}
	enemy.hp = enemy.maxHp;
	enemy.armor = (priest.curse).div(100);
	knight.hp = knight.maxHp;
	priest.mana = priest.maxMana;
	enemy.attackReq = Decimal(0);
	archer.attackReq = Decimal(0);
	priest.castReq = Decimal(0);
	$("#castBar").css("display", "none");
	manaPotionUsed = false;
	pendingManaRegen = Decimal(0);
	pendingHpRegen = Decimal(0);
	pendingKnightDmg = Decimal(0);
	pendingEnemyDmg = Decimal(0);
	if(upgrades.corrosion.bought>0) {
		$("#enemyPower").text("Enemy Damage: "+format(priest.curse)+"%");
	}
	if(upgrades.learning.bought>0) {
		$("#enemyDefense").text("Enemy Defense: "+format(priest.curse)+"%");
	}
}
function switchTab(tar) {
	$("#tab1").css("display", "none");
	$("#tab2").css("display", "none");
	$("#tab8").css("display", "none");
	$("#tab9").css("display", "none");
	$("#tab"+tar).css("display", "inline");
}
function calc(up, lvl) {
	var result;
	if(lvl===undefined) {lvl = getStatUpgradesBought(up)};
	var target = upgrades[up];
	switch (up) {
		case "healCost":
			result=target.base.plus(target.flatGain(lvl[0])).times(target.expoGain(lvl[0])).times(scaling.healUpMana.toPower(upgrades.healUp1.bought+upgrades.healUp2.bought)).times(1+upgrades.fireMagic.bought*0.01);
			break;
		default:
			var targetStatUpgrades = statUpgrades[target.user][target.stat];
			for(var i in targetStatUpgrades) {
				var tar = upgrades[targetStatUpgrades[i]];
				var providedLevel = lvl[i];
				if(!tar.base.eq(-1)) {
					result = tar.base.plus(tar.flatGain(providedLevel)).times(tar.expoGain(providedLevel));
				} else {
					result = result.plus(tar.flatGain(providedLevel)).times(tar.expoGain(providedLevel));
				}
			}
			break;
	}
	if(statUpgrades.scalesWithExp.indexOf(target.user+"."+target.stat)!==-1) {result = result.times(scaling.expPow.toPower(player.pLvl.minus(1).plus(player.freePLvls)))}
	if((target.user+"."+target.stat==="priest.power" || target.user+"."+target.stat==="priest.maxMana") && upgrades.blessing.bought===1) {result=result.times(3)}
	return result;
}
function getStep(num) { //Kinda shit quality.
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
function hasUpgradeRequirement(tar) { //the upgrade must be passed as an object
	if(tar.requiredUpgrade==="none") {
		return true;
	}
	if(upgrades[tar.requiredUpgrade].bought===1) {
		return true;
	} else {
		return false;
	}
}
function format(num, places, lowplaces, fixedplaces) {
	var num = new Decimal(num);
	var negative = false;
	if(num.lt(0)) {
		negative=true;
		num=num.neg();
	}
	if(places===undefined) {places=3}
	if(lowplaces===undefined) {lowplaces=2}
	if(fixedplaces===undefined) {fixedplaces=-1}
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
	} else {
		if(num.lt(1e15)) { //Nothing works other than setting an upper limit. So I set it to 1e9e15
			var thing = getStep(Decimal(num));
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
		}
		} else {
			if(document.getElementById("scientific").checked) {
				result = num.toExponential(2).replace("+","");
			} else {
				result = num.div(Decimal(1e3).toPower(Decimal.floor(Decimal.log(num, 1e3)))).toPrecision(3) + exponents[Decimal.floor(Decimal.log(num, 1e3))-5];
			}
		}
	}
	if(negative) {
		return "-"+result;
	} else {
		return result;
	}
}
function buyUpgrade(tar) {
	if(paused) {
		console.log("Not buying, paused.");
		return;
	}
	actualBuyBulk = buyBulk;
	if(upgrades[tar].maxLevel-upgrades[tar].bought<buyBulk && upgrades[tar].maxLevel!==-1) {actualBuyBulk=upgrades[tar].maxLevel-upgrades[tar].bought}
	if(player.gold.gte(upgrades[tar].cost.times(actualBuyBulk)) && player.maxLevel.gt(upgrades[tar].minEnemyLevel) && hasUpgradeRequirement(upgrades[tar])) {
		upgrades[tar].bought += actualBuyBulk;
		player.gold = player.gold.minus(upgrades[tar].cost.times(calcBuyBulk(upgrades[tar].costScaling.minus(1), actualBuyBulk)));
		updateStats();
		$("#"+tar+"Button").css("animation-name","blink");
		setTimeout(function(){
			$("#"+tar+"Button").css("animation-name","");
		},200);
	}
}
function createUpgradeButton(tar) {
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
function createSkillButton(tar) {
	var elem = document.createElement("div");
	elem.id = tar + "SkillButton";
	elem.className = "skillButton path"+skills[tar].path;
	elem.onclick = function() {buySkill(tar)};
	elem.onmouseover = function() {$("#"+tar+"SkillButtonTooltip").css("display","inline-block")};
	elem.onmouseout = function() {$("#"+tar+"SkillButtonTooltip").css("display","none")};
	var tooltip = document.createElement("div");
	tooltip.id = tar + "SkillButtonTooltip";
	tooltip.className = "tooltip skillTooltip";
	var skillWrapper = document.getElementById("skillWrapper");
	skillWrapper.append(elem);
	skillWrapper.append(tooltip);
	$("#"+tar+"SkillButton").css("background-image","url(dat/"+tar+".png)");
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
		if((target.bought<target.maxLevel || target.maxLevel===-1) && player.maxLevel.gt(target.minEnemyLevel) && (target.maxLevel>100 || target.maxLevel===-1) && hasUpgradeRequirement(target)) { //Same as below but without the linear 1% increase
			target.cost = Decimal(10).times(target.baseCost).times(1+target.bought*0.01).times(target.costScaling.toPower(target.bought));
		} else if((target.bought<target.maxLevel || target.maxLevel===-1) && player.maxLevel.gt(target.minEnemyLevel) && hasUpgradeRequirement(target)) { //If upgrade isn't maxed(or there isn't a max), if required upgrade is bought(if there is one)
			target.cost = Decimal(10).times(target.baseCost).times(target.costScaling.toPower(target.bought)); //Upgrades with large max levels get a linear 1% cost increase per level
		} else {
			target.cost = Decimal(Infinity);
			$("#"+i+"Button").css("display","none");
		}
		switch(i) {
			default:
				window[target.user][target.stat] = calc(i);
				break;
		}
	}
}
for(var i in upgrades) {
	createUpgradeButton(i);
}
for(var i in skills) {
	createSkillButton(i);
}
function updateButtonText() { //This is quite heavy performance wise.
	for(var i in upgrades) {
		var target = document.getElementById(i + "ButtonText1");
		var tar = upgrades[i];
		target.textContent = tar.buttonText.replace("X", format(upgrades[i].buttonCalc(i)));
		target = document.getElementById(i + "ButtonText2");
		actualBuyBulk = buyBulk;
		if(tar.maxLevel-tar.bought<buyBulk && tar.maxLevel!==-1) {actualBuyBulk=tar.maxLevel-tar.bought};
		target.textContent = "\n" + format(tar.cost.times(calcBuyBulk(tar.costScaling.minus(1), actualBuyBulk))) + " Gold";
		target = document.getElementById(i + "ButtonTooltip");
		if(upgrades[i].displayPercentage) {
			target.textContent = tar.tooltip + "\n\n" + tar.tooltipStatName + ":\n" + format(window[tar.user][tar.stat]) + "% -> " +format(eval(tar.tooltipCalc)) + "%\n\nBought: "+tar.bought;
		} else if(upgrades[i].upgradeUnlocker) {
			target.textContent = tar.tooltip + "\n\nUnlocked:\nFalse -> True";
		} else {
			target.textContent = tar.tooltip + "\n\n" + tar.tooltipStatName + ":\n" + format(window[tar.user][tar.stat]) + " -> " +format(eval(tar.tooltipCalc)) + "\n\nBought: "+tar.bought;
		}
	}
	for(var i in skills) {
		var tar = skills[i];
		target = document.getElementById(i + "SkillButtonTooltip");
		target.textContent = tar.tooltip + "\nCost: " + format(tar.cost, 3, 2, 0) + "\nLevel: "+tar.level+"/"+tar.maxLevel;
	}
}
var castCompensation = Decimal(0);
function combat() {
	priest.mana=priest.mana.plus(pendingManaRegen.times(5/player.fps));
	pendingManaRegen=pendingManaRegen.minus(pendingManaRegen.times(5/player.fps));
	knight.hp=knight.hp.plus(pendingHpRegen.times(10/player.fps));
	pendingHpRegen=pendingHpRegen.minus(pendingHpRegen.times(10/player.fps));
	knight.hp=knight.hp.minus(pendingKnightDmg.times(15/player.fps));
	pendingKnightDmg=pendingKnightDmg.minus(pendingKnightDmg.times(15/player.fps));
	enemy.hp=enemy.hp.minus(pendingEnemyDmg.times(15/player.fps));
	pendingEnemyDmg=pendingEnemyDmg.minus(pendingEnemyDmg.times(15/player.fps));
	if(!document.getElementById("pause").checked) {
		if(priest.mana.lte(priest.maxMana.times(0.25)) && !manaPotionUsed) {
			pendingManaRegen=pendingManaRegen.plus(priest.maxMana.times(priest.manaPotionStrength.div(100)));
			manaPotionUsed=true;
		}
		priest.mana=priest.mana.plus(priest.maxMana.times(priest.manaRegen.div(100).div(player.fps)));
		archer.attackReq=archer.attackReq.plus(archer.attackSpeed.div(player.fps));
		enemy.attackReq=enemy.attackReq.plus(enemy.attackSpeed.div(player.fps));
		if(knight.hp.lte(knight.maxHp.minus(priest.power.plus(pendingHpRegen.times(0.5)))) && priest.castReq.lt(0.00001) && priest.mana.plus(pendingManaRegen).gte(priest.healCost)) {
			priest.castReq=Decimal(0.00001);
		}
		if(priest.castReq.gte(0.00001) && player.maxLevel.gte(15)) {
			priest.castReq=priest.castReq.plus(priest.castSpeed.div(player.fps));
		}
		if(priest.castReq.gte(Decimal(1).minus(castCompensation))) {
			pendingHpRegen=pendingHpRegen.plus(priest.power);
			pendingManaRegen=pendingManaRegen.minus(priest.healCost)
			castCompensation = priest.castReq.minus(1);
			if(castCompensation.lte(0)) {
				castCompensation = Decimal(0);
			}
			priest.castReq=Decimal(0);
			$("#castBar").css("display", "none");
		}
		while(enemy.attackReq.gte(1)) {
			if(Random(0, 100) < knight.blockChance%100) {
				pendingKnightDmg = pendingKnightDmg.plus((enemy.dmg.times(enemy.power)).div(knight.armor).div(knight.blockFactor.toPower(Math.floor(knight.blockChance/100)).plus(1)));
			} else {
				pendingKnightDmg = pendingKnightDmg.plus((enemy.dmg.times(enemy.power)).div(knight.armor).div(knight.blockFactor.toPower(Math.floor(knight.blockChance/100))));
			}
			enemy.attackReq=enemy.attackReq.minus(1);
		}
		while(archer.attackReq.gte(1)) {
			if(Random(0, 100) < archer.critChance%100) {
				pendingEnemyDmg = pendingEnemyDmg.plus(archer.dmg.times(archer.critFactor.toPower(Math.floor(archer.critChance/100)+1)).div(enemy.armor))
			} else {
				pendingEnemyDmg = pendingEnemyDmg.plus(archer.dmg.times(archer.critFactor.toPower(Math.floor(archer.critChance/100))).div(enemy.armor));
			}
			archer.attackReq=archer.attackReq.minus(1);
		}
		if(knight.hp.lte(knight.maxHp.plus(priest.power)))
		checkDeath();
	}
	if(enemy.hp.lt(0)) {enemy.hp=Decimal(0)};
}
var deathDelay;
var usefulData = [];
function checkDeath() {
	if(knight.hp.lte(1)) {
		knight.hp = Decimal(0);
		pendingHpRegen = Decimal(0);
		pendingManaRegen = Decimal(0);
		pendingKnightDmg = Decimal(0);
		pendingEnemyDmg = Decimal(0);
	} 
	if(enemy.hp.lte(1)) {
		enemy.hp = Decimal(0);
		pendingHpRegen = Decimal(0);
		pendingManaRegen = Decimal(0);
		pendingKnightDmg = Decimal(0);
		pendingEnemyDmg = Decimal(0);
	}
	if(knight.hp.lte(1) || enemy.hp.lte(1)) {
		document.getElementById("pause").checked = true;
		deathTimer = 1/(archer.attackSpeed**0.71533828)*1000; //1 second at first, 2/3rds of a second later, 1/10ths of a second at cap.
		if(knight.hp.lte(1)) {
				player.deaths = player.deaths.plus(1);
		} else if(enemy.hp.lte(1)) {
				player.kills = player.kills.plus(1);
				player.gold = player.gold.plus(enemy.gold);
				player.totalGold = player.totalGold.plus(enemy.gold);
				player.exp = player.exp.plus(enemy.exp);
		}
		deathDelay = setTimeout(function() {
			if(knight.hp.lte(1)) {
				player.level === 1 ? gotoLevel(player.level) : gotoLevel(player.level.minus(1));
				document.getElementById("autoProgress").checked=false;
			} else if(enemy.hp.lte(1)) {
				if(player.level.eq(player.maxLevel)) {
					player.maxLevel=player.maxLevel.plus(1);
					usefulData.push({zone: player.level.toNumber(), speed: currOverallGrowthSpeed.toPrecision(5)});
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
function updateBuyBulk() {
	if(player.level.gte(upgrades.milestone1.minEnemyLevel) && !(isNaN(document.getElementById("buyBulk").value))) {
		var input = document.getElementById("buyBulk");
		var temp = Math.floor(input.value);
		if(temp<1) {
			temp=1;
		}
		if(temp>1e6) {
			temp=1e6;
			input.value=1e6;
		}
		buyBulk=temp;
	} else {buyBulk=1;}
}
updateBuyBulk();
setInterval(function() {updateBuyBulk()},2500);
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
		actualBuyBulk = buyBulk;
		if(upgrades[i].maxLevel-upgrades[i].bought<buyBulk && upgrades[i].maxLevel!==-1) {actualBuyBulk=upgrades[i].maxLevel-upgrades[i].bought};
		if(upgrades[i].cost.times(calcBuyBulk(upgrades[i].costScaling.minus(1), actualBuyBulk)).gt(player.gold)) {
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
	if(player.maxLevel.gt(1)) {$("#autoProgress, #autoProgressText").css("display", "inline")};
	if(player.maxLevel.gt(upgrades[upgradesKeys[1]].minEnemyLevel)) {$("#buyCheapestButton").css("display", "inline")};
	showEnemyGold = document.getElementById("showEnemyGold").checked;
	if(showEnemyGold) {
		if(player.gold.eq(0)) {
			$("#gold").text("0" + " \(" + format(enemy.gold) + "\)");
		} else {
			$("#gold").text(format(player.gold) + " \(" + format(enemy.gold) + "\)");
		}
	} else {
		if(player.gold.eq(0)) {
			$("#gold").text("0");
		} else {
			$("#gold").text(format(player.gold));
		}
	}
	if(player.maxLevel.gt(upgrades.maxHp1.minEnemyLevel)) {
		$("#knightUpgrades").css("display", "inline");
	}
	if(player.maxLevel.gt(upgrades.healUp1.minEnemyLevel)) {
		$("#priestUpgrades").css("display", "inline");
	}
	if(player.maxLevel.gt(upgrades.milestone1.minEnemyLevel)) {
		$("#playerUpgrades").css("display", "inline");
	}
	if(player.maxLevel.gte(1e3)) {
		$("#level").css("font-size", "17px");
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
		$("#buyCheapestButton").text("Buy " + player.bulkAmount + " cheapest upgrades");
	} else {
		$("#buyCheapestButton").text("Buy cheapest upgrade");
	}
	$("#level").text("Zone: " + player.level + "/" + player.maxLevel);
	$("#expLevel").text("Group Level: "+player.pLvl.plus(player.freePLvls));
	if(player.pLvl.plus(player.freePLvls).minus(1).gte(2094)) {
		$("#expTooltip").text("Each level increases the archer's damage, the knight's maximum health and the priest's healing by 2%.\n\n Current Bonus:\n"+format(scaling.expPow.toPower(player.pLvl.plus(player.freePLvls).minus(1)).minus(1).times(100))+"%");
		$("#expTooltip").css("top", "-165px");
	} else {
		$("#expTooltip").text("Each level increases the archer's damage, the knight's maximum health and the priest's healing by 2%.\n\n Current Bonus:\n"+(scaling.expPow.toPower(player.pLvl.plus(player.freePLvls).minus(1)).minus(1).times(100)).round().toNumber().toLocaleString()+"%");
		$("#expTooltip").css("top", "-150px");
	}
	if(upgrades.skillsUnlock.bought===1) {
		$("#tab2Button").css("display", "inline");
		player.skillPoints = Decimal(player.maxLevel.div(500).floor());
		$("#skillPoints").text("Skill points: "+player.skillPoints.floor().toNumber()+"/"+player.maxLevel.div(500).floor().toNumber());
	}
	updateStats();
	updateButtonText();
}
function updateVisuals() {
	$("#enemyHp").text(format(enemy.hp) + " / " + format(enemy.maxHp));
	$("#enemyHp").css({
		"width": ((enemy.hp.div(enemy.maxHp)) * 450)
	});
	if(archer.attackSpeed.lt(5)) {
		$("#archerAttackBar").css({
		"width": ((archer.attackReq) * 450),
		"display": "inline"
		});
	} else {
		$("#archerAttackBar").css("display", "none");
	}
	if(player.maxLevel>upgrades.maxHp1.minEnemyLevel) {
	$("#knightHp").text(format(knight.hp) + " / " + format(knight.maxHp));
	$("#knightHp").css({
		"width": ((knight.hp.div(knight.maxHp)) * 450),
		"display": "inline"
	});
	if(enemy.attackSpeed.lt(4)) {
		$("#enemyAttackBar").css({
		"width": ((enemy.attackReq) * 450),
		"display": "inline"
		});
	} else {
		$("#enemyAttackBar").css("display", "none");
	}
	}
	if(player.maxLevel>=15) {
	$("#mana").text(format(priest.mana) + " / " + format(priest.maxMana));
	$("#mana").css({
		"width": ((priest.mana.div(priest.maxMana)) * 450),
		"display": "inline"
	});
	var castTime = Decimal(1).div(priest.castSpeed) //In seconds
	if(priest.castSpeed.lt(4.99) && priest.castReq.gt(0)) {
		$("#castBar").css({
			"width": ((priest.castReq) * 450),
			"display": "inline"
		})
	} else {
		$("#castbar").css({
			"display": "none"
		})
	}
	$("#expText").text(format(player.exp)+" / "+format(player.expReq));
	$("#expBar").css("width", (player.exp.div(player.expReq)*100)+"%");
	}
}
function checkOverflow() {
	if(knight.hp.gt(knight.maxHp)) {knight.hp=knight.maxHp};
	if(enemy.hp.gt(enemy.maxHp)) {enemy.hp=enemy.maxHp};
	if(priest.mana.gt(priest.maxMana)) {priest.mana=priest.maxMana};
	if(priest.mana.lte(0.25)) {priest.mana=Decimal(0)};
	for(var i in upgrades) {
		if(upgrades[i].maxLevel<upgrades[i].bought && upgrades[i].maxLevel>0) {
			upgrades[i].bought=upgrades[i].maxLevel;
		}
	}
	player.expReq=Decimal(500).plus(Decimal(100).times(player.pLvl-1)).times(scaling.expReq.toPower(player.pLvl-1));
	while(player.exp.gte(player.expReq)) {
		player.pLvl=player.pLvl.plus(1);
		player.exp=player.exp.minus(player.expReq);
		player.expReq=Decimal(500).plus(Decimal(100).times(player.pLvl-1)).times(scaling.expReq.toPower(player.pLvl-1));
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
var offlineAutoBuys = 0;
function autoBuyLoop() {
	if(upgrades.autoBuyUnlock.bought===1 && !paused) {
		buyCheapest();
	}
	window.setTimeout(autoBuyLoop, player.autoBuyFrequency.times(1000).toNumber());
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
function buyCheapest() {
	if(paused) {
		return;
	}
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
function getCheapest() {
	var keys = Object.keys(upgrades);
	var value = upgrades[keys[0]].cost;
	var index = 0;
	for(var i = 1; i < keys.length; i++) {
		if(upgrades[keys[i]].cost.lt(value)) {
			value = upgrades[keys[i]].cost;
			index = i;
		}
	}
	return index;
}
$(window).keydown(function(e) {
	switch(e.key) {
		case "a":
		case "A":
			document.getElementById("autoProgress").click();
			break;
		case "b":
		case "B":
			buyCheapest();
			break;
		case "d":
		case "D":
			updateStatistics();
			document.getElementById("tab8Button").click();
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
	for(var b in upgradessave) {if(upgrades[b]!==undefined) {upgrades[b].bought=upgradessave[b].bought}};
	for(var c in prefsSave) {prefs[c]=prefsSave[c]};
	document.getElementById("fpsSlider").value=prefs[0];
	document.getElementById("slowVisuals").checked=prefs[1];
	document.getElementById("showEnemyGold").checked=prefs[2];
	document.getElementById("scientific").checked=prefs[3];
	updateStats();
	gotoLevel(player.level);
	console.log("Loaded!");
	document.title = "Zone " + player.level;
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
autoBuyLoop()
document.title = "Zone " + player.level;
setInterval(function() {
	updateInactiveVisuals();
}, 333);
setInterval(function() {
	if(!paused) {player.exp=player.exp.plus(enemy.exp.times(player.passiveExp.div(1000)))};
}, 100);
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
var offlineGain = [new Decimal(0)];
var newTime = (Date.parse(Date())/1000)-1;
var timeArray = new Array;
newTime-player.lastTime>=60 ? timeArray = [60,1,1,1,1,1,1,1,1,1] : timeArray = [1,1,1,1,1,1,1,1,1,1]; //Don't reset player.lastTime if it's over 60 seconds behind current time.
function claimOfflineProgress() {
	player.gold=player.gold.plus(offlineGain[0]);
	player.exp=player.exp.plus(offlineGain[1]);
	document.title = "Zone " + player.level;
	var newTime = Decimal(Date.parse(Date())/1000).minus(1);
	player.lastTime = newTime;
	timePassed = 0;
	timeArray = [1,1,1,1,1,1,1,1,1,1];
	$("#offlineProgressWrapper").css("display", "none");
	document.getElementById("pause").checked=false;
	paused=false;
	console.log(offlineAutoBuys);
	console.log("starting to buy cheapest...");
	window.setTimeout(function(){
		for(var n=0;n<offlineAutoBuys;n++) {
			console.log("buying cheapest");
			buyCheapest();
		}
	},1000);
};
function add(a,b) {return a+b};
function formatTime(t) {
	var hours = Math.floor(t/3600);
	var seconds = t-hours*3600;
	var minutes = Math.floor(seconds/60);
	seconds -= minutes*60;
	return [seconds, minutes, hours];
}
function getDPS() {
	return archer.dmg.times(archer.attackSpeed).times(archer.critFactor.toPower(archer.critChance.div(100)).div(priest.curse.div(100)));
}
var timeSum = 0;
function timeDecay(x) {
	var result = (x*5.8)**0.7; //anything <= to 1 minute is 100%, 6 minutes = 58.5%, 60 minutes = 29.3%, 600 minutes = 14.7%, 6000 minutes = 7.4%
	if(result/x>1) {result = x}; //Offline progress is nice and all but for this game I feel it can ruin the experience when you return to a mound of gold appropriate for someone 20 levels above you.
	return result; //so now, 10x more time = 5x more gold(when offline).
}
currOverallGrowthSpeed = Decimal(1);
var paused = false;
setInterval(function() {
	newTime = Decimal(Date.parse(Date())/1000).minus(1);
	timePassed = newTime-player.lastTime;
	offlineKills = getDPS().div(enemy.maxHp).times(timeDecay(timePassed)).floor();
	offlineGain = [offlineKills.times(enemy.gold), offlineKills.times(enemy.exp).times(player.passiveExp.div(100))];
	timeArray.push(timePassed);
	if(timeArray.length>10) {
		timeArray.shift();
	}
	timeSum = timeArray.reduce(add,0);
	if(timeSum>15) {
		paused = true;
		$("#offlineProgressWrapper").css("display", "inline");
		document.getElementById("pause").checked=true;
	} else {
		player.lastTime = newTime;
	}
	var displayTimePassed = formatTime(timePassed);
	var textElem = $("#offlineProgressText");
	textElem.text("You've been offline/inactive for:\n"+displayTimePassed[2]);
	//displayTimePassed[2]===1 ? textElem.text(textElem.text() + " hour\n"+displayTimePassed[1]) : textElem.text(textElem.text() + " hours\n"+displayTimePassed[1]);
	//displayTimePassed[1]===1 ? textElem.text(textElem.text() + " minute\n"+displayTimePassed[0]) : textElem.text(textElem.text() + " minutes\n"+displayTimePassed[0]);
	//displayTimePassed[0]===1 ? textElem.text(textElem.text() + " second\n") : textElem.text(textElem.text() + " seconds\n");
	textElem.text(textElem.text() + "h "+displayTimePassed[1]+"m "+displayTimePassed[0]+"s\n");
	textElem.text(textElem.text() + "\nEarning you:\n"+format(offlineGain[0])+" gold\n"+format(offlineGain[1]) + " exp");
	(timeSum>15 && document.getElementById("offlineProgressWrapper").style.display=="inline") ? document.title = "Zone " + player.level + " | " + format(player.gold.plus(offlineGain[0])) + " gold" : document.title = "Zone " + player.level;
	if(timeSum>15 && document.getElementById("offlineProgressWrapper").style.display=="inline" && document.getElementById("offlineProgressAutoBuy").checked) {
		offlineAutoBuys=Math.floor(timePassed/player.autoBuyFrequency.toNumber())} else {offlineAutoBuys=0}
}, 1000);
load();
updateStats();
gotoLevel(player.level);
setInterval(function() { //Reduce enemy armor and power for learning and corrosion
	if(enemy.hp.gt(0)) {
		enemy.armor = enemy.armor.div(Decimal(1).plus(archer.learning.div(100)).toPower(0.03));
		if(upgrades.learning.bought>0) {
			$("#enemyDefense").text("Enemy Defense: "+format(enemy.armor*100)+"%");
		}
		enemy.power=enemy.power.div(Decimal(1).plus(knight.corrosion.div(100)).toPower(0.03));
		if(upgrades.corrosion.bought>0) {
			$("#enemyPower").text("Enemy Damage: "+format(enemy.power*100)+"%");
		}
	}
}, 30);
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