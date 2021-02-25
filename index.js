const dotenv = require('dotenv');
const http = require('http')
const fs = require('fs')
const url = require('url')

dotenv.config({ path: './config.env' });

const replaceTemplate = require('./modules/replaceTemplate')

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8')
const dataOjbect = JSON.parse(data)


const server =  http.createServer((req,res)=>{
    const{ query , pathname } = url.parse(req.url,true)

    // Overview page
    if (pathname === "/" ||pathname === "/overview") {
        res.writeHead(200,{
            'Content-type':'text/html'
        })
        const cardsHtml = dataOjbect.map(el => replaceTemplate(tempCard,el)).join('') 
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml)
        res.end(output)
    } else 
    
    // Product page
    if (pathname === "/product") {
        res.writeHead(200,{
            'Content-type':'text/html'
        })
        const product = dataOjbect[query.id]
        const output = replaceTemplate(tempProduct,product)
        // console.log(pathname+"/"+query.id)
        res.end(output)
    } else 
    
    // API
    if (pathname === "/api") {
        res.writeHead(200,{
            'Content-type':'application/json'
        })
        res.end(data)
             
    }
      else
      
      // Error Page
      {
        res.writeHead(404,{
            'Content-type':'text/html',
            'my-own-header':'my header'
        })
        res.end('<h1>This page cannot be found</h1>')
    }
})

const PORT = process.env.PORT || 8000;

server.listen(PORT,()=>{
    console.log(`Server Started on port ${PORT}`)
})

