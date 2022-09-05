const http = require("http");
const Controller = require("./src/controller");
const url = require("url");


const app = new Controller();

const server = http.createServer((req,res)=>{
    let path = url.parse(req.url);
    switch (path.pathname) {
        case '/':
            app.home(req, res).then(r => {});
            break;
        case '/detail':
            app.detail(req, res).then(r => {} )
            break;
        case '/update':
            app.update(req, res).then(r => {})
            break;
        case '/create':
            app.create(req, res)
            break;
        case '/deleteItem':
            app.delete(req, res).then(r => {})
            break;
        default:
            res.end();
    }
})
    server.listen(8000, ()=> {
    console.log(`running at http://localhost:8000`)
})