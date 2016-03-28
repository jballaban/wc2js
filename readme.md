# WC2JS

Elements
- Child elements must be contained within parent element size in order for the mouse to traverse and look for hover states.  If we need to change this then simply change the Mouse.


## SETUP

Ensure node and npm are available your PATH. Clone this repo to your machine.

- Run `npm install -g grunt-cli` anywhere on your machine.
- Run `grunt build` in the repo root see the results
- Setup localhost to point to root folder (for authentication to work)

## RUN

hit localhost/src/index.html

Optional Querystring Parameters
- mode = debug or prod.  By default on localhost it will be debug, otherwise prod.  debug mode modes more validation is done on parameters (type safety etc.)

## TECHNOLOGIES

**NODE.js**

- Grunt: building/bundling the application & generates docs
- Mocha: Unit tests
- aws-sdk: AWS integration module (currently not implemented?)
- jsdoc: Doc format using a custom jaguarjs-doc module

**Github**

- Repo

**Travis CI**

- Watches the master branch for pushes
  - runs Grunt / Mocha
  - if passed
  - - uploads /build to S3 (play.wc2js.com)
  - - uploads /doc to S3 (doc.wc2js.com)

**API**

- Front-End: AWS API Gateway
- Processing: AWS Lambdas
- Storage: AWS Dynamodb & LocalStorage