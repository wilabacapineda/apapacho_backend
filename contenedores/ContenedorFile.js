import fs from 'fs'

export default class ContenedorFile {
    constructor(file){
        this.file=file
    }

    async getAll() {
        try {
            const content = await fs.promises.readFile(this.file, 'utf-8')
            return JSON.parse(content)       
        }
        catch (error) {
            console.warn(`getAll error: ${error}`)
        }
    }

    async save(Object) {
        try {
            const content = this.getAll()            
            const newID = await content.then( resp => {
                let lastElement = resp[resp.length - 1];
                if( lastElement !== undefined){
                    Object.id = parseInt(lastElement.id)+1
                } else {
                    Object.id = resp.length+1
                }            
                Object.timestamp=Date.now()
                Object.dateUpdate=Object.timestamp
                resp.push(Object)                   
                fs.promises.writeFile(this.file,JSON.stringify(resp,null,2))                
                return Object
            })
            return newID
        }
        catch (error) {
            console.warn(`readFile error, ${error}`)
        }
    }

    async update(id,object) {
      try {
        const content = this.getAll()            
        const updateObject = await content.then( resp => {
            const returnObject = []
            const updateID = resp.map( r => {                
              if(parseInt(r.id)===parseInt(id)){   
                const propNames = Object.getOwnPropertyNames(object)             
                      propNames.forEach( pn => {
                        r[pn]=object[pn]
                      })
                r.dateUpdate=Date.now()
                returnObject.push(r)
                return r
              } else {
                return r
              }
            })
            fs.promises.writeFile(this.file,JSON.stringify(updateID,null,2))                          
            return returnObject
        })
        return updateObject
      }
      catch (error) {
          console.warn(`readFile error, ${error}`)
      }
    }

    async getById(id) {
        try {
            const content = this.getAll() 
            const data = await content.then( resp => {
                return resp.find( r => r.id===id && r)
            })    
            if(data) {
                return data
            } else {
                return null
            }
            
        }
        catch (error) {
            console.warn(`getById error, ${error}`)
        }        
    }

    async deleteById(id) {
        try {
            const content = this.getAll() 
            const data = await content.then( resp => {
                const newData = resp.filter( r => r.id!==id && r)
                fs.promises.writeFile(this.file,JSON.stringify(newData,null,2)) 
                return newData               
            })            
            return(data)
        }
        catch (error) {
            console.warn(`deleteById error, ${error}`)
        } 
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.file,JSON.stringify([],null,2))             
        }
        catch (error) {
            console.warn(`deleteAll error, ${error}`)
        } 
    }

    async getNumberOfElements() {
      const content = this.getAll()            
      const data = await content.then( resp => {
          return resp.length
      })    
      if(data) {
          return data
      } else {
          return 0
      } 
    }
}