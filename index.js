const express = require('express');
const MiniSearch = require('minisearch');
const fs = require('fs');

const app = express();
const searchpage = fs.readFileSync(__dirname + '/searchtempate.html', {encoding: 'utf8'});
app.use(express.static('public'));
// A collection of documents for our examples
const documents = [{
        id: 1,
        title: 'Moby Dick',
        text: 'Call me Ishmael. Some years ago...',
        category: 'fiction'
    },
    {
        id: 2,
        title: 'Zen and the Art of Motorcycle Maintenance',
        url: 'https://en.wikipedia.org/wiki/Zen_and_the_Art_of_Motorcycle_Maintenance',
        text: 'I can see by my watch...',
        category: 'fiction'
    },
    {
        id: 3,
        title: 'Neuromancer',
        text: 'The sky above the port was...',
        category: 'fiction'
    },
    {
        id: 4,
        title: 'Zen and the Art of Archery',
        text: 'At first sight it must seem...',
        category: 'non-fiction'
    },
    // ...and more
]

let miniSearch = new MiniSearch({
    fields: ['title', 'text'], // fields to index for full-text search
    storeFields: ['title', 'category', 'url'] // fields to return with search results
})

// Index all documents
miniSearch.addAll(documents)
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

app.get('/search', (req, res) => {
    let results = miniSearch.search(req.query.q);
    let restemp = searchpage.replace('INSERTRESULTSHERE', JSON.stringify(results));
    res.send(restemp);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});