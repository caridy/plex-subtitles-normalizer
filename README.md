Plex Subtitles Normalizer CLI
-----------------------------

This CLI tool guarantee that SRT files have the proper format,
including empty lines.

As today, PLEX Player has issues when:

* breaklines (aka `\n`) are added at the top of the file before
the first block
* empty blocks with a single breakline.

This breaks subtitles, specially when casting them to Chromecast.

### Installation

This tool requires `nodejs`, and should installed as globals.

```
npm install plex-subtitles-normalizer --global
```

### How to Use

```
$ cd path/to/Movies
$ psn
```

By calling `psn` in a folder, it will automatically recurvisely for any file with `SRT` extension, it will analyze the file looking for invalid formats, if the file has any, it will create a backup of the file (by adding the `.bak` extension), and it will override the original file with the correct version of the SRT format.
