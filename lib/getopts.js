'use strict';

var nopt = require('nopt');

// lowercase parsed option keys; ignore nopt-specific 'argv' property
function getopts(parsed) {
    var filtered = {}, key;
    for (key in parsed) {
        if ('argv' !== key) {
            filtered[key.toLowerCase()] = parsed[key];
        }
    }
    return filtered;
}

function getoptCfg(options) {
    var known = {},
        alias = {'debug': ['--loglevel', 'debug']};

    function forNopt(opt) {
        var type;

        if (opt.longName) {
            // translate hasValue values to nopt options
            if (opt.hasValue === true) {
                type = String;       // BC hasValue === true is nopt String

            } else if (!opt.hasValue) {
                type = Boolean;      // BC falsey hasValue is nopt Boolean

            } else {                 // other nopt-specific value types
                type = opt.hasValue; // i.e. Array, Number, String, etc.
            }                        // e.g. option arrays: [String, Array]

            // nopt 1st param
            known[opt.longName.toLowerCase()] = type;

            if (opt.shortName) {
                // nopt 2nd param
                alias[opt.shortName] = '--' + opt.longName;
            }
        }
    }

    options.forEach(forNopt);

    return {
        known: known,
        alias: alias
    };
}

function main(argv, optCfg) {
    var config = getoptCfg(optCfg || []),
        parsed = nopt(config.known, config.alias, argv, 0),
        opts = getopts(parsed),
        args = parsed.argv.remain,
        orig = parsed.argv.original,
        command = args.shift() || 'help';

    return {
        command: command.toLowerCase(), // string
        args: args, // array
        opts: opts, // object options
        orig: orig  // array process.argv.slice(2)
    };
}

module.exports = main;
