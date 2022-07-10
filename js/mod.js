let modInfo = {
	name: "The Clicker Tree",
	id: "respect",
	author: "hackerjac",
	pointsName: "clicker scores",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.2.2",
	name: "The Achivements about First Point",
}

let changelog = `<h1>Changelog:</h1><br><br>
	<h1>v0.1 Clicker</h1><br>
		- 增加Clicker层级<br>
		- 增加3个升级.<br><br>
	<h3>v0.1.1</h3><br>
		- 增加First Point层级<br>
		- 增加C层级3个升级<br><br>
	<h1>v0.2 First Points</h1><br>
		- 实装First Points主界面内容<br>
		- 增加“世纪1”选项卡<br><br>
	<h3>v0.2.1</h3><br>
		- 增加关于Clicker层级的成就(4个)<br><br>
	<h3>v0.2.2</h3><br>
		- 增加关于First Point层级的成就(共10个)<br><br>
	<h3>v0.2.3</h3><br>
		- 增加mp<br><br>`
let winText = `恭喜你！但是你玩这个树纯粹是在浪费时间（<br>因为我做得很垃圾<br>但是谢谢支持！`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if(hasUpgrade("c",11))gain = gain.times(2)
	if(hasUpgrade("c",12))gain = gain.times(upgradeEffect("c",12))
	if(hasUpgrade("c",22))gain = gain.times(upgradeEffect("c",22))
	if(hasUpgrade("c",14)&&inChallenge("b1",11))gain = gain.times(1000)
	if(hasUpgrade("b1",11))gain = gain.times(upgradeEffect("c",22))
	if(inChallenge("b1",11))gain = gain.pow(0.5)
	if(hasChallenge("b1",11))gain = gain.pow(1.1)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.a.achievement.eq(player.a.total)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}