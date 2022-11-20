"use strict"

const axios = require("axios")
const { ClientError } = require("../__helpers/errors")
const { HttpCode } = require("../__helpers/types")

// ... Globals
const baseURL = process.env.PLAYFAB_HOST
const playfab_secret_key = process.env.PLAYFAB_SECRET_KEY
const headers = {
    "Content-Type": "application/json",
    "X-SecretKey":playfab_secret_key
}


const detail = async ({ playerID }) => {

    try {
        const data={            
            PlayFabId : playerID,                        
        }
        const result = await axios({
            baseURL, headers,            
            method: "POST",
            data,
            url: "/Server/GetUserInternalData"
        })         
        
        return result.data.data
        
    } catch (error) {
        throw error
    }
}



const __updateLastRewarded = async({playerID}) => {    
    try {
        const data={                       
            PlayFabId : playerID,    
            Data:{
                "lastRewarded": Date.now().toString()
            }
        }
        const result = await axios({
            baseURL, headers,            
            method: "POST",
            data,
            url: "/Admin/UpdateUserInternalData"
        })                
        const returnData = result.data;        
        return returnData;     
        

    } catch (error) {
        throw error
    }
}

const _markAsCheater = async({playerID}) => {    
    try {
        const data={                       
            PlayFabId : playerID,    
            Data:{
                "cheatFlag":Date.now().toString()
            }
        }
        const result = await axios({
            baseURL, headers,            
            method: "POST",
            data,
            url: "/Admin/UpdateUserInternalData"
        })                
        const returnData = result.data;        
        return returnData;     
        

    } catch (error) {
        throw error
    }
}

const updateXp = async({playerID, xp}) => {    
    try {
        const data={                       
            PlayFabId : playerID,    
            Data:{
                "xp":xp
            }
        }
        const result = await axios({
            baseURL, headers,            
            method: "POST",
            data,
            url: "/Admin/UpdateUserInternalData"
        })                
        const returnData = result.data;        
        return returnData;     
        

    } catch (error) {
        throw error
    }
}

const updateGold = async({goldAmount, playerID }) => {    
    try {
        const data={             
            Amount : goldAmount,          
            PlayFabId : playerID,    
            VirtualCurrency : "AU"
        }
        const result = await axios({
            baseURL, headers,            
            method: "POST",
            data,
            url: "/Server/AddUserVirtualCurrency"
        })                
        const returnData = result.data;        
        return returnData;     
        

    } catch (error) {
        throw error
    }
}

const updateDiamond = async({diamondAmount, playerID }) => {    
    try {
        const data={             
            Amount : diamondAmount,          
            PlayFabId : playerID,    
            VirtualCurrency : "DM"
        }
        const result = await axios({
            baseURL, headers,            
            method: "POST",
            data,
            url: "/Server/AddUserVirtualCurrency"
        })                
        const returnData = result.data;        
        return returnData;     
        

    } catch (error) {
        throw error
    }
}

module.exports = {
    detail,
    __updateLastRewarded,
    _markAsCheater,
    updateXp,
    updateGold,
    updateDiamond
}
