//Point of no return.
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