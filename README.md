# Webcomic Scraper

A small script for downloading webcomics from [SmackJeeves](https://smackjeeves.com).

This script was only tested on the comic "It's a Hard Life", but it might work on other comics from SmackJeeves.

SmackJeeves was discontinued on December 31, 2020.

## Usage

This project requires [Node](https://nodejs.org/en/) to be installed on your machine.

First install the JavaScript dependencies with:

```console
npm install
```

Next configure the comic to be downloaded, and the naming of the downloaded files by setting the following variables in `app.js`:

- pageUrl
- pageNumerStart
- pageNumberEnd
- downloadFolder
- filenameMode
- filenameLeadingZeroCount

Also do not forget to create the folder, in which the downloaded files should be saved. Otherwise the script will throw an error.

Finally execute the script in the command line:

```console
node app.js
```
