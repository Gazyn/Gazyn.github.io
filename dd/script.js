var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
var exponents = [];
const globalDifficulty = 0.96;
const autoPlayTest = true;
const gameTickSpeed = 250; //gotta reduce fps to compensate. bad idea to go below 250ms / 15fps
const defaultFps = "60";
const defaultAutoPlayTestFps = "15";
for(let a=0; a<26; a+=1) {
	let letter = letters[a];
	for(let b=0; b<26; b+=1) {
		exponents.push(letter+letters[b]);
	}
}
for(let a=0; a<26; a+=1) {
	let letter = letters[a];
	for(let b=0; b<26; b+=1) {
		let letter2 = letters[b];
		for(let c=0; c<26; c+=1) {
			exponents.push(letter+letter2+letters[c]);
		}
	}
}
for(let a=0; a<26; a+=1) {
	let letter = letters[a];
	for(let b=0; b<26; b+=1) {
		let letter2 = letters[b];
		for(let c=0; c<26; c+=1) {
			let letter3 = letters[c];
			for(let d=0; d<26; d+=1) {
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
const DecInfinity = new Decimal("1e"+Decimal.maxE);
const scaling = { //Scalings must be decimals so effect=effect.times(scaling.toPower(n)) isn't undefined.
	upCost: new Decimal(1.175),
	dmg1: new Decimal((1.1625**0.8)**globalDifficulty), //the **0.8 is to offset the enemygold **1.25.
	dmg2: new Decimal((1.165**0.8)**globalDifficulty),
	dmg3: new Decimal((1.1675**0.8)**globalDifficulty),
	dmg4: new Decimal((1.17**0.8)**globalDifficulty),
	dmg5: new Decimal((1.1725**0.8)**globalDifficulty),
	dmg6: new Decimal((1.175**0.8)**globalDifficulty),
	maxHp1: new Decimal(((1.15/1.03)**0.8)**globalDifficulty),
	maxHp2: new Decimal(((1.15/1.04)**0.8)**globalDifficulty),
	armor1: new Decimal((1.03**0.8)**globalDifficulty),
	armor2: new Decimal((1.04**0.8)**globalDifficulty),
	healUp1: new Decimal(((1.15/1.03)**0.8)**globalDifficulty),
	healUp2: new Decimal(((1.15/1.04)**0.8)**globalDifficulty),
	healCost: new Decimal(0.97),
	maxMana: new Decimal(1.04275), //1.04275/0.97 = effectively 1.075 times more mana per upgrade
	healUpMana: new Decimal(1.075),
	enemyMaxHp: new Decimal(1.175),
	enemyDmg: new Decimal(1.15),
	enemyGold: new Decimal(1.175**1.25), //1.25 upgrades per enemy level
	enemyExp: new Decimal(1.04),
	expPow: new Decimal(1.01),
	expReqLevels: 3 //The amount of enemy levels needed to gain one group level.
};
scaling.expReq = scaling.enemyExp.toPower(scaling.expReqLevels);
scaling.skillPointCost = scaling.enemyExp.toPower(500);
const unlockLevels = {
	buyCheapest: 50
}
var player = {
	gold: new Decimal(0),
	totalGold: new Decimal(0),
	level: new Decimal(1),
	maxLevel: new Decimal(1),
	kills: new Decimal(0),
	deaths: new Decimal(0),
	fps: new Decimal(60),
	visualFps: new Decimal(60),
	bulkAmount: 1,
	exp: new Decimal(0),
	expReq: new Decimal(100),
	pLvl: new Decimal(1),
	freePLvls: new Decimal(0),
	lastTime: new Decimal(Date.parse(Date())/1000),
	skillPoints: new Decimal(0),
	skillPointCost: new Decimal(1e13),
	totalSkillPoints: new Decimal(0),
	skillPointsUsed: new Decimal(0),
	cheated: false
}
var prefs = [defaultFps, false, false, true, true, false, false];
autoPlayTest ? prefs[0] = defaultAutoPlayTestFps : prefs[0] = defaultFps;
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
	baseDmg: new Decimal(73.4077),
	baseMaxHp: new Decimal(200),
	baseGold: new Decimal(10),
	armor: new Decimal(1),
	exp: new Decimal(2),
	attackReq: new Decimal(0),
	attackSpeed: new Decimal(1)
};
class Upgrade {
	constructor(all, name) {
		for(let i in all) {
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
		this.unlocked === undefined ? this.unlocked = false : this.unlocked = all.unlocked;
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
function thing() {
	thing = new Array();
	for(let i = 16; i<65; i+=1) {
		thing.push({
			level: i,
			base: format(scaling.enemyGold.toPower(i-1).times(10)),
			extra: format((i-12)**2.5),
			relative: Decimal((i-12)**2.5).div(scaling.enemyGold.toPower(i-1).times(10)).toPrecision(3)
		});
	}
	console.table(thing);
}
const numberAboveOne = RegExp(/\d{2,}|[2-9]/g);
var upgrades = {
	dmg1: new Upgrade({
		user: "archer",
		stat: "dmg",
		base: new Decimal(15),
		baseCost: new Decimal(10),
		flatScaling: new Decimal(1),
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
		flatScaling: new Decimal(175),
		maxLevel: 10000,
		tooltip: "Increases the knight's maximum health.",
		tooltipStatName: "Max Health",
		buttonText: "+X max health",
		minEnemyLevel: 5
	}),
	armor1: new Upgrade({
		user: "knight",
		stat: "armor",
		base: new Decimal(1),
		baseCost: new Decimal(75),
		flatScaling: new Decimal(0.005),
		maxLevel: 2000,
		tooltip: "Increases armor, dividing all incoming damage.",
		tooltipStatName: "Armor",
		buttonText: "+X armor"
	}),
	healUp1: new Upgrade({
		user: "priest",
		stat: "power",
		base: new Decimal(750),
		flatScaling: new Decimal(250),
		maxLevel: 10000,
		tooltip: "Increases the power of healing at the cost of increased mana usage.",
		tooltipStatName: "Heal Power",
		buttonText: "+X heal power"
	}),
	maxMana: new Upgrade({
		user: "priest",
		stat: "maxMana",
		base: new Decimal(200),
		flatScaling: new Decimal(35),
		tooltip: "Increases maximum mana.",
		tooltipStatName: "Max Mana",
		buttonText: "+X max mana"
	}),
	healCost: new Upgrade({
		user: "priest",
		stat: "healCost",
		base: new Decimal(29.999),
		flatScaling: new Decimal(0.02),
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
		maxLevel: 100,
		tooltip: "Gives a chance to block, dividing incoming damage.\n(base factor: 2x)",
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
		maxLevel: 40, //0.8 -> 2; 1.25s to 0.5s
		tooltip: "Decreases the amount of time spent casting, increasing healing speed.",
		tooltipStatName: "Casts per second",
		buttonText: "+X casts/s"
	}),
	priestCritChance: new Upgrade({
		user: "priest",
		stat: "critChance",
		base: new Decimal(1),
		flatScaling: new Decimal(1),
		scaling: new Decimal(0.9921160049), //it ends up at 100.00000074617164%
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
		maxLevel: 125, //2 -> 5; 0.5s to 0.2s
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
		tooltip: "Increase the division factor of blocks. Stacks with multiple simultaneous blocks.",
		tooltipStatName: "Block Factor",
		buttonText: "+X block factor"
	}),
	manaPotion: new Upgrade({
		user: "priest",
		stat: "manaPotionStrength",
		base: new Decimal(0),
		flatScaling: new Decimal(1),
		maxLevel: 50,
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
		minEnemyLevel: 100,
		tooltip: "Passively gain exp based on your current enemy.",
		tooltipStatName: "Passive EXP",
		buttonText: "+X% exp/s",
		displayPercentage: true
	}),
	goldBonus: new Upgrade({
		user: "player",
		stat: "goldBonus",
		base: new Decimal(100),
		flatScaling: new Decimal(6.6), //goes up to 9.9e3% base
		scaling: new Decimal(9.99e10**(1/1500)), //multiplies that 9.9e3 by 9.99e10, going up to 100T%
		costScaling: new Decimal(2**0.5), //6e225 total cost increase
		minEnemyLevel: 125,
		maxLevel: 1500, //This upgrade won't be maxed for a loooong time.
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
		tooltip: "Unlocks the skill tree. You get a skill point every 500 zones.",
		buttonText: "Unlock skills",
		upgradeUnlocker: true
	}),
	autoBuyUnlock: new Upgrade({
		user: "player",
		stat: "autoBuyUnlocked",
		base: new Decimal(0),
		flatScaling: new Decimal(1),
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
		costScaling: new Decimal(10),
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
		costScaling: new Decimal(1e15),
		tooltip: "Receive a blessing, tripling the knight's maximum health, the priest's heal power and max mana.",
		tooltipStatName: "Max Health",
		buttonText: "+X max health"
	}),
	cripplingShot: new Upgrade({
		user: "archer",
		stat: "cripple",
		base: new Decimal(100),
		scaling: new Decimal(0.25**(1/250)),
		maxLevel: 250,
		minEnemyLevel: 300,
		tooltip: "Cripple bosses, lowering their stats.",
		tooltipStatName: "Boss Power",
		buttonText: "X% boss power",
		displayPercentage: true
	}),
	armor2: new Upgrade({
		user: "knight",
		stat: "armor",
		flatScaling: new Decimal(3.07e5),
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
		minEnemyLevel: 400,
		maxLevel: 1000,
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
		minEnemyLevel: 1000,
		maxLevel: 150, //roughly 240 zones.
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
		maxLevel: 7500,
		tooltip: "Increases the archer's damage.",
		tooltipStatName: "Damage",
		buttonText: "+X damage"
	}),
	passiveExp2: new Upgrade({
		user: "player",
		stat: "passiveExp",
		flatScaling: new Decimal(50),
		scaling: new Decimal(10**(1/180)),
		maxLevel: 180, //100000%
		minEnemyLevel: 1750,
		tooltip: "Passively gain exp based on your current enemy.",
		tooltipStatName: "Passive EXP",
		buttonText: "+X% exp/s",
		displayPercentage: true
	}),
	dmg4: new Upgrade({
		user: "archer",
		stat: "dmg",
		flatScaling: new Decimal(1e70),
		minEnemyLevel: 2000,
		tooltip: "Increases the archer's damage.",
		tooltipStatName: "Damage",
		buttonText: "+X damage"
	}),
	maxHp2: new Upgrade({
		user: "knight",
		stat: "maxHp",
		flatScaling: new Decimal(1.5e52),
		minEnemyLevel: 2160,
		tooltip: "Increases the knight's maximum health.",
		tooltipStatName: "Max Health",
		buttonText: "+X max health"
	}),
	healUp2: new Upgrade({
		user: "priest",
		stat: "power",
		flatScaling: new Decimal(7e50),
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
		minEnemyLevel: 2222,
		maxLevel: 160,
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
		maxLevel: 1,
		minEnemyLevel: 100,
		tooltip: "Gain 5 group levels without affecting xp required.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+5 group levels"
	}),
	milestone2: new Upgrade({
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(10),
		maxLevel: 1,
		minEnemyLevel: 200,
		tooltip: "Gain 10 group levels without affecting xp required.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+10 group levels"
	}),
	milestone3: new Upgrade({
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(15),
		maxLevel: 1,
		minEnemyLevel: 300,
		tooltip: "Gain 15 group levels without affecting xp required.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+15 group levels"
	}),
	milestone4: new Upgrade({
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(20),
		maxLevel: 1,
		minEnemyLevel: 400,
		tooltip: "Gain 20 group levels without affecting xp required.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+20 group levels"
	}),
	milestone5: new Upgrade({
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(25),
		maxLevel: 1,
		minEnemyLevel: 500,
		tooltip: "Gain 25 group levels without affecting xp required.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+25 group levels"
	}),
	milestone6: new Upgrade({
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(30),
		minEnemyLevel: 750,
		maxLevel: 1,
		tooltip: "Gain 30 group levels without affecting xp required.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+30 group levels"
	}),
	milestone7: new Upgrade({
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(35),
		minEnemyLevel: 1000,
		maxLevel: 1,
		tooltip: "Gain 35 group levels without affecting xp required.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+35 group levels"
	}),
	milestone8: new Upgrade({
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(40),
		minEnemyLevel: 1500,
		maxLevel: 1,
		tooltip: "Gain 40 group levels without affecting xp required.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+40 group levels"
	}),
	milestone9: new Upgrade({
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(45),
		minEnemyLevel: 2000,
		maxLevel: 1,
		tooltip: "Gain 45 group levels without affecting xp required.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+45 group levels"
	}),
	milestone10: new Upgrade({
		user: "player",
		stat: "freePLvls",
		flatScaling: new Decimal(50),
		minEnemyLevel: 3000,
		maxLevel: 1,
		tooltip: "Gain 50 group levels without affecting xp required.",
		tooltipStatName: "Extra Group Levels",
		buttonText: "+50 group levels"
	})
};
let upgradesKeys = Object.keys(upgrades);
for(let i in upgrades) {
	let target = upgrades[i];
	if(target.minEnemyLevel === undefined) {
		if(upgradesKeys.indexOf(i)<6) {
			target.minEnemyLevel = (upgradesKeys.indexOf(i)+1)*5
		} else if(upgradesKeys.indexOf(i)<20) {
			target.minEnemyLevel = Math.ceil((upgradesKeys.indexOf(i)+3)**1.75);
		} else {
			target.minEnemyLevel = Math.ceil((upgradesKeys.indexOf(i)+4)**(1.75+upgradesKeys.indexOf(i)*0.01-0.2));
		}
		target.minEnemyLevel=Math.round(upgrades[i].minEnemyLevel/5)*5;
	}
	if(target.baseCost === undefined) {
		target.baseCost=scaling.upCost.toPower(upgrades[i].minEnemyLevel).times(4);
	} else {
		target.baseCost=Decimal(upgrades[i].baseCost).div(10);
	}
	if(target.scaling === undefined) {
		if(scaling[i] === undefined) {
			target.scaling=new Decimal(1);
		} else {
			target.scaling = scaling[i];
		}
	}
	if(numberAboveOne.test(i)) {
		target.requiredUpgrade = i.replace(numberAboveOne, Number(i.match(numberAboveOne)[0])-1); //Sets the required upgrade as the upgrade below it i.e dmg5 requires dmg4
		let tRU = upgrades[target.requiredUpgrade]; // target required upgrade
		let tRUCost = tRU.baseCost.times(tRU.costScaling.toPower(tRU.maxLevel))
		if(tRUCost.gt(target.baseCost)) {
			target.baseCost = tRUCost.times(2);
		}
	}
}
const upgradeUnlockLevels = [];
for(let i in upgrades) {
	upgradeUnlockLevels.push(upgrades[i].minEnemyLevel)
}
upgradeUnlockLevels.sort(function(a,b){return a-b});
for(let i in upgrades) {
	let target = upgrades[i];
	if(target.costScaling === scaling.upCost && (target.maxLevel<=200 && !(target.maxLevel===-1 || target.maxLevel===1))) { //Makes stuff with low max levels and an undefined costScaling scale fast.
		target.costScaling = scaling.upCost.toPower(((200 / upgrades[i].maxLevel) ** 1.75) + 0.5);
	}
}
let skills = {
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
	goldMining: {
		path: 3,
		position: 1,
		baseCost: new Decimal(1e30),
		level: 0,
		maxLevel: 1,
		skillPointsUsed: new Decimal(0),
		tooltip: "Unlock gold miners, who passively produce gold based on your highest zone reached."
	}
}
for(let i in skills) {
	skills[i].cost = skills[i].baseCost;
}
statUpgrades = {player: {}, archer: {}, knight: {}, priest: {}};
for(let i in upgrades) {
	var user = upgrades[i].user;
	if(!statUpgrades[user].hasOwnProperty(upgrades[i].stat)) {
		statUpgrades[user][upgrades[i].stat] = new Array(i);
	} else {
		statUpgrades[user][upgrades[i].stat].push(i);
	}
}
statUpgrades.scalesWithExp = ["archer.dmg", "knight.maxHp", "priest.power"];
//START
let manaPotionUsed = false;
let pendingManaRegen = new Decimal(0);
let pendingHpRegen = new Decimal(0);
let pendingKnightDmg = new Decimal(0);
let pendingEnemyDmg = new Decimal(0);
function gotoLevel(i) {
	i = Decimal(i);
	player.level = i;
	clearInterval(deathDelay);
	document.getElementById("pause").checked = false;
	enemy.attackSpeed = Decimal(1).plus(i.times(2/175).minus(50*2/175)).times(priest.slow.div(100)); //+4 attacks/s per 400 levels
	enemy.gold = (enemy.baseGold.times(scaling.enemyGold.toPower(i.minus(1))).times(Decimal(1).plus(priest.fireMagic.dividedBy(100)))).times(player.goldBonus.div(100));
	enemy.maxHp = enemy.baseMaxHp.times(scaling.enemyMaxHp.toPower(i.minus(1))).div(5).round().times(5);
	enemy.dmg = enemy.baseDmg.times(scaling.enemyDmg.toPower(i.minus(1)));
	enemy.power = (priest.curse).div(100);
	enemy.exp = (Decimal(2).plus((i.minus(1)).times(0.5))).times(scaling.enemyExp.toPower(i.minus(1))); //2+0.5*i, then scaling
	let crippleFactor = archer.cripple.toNumber()/100;
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
	sub100Helper = 0.67 + i * 0.0033 // 70% power at lvl 0, 100% power at lvl 100, linearly scaling
	if(i.lt(100)) {enemy.maxHp=enemy.maxHp.times(sub100Helper);enemy.dmg=enemy.dmg.times(sub100Helper);enemy.gold=enemy.gold.dividedBy(sub100Helper)}
	enemy.gold = enemy.gold.times(1+i.toNumber()/100);
	enemy.gold = enemy.gold.div(0.5).round().times(0.5);
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

function getValue(a,b,c,n) {	//a - base; b - additive gain; c - multiplicative gain; n - level
	//The additive gain is applied before the multiplicative gain.
	if(c.eq(1)) {
		return a.plus(b.times(n));
	} else {
		return c.toPower(n-1).times(a).plus(b.times(c).times(c.toPower(n-1).minus(1)).dividedBy(c.minus(1)));
	}
}
function getValueTest(a,b,c,n) {	//a - base; b - additive gain; c - multiplicative gain; n - level
	//The additive gain is applied before the multiplicative gain.
	a=Decimal(a);
	b=Decimal(b);
	c=Decimal(c);
	if(c.eq(1)) {
		return a.plus(b.times(n)).toNumber();
	} else {
		return c.toPower(n-1).times(a).plus(b.times(c).times(c.toPower(n-1).minus(1)).dividedBy(c.minus(1))).toNumber();
	}
}
exclusionsHmm = ["freePLvls", "manaPotionStrength", "blockChance", "critChance", "fireMagic", "manaRegen", "skillsUnlocked", "autoBuyUnlocked"];
function calc(up, lvl) { //up is upgrade name as string, lvl is array of targetStatUpgrades
	let result = Decimal(0);
	const target = upgrades[up];
	const targetStatUpgrades = statUpgrades[target.user][target.stat];
	if(lvl === undefined) {lvl = getStatUpgradesBought(up)};
	if (up === "healCost") {
		result = target.base.times(scaling.healUpMana.toPower(upgrades.healUp1.bought+upgrades.healUp2.bought)).times(1+upgrades.fireMagic.bought*0.01);
		result = result.plus(target.flatScaling.times(lvl[0])).times(target.scaling.toPower(lvl[0]));
	} else {
		for(let upIndex = 0; upIndex<targetStatUpgrades.length; upIndex++) {
			let tar = upgrades[targetStatUpgrades[upIndex]];
			let providedLevel = lvl[upIndex];
			if(!tar.base.eq(-1)) {
				result = tar.base;
			}
			if(exclusionsHmm.includes(tar.stat)) {
				result = getValue(result, tar.flatScaling, tar.scaling, providedLevel);
			} else {
				result = getValue(result, tar.flatScaling, tar.scaling, providedLevel+1)
			}
		}
	}
	if(statUpgrades.scalesWithExp.indexOf(target.user+"."+target.stat)!==-1) {
		result = result.times(scaling.expPow.toPower(player.pLvl.minus(1).plus(player.freePLvls)))
	}
	if((target.user+"."+target.stat==="priest.power" || target.user+"."+target.stat==="priest.maxMana") && upgrades.blessing.bought===1) {result=result.times(3)}
	return result;
}
function getStep(num) { //Kinda shit quality.
	num = Decimal(num);
	let result = 0;
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
	return upgrades[tar.requiredUpgrade].bought === upgrades[tar.requiredUpgrade].maxLevel;
}
function format(num, places, lowplaces, fixedplaces) {
	num = new Decimal(num);
	let negative = false;
	if(num.lt(0)) {
		negative=true;
		num=num.neg();
	}
	if(places===undefined) {places=3}
	if(lowplaces===undefined) {lowplaces=2}
	if(fixedplaces===undefined) {fixedplaces=-1}
	let result;
	let thing = [-1, 0];
	if(num.lt(1)) {
		result = num.toNumber().toPrecision(lowplaces);
	} else if(num.lt(1e3)) {
		if(num.gt(999)) {
			result = num.floor().toNumber().toPrecision(places);
		} else {
			result = num.toNumber().toPrecision(places);
		}
	} else {
		if(num.lt(1e15)) {
			thing = getStep(num);
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
	if(player.gold.gte(upgrades[tar].cost.times(actualBuyBulk)) && upgrades[tar].unlocked && hasUpgradeRequirement(upgrades[tar])) {
		upgrades[tar].bought += actualBuyBulk;
		player.gold = player.gold.minus(upgrades[tar].cost.times(calcBuyBulk(upgrades[tar].costScaling.minus(1), actualBuyBulk)));
		updateStats();
		$("#"+tar+"Button").css("animation-name","blink");
		setTimeout(function(){
			$("#"+tar+"Button").css("animation-name","");
		},200);
	}
}

function buySkillPoint() {
	if(player.exp.gt(player.skillPointCost)) {
		player.skillPoints=player.skillPoints.plus(1);
		player.totalSkillPoints=player.totalSkillPoints.plus(1);
		player.exp=player.exp.minus(player.skillPointCost);
		player.skillPointCost=player.skillPointCost.times(scaling.skillPointCost);
		document.getElementById("buySkillPointButton").textContent = "Buy skill point - "+format(player.skillPointCost)+" XP";
	}
}

function createUpgradeButton(tar) {
	let elem = document.createElement("div");
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
	let user = document.getElementById(upgrades[tar].user + "Upgrades");
	let text1 = document.createElement("span");
	let text2 = document.createElement("span");
	let image = document.createElement("img");
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
	let tooltip = document.createElement("div");
	tooltip.id = tar + "ButtonTooltip";
	tooltip.className = "tooltip";
	user.appendChild(tooltip);
}
function createSkillButton(tar) {
	let elem = document.createElement("div");
	elem.id = tar + "SkillButton";
	elem.className = "skillButton path"+skills[tar].path;
	elem.onclick = function() {buySkill(tar)};
	elem.onmouseover = function() {$("#"+tar+"SkillButtonTooltip").css("display","inline-block")};
	elem.onmouseout = function() {$("#"+tar+"SkillButtonTooltip").css("display","none")};
	let tooltip = document.createElement("div");
	tooltip.id = tar + "SkillButtonTooltip";
	tooltip.className = "tooltip skillTooltip";
	let skillWrapper = document.getElementById("skillWrapper");
	skillWrapper.append(elem);
	skillWrapper.append(tooltip);
	$("#"+tar+"SkillButton").css("background-image","url(dat/"+tar+".png)");
}
function updateStats() {
	for(var i in upgrades) {
		var target = upgrades[i];
		if(target.minEnemyLevel < player.maxLevel && hasUpgradeRequirement(target)) {
			target.unlocked = true;
		}
		if(target.unlocked) {
			target.cost = Decimal(10).times(target.baseCost).times(target.costScaling.toPower(target.bought)).plus(target.bought*3.25);
			$("#"+i+"Button").css("display","inline-block");
		} else {
			upgrades[i].cost = Decimal(Infinity);
			$("#"+i+"Button").css("display","none");
		}
		if(target.bought>=target.maxLevel && target.maxLevel!==-1) {
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
for(let i in upgrades) {
	createUpgradeButton(i);
}
for(let i in skills) {
	createSkillButton(i);
}
function updateButtonText() { //This is quite heavy performance wise.
	for(let i in upgrades) {
		var target = document.getElementById(i + "ButtonText1");
		var tar = upgrades[i];
		target.textContent = tar.buttonText.replace("X", format(upgrades[i].buttonCalc(i)));
		target = document.getElementById(i + "ButtonText2");
		actualBuyBulk = buyBulk;
		if(tar.maxLevel-tar.bought<buyBulk && tar.maxLevel!==-1) {actualBuyBulk=tar.maxLevel-tar.bought};
		target.textContent = "\n" + format(tar.cost.times(calcBuyBulk(tar.costScaling.minus(1), actualBuyBulk))) + " Gold";
		target = document.getElementById(i + "ButtonTooltip");
		let boughtText = "Bought: "+tar.bought;
		if(document.getElementById("showMaxLevels").checked) {boughtText += " {"+tar.maxLevel+"}"}
		boughtText = boughtText.replace("-1", "∞")
		if(upgrades[i].displayPercentage) {
			target.textContent = tar.tooltip + "\n\n" + tar.tooltipStatName + ":\n" + format(window[tar.user][tar.stat]) + "% -> " +format(eval(tar.tooltipCalc)) + "%\n\n"+boughtText;
		} else if(upgrades[i].upgradeUnlocker) {
			target.textContent = tar.tooltip + "\n\nUnlocked:\nFalse -> True";
		} else {
			target.textContent = tar.tooltip + "\n\n" + tar.tooltipStatName + ":\n" + format(window[tar.user][tar.stat]) + " -> " +format(eval(tar.tooltipCalc)) + "\n\n"+boughtText;
		}
	}
	for(let i in skills) {
		let tar = skills[i];
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
		while(enemy.attackReq.gte(1) && player.level.gte(upgrades.maxHp1.minEnemyLevel)) {
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
var lastZoneTime = Date.parse(Date());
var baseKillGoal = 3
var killGoal = baseKillGoal;
if(autoPlayTest) {
	setInterval(function(){buyCheapest()},100);
	setInterval(function(){if(player.kills.gt(killGoal)) {document.getElementById("autoProgress").checked=true}},100)
}
function checkDeath() {
	if(knight.hp.lte(0)) {
		knight.hp = Decimal(0);
		pendingHpRegen = Decimal(0);
		pendingManaRegen = Decimal(0);
		pendingKnightDmg = Decimal(0);
		pendingEnemyDmg = Decimal(0);
	} 
	if(enemy.hp.lte(0)) {
		enemy.hp = Decimal(0);
		pendingHpRegen = Decimal(0);
		pendingManaRegen = Decimal(0);
		pendingKnightDmg = Decimal(0);
		pendingEnemyDmg = Decimal(0);
	}
	if(knight.hp.lte(0) || enemy.hp.lte(0)) {
		document.getElementById("pause").checked = true;
		deathTimer = 1/(archer.attackSpeed**0.71533828)*1000; //1 second at first, 2/3rds of a second later, 1/10ths of a second at cap.
		if(knight.hp.lte(0)) {
				player.deaths = player.deaths.plus(1);
		} else if(enemy.hp.lte(0)) {
				player.kills = player.kills.plus(1);
				player.gold = player.gold.plus(enemy.gold);
				player.totalGold = player.totalGold.plus(enemy.gold);
				player.exp = player.exp.plus(enemy.exp);
		}
		deathDelay = setTimeout(function() {
			if(knight.hp.lte(0)) {
				player.level === 1 ? gotoLevel(player.level) : gotoLevel(player.level.minus(1));
				document.getElementById("autoProgress").checked=false;
				if(player.kills.gt(killGoal)) {killGoal += Math.floor(Math.random()*7)}
			} else if(enemy.hp.lte(0)) {
				if(player.level.eq(player.maxLevel)) {
					player.maxLevel=player.maxLevel.plus(1);
					usefulData.push({zone: player.level.toNumber(), time: (Math.round(new Date().getTime()-lastZoneTime)/gameTickSpeed), kills: player.kills.toNumber(), killGoal: killGoal});
					console.log({zone: player.level.toNumber(), time: (Math.round(new Date().getTime()-lastZoneTime)/gameTickSpeed), kills: player.kills.toNumber(), killGoal: killGoal})
					lastZoneTime = new Date().getTime();
					player.kills = Decimal(0);
					killGoal = baseKillGoal;
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
var autoBuyActive = true;
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
const statisticsExclusions = [["player", "skillsUnlocked"], ["player", "level"], ["fps"], ["player", "visualFps"], ["player", "fps"]];
function testIt(toTest) { //change these names what the hell man
	for(let i in statisticsExclusions) {
		let thing = statisticsExclusions[i];
		if(thing[0] === toTest[0] && thing[1] === toTest[1]) {
			return true;
		}
	}
	return false;
}
function updateStatistic(name) {
	let tar = document.getElementById(name + "Statistics");
	tar.textContent = "";
	window[name+"Header"] = document.createElement("span");
	window[name+"Header"].textContent = (name.charAt(0).toUpperCase() + name.slice(1)) + " Stats";
	tar.appendChild(window[name+"Header"]);
	tar.appendChild(document.createElement("br"));
	let object = window[name];
	for(let a in object) {
		if(testIt([name, a])) {
			continue;
		}
		let elem = document.createElement("span");
		let value = "nope";
		Decimal.isDecimal(object[a]) ? value = format(object[a]) : value = object[a];
		elem.textContent = a + ": " + value;
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
	for(let i in upgrades) {
		let actualBuyBulk = buyBulk;
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
	if(player.maxLevel.gt(unlockLevels.buyCheapest)) {$("#buyCheapestButton").css("display", "inline")};
	showEnemyGold = document.getElementById("showEnemyGold").checked;
	autoBuyActive = document.getElementById("toggleAutobuy").checked;
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
	if(upgrades.autoBuyUnlock.bought===1) {
		$("#toggleAutobuy, #toggleAutobuyText").css("display", "inline");
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
	if(player.pLvl.plus(player.freePLvls).gt(1000)) {
		$("#expTooltip").text("Each level increases the archer's damage, the knight's maximum health and the priest's healing by "+scaling.expPow.minus(1).times(100).toNumber()+"%.\n\n Current Bonus:\n"+format(scaling.expPow.toPower(player.pLvl.plus(player.freePLvls).minus(1)).minus(1).times(100))+"%");
		$("#expTooltip").css("top", "-165px");
	} else {
		$("#expTooltip").text("Each level increases the archer's damage, the knight's maximum health and the priest's healing by "+scaling.expPow.minus(1).times(100).toNumber()+"%.\n\n Current Bonus:\n"+(scaling.expPow.toPower(player.pLvl.plus(player.freePLvls).minus(1)).minus(1).times(100)).round().toNumber().toLocaleString()+"%");
		$("#expTooltip").css("top", "-150px");
	}
	if(upgrades.skillsUnlock.bought===1) {
		$("#tab2Button").css("display", "inline");
		$("#skillPoints").text("Skill points: "+player.skillPoints.floor().toNumber()+"/"+player.totalSkillPoints.floor().toNumber());
	}
	let nextUpgrade = 5;
	for(let i in upgradeUnlockLevels) {
		let up = upgradeUnlockLevels[i];
		if(up>player.maxLevel.toNumber()) {
			nextUpgrade = up;
			break;
		}
	}
	document.getElementById("nextUpgradeUnlockLevel").textContent = "Next upgrade at Zone "+nextUpgrade;
	let skillPointButton = document.getElementById("buySkillPointButton");
	skillPointButton.textContent = "Buy skill point - "+format(player.skillPointCost)+" XP";
	player.exp.gt(player.skillPointCost) ? skillPointButton.style.color="green" : skillPointButton.style.color="red";
	if(player.gold.gt(player.totalGold)) {player.cheated=true}
	updateStats();
	updateButtonText();
}
function updateVisuals() {
	$("#enemyHp").text(format(enemy.hp) + " / " + format(enemy.maxHp));
	$("#enemyHp").css({
		"width": ((enemy.hp.div(enemy.maxHp)) * 450)
	});
	if(archer.attackSpeed.lt(5) && !hideAttackBars.checked) {
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
	if(enemy.attackSpeed.lt(4) && !hideAttackBars.checked) {
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
	if(priest.castSpeed.lt(4.99) && priest.castReq.gt(0) && !hideAttackBars.checked) {
		$("#castBar").css({
			"width": ((priest.castReq) * 450),
			"display": "inline"
		})
	} else {
		$("#castbar").css({
			"display": "none"
		})
	}
	}
	$("#expText").text(format(player.exp)+" / "+format(player.expReq));
	$("#expBar").css("width", (player.exp.div(player.expReq)*100)+"%");
}
function checkOverflow() {
	if(knight.hp.gt(knight.maxHp)) {knight.hp=knight.maxHp};
	if(enemy.hp.gt(enemy.maxHp)) {enemy.hp=enemy.maxHp};
	if(priest.mana.gt(priest.maxMana)) {priest.mana=priest.maxMana};
	if(priest.mana.lte(0.25)) {priest.mana=Decimal(0)};
	for(let i in upgrades) {
		if(upgrades[i].maxLevel<upgrades[i].bought && upgrades[i].maxLevel>0) {
			upgrades[i].bought=upgrades[i].maxLevel;
		}
	}
	player.expReq=Decimal(100).plus(Decimal(100).times(player.pLvl-1)).times(scaling.expReq.toPower(player.pLvl-1));
	while(player.exp.gte(player.expReq)) {
		player.pLvl=player.pLvl.plus(1);
		player.exp=player.exp.minus(player.expReq);
		player.expReq=Decimal(100).plus(Decimal(100).times(player.pLvl-1)).times(scaling.expReq.toPower(player.pLvl-1));
	}
}
function loop() {
	combat();
	checkOverflow();
	window.setTimeout(loop, gameTickSpeed / player.fps);
}
function visualLoop() {
	updateVisuals();
	window.setTimeout(visualLoop, gameTickSpeed / player.visualFps);
}
var offlineAutoBuys = 0;
function autoBuyLoop() {
	if(upgrades.autoBuyUnlock.bought===1 && !paused && autoBuyActive) {
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
		for(let i = 1; i < keys.length; i++) {
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
	for(let i = 1; i < keys.length; i++) {
		if(upgrades[keys[i]].cost.lt(value)) {
			value = upgrades[keys[i]].cost;
			index = i;
		}
	}
	return index;
}
$(window).keydown(function(e) { //Key bindings; Keybindings
	switch(e.key) {
		case "a":
		case "A":
			document.getElementById("autoProgress").click();
			break;
		case "b":
		case "B":
			if(player.maxLevel.gte(unlockLevels.buyCheapest)) {
				buyCheapest();
			}
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
		case "p":
		case "P":
			var lostLvl = Number(prompt("Mis levelil olid? Vasta ausalt pls"));
			if(lostLvl>0) {
				player.maxLevel=Decimal(lostLvl);
				gotoLevel(lostLvl);
				player.gold=enemy.gold.times(50);
				player.exp=enemy.exp.times(100);
			}
			break;
	}
});
var playerVarsBL = ["bulkAmount"];
function save() {
	let playersave = {};
	for(let i in player) {
		if(playerVarsBL.indexOf(i)===-1) {
			playersave[i]=player[i];
		}
	}
	let upgradessave = {};
	for(let i in upgrades) {
		upgradessave[i] = {bought: upgrades[i].bought};
	}
	let prefsSave = [];
	prefsSave.push(player.fps);
	prefsSave.push(slowVisuals);
	prefsSave.push(showEnemyGold);
	prefsSave.push(document.getElementById("scientific").checked);
	prefsSave.push(autoBuyActive);
	prefsSave.push(document.getElementById("hideAttackBars").checked);
	prefsSave.push(document.getElementById("showMaxLevels").checked)
	localStorage.setItem("playersave", JSON.stringify(playersave));
	localStorage.setItem("upgradessave", JSON.stringify(upgradessave));
	localStorage.setItem("preferences", JSON.stringify(prefsSave));
	//console.log("Saved!");
}
function load() {
	var upgradessave = JSON.parse(localStorage.getItem("upgradessave"));
	var playersave = JSON.parse(localStorage.getItem("playersave"));
	var prefsSave = JSON.parse(localStorage.getItem("preferences"));
	for(var a in playersave) {typeof playersave[a] === "boolean" ? player[a] = playersave[a] : player[a]=Decimal(playersave[a])}
	for(var b in upgradessave) {if(upgrades[b]!==undefined) {upgrades[b].bought=upgradessave[b].bought}};
	for(var c in prefsSave) {prefs[c]=prefsSave[c]};
	document.getElementById("fpsSlider").value=prefs[0];
	document.getElementById("slowVisuals").checked=prefs[1];
	document.getElementById("showEnemyGold").checked=prefs[2];
	document.getElementById("scientific").checked=prefs[3];
	document.getElementById("toggleAutobuy").checked=prefs[4];
	document.getElementById("hideAttackBars").checked=prefs[5];
	document.getElementById("showMaxLevels").checked=prefs[6];
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
autoBuyLoop();
document.title = "Zone " + player.level;
setInterval(function() {
	updateInactiveVisuals();
}, 300);
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
let offlineGain = [new Decimal(0)];
let newTime = (Date.parse(Date())/1000)-1;
let timeArray = new Array;
newTime-player.lastTime>=60 ? timeArray = [60,1,1,1,1,1,1,1,1,1] : timeArray = [1,1,1,1,1,1,1,1,1,1]; //Don't reset player.lastTime if it's over 60 seconds behind current time.
function claimOfflineProgress() {
	player.gold=player.gold.plus(offlineGain[0]);
	player.totalGold=player.totalGold.plus(offlineGain[0]);
	player.exp=player.exp.plus(offlineGain[1]);
	document.title = "Zone " + player.level;
	newTime = Decimal(Date.parse(Date())/1000).minus(1);
	player.lastTime = newTime;
	timeArray = [1,1,1,1,1,1,1,1,1,1];
	$("#offlineProgressWrapper").css("display", "none");
	document.getElementById("pause").checked=false;
	paused=false;
	//console.log(offlineAutoBuys);
	//console.log("starting to buy cheapest...");
	//window.setTimeout(function(){
	//	for(var n=0;n<offlineAutoBuys;n++) {
	//		console.log("buying cheapest");
	//		buyCheapest();
	//	}
	//},1000);
}
function add(a,b) {return a+b};
function formatTime(t) {
	let hours = Math.floor(t/3600);
	let seconds = t-hours*3600;
	let minutes = Math.floor(seconds/60);
	seconds -= minutes*60;
	return [seconds, minutes, hours];
}
function getDPS() {
	return archer.dmg.times(archer.attackSpeed).times(archer.critFactor.toPower(archer.critChance.div(100)).div(priest.curse.div(100)));
}
let timeSum = 0;
function timeDecay(x) {
	let result = (x*5.8)**0.7; //anything <= to 1 minute is 100%, 10 minutes = 50.2%, 100 minutes = 25.2%, 600 minutes = 12.6%, 6000 minutes = 6.3%
	if(result/x>1) {result = x};
	return result; //so now, 10x more time = 5x more gold(when offline).
}
currOverallGrowthSpeed = Decimal(1);
let paused = false;
setInterval(function() {
	newTime = Decimal(Date.parse(Date())/1000).minus(1);
	timePassed = newTime-player.lastTime;
	let offlineKills = getDPS().div(enemy.maxHp).times(timeDecay(timePassed));
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
	let displayTimePassed = formatTime(timePassed);
	let textElem = $("#offlineProgressText");
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
},5000);
window.onbeforeunload = function(e) {
	if(!stopSaving) {
		save();
	}
};
for(let i in upgrades) {
	document.getElementById(i+"ButtonImage").src = "dat/"+i+".png";
}
if(localStorage.preferences===undefined) {
	document.getElementById("slowVisuals").checked=false;
	document.getElementById("showEnemyGold").checked=false;
	document.getElementById("scientific").checked=false;
}
