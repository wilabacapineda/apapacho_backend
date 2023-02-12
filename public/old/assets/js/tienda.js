const productosTiendaX = document.getElementById('productosTienda')
const cargarTienda = (productos) => {   
    const resultado = productos.map( (p) => {
        return(`
        <div id="prod_${p.id}" class="card mb-3 producto animate__animated animate__flipinX">
            <div class="producto_imagen">
                <img src="${p.thumbnail}" class="card-img-top" alt="${p.title}"/>
            </div>
            <div class="card-body producto_info text-center">
                <h5 class="card-title">${p.title}</h5>
                <div class="row producto_info_precioCompra">
                    <p class="card-text producto_info_precioCompra_precio">
                        $${p.price.toLocaleString()}
                    </p>
                </div>
            </div>
            <a href="/pages/producto/?id=${p.id}" class="producto_comprar" id="prod_${p.id}_a">
                <span class="producto_comprar_btn">Comprar</span>
            </a>
        </div>
        `)      
    }).join(" ")
    return resultado
}

if(productosTiendaX) {
    fetch('/api/productos')
    .then(data => {
        console.log(data)
        return data.json()
    } )
    .then(data => {
        productosTiendaX.innerHTML = cargarTienda(data)
    })
}



  