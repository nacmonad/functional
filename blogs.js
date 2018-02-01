//node blogs database object

var assert = require('assert');

function BlogsDAO(database) {
    "use strict";

    this.db = database;

    this.getBlogs = function(category, page, itemsPerPage, callback) {
        "use strict";   
            
        var cursor = database.collection('blogs').find().sort({'date':-1}).limit(itemsPerPage).skip(page*itemsPerPage);

        cursor.toArray(function(err, result) {
             assert.equal(err, null);
             callback(result);
           });
    }
}

module.exports.BlogsDAO = BlogsDAO;
