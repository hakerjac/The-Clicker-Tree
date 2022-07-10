addLayer("c", {
    name: "clicker", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FAFAFA",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "clickers", // Name of prestige currency
    baseResource: "clicker scores", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() {
        let mult = new Decimal(1)
        if(hasUpgrade('c', 13))mult = mult.times(upgradeEffect('c', 13))
        if(hasAchievement('a',11))mult = mult.times(1.1)
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
            unlocked(){return hasUpgrade(this.layer,11)},
            title: "Boost: Clicker to Score",
            description: "Clicker can boost your score.",
            cost: new Decimal(2),
            effect() {
                return player[this.layer].points.add(4).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13:{
            unlocked(){return hasUpgrade(this.layer,12)},
            title: "Boost: Score to Clicker",
            description: "Score can boost your clicker.",
            cost: new Decimal(5),
            effect() {
                return player.points.add(1).pow(0.3)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        21:{
            unlocked(){return hasUpgrade(this.layer,13)},
            title: "$sudo heck game",
            description: "Change the language to Chinese.",
            cost: new Decimal(10)
        },
        22:{
            unlocked(){return hasUpgrade(this.layer,21)},
            title: "最后一个加成",
            description: "******",
            cost: new Decimal(20),
            effect(){
                return player[this.layer].points.add(1).pow(0.1)
            },
            effectDisplay(){ return format(upgradeEffect(this.layer,this.id))+ "x" }
        },
        23:{
            unlocked(){return hasUpgrade(this.layer,22)},
            title: "结束新手教程",
            description: "新层级!!!",
            cost: new Decimal(100)
        }
        }
    }
)
addLayer("b1", {
    name: "first", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "1", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#FF0000",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "first points", // Name of prestige currency
    baseResource:"clickers", // Name of resource prestige is based on
    baseAmount() {return player.c.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() {
        let mult = new Decimal(1)
        if(hasMilestone(this.layer,0))mult = mult.times(10)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "1", description: "1: Reset for first pts", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("c",23) || player.b1.unlocked},
    upgrades:{
        11:{
            title:"加成.",
            description:"懒得写简介的作者是屑（",
            cost:new Decimal(2),
        },
        12:{
            unlocked(){return hasUpgrade(this.layer,11)},
            title:"brrrrrr",
            description:"解锁挑战！！！",
            cost:new Decimal(3),
        },
        13:{
            unlocked(){return hasUpgrade(this.layer,12)},
            title:"时间墙.",
            description:"占位符，解锁挑战.",
            cost:new Decimal(2)
        },
        14:{
            unlocked(){return hasUpgrade(this.layer,13)},
            title:"新世纪.",
            description:"解锁“世纪1”.",
            cost:new Decimal(3)
        },

    },
    challenges:{
        11:{
            unlocked(){return hasUpgrade(this.layer,13)},
            name:"<br>thE fIrst chAllEngE",
            challengeDescription:"点^0.5<br>",
            goalDescription:"1000 点<br>",
            rewardDescription:"点^1.1",
            canComplete:function(){return player.points.gte(1000)}
        }
    },
    milestones: {
        0:{
            requirementDescription: "世纪1：base1的映射",
            effectDescription: "1st pts获取x10",
            done() { return player.b1.points.gte(10) && hasUpgrade("b1",14) },

        }
    
    },
    tabFormat:{
        base1主界面:{
            unlocked(){return true},
            content:[
            ["display-text",function(){return "<br>You have " + format(player.b1.points) + " first points<br><hr><br>"}
        ,{ "color": "red", "font-size": "20px", "font-family": "Comic Sans MS" }],
            "prestige-button",
            "blank",
            ["row",[['upgrade',11],['upgrade',12],['upgrade',13],['upgrade',14]]],
            "blank",
            "blank",
            "challenges"
            ]
        },
        世纪1:{
            unlocked(){return hasUpgrade("b1",14)},
            content:[
            "blank",
            ["milestone",0],
            ]
        },
    }
})
addLayer("a", {
    name: "", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Ach", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        achievement: new Decimal(0)
    }},
    color: "#FFF143",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "achievements", // Name of prestige currency
    baseResource: "clicker scores", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() {
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 'side', // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    achievements:{
        11:{
            unlocked(){ return true },
            name:"Clicker",
            tooltip:"需求:1 clickers<br>加成:clicker获取x1.1",
            done(){ return player.c.points.gte(1)},
        },
        12:{
            unlocked(){ return true },
            name:"Clickers",
            tooltip:"需求:2 clickers<br>加成:无",
            done(){ return player.c.points.gte(2)},
        },
        13:{
            unlocked(){ return true },
            name:"$sudo",
            tooltip:"需求:c升级21<br>加成:clicker获取x1(",
            done(){ return hasUpgrade("c",21)},
        },
        14:{
            unlocked(){ return true },
            name:"新层级！！！<br>1st pts",
            tooltip:"需求:解锁“1”层级<br>加成:无",
            done(){ return hasUpgrade("c",23)},
        },
    },
    tabFormat:[
        ["display-text",function(){ return 'You have ' + format(player.a.achievement) + " achievements"}],
        "blank",
        "blank",
        ["row",[['achievement',11],['achievement',12],['achievement',13],['achievement',14]]],
    ]
})