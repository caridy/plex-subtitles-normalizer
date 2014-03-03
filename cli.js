'use strict';

var libfs = require('fs'),
    glob = require("glob"),
    nopt = require("nopt"),
    libpath = require('path'),
    log = require('./lib/log'),
    parser = require('subtitles-parser'),
    iconvlite = require('iconv-lite');

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
    var output, original, data, files, i,
        options = nopt({
            "pattern": [String, null],
            "encoding": [String, null],
            "backup": [Boolean, null],
            "from-backup": [Boolean, null]
        });

    options.encoding = options.encoding || 'latin1';
    options.backup = options.backup !== false ? true : false;
    options.pattern = options.pattern || "**/*.srt";

    log.info('Encoding in [' + options.encoding + ']');
    log.info('Folder [' + cwd + ']');
    log.info('Looking for [' + options.pattern + ']');

    // options is optional
    files = glob.sync(options.pattern);
    if (files.length === 0) {
        log.info('No file found: ' + cwd);
        return cb();
    }
    for (i = 0; i < files.length; i += 1) {
        log.info('\nFile [' + files[i] + ']');

        try {
            original = iconvlite.decode(libfs.readFileSync(libpath.join(cwd, files[i] + (options["from-backup"] ? '.bak' : ''))), options.encoding);
        } catch (e) {
            log.error(' -> Reading error: ' + (e.stack || e));
            continue;
        }

        try {
            data = parser.fromSrt(original);
        } catch (e) {
            log.error(' -> Parser error: ' + (e.stack || e));
            continue;
        }

        try {
            output = generator(data);
        } catch (e) {
            log.error(' -> Generator error: ' + (e.stack || e));
            continue;
        }

        if (output === original) {
            log.info(' -> Valid SRT format, skipping.');
            continue;
        }

        if (output.indexOf('�') > -1) {
            log.error(' -> Invalid encoding, set a valid encoding value `--enconding <value>`.');
            continue;
        }

        if (options.backup && !options['from-backup']) {
            if (!libfs.existsSync(libpath.join(cwd, files[i] + '.bak'))) {
                log.info(' -> Backing up file (*.bak)');
                try {
                    libfs.writeFileSync(libpath.join(cwd, files[i] + '.bak'), output);
                } catch (e) {
                    log.error(' -> Backup error: ' + (e.stack || e));
                    continue;
                }
            } else {
                log.info(' -> Backup already exists');
            }
        }

        log.info(' -> Overwritting file');
        try {
            libfs.writeFileSync(libpath.join(cwd, files[i]), output);
        } catch (e) {
            log.error(' -> Write error: ' + (e.stack || e));
            continue;
        }
        log.info(' -> Done');
    }
    log.info('\nOK');
    return cb(null);
}

module.exports = main;
