var TagActions = require("../actions/tag-actions");

var TagActionCreators = {

    issueRefresh: function(handlers) {
        handlers = handlers || {};
        handlers.success = handlers.success || function() {};
        handlers.failure = handlers.failure || function() {};
        TagActions.refreshTags(handlers);
    }

};

module.exports = TagActionCreators;
