addLayer("c", {
    name: "clicker", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FAFAFA",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "clickers", // Name of prestige currency
    baseResource: "clicker scores", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() {
        let mult = new Decimal(1)
        if (hasUpgrade('c', 13)) mult = mult.times(upgradeEffect('c', 13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: Reset for clickers", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades:{
        11:{
            title: "A small boost",
            description: "Double your score gain.",
            cost: new Decimal(1),
        },
        12:{
            title: "Boost: Clicker to Score",
            description: "Clicker can boost your score.",
            cost: new Decimal(2),
            effect() {
                return player[this.layer].points.add(4).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13:{
            title: "Boost: Score to Clicker",
            description: "Score can boost your clicker.",
            cost: new Decimal(5),
            effect() {
                return player.points.add(1).pow(0.3)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        21:{
            title: "$sudo heck game",
            description: "Change the language to Chinese.",
            cost: new Decimal(100)
        },
        22:{
            title: "最后一个加成",
            description: "******",
            cost: new Decimal(100),
            effect(){
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay(){ return format(upgradeEffect(this.layer,this.id) + "x")}
        },
        23:{
            title: "结束新手教程",
            description: "新层级!!!",
            cost: new Decimal(300)
        }
        }
    }
)
addLayer("b1", {
    name: "first", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "1", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FF0000",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "first points", // Name of prestige currency
    baseResource: "clickers", // Name of resource prestige is based on
    baseAmount() {return player.c.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() {
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "1", description: "1: Reset for first pts", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("c",23)},
})