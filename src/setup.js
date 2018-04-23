'use strict';

const inquirer = require('inquirer'),
    node_windows = require('node-windows'),
    common = require('./common'),
    questions = require('./question').questions;

module.exports = function() {
    return inquirer.prompt(questions).then(do_setup);
};

function do_setup(answers) {
    // Perform setup based on answers object
    const command_promises = Object.keys(answers)
        // Filter out unanswered questions
        .filter(key => !!answers[key])
        // Convert answers to promises resolved/rejected by elevated SETX command executions
        .map(key => new Promise((resolve, reject) => {
            node_windows.elevate(`SETX ${key} "${answers[key]}" /m`, err => {
                if(err) {
                    return reject(err);
                }
                resolve();
            });
        }));

    // Return a promise which combines all the commands being executed
    return Promise.all(command_promises);
}
