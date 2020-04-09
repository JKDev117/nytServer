//17.5 (p. 35)

const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('GET /books', () => {

  //to test that the correct 'Content-Type' has been set 
  //and that we did indeed get JSON in the response with the right status  
  it('should return an array of books', () => {
    return supertest(app)
      .get('/books')
      .expect(200)
      //Note that we are using a regular expression which simply matches 
      //the word 'json' in the header value. We could be more explicit 
      //and look for 'application/json; charset=utf-8' instead 
      //which is the full value set by the server.
      .expect('Content-Type', /json/)
      //add a then handler to the chain and get the response object itself
      .then(res => {
          expect(res.body).to.be.an('array');
          //To determine that the array contain book objects 
          expect(res.body).to.have.lengthOf.at.least(1);
          const book = res.body[0];
          expect(book).to.include.all.keys(
            'bestsellers_date', 'author', 'description', 'title'
          );
      })
  })

  //to test that we get a 400 if the sort query parameter is neither of 'title' or 'rank'. (p. 36)
  it('should be 400 if sort is incorrect', () => {
    return supertest(app)
      .get('/books')
      .query({ sort: 'MISTAKE' })
      .expect(400, 'Sort must be one of title or rank');
  });

  //to test if the array is sorted (p. 36)
  it('should sort by title', () => {
    return supertest(app)
      .get('/books')
      .query({ sort: 'title' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let sorted = true;

        let i = 0;
        // iterate once less than the length of the array
        // because we're comparing 2 items in the array at a time
        while (i < res.body.length - 1) {
          // compare book at `i` with next book at `i + 1`
          const bookAtI = res.body[i];
          const bookAtIPlus1 = res.body[i + 1];
          // if the next book is less than the book at i,
          if (bookAtIPlus1.title < bookAtI.title) {
            // the books were not sorted correctly
            sorted = false;
            break; // exit the loop
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });


});


/* Notes:

.skip() method (p. 37)

    You can tell Mocha to ignore tests with the .skip() method. You can skip an entire suite of tests like this:

    describe.skip('GET /books', () => {
    // all tests are skipped here
    });

    Or you may skip an individual test case.

    describe('GET /books', () => {
    it.skip('should return an array of books', () => {
        // this test is skipped
        // ...
    });

    it('should be 400 if sort is incorrect', () => {
        // this test is NOT skipped, runs like normal
        //  ...
    });

    // ...
    });


.only() method (p. 38)

    Alternatively, if you want to run a specific test and exclude all others you can use the .only() method. 
    This is good when you have many tests and want to temporarily focus on a single one or maybe two.

    describe('GET /books', () => {
    it.only('should return an array of books', () => {
        // only this test runs
        // ...
    });

    it('should be 400 if sort is incorrect', () => {
        // this and all other tests are skipped
        //  ...
    });

    // ...
    });

    You can also only run an entire suite:

    describe.only('GET /books', () => {
    // all tests in this suite will run, no other suite of tests will run
    });

    
    
! Important Do not check .skip and .only into Git as you generally use these as temporary measures.
*/