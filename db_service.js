const fs = require('fs');
const path = require('path');


const db = "tasks.json";

function getDbPath() {
    return path.join(__dirname, db);
}


function initDb() {

    const filePath = getDbPath();

    let newIdToUse = 0;
    let tasks = [];

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
        return { tasks, newIdToUse };
    }

    const data = fs.readFileSync(filePath, 'utf8');
    if (!data) { return { tasks, newIdToUse }; }

    tasks = JSON.parse(data);
    newIdToUse = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 0;

    return { tasks, newIdToUse };

}

function save(tasks) {
    fs.writeFileSync(getDbPath(), JSON.stringify(tasks));
}



module.exports = { initDb, save };