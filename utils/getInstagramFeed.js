import fetch from "node-fetch"
import { runLogger, errorLogger } from "../logger/loggerInsta.js"

const instagramFeed = []

const getInstagramFeed = () => {
    fetch('https://feeds.behold.so/26PBgsa3kl4KFdoHcecV')
    .then(data => data.json())
    .then(photos => {
        runLogger()  
        instagramFeed.splice(0,instagramFeed.length)       
        photos.forEach( i => {    
            instagramFeed.push(i)
        })
    }).catch(err => {
        errorLogger(err)
    })    
}

getInstagramFeed()
setInterval(() => {       
    getInstagramFeed()    
}, 300000);

export default instagramFeed