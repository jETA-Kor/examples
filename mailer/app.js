const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const Email = require('email-templates');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    limit: '150mb',
    extended: false,
}));

const getContents = (result) => {
    let contents = '';
    contents += '<html>';
    contents += '<head>';
    contents += '<style> input, textarea { display: block; width: 640px; } </style>';
    contents += '</head>';
    contents += '<body>';
    contents += (result)?'<span>전송되었습니다.</span>':'';
    contents += '   <form action="/" method="POST">';
    contents += '       <input type="text" name="subject" placeholder="메일 제목" required="required" />';
    contents += '       <input type="text" name="name" placeholder="수신자 이름" required="required" />';
    contents += '       <input type="email" name="to" placeholder="수신 메일 주소" required="required" />';
    contents += '       <textarea name="contents" style="height: 100px;" required="required"></textarea>';
    contents += '       <input type="submit" value="전송" />';
    contents += '   </form>';
    contents += '</body>';
    contents += '</html>';

    return contents;
};

app.get('/', (req, res, next) => {
    res.send(getContents());
});

app.post('/', (req, res, next) => {
    const mailOption = {
        host: "localhost",
        port: 25,
        secure: false,
        tls: {
            rejectUnauthorized: false
        }
    };
    const transporter = nodemailer.createTransport(mailOption);

    const email = new Email({
        message: {
            from: 'noreply@jetalab.net',
            attachments: [],
        },
        transport: transporter,
        views: {options: {extension: 'ejs'}},
        preview: false,
        send: true,
    });

    const mailContents = {
        template: 'general',
        message: {
            subject: req.body.subject,
            to: req.body.to,
        },
        locals: {
            name: req.body.name,
            subject: req.body.subject,
            contents: req.body.contents,
        },
    };

    email.send(mailContents).then((info) => {
        res.send(getContents(true));
    }).catch((err) => {
        res.status(500).send(err);
    });
});

http.createServer(app).listen(4020, () => {
    console.log('mailer server listening on port 4020');
});

module.exports = app;