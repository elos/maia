var Immutable = require("immutable");

module.exports = Immutable.Record({
    kind: "task",
    id: "",
    created_at: new Date(0),
    updated_at: new Date(0),
    deleted_at: new Date(0),
    name: "",
    deadline: new Date(0),
    stages: Immutable.List(),
    completed_at: new Date(0),
    owner_id: "",
    prerequisites_ids: Immutable.List(),
    tags_ids: Immutable.List(),
});
