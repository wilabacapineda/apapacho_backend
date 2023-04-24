import fetch from "node-fetch"
import { runLogger, errorLogger } from "../logger/loggerInsta.js"
import ContenedorFile from "../contenedores/ContenedorFile.js"
import dotenv from 'dotenv'
dotenv.config()

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
        getInstagramFeedArchivo()        
    })    
}
const getInstagramFeedArchivo = async () => {
    const aux = new ContenedorFile(`${process.env.PRODUCTOS_DIR ? process.env.PRODUCTOS_DIR : './archivos'}/${process.env.PRODUCTOS_FS ? process.env.PRODUCTOS_FS : 'instagram.json'}`)                
    await aux.getAll().then(photos => {
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
}, 30*60*1000);

export default instagramFeed