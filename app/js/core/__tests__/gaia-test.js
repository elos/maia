jest.dontMock('object-assign');
jest.dontMock('../gaia');

describe('Gaia', function () {
    var Gaia = require("../gaia");
    Gaia.Host = "http://0.0.0.0:7654";
    var ConfigStore = require("../../stores/config-store");
    var PublicCredential = "public";
    var PrivateCredential = "private";
    ConfigStore.getPublicCredential.mockReturnValue(PublicCredential);
    ConfigStore.getPrivateCredential.mockReturnValue(PrivateCredential);
    var user;


    beforeEach(function () {
        Gaia.post(
            Gaia.endpoint(Gaia.Routes.Register),
            {
                username: PublicCredential,
                password: PrivateCredential
            },
            function (status, responseText) {
                expect(status).toBe(201);
                user = JSON.parse(responseText);
            }
        );
    });

    describe(".endpoint()", function () {
        it('uses the gaia host and concatenates route', function () {
            var host = 'host',
                route = 'route';

            var tHost = Gaia.Host;
            Gaia.Host = host;

            expect(Gaia.endpoint(route)).toBe("hostroute");
            Gaia.Host = tHost;
        });

        it('uses the Gaia.Host variable', function () {
            expect(Gaia.endpoint("garbage")).toContain(Gaia.Host);
        });
    });

    describe(".wsEndpoint()", function () {
        it('uses the ws protocol', function () {
            expect(Gaia.wsEndpoint('garbage')).toContain('ws');
        });
    });

    describe(".post()", function () {
    });

});
