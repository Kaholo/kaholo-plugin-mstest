const child_process = require("child_process")

function runTest(action, settings){
    return new Promise((resolve,reject)=>{
        var mstestPath = settings.exePath;
        var testFiles = _handleStringArray(action.params.testFiles);
        if (!Array.isArray(testFiles))
            return reject("Test Files must be either a string or an array");
        
        var noisolation = action.params.noisolation;

        var args = [
            `/resultsfile:${action.params.resultPath}`
        ];

        if (noisolation)
            args.push('/noisolation')
        
        testFiles.forEach(file=>{
            args.push(`/testcontainer:${file}`);
        })

        var command = `${mstestPath} ${args.join(' ')}`

        child_process.exec(command, (error, stdout, stderr) => {
			if (error) {
			   return reject(`exec error: ${error}`);
			}
			if (stderr) {
				console.log(`stderr: ${stderr}`);
			}
			return resolve(stdout);
		});


    });
}

/**
 * @param {*} value 
 * @returns {string[]}
 */
function _handleStringArray(value){
    if (typeof value == 'string'){
        return [value]
    }
    return value;
}


module.exports= {
    runTest: runTest
}