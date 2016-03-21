var React = require("react");

function TaskTableTagsList(props) {
   return (
        <div style={{display:"flex", flexDirection: "row"}}>
        {props.tags.map(function (tag) {
            var name = tag.name;
            if (name && name !== "") {
                return (
                  <div key={tag.id} style={{borderRadius: 3, border: "1px solid #CCCCCC", padding: "0 5px", fontSize: 10, marginRight:3}}>{name}</div>
              );
            }
         })}
        </div>
   )
}

module.exports = TaskTableTagsList;
