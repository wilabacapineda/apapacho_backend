const context = {                    
    siteTitle:'APAPACHO',          
    siteSubTitle:'Diseño Infantil',
    description:`"Vestuario hecho a mano para apapachar a quienes amas"`,
    logo:'/assets/img/logo.jpg',
    logoTitle:'Logo Apapacho',
    navbarLinks:[
        {
            url:'/',
            title:'Inicio'
        },
        {
            url:'/tienda',
            title:'Tienda'
        },
        {
            url:'/carrito',
            title:'Carrito'
        }
        
    ],
    loginURL: {
        url:'/login',
        title:'Login'
    },
    navbarLinksSession: [
        {
            url:'/productos',
            title:'Añadir Productos'
        }        
    ],
    slider: [
        {
            id:'slide_1',
            img:'/assets/img/image1.jpg',
            title:"Vestuario hecho a mano para apapachar a quienes amas",
            href:'/tienda',
            html:'Visita nuestra tienda <i class="fa-solid fa-store"></i>',
            active:true,
        },
        {
            id:'slide_2',
            img:'/assets/img/apapacho-46.png',
            title:"Buscanos en nuestros puntos de venta",
            href:'/encuentranos',
            html:'Encuentranos <i class="fa-solid fa-store"></i>'

        },
        {
            id:'slide_3',
            img:'/assets/img/apapacho-24.JPG',
            title:"Conoce quienes somos",
            href:'/quienes-somos',
            html:'Conocenos <i class="fa-solid fa-store"></i>'
        }
    ]    
}

export default context