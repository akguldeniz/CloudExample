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
        if (error.response && error.response.status === HttpCode.BAD_REQUEST)
            throw new ClientError(error.response.data.message, error.response.data.code)
        else if (error.response && error.response.status === HttpCode.NOT_FOUND)
            throw new ClientError("User not found!", "USER_NOT_FOUND")
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
        if (error.response && error.response.status === HttpCode.BAD_REQUEST)
            throw new ClientError(error.response.data.message, error.response.data.code)
        else if (error.response && error.response.status === HttpCode.NOT_FOUND)
            throw new ClientError("User not found!", "USER_NOT_FOUND")
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
        if (error.response && error.response.status === HttpCode.BAD_REQUEST)
            throw new ClientError(error.response.data.message, error.response.data.code)
        else if (error.response && error.response.status === HttpCode.NOT_FOUND)
            throw new ClientError("User not found!", "USER_NOT_FOUND")
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
        if (error.response && error.response.status === HttpCode.BAD_REQUEST)
            throw new ClientError(error.response.data.message, error.response.data.code)
        else if (error.response && error.response.status === HttpCode.NOT_FOUND)
            throw new ClientError("User not found!", "USER_NOT_FOUND")
        throw error
    }
}

const updateGold = async({playerID, gold}) => {    
    try {
        const data={                
            Amount : gold,                   
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
        if (error.response && error.response.status === HttpCode.BAD_REQUEST)
            throw new ClientError(error.response.data.message, error.response.data.code)
        else if (error.response && error.response.status === HttpCode.NOT_FOUND)
            throw new ClientError("User not found!", "USER_NOT_FOUND")
        throw error
    }
}

const updateDiamond = async({playerID, diamond}) => {    
    try {
        const data={                
            Amount : diamond,                   
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
        if (error.response && error.response.status === HttpCode.BAD_REQUEST)
            throw new ClientError(error.response.data.message, error.response.data.code)
        else if (error.response && error.response.status === HttpCode.NOT_FOUND)
            throw new ClientError("User not found!", "USER_NOT_FOUND")
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
