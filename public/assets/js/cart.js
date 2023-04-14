const cargarCarrito = (carrito) => {
    let total = 0 
    const resultado = carrito.map( (p) => {
        total = total + (p.price*p.cartCount)
        return(`<span>
                    <a href="/tienda/producto/${p.id}">
                        <img src="${p.thumbnail}" width="0">
                    </a>
                    <div id="carritoInfo">
                        <a href="/tienda/producto/${p.id}">
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
    document.getElementById('crearOrden').disabled=false
    document.getElementById("checkout_subtotal").innerHTML='$'+total.toLocaleString()
    document.getElementById("checkout_total").innerHTML='$'+total.toLocaleString()
    document.getElementById('CheckoutCarrito').style.display='block'
    return resultado
} 

const cargarCarritoMin = (carrito) => {
    let total = 0 
    let totalProd = 0
    const resultado = carrito.map( (p) => {
        totalProd=parseInt(totalProd) + parseInt(p.cartCount)
        total = total + (p.price*p.cartCount)
        return(`<li>
                    <a href="/tienda/producto/${p.id}">
                        <img src="${p.thumbnail}" width="0">
                    </a>
                    <div id="carritoInfo">
                        <a href="/tienda/producto/${p.id}">
                            ${p.title}
                        </a>
                        <div>
                            <div id="carritoInfo-start">
                                <span id="carritoInfo-start-cantidad">
                                    <span>Cantidad: ${p.cartCount}</span>                                        
                                </span>
                                <span>Subtotal: $${(p.price*p.cartCount).toLocaleString()}</span>
                            </div>                            
                        </div>
                    </div>
                </li>`)      
    }).join(" ")
    
    document.getElementById("carritoInfoTotal").innerHTML=`<span><strong>Subtotal: </strong>$${total.toLocaleString()}</span>`
    document.getElementById('carritoTotalProd').innerHTML=`<span><strong>Productos Carro:</strong>${totalProd}</span>`
    
    return resultado
}

const errorDelete = (error=500) => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ocurrió un error al vaciar el carrito!',
        showConfirmButton: true
    }).then(() => {
        if(error==304){
            localStorage.removeItem("idCarrito")
            window.location.href = "/carrito"
        } 
    })
}   

const successDelete = () => {
    Swal.fire({
        icon: 'success',
        title: 'Carrito Vaciado',
        showConfirmButton: true
    }).then(res => {
        localStorage.removeItem("idCarrito")
        window.location.href = "/tienda"
    })
}

const errorAddOrder = () => {
    Swal.fire(
        'Error al enviar Order',
        '<p>Ocurrió un error al añadir el producto al carrito</p>',
        'error'
    )
}

const successAddOrder = (res='') => {
    localStorage.removeItem("idCarrito")   
    productosCarritoX.innerHTML='Orden enviada' 
    Swal.fire({
        icon: 'success',
        title: 'Order creada con exito',
        html:'<p>Pronto nos estaremos comunicando para gestionar el envío. Muchas gracias por su compra!</p>',
        showConfirmButton: false,
        timer: 2000
    }).then( () => {
        window.location.href = '/'
    })    
}

const carroTienda_div = document.getElementById("carroDiv")
const carroTienda_icon = document.getElementById("carroTienda-spanIcon")
if(carroTienda_icon){
    carroTienda_icon.addEventListener('click', () => {
        if(carroTienda_div.style.left==="0px"){
            carroTienda_div.style.left="-310px"
        } else {
            carroTienda_div.style.left="0px"
        }
      })
}
      
const carroTienda_title = document.querySelector("h3 #close")
if(carroTienda_title){
    carroTienda_title.addEventListener('click', (e) => {
        e.preventDefault()
        if(carroTienda_div.style.left==="0px"){
            carroTienda_div.style.left="-310px"
        } else {
            carroTienda_div.style.left="0px"
        }  
    })
}

const productosCarritoX = document.getElementById('productoCarrito')
const carroTienda = document.getElementById("carrito")
const idCarrito = localStorage.getItem("idCarrito")
if(idCarrito){    
                
    fetch(`/api/carrito/${idCarrito}/productos`)
    .then(data => data.json())
    .then(data => {     
        if(data.length>0){               
            if(productosCarritoX){
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
                            }).then( res => {
                                if(res.status==304){
                                    localStorage.removeItem("idCarrito")
                                } 
                                window.location.href = "/carrito"
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
                            if (result.isConfirmed){
                                fetch(`/api/carrito/${idCarrito}`, {
                                    method: "DELETE"
                                }).then( res => {                        
                                    res.status === 200 ? successDelete() : errorDelete(res.status)
                                }).catch((error) => {
                                    console.log('error: ', error)
                                    errorDelete()
                                })
                            }                        
                        })
                    })
                }
            } else if(carroTienda){                
                carroTienda.innerHTML=`<ul>${cargarCarritoMin(data)}</ul>`
            }   
        } else {
            localStorage.removeItem("idCarrito")
            if(productosCarritoX){
                productosCarritoX.innerHTML="Carrito Vacío"
            } else if(carroTienda) {
                carroTienda.innerHTML="Carrito Vacío"
            }                
        }            
    }).catch( err => {
        if(productosCarritoX){
            productosCarritoX.innerHTML="Error al Cargar el Carrito. Carrito Vacío "+err
        } else if(carroTienda) {
            carroTienda.innerHTML="Error al Cargar el Carrito. Carrito Vacío "+err
        }             
    })        
} else {
    if(productosCarritoX){
        productosCarritoX.innerHTML="Carrito Vacío"
    } else if(carroTienda) {
        carroTienda.innerHTML="Carrito Vacío"
    } 
}    

const sendOrderInfo = document.getElementById('sendOrderInfo')
if(sendOrderInfo){
    sendOrderInfo.addEventListener('submit', (e) => {
        e.preventDefault()
        const output = document.querySelector("#enviando")        
        const data = { 
            fullname: document.getElementById("fullname") ? document.getElementById("fullname").value : '',
            email: document.getElementById("email") ? document.getElementById("email").value : '',
            address: document.getElementById("address") ? document.getElementById("address").value : '',
            phone: document.getElementById("phone") ? phoneInput.getNumber() : '',
        }             
        fetch(`/api/carrito/${parseInt(localStorage.getItem("idCarrito"))}/createOrder`, {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then( res => { 
            res.status === 200 ? successAddOrder() : errorAddOrder()            
        }).catch((error) => {
            errorAddOrder()            
            console.log('error: ', error)            
        })

    })
}
