const sessionForm = document.getElementById('sessionForm')
if(sessionForm){
    sessionForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const output = document.querySelector("#enviando")
        const username = document.getElementById("username")
        const password = document.getElementById("password") || ''
        const data = { username: username.value, password: password.value }                     
        const action = sessionForm.getAttribute('action')          
        if(action==="/session/login"){
            fetch("/session/login", {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            }).then( res => {  
                output.style.display = "flex"
                output.classList.add(res.status === 200 ? "exito" : "fallo")
                if(res.status === 200) {
                    output.innerHTML = `Inicio de sesión exitoso!` 
                    setTimeout(() => {
                        window.location = '/'
                    },2000)  
                } else if(res.status === 401) {
                    output.innerHTML =  "Nombre de Usuario o Contraseña incorrecta"
                } else {
                    output.innerHTML =  "Error al iniciar sesión"
                }                                                
            }).catch((error) => {
                output.innerHTML = "Error al iniciar sesión"
                output.style.display = "flex"
                output.classList.add("fallo")
                console.log('error: ', error)
            })
        } else if (action==="/session/logout"){
            fetch("/session/logout", {
                method: "POST",                
            }).then( res => {            
                output.innerHTML = res.status === 200 ? "Cierre de sesión exitoso!" : "Error al cerrar sesión"
                output.style.display = "flex"
                output.classList.add(res.status === 200 ? "exito" : "fallo")
                return res.json()
            }).then(res => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: `Hasta Luego! ${res.name}`,
                    text: 'Cerrando Sesión',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                }).then( r => {
                    location.reload()
                })
            }).catch((error) => {
                output.innerHTML = "Error al cerrar sesión"
                output.style.display = "flex"
                output.classList.add("fallo")
                console.log('error: ', error)
            })
        }              
    })
}

const registerForm = document.getElementById('registerForm')
if(registerForm){
    const verifyPassword = () => {  
        const pw = document.getElementById("password").value
        const pw2 = document.getElementById("password2").value
        const output = document.querySelector("#enviando")
        output.style.display = "none"
        output.classList.remove("fallo")
        
        if(pw != pw2) {   
          output.innerHTML = "**Las contraseñas no coinciden**"
          output.style.display = "flex"
          output.classList.add("fallo")
          return false
        } else {  
            //check empty password field  
            if(pw == "") {  
                output.innerHTML = "**Contraseña vacia**"
                output.style.display = "flex"
                output.classList.add("fallo")
                return false
            }  
            
            //minimum password length validation  
            if(pw.length < 8) {  
                output.innerHTML = "**Minimo de caracteres 8**"
                output.style.display = "flex"
                output.classList.add("fallo")
                return false
            }  
            
            //maximum length of password validation  
            if(pw.length > 16) {  
                output.innerHTML = "**Máximo de caracteres 16**"
                output.style.display = "flex"
                output.classList.add("fallo")
                return false
            } 
            return true      
        }      
    }

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault()
        if(verifyPassword()){
            const output = document.querySelector("#enviando")
            const formData = new FormData(registerForm)
            const data = {
                name: formData.get('name'),
                lastname: formData.get('lastname'),
                age: formData.get('age'),
                email: formData.get('email'),
                password: formData.get('password'),
            }
            const action = registerForm.getAttribute('action')
            if(action==="/session/register"){
                fetch("/session/register", {
                    method: "POST",                                
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data),
                }).then( res => {         
                    if(res.status === 200) {
                        output.innerHTML = "Registro exitoso!"
                    } else if(res.status === 302) {
                        output.innerHTML = "Usuario ya Existe!"
                    } else {
                        output.innerHTML = "Error al registrar, intente nuevamente"
                    }
                    output.style.display = "flex"
                    output.classList.add(res.status === 200 ? "exito" : "fallo")
                    if(res.status === 200) {
                        setTimeout(() => {
                            location.href = '/login'
                        },2000)
                    }                    
                }).catch((error) => {
                    output.innerHTML = "Error al registrar, intente nuevamente"
                    output.style.display = "flex"
                    output.classList.add("fallo")
                    console.log('error: ', error)
                })
            } 
        }    
    })

} 

const productoTiendaX = document.getElementById("productoTienda")
if(productoTiendaX){
    let url = window.location.href
    let id = url.substring(parseInt(url.indexOf('/producto/'))+10)
        if(id.search(/[^0-9]/g)>=0){
            id = id.substring(0,id.search(/[^0-9]/g))
        }        
    const output = document.getElementById("error")

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
                }).then(window.location.href = "/carrito") 
            } else {
                window.location.href = "/tienda"
            }
        })
    }

    const productoForm = document.getElementById("productoForm")
    if(productoForm) {        
        productoForm.addEventListener('submit', (e) => {
            e.preventDefault()                    
            const data = { cartCount: document.getElementById("productoCantidad").value }                     
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
}

const productosCarritoX = document.getElementById('productoCarrito')
if(productosCarritoX) {    
    const idCarrito = localStorage.getItem("idCarrito")
    if(idCarrito){        
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
                window.location.href = "/tienda"
            })
        }
        
        fetch(`/api/carrito/${idCarrito}/productos`)
        .then(data => data.json())
        .then(data => {
            if(data.length>0){
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
        }).catch( err => {
            productosCarritoX.innerHTML="Error al Cargar el Carrito. Carrito Vacío"
        })
        
    } else {
        productosCarritoX.innerHTML="Carrito Vacío"
    }    
}

const addProductsForm = document.getElementById('addProductsForm')
if(addProductsForm){
    const output = document.querySelector("#enviando")
    const errorAdd = () => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ocurrió un error al añadir producto!',
            showConfirmButton: true
        }).then(res => {
            output.innerHTML = "Error al cargar el producto"
            output.style.display = "flex"
            output.classList.add("fallo")
        })
    }
    
    const successAdd = (objeto) => {
        Swal.fire({
            icon: 'success',
            title: 'Producto Añadido',
            showConfirmButton: true
        }).then(res => {
            output.innerHTML = "Producto cargado con exito!"
            output.style.display = "flex"
            output.classList.add("exito")
            addProductsForm.reset()
            objeto.then((np) => {
                window.location.href = `/productos/${np.id}`
            })
        })
    }

    addProductsForm.addEventListener('submit', (e) => {
        e.preventDefault()               
        const data = new FormData(addProductsForm)       
        fetch("/api/products/form", {
            method: "POST",
            body: data
        }).then( res => {
            res.status === 200 ? successAdd(res.json()) : errorAdd()            
        }).catch((error) => {
            errorAdd()            
            console.log('error: ', error)            
        })        
    })
}

const editProductsForm = document.getElementById('editProductsForm')
if(editProductsForm){
    let url = window.location.href
    let id = url.substring(parseInt(url.indexOf('/productos/'))+11)
    if(id.search(/[^0-9]/g)>=0){
        id = id.substring(0,id.search(/[^0-9]/g))
    }  
    const thumbnailVal = document.getElementById("thumbnail_preview").getAttribute('src')
    const output = document.querySelector("#enviando")

    const errorAdd = () => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar producto!',
            showConfirmButton: true
        }).then(res => {
            output.innerHTML = "Error al actualizar el producto"
            output.style.display = "flex"
            output.classList.add("fallo")
        })
    }
    
    const successAdd = () => {
        Swal.fire({
            icon: 'success',
            title: 'Producto Actualizado',
            showConfirmButton: true
        }).then(res => {
            output.innerHTML = "Producto actualizado con exito!"
            output.style.display = "flex"
            output.classList.add("exito")
            editProductsForm.reset()
            setTimeout(() => {
                window.location.href = `/tienda/producto/${id}`
            },2000)        
        })
    }

    editProductsForm.addEventListener('submit', (e) => {
        e.preventDefault()
        if(document.getElementById("thumbnail").value){
            const data = new FormData(editProductsForm)       
            fetch(`/api/products/form/${id}`, {
                method: "PUT",
                body: data
            }).then( res => {
                res.status === 200 ? successAdd() : errorAdd()            
            }).catch((error) => {
                errorAdd()            
                console.log('error: ', error)            
            })        
        } else {
            const data = { 
                title: document.getElementById("title").value,
                description: document.getElementById("description").value,
                price: parseInt(document.getElementById("price").value),
                code: document.getElementById("code").value,
                stock: parseInt(document.getElementById("stock").value),
                sales: parseInt(document.getElementById("sales").value),
                thumbnail: thumbnailVal
            }                    
            
            fetch(`/api/products/${id}`, {
                method: "PUT",
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
        }        
    })
}

const deleteProduct = document.getElementById("deleteProduct")
if(deleteProduct){
    let url = window.location.href
    let id = url.substring(parseInt(url.indexOf('/productos/'))+11)
    if(id.search(/[^0-9]/g)>=0){
        id = id.substring(0,id.search(/[^0-9]/g))
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
            window.location.href = "/tienda"
        })
    }
    
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
                fetch(`/api/products/${id}`, {
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