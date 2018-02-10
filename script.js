$(document).ready(function() {
    var places = 3;
    var f = new numberformat.Formatter({
        format: 'scientific',
        sigfigs: places,
    });
    var costscaling = 1.176;
    var autohealbought = 0;
    var player = {
        gold: 0,
        totalgold: 0,
        level: 1,
        maxlevel: 1,
        attackspeed: 1,
        attackreq: 0,
        bulkamount: 10,
        maxbulkamount: 0,
        kills: 0,
        deaths: 0,
    };
    player.maxbulkamount = player.bulkamount;
    var healer = {
        power: 0,
        cost: 0,
        mana: 0,
        maxmana: 0,
        manaregen: 0,
        castspeed: 0,
        castreq: 0,
        autohealspeed: 0,
        autohealreq: 0,
    };
    var hero = {
        hp: 0,
        maxhp: 0,
        blockchance: 0,
        blockfactor: 0,
        armor: 0,
        absorbs: 0,
    };
    var archer = {
        dmg: 0,
        critchance: 0,
        critfactor: 0,
    };
    var enemy = {
        basehp: 55,
        basedmg: 9,
        basegold: 10,
        armor: 1,
    };
    var upgrades = {
        healup: {
            label: "+7% heal power and +11% cost",
            bought: 0,
        },
        healcost: {
            label: "-5.2% cost",
            bought: 0,
        },
        maxmana: {
            label: "+5% maximum mana",
            bought: 0,
        },
        maxhp: {
            label: "+7% maximum health",
            bought: 0,
        },
        armor: {
            label: "+2% damage reduction",
            bought: 0,
        },
        blockfactor: {
            label: "+2% block factor",
            bought: 0,
        },
        blockchance: {
            label: "+3% block chance",
            bought: 0,
        },
        dmg: {
            label: "+6% damage",
            bought: 0,
        },
        critchance: {
            label: "+3% crit chance",
            bought: 0,
        },
        critfactor: {
            label: "+5% crit factor",
            bought: 0,
        },
        attackspeed: {
            label: "+8.3% speed to ALL attacks",
            bought: 1,
        },
        autohealspeed: {
            label: "+21.6% frequency to autoheal",
            bought: 0,
        },
        castspeed: {
            label: "+20% casting speed to healing",
            bought: 0,
        },
        manaregen: {
            label: "+1% max mana regenerated per second",
            bought: 0,
        },
    };
    var ascension = {
        resets: 0,
        pending: 0,
        points: 0,
    };
    /////////////
    //Functions//
    /////////////
    var pscaling = 1.25;
    var gscaling = pscaling / 0.933;
    function gotoLevel(dest) {
        player.level = dest;
        if (Number.isInteger(player.level / 1000)) {
            enemy.maxhp = enemy.basehp * 100 * Math.pow(pscaling, player.level - 1);
            enemy.dmg = enemy.basedmg * 150 * Math.pow(pscaling, player.level - 1);
            enemy.gold = enemy.basegold * 400 * Math.pow(gscaling, player.level - 1);
        } else
        if (Number.isInteger(player.level / 100)) {
            enemy.maxhp = enemy.basehp * 7 * Math.pow(pscaling, player.level - 1);
            enemy.dmg = enemy.basedmg * 10 * Math.pow(pscaling, player.level - 1);
            enemy.gold = enemy.basegold * 25 * Math.pow(gscaling, player.level - 1);
        } else
        if (Number.isInteger(player.level / 10)) {
            enemy.maxhp = enemy.basehp * 1.5 * Math.pow(pscaling, player.level - 1);
            enemy.dmg = enemy.basedmg * 2 * Math.pow(pscaling, player.level - 1);
            enemy.gold = enemy.basegold * 5 * Math.pow(gscaling, player.level - 1);
        } else {
            enemy.maxhp = enemy.basehp * Math.pow(pscaling, player.level - 1);
            enemy.dmg = enemy.basedmg * Math.pow(pscaling, player.level - 1);
            enemy.gold = enemy.basegold * Math.pow(gscaling, player.level - 1);
        }
        healer.castreq = 0;
        healer.mana = healer.maxmana;
        hero.hp = hero.maxhp;
        enemy.hp = enemy.maxhp;
        player.attackreq = 0;
        healer.autohealreq = 0;
    }
    gotoLevel(1);
    function heal() {
        if (hero.hp < hero.maxhp * 2) {
            if (healer.castreq === 0) {
                if (healer.mana > healer.cost) {
                    healer.castreq = 1;
                }
            }
        }
    }
    function takeDamage() {
        if (hero.absorbs === 0) {
            if (Math.random() * 100 < hero.blockchance) {
                hero.hp -= enemy.dmg / hero.armor / hero.blockfactor;
            } else {
                hero.hp -= enemy.dmg / hero.armor;
            }
        } else {
            if (Math.random() * 100 < hero.blockchance) {
                hero.absorbs -= enemy.dmg / hero.armor / hero.blockfactor;
            } else {
                hero.absorbs -= enemy.dmg / hero.armor;
            }
            if (hero.absorbs < 0) {
                hero.hp += hero.absorbs;
            }
        }
    }
    function dealDamage() {
        if (Math.random() * 100 < archer.critchance) {
            enemy.hp -= archer.dmg * archer.critfactor / enemy.armor;
        } else {
            enemy.hp -= archer.dmg / enemy.armor;
        }
    }
    function updateStats() {
        healer.power = 20 + (upgrades.healup.bought * 0.4);
        healer.power *= Math.pow(1.06978, upgrades.healup.bought);
        healer.cost = 15 + (upgrades.healup.bought * 0.4);
        healer.cost -= upgrades.healcost.bought * 0.25;
        healer.cost *= Math.pow(1.11, upgrades.healup.bought);
        healer.cost *= Math.pow(0.948, upgrades.healcost.bought);
        healer.maxmana = 100 + (upgrades.maxmana.bought * 0.25);
        healer.maxmana *= Math.pow(1.05, upgrades.maxmana.bought);
        hero.maxhp = 30 + (upgrades.maxhp.bought * 0.5);
        hero.maxhp *= Math.pow(1.06978, upgrades.maxhp.bought);
        hero.blockchance = 5 + (3 * upgrades.blockchance.bought);
        hero.armor = 1 * Math.pow(1.02, upgrades.armor.bought);
        hero.blockfactor = 1.5 * Math.pow(1.02, upgrades.blockfactor.bought);
        archer.dmg = 9 * Math.pow(1.06, upgrades.dmg.bought);
        archer.critchance = 5 + (3 * upgrades.critchance.bought);
        archer.critfactor = 2 * Math.pow(1.05, upgrades.critfactor.bought);
        //General upgrades
        player.attackspeed = 1 * Math.pow(1.0838, upgrades.attackspeed.bought);
        healer.autohealspeed = 1 * Math.pow(1.2160417906586574, upgrades.autohealspeed.bought);
        healer.castspeed = 0.5 + (upgrades.castspeed.bought * 0.1);
        healer.manaregen = upgrades.manaregen.bought * 0.01;
        return;
    }
    function updateStatistics() {
        $("#stats11").text("HP: " + f.format(hero.hp) + "/" + f.format(hero.maxhp));
        $("#stats12").text("Damage Reduction: " + "100 / " + f.format(hero.armor * 100));
        $("#stats13").text("Block Chance: " + (hero.blockchance - 1) + "%");
        $("#stats14").text("Blocked Amount: " + "100 / " + f.format(hero.blockfactor * 100));
        $("#stats21").text("Mana: " + f.format(healer.mana) + "/" + f.format(healer.maxmana));
        $("#stats22").text("Mana regeneration rate: " + (healer.manaregen * 100) + "% max mana /s");
        $("#stats23").text("Heal Amount: " + f.format(healer.power) + " Health");
        $("#stats24").text("Heal Cost: " + f.format(healer.cost) + " Mana");
        $("#stats25").text("Heal Speed: " + (Math.round(100 / healer.castspeed) / 100) + " Seconds");
        $("#stats31").text("Damage per second: " + f.format(archer.dmg));
        $("#stats32").text("Crit Chance: " + (archer.critchance - 1) + "%");
        $("#stats33").text("Crit Multiplier: " + f.format(archer.critfactor * 100) + "%");
        $("#stats41").text("Level: " + player.level);
        $("#stats42").text("HP: " + f.format(enemy.hp) + "/" + f.format(enemy.maxhp));
        $("#stats43").text("Damage: " + f.format(enemy.dmg));
        $("#stats44").text("Gold: " + f.format(enemy.gold));
        $("#stats51").text("Attack speed: " + Math.floor(player.attackspeed * 100) / 100 + "/s");
        $("#stats52").text("Autocast speed: " + f.format(1 * healer.autohealspeed) + "/s");
        $("#stats95").text("Enemy Kills: " + player.kills);
        $("#stats96").text("Hero Deaths: " + player.deaths);
        //$("#stats97").text("Game version:"); Update in HTML
        $("#stats98").text("Total Upgrades purchased: " + (upgrades.healup.bought + upgrades.healcost.bought + upgrades.maxmana.bought + upgrades.maxhp.bought + upgrades.armor.bought + upgrades.blockfactor.bought + upgrades.dmg.bought + upgrades.critfactor.bought));
        $("#stats99").text("Total gold earned: " + f.format(player.totalgold));
    }
    function updateMaxLevels() {
        if (hero.blockchance > 99) {
            $("#blockchance").css("display", "none");
            upgrades.blockchance.bought = 32;
        }
        if (archer.critchance > 99) {
            $("#critchance").css("display", "none");
            upgrades.critchance.bought = 32;
        }
        if (player.attackspeed > 4.99) {
            upgrades.attackspeed.bought = 20;
            $("#attackspeed").css("display", "none");
        }
          if (healer.autohealspeed > 4.99) {
            upgrades.autohealspeed.bought = 20;
            $("#autohealspeed").css("display", "none");
        }
        if (healer.castspeed > 6.6) {
            upgrades.castspeed.bought = 61;
            $("#castspeed").css("display", "none");
        }
        if (healer.manaregen > 0.09) {
            upgrades.manaregen.bought = 10;
            $("#manaregen").css("display", "none");
        }
    }
    function updateVisuals() {
        if (player.maxlevel > 70 || ascension.resets > 0) {
            $("#tab3button").css("display", "inline");
        } else {
            $("#tab3button").css("display", "inline");
        }
        //Update visible data
        $("#tabname").text(Math.floor(player.gold/enemy.gold)+" Kills");
        $("#gold").text("Gold: " + f.format(player.gold) + " (" + f.format(enemy.gold) + ")");
        $("#mana").text(f.format(healer.mana) + "/" + f.format(healer.maxmana));
        $("#currlevel").text("Level: " + f.format(player.level) + "/" + f.format(player.maxlevel));
        $("#herohp").text(f.format(hero.hp) + "/" + f.format(hero.maxhp));
        $("#enemyhp").text(f.format(enemy.hp) + "/" + f.format(enemy.maxhp));
        $("#castbar").text((f.format(healer.castreq / healer.castspeed) / 100) + "/" + (f.format(100 / healer.castspeed) / 100));
        $("#buyeverythingbutton").text("Buy up to " + player.bulkamount + " cheapest");
        //Update bars
        $("#mana").css({"width": ((healer.mana / healer.maxmana) * 300)});
        $("#herohp").css({"width": ((hero.hp / hero.maxhp) * 300)});
        $("#enemyhp").css({"width": ((enemy.hp / enemy.maxhp) * 300)});
        $("#castbar").css({"width": ((healer.castreq / (healer.castspeed * 100 / healer.castspeed)) * 300)});
        $("#level").text("Level: " + player.level + "/" + player.maxlevel);}
    function getCheapest() {
        cheapest = healerupgradescost;
        if (heroupgradescost < cheapest) {
            cheapest = heroupgradescost;
        }
        if (archerupgradescost < cheapest) {
            cheapest = archerupgradescost;
        }
        return cheapest;
    }
    function updateHealing() {
        if (document.getElementById("pause").checked === false) {
            if (healer.castreq > 0) {
                healer.castreq += healer.castspeed;
                if (healer.castreq > 100) {
                    hero.hp += hero.maxhp / 100;
                    hero.hp += healer.power;
                    healer.mana -= healer.cost;
                    healer.castreq = 0;
                    if (hero.hp > hero.maxhp * 2) {
                        hero.hp = hero.maxhp * 2;
                    }
                }
            }
            healer.autohealreq += 1 * healer.autohealspeed;
            healer.mana += healer.maxmana / 100 * healer.manaregen;
            player.attackreq += player.attackspeed;
            if (player.attackreq >= 100) {
                takeDamage();
                dealDamage();
                player.attackreq = 0;
            }
        }
        if (healer.autohealreq > 100) {
            heal();
            healer.autohealreq = 0;
        }
    }
    function updateCosts() {
        for (var name in upgrades) {
            upgrades[name].cost = 5 * Math.pow(costscaling, upgrades[name].bought);
        }
        upgrades.healup.cost = 10 * Math.pow(costscaling, upgrades.healup.bought);
        upgrades.manaregen.cost = (100 + (upgrades.manaregen.bought * 25)) * Math.pow(2.1, upgrades.manaregen.bought);
        upgrades.attackspeed.cost = (57.1 + (upgrades.attackspeed.bought * 10)) * Math.pow(2.25, upgrades.attackspeed.bought);
        upgrades.autohealspeed.cost = (200 + (upgrades.autohealspeed.bought * 15)) * Math.pow(2.2, upgrades.autohealspeed.bought);
        upgrades.castspeed.cost = (250 + (upgrades.castspeed.bought * 20)) * Math.pow(2.15, upgrades.castspeed.bought);
        healerupgradescost = upgrades.healup.cost + upgrades.healcost.cost + upgrades.maxmana.cost;
        $("#healerupgradesbutton").text("Buy all upgrades once for " + f.format(healerupgradescost));
        $("#healerupgradesbutton").prop("disabled", healerupgradescost > player.gold);
        heroupgradescost = upgrades.maxhp.cost + upgrades.armor.cost + upgrades.blockfactor.cost;
        if (hero.blockchance < 100) {
            heroupgradescost += upgrades.blockchance.cost;
        }
        $("#heroupgradesbutton").text("Buy all upgrades once for " + f.format(heroupgradescost));
        $("#heroupgradesbutton").prop("disabled", heroupgradescost > player.gold);
        archerupgradescost = upgrades.dmg.cost + upgrades.critfactor.cost;
        if (archer.critchance < 100) {
            archerupgradescost += upgrades.critchance.cost;
        }
        $("#archerupgradesbutton").text("Buy all upgrades once for " + f.format(archerupgradescost));
        $("#archerupgradesbutton").prop("disabled", archerupgradescost > player.gold);
        //Update the prices
        for (var i in upgrades) {
            $("#" + i).text(upgrades[i].label + " - " + f.format(upgrades[i].cost) + " Gold");
            $("#" + i).prop("disabled", upgrades[i].cost > player.gold);
        }
    }
    updateCosts();
    function checkDeath() {
        if (hero.hp <= 0) {
          player.deaths+=1;
            if (document.getElementById("autoprogress").checked === true) {
                if (player.level > 1) {
                    gotoLevel(player.level - 1);
                    document.getElementById("autoprogress").checked = false;
                }
            }
            gotoLevel(player.level);
        }
        if (enemy.hp <= 0) {
            player.kills+=1;
            player.gold += enemy.gold;
            player.totalgold += enemy.gold;
            if (player.level === player.maxlevel) {
                player.maxlevel += 1;
            }
            if (document.getElementById("autoprogress").checked === true) {
                gotoLevel(player.maxlevel);
            } else {
                gotoLevel(player.level);
            }
        }
    }
    function checkOverflow() {
        if (healer.mana > healer.maxmana) {
            healer.mana = healer.maxmana;
        }
        if (hero.hp > hero.maxhp * 2) {
            hero.hp = hero.maxhp * 2;
        }
        if (enemy.hp > enemy.maxhp) {
            enemy.hp = enemy.maxhp;
        }
    }
    function registerUpgrade(name) {
        $("#" + name).on("click", function() {
            updateCosts();
            if (player.gold > upgrades[name].cost) {
                upgrades[name].bought += 1;
                player.gold -= upgrades[name].cost;
            }
        });
    }
    ///////////
    //Buttons//
    ///////////
    $("#nextlevel").on("click", function() {
        if (player.level + 1 <= player.maxlevel) {
            gotoLevel(player.level + 1);
        }
    });
    $("#prevlevel").on("click", function() {
        if (player.level - 1 > 0) {
            gotoLevel(player.level - 1);
        }
    });
    $("#tab1button").on("click", function() {
        $("#tab1").css("display", "inline");
        $("#tab2").css("display", "none");
        $("#tab3").css("display", "none");
        $("#tab4").css("display", "none");
    });
    $("#tab2button").on("click", function() {
        $("#tab1").css("display", "none");
        $("#tab2").css("display", "inline");
        $("#tab3").css("display", "none");
        $("#tab4").css("display", "none");
    });
    $("#tab3button").on("click", function() {
        $("#tab1").css("display", "none");
        $("#tab2").css("display", "none");
        $("#tab3").css("display", "inline");
        $("#tab4").css("display", "none");
    });
    $("#tab4button").on("click", function() {
        $("#tab1").css("display", "none");
        $("#tab2").css("display", "none");
        $("#tab3").css("display", "none");
        $("#tab4").css("display", "inline");
    });
    $("#tab3button").css("display", "none");
    $("#tab1button").click();
    $("#healerupgradesbutton").on("click", function() {
        updateCosts();
        if (healerupgradescost < player.gold) {
            $("#healup").click();
            $("#healcost").click();
            $("#maxmana").click();
        }
    });
    $("#heroupgradesbutton").on("click", function() {
        updateCosts();
        if (heroupgradescost < player.gold) {
            $("#maxhp").click();
            $("#armor").click();
            if (hero.blockchance < 100) {
                $("#blockchance").click();
            }
            $("#blockfactor").click();
        }
    });
    $("#archerupgradesbutton").on("click", function() {
        updateCosts();
        if (archerupgradescost < player.gold) {
            $("#dmg").click();
            if (archer.critchance < 100) {
                $("#critchance").click();
            }
            $("#critfactor").click();
        }
    });
    $("#buyeverythingbutton").on("click", function() {
        if(upgrades.manaregen.bought<10) {
        if (player.gold > 1e8) {
            upgrades.manaregen.bought = 10;
            player.gold -= 1e6;
        }
        }
        if(upgrades.attackspeed.bought<20) {
        if (player.gold > 1e12) {
            upgrades.attackspeed.bought = 20;
            player.gold -= 1e10;
        }
        }
        if(upgrades.autohealspeed.bought<40) {
        if (player.gold > 1e18) {
            upgrades.autohealspeed.bought = 40;
            player.gold -= 1e16;
        }
        }
        if(upgrades.castspeed.bought<61) {
        if (player.gold > 1e26) {
            upgrades.castspeed.bought = 61;
            player.gold -= 1e24;
        }
        }
        for (var i = 0; i < player.bulkamount; i++) {
            updateCosts();
            cheapest = getCheapest();
            if (cheapest === healerupgradescost) {
                healerupgradescost = 0;
                healerupgradescost += upgrades.healup.cost;
                healerupgradescost += upgrades.healcost.cost;
                healerupgradescost += upgrades.maxmana.cost;
                if (healerupgradescost < player.gold) {
                    upgrades.healup.bought += 1;
                    player.gold -= upgrades.healup.cost;
                    upgrades.healcost.bought += 1;
                    player.gold -= upgrades.healcost.cost;
                    upgrades.maxmana.bought += 1;
                    player.gold -= upgrades.maxmana.cost;
                }
            } else
            if (cheapest === heroupgradescost) {
                heroupgradescost = 0;
                heroupgradescost += upgrades.maxhp.cost;
                heroupgradescost += upgrades.armor.cost;
                if (upgrades.blockchance.bought < 32) {
                    heroupgradescost += upgrades.blockchance.cost;
                }
                heroupgradescost += upgrades.blockfactor.cost;
                if (heroupgradescost < player.gold) {
                    upgrades.maxhp.bought += 1;
                    player.gold -= upgrades.maxhp.cost;
                    upgrades.armor.bought += 1;
                    player.gold -= upgrades.armor.cost;
                    if (upgrades.blockchance.bought < 32) {
                        upgrades.blockchance.bought += 1;
                        player.gold -= upgrades.blockchance.cost;
                    }
                    if (upgrades.blockchance.bought === 32) {
                        upgrades.blockchance.bought += 1;
                    }
                    upgrades.blockfactor.bought += 1;
                    player.gold -= upgrades.blockfactor.cost;
                }
            } else
            if (cheapest === archerupgradescost) {
                archerupgradescost = 0;
                archerupgradescost += upgrades.dmg.cost;
                if (upgrades.critchance.bought < 32) {
                    archerupgradescost += upgrades.critchance.cost;
                }
                archerupgradescost += upgrades.critfactor.cost;
                if (archerupgradescost < player.gold) {
                    upgrades.dmg.bought += 1;
                    player.gold -= upgrades.dmg.cost;
                    if (upgrades.critchance.bought < 32) {
                        upgrades.critchance.bought += 1;
                        player.gold -= upgrades.critchance.cost;
                    }
                    if (upgrades.critchance.bought === 32) {
                        upgrades.critchance.bought += 1;
                    }
                    upgrades.critfactor.bought += 1;
                    player.gold -= upgrades.critfactor.cost;
                }
            }
        }
    });
    for (var name in upgrades) {
        registerUpgrade(name);
    }
    $("#scientific").on('click', function() {
        f = new numberformat.Formatter({
            format: 'scientific',
            sigfigs: places,
        });
    });
    $("#standard").on('click', function() {
        f = new numberformat.Formatter({
            format: 'standard',
            sigfigs: places,
        });
    });
    $("#engineering").on('click', function() {
        f = new numberformat.Formatter({
            format: 'engineering',
            sigfigs: places,
        });
    });
    $("#savebutton").on('click', function() {
      localStorage.setItem("player", JSON.stringify(player));
      localStorage.setItem("healer", JSON.stringify(healer));
      localStorage.setItem("hero", JSON.stringify(hero));
      localStorage.setItem("archer", JSON.stringify(archer));
      localStorage.setItem("upgrades", JSON.stringify(upgrades));
    });
    $("#loadbutton").on('click', function() {
      var a = JSON.parse(localStorage.getItem("player"));
      for(var f in a) {
        player[f]=a[f];
      }
      var b = JSON.parse(localStorage.getItem("healer"));
      for(var g in b) {
        healer[g]=b[g];
      }
      var c = JSON.parse(localStorage.getItem("hero"));
      for(var h in c) {
        hero[h]=c[h];
      }
      var d = JSON.parse(localStorage.getItem("archer"));
      for(var i in d) {
        archer[i]=d[i];
      }
      var e = JSON.parse(localStorage.getItem("upgrades"));
      for(var j in e) {
        upgrades[j]=e[j];
      }
    });
    $("#deletesavebutton").on('click', function() {
      var deletionprompt = prompt("You will not gain ANYTHING and you will lose EVERYTHING! Are you sure? Type 'DELETE' into the prompt to confirm.");
      if (deletionprompt == "DELETE") {
      localStorage.removeItem("player");
      localStorage.removeItem("healer");
      localStorage.removeItem("hero");
      localStorage.removeItem("archer");
      localStorage.removeItem("upgrades");
      location.reload();
      }
    });
    document.getElementById('loadbutton').click();
    var saveTimer = setInterval(function(){document.getElementById('savebutton').click();}, 2000);
    ////////
    //LOOP//
    ////////
    window.setInterval(function() {
        //Dumb testing scripts
        var totalunlimitedupgrades = upgrades.healup.bought + upgrades.healcost.bought + upgrades.maxmana.bought + upgrades.maxhp.bought + upgrades.armor.bought + upgrades.blockfactor.bought + upgrades.dmg.bought + upgrades.critfactor.bought;
        //Not dumb testing scripts
        updateStats();
        updateCosts();
        updateVisuals();
        updateStatistics();
        updateMaxLevels();
        updateHealing();
        checkOverflow();
        checkDeath();
    }, 10);
});
