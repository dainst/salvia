var elements = require("../util/elements");

var Inputs = function() {

    this.fileSelect = function(file = 'e2e-testing.pdf') {
        return elements.start.fileSelect.element(by.css("[value='" + file + "']")).click;
    };

    this.year = function(value = '2000') {
        elements.publish.input.get(1).sendKeys(value);
    };

    this.ignoreFirstRow = function() {
        return elements.csv.ignoreFirstRow.click;
    };

};

module.exports = new Inputs();