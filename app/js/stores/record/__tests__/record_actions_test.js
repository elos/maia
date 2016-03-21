jest.dontMock('immutable');
jest.dontMock('../../../constants/app-constants');
jest.dontMock('../record_actions');
jest.dontMock('../../../core/models/task')

describe('record_actions', function () {
    var Immutable = require("immutable");
    var AppConstants = require('../../../constants/app-constants');
    var Task = require('../../../core/models/task');
    var record_actions = require('../record_actions');

    it('constructs an update action', function () {
        var r = new Task();

        var u = record_actions.update(r.kind, r);

        expect(u.type).toBe(AppConstants.RECORD_UPDATE);
        expect(u.data.kind).toBe(r.kind);
        expect(u.data.record).toBe(r);
    });

    it('constructs a delete action', function () {
        var r = new Task();
        var d = record_actions.delete(r.kind, r);

        expect(d.type).toBe(AppConstants.RECORD_DELETE);
        expect(d.data.kind).toBe(r.kind);
        expect(d.data.record).toBe(r);
    });

    it('constructs a batch_update action', function () {
        var r = new Task();
        var d = record_actions.batch_update(Immutable.Map({
            task: Immutable.List([r]),
        }));

        expect(d.type).toBe(AppConstants.RECORD_BATCH_UPDATE);
        expect(d.data.get('task').count()).toBe(1);
    });
});
