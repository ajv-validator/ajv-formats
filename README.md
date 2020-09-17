# ajv-formats

JSON Schema formats for Ajv

[![Build Status](https://travis-ci.org/ajv-validator/ajv-formats.svg?branch=master)](https://travis-ci.org/ajv-validator/ajv-formats)
[![npm](https://img.shields.io/npm/v/ajv-formats.svg)](https://www.npmjs.com/package/ajv-formats)
[![Gitter](https://img.shields.io/gitter/room/ajv-validator/ajv.svg)](https://gitter.im/ajv-validator/ajv)
[![GitHub Sponsors](https://img.shields.io/badge/$-sponsors-brightgreen)](https://github.com/sponsors/epoberezkin)

## Usage

```javascript
import Ajv from "ajv"
import addFormats from "ajv-formats"

const ajv = new Ajv()
addFormats(ajv)
```

## Formats

The package defines these formats:

- _date_: full-date according to [RFC3339](http://tools.ietf.org/html/rfc3339#section-5.6).
- _time_: time with optional time-zone.
- _date-time_: date-time from the same source (time-zone is mandatory).
- _uri_: full URI.
- _uri-reference_: URI reference, including full and relative URIs.
- _uri-template_: URI template according to [RFC6570](https://tools.ietf.org/html/rfc6570)
- _url_ (deprecated): [URL record](https://url.spec.whatwg.org/#concept-url).
- _email_: email address.
- _hostname_: host name according to [RFC1034](http://tools.ietf.org/html/rfc1034#section-3.5).
- _ipv4_: IP address v4.
- _ipv6_: IP address v6.
- _regex_: tests whether a string is a valid regular expression by passing it to RegExp constructor.
- _uuid_: Universally Unique IDentifier according to [RFC4122](http://tools.ietf.org/html/rfc4122).
- _json-pointer_: JSON-pointer according to [RFC6901](https://tools.ietf.org/html/rfc6901).
- _relative-json-pointer_: relative JSON-pointer according to [this draft](http://tools.ietf.org/html/draft-luff-relative-json-pointer-00).

See regular expressions used for format validation and the sources that were used in [formats.ts](https://github.com/ajv-validator/ajv-formats/blob/master/src/formats.ts).

**Please note**: JSON Schema draft-07 also defines formats `iri`, `iri-reference`, `idn-hostname` and `idn-email` for URLs, hostnames and emails with international characters. These formats are available in [ajv-formats-draft2019](https://github.com/luzlab/ajv-formats-draft2019) plugin.

## Options

Options can be passed via the second parameter. Options value can be

1. The list of format names that will be added to ajv instance:

```javascript
addFormats(ajv, ["date", "time"])
```

**Please note**: when ajv encounters an undefined format it throws exception (unless ajv instance was configured with `strict: false` option). To allow specific undefined formats they have to be passed to ajv instance via `formats` option with `true` value:

```javascript
const ajv = new Ajv((formats: {date: true, time: true})) // to ignore "date" and "time" formats in schemas.
```

2. Format validation mode (default is `"full"`) with optional list of format names:

```javascript
addFormats(ajv, {mode: "fast"})
```

or

```javascript
addFormats(ajv, {mode: "fast", formats: ["date", "time"]})
```

In `"fast"` mode the following formats are simplified: `"date"`, `"time"`, `"date-time"`, `"uri"`, `"uri-reference"`, `"email"`. For example `"date"`, `"time"` and `"date-time"` do not validate ranges in `"fast"` mode, only string structure, and other formats have simplified regular expressions.

## Tests

```bash
npm install
git submodule update --init
npm test
```

## License

[MIT](https://github.com/ajv-validator/ajv-formats/blob/master/LICENSE)
