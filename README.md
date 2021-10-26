[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/smtmt2021/enlite-logger/actions/workflows/node.js.yml/badge.svg)](https://github.com/smtmt2021/enlite-logger/actions/workflows/node.js.yml)
[![Node.js Package](https://github.com/smtmt2021/enlite-logger/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/smtmt2021/enlite-logger/actions/workflows/npm-publish.yml)
# Data logger module for your smart electric meter

```
+-------------------------------------------+
|                    Apps                   |
+-------------------------------------------+
|             >>> Data Logger <<<           |
+-------------------------------+-+---------+
|             Enlite            | | TypeORM |
+-------------------------------+ +---------+
|     WSUN Adaptor Interface    |      :
+-------------------------------+      :
|              .  UDP  |  PANA  |      :
| WSUN Adaptor . IPv6 / 6LoWPAN |      :
|              .  IEEE802.15.4  |      :
+-------------------------------+      :
                :                      :
+-------------------------------+ +----------+
|   A smart meter of your home  | | Database |
+-------------------------------+ +----------+
```
## Usage

## Test

- `npm test`
- open `./coverage/lcov-report/index.html` to see the coverage.

## Debug

- Specify following environment variables (e.g. `export DEBUG=logger/smartmeterlogger`) to display debug information;

File or module                    | Environment variable
----------------------------------|---------------------
`src/index.ts`                    | `logger/smartmeterlogger`
`src/entity/counter-constant.ts`  | `logger/constant`
`src/entity/electric-meter.ts`    | `logger/counter`
`src/entity/watt-meter.ts`        | `logger/wattmeter`
`src/logger/`                     | `logger/logger`
`src/smart-meter/`                | `logger/smartmeter`

- see [visionmedia/debug](https://github.com/visionmedia/debug#readme) in details.

## Build
- `npm run build`

## License
- MIT license
- Copyright (c) 2021 KINOSHITA minoru, All Rights Reserved.
