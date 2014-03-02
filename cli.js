'use strict';

var libfs = require('fs'),
    libpath = require('path'),
    log = require('./lib/log'),
    getopts = require('./lib/getopts'),
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
    var output, original,
        env = getopts(argv); // {command:"…", args:{…}, opts:{…}}

    if (env.opts.loglevel) {
        log.level = env.opts.loglevel;
        log.silly('logging level set to', env.opts.loglevel);
    }
    try {
        original = readSrtFile(libpath.join(cwd, env.opts.input));
    } catch (e) {
        return cb(new Error('Error parsing file ' + env.opts.input + '; ' + (e.stack || e)));
    }
    try {
        output = generator(original);
    } catch (e) {
        return cb(new Error('Error generating the output ' + (e.stack || e)));
    }
    if (env.command === 'validate') {
        if (output !== original) {
            return cb(new Error('Invalid srt format: ' + env.opts.input));
        } else {
            return cb(null, 'Valid srt format: ' + env.opts.input);
        }
    } else {
        try {
            output = writeSrtFile(libpath.join(cwd, env.opts.output), output);
        } catch (e) {
            return cb(new Error('Error writting file ' + env.opts.output + '; ' + (e.stack || e)));
        }
    }
    log.info('Writting file ' + env.opts.output);
    return cb(null, output);
}

module.exports = main;
