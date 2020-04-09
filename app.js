//17.4 Working with the Express response object

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(cors());



app.use(morgan('common')); // let's see what 'common' format looks like

//require the array of books
const books = require('./books-data.js');

//http://localhost:8000/books
//or
//http://localhost:8000/books?search=
//or
//http://localhost:8000/books?search=&sort=
app.get('/books', (req, res) => {
    //We can get the search parameter and default it, if it is not provided like this: 
    //const { search = ""} = req.query; (p. 12)
    const { search = "", sort} = req.query;


    
    //validation
    if (sort) {
        if (!['title', 'rank'].includes(sort)) {
            return res
                .status(400)
                .send('Sort must be one of title or rank');
        }
    }
    
    //process request
    let results = books
        .filter(book =>
          book
             .title
             .toLowerCase()
             .includes(search.toLowerCase())
        );

    if (sort) {
        results.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });
    }

    //send response
    res.json(results);
});

/* 17.5 (p. 34)
//moved to server.js 
app.listen(8000, () => {
  console.log('Server started on PORT 8000');
});
*/

//17.5 (p. 34)
module.exports = app;