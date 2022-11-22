const productsForm = document.getElementById('productsForm')
const output = document.querySelector("#enviando");

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

const successAdd = () => {
    Swal.fire({
        icon: 'success',
        title: 'Producto Añadido',
        showConfirmButton: true
    }).then(res => {
        output.innerHTML = "Producto cargado con exito!"
        output.style.display = "flex"
        output.classList.add("exito")
        productsForm.reset()
        setTimeout(() => {
            window.location.href = "/pages/tienda.html"
        },2000)        
    })
}

if(productsForm){
    productsForm.addEventListener('submit', (e) => {
        e.preventDefault()               
        const data = new FormData(productsForm)   
        fetch("/api/productos/form", {
            method: "POST",
            body: data
        }).then( res => {
            res.status === 200 ? successAdd() : errorAdd()            
        }).catch((error) => {
            errorAdd()            
            console.log('error: ', error)            
        })        
    })
}