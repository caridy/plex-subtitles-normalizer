'use strict';

var libfs = require('fs'),
    glob = require("glob"),
    libpath = require('path'),
    log = require('./lib/log'),
    parser = require('subtitles-parser');


function readSrtFile(file) {
    var srt = libfs.readFileSync(file, 'utf8');
    return parser.fromSrt(srt);
}

function writeSrtFile(file, content) {
    return libfs.writeFileSync(file, content);
}

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
    var output, original, files, i; // {command:"…", args:{…}, opts:{…}}

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
            original = readSrtFile(libpath.join(cwd, files[i]));
        } catch (e) {
            log.error('* Parser error: ' + (e.stack || e));
            continue;
        }
        try {
            output = generator(original);
        } catch (e) {
            log.error('* Generator error: ' + (e.stack || e));
            continue;
        }
        if (output === original) {
            log.info('* Valid SRT format, skipping.');
            continue;
        }
        log.info('* Backing up file (*.bak)');
        try {
            writeSrtFile(libpath.join(cwd, files[i] + '.bak'), output);
        } catch (e) {
            log.error('* Backup error: ' + (e.stack || e));
            continue;
        }
        log.info('* Overwritting file');
        try {
            writeSrtFile(libpath.join(cwd, files[i]), output);
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
