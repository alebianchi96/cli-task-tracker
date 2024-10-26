// suggested icons: https://emojicombos.com/

const STATUS = {
    "todo": {
        "index": 1,
        "name": "todo",
        "icon": "⬜"
    },
    "progress": {
        "index": 2,
        "name": "progress",
        "icon": "🔁"
    },
    "done": {
        "index": 3,
        "name": "done",
        "icon": "✅"
    }
}

function valueOf(status_name) {
    if (status_name === 'todo') {
        return STATUS.todo;
    }
    if (status_name === 'progress') {
        return STATUS.progress;
    }
    return STATUS.done;
}

module.exports = { STATUS, valueOf };