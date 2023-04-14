const calculate = {
    sendProducts: (res, prod) => {
        res.send(prod)  
    },
    verifyIdIsNumberNatural: (req) => {
        const id = parseInt(req.params.id)          
        if(isNaN(id) || id <= 0){          
            return false
        }
        return id
    },
    sendProduct: (res, prod) => {
        if(prod && prod!=null){
            res.send(prod)
        } else {                  
            res.send({error: 'producto no existe'})
        }
    },
    sendError: (res, error) => {
        res.send(error)
    },
    createProductInit: (req) => {
        req.body.sales = 0
        req.body.variations=[] 
        req.body.price=parseInt(req.body.price)
        req.body.stock=parseInt(req.body.stock)  
    }
}

export default calculate