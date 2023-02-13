const buscaTienda_icon = document.getElementById("buscaTienda-spanIcon")
const buscaTienda_input = document.getElementById("buscaTienda-input")
const carroTienda_icon = document.getElementById("carroTienda-spanIcon")
const buscaTienda_resultado = document.getElementById("buscaTienda-resultado")
const carroTienda_div = document.getElementById("carroDiv")
const carroTienda_title = carroTienda_div.querySelector("h3 #close")

buscaTienda_icon.addEventListener("click", () => {
    if(buscaTienda_input.style.width){
        buscaTienda_input.style.width=""
        buscaTienda_input.style.padding="0"
        buscaTienda_resultado.style.display="none"
    } else {
        buscaTienda_input.style.width="300px"
        buscaTienda_input.style.padding="1rem"
        buscaTienda_resultado.style.display="flex"
    }    
})

buscaTienda_input.addEventListener('keyup',()=>{
    let buscar =  buscaTienda_input.value
    buscaTienda_resultado.innerHTML=""
    if(buscar && isNaN(parseInt(buscar))){       
        const aux = productos.map((el) => el)        
        let resultado = aux.filter((producto) => {
            if(
                producto.stock>0                
            ){
                const busqueda = buscar.split(" ");
                producto.nprod = 0
                
                busqueda.forEach((b) => {
                    if ((b.replace(/^\s+|\s+$/gm,'')!="") &&
                        (producto.categoria.toLowerCase().includes(b.toLowerCase())
                        || producto.modelo.toLowerCase().includes(b.toLowerCase())
                        || producto.color.toLowerCase().includes(b.toLowerCase()) 
                        || producto.talla.toLowerCase().includes(b.toLowerCase()) 
                        || producto.descripcion.toLowerCase().includes(b.toLowerCase()))
                    ) {
                        producto.nprod++
                    }
                })

                if(producto.nprod>0){
                    return producto      
                }                                
            }
        })
        resultado.sort((a,b) => b.nprod - a.nprod)

        let unique = []
        resultado = resultado.filter((producto) => {
            if (!unique.includes(producto.modelo)) {
                unique.push(producto.modelo);
                return producto
            }
        })

        resultado = resultado.slice(0,5)

        buscaTienda_resultado.style.display="flex"
        const ul = document.createElement('ul')                           
        buscaTienda_resultado.append(ul)
        resultado.forEach( (producto) => {            
            const li = document.createElement('li')
            ul.append(li)
            const link = document.createElement('a')
                  link.href=base_url+"/pages/producto/producto.html"
                  link.addEventListener('click',(e)=>{
                    e.preventDefault()
                    sessionStorage.setItem('modelo',producto.modelo.toLowerCase().replaceAll(" ","-"))
                    window.location.href=base_url+"/pages/producto/producto.html"             
                  })
            const link_img=document.createElement('img')
                  link_img.src=base_url+"/assets/img/"+producto.img
                  link_img.width="10px"
            link.append(link_img)
            const link_span=document.createElement('span')
                  link_span.innerText=producto.modelo
            link.append(link_span)
            li.append(link)            
        })
    } else if(buscar) {
        let resultado = productos.filter((producto) => (producto.id == buscar))
        buscaTienda_resultado.style.display="flex"
        const ul = document.createElement('ul')                           
        buscaTienda_resultado.append(ul)
        resultado.forEach( (producto) => {            
            const li = document.createElement('li')
            ul.append(li)
            const link = document.createElement('a')
                  link.href=base_url+"/pages/producto/producto.html"
                  link.addEventListener('click',(e)=>{
                    e.preventDefault()
                    sessionStorage.setItem('modelo',producto.modelo.toLowerCase().replaceAll(" ","-"))
                    window.location.href=base_url+"/pages/producto/producto.html"             
                  })
            const link_img=document.createElement('img')
                  link_img.src=base_url+"/assets/img/"+producto.img
                  link_img.width="10px"
            link.append(link_img)
            const link_span=document.createElement('span')
                  link_span.innerText=producto.modelo
            link.append(link_span)
            li.append(link)            
        })
    }    
})

carroTienda_icon.addEventListener('click', () => {
    if(carroTienda_div.style.left==="0px"){
        carroTienda_div.style.left="-310px"
    } else {
        carroTienda_div.style.left="0px"
    }
})

carroTienda_title.addEventListener('click', (e) => {
    e.preventDefault()
    if(carroTienda_div.style.left==="0px"){
        carroTienda_div.style.left="-310px"
    } else {
        carroTienda_div.style.left="0px"
    }  
})