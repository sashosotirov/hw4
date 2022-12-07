const core = require('@actions/core');
const github = require('@actions/github');


async function run() {
    try {
        // const owner = core.getInput('owner');
        // const repository = core.getInput('repository');
        // This should be a token with access to repository scoped in as a secret.
        // The YML workflow will need to set myToken with the GitHub Secret Token
        const myToken = core.getInput('myToken');
        const octokit = github.getOctokit(myToken);
        const context = github.context;
        
        // const nameToGreet = core.getInput('who-to-greet');
        // console.log(`Hello ${nameToGreet}!`);

      
        const payload = github.context.payload;
        console.log(`The event payload: `, JSON.stringify(payload,undefined, 2));


    } catch(error) {
        core.setFailed(error.message)
    }
}

run();
