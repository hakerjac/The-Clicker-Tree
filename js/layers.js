function expRootSoftcap(num,start,power){
    if(num.lte(start)) return num;
    num = num.log(10);start = start.log(10)
    return new Decimal(10).pow(num.root(power).times(start.pow(new Decimal(1).sub(new Decimal(1).div(power)))))
}
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
        if(hasUpgrade("c",14)&&hasChallenge("b1",11))mult = mult.times(10)
        if(hasAchievement('a',11))mult = mult.times(1.1)
        if(hasMilestone("b1",3))mult = mult.times(10)
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
        14:{
            unlocked(){return hasUpgrade(this.layer,13)&&(inChallenge("b1",11)||hasChallenge("b1",11))},
            fullDisplay(){return "<h2>A big BOOST about challenge</h2>"},
            cost:new Decimal(0),
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
        mp: new Decimal(0),
        mpgain: new Decimal(0)
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
        if(hasAchievement("a",21))mult = mult.times(1.1)
        if(hasAchievement("a",31))mult = mult.times(11)
        if(hasMilestone(this.layer,0))mult = mult.times(10)
        if(hasMilestone(this.layer,1))mult = mult.times(10)
        if(hasMilestone(this.layer,2))mult = mult.times(10)
        if(hasMilestone(this.layer,4))player.b1.mpgain = new Decimal(1)
        if(hasMilestone(this.layer,4))player.b1.mp = player.b1.mp.add(player.b1.mpgain.div(10))
        if(hasMilestone(this.layer,4))mult = mult.times(player.b1.mp.root(2))
        if(getBuyableAmount(this.layer,11))mult = mult.times(buyableEffect(this.layer,11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    getResetGain(){
        var gain = layers[this.layer].baseAmount().div(layers[this.layer].requires).pow(layers[this.layer].exponent).pow(layers[this.layer].gainExp()).mul(layers[this.layer].gainMult())
        gain = expRootSoftcap(gain,new Decimal(1e120),1.5)
        return gain.floor()
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches:["c"],
    hotkeys: [
        {key: "1", description: "1: Reset for first pts", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("c",23) || player.b1.unlocked},
    softcap:new Decimal(1e100),
    softcapPower:0.5,
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
            description:"解锁“世纪1”！！！<br>里程碑世纪",
            cost:new Decimal(3)
        },
        21:{
            unlocked(){return hasMilestone(this.layer,5)},
            title:"新世纪.",
            description:"解锁“世纪2”！！！<br>可购买世纪",
            cost:new Decimal(1e8)
        }
    },
    challenges:{
        11:{
            unlocked(){return hasUpgrade(this.layer,13)},
            name:"<br>thE fIrst chAllEngE",
            challengeDescription:"点^0.5<br>解锁一个升级",
            goalDescription:"10000 点<br>",
            rewardDescription:"点^1.1<br>解锁一个升级",
            canComplete:function(){return player.points.gte(10000)}
        }
    },
    milestones: {
        0:{
            unlocked(){return true},
            requirementDescription: "1.世纪1:base1的映射[10 pts]",
            effectDescription: "1st pts获取x10",
            done() { return player.b1.points.gte(10) && hasUpgrade("b1",14) },
            style() {return {'height':'75px','width':'350px'}}
        },
        1:{
            unlocked(){return hasMilestone("b1",0)},
            requirementDescription: "2.first pts'小'加成[1000 pts]",
            effectDescription: "1st pts获取x10",
            done() { return player.b1.points.gte(1000) && hasUpgrade("b1",14) },
            style() {return {'height':'75px','width':'350px'}}
        },
        2:{
            unlocked(){return hasMilestone("b1",1)},
            requirementDescription: "3.first pts加成[10000 pts]",
            effectDescription: "1st pts获取x10",
            done() { return player.b1.points.gte(10000) && hasUpgrade("b1",14) },
            style() {return {'height':'75px','width':'350px'}}
        },
        3:{
            unlocked(){return hasMilestone("b1",2)},
            requirementDescription: "4.clickers加成[1e5 pts]",
            effectDescription: "clickers获取x10",
            done() { return player.b1.points.gte(1e5) && hasUpgrade("b1",14) },
            style() {return {'height':'75px','width':'350px'}}
        },
        4:{
            unlocked(){return hasMilestone("b1",3)},
            requirementDescription: "5.新的点数[1e6 pts]",
            effectDescription: "开始生产一种新的点数-milestone pts<br>mp加成你的1p",
            done() { return player.b1.points.gte(1e6) && hasUpgrade("b1",14) },
            style() {return {'height':'75px','width':'350px'}}
        },
        5:{
            unlocked(){return hasMilestone("b1",4)},
            requirementDescription: "6.新世纪！！！[1e8 pts]",
            effectDescription: "解锁“世纪2”<br>可购买世纪",
            done() { return player.b1.points.gte(1e8) && hasUpgrade("b1",14) },
            style() {return {'height':'75px','width':'350px'}} 
        }
    },
    infoboxes:{
        1:{
            title:"世纪1-进入",
            body:`你找到时空守卫QwQ，花费了3个1st pts让他把你送到了世纪1.<br>
            这里居然有一些里程碑，你发现有些里程碑可以为你的1st pts带来加成；<br>
            有些可以链接世纪，让你自由的穿梭在时空碎片间。`
        },
        2:{
            unlocked(){return hasUpgrade("b1",21)},
            title:"世纪1-另一个人",
            body:`你探索到了世纪1的尽头，你骂道：“这tm也太短了吧！”
            然后，你就去找时空守卫QwQ，要去世纪2的门票。
            他说：“1亿 1st pts。”奸商啊！你暗暗的骂了一句，还是老老实实的交钱了，
            就在他将你送至世纪2的时候，你发现他好像不是QwQ......`
        },
        3:{
            unlocked(){return hasUpgrade("b1",21)},
            title:"世纪2-居住群落",
            body:`你进入世纪2，发现你的面前有个人类居住的群落，
            你走了过去，发现门口有个人，你问他，这里是哪儿，你是谁，
            他说：“这里是模组树制作群，我是生草守护者-匿_名”
            你走了进去。`,
        },
        4:{
            unlocked(){return getBuyableAmount("b1",3).eq(1)},
            title:"Infinity",
            body:"你到达了无限！！！"
        }
    },
    buyables: {
        11: {
            unlocked(){ return true},
            purchaseLimit:new Decimal(4000),
            cost(x) { return new Decimal(2).pow(x).div(buyableEffect("b1",12)).div(buyableEffect("b1",13)) },
            title:"<h2>小型 倍增器</h2><br><br>",
            tooltip(){ return "当前效果:<br>" +  "First Point获取x" + format(this.effect())},
            display() { return "1.5x 1p获取" + "<br><br>数量：" + format(getBuyableAmount(this.layer,this.id)) + "/" + format(this.purchaseLimit) + "<br><br>需要：" + format(this.cost()) + " First Points" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(){
                return new Decimal(1.5).pow(getBuyableAmount(this.layer,this.id)).times(buyableEffect("b1",21))
            }
        },
        12: {
            unlocked(){ return player.b1.total.gte(1e19)},
            purchaseLimit:new Decimal(1010),
            cost(x) { return new Decimal(1e15).mul(new Decimal(3).pow(x)).div(buyableEffect("b1",13)) },
            title:"<h2>小型 降价器</h2><br><br>",
            tooltip(){ return "当前效果:<br>" +  "小型倍增器价格/" + format(this.effect())},
            display() { return "降低可购买11价格" + "<br><br>数量：" + format(getBuyableAmount(this.layer,this.id)) + "/" + format(this.purchaseLimit) + "<br><br>需要：" + format(this.cost()) + " First Points" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(){
                return new Decimal(5).pow(getBuyableAmount(this.layer,this.id))
            }
        },
        13: {
            unlocked(){ return player.b1.total.gte(1e29)},
            purchaseLimit:new Decimal(88),
            cost(x) { return new Decimal(1e20).mul(new Decimal(1e5).pow(x)) },
            title:"<h2>小型 降价器^2</h2><br><br>",
            tooltip(){ return "当前效果:<br>" +  "小型降价器和倍增器价格/" + format(this.effect())},
            display() { return "降低可购买11&12价格" + "<br><br>数量：" + format(getBuyableAmount(this.layer,this.id)) + "/" + format(this.purchaseLimit) + "<br><br>需要：" + format(this.cost()) + " First Points" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(){
                return new Decimal(3).pow(getBuyableAmount(this.layer,this.id))
            }
        },
        21: {
            unlocked(){ return player.b1.total.gte(1e209)},
            purchaseLimit:new Decimal(255),
            cost(x) { return new Decimal(1e200).mul(new Decimal(10).pow(x)) },
            title:"<h2>大型 倍增器</h2><br><br>",
            tooltip(){ return "当前效果:<br>" +  "小型倍增器效果x" + format(this.effect())},
            display() { return "倍增小型倍增器效果" + "<br><br>数量：" + format(getBuyableAmount(this.layer,this.id)) + "/" + format(this.purchaseLimit) + "<br><br>需要：" + format(this.cost()) + " First Points" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(){
                return new Decimal(5).pow(getBuyableAmount(this.layer,this.id))
            }
        },
        3: {
            unlocked(){ return getBuyableAmount("b1",11).eq(4000)&&getBuyableAmount("b1",12).eq(1010)&&getBuyableAmount("b1",13).eq(88)&&getBuyableAmount("b1",21).eq(255)},
            purchaseLimit:new Decimal(1),
            cost(x) { return x },
            title:"<h2>无限 世纪</h2><br><br>",
            tooltip(){ return "当前效果:<br>" +  "？？？x" + format(this.effect())},
            display() { return "？？？？？" + "<br><br>数量：" + format(getBuyableAmount(this.layer,this.id)) + "<br><br>需要:1.79e308 First Points" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(){
                return new Decimal(1e9999).pow(getBuyableAmount(this.layer,this.id))
            }
        },
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
            ["infobox",1],
            "blank",
            ["column",[["milestone",0],["milestone",1],["milestone",2],
            ["milestone",3],["milestone",4],["milestone",5]]],
            ["display-text",function(){return "<br><hr><br>You have " + format(player.b1.mp) + " milestone points<br><br><hr><br>"}],
            ["row",[['upgrade',21]]],
            ["infobox",2],
            ]
        },
        世纪2:{
            unlocked(){return hasUpgrade("b1",21)},
            content:[
            ["infobox",3],
            ["row",[["buyable",11],["buyable",12],["buyable",13]]],
            ["row",[["buyable",21]]],
            ["row",[["buyable",3]]],
            ["infobox",4]
            ]
        },
        Infinity:{
            unlocked(){return getBuyableAmount("b1",3).eq(1)}
        }
    }
})
addLayer("a", {
    name: "", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Ach", // This appears on the layer's node. Default is the id with the first letter capitalinized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts  alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        achievement: new Decimal(0),
        total: new Decimal(20),
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
        10:{
            unlocked(){ return true },
            name:"Clicker层",
            tooltip:"介绍",
            done(){ return false},
        },
        11:{
            unlocked(){ return true },
            name:"Clicker",
            tooltip:"需求:1 clicker<br>加成:clicker获取x1.1",
            done(){ return player.c.points.gte(1)},
            onComplete(){player.a.achievement = player.a.achievement.add(1)}
        },
        12:{
            unlocked(){ return true },
            name:"Clickers",
            tooltip:"需求:2 clickers<br>加成:无",
            done(){ return player.c.points.gte(2)},
            onComplete(){player.a.achievement = player.a.achievement.add(1)}
        },
        13:{
            unlocked(){ return true },
            name:"$sudo",
            tooltip:"需求:c升级21<br>加成:clicker获取x1(",
            done(){ return hasUpgrade("c",21)},
            onComplete(){player.a.achievement = player.a.achievement.add(1)}
        },
        14:{
            unlocked(){ return true },
            name:"新层级！！！<br>1st pts",
            tooltip:"需求:解锁“1”层级<br>加成:无",
            done(){ return hasUpgrade("c",23)},
            onComplete(){player.a.achievement = player.a.achievement.add(1)}
        },
        20:{
            unlocked(){ return hasAchievement("a",14) },
            name:"1st Point层<br>   -主层",
            tooltip:"介绍",
            done(){ return false},
        },
        21:{
            unlocked(){ return hasAchievement("a",14) },
            name:"First Point",
            tooltip:"需求:1 1st point<br>加成:1st pts获取x1.1",
            done(){ return player.b1.points.gte(1)},
            onComplete(){player.a.achievement = player.a.achievement.add(1)}
        },
        22:{
            unlocked(){ return hasAchievement("a",14) },
            name:"First Pts",
            tooltip:"需求:2 1st point<br>加成:无",
            done(){ return player.b1.points.gte(2)},
            onComplete(){player.a.achievement = player.a.achievement.add(1)}
        },
        23:{
            unlocked(){ return hasAchievement("a",14) },
            name:"挑战？",
            tooltip:"需求:1升级12<br>加成:无",
            done(){ return hasUpgrade("b1",12)},
            onComplete(){player.a.achievement = player.a.achievement.add(1)}
        },
        24:{
            unlocked(){ return hasAchievement("a",14) },
            name:"挑战！！！",
            tooltip:"需求:完成'thE fIrst chAllEngE'<br>加成:无",
            done(){ return hasChallenge("b1",11)},
            onComplete(){player.a.achievement = player.a.achievement.add(1)}
        },
        25:{
            unlocked(){ return hasAchievement("a",14) },
            name:"新世纪！！！",
            tooltip:"需求:解锁“世纪1”<br>加成:无",
            done(){ return hasUpgrade("b1",14)},
            onComplete(){player.a.achievement = player.a.achievement.add(1)}
        },
        30:{
            unlocked(){ return hasAchievement("a",25) },
            name:"1st Point层<br>  -世纪1",
            tooltip:"介绍",
            done(){ return false},
        },
        31:{
            unlocked(){ return hasAchievement("a",25) },
            name:"base1的映射",
            tooltip:"需求:获得第一个里程碑<br>加成:1st pts获取x11",
            done(){ return hasMilestone("b1",0)},
            onComplete(){player.a.achievement = player.a.achievement.add(1)}
        },
        32:{
            unlocked(){ return hasAchievement("a",25) },
            name:"'小'加成",
            tooltip:"需求:获得第二个里程碑<br>加成:无",
            done(){ return hasMilestone("b1",1)},
            onComplete(){player.a.achievement = player.a.achievement.add(1)}
        },
        33:{
            unlocked(){ return hasAchievement("a",25) },
            name:"套娃。。。",
            tooltip:"需求:获得第四个里程碑<br>加成:无",
            done(){ return hasMilestone("b1",3)},
            onComplete(){player.a.achievement = player.a.achievement.add(1)}
        },
        34:{
            unlocked(){ return hasAchievement("a",25) },
            name:"里程碑点数？",
            tooltip:"需求:获得第五个里程碑<br>加成:无",
            done(){ return hasMilestone("b1",4)},
            onComplete(){player.a.achievement = player.a.achievement.add(1)}
        },
        35:{
            unlocked(){ return hasAchievement("a",25) },
            name:"新世纪^2",
            tooltip:"需求:解锁“世纪2”<br>加成:无",
            done(){ return hasMilestone("b1",5)},
            onComplete(){player.a.achievement = player.a.achievement.add(1)}
        },
        40:{
            unlocked(){ return hasAchievement("a",35) },
            name:"1st Point层<br>  -世纪2",
            tooltip:"介绍",
            done(){ return false},
        },
        41:{
            unlocked(){ return hasAchievement("a",35) },
            name:"小型 倍增器",
            tooltip:"需求:购买1000个小型 倍增器<br>加成:无",
            done(){ return getBuyableAmount("b1",11).gte(1000)},
            onComplete(){player.a.achievement = player.a.achievement.add(1)}
        },
        42:{
            unlocked(){ return hasAchievement("a",35) },
            name:"简单的打折",
            tooltip:"需求:购买500个小型 降价器<br>加成:无",
            done(){ return getBuyableAmount("b1",12).gte(500)},
            onComplete(){player.a.achievement = player.a.achievement.add(1)}
        },
        43:{
            unlocked(){ return hasAchievement("a",35) },
            name:"更大的打折",
            tooltip:"需求:购买50个小型 降价器^2<br>加成:无",
            done(){ return getBuyableAmount("b1",13).gte(50)},
            onComplete(){player.a.achievement = player.a.achievement.add(1)}
        },
        44:{
            unlocked(){ return hasAchievement("a",35) },
            name:"再次倍增",
            tooltip:"需求:购买200个大型 倍增器<br>加成:无",
            done(){ return getBuyableAmount("b1",21).gte(200)},
            onComplete(){player.a.achievement = player.a.achievement.add(1)}
        },
        45:{
            unlocked(){ return hasAchievement("a",35) },
            name:"达到极限！",
            tooltip:"需求:前4个可购买达到极限<br>加成:无",
            done(){ return getBuyableAmount("b1",11).eq(4000)&&getBuyableAmount("b1",12).eq(1010)
            &&getBuyableAmount("b1",13).eq(88)&&getBuyableAmount("b1",21).eq(255)},
            onComplete(){player.a.achievement = player.a.achievement.add(1)}
        },
        46:{
            unlocked(){ return hasAchievement("a",35) },
            name:"超越极限，达到无限！",
            tooltip:"需求:购买200个大型 倍增器<br>加成:无",
            done(){ return getBuyableAmount("b1",21).gte(200)},
            onComplete(){player.a.achievement = player.a.achievement.add(1)}
        },
        50:{
            unlocked(){ return hasAchievement("a",46) },
            name:"映射在1st Point层<br>  -Infinity",
            tooltip:"介绍",
            done(){ return false},
        },

    },
    tabFormat:[
        ["display-text",function(){ return 'You have ' + format(player.a.achievement) + "/" + format(player.a.total) + " achievements<hr>"},
    {"color": "yellow", "font-size": "20px", "font-family": "Comic Sans MS"}],
        "blank",
        "blank",
        ["row",[['achievement',10],['achievement',11],['achievement',12],['achievement',13],['achievement',14]]],
        ["row",[['achievement',20],['achievement',21],['achievement',22],['achievement',23],['achievement',24],['achievement',25]]],
        ["row",[['achievement',30],['achievement',31],['achievement',32],['achievement',33],['achievement',34],['achievement',35]]],
        ["row",[['achievement',40],['achievement',41],['achievement',42],['achievement',43],['achievement',44],['achievement',45],['achievement',46]]],
    
    ]
})


