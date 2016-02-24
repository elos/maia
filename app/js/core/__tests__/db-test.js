jest.dontMock("object-assign");
jest.dontMock("../db");

describe("DB", function () {
    var Gaia = require("../gaia");
    Gaia.endpoint.mockReturnValue("endpoint");

    describe("find()", function () {
        it('calls Gaia.get', function () {
        });
    });

});
