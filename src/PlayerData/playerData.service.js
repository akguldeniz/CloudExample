"use strict"
const { json } = require("body-parser")
const playfab = require("../__playfab")
const testJson = require("./wallet.json")

const raceResult = async ({ playerID }) => {

  const playerData = await playfab.service.detail({ playerID })

  let response
  //check if any cheat flag assigned
  if (!playerData.Data.cheatFlag) {
    // if this is first reward
    if (!playerData.Data.lastRewarded) {

      await playfab.service.__updateLastRewarded({ playerID })
      await rewardAmount({ playerData, playerID })

    } else {

      const timestr = playerData.Data.lastRewarded.LastUpdated.toString();
      const unixTimeZero = Date.parse(timestr);
      const diff = Date.now() - unixTimeZero;
      const seconds = diff / 1000;

      if (seconds > 90) {  //can be rewarded

        await playfab.service.__updateLastRewarded({ playerID })
        await rewardAmount({ playerData, playerID })

      } else {  //flag as cheater

       
        const cheater = await playfab.service._markAsCheater({ playerID })
        response = cheater

      }
      return seconds.toString();
    }
  }

 return response
}

const checkWallet = async ({ walletId, playerId }) => {

  const fs = require("fs");
  var data = fs.readFileSync("https://firebasestorage.googleapis.com/v0/b/tagrun.appspot.com/o/wallet.json?alt=media&token=89b53447-7f63-44f1-8bc7-0605a6549cb1");    
  var myObject = JSON.parse(data);

  var _str = new String();
  _str = String(walletId);  

 
  var searchObject = myObject.find(x=>x.walletId == _str);
  if(!searchObject){
    let playerObject = {      
      walletId: _str,    
      playerID: playerId
    };
    myObject.push(playerObject);
  
    var newData2 = JSON.stringify(myObject);
    
    fs.writeFile("https://firebasestorage.googleapis.com/v0/b/tagrun.appspot.com/o/wallet.json?alt=media&token=89b53447-7f63-44f1-8bc7-0605a6549cb1", newData2, (err) =>{
      if(err) throw err;
         
        
      console.log("New Data Added");
    }  
    )  
    return String("320 : user wallet updated"); 
  }else{
    return String("737 : wallet already in use");
  }
      
}


const removeWallet = async ({ playerId }) =>{
  const fs = require("fs");
  var data = fs.readFileSync("https://firebasestorage.googleapis.com/v0/b/tagrun.appspot.com/o/wallet.json?alt=media&token=89b53447-7f63-44f1-8bc7-0605a6549cb1");    
  var myObject = JSON.parse(data);

  var searchObject = myObject.find(x=>x.playerID == playerId);
  if(!searchObject){
    return String("727 : wallet not found");
  }else{
    myObject.splice(searchObject,1);
    
    var newData2 = JSON.stringify(myObject);
    
    fs.writeFile("https://firebasestorage.googleapis.com/v0/b/tagrun.appspot.com/o/wallet.json?alt=media&token=89b53447-7f63-44f1-8bc7-0605a6549cb1", newData2, (err) =>{
      if(err) throw err;
      
      console.log("Item Removed");    
         
  
    }  
    )  
    return String("321 : user wallet removed");
  }
}

const updateXP = async ({ playerID, polePosition }) =>{
  const playerData = await playfab.service.detail({ playerID })
  playerData.Data
  var points = [120,80,30,10]
  
  if (!playerData.Data.xp) {    
    var xp = points[polePosition]   
    const updateReward = await playfab.service.updateXp({ playerID, xp})
    return String("300 : xp updated");
  }else{      
    var xp = parseInt(points[polePosition]) + parseInt(playerData.Data.xp.Value)
    const updateReward = await playfab.service.updateXp({ playerID, xp })
    return String("300 : xp updated");
  }

}

const rewardAmount = async ({ playerData, playerID }) =>{
  var gold = 0;
  var diamond = 0;
  if(playerData.Data.Diamond){
    gold = 200;
    diamond = 125;
  }else if(playerData.Data.Gold){
    gold = 200;
    diamond = 48;
  }else if(playerData.Data.Silver){
    gold = 200;
    diamond = 10;
  }else{
    gold = 40;
  }

  playfab.service.updateGold({ playerID, gold })
  playfab.service.updateDiamond({ playerID, diamond })

}

const spinFortuneWheel = async ({ playerID }) =>{
  
  const playerData = await playfab.service.detail({ playerID })

  if (!playerData.Data.fortuneTime) {

    
    await playfab.service.updateFortuneWheel({ playerID })     
    return spintheWheel()   

  }else{

      const timestr = playerData.Data.fortuneTime.LastUpdated.toString();
      const unixTimeZero = Date.parse(timestr);
      const diff = Date.now() - unixTimeZero;
      const seconds = diff / 1000;

    if(seconds > 86400){
      
      await playfab.service.updateFortuneWheel({ playerID })    
      return spintheWheel()     

    }else{

      return "667 : Spin Force Detected"

    }
  }
  
}

const spintheWheel = async () =>{
  var points = [100,250,500,100]
      var weights = [32,65,97,100]
      var random = Math.random() * 101;  
      var point = 100;
      for(var i = 0; i<weights.length; i++){
        if(random <= weights[i]){
          point = points[i];
          break;
        }
      }

      var multiplers = [1,2,3]
      var _weights = [40,80,100]
      var mRandom = Math.random() * 101;  
      var multipler = 1;
      for(var i = 0; i<_weights.length; i++){
        if(mRandom <= _weights[i]){
          multipler = multiplers[i];
          break;
        }
      }

      return "g_" + String(point.toString()) + "#<-split->#" + "m_" + String(multipler.toString());   
}

const checkFortuneWheel = async ({ playerID }) =>{
  
  const playerData = await playfab.service.detail({ playerID })

  if (!playerData.Data.fortuneTime) {

    return "888 : Good luck, can spin"

  }else{

      const timestr = playerData.Data.fortuneTime.LastUpdated.toString();
      const unixTimeZero = Date.parse(timestr);
      const diff = Date.now() - unixTimeZero;
      const seconds = diff / 1000;

    if(seconds > 86400){
      
      return "888 : Good luck, can spin"

    }else{

      return "666 : Bad luck, can't spin. Remaining time in sec: " + String((86400 - seconds).toString())

    }
  }
  
}

module.exports = {
  raceResult, checkWallet, removeWallet, updateXP, spinFortuneWheel, checkFortuneWheel
}