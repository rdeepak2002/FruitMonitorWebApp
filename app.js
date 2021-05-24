const express = require('express')
const path = require('path');

const app = express()
const port = process.env.PORT || 3000 // Heroku will need the PORT environment variable
const host = '0.0.0.0';

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', function(req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, 'build')});
});

app.listen(port, host, () => console.log(`App is live on port ${port}!`))
