const productosCarritoX = document.getElementById('productoCarrito')
const idCarrito = localStorage.getItem("idCarrito")

const cargarCarrito = (carrito) => {
    let total = 0 
    const resultado = carrito.map( (p) => {
        total = total + (p.price*p.cantidad)
        return(`            
                <span>
                    <a href="/pages/producto/?id=${p.id}">
                        <img src="${p.thumbnail}" width="0">
                    </a>
                    <div id="carritoInfo">
                        <a href="/pages/producto/?id=${p.id}">
                           ${p.title}
                        </a>
                        <div>   
                            <div id="carritoInfo-start">
                                <span id="carritoInfo-start-cantidad">
                                    <span>Cantidad:</span>
                                    <input type="number" value="${p.cantidad}" id="ProductoCantidadCarro${p.id}" name="ProductoCantidadCarro" min="1" step="1" max="${p.stock}">
                                </span>
                                <span>Subtotal: $${(p.price*p.cantidad).toLocaleString()}</span>
                            </div>
                            <div id="carritoInfo-del">
                                <a class="btn deleteProdCart" id="deleteProducto_${p.id}" data-target="${p.id}">
                                    <i class="fas fa-trash-alt" aria-hidden="true"></i>
                                </a>
                                <a class="btn actualizarProdCart" id="actualizarProducto_${p.id}" data-target="${p.id}">
                                    <i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </span>`)      
    }).join(" ")
    //resultado += '<div id="vaciarCarritoDiv" class="row"><button class="btn btn-primary">Vaciar Carrito</button></div>'
    document.getElementById("checkout_subtotal").innerHTML='$'+total.toLocaleString()
    document.getElementById("checkout_total").innerHTML='$'+total.toLocaleString()
    return resultado
}

if(productosCarritoX) {
    if(idCarrito){
        fetch(`/api/carrito/${idCarrito}/productos`)
        .then(data => data.json())
        .then(data => {
            if(data.length>0){
                productosCarritoX.innerHTML = cargarCarrito(data)
                const actualizarProdCart = document.querySelectorAll(".actualizarProdCart")
                if(actualizarProdCart){
                    for(let a of actualizarProdCart){
                        a.addEventListener('click', (e) => {
                            e.preventDefault()
                            const id_prod = parseInt(e.currentTarget.getAttribute('data-target'))
                            const data = { cantidad: document.getElementById("ProductoCantidadCarro"+id_prod).value }                     
                            fetch(`/api/carrito/${parseInt(localStorage.getItem("idCarrito"))}/productos/${id_prod}`, {
                                method: 'POST', // or 'PUT'
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(data),
                            }).then( res => res.json()).then(res => {
                                location.reload()
                            })
                        })
                    }
                }
                const deleteProdCart = document.querySelectorAll(".deleteProdCart")
                if(deleteProdCart){
                    for(let a of deleteProdCart){
                        a.addEventListener('click', (e) => {
                            e.preventDefault()
                            const id_prod = parseInt(e.currentTarget.getAttribute('data-target'))
                            fetch(`/api/carrito/${parseInt(localStorage.getItem("idCarrito"))}/productos/${id_prod}`, {
                                method: 'DELETE', // or 'PUT'
                            }).then( res => res.json()).then(res => {
                                location.reload()
                            })
                        })
                    }
                }
            } else {
                productosCarritoX.innerHTML="Carrito Vacío"
            }            
        })
    } else {
        productosCarritoX.innerHTML="Carrito Vacío"
    }    
}