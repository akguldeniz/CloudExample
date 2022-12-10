"use strict"
const { json } = require("body-parser")
const { debug } = require("console")
const playfab = require("../__playfab")
const testJson = require("./wallet.json")

const raceResult = async ({ playerID, polePosition }) => {

  const playerData = await playfab.service.detail({ playerID })
  const time = await playfab.service.getTime()
  
  let response
  
  //check if any cheat flag assigned
  if (!playerData.Data.cheatFlag) {
    // if this is first reward
    if (!playerData.Data.lastRewarded) {
      
      
      response = await updateXP({playerID, polePosition, playerData});      
      

    } else {

      const timestr = playerData.Data.lastRewarded.LastUpdated.toString();
      const unixTimeZero = Date.parse(timestr);
      const diff = Date.parse(time) - unixTimeZero;
      console.log(time.toString() + "---" + Date.now().toString())
      const seconds = diff / 1000;
      console.log(seconds)
      if (seconds > 90) {  //can be rewarded

        
        response = await updateXP({playerID, polePosition, playerData})
      

      } else {  //flag as cheater

       
        const cheater = await playfab.service._markAsCheater({ playerID })
        response = cheater

      }      
    }
  }

 return response
}

const addWallet = async ({ playerID, walletAdress }) =>{
  const playerData = await playfab.service.detail({ playerID })

  
  await playfab.service.updateWalletOnPlayfab({ playerID, walletAdress})
  return String("tmp101 : wallet address updated");
}

const checkWallet = async ({ walletId, playerId }) => {

  const fs = require("fs");
  let data = fs.readFileSync("https://firebasestorage.googleapis.com/v0/b/tagrun.appspot.com/o/wallet.json?alt=media&token=89b53447-7f63-44f1-8bc7-0605a6549cb1");    
  let myObject = JSON.parse(data);

  let _str = new String();
  _str = String(walletId);  

 
  let searchObject = myObject.find(x=>x.walletId == _str);
  if(!searchObject){
    let playerObject = {      
      walletId: _str,    
      playerID: playerId
    };
    myObject.push(playerObject);
  
    let newData2 = JSON.stringify(myObject);
    
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
  let data = fs.readFileSync("https://firebasestorage.googleapis.com/v0/b/tagrun.appspot.com/o/wallet.json?alt=media&token=89b53447-7f63-44f1-8bc7-0605a6549cb1");    
  let myObject = JSON.parse(data);

  let searchObject = myObject.find(x=>x.playerID == playerId);
  if(!searchObject){
    return String("727 : wallet not found");
  }else{
    myObject.splice(searchObject,1);
    
    let newData2 = JSON.stringify(myObject);
    
    fs.writeFile("https://firebasestorage.googleapis.com/v0/b/tagrun.appspot.com/o/wallet.json?alt=media&token=89b53447-7f63-44f1-8bc7-0605a6549cb1", newData2, (err) =>{
      if(err) throw err;
      
      console.log("Item Removed");    
         
  
    }  
    )  
    return String("321 : user wallet removed");
  }
}



const updateXP = async ({playerID, polePosition, playerData}) =>{
  
  const points = [120,80,30,10]
  let currentXp = 0;
  let xpRewarded = points[polePosition]
  
  

  if (playerData && playerData.Data.xp){
    currentXp += parseInt(playerData.Data.xp.Value)
  }
  
  let xp = xpRewarded + currentXp
  await playfab.service.updateXp({ playerID, xp})


  return await rewardAmount({playerData, playerID, xpRewarded, polePosition})
  
}

const rewardAmount = async ({ playerData, playerID, xpRewarded, polePosition }) =>{
  let gold = 0;
  let diamond = 0;

  if(polePosition == 0){
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
  }

  await playfab.service.__updateLastRewarded({ playerID })        
  await playfab.service.updateGold({ playerID, gold })
  await playfab.service.updateDiamond({ playerID, diamond })

  return gold.toString() + "-" + diamond.toString() + "-" + xpRewarded.toString()

  return String(gold.toString() + "-" + diamond.toString() + "-" + xpRewarded.toString());

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
  let points = [100,250,500,100]
  let weights = [32,65,97,100]
      let random = Math.random() * 101;  
      let point = 100;
      for(let i = 0; i<weights.length; i++){
        if(random <= weights[i]){
          point = points[i];
          break;
        }
      }

      let multiplers = [1,2,3]
      let _weights = [40,80,100]
      let mRandom = Math.random() * 101;  
      let multipler = 1;
      for(let i = 0; i<_weights.length; i++){
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
  raceResult, checkWallet, removeWallet, updateXP, spinFortuneWheel, checkFortuneWheel, addWallet
}