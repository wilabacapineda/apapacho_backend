import instagramFeed from '../../utils/getInstagramFeed.js'
import context from '../../utils/context.js'

const getCurrentUser = (req) => {  
    return({
      name: req.user.name,
      email: req.user.email,
      lastname: req.user.lastname,
      is_admin: req.user.is_admin,
      age: req.user.age,
      phone: req.user.phone,
      avatar: req.user.avatar,
      address: req.user.address
    })
}

const addUserToData = (req,data) => req.isAuthenticated() ? data.user = getCurrentUser(req) : ''

const calculate = {
    getData: (req,prod='') =>{
        const data = { ...context }                  
        prod !== '' ? data.productos=prod : ''
        addUserToData(req,data) 
        return data 
    },
    verifyIdIsNumberNatural: (req) => {
        const id = parseInt(req.params.id)          
        if(isNaN(id) || id <= 0){          
            return false
        }
        return id
    },
    addInstagramToData: (data) => data.instagram = instagramFeed,
    fullhostname: (req) =>  req.protocol + '://' + req.get('host')
}

export default calculate