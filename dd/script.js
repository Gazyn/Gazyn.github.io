var goldPowerRatio = 1.1;
var scaling = {
    enemyPower: 1.24,
    enemyGold: Math.pow(1.24,(1/goldPowerRatio)),
    power: Math.pow(1.24,1/3),
	//24% enemy power each level, 3 upgrades each level to compensate
	//each upgrade must give 7.4337070989%
	upgradeCost: Math.pow(1.074337070989,1/goldPowerRatio),
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
};
var blessScaling = {
	cost: Math.pow(scaling.enemyGold, 25)/16,
	hp: 1.21489,
	dmg: 1.37059,
	gold: 1.1
	//blessings should give 21.489% hp and 37.059% dmg
	//took log(1.21489)/log(1.2) and log(1.37059)/log(1.35)
	//this gives 1.0676386332886096 and 1.050438120571
	//so i just did 1.1^those two numbers(because goldPowerRatio is 1.1)
	//If this is wrong, please let me know how to do it right
}
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
    attackspeed: 1,
    attackreq: 0,
    bulkamount: 1,
    maxbulkamount: 0,
    kills: 0,
    deaths: 0
};
var f = new numberformat.Formatter({
    format: player.format,
    sigfigs: player.places,
	flavor: player.flavor
});
player.maxbulkamount = player.bulkamount;
var healer = {
    power: 0,
    cost: 0,
    mana: 0,
    critchance: 0,
    maxmana: 0,
    manaregen: 0,
    castspeed: 0,
    castreq: 0,
    autohealspeed: 50,
    autohealreq: 0,
	hottimer: 0,
	hotamount: 0
};
var hero = {
    hp: 0,
    maxHp: 0,
    blockchance: 0,
    blockfactor: 0,
    armor: 0,
    absorbs: 0
};
var archer = {
    dmg: 0,
    critchance: 0,
    critfactor: 0
};
var enemy = {
    basehp: 110,
    basedmg: 80,
    basegold: 50,
    armor: 1,
    attackspeed: 1,
    attackreq: 0
};
var upgrades = {
    healup: {
        label: "+4.5% heal power and +7% cost",
        bought: 0
    },
    healcost: {
        label: "-3% cost",
        bought: 0
    },
    maxmana: {
        label: "+4% maximum mana",
        bought: 0
    },
    healercritchance: {
        label: "+1% crit chance",
        bought: 0
    },
    maxHp: {
        label: "+4.5% maximum health",
        bought: 0
    },
    armor: {
        label: "+1% increased armor",
        bought: 0
    },
    blockchance: {
        label: "+1% block chance",
        bought: 0
    },
    blockfactor: {
        label: "+1% block factor",
        bought: 0
    },
    dmg: {
        label: "+3.5% damage",
        bought: 0
    },
    critchance: {
        label: "+1% crit chance",
        bought: 0
    },
    critfactor: {
        label: "+2.5% crit factor",
        bought: 0
    },
    manaregen: {
        label: "+0.4% max mana regenerated per second",
        bought: 0
    },
    attackspeed: {
        label: "+10% attack speed",
        bought: 0
    },
    castspeed: {
        label: "+2.7% heal casting speed",
        bought: 0
    },
	healhot: {
		label: "+10% of healing as bonus heal over time",
		bought: 0
	}
};
var blessings = {
    hp: {
		label: "+20% hero health",
		bought: 0
	},
	healup: {
		label: "+20% heal power",
		bought: 0
	},
	dmg: {
		label: "+35% archer damage",
		bought: 0
	},
	gold: {
		label: "+10% gold gained",
		bought: 0
	},
	bulkamount: {
		label: "+1 bulk amount",
		bought: 0
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
    enemy.maxHp *= Math.pow(scaling.enemyPower, player.level - 1);
    enemy.dmg *= Math.pow(scaling.enemyPower, player.level - 1);
    enemy.gold *= Math.pow(scaling.enemyGold, player.level - 1);
	enemy.gold *= Math.pow(blessScaling.gold, blessings.gold.bought);
    enemy.attackspeed = Math.pow(1.062047490937, upgrades.attackspeed.bought);
    healer.castreq = 0;
    healer.mana = healer.maxmana;
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
function newLine() {
	return "\n"
}
function updateCosts() {
    for(var name in upgrades) {
        upgrades[name].cost = upgrades[name].bought+15 * Math.pow(scaling.upgradeCost, upgrades[name].bought);
    }
	var blessingsboughtlist = []
	for(var name in blessings) {
		blessingsboughtlist.push(blessings[name].bought);
	}
	for(var name in blessings) {
		blessings[name].cost = 5e10 * Math.pow(blessScaling.cost, blessings[name].bought);
	}
    upgrades.manaregen.cost = (250 + upgrades.manaregen.bought * 62.5) * Math.pow(3, upgrades.manaregen.bought);
    upgrades.attackspeed.cost = (750 + upgrades.attackspeed.bought * 150) * Math.pow(2.5, upgrades.attackspeed.bought);
    upgrades.castspeed.cost = (2000 + upgrades.castspeed.bought * 200) * Math.pow(1.5, upgrades.castspeed.bought);
	upgrades.healhot.cost = (5000 + upgrades.healhot.bought * 250) * Math.pow(1.11042, upgrades.healhot.bought);
	blessings.bulkamount.cost = 1e9 * Math.pow(1000, blessings.bulkamount.bought);
    healerupgradescost = upgrades.healup.cost + upgrades.healcost.cost + upgrades.maxmana.cost;
    if(healer.critchance <= 101 || upgrades.healercritchance.bought<=96) {
        healerupgradescost += upgrades.healercritchance.cost;
    }
    $("#healerupgradesbutton").text("Buy all upgrades once for " + f.format(healerupgradescost));
    $("#healerupgradesbutton").prop("disabled", healerupgradescost > player.gold);
    heroupgradescost = upgrades.maxHp.cost + upgrades.armor.cost + upgrades.blockfactor.cost;
    if(hero.blockchance <= 101 || upgrades.blockchance.bought<=96) {
        heroupgradescost += upgrades.blockchance.cost;
    }
    $("#heroupgradesbutton").text("Buy all upgrades once for " + f.format(heroupgradescost));
    $("#heroupgradesbutton").prop("disabled", heroupgradescost > player.gold);
    archerupgradescost = upgrades.dmg.cost + upgrades.critfactor.cost;
    if(archer.critchance <= 101 || upgrades.critchance.bought<=96) {
        archerupgradescost += upgrades.critchance.cost;
    }
    $("#archerupgradesbutton").text("Buy all upgrades once for " + f.format(archerupgradescost));
    $("#archerupgradesbutton").prop("disabled", archerupgradescost > player.gold);
    //Update the prices
    for(var i in upgrades) {
        $("#" + i).text(upgrades[i].label + " - " + f.format(upgrades[i].cost) + " Gold");
        $("#" + i).prop("disabled", upgrades[i].cost > player.gold);
    }
	for(var i in blessings) {
		$("#" + i + "blessing").text(blessings[i].label + " - " + f.format(blessings[i].cost) + " Gold");
		$("#" + i + "blessing").prop("disabled", blessings[i].cost > player.gold);
	}
}

function updateMaxLevels() {
    if(healer.critchance > 100 || upgrades.healercritchance.bought>=96) {
        $("#healercritchance").css("display", "none");
        upgrades.healercritchance.bought = 96;
        upgrades.healercritchance.cost = Infinity;
    }
    if(archer.critchance > 100 || upgrades.critchance.bought>=96) {
        $("#critchance").css("display", "none");
        upgrades.critchance.bought = 96;
        upgrades.critchance.cost = Infinity;
    }
    if(hero.blockchance > 100 || upgrades.blockchance.bought>=96) {
        $("#blockchance").css("display", "none");
        upgrades.blockchance.bought = 96;
        upgrades.blockchance.cost = Infinity;
    }
    if(healer.manaregen > 0.039 || upgrades.manaregen.bought>=10) {
        $("#manaregen").css("display", "none");
        upgrades.manaregen.bought = 10;
        upgrades.manaregen.cost = Infinity;
    }
    if(player.attackspeed > 4.99 || upgrades.attackspeed.bought>=20) {
        $("#attackspeed").css("display", "none");
        upgrades.attackspeed.bought = 20;
        upgrades.attackspeed.cost = Infinity;
    }
    if(upgrades.castspeed.bought>=30) {
        $("#castspeed").css("display", "none");
        upgrades.castspeed.bought = 30;
        upgrades.castspeed.cost = Infinity;
    }
}

function heal() {
	var healerpower=healer.power*(healer.critchance*0.01-0.01);
	var gainedhot=healerpower*upgrades.healhot.bought*0.05;
	var remaininghot=healer.hotamount*(healer.hottimer/10)*0.3;
    if((hero.hp+(healerpower+gainedhot+remaininghot)*0.95<=hero.maxHp && healer.castreq === 0 && healer.mana > healer.cost)) {
        healer.castreq = 1;
    }
}

function takeDamage() {
    if(hero.absorbs === 0) {
        if(Math.random() * 100 < hero.blockchance) {
            hero.hp -= enemy.dmg / hero.armor / hero.blockfactor;
        } else {
            hero.hp -= enemy.dmg / hero.armor;
        }
    } else {
        if(Math.random() * 100 < hero.blockchance) {
            hero.absorbs -= enemy.dmg / hero.armor / hero.blockfactor;
        } else {
            hero.absorbs -= enemy.dmg / hero.armor;
        }
        if(hero.absorbs < 0) {
            hero.hp += hero.absorbs;
        }
    }
}

function dealDamage() {
    if(Math.random() * 100 < archer.critchance) {
        enemy.hp -= archer.dmg * archer.critfactor / enemy.armor;
    } else {
        enemy.hp -= archer.dmg / enemy.armor;
    }
}

function updateStats() {
    //base value scalings
    healer.cost = 15 + (upgrades.healup.bought * 0.075);
    healer.cost -= upgrades.healcost.bought * 0.075;
    healer.maxmana = 200 + (upgrades.maxmana.bought * 0.125);
    hero.maxHp = 200 + upgrades.maxHp.bought * 15;
    //% based scalings
	//Regular upgrades
    healer.power = 20 * Math.pow(scaling.hp, upgrades.healup.bought);
    healer.cost *= Math.pow(scaling.manaCostInc, upgrades.healup.bought);
    healer.cost *= Math.pow(scaling.manaCostDec, upgrades.healcost.bought);
    healer.maxmana *= Math.pow(scaling.mana, upgrades.maxmana.bought);
    hero.maxHp *= Math.pow(scaling.hp, upgrades.maxHp.bought);
    hero.armor = Math.pow(scaling.dmgIgnore, upgrades.armor.bought);
    hero.blockfactor = 1.5 * Math.pow(scaling.dmgIgnore, upgrades.blockfactor.bought);
    archer.dmg = 9 * Math.pow(scaling.archerDmg, upgrades.dmg.bought);
    archer.critfactor = 2 * Math.pow(scaling.archerCrit, upgrades.critfactor.bought);
	//Blessings
	healer.power *= Math.pow(blessScaling.hp, blessings.healup.bought)
	hero.maxHp *= Math.pow(blessScaling.hp, blessings.hp.bought);
	archer.dmg *= Math.pow(blessScaling.dmg, blessings.dmg.bought);
	player.bulkamount = 1 + blessings.bulkamount.bought;
    //other
    if(healer.cost < 5) {
        healer.cost = 5;
    }
    healer.critchance = 5 + upgrades.healercritchance.bought;
    hero.blockchance = 5 + upgrades.blockchance.bought;
    archer.critchance = 5 + upgrades.critchance.bought;
    //General upgrades
    player.attackspeed = Math.pow(1.1059947442197169, upgrades.attackspeed.bought);
    healer.castspeed = 0.8 + ((7 / 120) * upgrades.castspeed.bought/(3.5/2.4));
    //You determine base amount. Division factor for scaling = 3.5/(3.2-base)
    healer.castspeed *= Math.pow(1.007465849893762215665362, upgrades.castspeed.bought);
    //healer.castspeed = Math.round(healer.castspeed*1000)/1000;
    healer.manaregen = upgrades.manaregen.bought * 0.004;
    //Up to 3x heal power at start, up to 2x hero hp at start. fades away over 500 upgrades, after which regular scaling will be in full effect.
    if(upgrades.healup.bought<500) {
        healer.power *= 3-upgrades.healup.bought*0.004;
    }
	if(upgrades.maxHp.bought<500) {
		hero.maxHp *= 2.5-upgrades.maxHp.bought*0.003;
	}
}

function updateStatistics() {
    $("#stats11").text("HP: " + f.format(hero.hp) + "/" + f.format(hero.maxHp));
    $("#stats12").text("Damage Reduction: " + "100 / " + f.format(hero.armor * 100));
    $("#stats13").text("Block Chance: " + (hero.blockchance - 1) + "%");
    $("#stats14").text("Max hits: " + f.format(hero.maxHp * hero.armor * hero.blockfactor / enemy.dmg));
    $("#stats15").text("Blocked Amount: " + "100 / " + f.format(hero.blockfactor * 100));
    $("#stats21").text("Mana: " + f.format(healer.mana) + "/" + f.format(healer.maxmana));
    $("#stats22").text("Mana regeneration rate: " + (healer.manaregen * 100) + "% max mana /s");
    $("#stats23").text("Heal Amount: " + f.format(healer.power) + " Health");
    $("#stats24").text("Heal Cost: " + f.format(healer.cost) + " Mana");
    $("#stats25").text("Healing crit chance: " + (healer.critchance - 1) + "%");
    $("#stats26").text("Heal Speed: " + (Math.round(100 / healer.castspeed) / 100) + " Seconds");
	$("#stats27").text("Bonus HoT Healing: " + Math.round(upgrades.healhot.bought*10)+"%");
    $("#stats31").text("Damage per attack: " + f.format(archer.dmg));
    $("#stats32").text("Attack speed: " + Math.floor(player.attackspeed * 100) / 100 + "/s");
    $("#stats33").text("Crit Chance: " + (archer.critchance - 1) + "%");
    $("#stats34").text("Crit Multiplier: " + f.format(archer.critfactor * 100) + "%");
	if((archer.dmg*(1-(archer.critchance*0.01-0.01)) + ((archer.dmg*archer.critfactor)*(archer.critchance*0.01-0.01))*player.attackspeed)>100) {
		$("#stats35").text("Damage per second: " + f.format(archer.dmg*(1-(archer.critchance*0.01-0.01)) + ((archer.dmg*archer.critfactor)*(archer.critchance*0.01-0.01))*player.attackspeed));
	} else {
		$("#stats35").text("Damage per second: " + Math.round((archer.dmg*(1-(archer.critchance*0.01-0.01)) + ((archer.dmg*archer.critfactor)*(archer.critchance*0.01-0.01))*player.attackspeed)*100)/100);
	}
    $("#stats41").text("Level: " + player.level);
    $("#stats42").text("HP: " + f.format(enemy.hp) + "/" + f.format(enemy.maxHp));
    $("#stats43").text("Damage: " + f.format(enemy.dmg));
    $("#stats44").text("Attack speed: " + f.format(enemy.attackspeed) + "/s");
    $("#stats45").text("Gold: " + f.format(enemy.gold));
    $("#stats91").text("healer.castspeed: " + healer.castspeed);
    $("#stats95").text("Enemy Kills: " + player.kills);
    $("#stats96").text("Hero Deaths: " + player.deaths);
    //$("#stats97").text("Game version:"); Update in HTML
    $("#stats98").text("Total Upgrades purchased: " + (upgrades.healup.bought + upgrades.healcost.bought + upgrades.maxmana.bought + upgrades.maxHp.bought + upgrades.armor.bought + upgrades.blockfactor.bought + upgrades.dmg.bought + upgrades.critfactor.bought));
    $("#stats99").text("Total gold earned: " + f.format(player.totalgold));
	$("#healuptooltip").text("Increases the power of healing, at the cost of more expensive healing.\n\nHeal Power: "+f.format(healer.power)+"->"+f.format(healer.power*scaling.hp)+"Mana Cost: "+f.format(healer.cost)+"->"+f.format(healer.cost*scaling.manaCostInc))
}

function updateVisuals() {
    //Update visible data
    $("#tabname").text(f.format(player.gold) + " gold");
    $("#gold").text("Gold: " + f.format(player.gold) + " (" + f.format(enemy.gold * Math.pow(blessScaling.gold, blessings.gold.bought)) + ")");
    $("#mana").text(f.format(healer.mana) + "/" + f.format(healer.maxmana));
    $("#herohp").text(f.format(hero.hp) + "/" + f.format(hero.maxHp));
    $("#enemyhp").text(f.format(enemy.hp) + "/" + f.format(enemy.maxHp));
    $("#castbar").text((f.format(healer.castreq / healer.castspeed) / 100) + "/" + (f.format(100 / healer.castspeed) / 100));
    if(player.bulkamount>1) {
        $("#buyeverythingbutton").text("Buy " + player.bulkamount + " cheapest upgrades");
    } else {
        $("#buyeverythingbutton").text("Buy cheapest upgrade");
    }
    //Update bars
    $("#mana").css({
        "width": ((healer.mana / healer.maxmana) * 450)
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
        "width": ((healer.castreq / (healer.castspeed * 100 / healer.castspeed)) * 450)
    });
    $("#level").text("Level: " + player.level + "/" + player.maxlevel);
}

function combat() {
    if(document.getElementById("pause").checked === false) {
        if(healer.castreq > 0) {
            healer.castreq += healer.castspeed;
            if(healer.castreq > 100) {
                hero.hp += hero.maxHp / 100;
                if(Math.random() * 100 < healer.critchance) {
                    hero.hp += healer.power * 2;
					healer.hotamount = healer.hotamount*(healer.hottimer/10);
					healer.hotamount += healer.power * 2 * upgrades.healhot.bought * 0.1;
					healer.hottimer = 10;
                } else {
                    hero.hp += healer.power;
					healer.hotamount = healer.hotamount*(healer.hottimer/10);
					healer.hotamount += healer.power * upgrades.healhot.bought * 0.1;
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
        healer.mana += healer.maxmana / 100 * healer.manaregen;
        player.attackreq += player.attackspeed;
        enemy.attackreq += enemy.attackspeed;
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
    if(healer.mana > healer.maxmana) {
        healer.mana = healer.maxmana;
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
	$("#" + name + "blessing").on("click", function () {
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
        $("#healup").click();
        $("#healcost").click();
        $("#maxmana").click();
        if(healer.critchance.bought < 96) {
            $("#healercritchance").click();
        }
    }
});
$("#heroupgradesbutton").on("click", function () {
    updateCosts();
    if(heroupgradescost < player.gold) {
        $("#maxhp").click();
        $("#armor").click();
        if(hero.blockchance < 100) {
            $("#blockchance").click();
        }
        $("#blockfactor").click();
    }
});
$("#archerupgradesbutton").on("click", function () {
    updateCosts();
    if(archerupgradescost < player.gold) {
        $("#dmg").click();
        if(archer.critchance < 100) {
            $("#critchance").click();
        }
        $("#critfactor").click();
    }
});
$("#buyeverythingbutton").on("click", function () {
    for(var i = 0; i < player.bulkamount; i++) {
        var upgradelist = [];
        for(var x in upgrades) {
            upgradelist.push(upgrades[x].cost);
        }
        var mincost = Math.min.apply(null, upgradelist);
        for(var y in upgrades) {
            if(upgrades[y].cost===mincost) {
                if(player.gold>upgrades[y].cost) {
                    player.gold -= upgrades[y].cost;
                    upgrades[y].bought += 1;
                    if (y == "manaregen") {
                        upgrades.manaregen.cost = (50 + upgrades.manaregen.bought * 40) * Math.pow(3, upgrades.manaregen.bought);
                    } else if (y == "attackspeed") {
                        upgrades.attackspeed.cost = (100 + upgrades.attackspeed.bought * 30) * Math.pow(2.5, upgrades.attackspeed.bought);
                    } else if (y == "castspeed") {
                        upgrades.castspeed.cost = (200 + upgrades.castspeed.bought * 10) * Math.pow(1.5, upgrades.castspeed.bought);
                    } else {
                        upgrades[y].cost = 15 * Math.pow(scaling.upgradeCost, upgrades[y].bought);
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
$("#savebutton").on('click', function () {
    localStorage.setItem("playersave", JSON.stringify(player));
    localStorage.setItem("healersave", JSON.stringify(healer));
    localStorage.setItem("herosave", JSON.stringify(hero));
    localStorage.setItem("archersave", JSON.stringify(archer));
    localStorage.setItem("upgradessave", JSON.stringify(upgrades));
	localStorage.setItem("blessingsave", JSON.stringify(blessings));
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
        player.bulkamount = 50;
    }
    if(deletionprompt == "manohmantwo") {
        player.maxlevel = 200;
        player.gold = 1e32;
        player.bulkamount = 100;
    }
    if(deletionprompt == "heyhothree") {
        player.maxlevel = 300;
        player.gold = 1e48;
        player.bulkamount = 150;
    }
    if(deletionprompt == "thetesting") {
        player.maxlevel = 30;
        player.gold = 6e5;
        player.bulkamount = 10;
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
	if(upgrades.attackspeed.bought>=20 && upgrades.castspeed.bought>=30 && upgrades.manaregen.bought>=10) {
		$("#hpblessing").css("display", "inline");
		$("#healupblessing").css("display", "inline");
		$("#dmgblessing").css("display", "inline");
		$("#goldblessing").css("display", "inline");
		$("#bulkamountblessing").css("display", "inline");
		$("#fourthcornertext").text("Blessings");
	} else {
		$("#hpblessing").css("display", "none");
		$("#healupblessing").css("display", "none");
		$("#dmgblessing").css("display", "none");
		$("#goldblessing").css("display", "none");
		$("#bulkamountblessing").css("display", "none");
		$("#fourthcornertext").text("General Upgrades");
	}
}
setInterval(function () {
	visibilityChecks();
}, 3000);
setInterval(function () {
    document.getElementById('savebutton').click();
}, 10000);