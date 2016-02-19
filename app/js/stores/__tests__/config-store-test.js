jest.dontMock('../../constants/app-constants');
jest.dontMock('../config-store');
jest.dontMock('object-assign');

describe('ConfigStore', function () {
    var AppConstants = require('../../constants/app-constants');
    var AppDispatcher;
    var Cookies;
    var ConfigStore;
    var callback;

    beforeEach(function () {
        AppDispatcher = require('../../dispatcher/app-dispatcher');
        Cookies = require('../../utils/cookies');
        ConfigStore = require('../config-store');
        callback = AppDispatcher.register.mock.calls[0][0];
    });

    it('registers a callback with the dispatcher', function () {
        expect(AppDispatcher.register.mock.calls.length).toBe(1);
    });

    it('emits a change on app initialization', function () {
        var called = false;
        ConfigStore.addChangeListener(function () {
            called = true;
        })

        callback({
            actionType: AppConstants.APP_INITIALIZED,
        });

        expect(called).toBe(true);
    });

    it('initializes with the values given in the cookies', function () {
        Cookies.get
            .mockReturnValueOnce('public')
            .mockReturnValueOnce('private');

        callback({
            actionType: AppConstants.APP_INITIALIZED,
        });

        expect(ConfigStore.getPublicCredential()).toBe('public');
        expect(ConfigStore.getPrivateCredential()).toBe('private');
    })

    it('updates itself when a config update occurs', function () {
        Cookies.get
            .mockReturnValue('garbage');

        callback({
            actionType: AppConstants.APP_INITIALIZED,
        });

        expect(ConfigStore.getPublicCredential()).toBe('garbage');
        expect(ConfigStore.getPrivateCredential()).toBe('garbage');

        var mockListener = jest.genMockFunction();

        ConfigStore.addChangeListener(mockListener);

        callback({
            actionType: AppConstants.CONFIG_UPDATE,
            data: {
                publicCredential: 'public',
                privateCredential: 'private',
            }
        });

        expect(mockListener).toBeCalled();
        expect(Cookies.set).toBeCalledWith('public-credential', 'public');
        expect(Cookies.set).toBeCalledWith('private-credential', 'private');

        Cookies.get.mockImplementation(function (key) {
            if (key === 'public-credential') {
                return 'public';
            } else {
                return 'private';
            }
        });

        expect(ConfigStore.getPublicCredential()).toBe('public');
        expect(ConfigStore.getPrivateCredential()).toBe('private');
    })
});
