const core = require('@actions/core');
const github = require('@actions/github');


async function run() {
    try {
        const remoteOwner = core.getInput('remote-owner');
        const remoteRepo = core.getInput('remote-repo');
        const remoteFile = core.getInput('remote-file');
        const currentFile = core.getInput('current-file');          
        const currentToken = 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;
        const remoteToken = core.getInput('remoteToken');
        const octokit = github.getOctokit(core.getInput('remoteToken'));
        const context = github.context;                             

        const { data: {content}} = await octokit.request('GET /repos/{owner}/{repo}/contents/{file_path}{?ref}', {
            owner: remoteOwner,
            repo: remoteRepo,
            file_path: remoteFile
          })
        
        const { data: {sha}} = await octokit.request('GET /repos/{owner}/{repo}/contents/{file_path}', {
             ... context.repo , 
            file_path: currentFile
        })
        
        // for debug purpose
        console.log(currentFile,remoteFile,remoteOwner,remoteRepo) 
        console.log('Readme file content', content)
        console.log('sha content', sha)

       
        await github.getOctokit(currentToken).request('PUT /repos/{owner}/{repo}/contents/{file_path}', {
            ... context.repo,
            file_path: currentFile,
            message: 'automatic file update',
            committer: {
            name: context.actor,
            email: 'octocat@github.com'
            },
            content: content,
            sha: sha
        })
      


    } catch(error) {
        core.setFailed(error.message)
    }
}

run();
