const http = require('http')
const fs = require('fs')
const path = require('path')
const mysql = require('mysql')
const qs = require('querystring')

const connection = mysql.createConnection({
    host:"localhost",
    user:"user1",
    password:"everybody123__",
    database: "database1"
})

connection.connect(function(err){
    if(err){
        throw err
    }
    console.log("Connected!")
})

const server = http.createServer((req,res) =>{
    if(req.method=='GET'){
        let filePath = path.join(__dirname, 'html', 'index.html')
        const ext = path.extname(filePath)
        let contentType = 'text/html'
        switch(ext){
            case '.css':
                contentType = 'text/css'
                break
            case '.js':
                contentType = 'text/javascript'
                break
            default:
                contentType = 'text/html'
        }
    
        if(!ext){
            filePath += '.html'
        }
    
        console.log(req.url)
    
        if(req.url === '/site'){
            fs.readFile(filePath, (err,data)=>{
                if(err){
                    throw err
                }else{
                    res.writeHead(200,{
                        "Content-Type": contentType
                    })
        
                    res.end(data)
                }
            })
        }
    
        if(req.url === '/css/style.css'){
            fs.readFile(path.join(__dirname, 'css', 'style.css'), (err,data)=>{
                if(err){
                    throw err
                }else{
                    res.writeHead(200,{
                        "Content-Type": 'text/css'
                    })
    
                    res.end(data)
                }
            })
        }
    }
    
    let post;

    if(req.method=='POST'){
        let body = ''

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            post = qs.parse(body);
            console.log(post)
            
            // use post['blah'], etc.
        });
    }
})

server.listen(8080, ()=>{
    console.log("Server has been started")
})
