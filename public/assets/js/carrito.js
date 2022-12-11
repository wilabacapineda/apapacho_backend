const productosCarritoX = document.getElementById('productoCarrito')
const idCarrito = localStorage.getItem("idCarrito")

const cargarCarrito = (carrito) => {
    let total = 0 
    const resultado = carrito.map( (p) => {
        total = total + (p.price*p.cartCount)
        return(`<span>
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
                                    <input type="number" value="${p.cartCount}" id="ProductoCantidadCarro${p.id}" name="ProductoCantidadCarro" min="1" step="1" max="${p.stock}">
                                </span>
                                <span>Subtotal: $${(p.price*p.cartCount).toLocaleString()}</span>
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
    
    document.getElementById("checkout_subtotal").innerHTML='$'+total.toLocaleString()
    document.getElementById("checkout_total").innerHTML='$'+total.toLocaleString()
    return resultado
}

const errorDelete = () => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ocurrió un error al vaciar el carrito!',
    })
}

const successDelete = () => {
    Swal.fire({
        icon: 'success',
        title: 'Carrito Vaciado',
        showConfirmButton: true
    }).then(res => {
        localStorage.removeItem("idCarrito")
        window.location.href = "/pages/tienda.html"
    })
}

if(productosCarritoX) {
    if(idCarrito){
        fetch(`/api/carrito/${idCarrito}/productos`)
        .then(data => data.json())
        .then(data => {
            if(data.length>0){
                console.log(data)
                productosCarritoX.innerHTML = cargarCarrito(data)
                const vaciarCarro = '<div id="vaciarCarritoDiv" class="row"><button id="emptyCart" class="btn btn-primary">Vaciar Carrito</button></div>'
                productosCarritoX.innerHTML += vaciarCarro
                const actualizarProdCart = document.querySelectorAll(".actualizarProdCart")
                if(actualizarProdCart){
                    for(let a of actualizarProdCart){
                        a.addEventListener('click', (e) => {
                            e.preventDefault()
                            const id_prod = parseInt(e.currentTarget.getAttribute('data-target'))
                            const data = { cartCount: document.getElementById("ProductoCantidadCarro"+id_prod).value }                     
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
                const emptyCart = document.getElementById("emptyCart")
                if(emptyCart){
                    emptyCart.addEventListener("click", (e) => {
                        e.preventDefault()
                        Swal.fire({
                            title: '¿Deseas vaciar y eliminar el carrito?',
                            showDenyButton: true,
                            showCancelButton: false,
                            confirmButtonText: 'Si',
                            denyButtonText: `No`,
                        }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed){
                                fetch(`/api/carrito/${idCarrito}`, {
                                    method: "DELETE"
                                }).then( res => {                        
                                    res.status === 200 ? successDelete() : errorDelete()
                                }).catch((error) => {
                                    console.log('error: ', error)
                                    errorDelete()
                                })
                            }                        
                        })
                    })
                }
            } else {
                productosCarritoX.innerHTML="Carrito Vacío"
            }            
        })
    } else {
        productosCarritoX.innerHTML="Carrito Vacío"
    }    
}