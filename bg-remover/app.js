const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const gm = require('gm');

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
    contents += '       <input type="file" name="image" />';
    contents += '       <input type="submit" />';
    contents += '   </form>';
    contents += '</body></html>';

    res.send(contents);
});

app.post('/', (req, res, next) => {
    let contents = '';
    contents += '<html>';
    contents += '<head>';
    contents += '<style> html{background-image: url(https://www.transparenttextures.com/patterns/ps-neutral.png); background-color: #666;} </style>';
    contents += '</head>';
    contents += '<body>';
    contents += '   <img src="data:image/png;base64,##_CODE_##" />';
    contents += '</body>';
    contents += '</html>';

    const form = new multiparty.Form();

    form.on('part', function (part) {
        gm(part)
            .fuzz(10, true)         // 유사 색상 선택을 위한 옵션
            .transparent('#FFFFFF') // 흰색 제거
            .trim()                 // 가장자리 빈공간 제거
            .toBuffer((err, buffer) => {
                contents = contents.replace(/##_CODE_##/gim, buffer.toString('BASE64'));
                res.send(contents);
            });
    });

    form.on('close', () => {});

    form.on('error', () => {
        res.sendStatus(500);
    });

    form.parse(req);
});

http.createServer(app).listen(4010, () => {
    console.log('bg-remover server listening on port ' + 4010);
});

module.exports = app;