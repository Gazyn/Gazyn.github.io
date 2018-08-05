var goldPowerRatio = 1.1;
var scaling = {
    enemyPower: 1.24,
    enemyGold: 1.24**(1/goldPowerRatio),
    power: 1.24**(1/3),
	//24% enemy power each level, 3 upgrades each level to compensate
	//each upgrade must give 7.4337070989%
	upgradeCost: 1.074337070989**(1/goldPowerRatio),
    manaCostInc: 1.07,
    manaCostDec: 0.97,
    mana: 1.0379,
    hp: 1.045,
	//5.31683% heal power and hp = perfect scaling
	//fall behind by 0.782% every upgrade
	//by 25th upgrade, hp=optimal/1.21489
	//blessing will compensate for that(mostly)
    dmgIgnore: 1.01,
	//hero hp and heal power increases by ~1.568473% every upgradeCost%
    archerDmg: 1.035,
    archerCrit: 1.025,
	//4.813373% dmg and 2.5% crit = perfect scaling
	//fall behind by 1.269% every upgrade
	//by 25th upgrade, dps=optimal/1.37059
	//blessing will compensate(mostly)
    attackSpeed: 1.106,
    enemyAttackSpeed: 1.062
};
var blessScaling = {
    cost: scaling.enemyGold**25/16,
    hp: 1.21489,
    dmg: 1.37059,
    gold: 1.1
    //blessings should give 21.489% hp and 37.059% dmg
    //took log(1.21489)/log(1.2) and log(1.37059)/log(1.35)
    //this gives 1.0676386332886096 and 1.050438120571
    //so i just did 1.1^those two numbers(because goldPowerRatio is 1.1)
    //If this is wrong, please let me know how to do it right
};
var hottickspersec = 20;
var maxLevel = 20;
var player = {
    places: 3,
    format: 'standard',
    flavor: 'short',
    gold: 0,
    totalgold: 0,
    level: 1,
    maxlevel: 1,
    attackSpeed: 1,
    attackreq: 0,
    bulkAmount: 1,
    maxbulkAmount: 0,
    kills: 0,
    deaths: 0
};
var f = new numberformat.Formatter({
    format: player.format,
    sigfigs: player.places,
	flavor: player.flavor
});
player.maxbulkAmount = player.bulkAmount;
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
    basehp: 110,
    basedmg: 80,
    basegold: 50,
    armor: 1,
    attackSpeed: 1,
    attackreq: 0
};
var upgrades = {
    healUp: {
        label: "+4.5% heal power and +7% cost",
        bought: 0,
		tooltip: "Increases the power of healing at the cost of efficiency."
    },
    healCost: {
        label: "-3% cost",
        bought: 0,
        tooltip: "Makes healing cost less mana."
    },
    maxMana: {
        label: "+4% maximum mana",
        bought: 0,
        tooltip: "Increases maximum mana."
    },
    healerCritChance: {
        label: "+1% crit chance",
        bought: 0,
        tooltip: "Increases the chance for healing to be doubled."
    },
    maxHp: {
        label: "+4.5% max hp",
        bought: 0,
        tooltip: "Increases maximum health and base health."
    },
    armor: {
        label: "+1% armor",
        bought: 0,
        tooltip: "Divides incoming damage."
    },
    blockChance: {
        label: "+1% block chance",
        bought: 0,
        tooltip: "Chance to block, dividing incoming damage."
    },
    blockFactor: {
        label: "+1% block factor",
        bought: 0,
        tooltip: "Increases the effect of blocking."
    },
    dmg: {
        label: "+3.5% damage",
        bought: 0,
        tooltip: "Increases damage."
    },
    critChance: {
        label: "+1% crit chance",
        bought: 0,
        tooltip: "Increases the chance to crit, multiplying damage."
    },
    critFactor: {
        label: "+2.5% crit factor",
        bought: 0,
        tooltip: "Increases the effect of crit."
    },
    manaRegen: {
        label: "+0.4% max mana regen",
        bought: 0,
        tooltip: "Passively recovers mana based on maximum mana."
    },
    attackSpeed: {
        label: "+10% attack speed",
        bought: 0,
        tooltip: "Increases your attack speed and slightly increases enemy attack speed."
    },
    castSpeed: {
        label: "Cast speed",
        bought: 0,
        tooltip: "Decreases the amount of time needed to heal."
    },
	healHot: {
		label: "+10% of healing as HoT",
		bought: 0,
        tooltip: "Adds a heal over time effect to healing, based on heal power. Lasts 10 seconds and stacks."
	}
};
var blessings = {
    hp: {
		label: "+20% hero health",
		bought: 0,
        tooltip: "Increases maximum health."
	},
	healUp: {
		label: "+20% heal power",
		bought: 0,
        tooltip: "Increases healing power."
	},
	dmg: {
		label: "+35% damage",
		bought: 0,
        tooltip: "Increases damage."
	},
	gold: {
		label: "+10% gold gained",
		bought: 0,
        tooltip: "Increases all gold gained."
	},
	bulkAmount: {
		label: "+1 bulk amount",
		bought: 0,
        tooltip: "Increases the amount of cheapest upgrades bought with each click."
	}
};
/////////////
//Functions//
/////////////
//
function gotoLevel(dest) {
    player.level = dest;
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
    } else if(Number.isInteger((player.level+1)/10)) {
        enemy.maxHp = enemy.basehp * 1.16;
        enemy.dmg = enemy.basedmg * 1.16;
        enemy.gold = enemy.basegold * 1.48;
    } else if(Number.isInteger((player.level+2)/10)) {
        enemy.maxHp = enemy.basehp * 1.14;
        enemy.dmg = enemy.basedmg * 1.14;
        enemy.gold = enemy.basegold * 1.42;
    } else if(Number.isInteger((player.level+3)/10)) {
        enemy.maxHp = enemy.basehp * 1.12;
        enemy.dmg = enemy.basedmg * 1.12;
        enemy.gold = enemy.basegold * 1.36;
    } else if(Number.isInteger((player.level+4)/10)) {
        enemy.maxHp = enemy.basehp * 1.1;
        enemy.dmg = enemy.basedmg * 1.1;
        enemy.gold = enemy.basegold * 1.30;
    } else if(Number.isInteger((player.level+5)/10)) {
        enemy.maxHp = enemy.basehp * 1.08;
        enemy.dmg = enemy.basedmg * 1.08;
        enemy.gold = enemy.basegold * 1.24;
    } else if(Number.isInteger((player.level+6)/10)) {
        enemy.maxHp = enemy.basehp * 1.06;
        enemy.dmg = enemy.basedmg * 1.06;
        enemy.gold = enemy.basegold * 1.18;
    } else if(Number.isInteger((player.level+7)/10)) {
        enemy.maxHp = enemy.basehp * 1.04;
        enemy.dmg = enemy.basedmg * 1.04;
        enemy.gold = enemy.basegold * 1.12;
    } else if(Number.isInteger((player.level+8)/10)) {
        enemy.maxHp = enemy.basehp * 1.02;
        enemy.dmg = enemy.basedmg * 1.02;
        enemy.gold = enemy.basegold * 1.06;
    } else {
        enemy.maxHp = enemy.basehp;
        enemy.dmg = enemy.basedmg;
        enemy.gold = enemy.basegold;
    }
    enemy.maxHp *= scaling.enemyPower**(player.level - 1);
    enemy.dmg *= scaling.enemyPower**(player.level - 1);
    enemy.gold *= scaling.enemyGold**(player.level - 1);
	enemy.gold *= blessScaling.gold**(blessings.gold.bought);
    if(upgrades.attackSpeed.bought===16) {
        enemy.attackSpeed=3;
    } else {
        enemy.attackSpeed = scaling.enemyAttackSpeed**(upgrades.attackSpeed.bought);
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
    while(templevel > maxLevel) {
        templevel -= maxLevel;
    }
}
gotoLevel(1);
function updateCosts() {
    for(var name in upgrades) {
        upgrades[name].cost = upgrades[name].bought+15 * Math.pow(scaling.upgradeCost, upgrades[name].bought);
    }
	for(var name in blessings) {
		blessings[name].cost = 5e10 * Math.pow(blessScaling.cost, blessings[name].bought);
	}
    upgrades.manaRegen.cost = (250 + upgrades.manaRegen.bought * 62.5) * Math.pow(3, upgrades.manaRegen.bought);
    upgrades.attackSpeed.cost = (750 + upgrades.attackSpeed.bought * 150) * Math.pow(2.5, upgrades.attackSpeed.bought);
    upgrades.castSpeed.cost = (2000 + upgrades.castSpeed.bought * 200) * Math.pow(1.5, upgrades.castSpeed.bought);
	upgrades.healHot.cost = (5000 + upgrades.healHot.bought * 250) * Math.pow(1.11042, upgrades.healHot.bought);
	blessings.bulkAmount.cost = 1e9 * Math.pow(1000, blessings.bulkAmount.bought);
    healerupgradescost = upgrades.healUp.cost + upgrades.healCost.cost + upgrades.maxMana.cost;
    //Update the prices
    for(var i in upgrades) {
        $("#" + i).text(upgrades[i].label + " - " + f.format(upgrades[i].cost) + " Gold");
        $("#" + i).prop("disabled", upgrades[i].cost > player.gold);
    }
	for(var i in blessings) {
		$("#" + i + "Blessing").text(blessings[i].label + " - " + f.format(blessings[i].cost) + " Gold");
		$("#" + i + "Blessing").prop("disabled", blessings[i].cost > player.gold);
	}
}

function updateMaxLevels() {
    if(healer.critChance > 100 || upgrades.healerCritChance.bought>=96) {
        $("#healerCritChance").css("display", "none");
        upgrades.healerCritChance.bought = 96;
        upgrades.healerCritChance.cost = Infinity;
    }
    if(archer.critChance > 100 || upgrades.critChance.bought>=96) {
        $("#critChance").css("display", "none");
        upgrades.critChance.bought = 96;
        upgrades.critChance.cost = Infinity;
    }
    if(hero.blockChance > 100 || upgrades.blockChance.bought>=96) {
        $("#blockChance").css("display", "none");
        upgrades.blockChance.bought = 96;
        upgrades.blockChance.cost = Infinity;
    }
    if(healer.manaRegen > 0.039 || upgrades.manaRegen.bought>=10) {
        $("#manaRegen").css("display", "none");
        upgrades.manaRegen.bought = 10;
        upgrades.manaRegen.cost = Infinity;
    }
    if(player.attackSpeed > 4.99 || upgrades.attackSpeed.bought>=16) {
        $("#attackSpeed").css("display", "none");
        upgrades.attackSpeed.bought = 16;
        upgrades.attackSpeed.cost = Infinity;
    }
    if(upgrades.castSpeed.bought>=30) {
        $("#castSpeed").css("display", "none");
        upgrades.castSpeed.bought = 30;
        upgrades.castSpeed.cost = Infinity;
    }
}

function heal() {
	var healerpower=healer.power*(healer.critChance*0.01-0.01);
	var gainedhot=healerpower*upgrades.healHot.bought*0.05;
	var remaininghot=healer.hotamount*(healer.hottimer/10)*0.3;
    if((hero.hp+(healerpower+gainedhot+remaininghot)*0.95<=hero.maxHp && healer.castreq === 0 && healer.mana > healer.cost)) {
        healer.castreq = 1;
    }
}

function takeDamage() {
    if(hero.absorbs === 0) {
        if(Math.random() * 100 < hero.blockChance) {
            hero.hp -= enemy.dmg / hero.armor / hero.blockFactor;
        } else {
            hero.hp -= enemy.dmg / hero.armor;
        }
    } else {
        if(Math.random() * 100 < hero.blockChance) {
            hero.absorbs -= enemy.dmg / hero.armor / hero.blockFactor;
        } else {
            hero.absorbs -= enemy.dmg / hero.armor;
        }
        if(hero.absorbs < 0) {
            hero.hp += hero.absorbs;
        }
    }
}

function dealDamage() {
    if(Math.random() * 100 < archer.critChance) {
        enemy.hp -= archer.dmg * archer.critFactor / enemy.armor;
    } else {
        enemy.hp -= archer.dmg / enemy.armor;
    }
}

function updateStats() {
    //base value scalings
    healer.cost = 15 + (upgrades.healUp.bought * 0.075);
    healer.cost -= upgrades.healCost.bought * 0.075;
    healer.maxMana = 200 + (upgrades.maxMana.bought * 0.125);
    hero.maxHp = 200 + upgrades.maxHp.bought * 15;
    //% based scalings
	//Regular upgrades
    healer.power = 20 * Math.pow(scaling.hp, upgrades.healUp.bought);
    healer.cost *= Math.pow(scaling.manaCostInc, upgrades.healUp.bought);
    healer.cost *= Math.pow(scaling.manaCostDec, upgrades.healCost.bought);
    healer.maxMana *= Math.pow(scaling.mana, upgrades.maxMana.bought);
    hero.maxHp *= Math.pow(scaling.hp, upgrades.maxHp.bought);
    hero.armor = Math.pow(scaling.dmgIgnore, upgrades.armor.bought);
    hero.blockFactor = 1.5 * Math.pow(scaling.dmgIgnore, upgrades.blockFactor.bought);
    archer.dmg = 9 * Math.pow(scaling.archerDmg, upgrades.dmg.bought);
    archer.critFactor = 2 * Math.pow(scaling.archerCrit, upgrades.critFactor.bought);
	//Blessings
	healer.power *= Math.pow(blessScaling.hp, blessings.healUp.bought);
	hero.maxHp *= Math.pow(blessScaling.hp, blessings.hp.bought);
	archer.dmg *= Math.pow(blessScaling.dmg, blessings.dmg.bought);
	player.bulkAmount = 1 + blessings.bulkAmount.bought;
    //other
    if(healer.cost < 5) {
        healer.cost = 5;
    }
    healer.critChance = 5 + upgrades.healerCritChance.bought;
    hero.blockChance = 5 + upgrades.blockChance.bought;
    archer.critChance = 5 + upgrades.critChance.bought;
    //General upgrades
    if(upgrades.attackSpeed.bought===16) {
        player.attackSpeed = 5;
    } else {
        player.attackSpeed = Math.pow(scaling.attackSpeed, upgrades.attackSpeed.bought);
    }
    healer.castSpeed = 0.8 + ((7 / 120) * upgrades.castSpeed.bought/(3.5/2.4));
    //You determine base amount. Division factor for scaling = 3.5/(3.2-base)
    healer.castSpeed *= Math.pow(1.007465849893762215665362, upgrades.castSpeed.bought);
    healer.castSpeed = Math.round(healer.castSpeed*1000)/1000;
    healer.manaRegen = upgrades.manaRegen.bought * 0.004;
    //Up to 3x heal power at start, up to 2.5x hero hp at start. fades away over 500 upgrades, after which regular scaling will be in full effect.
    if(upgrades.healUp.bought<500) {
        healer.power *= 3-upgrades.healUp.bought*0.004;
    }
	if(upgrades.maxHp.bought<500) {
		hero.maxHp *= 2.5-upgrades.maxHp.bought*0.003;
	}
}

function updateStatistics() {
    $("#stats11").text("HP: " + f.format(hero.hp) + "/" + f.format(hero.maxHp));
    $("#stats12").text("Damage Reduction: " + "100 / " + f.format(hero.armor * 100));
    $("#stats13").text("Block Chance: " + (hero.blockChance - 1) + "%");
    $("#stats14").text("Max hits: " + f.format(hero.maxHp * hero.armor * hero.blockFactor / enemy.dmg));
    $("#stats15").text("Blocked Amount: " + "100 / " + f.format(hero.blockFactor * 100));
    $("#stats21").text("Mana: " + f.format(healer.mana) + "/" + f.format(healer.maxMana));
    $("#stats22").text("Mana regeneration rate: " + (healer.manaRegen * 100) + "% max mana /s");
    $("#stats23").text("Heal Amount: " + f.format(healer.power) + " Health");
    $("#stats24").text("Heal Cost: " + f.format(healer.cost) + " Mana");
    $("#stats25").text("Healing crit chance: " + (healer.critChance - 1) + "%");
    $("#stats26").text("Heal Speed: " + (Math.round(100 / healer.castSpeed) / 100) + " Seconds");
	$("#stats27").text("Bonus HoT Healing: " + Math.round(upgrades.healHot.bought*10)+"%");
    $("#stats31").text("Damage per attack: " + f.format(archer.dmg));
    $("#stats32").text("Attack speed: " + Math.floor(player.attackSpeed * 100) / 100 + "/s");
    $("#stats33").text("Crit Chance: " + (archer.critChance - 1) + "%");
    $("#stats34").text("Crit Multiplier: " + f.format(archer.critFactor * 100) + "%");
	if((archer.dmg*(1-(archer.critChance*0.01-0.01)) + ((archer.dmg*archer.critFactor)*(archer.critChance*0.01-0.01))*player.attackSpeed)>100) {
		$("#stats35").text("Damage per second: " + f.format(archer.dmg*(1-(archer.critChance*0.01-0.01)) + ((archer.dmg*archer.critFactor)*(archer.critChance*0.01-0.01))*player.attackSpeed));
	} else {
		$("#stats35").text("Damage per second: " + Math.round((archer.dmg*(1-(archer.critChance*0.01-0.01)) + ((archer.dmg*archer.critFactor)*(archer.critChance*0.01-0.01))*player.attackSpeed)*100)/100);
	}
    $("#stats41").text("Level: " + player.level);
    $("#stats42").text("HP: " + f.format(enemy.hp) + "/" + f.format(enemy.maxHp));
    $("#stats43").text("Damage: " + f.format(enemy.dmg));
    $("#stats44").text("Attack speed: " + f.format(enemy.attackSpeed) + "/s");
    $("#stats45").text("Gold: " + f.format(enemy.gold));
    $("#stats91").text("healer.castSpeed: " + healer.castSpeed);
    $("#stats95").text("Enemy Kills: " + player.kills);
    $("#stats96").text("Hero Deaths: " + player.deaths);
    //$("#stats97").text("Game version:"); Update in HTML
    $("#stats98").text("Total Upgrades purchased: " + (upgrades.healUp.bought + upgrades.healCost.bought + upgrades.maxMana.bought + upgrades.maxHp.bought + upgrades.armor.bought + upgrades.blockFactor.bought + upgrades.dmg.bought + upgrades.critFactor.bought));
    $("#stats99").text("Total gold earned: " + f.format(player.totalgold));
	//Update tooltips
    for(var i in upgrades) {
        $("#"+i+"Tooltip").text(upgrades[i].tooltip+"\n\nnumbervalues: "+"\n\nBought: "+upgrades[i].bought);
        switch(i) {
            case "healUp":
                $("#healUpTooltip").text($("#healUpTooltip").text().replace("numbervalues: ", "Heal Power: "+f.format(healer.power)+"->"+f.format(healer.power*scaling.hp)+"\nMana Cost: "+f.format(healer.cost)+"->"+f.format(healer.cost*scaling.manaCostInc)));
                break;
            case "healCost":
                $("#healCostTooltip").text($("#healCostTooltip").text().replace("numbervalues: ", "Mana Cost: "+f.format(healer.cost)+"->"+f.format(healer.cost*scaling.manaCostDec)));
                break;
            case "maxMana":
                $("#maxManaTooltip").text($("#maxManaTooltip").text().replace("numbervalues: ", "Maximum Mana: "+f.format(healer.maxMana)+"->"+f.format(healer.maxMana*scaling.mana)));
                break;
            case "healerCritChance":
                $("#healerCritChanceTooltip").text($("#healerCritChanceTooltip").text().replace("numbervalues: ", "Crit Chance: "+(healer.critChance-1).toString()+"%"+"->"+(healer.critChance).toString()+"%"));
                break;
            case "healHot":
                $("#healHotTooltip").text($("#healHotTooltip").text().replace("numbervalues: ", "Factor: "+(upgrades.healHot.bought*10)+"%"+"->"+(upgrades.healHot.bought*10+10)+"%"));
                break;
            case "maxHp":
                $("#maxHpTooltip").text($("#maxHpTooltip").text().replace("numbervalues: ", "Maximum Health: "+f.format(hero.maxHp)+"->"+f.format(calc(2, upgrades.maxHp.bought+1))));
                break;
            case "armor":
                if(hero.armor<Math.pow(10, player.places)) {
                    $("#armorTooltip").text($("#armorTooltip").text().replace("numbervalues: ", "Factor: "+hero.armor.toPrecision(player.places)+"->"+(hero.armor*scaling.dmgIgnore).toPrecision(player.places)));
                } else {
                    $("#armorTooltip").text($("#armorTooltip").text().replace("numbervalues: ", "Factor: "+f.format(hero.armor)+"->"+f.format(hero.armor*scaling.dmgIgnore)));
                }
                break;
            case "blockChance":
                $("#blockChanceTooltip").text($("#blockChanceTooltip").text().replace("numbervalues: ", "Block Chance: "+(hero.blockChance-1).toString()+"%"+"->"+(hero.blockChance).toString()+"%"));
                break;
            case "blockFactor":
                if(hero.blockFactor<Math.pow(10, player.places)) {
                    $("#blockFactorTooltip").text($("#blockFactorTooltip").text().replace("numbervalues: ", "Factor: "+hero.blockFactor.toPrecision(player.places)+"->"+(hero.blockFactor*scaling.dmgIgnore).toPrecision(player.places)));
                } else {
                    $("#blockFactorTooltip").text($("#blockFactorTooltip").text().replace("numbervalues: ", "Factor: "+f.format(hero.blockFactor)+"->"+f.format(hero.blockFactor*scaling.dmgIgnore)));
                }
                break;
            case "dmg":
                if(archer.dmg<Math.pow(10, player.places)) {
                    $("#dmgTooltip").text($("#dmgTooltip").text().replace("numbervalues: ", "Damage: "+archer.dmg.toPrecision(player.places)+"->"+(archer.dmg*scaling.archerDmg).toPrecision(player.places)));
                } else {
                    $("#dmgTooltip").text($("#dmgTooltip").text().replace("numbervalues: ", "Damage: "+f.format(archer.dmg)+"->"+f.format(archer.dmg*scaling.archerDmg)));
                }
                break;
            case "critChance":
                $("#critChanceTooltip").text($("#critChanceTooltip").text().replace("numbervalues: ", "Crit Chance: "+(archer.critChance-1).toString()+"%"+"->"+(archer.critChance).toString()+"%"));
                break;
            case "critFactor":
                if(archer.critFactor<Math.pow(10, player.places)) {
                    $("#critFactorTooltip").text($("#critFactorTooltip").text().replace("numbervalues: ", "Crit Factor: "+archer.critFactor.toPrecision(player.places)+"->"+(archer.critFactor*scaling.archerCrit).toPrecision(player.places)));
                } else {
                    $("#critFactorTooltip").text($("#critFactorTooltip").text().replace("numbervalues: ", "Crit Factor: "+f.format(archer.critFactor)+"->"+f.format(archer.critFactor*scaling.archerCrit)));
                }
                break;
            case "manaRegen":
                $("#manaRegenTooltip").text($("#manaRegenTooltip").text().replace("numbervalues: ", "Mana Regen: "+(upgrades.manaRegen.bought*0.4).toFixed(1)+"%->"+(upgrades.manaRegen.bought*0.4+0.4).toFixed(1)+"%"));
                break;
            case "attackSpeed":
                $("#attackSpeedTooltip").text($("#attackSpeedTooltip").text().replace("numbervalues: ", "Attack Speed: "+player.attackSpeed.toFixed(2)+"/s->"+(player.attackSpeed*scaling.attackSpeed).toFixed(2)+"/s\nEnemy Attack Speed: "+enemy.attackSpeed.toFixed(2)+"/s->"+(enemy.attackSpeed*scaling.enemyAttackSpeed).toFixed(2)+"/s"));
                break;
            case "castSpeed":
                var nextCastSpeed = 0.8 + ((7 / 120) * (upgrades.castSpeed.bought+1)/(3.5/2.4));
                nextCastSpeed *= Math.pow(1.007465849893762215665362, (upgrades.castSpeed.bought+1));
                $("#castSpeedTooltip").text($("#castSpeedTooltip").text().replace("numbervalues: ", "Cast Speed: "+((100 / healer.castSpeed) / 100).toFixed(2)+"s->"+(1/nextCastSpeed).toFixed(2)+"s"));
                break;
        }
    }
    for(var x in blessings) {
        $("#"+x+"BlessingTooltip").text(blessings[x].tooltip+"\n\nnumbervalues: "+"\n\nBought: "+blessings[x].bought);
        switch(x) {
            case "hp":
                $("#hpBlessingTooltip").text($("#hpBlessingTooltip").text().replace("numbervalues: ", "Maximum Health: "+f.format(hero.maxHp)+"->"+f.format(hero.maxHp*blessScaling.hp)));
                break;
            case "healUp":
                $("#healUpBlessingTooltip").text($("#healUpBlessingTooltip").text().replace("numbervalues: ", "Heal power: "+f.format(healer.power)+"->"+f.format(healer.power*blessScaling.hp)));
                break;
            case "dmg":
                $("#dmgBlessingTooltip").text($("#dmgBlessingTooltip").text().replace("numbervalues: ", "Damage: "+f.format(archer.dmg)+"->"+f.format(archer.dmg*blessScaling.dmg)));
                break;
            case "gold":
                $("#goldBlessingTooltip").text($("#goldBlessingTooltip").text().replace("numbervalues: ", "Gold bonus: "+f.format((blessScaling.gold**blessings.gold.bought-1)*100)+"%->"+f.format((blessScaling.gold**(blessings.gold.bought+1)-1)*100)+"%"));
                break;
            case "bulkAmount":
                $("#bulkAmountBlessingTooltip").text($("#bulkAmountBlessingTooltip").text().replace("numbervalues: ", "Bulk amount: "+f.format(1+blessings.bulkAmount.bought)+"->"+f.format(2+blessings.bulkAmount.bought)));
                break;
        }
    }
}

function updateVisuals() {
    //Update visible data
    $("#tabname").text(f.format(player.gold) + " gold");
    $("#gold").text("Gold: " + f.format(player.gold) + " \(" + f.format(enemy.gold) + "\)");
    $("#mana").text(f.format(healer.mana) + "/" + f.format(healer.maxMana));
    $("#herohp").text(f.format(hero.hp) + "/" + f.format(hero.maxHp));
    $("#enemyhp").text(f.format(enemy.hp) + "/" + f.format(enemy.maxHp));
    $("#castbar").text(((healer.castreq / healer.castSpeed) / 100).toFixed(2) + "/" + ((100 / healer.castSpeed) / 100).toFixed(2));
    if(player.bulkAmount>1) {
        $("#buyeverythingbutton").text("Buy " + player.bulkAmount + " cheapest upgrades");
    } else {
        $("#buyeverythingbutton").text("Buy cheapest upgrade");
    }
    //Update bars
    $("#mana").css({
        "width": ((healer.mana / healer.maxMana) * 450)
    });
    $("#herohp").css({
        "width": ((hero.hp / hero.maxHp) * 450)
    });
    $("#playerattackbar").css({
        "width": ((player.attackreq / 100) * 450)
    });
    $("#enemyhp").css({
        "width": ((enemy.hp / enemy.maxHp) * 450)
    });
    $("#enemyattackbar").css({
        "width": ((enemy.attackreq / 100) * 450)
    });
    $("#castbar").css({
        "width": ((healer.castreq / (healer.castSpeed * 100 / healer.castSpeed)) * 450)
    });
    $("#level").text("Level: " + player.level + "/" + player.maxlevel);
}

function combat() {
    if(document.getElementById("pause").checked === false) {
        if(healer.castreq > 0) {
            healer.castreq += healer.castSpeed;
            if(healer.castreq > 100) {
                hero.hp += hero.maxHp / 100;
                if(Math.random() * 100 < healer.critChance) {
                    hero.hp += healer.power * 2;
					healer.hotamount = healer.hotamount*(healer.hottimer/10);
					healer.hotamount += healer.power * 2 * upgrades.healHot.bought * 0.1;
					healer.hottimer = 10;
                } else {
                    hero.hp += healer.power;
					healer.hotamount = healer.hotamount*(healer.hottimer/10);
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
        healer.autohealreq += 1 * healer.autohealspeed;
        healer.mana += healer.maxMana / 100 * healer.manaRegen;
        player.attackreq += player.attackSpeed;
        enemy.attackreq += enemy.attackSpeed;
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

function checkDeath() {
    if(hero.hp <= 0) {
        player.deaths += 1;
        if(document.getElementById("autoprogress").checked === true) {
            if(player.level > 1) {
                gotoLevel(player.level - 1);
                document.getElementById("autoprogress").checked = false;
            }
        }
        gotoLevel(player.level);
    }
    if(enemy.hp <= 0) {
        player.kills += 1;
        player.gold += enemy.gold;
        player.totalgold += enemy.gold;
        if(player.level === player.maxlevel) {
            player.maxlevel += 1;
        }
        if(document.getElementById("autoprogress").checked === true) {
            gotoLevel(player.maxlevel);
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
}

function registerUpgrade(name) {
    $("#" + name).on("click", function () {
        updateCosts();
        if(player.gold > upgrades[name].cost) {
            upgrades[name].bought += 1;
            player.gold -= upgrades[name].cost;
			afterUpgrade();
        }
    });
}
function registerBlessing(name) {
	$("#" + name + "Blessing").on("click", function () {
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
$("#nextlevel").on("click", function () {
    if(player.level + 1 <= player.maxlevel) {
        gotoLevel(player.level + 1);
    }
});
$("#prevlevel").on("click", function () {
    if(player.level - 1 > 0) {
        gotoLevel(player.level - 1);
    }
});
$("#tab1button").on("click", function () {
    $("#tab1").css("display", "inline");
    $("#tab2").css("display", "none");
    $("#tab4").css("display", "none");
});
$("#tab2button").on("click", function () {
    $("#tab1").css("display", "none");
    $("#tab2").css("display", "inline");
    $("#tab4").css("display", "none");
});
$("#tab9button").on("click", function () {
    $("#tab1").css("display", "none");
    $("#tab2").css("display", "none");
    $("#tab4").css("display", "inline");
});
$("#tab1button").click();
$("#healerupgradesbutton").on("click", function () {
    updateCosts();
    if(healerupgradescost < player.gold) {
        $("#healUp").click();
        $("#healCost").click();
        $("#maxMana").click();
        if(healer.critChance.bought < 96) {
            $("#healerCritChance").click();
        }
    }
});
$("#heroupgradesbutton").on("click", function () {
    updateCosts();
    if(heroupgradescost < player.gold) {
        $("#maxHp").click();
        $("#armor").click();
        if(hero.blockChance < 100) {
            $("#blockChance").click();
        }
        $("#blockFactor").click();
    }
});
$("#archerupgradesbutton").on("click", function () {
    updateCosts();
    if(archerupgradescost < player.gold) {
        $("#dmg").click();
        if(archer.critChance < 100) {
            $("#critChance").click();
        }
        $("#critFactor").click();
    }
});
$("#buyeverythingbutton").on("click", function () {
    var spitout=false;
    for(var i = 0; i < player.bulkAmount; i++) {
        var upgradelist = [];
        var blessinglist = [];
        for(var x in upgrades) {
            upgradelist.push(upgrades[x].cost);
        }
        for(var z in blessings) {
            blessinglist.push(blessings[z].cost);
        }
        var sumlist = upgradelist.concat(blessinglist);
        if(spitout===false) {
            console.log(sumlist);
            spitout=true;
        }
        console.log(Math.min.apply(null, sumlist));
        var mincost = Math.min.apply(null, upgradelist);
        for(var y in upgrades) {
            if(upgrades[y].cost===mincost) {
                if(player.gold>upgrades[y].cost) {
                    player.gold -= upgrades[y].cost;
                    upgrades[y].bought += 1;
                    switch(y) {
                        case "healHot":
                            upgrades.healHot.cost = (5000 + upgrades.healHot.bought * 250) * Math.pow(1.11042, upgrades.healHot.bought);
                            break;
                        case "manaRegen":
                            upgrades.manaRegen.cost = (50 + upgrades.manaRegen.bought * 40) * Math.pow(3, upgrades.manaRegen.bought);
                            break;
                        case "attackSpeed":
                            upgrades.attackSpeed.cost = (100 + upgrades.attackSpeed.bought * 30) * Math.pow(2.5, upgrades.attackSpeed.bought);
                            break;
                        case "castSpeed":
                            upgrades.castSpeed.cost = (200 + upgrades.castSpeed.bought * 10) * Math.pow(1.5, upgrades.castSpeed.bought);
                            break;
                        default:
                            upgrades[y].cost = 15 * Math.pow(scaling.upgradeCost, upgrades[y].bought);
                            break;
                    }
                }
                break
            }
        }
		afterUpgrade();
    }
});
$("#scientific").on('click', function () {
    player.format = 'scientific';
});
$("#standard").on('click', function () {
    player.format = 'standard';
    player.flavor = 'short'
});
$("#engineering").on('click', function () {
    player.format = 'engineering';
});
function save() {
    $("#savebutton").click();
}
function load() {
    $("#loadbutton").click();
}
$("#savebutton").on('click', function () {
    localStorage.setItem("playersave", JSON.stringify(player));
    localStorage.setItem("healersave", JSON.stringify(healer));
    localStorage.setItem("herosave", JSON.stringify(hero));
    localStorage.setItem("archersave", JSON.stringify(archer));
    localStorage.setItem("upgradessave", JSON.stringify(upgrades));
	localStorage.setItem("blessingsave", JSON.stringify(blessings));
    console.log("Saved!")
});
$("#loadbutton").on('click', function () {
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
});
$("#deletesavebutton").on('click', function () {
    var deletionprompt = prompt("You will not gain ANYTHING and you will lose EVERYTHING! Are you sure? Type 'DELETE' into the prompt to confirm.");
    if(deletionprompt == "boyohboyone") {
        player.maxlevel = 100;
        player.gold = 1e16;
        player.bulkAmount = 50;
    }
    if(deletionprompt == "manohmantwo") {
        player.maxlevel = 200;
        player.gold = 1e32;
        player.bulkAmount = 100;
    }
    if(deletionprompt == "heyhothree") {
        player.maxlevel = 300;
        player.gold = 1e48;
        player.bulkAmount = 150;
    }
    if(deletionprompt == "thetesting") {
        player.maxlevel = 30;
        player.gold = 6e5;
        player.bulkAmount = 10;
    }
    if(deletionprompt == "DELETE") {
        localStorage.removeItem("playersave");
        localStorage.removeItem("healersave");
        localStorage.removeItem("herosave");
        localStorage.removeItem("archersave");
        localStorage.removeItem("upgradessave");
        location.reload();
    }
});
document.getElementById('loadbutton').click();
gotoLevel(player.level);
function calc(id, level) {
    var result = 0;
    if(id===1) {
        result = 20 * Math.pow(scaling.hp, level);
        if (level < 500) {
            result *= 3 - (level * 0.004);
        }
    }
    if(id===2) {
        result = 200 + level * 15;
        result *= Math.pow(scaling.hp, level);
        if (level < 500) {
            result *= 2.5 - (level * 0.003);
        }
    }
    return result;
}
function simUpgrades(id, start) {
    var results = [];
    var previous,
        x,
        i;
    if (id === 1) { //Heal up
        for (i = start; i < start + 1000; i++) {
            previous = calc(1, i - 1);
            x = calc(1, i);
            if (x > 1e15 && previous > 1e12) {
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
    }
    if (id === 2) { //Max hp
        for (i = start; i < start + 1000; i++) {
            previous = calc(2, i - 1);
            x = calc(2, i);
            if (x > 1e15 && previous > 1e12) {
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
    }
    if (id === 3) { //How much higher hp is from healing
        var step = 50;
        for (i = start;i < start + (step*100);i += step) {
            previous = calc(2, i - step) / calc(1, i - step);
            x = calc(2, i) / calc(1, i) / ((1+(i*0.1))/2.1);
            results.push({
                "Level": i,
                "Effect": x.toFixed(2),
            });
        }
        console.log("Difference between hp and healing sim finished!");
        console.table(results);
    }
}
////////
//LOOP//
////////
function afterUpgrade() {
	updateStats();
	updateCosts();
	updateMaxLevels();
	visibilityChecks();
}
function afterBlessing() {
	updateStats();
	updateCosts();
}
setInterval(function () {
    combat();
    checkOverflow();
    checkDeath();
    updateVisuals();
}, 20);
var totalhothealing = 0;
setInterval(function () {
	if(document.getElementById("pause").checked === false) {
		if(healer.hottimer>=(1/hottickspersec)) {
			hero.hp+=healer.hotamount/(hottickspersec*10);
			totalhothealing+=healer.hotamount/(hottickspersec*10);
			healer.hottimer-=(1/hottickspersec);
		} else {
			healer.hottimer=0;
			healer.hotamount=0;
		}
	}
}, (Math.round(1000/hottickspersec)));
setInterval(function () {
    player.places = slider.value;
    f = new numberformat.Formatter({
        format: player.format,
        sigfigs: player.places,
        flavor: player.flavor,
    });
    $("#significantfigures").text("Significant figures: " + slider.value);
}, 150);
setInterval(function () {
    updateStatistics();
	updateCosts();
}, 500);
afterUpgrade();
function visibilityChecks() {
	//If all general upgrades are maxed
	if(upgrades.attackSpeed.bought>=16 && upgrades.castSpeed.bought>=30 && upgrades.manaRegen.bought>=10) {
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
setInterval(function () {
	visibilityChecks();
}, 3000);
setInterval(function () {
    document.getElementById('savebutton').click();
}, 10000);