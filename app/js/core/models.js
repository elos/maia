import Immutable from "immutable";

const Task = Immutable.Record({
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

  in_progress: false,
  is_goal: false,
  tags: Immutable.List(),
});

const Tag = Immutable.Record({
  kind: "tag",
  id: "",
  created_at: new Date(0),
  updated_at: new Date(0),
  deleted_at: new Date(0),
  name: "",
  owner_id: "",
})

const _models = {
  Task: Task,
  Tag: Tag,
}

export default _models
export { Task, Tag }
module.exports = _models;
