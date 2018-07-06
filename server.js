const express = require('express'); //565.6K (gzipped: 165.2K)
const morgan = require('morgan'); //38.3K (gzipped: 12.6K)
const bodyParser = require('body-parser'); //747.5K (gzipped: 256.1K)
require('dotenv').config();
const sgMail = require('@sendgrid/mail');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + "/public"));

// Here we're setting the view directory to be ./views
// thereby letting the app know where to find the template files
app.set('views', './views');

// Here we're setting the default engine to be ejs
// note we don't need to require it, express will do that for us
app.set('view engine', 'ejs');

// Now instead of using res.send we can use
// res.render to send the output of the template by filename
app.get('/', (req, res) => {
    //res.render('index');
    const data = {
        person: {
            firstName: 'Paul',
            lastName: 'Subingsubing',
        },
    }

    //Notice now the data is the second argument passed to the template render method
    res.render('index', data);
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/projects', (req, res) => {
    res.render('projects');
});

app.post('/thanks', (req, res) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: process.env.PORTFOLIO_EMAIL,
        from: req.body.email,
        subject: 'Sending with SendGrid is Fun',
        text: 'Name: ' + req.body.firstName + ' ' + req.body.lastName + '; E-mail: ' + req.body.email,
        };
    console.log(msg)
    sgMail
        .send(msg)
        .catch(error => {
            console.error(error.toString());
        })
    res.render('thanks', { contact: req.body })
});

app.listen(process.env.PORT || 8080, () => {
    console.log('listening at http://localhost:8080');
});

module.exports = app;
