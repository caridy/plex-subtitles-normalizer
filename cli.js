'use strict';

var libfs = require('fs'),
    glob = require("glob"),
    libpath = require('path'),
    log = require('./lib/log'),
    parser = require('subtitles-parser');


function generator(data) {
    var i,
        lines = [],
        id = 0;
    for (i in data) {
        id += 1;
        lines.push(id);
        lines.push(data[i].startTime + ' --> ' + data[i].endTime);
        lines.push(data[i].text || '');
        lines.push('');
    }
    return lines.join('\n');
}

function main(argv, cwd, cb) {
    var output, original, data, files, i; // {command:"…", args:{…}, opts:{…}}

    log.level = 'info';

    // options is optional
    files = glob.sync("**/*.srt");
    if (files.length === 0) {
        log.info('No SRT files founded within folder: ' + process.cwd);
        return cb();
    }
    for (i = 0; i < files.length; i += 1) {
        log.info('Processing file: ' + files[i]);

        try {
            original = libfs.readFileSync(libpath.join(cwd, files[i]), 'utf8');
        } catch (e) {
            log.error('* Reading error: ' + (e.stack || e));
            continue;
        }

        try {
            data = parser.fromSrt(original);
        } catch (e) {
            log.error('* Parser error: ' + (e.stack || e));
            continue;
        }

        try {
            output = generator(data);
        } catch (e) {
            log.error('* Generator error: ' + (e.stack || e));
            continue;
        }

        if (output === original) {
            log.info('* Valid SRT format, skipping.');
            continue;
        }

        if (argv.indexOf('--nobackup') === -1) {
            log.info('* Backing up file (*.bak)');
            try {
                libfs.writeFileSync(libpath.join(cwd, files[i] + '.bak'), output);
            } catch (e) {
                log.error('* Backup error: ' + (e.stack || e));
                continue;
            }
        }

        log.info('* Overwritting file');
        try {
            libfs.writeFileSync(libpath.join(cwd, files[i]), output);
        } catch (e) {
            log.error('* Write error: ' + (e.stack || e));
            continue;
        }
        log.info('* Done with ' + files[i]);
    }
    log.info('OK');
    return cb(null);
}

module.exports = main;
