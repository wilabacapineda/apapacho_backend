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

const writeCart = (carro) => {
    
    if(carro.length>0){
        carroTienda.innerHTML=""
        const ul = document.createElement("ul") 
        carroTienda.append(ul)
        const link_carrito = document.createElement("p")
        const link_carrito_a=document.createElement("a")                  
              link_carrito_a.href="/carrito"
              link_carrito_a.innerHTML="Ir al Carrito"
        link_carrito.append(link_carrito_a)
        carroTienda.append(link_carrito)            
        /*
        let total = carro.reduce((acc,producto) => acc + producto.subtotal,0)
        carro.forEach( (producto) => {            
            const li = document.createElement("li")
            ul.append(li)
            const link1 = document.createElement("a")
                  link1.href=base_url+"/pages/producto/producto.html"
                  link1.addEventListener('click',(e)=>{
                    e.preventDefault()
                    sessionStorage.setItem('modelo',producto.modelo.toLowerCase().replaceAll(" ","-"))
                    window.location.href=base_url+"/pages/producto/producto.html"             
                  })
            const link_img=document.createElement("img")
                  link_img.src=base_url+"/assets/img/"+producto.img
                  link_img.width="10px"
            link1.append(link_img)
            const link2 = document.createElement("a")
                  link2.href=base_url+"/pages/producto/producto.html"
                  link2.innerHTML = producto.detalle
                  link2.addEventListener('click',(e)=>{
                    e.preventDefault()
                    sessionStorage.setItem('modelo',producto.modelo.toLowerCase().replaceAll(" ","-"))
                    window.location.href=base_url+"/pages/producto/producto.html"             
                  })
            const span_info_flex = document.createElement("div")

            const span_info_flex_div1 = document.createElement("div")
                  span_info_flex_div1.id="carritoInfo-start"
            const span_info_flex_div1_cantidad = document.createElement("span")
                  span_info_flex_div1_cantidad.id="carritoInfo-start-cantidad"
            const span_info_flex_div1_cantidad_text = document.createElement("span")
                  span_info_flex_div1_cantidad_text.innerText = "Cantidad:"
            const span_info_flex_div1_cantidad_input=document.createElement("input")
                  span_info_flex_div1_cantidad_input.type="number"
                  span_info_flex_div1_cantidad_input.id="ProductoCantidadCarro"+producto.idProducto
                  span_info_flex_div1_cantidad_input.name="ProductoCantidadCarro"
                  span_info_flex_div1_cantidad_input.min=1
                  span_info_flex_div1_cantidad_input.step=1
                  span_info_flex_div1_cantidad_input.max=parseInt(producto.stock)+parseInt(producto.cantidad)
                  span_info_flex_div1_cantidad_input.value=producto.cantidad
                  span_info_flex_div1_cantidad_input.addEventListener('change',(e) => {
                    e.preventDefault
                    updateCarrito(producto.idProducto)
                  })
                  span_info_flex_div1_cantidad.append(span_info_flex_div1_cantidad_text)
                  span_info_flex_div1_cantidad.append(span_info_flex_div1_cantidad_input)
                  //span_info_cantidad.innerHTML="Cantidad: "+producto.cantidad              
                const span_info_flex_div1_precio = document.createElement("span")   
                      span_info_flex_div1_precio.innerHTML="Subtotal: $"+producto.subtotal.toLocaleString()
                span_info_flex_div1.append(span_info_flex_div1_cantidad)
                span_info_flex_div1.append(span_info_flex_div1_precio)            
        
                const span_info_flex_div2 = document.createElement("div")
                      span_info_flex_div2.id="carritoInfo-del"
                const span_info_flex_div2_a = document.createElement("a")
                      span_info_flex_div2_a.className="btn"
                      span_info_flex_div2_a.id="producto_"+producto.idProducto
                      span_info_flex_div2_a.addEventListener('click', (e) => {
                        e.preventDefault()
                        //borrarCarrito(producto.idProducto)
                        Swal.fire({
                        title: '¿Deseas eliminar el producto del Carrito de Compras?',
                        showDenyButton: true,
                        showCancelButton: false,
                        confirmButtonText: 'Si',
                        denyButtonText: `No`,
                        }).then((result) => {
                        if (result.isConfirmed) {
                                borrarCarrito(producto.idProducto)
                        } 
                        })   
                    })
                const span_info_flex_div2_a_close=document.createElement("i")
                      span_info_flex_div2_a_close.className="fas fa-trash-alt"                  
                span_info_flex_div2_a.append(span_info_flex_div2_a_close)
                span_info_flex_div2.append(span_info_flex_div2_a)

                span_info_flex.append(span_info_flex_div1)
                span_info_flex.append(span_info_flex_div2)

                const div_info =document.createElement("div")
                      div_info.id="carritoInfo"                  
                      div_info.append(link2)
                      div_info.append(span_info_flex)            

                li.append(link1)            
                li.append(div_info)
        })
        const total_li = document.createElement("li")
              total_li.id="carritoInfoTotal"
              total_li.innerHTML="SubTotal compra: $"+total.toLocaleString()
        ul.append(total_li)
        */
    } else {
        carroTienda.innerHTML="<p>El carro de compras está vacio</p>"
    }
}

const registerForm = document.getElementById('registerForm')
if(registerForm){
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault()
        if(verifyPassword()){
            const output = document.querySelector("#enviando")
            const action = registerForm.getAttribute('action')
            document.getElementById("phone").value = phoneInput.getNumber();
            if(action==="/session/register"){
                if(document.getElementById("thumbnail").value){
                    const data = new FormData(registerForm) 
                    fetch("/session/register", {
                        method: "POST",                                
                        body: data,
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
                } else {
                    const data = { 
                        name: document.getElementById("name").value,
                        lastname: document.getElementById("lastname").value,
                        age: parseInt(document.getElementById("age").value),
                        email: document.getElementById("email").value,
                        address: document.getElementById("address").value,
                        phone: document.getElementById("phone").value,
                        password: document.getElementById("password").value
                    }                      
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
        }    
    })

} 

const profileForm = document.getElementById('profileForm')
if(profileForm){
    const thumbnailVal = document.getElementById("thumbnail_preview").getAttribute('src')
    const output = document.querySelector("#enviando")
    const action = profileForm.getAttribute('action')

    profileForm.addEventListener('submit', (e) => {
        e.preventDefault()              
        if(action==="/session/editProfile"){
            document.getElementById("phone").value = phoneInput.getNumber();
            if(document.getElementById("thumbnail").value){
                const data = new FormData(profileForm) 
                fetch("/session/editProfile", {
                    method: "PUT",                                
                    body: data,
                }).then( res => {         
                    if(res.status === 200) {
                        output.innerHTML = "Actualización de Perfil exitosa!"
                    } else if(res.status === 302) {
                        output.innerHTML = "Usuario ya Existe!"
                    } else {
                        output.innerHTML = "Error al actualizar, intente nuevamente"
                    }
                    output.style.display = "flex"
                    output.classList.add(res.status === 200 ? "exito" : "fallo")
                    if(res.status === 200) {
                        setTimeout(() => {
                            location.href = '/login'
                        },2000)
                    }                    
                }).catch((error) => {
                    output.innerHTML = "Error al actualizar, intente nuevamente"
                    output.style.display = "flex"
                    output.classList.add("fallo")
                    console.log('error: ', error)
                })      
            } else {
                const data = { 
                    name: document.getElementById("name").value,
                    lastname: document.getElementById("lastname").value,
                    age: parseInt(document.getElementById("age").value),
                    email: document.getElementById("email").value,
                    address: document.getElementById("address").value,
                    phone: document.getElementById("phone").value,
                    avatar: thumbnailVal
                }  
                fetch("/session/editProfile", {
                    method: "PUT",                                
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data),
                }).then( res => {         
                    if(res.status === 200) {
                        output.innerHTML = "Actualización de Perfil exitosa!"
                    } else if(res.status === 302) {
                        output.innerHTML = "Usuario ya Existe!"
                    } else {
                        output.innerHTML = "Error al actualizar, intente nuevamente"
                    }
                    output.style.display = "flex"
                    output.classList.add(res.status === 200 ? "exito" : "fallo")
                    if(res.status === 200) {
                        setTimeout(() => {
                            output.style.display="block"
                            output.innerHTML = ''
                            output.className=""
                        },2000)
                    }                    
                }).catch((error) => {
                    output.innerHTML = "Error al actualizar, intente nuevamente"
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

    const errorAdd = (error='500') => {
        Swal.fire({
            icon: 'error',
            title: 'Error en Carrito',
            text: 'Ocurrió un error al añadir el producto al carrito',
            showConfirmButton: true
        }).then(res => {
            if(error==304){
                localStorage.removeItem("idCarrito")
            }            
            output.innerHTML = "Error al añadir el producto al carrito, intente nuevamente"
            output.style.display = "flex"
            output.classList.add("fallo")
        })

        

    }
    const successAdd = (res='') => {
        console.log('res',res)
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
                    res.status === 200 ? successAdd() : errorAdd(res.status)            
                    return res.json()
                }).then( res => {
                    writeCart(res)
                }).catch((error) => {
                    console.log('error: ', error)            
                    errorAdd()                                        
                })
            }                    
        })
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