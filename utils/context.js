const context = {                    
    siteTitle:'APAPACHO',          
    siteSubTitle:'Diseño Infantil',
    description:`"Vestuario hecho a mano para apapachar a quienes amas"`,
    logo:'/assets/img/site/logo.jpg',
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
        title:'Login',
        iconLogin:'<i class="fa-solid fa-right-to-bracket"></i>',
        iconLogout:'<i class="fa-solid fa-right-from-bracket"></i>'
    },
    navbarLinksSession: [
        {
            url:'/profile',
            title:'Perfil',
            icon:'<i class="fa-solid fa-user"></i>'
        }        
    ],
    navbarLinksAdmin: [
        {
            url:'/productos',
            title:'Añadir Productos'
        }        
    ],
    slider: [
        {
            id:'slide_1',
            img:'/assets/img/site/image1.jpg',
            title:"Vestuario hecho a mano para apapachar a quienes amas",
            href:'/tienda',
            html:'Visita nuestra tienda <i class="fa-solid fa-store"></i>',
            active:true,
        },
        {
            id:'slide_2',
            img:'/assets/img/site/apapacho-46.png',
            title:"Buscanos en nuestros puntos de venta",
            href:'/encuentranos',
            html:'Encuentranos <i class="fa-solid fa-store"></i>'

        },
        {
            id:'slide_3',
            img:'/assets/img/site/apapacho-24.JPG',
            title:"Conoce quienes somos",
            href:'/quienes-somos',
            html:'Conocenos <i class="fa-solid fa-store"></i>'
        }
    ]    
}

export default context