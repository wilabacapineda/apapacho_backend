const ProductsDtoMemory = {
    createObjectDto: (object) => {
        return object.map(pdm => {                
            return JSON.parse(JSON.stringify(pdm))
        } )
    }
}

export default ProductsDtoMemory