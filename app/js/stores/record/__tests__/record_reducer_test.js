jest.dontMock('immutable');
jest.dontMock('../../../constants/app-constants');
jest.dontMock('../record_actions');
jest.dontMock('../record_reducer');
jest.dontMock('../../../core/models/task');

describe('record_reducer', function () {
    var AppConstants = require('../../../constants/app-constants');
    var Task = require('../../../core/models/task');
    var record_actions = require('../record_actions');
    var record_reducer = require('../record_reducer');

    describe('RECORD_UPDATE', function () {
        it('should handle creating initial state & undefined action types', function () {
            var s = record_reducer(null, {type: 'not defined'});
            expect(s).not.toBe(null);
        });


        it('should add a new record', function () {
            var r = (new Task()).set('id', "randalkdjfasdjf");
            var u = record_actions.update(r.get('kind'), r);

            var state = record_reducer(null, u);
            expect(state.get('task').get(r.id)).toBe(r);
        });

        it('should update an already existing record', function () {
            var r = (new Task()).set('id', 'unique').set('name', 'original');
            var u = record_actions.update(r.get('kind'), r);
            var r2 = r.set('name', 'new name');
            var u2 = record_actions.update(r2.get('kind'), r2);

            var state = record_reducer(null, u);
            expect(state.get('task').get(r.id).get('name')).toBe('original');
            state = record_reducer(state, u2);
            expect(state.get('task').get(r.id).get('name')).toBe('new name');
        })

        it('should handle unknown \'kind\'s with clarity', function () {
            var r = (new Task()).set('kind', 'peaches');
            var u = record_actions.update(r.get('kind'), r);

            try {
                record_reducer(null, u);
                expect(true).toBe(false);
            } catch (e) {
                expect(e).toContain('peaches');
            }
        });
    });

    describe('RECORD_DELETE', function () {
        it('should delete an already existing record', function () {
            var r = (new Task()).set('id', 'unique');
            var u = record_actions.update(r.get('kind'), r);
            var d = record_actions.delete(r.get('kind'), r);

            var state = record_reducer(null, u);
            expect(state.get('task').get(r.id)).not.toBe(undefined);
            state = record_reducer(state, d);
            expect(state.get('task').get(r.id)).toBe(undefined);
        });

        it('should not fail on deleting a record that doesn\'t yet exist', function () {
            var r = new Task();
            var d = record_actions.delete(r.get('kind'), r);
            var state = record_reducer(undefined, d);

            expect(state).not.toBe(undefined);
        });

        it('should handle unknown \'kind\'s with clarity', function () {
            var r = (new Task()).set('kind', 'peaches');
            var u = record_actions.delete(r.get('kind'), r);

            try {
                record_reducer(null, u);
                expect(true).toBe(false);
            } catch (e) {
                expect(e).toContain('peaches');
            }
        });
    });
});
