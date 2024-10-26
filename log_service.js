const colors = {
    reset: "\x1b[3m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
};



/**
 * UTILITY FUNCTIONS
 */
function log(txt) { console.log(txt); }
function log_green(txt) { console.log(`${colors.green}${txt}`); }
function log_red(txt) { console.log(`${colors.red}${txt}`); }
function log_yellow(txt) { console.log(`${colors.yellow}${txt}`); }

module.exports = { log, log_green, log_red, log_yellow };