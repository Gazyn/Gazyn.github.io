document.addEventListener("DOMContentLoaded", function(event) {
    //////////
    tab1button.addEventListener("click", function() {
        tab1.style.visibility = "visible";
        tab2.style.visibility = "hidden";
    });
    tab2button.addEventListener("click", function() {
        tab1.style.visibility = "hidden";
        tab2.style.visibility = "visible";
    });
    //////////
    function updateawakening1() {
        if (input1.value > 70) {
            input1.value = 70;
        }
        var level = input1.value;
        var ghostlevel = level;
        var curr = 10;
        var total = 0;
        while (ghostlevel > 0) {
            total += curr;
            curr += 2;
            ghostlevel -= 1;
        }
        var lasttotal = total - curr + 2;
        var displaytotal = Math.floor(total);
        var displaylasttotal = Math.floor(lasttotal);
        var exp = Math.floor((total / lasttotal - 1) * 10000) / 100;
        eff1.textContent = ("Effect: " + displaytotal + "%");
        if (level > 1) {
            lasteff1.textContent = ("Last level's effect: " + displaylasttotal + "%");
            rel1.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff1.textContent = ("Last level's effect: N/A");
            rel1.textContent = ("Relative increase from last level: N/A");
        }
        return total / 100 + 1;
    }
    //////////
    function updateawakening2() {
        if (input2.value > 30) {
            input2.value = 30;
        }
        var level = input2.value;
        var ghostlevel = level;
        var curr = 10;
        var total = 0;
        while (ghostlevel > 0) {
            total += curr;
            curr += 2;
            ghostlevel -= 1;
        }
        var lasttotal = total - curr + 2;
        var displaytotal = Math.floor(total);
        var displaylasttotal = Math.floor(lasttotal);
        var exp = Math.floor((total / lasttotal - 1) * 10000) / 100;
        eff2.textContent = ("Effect: " + displaytotal + "%");
        if (level > 1) {
            lasteff2.textContent = ("Last level's effect: " + displaylasttotal + "%");
            rel2.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff2.textContent = ("Last level's effect: N/A");
            rel2.textContent = ("Relative increase from last level: N/A");
        }
        return total / 100 + 1;
    }
    //////////
    function updatemithrilsword() {
        if (input3.value > 45) {
            input3.value = 45;
        }
        var level = input3.value;
        var ghostlevel = level;
        var total = 1;
        if (ghostlevel >= 45) {
            total = 0.35;
            ghostlevel = 0;
        } else if (ghostlevel > 20) {
            total -= 0.4;
            ghostlevel -= 20;
        }
        while (ghostlevel > 0) {
            if (level <= 20) {
                total -= 0.02;
                ghostlevel -= 1;
            } else {
                total -= 0.01;
                ghostlevel -= 1;
            }
        }
        if (level < 20) {
            var lasttotal = total + 0.02;
        } else {
            var lasttotal = total + 0.01;
        }
        var displaytotal = 100 - (Math.floor(total * 10000) / 100);
        var displaylasttotal = 100 - (Math.floor(lasttotal * 10000) / 100);
        var exp = Math.floor(lasttotal / total * 10000 - 10000) / 100;
        eff3.textContent = ("Effect: -" + Math.round(displaytotal) + "%");
        if (level > 1) {
            lasteff3.textContent = ("Last level's Effect: -" + Math.round(displaylasttotal) + "%");
            rel3.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff3.textContent = ("Last level's Effect: N/A");
            rel3.textContent = ("Relative increase from last level: N/A");
        }
        return 1 / total;
    }
    //////////
    function updatemistilteinn() {
        if (input4.value > 105) {
            input4.value = 105;
        }
        var level = input4.value;
        var ghostlevel = level;
        var total = 1;
        if (ghostlevel >= 105) {
            total = 0.125;
            ghostlevel = 0;
        } else if (ghostlevel > 75) {
            total -= 0.8;
            ghostlevel -= 75;
            while (ghostlevel > 0) {
                total -= 0.0025;
                ghostlevel -= 1;
            }
        } else if (ghostlevel > 45) {
            total -= 0.65;
            ghostlevel -= 45;
            while (ghostlevel > 0) {
                total -= 0.005;
                ghostlevel -= 1;
            }
        } else if (ghostlevel > 20) {
            total -= 0.4;
            ghostlevel -= 20;
            while (ghostlevel > 0) {
                total -= 0.01;
                ghostlevel -= 1;
            }
        } else if (ghostlevel <= 20) {
            while (ghostlevel > 0) {
                total -= 0.02;
                ghostlevel -= 1;
            }
        }
        if (level > 75) {
            var lasttotal = total + 0.0025;
        } else if (level > 45) {
            var lasttotal = total + 0.005;
        } else if (level > 20) {
            var lasttotal = total + 0.01;
        } else {
            var lasttotal = total + 0.02;
        }
        var displaytotal = 100 - (Math.floor(total * 10000) / 100);
        var displaylasttotal = 100 - (Math.floor(lasttotal * 10000) / 100);
        var exp = Math.floor(lasttotal / total * 10000 - 10000) / 100;
        eff4.textContent = ("Effect: -" + (Math.floor(displaytotal * 20) / 20) + "%");
        if (level > 1) {
            lasteff4.textContent = ("Last level's Effect: -" + (Math.floor(displaylasttotal * 20) / 20) + "%");
            rel4.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff4.textContent = ("Last level's Effect: N/A");
            rel4.textContent = ("Relative increase from last level: N/A");
        }
        return 1 / total;
    }
    //////////
    function updategoldengloves() {
        var level = input5.value;
        var ghostlevel = level;
        var total = 0;
        if (ghostlevel >= 200) {
            total += 3000;
            ghostlevel -= 200;
            while (ghostlevel > 0) {
                total += 10;
                ghostlevel -= 1;
            }
        } else {
            while (ghostlevel > 0) {
                total += 15;
                ghostlevel -= 1;
            }
        }
        if (level > 200) {
            var lasttotal = total - 10;
        } else {
            var lasttotal = total - 15;
        }
        var displaytotal = Math.floor(total);
        var displaylasttotal = Math.floor(lasttotal);
        var exp = (total / lasttotal * 100 - 100);
        if(exp<1) {
            var exp = exp.toFixed(Math.abs(Math.log(exp)/Math.log(10))+3);
        } else {
            var exp = exp.toPrecision(3);
        }
        eff5.textContent = ("Effect: " + Math.round(displaytotal) + "%");
        if (level > 1) {
            lasteff5.textContent = ("Last level's Effect: " + Math.round(displaylasttotal) + "%");
            rel5.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff5.textContent = ("Last level's Effect: N/A");
            rel5.textContent = ("Relative increase from last level: N/A");
        }
        return total / 100 + 1;
    }
    //////////
    function updategoldvessels() {
        var level = input6.value;
        var ghostlevel = level;
        var total = 0;
        if (ghostlevel >= 100) {
            total += 1000;
            ghostlevel -= 100;
            while (ghostlevel > 0) {
                total += 5;
                ghostlevel -= 1;
            }
        } else {
            while (ghostlevel > 0) {
                total += 10;
                ghostlevel -= 1;
            }
        }
        if (level > 100) {
            var lasttotal = total - 5;
        } else {
            var lasttotal = total - 10;
        }
        var displaytotal = Math.floor(total);
        var displaylasttotal = Math.floor(lasttotal);
        var exp = (total / lasttotal * 100 - 100);
        if(exp<1) {
            var exp = exp.toFixed(Math.abs(Math.log(exp)/Math.log(10))+3);
        } else {
            var exp = exp.toPrecision(3);
        }
        eff6.textContent = ("Effect: " + Math.round(displaytotal) + "%");
        if (level > 1) {
            lasteff6.textContent = ("Last level's Effect: " + Math.round(displaylasttotal) + "%");
            rel6.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff6.textContent = ("Last level's Effect: N/A");
            rel6.textContent = ("Relative increase from last level: N/A");
        }
        return total / 100 + 1;
    }
    //////////
    function updatephilostone() {
        var level = input7.value;
        var ghostlevel = level;
        var total = 0;
        if (ghostlevel >= 500) {
            total += 5000;
            ghostlevel -= 500;
            while (ghostlevel > 0) {
                total += 2;
                ghostlevel -= 1;
            }
        } else {
            while (ghostlevel > 0) {
                total += 10;
                ghostlevel -= 1;
            }
        }
        if (level > 500) {
            var lasttotal = total - 2;
        } else {
            var lasttotal = total - 10;
        }
        var displaytotal = Math.floor(total);
        var displaylasttotal = Math.floor(lasttotal);
        var exp = (total / lasttotal * 100 - 100);
        if(exp<1) {
            var exp = exp.toFixed(Math.abs(Math.log(exp)/Math.log(10))+3);
        } else {
            var exp = exp.toPrecision(3);
        }
        eff7.textContent = ("Effect: " + Math.round(displaytotal) + "%");
        if (level > 1) {
            lasteff7.textContent = ("Last level's Effect: " + Math.round(displaylasttotal) + "%");
            rel7.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff7.textContent = ("Last level's Effect: N/A");
            rel7.textContent = ("Relative increase from last level: N/A");
        }
        return total / 100 + 1;
    }
    //////////
    function updatehalberd() {
        var level = input8.value;
        var ghostlevel = level;
        var total = 0;
        if (ghostlevel >= 100) {
            total += 1000;
            ghostlevel -= 100;
            while (ghostlevel > 0) {
                total += 5;
                ghostlevel -= 1;
            }
        } else {
            while (ghostlevel > 0) {
                total += 10;
                ghostlevel -= 1;
            }
        }
        if (level > 100) {
            var lasttotal = total - 5;
        } else {
            var lasttotal = total - 10;
        }
        var displaytotal = Math.floor(total);
        var displaylasttotal = Math.floor(lasttotal);
        var exp = (total / lasttotal * 100 - 100);
        if(exp<1) {
            var exp = exp.toFixed(Math.abs(Math.log(exp)/Math.log(10))+3);
        } else {
            var exp = exp.toPrecision(3);
        }
        eff8.textContent = ("Effect: " + Math.round(displaytotal) + "%");
        if (level > 1) {
            lasteff8.textContent = ("Last level's Effect: " + Math.round(displaylasttotal) + "%");
            rel8.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff8.textContent = ("Last level's Effect: N/A");
            rel8.textContent = ("Relative increase from last level: N/A");
        }
        return total / 100 + 1;
    }
    //////////
    function updatecaduceus() {
        if (input9.value > 600) {
            input9.value = 600;
        }
        var level = input9.value;
        var ghostlevel = level;
        var total = 0;
        if (ghostlevel == 600) {
            total = 28;
            ghostlevel = 0;
        } else if (ghostlevel > 200) {
            total += 20;
            ghostlevel -= 200;
            while (ghostlevel > 0) {
                total += 0.02;
                ghostlevel -= 1;
            }
        } else
            while (ghostlevel > 0) {
                total += 0.1;
                ghostlevel -= 1;
            }
        if (level > 200) {
            var lasttotal = total - 0.02;
        } else {
            var lasttotal = total - 0.1;
        }
        var displaytotal = Math.round(total * 100);
        var displaylasttotal = Math.round(lasttotal * 100);
        var exp = Math.floor(total / lasttotal * 10000 - 10000) / 100
        eff9.textContent = ("Effect: " + Math.round(displaytotal) + "%");
        if (level > 1) {
            lasteff9.textContent = ("Last level's Effect: " + Math.round(displaylasttotal) + "%");
            rel9.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff9.textContent = ("Last level's Effect: N/A");
            rel9.textContent = ("Relative increase from last level: N/A");
        }
        return total + 1;
    }
    //////////
    function updatecoatofgold() {
        if (input10.value > 300) {
            input10.value = 300;
        }
        var level = input10.value;
        var ghostlevel = level;
        var total = 0;
        if (ghostlevel == 300) {
            total = 9;
            ghostlevel = 0;
        } else if (ghostlevel > 100) {
            total += 5;
            ghostlevel -= 100;
            while (ghostlevel > 0) {
                total += 0.02;
                ghostlevel -= 1;
            }
        } else
            while (ghostlevel > 0) {
                total += 0.05;
                ghostlevel -= 1;
            }
        if (level > 100) {
            var lasttotal = total - 0.02;
        } else {
            var lasttotal = total - 0.05;
        }
        var displaytotal = Math.round(total * 100);
        var displaylasttotal = Math.round(lasttotal * 100);
        var exp = Math.floor(total / lasttotal * 10000 - 10000) / 100
        eff10.textContent = ("Effect: " + Math.round(displaytotal) + "%");
        if (level > 1) {
            lasteff10.textContent = ("Last level's Effect: " + Math.round(displaylasttotal) + "%");
            rel10.textContent = ("Relative increase from last level: " + exp + "%");
        } else {
            lasteff10.textContent = ("Last level's Effect: N/A");
            rel10.textContent = ("Relative increase from last level: N/A");
        }
        return total + 1;
    }
    //////////
    setInterval(function() {
        var baseattack = baseattackinput.value;
        baseattack = baseattack / 100 + 1;
        var awakening1power = updateawakening1();
        var awakening2power = updateawakening2();
        var mithrilswordpower = updatemithrilsword();
        var mistilteinnpower = updatemistilteinn();
        var goldvesselspower = updategoldvessels();
        var halberdpower = updatehalberd();
        var philostonepower = updatephilostone();
        var goldenglovespower = updategoldengloves();
        var caduceuspower = updatecaduceus();
        var coatofgoldpower = updatecoatofgold();
        var totalpower = baseattack * awakening1power * awakening2power * mithrilswordpower * mistilteinnpower * goldvesselspower * halberdpower * philostonepower * goldenglovespower * caduceuspower * coatofgoldpower;
        totalpowerdisplay.textContent = ("Total Power: " + totalpower.toPrecision(3));
        if (!powerinput.value == "") {
            var log = 1+(1.585+topfloorinput.value*0.001117)/100
            console.log(log);
            powermultoutput.textContent = (Math.round(Math.log(powerinput.value) / Math.log(log)));
        }
    }, 200);
});
