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

By calling `psn` in a folder, it looks for any file with `.srt` extension, analyzing the file looking for invalid formats, if the file has any, it will create a backup of the file (by adding the `.bak` extension), and it will override the original file with the correct format.

### Advanced Options

#### Backups

You can pass an option to avoid creating backup files, although it is not recommended:

```
$ psn --no-backup
```

If something weird happen, you can always restore the backup, or simply use the backup as the original source:

```
$ psn --from-backup
```

#### Encoding

You can also select the encoding, by default `latin1` will be used. The tool will automatically detect some encoding issues, but if you find something weird, you can try to use an alternative encoding from [iconv-lite][], for example, you can use `Big5` for chinese:

```
$ psn --from-backup --encoding Big5
```

[iconv-lite]: https://github.com/ashtuchkin/iconv-lite#supported-encodings

#### Custom path

You can customize the pattern to search for subtitles:

```
$ psn --pattern **/*.srt
```
