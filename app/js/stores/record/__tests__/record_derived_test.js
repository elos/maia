jest.dontMock('immutable');
jest.dontMock('../record_derived');
jest.dontMock('../record_errors');
jest.dontMock('../record_state');
jest.dontMock('../../../core/models/task');

describe('record_derived', function () {
    var Immutable = require('immutable');
    var Task = require('../../../core/models/task');
    var RecordState = require("../record_state");
    var record_derived = require("../record_derived");

    describe('getAll', function () {
        it('retrieves all records of a particular kind', function () {
            var state = new RecordState({
                task: Immutable.Map({
                    1: new Task().set('id', 1),
                    2: new Task().set('id', 2),
                    3: new Task().set('id', 3),
                })
            })

            expect(record_derived.getAll(state, 'task').size).toBe(3)
        });

        it('retrieves no records when none are defined', function () {
            var state = new RecordState();
            expect(record_derived.getAll(state, 'task').size).toBe(0);
        });

        it('handles null state', function () {
            expect(record_derived.getAll(null, 'task').size).toBe(0);
        });

        it('handles unknown kinds appropriately', function () {
            var state = new RecordState();
            try {
                record_derived.getAll(state, 'peaches')
                expect(true).toBe(false);
            } catch(e) {
                expect(e).toContain('peaches');
            }
        });
    });

    describe('getOne', function () {
        it('retrieves a particular record', function () {
            var state = new RecordState({
                task: Immutable.Map({
                    "1": new Task(),
                })
            });

            expect(record_derived.getOne(state, 'task', "1")).not.toBe(undefined);
        });

        it('returns undefined when the record is not in the state', function () {
            var state = new RecordState({
                task: Immutable.Map({
                    "1": new Task(),
                })
            });

            expect(record_derived.getOne(state, 'task', "2")).toBe(undefined);
        });

        it('handles null state', function () {
            expect(record_derived.getOne(null, 'task', "2")).toBe(undefined);
        });

        it('handles undefined kind appropriately', function () {
            try {
                record_derived.getOne(new RecordState(), 'peaches', undefined);
                expect(true).toBe(false);
            } catch (e) {
                expect(e).toContain("peaches");
            }
        });

        it('handles undefined id appropriately', function () {
            try {
                record_derived.getOne(new RecordState(), 'task', undefined);
                expect(true).toBe(false);
            } catch (e) {
                expect(e).toContain("Undefined record id");
            }
        });
    });
});
