const statusService = require('./status_service.js');
const logService = require('./log_service.js');
const dbService = require('./db_service.js');

function getDateFromFormatted(dateFormatted) {
    let [day, month, year] = dateFormatted.split('/');
    return new Date(year, month - 1, day);
}


/**
 * TASK MODEL:
 * 
 * > @id number
 * > @description string
 * > @status object -> { index, name, icon } -> statusService.STATUS
 * > @date date -> from @dateFormatted
 * > @dateFormatted string
 * > @createdAt date
 * > @editedAt date
 * 
 */



function add({ id, description, dateFormatted, tasks }) {

    logService.log(`➕ Adding new task > id:'${id}' | description:'${description}' | date:'${dateFormatted}'`);
    logService.log(" ");

    const statusToSet = statusService.STATUS.todo;

    const task = {
        id: id,
        description: description,
        status: statusToSet,
        date: getDateFromFormatted(dateFormatted), dateFormatted: dateFormatted,
        createdAt: new Date()
    };
    tasks.push(task);
    dbService.save(tasks);
    list({ tasks });
}

function update({ id, description, dateFormatted, tasks }) {

    logService.log(`📝 Updating task > id:'${id}' > setting > description:'${description}' | date:'${dateFormatted}'`);
    logService.log(" ");

    let task = tasks.find(t => t.id === id);
    if (!task) {
        logService.log_red(`❌ Task not found!`);
        return;
    }

    task.description = description;
    task.date = getDateFromFormatted(dateFormatted);
    task.dateFormatted = dateFormatted;
    task.editedAt = new Date();

    dbService.save(tasks);
    list({ tasks });
}

function deleteTask({ id, tasks }) {

    logService.log(`🗑️ Deleting task > id:'${id}'`);
    logService.log(" ");

    let taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
        logService.log_red(`❌ Task not found!`);
        return;
    }

    tasks.splice(taskIndex, 1);
    dbService.save(tasks);
    list({ tasks });
}

function list({ mode, tasks }) {

    if (!mode || mode == '') { mode = 'all'; }

    logService.log(`🔎 Searching tasks > filter: '${mode}'`);
    logService.log(" ");

    let filteredTasks = tasks;
    if (mode != 'all') {
        filteredTasks = tasks.filter(t => t.status.name == mode);
    }

    if (filteredTasks.length === 0) {
        logService.log_yellow(`🔍 No tasks found!`);
        return;
    }

    filteredTasks.sort((a, b) => {
        if (a.status.index === b.status.index) {
            return new Date(a.date) - new Date(b.date);
        }
        return a.status.index - b.status.index;
    });

    filteredTasks.forEach(t => {
        let msg = `${t.status.icon} ${t.dateFormatted} > ${t.description} - (${t.id})`;
        if (t.status.name === statusService.STATUS.todo.name) {
            logService.log(msg);
        } else if (t.status.name === statusService.STATUS.progress.name) {
            logService.log_yellow(msg);
        } else {
            logService.log_green(msg);
        }
    });
}

function set({ status_name, id, tasks }) {

    let statusToSet = statusService.valueOf(status_name);

    logService.log(`📝 Updating task > id:'${id}' > setting status to '${statusToSet.icon}-${statusToSet.name}'`);
    logService.log(" ");

    let task = tasks.find(t => t.id === id);
    if (!task) {
        logService.log_red(`❌ Task not found!`);
        return;
    }

    task.status = statusToSet;
    dbService.save(tasks);
    list({ tasks });

}

function info() {

    let launchCmd = 'sh task-cli.sh';

    logService.log(`💡 Showing available commands in app`);
    logService.log(" ");

    logService.log(`> use '${launchCmd} list' to list all tasks`);
    logService.log(`> use '${launchCmd} list <status>' to list only tasks in a specific status`);

    logService.log(" ");

    logService.log(`> use '${launchCmd} add <description> <dd/MM/yyyy>' to add a new task`);
    logService.log(`> use '${launchCmd} updt <id> <description> <dd/MM/yyyy>' to update task info`);
    logService.log(`> use '${launchCmd} set <id> <status>' to change a task status`);
    logService.log(`> use '${launchCmd} delete <id>' to delete a task`);

}


/**
 * ENTRY POINT
 */
let argsCaller = process.argv.slice(2);
let command = argsCaller[0];

logService.log(`----------------------------------------`);
logService.log(`🚀 TASK MANAGEMENT APP`);
logService.log(`----------------------------------------`);

// db initialization
let { tasks, newIdToUse } = dbService.initDb();
let taskAttributes = argsCaller.slice(1);

// command execution
switch (command) {

    case 'info':
        info();
        break;
    case 'add': // add <description> <dateFormatted>
        add({
            id: newIdToUse,
            description: taskAttributes[0],
            dateFormatted: taskAttributes[1], // dd/mm/yyyy
            tasks
        });
        break;
    case 'updt': // updt <id> <description> <dateFormatted>
        update({
            id: parseInt(taskAttributes[0]),
            description: taskAttributes[1],
            dateFormatted: taskAttributes[2],
            tasks
        });
        break;
    case 'delete':  // delete <id>
        deleteTask({
            id: parseInt(taskAttributes[0]),
            tasks
        });
        break;

    case 'list': // list <mode> '' | 'all' | 'todo' | 'progress' | 'done'
        list({ mode: taskAttributes, tasks });
        break;

    case 'set': // set <id> <status> 
        set({
            id: parseInt(taskAttributes[0]),
            status_name: taskAttributes[1],
            tasks
        });
        break;


    default:
        logService.log_red(`❌ Command not found!`);
        break;

}


