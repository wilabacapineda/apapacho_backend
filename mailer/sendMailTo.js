import sendMail from "./mailer.js"
import { runLogger, errorLogger } from "../logger/loggerCart.js"
import dotenv from 'dotenv'
dotenv.config()

const fullhostname = (req) => {
    return req.protocol + '://' + req.get('host')
}

const emailToAdmin = (req,c) => {
  try{
    const productsCart = c.products.map( (p) => {
        return(`<tr>
                  <td>
                    <a href="${fullhostname(req)}/tienda/producto/${p.id}">
                        <img src="${fullhostname(req)+p.thumbnail}" style="width:150px" width="150">
                    </a>
                  </td>
                  <td><a href="${fullhostname(req)}/tienda/producto/${p.id}">${p.title}</a></td>
                  <td>${p.price.toLocaleString()}</td>
                  <td>${p.cartCount}</td>                                        
                  <td>$${(p.price*p.cartCount).toLocaleString()}</td>                                            
                </tr>`)      
    }).join(" ")
    const emailBody = `<div>
                          <p>Se ha realizado un nuevo pedido en Apapacho.</p>
                          <div>
                            <span>Datos de Orden ID-${c.id}</span>
                            <ul>
                              <li><strong>Email: </strong>${c.email}</li>
                              <li><strong>Name: </strong>${c.fullname}</li>
                              <li><strong>Address: </strong>${c.address}</li>
                              <li><strong>Phone: </strong>${c.phone}</li>
                              <li><strong>Date Created: </strong>${c.dateUpdate}</li>
                            </ul>
                          </div>
                          <br/>
                          <table border="1" style="text-align: center;">
                            <thead>
                              <th>Imagen</th>
                              <th>Producto</th>
                              <th>Precio</th>
                              <th>Cantidad</th>
                              <th>Subtotal</th>
                            </thead>
                            <tbody>
                              ${productsCart}
                            </tbody>
                            <tfoot>
                              <td colspan="4"><strong>Total</strong></td>
                              <td>${c.total.toLocaleString()}</td>
                            </tfoot>
                          </table>
                        </div>`
    const subject = `Resumen Nuevo Pedido de ${c.fullname} - ${c.email} en Apapacho`
    sendMail({
        to: process.env.MY_EMAIL,
        cc: c.email,
        subject: subject,
        text: '',
        html:emailBody,    
    }).then( info => {
      runLogger(req,`sendMail from ${info.envelope.from} to ${info.envelope.to} response -> ${info.response}`)
    }).catch( err => {
      errorLogger(req,'Send Mail Rejected',`Order ID-${c.id} sent by usermail ${c.email} but sendMail error response -> ${err}`)
    }) 
  } catch(err) {
    errorLogger(req,'Send Mail Rejected',`Order ID-${c.id} sent by usermail ${c.email} but sendMail error response -> ${err}`)
  }
}

export {
    emailToAdmin
}