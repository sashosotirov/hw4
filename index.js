const core = require('@actions/core');
const github = require('@actions/github');


async function run() {
    try {
        const remoteOwner = core.getInput('remote-owner');
        const remoteRepo = core.getInput('remote-repo');
        const remoteFile = core.getInput('remote-file');
        const currentFile = core.getInput('current-file');          
        const myToken = core.getInput('myToken');
        const octokit = github.getOctokit(myToken);
        const context = github.context;                
        
        console.log(remoteFile,remoteOwner,remoteRepo,currentFile) // for debug purpose

        await octokit.request('GET /repos/{owner}/{repo}/contents/{file_path}{?ref}', {
            owner: remoteOwner,
            repo: remoteRepo,
            file_path: remoteFile
          })

        console.log('Readme file content', content)

        const { data: {sha}} = await octokit.request('GET /repos/{owner}/{repo}/contents/{file_path}', {
             ... context.repo , 
            file_path: currentFile
        })
        
        console.log('Readme file content', content)
        console.log('sha content', sha)

       
        await octokit.request('PUT /repos/{owner}/{repo}/contents/{file_path}', {
            ... context.repo,
            file_path: currentFile,
            message: 'automatic file update',
            committer: {
            name: 'Monalisa Octocat',
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
