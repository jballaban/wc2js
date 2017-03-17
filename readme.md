See [wc2js.com](http://www.wc2js.com) for project information

# INSTALLATION

- Install npm
- Run `npm install -g grunt-cli` to get the grunt-cli installed globally
- Run `npm install` from the root to get all the local modules installed
- Create a user in AWS with all permissions (because I'm too lazy to figure out proper ones yet)
- Create a `aws-credentials.json` file in the root with the following format using the credentials of the above user
~~~~
{
  "accessKeyId": "keyhere",
  "secretAccessKey": "secrethere"
}
~~~~
- Run `grunt` to trigger the default build scripts
- Setup IIS to point localhost to `/play` to run the application

# TEST

- Run `mocha test` and ensure all UTs pass

# DOC

- Load `/doc/index.html` to view current documentation

# RUN

- Local localhost in Chrome (only supported browser)
- Optionally add ?mode=debug to enable debug mode, or ?mode=prod to do prob.  Debug adds more validation is done on parameters (type safety etc.) and is the default currently.

## TECHNOLOGIES

- Grunt: building/bundling the application & generates docs
- Mocha: Unit tests
- aws-sdk: AWS integration module (currently not implemented?)
- jsdoc: Doc format using a custom jaguarjs-doc module
- Github: Repository
- aws-dynamodb: Remote storage
- localstorage: Local storage
- aws-lambda: Processing
- aws-api: Front end to lambdas