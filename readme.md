# WC2JS

Elements
- Child elements must be contained within parent element size in order for the mouse to traverse and look for hover states.  If we need to change this then simply change the Mouse.


## SETUP

Ensure node and npm are available your PATH. Clone this repo to your machine.

Run `npm install -g grunt-cli` anywhere on your machine.

Simply run `grunt build` in the repo root se see the results


## TECHNOLOGIES

**NODE.js**

- Grunt: building/bundling the application
- Mocha: Unit tests
- aws-sdk: AWS integration module

**Github**

- Repo

**Travis CI**

- Watches the master branch for pushes
  - runs Grunt / Mocha
  - if passed uploads src folder to S3

**API**

- Front-End: AWS API Gateway
- Processing: AWS Lambdas
- Storage: AWS Dynamodb