var cheat = false;
var goldPowerRatio = 0.95;
var scaling = {
	enemyPower: 1.24,
	enemyGold: 1.24 ** (1 / goldPowerRatio),
	enemyXp: 1.01**(1/3),
	xpReq: 1.01,
	power: 1.24 ** (1/3),
	//24% enemy power each level, 3 upgrades each level to compensate
	//each upgrade must give 1.0707796367603126x power for perfect scaling
	upgradeCost: 1.0707796367603126 ** (1 / goldPowerRatio),
	manaCostInc: 1.07,
	manaCostDec: 0.97,
	mana: 1.0379,
	hp: 1.0445,
	dmgIgnore: 1.0201,
	crit: 0.99,
	archerDmg:  1.0657467378823113,
	//1.24**1/3 = perfect scaling
	attackSpeed: 1.0837983867343681,
	enemyAttackSpeed: 1.056467308549538
};
var blessScaling = {
	cost: scaling.enemyGold ** 25,
	hp: 1.13,
	dmg: 1.125,
	gold: 1.1
	//with blessings, fall behind hp by 0.1484766% per 25 upgrades
	//with blessings, dmg will not fall behind
};
var hottickspersec = 20;
var player = {
	places: "3",
	format: 'standard',
	flavor: 'short',
	gold: 0,
	totalgold: 0,
	level: 1,
	maxLevel: 1,
	attackSpeed: 1,
	attackreq: 0,
	bulkAmount: 1,
	maxbulkAmount: 0,
	kills: 0,
	deaths: 0,
	fps: 30,
	visualFps: 30,
	xp: 0,
	xpReq: 1e308,
	xpLevel: 1
};
var f = new numberformat.Formatter({
	format: player.format,
	sigfigs: player.places,
	flavor: player.flavor
});
var healer = {
	power: 0,
	cost: 0,
	mana: 0,
	critChance: 0,
	maxMana: 0,
	manaRegen: 0,
	castSpeed: 0,
	castreq: 0,
	autohealspeed: 50,
	autohealreq: 0,
	hottimer: 0,
	hotamount: 0
};
var hero = {
	hp: 0,
	maxHp: 0,
	blockChance: 0,
	blockFactor: 0,
	armor: 0,
	absorbs: 0
};
var archer = {
	dmg: 0,
	critChance: 0,
	critFactor: 0
};
var enemy = {
	basehp: 77,
	basedmg: 56,
	basegold: 50,
	basexp: 5,
	armor: 1,
	attackSpeed: 1,
	attackreq: 0
};
var upgrades = {
	dmg: {
		bought: 0,
		tooltip: "Increases damage.",
		maxLevel: -1,
		minEnemyLevel: 0,
		baseCostInc: 0
	},
	maxHp: {
		bought: 0,
		tooltip: "Increases maximum health and base health.",
		maxLevel: -1,
		minEnemyLevel: 5,
		baseCostInc: 15
	},
	armor: {
		bought: 0,
		tooltip: "Divides incoming damage.",
		maxLevel: -1,
		minEnemyLevel: 10,
		baseCostInc: 30
	},
	healUp: {
		bought: 0,
		tooltip: "Increases the power of healing at the cost of efficiency.",
		maxLevel: -1,
		minEnemyLevel: 15,
		baseCostInc: 45
	},
	healCost: {
		bought: 0,
		tooltip: "Makes healing cost less mana.",
		maxLevel: -1,
		minEnemyLevel: 20,
		baseCostInc: 60
	},
	maxMana: {
		bought: 0,
		tooltip: "Increases maximum mana.",
		maxLevel: -1,
		minEnemyLevel: 25,
		baseCostInc: 75
	},
	attackSpeed: {
		bought: 0,
		tooltip: "Increases your attack speed and slightly increases enemy attack speed.",
		maxLevel: 20,
		minEnemyLevel: 30,
		baseCostInc: 90
	},
	critChance: {
		bought: 0,
		tooltip: "Increases the chance to crit, multiplying damage.",
		maxLevel: 986,
		minEnemyLevel: 35,
		baseCostInc: 105
	},
	blockChance: {
		bought: 0,
		tooltip: "Chance to block, dividing incoming damage.",
		maxLevel: 986,
		minEnemyLevel: 40,
		baseCostInc: 120
	},
	healerCritChance: {
		bought: 0,
		tooltip: "Increases the chance for healing to be doubled.",
		maxLevel: 986,
		minEnemyLevel: 45,
		baseCostInc: 135
	},
	castSpeed: {
		bought: 0,
		tooltip: "Decreases the amount of time needed to heal.",
		maxLevel: 30,
		minEnemyLevel: 50,
		baseCostInc: 150
	},
	manaRegen: {
		bought: 0,
		tooltip: "Passively recovers mana based on maximum mana.",
		maxLevel: 10,
		minEnemyLevel: 55,
		baseCostInc: 165
	},
	critFactor: {
		bought: 0,
		tooltip: "Increases the effect of crit.",
		maxLevel: -1,
		minEnemyLevel: 60,
		baseCostInc: 180
	},
	blockFactor: {
		bought: 0,
		tooltip: "Increases the effect of blocking.",
		maxLevel: -1,
		minEnemyLevel: 65,
		baseCostInc: 195
	},
	healHot: {
		bought: 0,
		tooltip: "Adds a heal over time effect to healing, based on heal power. Lasts 10 seconds and stacks.",
		maxLevel: -1,
		minEnemyLevel: 70,
		baseCostInc: 210
	}
};
var blessings = {
	hp: {
		label: "+13% hero health",
		bought: 0,
		tooltip: "Increases maximum health.",
		minEnemyLevel: 75
	},
	healUp: {
		label: "+13% heal power",
		bought: 0,
		tooltip: "Increases healing power.",
		minEnemyLevel: 80
	},
	dmg: {
		label: "+12.5% damage",
		bought: 0,
		tooltip: "Increases damage.",
		minEnemyLevel: 85
	},
	gold: {
		label: "+10% gold gained",
		bought: 0,
		tooltip: "Increases all gold gained.",
		minEnemyLevel: 90
	},
	bulkAmount: {
		label: "+1 bulk amount",
		bought: 0,
		tooltip: "Increases the amount of cheapest upgrades bought with each click.",
		minEnemyLevel: 95
	}
};
/////////////
//Functions//
/////////////
function gotoLevel(dest) {
	player.level = dest;
	try {
		clearTimeout(deathDelay);
		document.getElementById("pause").checked = false;
	} catch (e) {
		console.log("No player death delay to clear!; " + e);
	}
	updateStats();
	if(dest > 20) {
		enemy.basehp = 77 * (1 + (dest - 20) * 0.075);
		enemy.basedmg = 56 * (1 + (dest - 20) * 0.075);
	}
	//TODO: Change Number.isInteger to modulus %. Maybe use switch instead of the ifelses?
	if(Number.isInteger(player.level / 1000)) {
		enemy.maxHp = enemy.basehp * 6;
		enemy.dmg = enemy.basedmg * 3;
		enemy.gold = enemy.basegold * 5;
	} else
	if(Number.isInteger(player.level / 100)) {
		enemy.maxHp = enemy.basehp * 4;
		enemy.dmg = enemy.basedmg * 2;
		enemy.gold = enemy.basegold * 3;
	} else
	if(Number.isInteger(player.level / 10)) {
		enemy.maxHp = enemy.basehp * 2;
		enemy.dmg = enemy.basedmg * 1.5;
		enemy.gold = enemy.basegold * 2;
	} else if(Number.isInteger((player.level + 1) / 10)) { //If level=9, 19, 29 etc
		enemy.maxHp = enemy.basehp * 1.1;
		enemy.dmg = enemy.basedmg * 1.1;
		enemy.gold = enemy.basegold * 1.15;
	} else if(Number.isInteger((player.level + 2) / 10)) { //level=8
		enemy.maxHp = enemy.basehp * 1.08;
		enemy.dmg = enemy.basedmg * 1.08;
		enemy.gold = enemy.basegold * 1.12;
	} else if(Number.isInteger((player.level + 3) / 10)) { //level=7
		enemy.maxHp = enemy.basehp * 1.06;
		enemy.dmg = enemy.basedmg * 1.06;
		enemy.gold = enemy.basegold * 1.09;
	} else if(Number.isInteger((player.level + 4) / 10)) { //level=6
		enemy.maxHp = enemy.basehp * 1.04;
		enemy.dmg = enemy.basedmg * 1.04;
		enemy.gold = enemy.basegold * 1.06;
	} else if(Number.isInteger((player.level + 5) / 10)) { //level=5
		enemy.maxHp = enemy.basehp * 1.02;
		enemy.dmg = enemy.basedmg * 1.02;
		enemy.gold = enemy.basegold * 1.03;
	} else {
		enemy.maxHp = enemy.basehp;
		enemy.dmg = enemy.basedmg;
		enemy.gold = enemy.basegold;
	}
	enemy.maxHp *= scaling.enemyPower ** (player.level - 1);
	enemy.dmg *= scaling.enemyPower ** (player.level - 1);
	enemy.gold *= scaling.enemyGold ** (player.level - 1);
	enemy.gold *= blessScaling.gold ** (blessings.gold.bought);
	enemy.xp = enemy.basexp + 0.5 * (player.level - 1);
	enemy.xp *= scaling.enemyXp ** (player.level - 1);
	if(upgrades.attackSpeed.bought === upgrades.attackSpeed.maxLevel) {
		enemy.attackSpeed = 3;
	} else {
		enemy.attackSpeed = scaling.enemyAttackSpeed ** (upgrades.attackSpeed.bought);
	}
	healer.castreq = 0;
	healer.mana = healer.maxMana;
	hero.hp = hero.maxHp;
	healer.hotamount = 0;
	healer.hottimer = 0;
	enemy.hp = enemy.maxHp;
	player.attackreq = 0;
	enemy.attackreq = 0;
	healer.autohealreq = 0;
	var templevel = player.level;
}
gotoLevel(1);
function getZeroes(input) {
	var num = 0;
	while(input < 1) {
		input *= 10;
		num += 1;
	}
	return num;
}
function updateCosts() {
	for(var name in upgrades) {
		upgrades[name].cost = upgrades[name].bought + 15 * Math.pow(scaling.upgradeCost, upgrades[name].bought + (upgrades[name].baseCostInc));
	}
	for(var name in blessings) {
		blessings[name].cost = 1e10 * Math.pow(blessScaling.cost, blessings[name].bought);
	}
	upgrades.attackSpeed.cost = (1e6 + upgrades.attackSpeed.bought * 3e5) * Math.pow(1.3, upgrades.attackSpeed.bought);
	upgrades.castSpeed.cost = (5e7 + upgrades.castSpeed.bought * 1e6) * Math.pow(1.15, upgrades.castSpeed.bought);
	upgrades.manaRegen.cost = (2.5e7 + upgrades.manaRegen.bought * 5e6) * Math.pow(1.45, upgrades.manaRegen.bought);
	upgrades.healHot.cost = (5000 + upgrades.healHot.bought * 250) * Math.pow(1.11042, upgrades.healHot.bought);
	blessings.bulkAmount.cost = 1e9 * Math.pow(1000, blessings.bulkAmount.bought);
	//Update the prices
	for(var i in upgrades) {
		$("#" + i).text("XYZ - " + f.format(upgrades[i].cost) + " Gold");
		var out = 0;
		var zeroes = 0;
		switch (i) {
			case "dmg":
				if(archer.dmg * (scaling.archerDmg - 1) < Math.pow(10, player.places)) {
					$("#dmg").text($("#dmg").text().replace("XYZ", "+" + ((archer.dmg * (scaling.archerDmg - 1)).toPrecision(player.places) + " dmg")));
				} else {
					$("#dmg").text($("#dmg").text().replace("XYZ", "+" + (f.format(archer.dmg * (scaling.archerDmg - 1)) + " dmg")));
				}
				break;
			case "maxHp":
				$("#maxHp").text($("#maxHp").text().replace("XYZ", "+" + (f.format(calc(2, upgrades.maxHp.bought + 1) * blessScaling.hp ** blessings.hp.bought  * 1.01 ** player.xpLevel - hero.maxHp)) + " max hp"));
				break;
			case "armor":
				if(10 ** player.places > hero.armor * (scaling.dmgIgnore - 1)) {
					$("#armor").text($("#armor").text().replace("XYZ", "+" + (hero.armor * (scaling.dmgIgnore - 1)).toPrecision(3) + " armor"));
				} else {
					$("#armor").text($("#armor").text().replace("XYZ", "+" + f.format(hero.armor * (scaling.dmgIgnore - 1)) + " armor"));
				}
				break;
			case "critChance":
				out = ((100 - (100 - archer.critChance) * scaling.crit) - (archer.critChance));
				zeroes = getZeroes(out);
				$("#critChance").text($("#critChance").text().replace("XYZ", "+" + out.toFixed(zeroes + 1) + "% crit chance"));
				break;
			case "blockChance":
				out = ((100 - (100 - hero.blockChance) * scaling.crit) - (hero.blockChance));
				zeroes = getZeroes(out);
				$("#blockChance").text($("#blockChance").text().replace("XYZ", "+" + out.toFixed(zeroes + 1) + "% block chance"));
				break;
			case "healUp":
				if(healer.power * (scaling.hp - 1) < Math.pow(10, player.places)) {
					$("#healUp").text($("#healUp").text().replace("XYZ", "+" + (calc(1, upgrades.healUp.bought + 1) * blessScaling.hp ** blessings.healUp.bought - healer.power * 1.01 ** player.xpLevel).toPrecision(player.places) + " heal power, +" + (calc(3, upgrades.healUp.bought + 1, upgrades.healCost.bought) - healer.cost).toPrecision(player.places) + " cost"));
				} else {
					$("#healUp").text($("#healUp").text().replace("XYZ", "+" + f.format(calc(1, upgrades.healUp.bought + 1) * blessScaling.hp ** blessings.healUp.bought * 1.01 ** player.xpLevel - healer.power) + " heal power, +" + f.format(calc(3, upgrades.healUp.bought + 1, upgrades.healCost.bought) - healer.cost) + " cost"));
				}
				break;
			case "healCost":
				if(healer.cost - (calc(3, upgrades.healUp.bought, upgrades.healCost.bought + 1)) < 10 ** player.places) {
					$("#healCost").text($("#healCost").text().replace("XYZ", "-" + (healer.cost - (calc(3, upgrades.healUp.bought, upgrades.healCost.bought + 1))).toPrecision(player.places) + " heal cost"));
				} else {
					$("#healCost").text($("#healCost").text().replace("XYZ", "-" + f.format(healer.cost - (calc(3, upgrades.healUp.bought, upgrades.healCost.bought + 1))) + " heal cost"));
				}
				break;
			case "attackSpeed":
				$("#attackSpeed").text($("#attackSpeed").text().replace("XYZ", "+" + (scaling.attackSpeed ** (upgrades.attackSpeed.bought + 1) - player.attackSpeed).toPrecision(2) + " attacks/s"));
				break;
			case "maxMana":
				$("#maxMana").text($("#maxMana").text().replace("XYZ", "+" + f.format(calc(4, upgrades.maxMana.bought + 1) - healer.maxMana) + " max mana"));
				break;
			case "manaRegen":
				$("#manaRegen").text($("#manaRegen").text().replace("XYZ", "+0.4% mana regen"));
				break;
			case "critFactor":
				$("#critFactor").text($("#critFactor").text().replace("XYZ", "+2.5% crit factor"));
				break;
			case "blockFactor":
				$("#blockFactor").text($("#blockFactor").text().replace("XYZ", "+2.5% block factor"));
				break;
			case "healerCritChance":
				out = ((100 - (100 - healer.critChance) * scaling.crit) - (healer.critChance));
				zeroes = getZeroes(out);
				$("#healerCritChance").text($("#healerCritChance").text().replace("XYZ", "+" + out.toFixed(zeroes + 1) + "% crit chance"));
				break;
			case "healHot":
				$("#healHot").text($("#healHot").text().replace("XYZ", "+10% healing as HoT"));
				break;
			case "castSpeed":
				var nextCastSpeed = 0.8 + ((7 / 120) * (upgrades.castSpeed.bought + 1) / (3.5 / 2.4));
				nextCastSpeed *= Math.pow(1.007465849893762215665362, (upgrades.castSpeed.bought + 1));
				$("#castSpeed").text($("#castSpeed").text().replace("XYZ", "-" + (((100 / healer.castSpeed) / 100) - (1 / nextCastSpeed)).toFixed(3) + "s casting time"));
		}
		$("#" + i).prop("disabled", upgrades[i].cost > player.gold);
	}
	for(var i in blessings) {
		$("#" + i + "Blessing").text(blessings[i].label + " - " + f.format(blessings[i].cost) + " Gold");
		$("#" + i + "Blessing").prop("disabled", blessings[i].cost > player.gold);
	}
	earlyHideElements();
	updateMaxLevels();
}
function updateMaxLevels() { //TODO: find out why maxing crit crashes. infinite loop perhaps?
	for(var i in upgrades) {
		if(upgrades[i].maxLevel !== -1 && upgrades[i].bought >= upgrades[i].maxLevel) {
			$("#" + i).css("display", "none");
			upgrades[i].bought = upgrades[i].maxLevel;
			upgrades[i].cost = Infinity;
		}
	}
}
function heal() {
	if(player.maxLevel >= 30) {
		var healerpower = healer.power * (healer.critChance * 0.01 - 0.01);
		var gainedhot = healerpower * upgrades.healHot.bought * 0.05;
		var remaininghot = healer.hotamount * (healer.hottimer / 10) * 0.3;
		if((hero.hp + (healerpower + gainedhot + remaininghot) * 0.95 <= hero.maxHp && healer.castreq === 0 && healer.mana > healer.cost)) {
			healer.castreq = 1;
		}
	}
}
function takeDamage() {
	if(hero.absorbs === 0) {
		if(Math.random() * 100 <= hero.blockChance) {
			hero.hp -= enemy.dmg * Random(0.99, 1.01) / hero.armor / hero.blockFactor;
		} else {
			hero.hp -= enemy.dmg * Random(0.99, 1.01) / hero.armor;
		}
	} else {
		if(Math.random() * 100 <= hero.blockChance) {
			hero.absorbs -= enemy.dmg * Random(0.99, 1.01) / hero.armor / hero.blockFactor;
		} else {
			hero.absorbs -= enemy.dmg * Random(0.99, 1.01) / hero.armor;
		}
		if(hero.absorbs < 0) {
			hero.hp += hero.absorbs;
			hero.absorbs = 0;
		}
	}
	checkDeath();
}
function Random(min, max) {return Math.random() * (max - min) + min;}
function dealDamage() {
	if(Math.random() * 100 <= archer.critChance) {
		enemy.hp -= archer.dmg * Random(0.95, 1.05) * archer.critFactor / enemy.armor;
	} else {
		enemy.hp -= archer.dmg * Random(0.95, 1.05) / enemy.armor;
	}
	checkDeath();
}
function updateStats() {
	//base value scalings
	healer.cost = 15 + upgrades.healUp.bought * 0.075;
	healer.cost -= upgrades.healCost.bought * 0.075;
	healer.maxMana = 400 + (player.maxLevel-30) * 0.9375;
	hero.maxHp = 600 + upgrades.maxHp.bought * 15;
	//% based scalings
	//Regular upgrades
	healer.power = 3600 * Math.pow(scaling.hp, upgrades.healUp.bought);
	healer.cost *= Math.pow(scaling.manaCostInc, upgrades.healUp.bought);
	healer.cost *= Math.pow(scaling.manaCostDec, upgrades.healCost.bought);
	healer.maxMana *= Math.pow(scaling.mana, upgrades.maxMana.bought);
	if(player.maxLevel >= 5) {
		hero.maxHp *= Math.pow(scaling.hp, upgrades.maxHp.bought);
	} else {
		hero.maxHp = 1e100;
	}
	hero.armor = Math.pow(scaling.dmgIgnore, upgrades.armor.bought);
	hero.blockFactor = 1.5 + upgrades.blockFactor.bought * 0.025;
	archer.dmg = 9 * Math.pow(scaling.archerDmg, upgrades.dmg.bought);
	archer.critFactor = 2 + upgrades.critFactor.bought * 0.025;
	//Blessings
	healer.power *= Math.pow(blessScaling.hp, blessings.healUp.bought);
	hero.maxHp *= Math.pow(blessScaling.hp, blessings.hp.bought);
	archer.dmg *= Math.pow(blessScaling.dmg, blessings.dmg.bought);
	player.bulkAmount = 1 + blessings.bulkAmount.bought;
	//other
	if(healer.cost < 1) {
		healer.cost = 1;
	}
	archer.critChance = upgrades.critChance.bought >= upgrades.critChance.maxLevel ? 100 : 100 - (scaling.crit ** upgrades.critChance.bought) * 100;
	healer.critChance = upgrades.healerCritChance.bought >= upgrades.healerCritChance.maxLevel ? 100 : 100 - (scaling.crit ** upgrades.healerCritChance.bought) * 100;
	hero.blockChance = upgrades.blockChance.bought >= upgrades.blockChance.maxLevel ? 100 : 100 - (scaling.crit ** upgrades.blockChance.bought) * 100;
	//General upgrades
	if(upgrades.attackSpeed.bought === upgrades.attackSpeed.maxLevel) {
		player.attackSpeed = 5;
	} else {
		player.attackSpeed = scaling.attackSpeed ** upgrades.attackSpeed.bought;
	}
	healer.castSpeed = 0.8 + ((7 / 120) * upgrades.castSpeed.bought / (3.5 / 2.4));
	//You determine base amount. Division factor for scaling = 3.5/(3.2-base)
	healer.castSpeed *= Math.pow(1.007465849893762215665362, upgrades.castSpeed.bought);
	healer.castSpeed = Math.round(healer.castSpeed * 1000) / 1000;
	healer.manaRegen = upgrades.manaRegen.bought * 0.004;
	//Up to 3x heal power at start, up to 2.5x hero hp at start. fades away over 500 upgrades, after which regular scaling will be in full effect.
	if(upgrades.healUp.bought < 500) {
		healer.power *= 3 - upgrades.healUp.bought * 0.004;
	}
	if(upgrades.maxHp.bought < 500) {
		hero.maxHp *= 2.5 - upgrades.maxHp.bought * 0.003;
	}
	var xpMult = 1.01**(player.xpLevel-1);
	archer.dmg *= xpMult;
	hero.maxHp *= xpMult;
	healer.power *= xpMult;
	if(cheat === true) {
		archer.dmg=1.79e308;
	}
}

function updateStatistics() {
	$("#stats11").text("HP: " + f.format(hero.hp) + "/" + f.format(hero.maxHp));
	$("#stats12").text("Damage Reduction: " + "100 / " + f.format(hero.armor * 100));
	$("#stats13").text("Block Chance: " + (hero.blockChance.toFixed(2)) + "%");
	$("#stats14").text("Max hits: " + f.format(hero.maxHp * hero.armor * hero.blockFactor / enemy.dmg));
	$("#stats15").text("Blocked Amount: " + "100 / " + f.format(hero.blockFactor * 100));
	$("#stats21").text("Mana: " + f.format(healer.mana) + "/" + f.format(healer.maxMana));
	$("#stats22").text("Mana regeneration rate: " + (healer.manaRegen * 100).toFixed(1) + "% max mana /s");
	$("#stats23").text("Heal Amount: " + f.format(healer.power) + " Health");
	$("#stats24").text("Heal Cost: " + f.format(healer.cost) + " Mana");
	$("#stats25").text("Healing crit chance: " + (healer.critChance.toFixed(2)) + "%");
	$("#stats26").text("Heal Speed: " + (Math.round(100 / healer.castSpeed) / 100) + " Seconds");
	$("#stats27").text("Bonus HoT Healing: " + Math.round(upgrades.healHot.bought * 10) + "%");
	$("#stats31").text("Damage per attack: " + f.format(archer.dmg));
	$("#stats32").text("Attack speed: " + Math.floor(player.attackSpeed * 100) / 100 + "/s");
	$("#stats33").text("Crit Chance: " + (archer.critChance.toFixed(2)) + "%");
	$("#stats34").text("Crit Multiplier: " + f.format(archer.critFactor * 100) + "%");
	if((archer.dmg * (1 - (archer.critChance * 0.01 - 0.01)) + ((archer.dmg * archer.critFactor) * (archer.critChance * 0.01 - 0.01)) * player.attackSpeed) > 100) {
		$("#stats35").text("Damage per second: " + f.format(archer.dmg * (1 - (archer.critChance * 0.01 - 0.01)) + ((archer.dmg * archer.critFactor) * (archer.critChance * 0.01 - 0.01)) * player.attackSpeed));
	} else {
		$("#stats35").text("Damage per second: " + Math.round((archer.dmg * (1 - (archer.critChance * 0.01 - 0.01)) + ((archer.dmg * archer.critFactor) * (archer.critChance * 0.01 - 0.01)) * player.attackSpeed) * 100) / 100);
	}
	$("#stats36").text("Estimated hits: " + (enemy.maxHp / (archer.dmg * (1 - (archer.critChance * 0.01 - 0.01)) + ((archer.dmg * archer.critFactor) * (archer.critChance * 0.01 - 0.01)))).toPrecision(2));
	$("#stats41").text("Level: " + player.level);
	$("#stats42").text("HP: " + f.format(enemy.hp) + "/" + f.format(enemy.maxHp));
	$("#stats43").text("Damage: " + f.format(enemy.dmg));
	$("#stats44").text("Attack speed: " + f.format(enemy.attackSpeed) + "/s");
	$("#stats45").text("Gold: " + f.format(enemy.gold));
	$("#stats46").text("Experience: " + Math.floor(enemy.xp).toLocaleString());
	$("#stats95").text("Enemy Kills: " + player.kills);
	$("#stats96").text("Hero Deaths: " + player.deaths);
	//$("#stats97").text("Game version:"); Update in HTML
	$("#stats98").text("Total Upgrades purchased: " + (upgrades.healUp.bought + upgrades.healCost.bought + upgrades.maxMana.bought + upgrades.maxHp.bought + upgrades.armor.bought + upgrades.blockFactor.bought + upgrades.dmg.bought + upgrades.critFactor.bought));
	$("#stats99").text("Total gold earned: " + f.format(player.totalgold));
	//Update tooltips
	for(var i in upgrades) {
		$("#" + i + "Tooltip").text(upgrades[i].tooltip + "\n\nnumbervalues: " + "\n\nBought: " + upgrades[i].bought);
		switch (i) {
			case "healUp":
				$("#healUpTooltip").text($("#healUpTooltip").text().replace("numbervalues: ", "Heal Power: " + f.format(healer.power) + "->" + f.format(calc(1, upgrades.healUp.bought + 1) * blessScaling.hp ** blessings.healUp.bought * 1.01 ** player.xpLevel) + "\nMana Cost: " + f.format(healer.cost) + "->" + f.format(calc(3, upgrades.healUp.bought + 1, upgrades.healCost.bought))));
				break;
			case "healCost":
				$("#healCostTooltip").text($("#healCostTooltip").text().replace("numbervalues: ", "Mana Cost: " + f.format(healer.cost) + "->" + f.format(calc(3, upgrades.healUp.bought, upgrades.healCost.bought + 1))));
				break;
			case "maxMana":
				$("#maxManaTooltip").text($("#maxManaTooltip").text().replace("numbervalues: ", "Maximum Mana: " + f.format(healer.maxMana) + "->" + f.format(calc(4, upgrades.maxMana.bought + 1))));
				break;
			case "healerCritChance":
				$("#healerCritChanceTooltip").text($("#healerCritChanceTooltip").text().replace("numbervalues: ", "Crit Chance: " + (healer.critChance).toPrecision(4) + "->" + (100 - (100 - healer.critChance) * scaling.crit).toPrecision(4) + "%"));
				break;
			case "healHot":
				$("#healHotTooltip").text($("#healHotTooltip").text().replace("numbervalues: ", "Factor: " + (upgrades.healHot.bought * 10) + "%->" + (upgrades.healHot.bought * 10 + 10) + "%"));
				break;
			case "maxHp":
				$("#maxHpTooltip").text($("#maxHpTooltip").text().replace("numbervalues: ", "Maximum Health: " + f.format(hero.maxHp) + "->" + f.format(calc(2, upgrades.maxHp.bought + 1) * blessScaling.hp ** blessings.hp.bought * 1.01 ** player.xpLevel)));
				break;
			case "armor":
				if(hero.armor < Math.pow(10, player.places)) {
					$("#armorTooltip").text($("#armorTooltip").text().replace("numbervalues: ", "Factor: " + hero.armor.toPrecision(player.places) + "->" + (hero.armor * scaling.dmgIgnore).toPrecision(player.places)));
				} else {
					$("#armorTooltip").text($("#armorTooltip").text().replace("numbervalues: ", "Factor: " + f.format(hero.armor) + "->" + f.format(hero.armor * scaling.dmgIgnore)));
				}
				break;
			case "blockChance":
				$("#blockChanceTooltip").text($("#blockChanceTooltip").text().replace("numbervalues: ", "Block Chance: " + (hero.blockChance).toPrecision(4) + "->" + (100 - (100 - hero.blockChance) * scaling.crit).toPrecision(4) + "%"));
				break;
			case "blockFactor":
				$("#blockFactorTooltip").text($("#blockFactorTooltip").text().replace("numbervalues: ", "Block Factor: " + hero.blockFactor.toPrecision(4) + "->" + (hero.blockFactor + 0.025).toPrecision(4)));
				break;
			case "dmg":
				if(archer.dmg < Math.pow(10, player.places)) {
					$("#dmgTooltip").text($("#dmgTooltip").text().replace("numbervalues: ", "Damage: " + archer.dmg.toPrecision(player.places) + "->" + (archer.dmg * scaling.archerDmg).toPrecision(player.places)));
				} else {
					$("#dmgTooltip").text($("#dmgTooltip").text().replace("numbervalues: ", "Damage: " + f.format(archer.dmg) + "->" + f.format(archer.dmg * scaling.archerDmg)));
				}
				break;
			case "critChance":
				$("#critChanceTooltip").text($("#critChanceTooltip").text().replace("numbervalues: ", "Crit Chance: " + (archer.critChance).toPrecision(4) + "->" + (100 - (100 - archer.critChance) * scaling.crit).toPrecision(4) + "%"));
				break;
			case "critFactor":
				$("#critFactorTooltip").text($("#critFactorTooltip").text().replace("numbervalues: ", "Crit Factor: " + archer.critFactor.toPrecision(4) + "->" + (archer.critFactor + 0.025).toPrecision(4)));
				break;
			case "manaRegen":
				$("#manaRegenTooltip").text($("#manaRegenTooltip").text().replace("numbervalues: ", "Mana Regen: " + (upgrades.manaRegen.bought * 0.4).toFixed(1) + "%->" + (upgrades.manaRegen.bought * 0.4 + 0.4).toFixed(1) + "%"));
				break;
			case "attackSpeed":
				$("#attackSpeedTooltip").text($("#attackSpeedTooltip").text().replace("numbervalues: ", "Attack Speed: " + player.attackSpeed.toFixed(2) + "/s->" + (player.attackSpeed * scaling.attackSpeed).toFixed(2) + "/s\nEnemy Attack Speed: " + enemy.attackSpeed.toFixed(2) + "/s->" + (enemy.attackSpeed * scaling.enemyAttackSpeed).toFixed(2) + "/s"));
				break;
			case "castSpeed":
				var nextCastSpeed = 0.8 + ((7 / 120) * (upgrades.castSpeed.bought + 1) / (3.5 / 2.4));
				nextCastSpeed *= Math.pow(1.007465849893762215665362, (upgrades.castSpeed.bought + 1));
				$("#castSpeedTooltip").text($("#castSpeedTooltip").text().replace("numbervalues: ", "Cast Speed: " + ((100 / healer.castSpeed) / 100).toFixed(2) + "s->" + (1 / nextCastSpeed).toFixed(2) + "s"));
				break;
		}
	}
	for(var x in blessings) {
		$("#" + x + "BlessingTooltip").text(blessings[x].tooltip + "\n\nnumbervalues: " + "\n\nBought: " + blessings[x].bought);
		switch (x) {
			case "hp":
				$("#hpBlessingTooltip").text($("#hpBlessingTooltip").text().replace("numbervalues: ", "Maximum Health: " + f.format(hero.maxHp) + "->" + f.format(hero.maxHp * blessScaling.hp)));
				break;
			case "healUp":
				$("#healUpBlessingTooltip").text($("#healUpBlessingTooltip").text().replace("numbervalues: ", "Heal power: " + f.format(healer.power) + "->" + f.format(healer.power * blessScaling.hp)));
				break;
			case "dmg":
				$("#dmgBlessingTooltip").text($("#dmgBlessingTooltip").text().replace("numbervalues: ", "Damage: " + f.format(archer.dmg) + "->" + f.format(archer.dmg * blessScaling.dmg)));
				break;
			case "gold":
				$("#goldBlessingTooltip").text($("#goldBlessingTooltip").text().replace("numbervalues: ", "Gold bonus: " + f.format((blessScaling.gold ** blessings.gold.bought - 1) * 100) + "%->" + f.format((blessScaling.gold ** (blessings.gold.bought + 1) - 1) * 100) + "%"));
				break;
			case "bulkAmount":
				$("#bulkAmountBlessingTooltip").text($("#bulkAmountBlessingTooltip").text().replace("numbervalues: ", "Bulk amount: " + f.format(1 + blessings.bulkAmount.bought) + "->" + f.format(2 + blessings.bulkAmount.bought)));
				break;
		}
	}
}
function updateVisuals() {
	//Update visible data
	$("#tabname").text(f.format(player.gold) + " gold");
	if(document.getElementById("showEnemyGold").checked) {
		$("#gold").text("Gold: " + f.format(player.gold) + " \(" + f.format(enemy.gold) + "\)");
	} else {
		$("#gold").text("Gold: " + f.format(player.gold));
	}
	$("#enemyhp").text(f.format(enemy.hp) + "/" + f.format(enemy.maxHp));
	$("#enemyhp").css({
		"width": ((enemy.hp / enemy.maxHp) * 450)
	});
	$("#playerattackbar").css({
		"width": ((player.attackreq / 100) * 450)
	});
	if(player.maxLevel >= 5) {
		$("#herohp").text(f.format(hero.hp) + "/" + f.format(hero.maxHp));
		$("#herohp").css({
			"width": ((hero.hp / hero.maxHp) * 450),
			"display": "inline"
		});
		$("#enemyattackbar").css({
			"width": ((enemy.attackreq / 100) * 450),
			"display": "inline"
		});
	} else {
		$("#herohp, #enemyattackbar").css("display", "none");
	}
	if(player.maxLevel >= 30) {
		$("#mana").text(f.format(healer.mana) + "/" + f.format(healer.maxMana));
		$("#mana").css({
			"width": ((healer.mana / healer.maxMana) * 450),
			"display": "inline"
		});
		$("#castbar").text(((healer.castreq / healer.castSpeed) / 100).toFixed(2) + "/" + ((100 / healer.castSpeed) / 100).toFixed(2));
		$("#castbar").css({
			"width": ((healer.castreq / (healer.castSpeed * 100 / healer.castSpeed)) * 450),
			"display": "inline"
		});
	} else {
		$("#mana, #castbar").css("display", "none");
	}
	if(player.bulkAmount > 1) {
		$("#buyeverythingbutton").text("Buy " + player.bulkAmount + " cheapest upgrades");
	} else {
		$("#buyeverythingbutton").text("Buy cheapest upgrade");
	}
	$("#level").text("Level: " + player.level + "/" + player.maxLevel);
	$("#xptext").text(Math.floor(player.xp).toLocaleString()+" / "+Math.round(player.xpReq).toLocaleString());
	$("#xpLevel").text("Group Level: "+player.xpLevel);
	$("#xpbar").css("width", (player.xp/player.xpReq*100)+"%");
}
function combat() {
	if(document.getElementById("pause").checked === false) {
		if(healer.castreq > 0) {
			healer.castreq += healer.castSpeed * 50 / player.fps;
			if(healer.castreq > 100) {
				hero.hp += hero.maxHp / 100;
				if(Math.random() * 100 < healer.critChance) {
					hero.hp += healer.power * 2;
					healer.hotamount = healer.hotamount * (healer.hottimer / 10);
					healer.hotamount += healer.power * 2 * upgrades.healHot.bought * 0.1;
					healer.hottimer = 10;
				} else {
					hero.hp += healer.power;
					healer.hotamount = healer.hotamount * (healer.hottimer / 10);
					healer.hotamount += healer.power * upgrades.healHot.bought * 0.1;
					healer.hottimer = 10;
				}
				healer.mana -= healer.cost;
				healer.castreq = 0;
				if(hero.hp > hero.maxHp) {
					hero.hp = hero.maxHp;
				}
			}
		}
		healer.autohealreq += 1 * healer.autohealspeed * 50 / player.fps;
		healer.mana += healer.maxMana / 100 * healer.manaRegen * 50 / player.fps;
		player.attackreq += player.attackSpeed * 50 / player.fps;
		enemy.attackreq += enemy.attackSpeed * 50 / player.fps;
		if(player.attackreq >= 100) {
			dealDamage();
			player.attackreq = 0;
		}
		if(enemy.attackreq >= 100) {
			takeDamage();
			enemy.attackreq = 0;
		}
		if(healer.autohealreq > 100) {
			heal();
			healer.autohealreq = 0;
		}
	}
}
updateCosts();
var deathDelay;

function checkDeath() {
	if(hero.hp <= 1) {
		player.deaths += 1;
		deathDelay = setTimeout(function() {
		if(player.level > 1) {
			gotoLevel(player.level - 1);
			document.getElementById("autoprogress").checked = false;
		}
			gotoLevel(player.level)
		}, 400);
		document.getElementById("pause").checked = true;
	}
	if(enemy.hp <= 1) {
		player.kills += 1;
		player.gold += enemy.gold;
		player.totalgold += enemy.gold;
		player.xp += enemy.xp;
		if(player.level === player.maxLevel) {
			player.maxLevel += 1;
		}
		if(document.getElementById("autoprogress").checked === true) {
			gotoLevel(player.maxLevel);
		} else {
			gotoLevel(player.level);
		}
	}
}

function checkOverflow() {
	if(healer.mana > healer.maxMana) {
		healer.mana = healer.maxMana;
	}
	if(hero.hp > hero.maxHp) {
		hero.hp = hero.maxHp;
	}
	if(enemy.hp > enemy.maxHp) {
		enemy.hp = enemy.maxHp;
	}
	if(healer.mana < 0) {
		healer.mana = 0;
	}
	if(hero.hp < 0) {
		hero.hp = 0;
	}
	if(enemy.hp < 0) {
		enemy.hp = 0;
	}
	player.xpReq = 100+25*(player.xpLevel-1);
	if(player.xpLevel>20) {
		player.xpReq *= scaling.xpReq ** (player.xpLevel - 21);
	}
	if(player.xp >= player.xpReq) {
		player.xp -= player.xpReq;
		player.xpLevel += 1;
	}
}

function registerUpgrade(name) {
	$("#" + name).on("click", function() {
		updateCosts();
		if(player.gold > upgrades[name].cost) {
			upgrades[name].bought += 1;
			player.gold -= upgrades[name].cost;
			afterUpgrade();
		}
	});
}

function registerBlessing(name) {
	$("#" + name + "Blessing").on("click", function() {
		updateCosts();
		if(player.gold > blessings[name].cost) {
			blessings[name].bought += 1;
			player.gold -= blessings[name].cost;
			afterBlessing();
		}
	})
}
for(var name in upgrades) {
	registerUpgrade(name);
}
for(var name in blessings) {
	registerBlessing(name);
}
///////////
//Buttons//
///////////
$("#nextlevel").on("click", function() {
	if(player.level + 1 <= player.maxLevel) {
		gotoLevel(player.level + 1);
		document.getElementById("autoprogress").checked=false;
	}
});
$("#prevlevel").on("click", function() {
	if(player.level - 1 > 0) {
		gotoLevel(player.level - 1);
		document.getElementById("autoprogress").checked=false;
	}
});
$("#tab1button").on("click", function() {
	$("#tab1").css("display", "inline");
	$("#tab2").css("display", "none");
	$("#tab4").css("display", "none");
});
$("#tab2button").on("click", function() {
	$("#tab1").css("display", "none");
	$("#tab2").css("display", "inline");
	$("#tab4").css("display", "none");
});
$("#tab9button").on("click", function() {
	$("#tab1").css("display", "none");
	$("#tab2").css("display", "none");
	$("#tab4").css("display", "inline");
});
$("#tab1button").click();
$("#buyeverythingbutton").on("click", function() {
	var spitout = true;
	for(var i = 0; i < player.bulkAmount; i++) {
		var upgradelist = [];
		var blessinglist = [];
		for(var x in upgrades) {
			upgradelist.push(upgrades[x].cost);
		}
		for(var z in blessings) {
			upgradelist.push(blessings[z].cost);
		}
		var mincost = Math.min.apply(null, upgradelist);
		if(mincost === Infinity) {
			document.getElementById("buyeverythingbutton").click();
			break;
		}
		var found = false;
		for(var y in upgrades) {
			if((upgrades[y].maxLevel!==-1 && upgrades[y].maxLevel>upgrades[y].bought) || upgrades[y].maxLevel===-1)
			if(upgrades[y].cost === mincost) {
				found = true;
				if(player.gold > upgrades[y].cost) {
					player.gold -= upgrades[y].cost;
					upgrades[y].bought += 1;
					switch (y) {
						case "healHot":
							upgrades.healHot.cost = (5000 + upgrades.healHot.bought * 250) * Math.pow(1.11042, upgrades.healHot.bought);
							break;
						case "manaRegen":
							upgrades.manaRegen.cost = (2.5e7 + upgrades.manaRegen.bought * 5e6) * Math.pow(1.45, upgrades.manaRegen.bought);
							break;
						case "attackSpeed":
							upgrades.attackSpeed.cost = (1e6 + upgrades.attackSpeed.bought * 3e5) * Math.pow(1.3, upgrades.attackSpeed.bought);
							break;
						case "castSpeed":
							upgrades.castSpeed.cost = (5e7 + upgrades.castSpeed.bought * 1e6) * Math.pow(1.15, upgrades.castSpeed.bought);
							break;
						default:
							upgrades[y].cost = 15 * Math.pow(scaling.upgradeCost, upgrades[y].bought);
							break;
					}
				}
				break;
			}
		}
		if(found===false) {
			for(var i in blessings) {
				if(blessings[i].cost === mincost) {
					if(player.gold > blessings[i].cost) {
						player.gold -= blessings[i].cost;
						blessings[i].bought += 1;
						switch (i) {
							case "bulkAmount":
								blessings.bulkAmount.cost = (1e9*(1000**blessings.bulkAmount.bought));
								break;
							default:
								blessings[i].cost = 1e10*(blessScaling.cost**blessings[i].bought);
								break;
						}
					}
					afterBlessing();
					break;
				}
			}
		}
		afterUpgrade();
	}
});
function save() {
	$("#savebutton").click();
}
function load() {
	$("#loadbutton").click();
}
$("#savebutton").on('click', function() {
	localStorage.setItem("playersave", JSON.stringify(player));
	localStorage.setItem("healersave", JSON.stringify(healer));
	localStorage.setItem("herosave", JSON.stringify(hero));
	localStorage.setItem("archersave", JSON.stringify(archer));
	localStorage.setItem("upgradessave", JSON.stringify(upgrades));
	localStorage.setItem("blessingsave", JSON.stringify(blessings));
	console.log("Saved!")
});
$("#loadbutton").on('click', function() {
	var playersave = JSON.parse(localStorage.getItem("playersave"));
	for(var a in playersave) {
		player[a] = playersave[a];
	}
	var healersave = JSON.parse(localStorage.getItem("healersave"));
	for(var b in healersave) {
		healer[b] = healersave[b];
	}
	var herosave = JSON.parse(localStorage.getItem("herosave"));
	for(var c in herosave) {
		hero[c] = herosave[c];
	}
	var archersave = JSON.parse(localStorage.getItem("archersave"));
	for(var d in archersave) {
		archer[d] = archersave[d];
	}
	var upgradessave = JSON.parse(localStorage.getItem("upgradessave"));
	for(var e in upgradessave) {
		upgrades[e].bought = upgradessave[e].bought;
	}
	var blessingsave = JSON.parse(localStorage.getItem("blessingsave"));
	for(var f in blessingsave) {
		blessings[f].bought = blessingsave[f].bought;
	}
	gotoLevel(player.level);
	notationslider.value=player.places;
	fpsslider.value=player.fps;
	visualfpsslider.value=player.visualfps;
});
$("#deletesavebutton").on('click', function() {
	var deletionprompt = prompt("You will not gain ANYTHING and you will lose EVERYTHING! Are you sure? Type 'DELETE' into the prompt to confirm.");
	if(deletionprompt == "boyohboyone") {
		player.maxLevel = 100;
		player.gold = 1e16;
		player.bulkAmount = 50;
	}
	if(deletionprompt == "manohmantwo") {
		player.maxLevel = 200;
		player.gold = 1e32;
		player.bulkAmount = 100;
	}
	if(deletionprompt == "heyhothree") {
		player.maxLevel = 300;
		player.gold = 1e48;
		player.bulkAmount = 150;
	}
	if(deletionprompt == "thetesting") {
		player.maxLevel = 30;
		player.gold = 6e5;
		player.bulkAmount = 10;
	}
	if(deletionprompt == "DELETE") {
		localStorage.removeItem("playersave");
		localStorage.removeItem("healersave");
		localStorage.removeItem("herosave");
		localStorage.removeItem("archersave");
		localStorage.removeItem("upgradessave");
		localStorage.removeItem("blessingsave");
		location.reload();
	}
});
$(document).keydown(function(e) {
    switch(e.key) {
        case "a":
			autoprogress.click();
			break;
		case "ArrowLeft":
			prevlevel.click();
			break;
		case "ArrowRight":
			nextlevel.click();
			break;
		case "ArrowUp":
			player.xp+=25;
			player.xp*=1.1;
			break;
    }
});
document.getElementById('loadbutton').click();
gotoLevel(player.level);
function calc(id, level, level2) {
	var result = 0;
	switch (id) {
		case 1: //Heal power
			result = 3600 * Math.pow(scaling.hp, level);
			if(level < 500) {
				result *= 3 - (level * 0.004);
			}
			break;
		case 2: //Max hp
			result = 600 + level * 15;
			result *= Math.pow(scaling.hp, level);
			if(level < 500) {
				result *= 2.5 - (level * 0.003);
			}
			break;
		case 3: //Heal cost
			//level = healup bought, level2 = healcost bought
			result = 15 + (level * 0.075);
			result -= level2 * 0.075;
			result *= scaling.manaCostInc ** level;
			result *= scaling.manaCostDec ** level2;
			if(result < 1) {
				result = 1;
			}
			break;
		case 4: //Max mana
			result = 400 + (player.maxLevel-30) * 0.9375;
			result *= scaling.mana ** level;
			break;
	}
	return result;
}
function simUpgrades(id, start) {
	var results = [];
	var previous,
		x,
		i;
	switch (id) {
		case 1: //Heal up
			for(i = start; i < start + 1000; i++) {
				previous = calc(1, i - 1);
				x = calc(1, i);
				if(x > 1e15 && previous > 1e12) {
					results.push({
						"Level": i,
						"Effect": f.format(x),
						"Increase": (((x / previous - 1) * 100).toFixed(4).toString() + "%")
					});
				} else {
					results.push({
						"Level": i,
						"Effect": x.toFixed(0),
						"Increase": (((x / previous - 1) * 100).toFixed(2).toString() + "%")
					});
				}
			}
			console.log("Heal up sim finished!");
			console.table(results);
		case 2: //Max hp
			for(i = start; i < start + 1000; i++) {
				previous = calc(2, i - 1);
				x = calc(2, i);
				if(x > 1e15 && previous > 1e12) {
					results.push({
						"Level": i,
						"Effect": f.format(x),
						"Increase": (((x / previous - 1) * 100).toFixed(4).toString() + "%")
					});
				} else {
					results.push({
						"Level": i,
						"Effect": x.toFixed(0),
						"Increase": (((x / previous - 1) * 100).toFixed(2).toString() + "%")
					});
				}
			}
			console.log("Max health sim finished!");
			console.table(results);
		case 3: //How much higher hp is from healing
			var step = 50;
			for(i = start; i < start + (step * 100); i += step) {
				previous = calc(2, i - step) / calc(1, i - step);
				x = calc(2, i) / calc(1, i) / ((1 + (i * 0.1)) / 2.1);
				results.push({
					"Level": i,
					"Effect": x.toFixed(2),
				});
			}
			console.log("Difference between hp and healing sim finished!");
			console.table(results);
			break;
	}
}
function earlyHideElements() {
	for(var i in upgrades) { //TODO: Maybe make upgrades unlock with group level instead of enemy level?
		if(upgrades[i].minEnemyLevel > player.maxLevel) {
			upgrades[i].cost = Infinity;
			$("#" + i).css("display", "none");
		} else if(upgrades[i].maxLevel === -1 || upgrades[i].maxLevel > upgrades[i].bought) {
			$("#" + i).css("display", "inline");
		}
	}
	if(player.maxLevel < 5) {
		$("#heroupgrades").css("display", "none");
		$("#buyeverythingbutton").css("display", "none");
	} else {
		$("#heroupgrades").css("display", "inline");
		$("#buyeverythingbutton").css("display", "inline");
	};
	if(player.maxLevel < 30) {
		$("#healerupgrades").css("display", "none");
	} else {
		$("#healerupgrades").css("display", "inline");
	};
	if(player.maxLevel < 50) {
		$("#generalupgrades").css("display", "none");
	} else {
		$("#generalupgrades").css("display", "inline");
	};
}
////////
//LOOP//
////////
function afterUpgrade() {
	updateMaxLevels();
	updateStats();
	updateCosts();
	visibilityChecks();
}

function afterBlessing() {
	updateStats();
	updateCosts();
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
var totalhothealing = 0;
setInterval(function() {
	if(document.getElementById("pause").checked === false) {
		if(healer.hottimer >= (1 / hottickspersec)) {
			hero.hp += healer.hotamount / (hottickspersec * 10);
			totalhothealing += healer.hotamount / (hottickspersec * 10);
			healer.hottimer -= (1 / hottickspersec);
		} else {
			healer.hottimer = 0;
			healer.hotamount = 0;
		}
	}
}, (Math.round(1000 / hottickspersec)));
setInterval(function() {
	if(visualfpsslider.value>fpsslider.value) {visualfpsslider.value=fpsslider.value};
	player.places = notationslider.value;
	player.format = notationid.value.toLowerCase();
	player.fps = fpsslider.value;
	player.visualFps = visualfpsslider.value;
	f = new numberformat.Formatter({
		format: player.format,
		sigfigs: player.places,
		flavor: player.flavor,
	});
	$("#significantfigures").text("Significant figures: " + notationslider.value);
	$("#fpscount").text("FPS: " + fpsslider.value);
	$("#visualfpscount").text("Visual FPS: " + visualfpsslider.value);
}, 150);
setInterval(function() {
	updateStatistics();
	updateCosts();
}, 500);
afterUpgrade();

function visibilityChecks() {
	//If all general upgrades are maxed
	if(upgrades.attackSpeed.bought >= upgrades.attackSpeed.maxLevel && upgrades.castSpeed.bought >= upgrades.castSpeed.maxLevel && upgrades.manaRegen.bought >= upgrades.manaRegen.maxLevel) {
		$("#hpBlessing").css("display", "inline");
		$("#healUpBlessing").css("display", "inline");
		$("#dmgBlessing").css("display", "inline");
		$("#goldBlessing").css("display", "inline");
		$("#bulkAmountBlessing").css("display", "inline");
		$("#fourthCornerText").text("Blessings");
	} else {
		$("#hpBlessing").css("display", "none");
		$("#healUpBlessing").css("display", "none");
		$("#dmgBlessing").css("display", "none");
		$("#goldBlessing").css("display", "none");
		$("#bulkAmountBlessing").css("display", "none");
		$("#fourthCornerText").text("General Upgrades");
	}
}
setInterval(function() {
	visibilityChecks();
}, 3000);
setInterval(function() {
	document.getElementById('savebutton').click();
}, 10000);
loop();
visualLoop();