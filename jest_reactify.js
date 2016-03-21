var reactify = require("reactify");

module.exports = {
    process: function (src, filename) {
        console.log("ASDFKJ");
        var c = reactify(filename);
        console.log(c);
        console.log(filename);
        return c;
    },
};
