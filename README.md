Plex Subtitles Normalizer CLI
-----------------------------

This CLI tool guarantee that SRT files have the proper format,
including empty lines.

As today, PLEX Player has issues when:

* breaklines (aka `\n`) are added at the top of the file before
the first block
* empty blocks with a single breakline.

This breaks subtitles, specially when casting them to Chromecast.

### CLI Installation

This tool requires `nodejs`, and should installed as globals.

```
npm install plex-subtitles-normalizer --global
```

## CLI options

### Validate

You can validate SRT files by using this command:

```
$ psn validate --input=path/to/file.srt
```

### Compile

You can parse and generate a valid version of the subtitle SRT file by using this command:

```
$ psn compile --input=path/to/file.srt --output=path/to/file-plex-ready.srt
```
