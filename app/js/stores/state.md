State
```
{
    record: {
        event, location, profile,
        tag, task, user map[ID]Record
    }

    task: {
        loading bool
    }

    history: {
        history []string
        webSocket Object<WebSocket>
    }
}
```
