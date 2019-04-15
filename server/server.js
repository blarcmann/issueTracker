const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const Issue = require('./issue');
const path = require('path');

app.use(express.static('build'));
app.use(bodyParser.json());
app.use(cors());

let db;

app.get('/api/issues', (req, res) => {
    const filter = {};
    if (req.query.status) {
        filter.status = req.query.status
    }
    db.collection('issues').find().toArray().then(issues => {
        const metadata = { total_count: issues.length };
        res.json({ _metadata: metadata, records: issues })
    }).catch(error => {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

app.post('/api/issues', (req, res) => {
    const newIssue = req.body;

    newIssue.created = new Date();
    if (!newIssue.status) {
        newIssue.status = 'New Issue';
    }
    const err = Issue.validateIssue(newIssue);
    if (err) {
        res.status(422).json({ message: `Invalid requrest: ${err}` });
        return;
    }
    db.collection('issues').insertOne(newIssue).then(result =>
        db.collection('issues').find({ _id: result.insertedId }).limit(1).next()
    ).then(newIssue => {
        res.json(newIssue);
    }).catch(error => {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});


MongoClient.connect('mongodb://localhost/issuetracker', { useNewUrlParser: true }).then(connection => {
    db = connection.db('issuetracker');
    app.listen(4003, () => {
        console.log('App started on port 4003');
    });
}).catch(error => {
    console.log('ERROR:', error);
});