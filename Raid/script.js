var raiders = {
    raider0: {
        hp: 100,
        maxHp: 100
    },
    raider1: {
        hp: 100,
        maxHp: 100
    },
    raider2: {
        hp: 100,
        maxHp: 100
    },
    raider3: {
        hp: 100,
        maxHp: 100
    },
    raider4: {
        hp: 100,
        maxHp: 100
    },
    raider5: {
        hp: 100,
        maxHp: 100
    },
    raider6: {
        hp: 100,
        maxHp: 100
    },
    raider7: {
        hp: 100,
        maxHp: 100
    },
    raider8: {
        hp: 100,
        maxHp: 100
    },
    raider9: {
        hp: 100,
        maxHp: 100
    }
};
function updateBars() {
    for (var i = 0; i<10; i++) {
        var target = "raider"+i;
        if(raiders[target].hp<=0) {
            document.getElementById(target).style.width = "0px";
        } else if(raiders[target].hp>=raiders[target].maxHp) {
            document.getElementById(target).style.width = "240px";
        } else {
            document.getElementById(target).style.width = Math.floor(raiders[target].hp / raiders[target].maxHp * 240) + "px";
        }
        document.getElementById(target).textContent = raiders[target].hp + " / " + raiders[target].maxHp;
    }
}
function damageRandom(damage, times) {
    for(var i = 0; i<times; i++) {
        var target = Math.floor(Math.random()*10);
        for(var x = 0; raiders["raider"+target].hp<=0; x++) {
            target = Math.floor(Math.random()*10);
            console.log(x);
        }
        raiders["raider"+target].hp-=damage;
        console.log(target);
    }
}
setInterval(function() {
    updateBars();
}, 50);