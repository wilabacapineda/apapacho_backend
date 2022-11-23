const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const productoTiendaX = document.getElementById("productoTienda")
const output = document.getElementById("error")
const verProducto = (data) => {
    return(`
        <div id="productoImagen">
            <img src="${data.thumbnail}" alt="${data.title}">
            <div id="productoOptions">
                <a href="./editProduct.html?id=${data.id}" class="btn btn-primary">Editar Producto</a>
                <a href="/api/productos/${data.id}" id="deleteProduct" class="btn btn-primary">Eliminar Producto</a>
            </div>
        </div>        
        <div id="productoInfo">
            <div id="productoVariaciones">
                <span id="productoVariacionesInfo">${data.description}</span>
                <span id="productoVariacionesPrice">Precio: $${data.price.toLocaleString()}</span>
                <span id="productoVariacionesStock">Stock: ${data.stock} disponibles</span>
            </div>
            <form id="productoForm" method="post" name="productos">
                <input name="id_prod" id="id_prod" type="hidden" value="${data.id}" />
                <input id="productoCantidad" name="cantidad" type="number" value="1" min="1" step="1" max="${data.stock}">
                <input id="productoSubmit" name="productoSubmit" type="submit" class="btn btn-primary" value="Agregar">
            </form>
            <div id="productoAlert"></div>
        </div>        
    `)    
}

const errorAdd = () => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ocurrió un error al añadir el producto al carrito',
        showConfirmButton: true
    }).then(res => {
        output.innerHTML = "Error al añadir el producto al carrito, intente nuevamente"
        output.style.display = "flex"
        output.classList.add("fallo")
    })
}

const successAdd = () => {
    Swal.fire({
        icon: 'success',
        title: 'Producto Añadido al carrito!',
        html: '<p>¿Desea terminar su compra?</p>',
        showCancelButton: true,
        confirmButtonText: 'Terminar compra',
        cancelButtonText: 'Continuar comprando',
    }).then(res => {
        if(res.isConfirmed) {   
            Swal.fire({
                icon: 'success',
                title: 'Muchas Gracias por su compra!',
            }).then(window.location.href = "/pages/carrito.html") 
        } else {
            window.location.href = "/pages/tienda.html"
        }
    })
}

const errorDelete = () => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ocurrió un error al eliminar el producto!',
    })
}

const successDelete = () => {
    Swal.fire({
        icon: 'success',
        title: 'Producto Eliminado',
        showConfirmButton: true
    }).then(res => {
        window.location.href = "/pages/tienda.html"
    })
}

if(productoTiendaX){
    fetch(`/api/productos/${params.id}`)
    .then(data => data.json())
    .then(data => {
        if(data.error){
            productoTiendaX.innerHTML="Producto no Existe"
        } else {
            productoTiendaX.innerHTML=verProducto(data)
            const productoForm = document.getElementById("productoForm")
            const deleteProduct = document.getElementById("deleteProduct")
            if(productoForm) {
                productoForm.addEventListener('submit', (e) => {
                    e.preventDefault()                    
                    const data = { cantidad: document.getElementById("productoCantidad").value }                     
                    if(!localStorage.getItem("idCarrito")){
                        fetch('/api/carrito/', {
                            method: "POST"
                        }).then(data => data.json()).then (res => {
                            localStorage.setItem("idCarrito",res.id)                  
                            fetch(`/api/carrito/${parseInt(localStorage.getItem("idCarrito"))}/productos/${document.getElementById("id_prod").value}`, {
                                method: 'POST', // or 'PUT'
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(data),
                            }).then( res => {
                                res.status === 200 ? successAdd() : errorAdd()            
                            }).catch((error) => {
                                errorAdd()            
                                console.log('error: ', error)            
                            })
                        })
                    } else {                        
                        fetch(`/api/carrito/${parseInt(localStorage.getItem("idCarrito"))}/productos/${document.getElementById("id_prod").value}`, {
                            method: 'POST', // or 'PUT'
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                        }).then( res => {
                            console.log(res)
                            res.status === 200 ? successAdd() : errorAdd()            
                        }).catch((error) => {
                            console.log('error: ', error)            
                            errorAdd()                                        
                        })
                    }                    
                })
            }
            if(deleteProduct){
                deleteProduct.addEventListener("click", (e) => {
                    e.preventDefault()
                    Swal.fire({
                        title: '¿Deseas eliminar el producto?',
                        showDenyButton: true,
                        showCancelButton: false,
                        confirmButtonText: 'Si',
                        denyButtonText: `No`,
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed){
                            fetch(`/api/productos/${params.id}`, {
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
        }
        
    })
}

