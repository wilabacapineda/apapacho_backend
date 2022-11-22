const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const productoTiendaX = document.getElementById("productoTienda")
const verProducto = (data) => {
    return(`
        <div id="productoImagen">
            <img src="${data.thumbnail}" alt="${data.title}">
            <div>
                <a href="./editProduct.html?id=${data.id}" class="btn btn-primary">Editar Producto</a>
                <a href="/api/productos/${data.id}" id="deleteProduct" class="btn btn-primary">Eiminar Producto</a>
            </div>
        </div>        
        <div id="productoInfo">
            <div id="productoVariaciones">
                <span id="productoVariacionesInfo">${data.description}</span>
                <span id="productoVariacionesPrice">Precio: $${data.price.toLocaleString()}</span>
                <span id="productoVariacionesStock">Stock: ${data.stock} disponibles</span>
            </div>
            <form id="productoForm">
                <input name="id" type="hidden" value="${data.id}" />
                <input id="productoCantidad" name="Cantidad" type="number" value="1" min="1" step="1" max="${data.stock}">
                <input id="productoSubmit" name="productoSubmit" type="submit" class="btn btn-primary" value="Agregar">
            </form>
            <div id="productoAlert"></div>
        </div>
        
    `)    
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

