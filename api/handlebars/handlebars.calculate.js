import instagramFeed from '../../utils/getInstagramFeed.js'
import context from '../../utils/context.js'
import { getCurrentUser } from '../../utils/sessionFunctions.js'


const addInstagramToData = (data) => data.instagram = instagramFeed

const addUserToData = (req,data) => req.isAuthenticated() ? data.user = getCurrentUser(req) : ''

const fullhostname = (req) =>  req.protocol + '://' + req.get('host')

const getData = (req,prod='') =>{
    const data = { ...context }  
    prod !== '' ? data.productos=prod : ''
    addUserToData(req,data) 
    return data 
}
  
export {fullhostname, addInstagramToData, getData}