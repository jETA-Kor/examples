const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const xlsx = require('xlsx');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    limit: '150mb',
    extended: false,
}));

app.get('/', (req, res, next) => {
    let contents = '';
    contents += '<html><body>';
    contents += '   <form action="/" method="POST" enctype="multipart/form-data">';
    contents += '       <input type="file" name="xlsx" />';
    contents += '       <input type="submit" />';
    contents += '   </form>';
    contents += '</body></html>';

    res.send(contents);
});

app.post('/', (req, res, next) => {
    const resData = {};

    const form = new multiparty.Form({
        autoFiles: true,
    });

    form.on('file', function (name, file) {
        const workbook = xlsx.readFile(file.path);
        const sheetnames = Object.keys(workbook.Sheets);

        let i = sheetnames.length;

        while (i--) {
            const sheetname = sheetnames[i];
            resData[sheetname] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetname]);
        }
    });

    form.on('close', () => {
        res.send(resData);
    });

    form.parse(req);
});

http.createServer(app).listen(4000, () => {
    console.log('excel-to-json server listening on port ' + 4000);
});

module.exports = app;