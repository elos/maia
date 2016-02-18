var RecordActions = require ("../actions/record-actions");

var RecordActionCreators = {

    save: function(kind, record) {
        RecordActions.save(kind, record);
    },

    query: function (kind, attrs) {
        RecordActions.generateQuery(kind, attrs);
    },

};

module.exports = RecordActionCreators;
