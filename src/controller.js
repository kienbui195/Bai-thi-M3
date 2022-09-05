const fs = require('fs');
const qs = require("qs");
const url = require("url");
const DBConnect = require("./DB");
const mysql = require("mysql")


class Controller {
    constructor() {
        let db = new DBConnect();
        this.conn = db.connect();
    }

    querySQL(sql) {
        return new Promise((resolve, reject) => {
            this.conn.query(sql, (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            })
        })
    }

    navigation(res, location) {
        res.writeHead(301, {'Location' : `${location}`});
        res.end();
    }

    showForm(path, res) {
        let data = fs.readFileSync(path, 'utf-8');
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(data);
        res.end();
    }

    async home(req, res) {
        let sql = 'SELECT name, country FROM city;';
        let results = await this.querySQL(sql);
        let html = '';
        for (let i = 0; i < results.length; i++) {
            html += `<tr>`;
            html += `<td>${i+1}</td>`;
            html += `<td><a href="/detail?id=${results[i].name}" style="text-decoration: none">${results[i].name}</a></td>`;
            html += `<td>${results[i].country}</td>`;
            html += `<td><a class="btn btn-success" href="/update?id=${results[i].name}">Sửa</a></td>`
            html += `<td><a class="btn btn-danger" href="/deleteItem?id=${results[i].name}">Xóa</a></td>`
            html += `</tr>`;
        }
        let data = fs.readFileSync('./views/listCity.html', 'utf8');
        res.writeHead(200, {'Content-Type' : 'text/html'});
        data = data.replace('{ListProduct}', html);
        res.write(data);
        res.end();
    }

    async detail(req, res) {
        const id = qs.parse(url.parse(req.url).query).id;
        let sql = `SELECT * FROM city WHERE name = '${id}'`;
        let data = await this.querySQL(sql);
        let html = fs.readFileSync('./views/cityDetail.html','utf8');
        html = html.replace('{name}', data[0].name);
        html = html.replace('{name}', data[0].name);
        html = html.replace('{country}', data[0].country);
        html = html.replace('{S}', data[0].S);
        html = html.replace('{numberPeople}', data[0].numberPeople);
        html = html.replace('{GDP}', data[0].GDP);
        html = html.replace('{description}', data[0].description);
        res.writeHead(200, {'Content-Type' : 'text/html'})
        res.write(html);
        res.end()
    }

    async update(req, res) {
        const id = qs.parse(url.parse(req.url).query).id;
        if (req.method === 'GET') {
            let sql = `SELECT * FROM city WHERE name = '${id}'`
            let result = await this.querySQL(sql);
            let data = fs.readFileSync('./views/update.html', 'utf-8')
            data = data.replace(`<input type="text" class="form-control" name="name" id="exampleInput" style="margin-left: 20px">`, `<input type="text" class="form-control" name="name" id="exampleInput" style="margin-left: 20px" value="${result[0].name}" disabled>`)
            data = data.replace(`<input type="number" class="form-control" name="S" id="exampleInputStock" style="margin-left: 20px">`, `<input type="number" class="form-control" name="S" id="exampleInputStock" style="margin-left: 20px" value="${result[0].S}">`)
            data = data.replace(`<input type="number" class="form-control" name="numberPeople" id="exampleInputBrief" style="margin-left: 20px">`, `<input type="number" class="form-control" name="numberPeople" id="exampleInputBrief" style="margin-left: 20px" value="${result[0].numberPeople}">`)
            data = data.replace(`<input type="number" class="form-control" name="GDP" id="exampleInputBrief1" style="margin-left: 20px">`, `<input type="number" class="form-control" name="GDP" id="exampleInputBrief1" style="margin-left: 20px" value="${result[0].GDP}">`)
            res.writeHead(200, {'Content-Type' : 'text/html'})
            res.write(data)
            res.end()
        } else {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async () => {
                let newData = qs.parse(data);
                let sql = `UPDATE city
                           SET name            = '${newData.name}',
                               country           = '${newData.country}',
                               S = ${+newData.S},
                               numberPeople     = ${+newData.numberPeople},
                               GDP = ${+newData.GDP},
                               description = '${newData.description}'
                           WHERE name = ${name}`
                await this.querySQL(sql);
                this.navigation(res, '/');
            })
        }
    }

    create(req, res) {
            if (req.method === "GET") {
                this.showForm('./views/create.html', res);
            } else {
                let data = '';
                req.on('data', chunk => {
                    data += chunk;
                })
                req.on('end', async () => {
                    let newData = qs.parse(data);
                    const sql = `INSERT INTO city (name, country, S,numberPeople,GDP,  description) VALUES ('${newData.name}','${newData.country}', ${+newData.S}, ${+newData.numberPeople}, ${+newData.GDP}, '${newData.description}')`
                    await this.querySQL(sql)
                    this.navigation(res, '/')
                })
            }
    }

    async delete(req, res) {
        let id = qs.parse(url.parse(req.url).query).id;
        if (req.method === 'GET') {
            this.showForm('./views/delete.html',res);
        } else {
            let sql = `DELETE FROM city WHERE name = '${id}'`;
            await this.querySQL(sql);
            this.navigation(res, '/');
        }
    }


}

module.exports = Controller;