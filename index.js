const core = require('@actions/core');
const github = require('@actions/github');


async function run() {
    try {
        // const owner = core.getInput('owner');
        // const repository = core.getInput('repository');
        // This should be a token with access to repository scoped in as a secret.
        // The YML workflow will need to set myToken with the GitHub Secret Token
        const myToken = core.getInput('myToken');
        const pull_request_number = core.getInput('pull_request_number');

        const octokit = github.getOctokit(myToken);
        const context = github.context;

        const nameToGreet = core.getInput('who-to-greet');
        console.log(`Hello ${nameToGreet}!`);

        //homework3_1
        const testInput = core.getInput('test-input');
        console.log(`This is a ${testInput}!`)

        const { data: changedFiles } = await octokit.rest.pulls.listFiles({
            ...context.repo,
            pull_number: pull_request_number
        });

        let diffData = {
            additions:0,
            deletions:0,
            changes: 0
        }

        diffData = changedFiles.reduce((acc, filename) => {
            
            acc.additions += filename.additions;
            acc.deletions += filename.deletions;
            acc.changes += filename.changes;
            return acc;
        },  diffData)

        
        await octokit.rest.issues.createComment({
            ...context.repo,
            issue_number: pull_request_number,
            body: `
            - Thank you for openning the Pull Request. The following updates were done:
            - ${diffData.additions} aditions
            - ${diffData.deletions} deletions
            - ${diffData.changes} changes
            `
        });

        for (const file of changedFiles) {
            const filenameExtension = file.filename.split('.').pop();
            let label = ''
            switch(filenameExtension){
                case 'yaml':
                    label = "yaml";
                    break;
                case 'js':
                    label = "javascript";
                    break;
                case 'json':
                    label = "json";
                    break;
                case 'md':
                    label = "markdown";
                    break;
                default: 
                    label = "undefined"
                
            }
            await octokit.rest.issues.addLabels({
                ...context.repo,
                issue_number: pull_request_number,
                labels: [label]    
            });
        }
    
        const { data: pullRequest } = await octokit.rest.pulls.get({
            ...context.repo,
            pull_number: 1,
            mediaType: {
                format: 'diff'
            }
        });

        const newIssue = await octokit.rest.issues.create({
            ...context.repo,
            title: 'New issue!',
            body: 'Hello Universe!'
        });
        console.log(`newIssue_LOG:`, newIssue);

        const time = (new Date()).toTimeString();
        core.setOutput("time", time);
        
        const payload = github.context.payload;
        console.log(`The event payload: `, JSON.stringify(payload,undefined, 2));


    } catch(error) {
        core.setFailed(error.message)
    }
}

run();
