$(document).ready(function() {
    var costscaling = 1.175;
    var autohealbought = 0;
    var maxlevel = 10;
    var player = {
        places: 3,
        format: 'standard',
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
    var f = new numberformat.Formatter({
        format: player.format,
        sigfigs: player.places,
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
        attackspeed: 1,
        attackreq: 0,
    };
    var upgrades = {
        healup: {
            label: "+7% heal power and +11% cost",
            bought: 0,
        },
        healcost: {
            label: "-5.5% cost",
            bought: 0,
        },
        maxmana: {
            label: "+5% maximum mana",
            bought: 0,
        },
        healercritchance: {
            label: "1% chance to heal for twice as much",
            bought: 0,
        },
        maxhp: {
            label: "+7% maximum health",
            bought: 0,
        },
        armor: {
            label: "+2% increased armor",
            bought: 0,
        },
        blockchance: {
            label: "+1% block chance",
            bought: 0,
        },
        blockfactor: {
            label: "+2% block factor",
            bought: 0,
        },
        dmg: {
            label: "+6% damage",
            bought: 0,
        },
        critchance: {
            label: "+1% crit chance",
            bought: 0,
        },
        critfactor: {
            label: "+5% crit factor",
            bought: 0,
        },
        manaregen: {
            label: "+1% max mana regenerated per second",
            bought: 0,
            cost: 100,
        },
        attackspeed: {
            label: "+8.3% speed to ALL attacks",
            bought: 0,
            cost: 150,
        },
        autohealspeed: {
            label: "+21.6% frequency to autoheal",
            bought: 0,
            cost: 200,
        },
        castspeed: {
            label: "+20% casting speed to healing",
            bought: 0,
            cost: 250,
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
    var gscaling = 1.35;
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
        enemy.attackspeed=Math.pow(1.062047490937, upgrades.attackspeed.bought);
        healer.castreq = 0;
        healer.mana = healer.maxmana;
        hero.hp = hero.maxhp;
        enemy.hp = enemy.maxhp;
        player.attackreq = 0;
        enemy.attackreq = 0;
        healer.autohealreq = 0;
        var templevel = player.level;
        while(templevel>maxlevel) {
          templevel-=maxlevel;
        }
        $(document.body).css("background-image", "url(assets/bg"+Math.ceil(templevel/10)+".png)");
        $("#enemycontainer").css("background-image", "url(assets/"+templevel+".png");
    }
    gotoLevel(1);
    function updateCosts() {
        for (var name in upgrades) {
            upgrades[name].cost = 5 * Math.pow(costscaling, upgrades[name].bought);
        }
        if (upgrades.healercritchance.bought > 95) {
          upgrades.healercritchance.cost = Infinity;
        }
        if (upgrades.critchance.bought > 95) {
            upgrades.critchance.cost = Infinity;
        }
        if (upgrades.blockchance.bought > 95) {
            upgrades.blockchance.cost = Infinity;
        }
        if (upgrades.manaregen.bought > 9) {
          upgrades.manaregen.cost = Infinity;
        }
        if (upgrades.attackspeed.bought > 19) {
            upgrades.attackspeed.cost = Infinity;
        }
        if (upgrades.autohealspeed.bought > 19) {
          upgrades.autohealspeed.cost = Infinity;
        }
        if (upgrades.castspeed.bought > 59) {
          upgrades.castspeed.cost = Infinity;
        }
        if(upgrades.manaregen.bought < 10) {
        upgrades.manaregen.cost = (100 + (upgrades.manaregen.bought * 25)) * Math.pow(2.1, upgrades.manaregen.bought);
      } if(upgrades.attackspeed.bought < 20) {
        upgrades.attackspeed.cost = (150 + (upgrades.attackspeed.bought * 10)) * Math.pow(2.25, upgrades.attackspeed.bought);
      } if(upgrades.autohealspeed.bought < 20) {
        upgrades.autohealspeed.cost = (200 + (upgrades.autohealspeed.bought * 15)) * Math.pow(2.2, upgrades.autohealspeed.bought);
      } if(upgrades.castspeed.bought < 60) {
        upgrades.castspeed.cost = (250 + (upgrades.castspeed.bought * 20)) * Math.pow(2.15, upgrades.castspeed.bought);
      }
        healerupgradescost = upgrades.healup.cost + upgrades.healcost.cost + upgrades.maxmana.cost;
        if (healer.critchance < 100) {
          healerupgradescost += upgrades.healercritchance.cost;
        }
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
    function updateMaxLevels() {
        if (healer.critchance > 100) {
            $("#healercritchance").css("display", "none");
            upgrades.healercritchance.bought = 96;
            upgrades.healercritchance.cost = Infinity;
        }
        if (archer.critchance > 100) {
            $("#critchance").css("display", "none");
            upgrades.critchance.bought = 96;
            upgrades.critchance.cost = Infinity;
        }
        if (hero.blockchance > 100) {
            $("#blockchance").css("display", "none");
            upgrades.blockchance.bought = 96;
            upgrades.blockchance.cost = Infinity;
        }
        if (healer.manaregen > 0.039) {
            $("#manaregen").css("display", "none");
            upgrades.manaregen.bought = 10;
            upgrades.manaregen.cost = Infinity;
        }
        if (player.attackspeed > 4.99) {
            $("#attackspeed").css("display", "none");
            upgrades.attackspeed.bought = 20;
            upgrades.attackspeed.cost = Infinity;
        }
        if (healer.autohealspeed > 4.99) {
            $("#autohealspeed").css("display", "none");
            upgrades.autohealspeed.bought = 20;
            upgrades.autohealspeed.cost = Infinity;
        }
        if (healer.castspeed > 4.9) {
            $("#castspeed").css("display", "none");
            upgrades.castspeed.bought = 60;
            upgrades.castspeed.cost = Infinity;
        }
    }
    function heal() {
        if (hero.hp < hero.maxhp) {
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
        healer.power = 15 + (upgrades.healup.bought);
        healer.power *= Math.pow(1.0697808535, upgrades.healup.bought);
        healer.critchance = 5 + (1 * upgrades.healercritchance.bought);
        healer.cost = 15 + (upgrades.healup.bought * 0.3);
        healer.cost -= upgrades.healcost.bought * 0.3;
        if(healer.cost<5) {
          healer.cost=5;
        }
        healer.cost *= Math.pow(1.11, upgrades.healup.bought);
        healer.cost *= Math.pow(0.945, upgrades.healcost.bought);
        healer.maxmana = 100 + (upgrades.maxmana.bought * 0.5);
        healer.maxmana *= Math.pow(1.04895, upgrades.maxmana.bought);
        hero.maxhp = 50 + (upgrades.maxhp.bought * 1);
        hero.maxhp *= Math.pow(1.0697808535, upgrades.maxhp.bought);
        hero.blockchance = 5 + (1 * upgrades.blockchance.bought);
        hero.armor = 1 * Math.pow(1.02, upgrades.armor.bought);
        hero.blockfactor = 1.5 * Math.pow(1.02, upgrades.blockfactor.bought);
        archer.dmg = 9 * Math.pow(1.06, upgrades.dmg.bought);
        archer.critchance = 5 + (1 * upgrades.critchance.bought);
        archer.critfactor = 2 * Math.pow(1.05, upgrades.critfactor.bought);
        //General upgrades
        player.attackspeed = 1 * Math.pow(1.1059947442197169, upgrades.attackspeed.bought);
        healer.autohealspeed = 1 * Math.pow(1.2160417906586574, upgrades.autohealspeed.bought);
        healer.castspeed = 0.5 + ((7/120)*upgrades.castspeed.bought);
        healer.castspeed *= Math.pow(1.00372598347047, upgrades.castspeed.bought);
        healer.manaregen = upgrades.manaregen.bought * 0.004;
        return;
    }
    function updateStatistics() {
        $("#stats11").text("HP: " + f.format(hero.hp) + "/" + f.format(hero.maxhp));
        $("#stats12").text("Damage Reduction: " + "100 / " + f.format(hero.armor * 100));
        $("#stats13").text("Block Chance: " + (hero.blockchance - 1) + "%");
        $("#stats14").text("Max hits: " + f.format(hero.maxhp * hero.armor * hero.blockfactor / enemy.dmg));
        $("#stats15").text("Blocked Amount: " + "100 / " + f.format(hero.blockfactor * 100));
        $("#stats21").text("Mana: " + f.format(healer.mana) + "/" + f.format(healer.maxmana));
        $("#stats22").text("Mana regeneration rate: " + (healer.manaregen * 100) + "% max mana /s");
        $("#stats23").text("Heal Amount: " + f.format(healer.power) + " Health");
        $("#stats24").text("Heal Cost: " + f.format(healer.cost) + " Mana");
        $("#stats25").text("Healing crit chance: " + (healer.critchance - 1) + "%");
        $("#stats26").text("Heal Speed: " + (Math.round(100 / healer.castspeed) / 100) + " Seconds");
        $("#stats31").text("Damage per second: " + f.format(archer.dmg*(archer.critfactor*(archer.critchance/100))*player.attackspeed));
        $("#stats32").text("Crit Chance: " + (archer.critchance - 1) + "%");
        $("#stats33").text("Crit Multiplier: " + f.format(archer.critfactor * 100) + "%");
        $("#stats41").text("Level: " + player.level);
        $("#stats42").text("HP: " + f.format(enemy.hp) + "/" + f.format(enemy.maxhp));
        $("#stats43").text("Damage: " + f.format(enemy.dmg));
        $("#stats44").text("Attack speed: " + f.format(enemy.attackspeed)+"/s");
        $("#stats45").text("Gold: " + f.format(enemy.gold));
        $("#stats51").text("Attack speed: " + Math.floor(player.attackspeed * 100) / 100 + "/s");
        $("#stats52").text("Autocast speed: " + f.format(1 * healer.autohealspeed) + "/s");
        $("#stats91").text("healer.castspeed: "+healer.castspeed);
        $("#stats95").text("Enemy Kills: " + player.kills);
        $("#stats96").text("Hero Deaths: " + player.deaths);
        //$("#stats97").text("Game version:"); Update in HTML
        $("#stats98").text("Total Upgrades purchased: " + (upgrades.healup.bought + upgrades.healcost.bought + upgrades.maxmana.bought + upgrades.maxhp.bought + upgrades.armor.bought + upgrades.blockfactor.bought + upgrades.dmg.bought + upgrades.critfactor.bought));
        $("#stats99").text("Total gold earned: " + f.format(player.totalgold));
    }
    function updateVisuals() {
        if (player.maxlevel > 70 || ascension.resets > 0) {
            $("#tab3button").css("display", "inline");
        } else {
            $("#tab3button").css("display", "inline");
        }
        //Update visible data
        $("#tabname").text(f.format(player.gold/enemy.gold)+" Kills");
        $("#gold").text("Gold: " + f.format(player.gold) + " (" + f.format(enemy.gold) + ")");
        $("#mana").text(f.format(healer.mana) + "/" + f.format(healer.maxmana));
        $("#herohp").text(f.format(hero.hp) + "/" + f.format(hero.maxhp));
        $("#enemyhp").text(f.format(enemy.hp) + "/" + f.format(enemy.maxhp));
        $("#castbar").text((f.format(healer.castreq / healer.castspeed) / 100) + "/" + (f.format(100 / healer.castspeed) / 100));
        $("#buyeverythingbutton").text("Buy up to " + player.bulkamount + " cheapest");
        //Update bars
        $("#mana").css({"width": ((healer.mana / healer.maxmana) * 450)});
        $("#herohp").css({"width": ((hero.hp / hero.maxhp) * 450)});
        $("#playerattackbar").css({"width": ((player.attackreq / 100) * 450)});
        $("#enemyhp").css({"width": ((enemy.hp / enemy.maxhp) * 450)});
        $("#enemyattackbar").css({"width": ((enemy.attackreq / 100) * 450)});
        $("#castbar").css({"width": ((healer.castreq / (healer.castspeed * 100 / healer.castspeed)) * 450)});
        $("#level").text("Level: " + player.level + "/" + player.maxlevel);}
    function getCheapest() {
      updateCosts();
      var cheapestname = "healup";
      var cheapest = upgrades[cheapestname].cost;
        for (var name in upgrades) {
          if(upgrades[name].cost < cheapest) {
            cheapest = upgrades[name].cost;
            cheapestname = name;
          }
        }
        var result = {
          cheapest: cheapest,
          cheapestname: cheapestname,
        };
        return cheapestname;
    }
    function combat() {
        if (document.getElementById("pause").checked === false) {
            if (healer.castreq > 0) {
                healer.castreq += healer.castspeed;
                if (healer.castreq > 100) {
                    hero.hp += hero.maxhp / 100;
                    if (Math.random() * 100 < healer.critchance) {
                        hero.hp += healer.power*2;
                    } else {
                        hero.hp += healer.power;
                    }
                    healer.mana -= healer.cost;
                    healer.castreq = 0;
                    if (hero.hp > hero.maxhp) {
                        hero.hp = hero.maxhp;
                    }
                }
            }
            healer.autohealreq += 1 * healer.autohealspeed;
            healer.mana += healer.maxmana / 100 * healer.manaregen;
            player.attackreq += player.attackspeed;
            enemy.attackreq += enemy.attackspeed;
            if (player.attackreq >= 100) {
                dealDamage();
                player.attackreq = 0;
            }
            if (enemy.attackreq >= 100) {
                takeDamage();
                enemy.attackreq = 0;
            }
            if (healer.autohealreq > 100) {
                heal();
                healer.autohealreq = 0;
            }
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
        if (hero.hp > hero.maxhp) {
            hero.hp = hero.maxhp;
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
        console.log("Loading old save...");
        console.log(localStorage.getItem("player"));
        console.log(localStorage.getItem("healer"));
        console.log(localStorage.getItem("hero"));
        console.log(localStorage.getItem("archer"));
        console.log(localStorage.getItem("upgrades"));
        var f = JSON.parse(localStorage.getItem("player"));
        for(var a in f) {
          player[a]=f[a];
        }
        var g = JSON.parse(localStorage.getItem("healer"));
        for(var b in g) {
          healer[b]=g[b];
        }
        var h = JSON.parse(localStorage.getItem("hero"));
        for(var c in h) {
          hero[c]=h[c];
        }
        var i = JSON.parse(localStorage.getItem("archer"));
        for(var d in i) {
          archer[d]=i[d];
        }
        var j = JSON.parse(localStorage.getItem("upgrades"));
        for(var e in j) {
          upgrades[e].bought=j[e].bought;
        }
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
            if(healer.critchance.bought < 96) {
                $("#healercritchance").click();
            }
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
      console.log("Crit chance: " + upgrades.critchance.bought + "\nBlock Chance: " + upgrades.blockchance.bought + "\nHealer Crit Chance: " + upgrades.healercritchance.bought + "\nMana Regen: " + upgrades.manaregen.bought + "\nAttack speed: " + upgrades.attackspeed.bought + "\nAutoheal Speed: " + upgrades.autohealspeed.bought + "\nCasting speed: " + upgrades.castspeed.bought);
      for (var i = 0; i < player.bulkamount; i++) {
        upgradename = getCheapest();
        if(player.gold>upgrades[upgradename].cost) {
          player.gold-=upgrades[upgradename].cost;
          upgrades[upgradename].bought+=1;
        }
      }
      });
    for (var name in upgrades) {
        registerUpgrade(name);
    }
    $("#scientific").on('click', function() {
        player.format = 'scientific';
    });
    $("#standard").on('click', function() {
        player.format = 'standard';
    });
    $("#engineering").on('click', function() {
        player.format = 'engineering';
    });
    $("#savebutton").on('click', function() {
      localStorage.setItem("playersave", JSON.stringify(player));
      localStorage.setItem("healersave", JSON.stringify(healer));
      localStorage.setItem("herosave", JSON.stringify(hero));
      localStorage.setItem("archersave", JSON.stringify(archer));
      localStorage.setItem("upgradessave", JSON.stringify(upgrades));
    });
    $("#loadbutton").on('click', function() {
      var f = JSON.parse(localStorage.getItem("player"));
      for(var a in f) {
        player[a]=f[a];
      }
      var g = JSON.parse(localStorage.getItem("healer"));
      for(var b in g) {
        healer[b]=g[b];
      }
      var h = JSON.parse(localStorage.getItem("hero"));
      for(var c in h) {
        hero[c]=h[c];
      }
      var i = JSON.parse(localStorage.getItem("archer"));
      for(var d in i) {
        archer[d]=i[d];
      }
      var j = JSON.parse(localStorage.getItem("upgrades"));
      for(var e in j) {
        upgrades[e].bought=j[e].bought;
      }
      var playersave = JSON.parse(localStorage.getItem("playersave"));
      for(var a in playersave) {
        player[a]=playersave[a];
      }
      var healersave = JSON.parse(localStorage.getItem("healersave"));
      for(var b in healersave) {
        healer[b]=healersave[b];
      }
      var herosave = JSON.parse(localStorage.getItem("herosave"));
      for(var c in herosave) {
        hero[c]=herosave[c];
      }
      var archersave = JSON.parse(localStorage.getItem("archersave"));
      for(var d in archersave) {
        archer[d]=archersave[d];
      }
      var upgradessave = JSON.parse(localStorage.getItem("upgradessave"));
      for(var e in upgradessave) {
        upgrades[e].bought=upgradessave[e].bought;
      }
    });
    $("#deletesavebutton").on('click', function() {
      var deletionprompt = prompt("You will not gain ANYTHING and you will lose EVERYTHING! Are you sure? Type 'DELETE' into the prompt to confirm.");
      if (deletionprompt == "DELETE") {
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
    var saveTimer = setInterval(function(){document.getElementById('savebutton').click();}, 5000);
    ////////
    //LOOP//
    ////////
    setInterval(function() {
        updateStats();
        updateCosts();
        updateMaxLevels();
        updateStatistics();
        combat();
        checkOverflow();
        checkDeath();
    }, 10);
    setInterval(function() {
      updateVisuals();
      player.places = slider.value;
      f = new numberformat.Formatter({
          format: player.format,
          sigfigs: player.places,
      });
      $("#significantfigures").text("Significant figures: " + slider.value);
    }, 33);
    setInterval(function() {
      updateStatistics();
    }, 1000);
});
