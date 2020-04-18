let appDirectory = '', appName = ''
const shell = require('shelljs');
const fs = require('fs-extra');

module.exports  = async function createReact(dir, cmd) {
    appName = dir;
    appDirectory = `${process.cwd()}/${appName}`;
    if (fs.existsSync(appDirectory)) {
        console.log('Directory already exists choose antother name...'.red);
        process.exit(1);
    }
    if (cmd.test) test = true
    else test = false

    let success = await createReactApp();
    if (!success) {
        console.log('Something went wrong while trying to create a new React app using create-react-app'.red);
        process.exit(1);
    } else {
        await generateBoilerplate();
        await installPackages();
        await updatePackage_json();
        shell.exec(`npm install`, { cwd: appDirectory }, (e, stdout, stderr) => {
            if (stderr) {
                console.log(stdout);
                console.log('Project Created. Happy Coding..!'.green);
                console.log("All done".green);
            }
        });

    }

}

function createReactApp() {
    return new Promise(resolve => {
        if (appName && appName !== ' ') {
            console.log("\nCreating react app...".green);
            try {
                shell.exec(`node ${require('path').dirname(require.main.filename)}/node_modules/create-react-app/index.js ${appName}`, (e, stdout, stderr) => {
                    if (stderr) {
                        if (e == 127) {
                            console.log(`create-react-app not installed \n install create-react-app first globally use :`.red);
                            console.log(`npm install -g create-react-app`.white);
                            resolve(false);
                            process.exit(1);
                        }
                        resolve(true);
                    } else {
                        console.log("Finished creating react app".green);
                        resolve(true);
                    }
                });
            } catch (e) {
                console.log('create-react-app not installed'.red);
                console.log("\nInstalling create react app...".green);
                shell.exec(`npm install -g create-react-app`, (e, stdout, stderr) => {
                    console.log("Finished installing creating react app".green);
                    createReactApp();
                });
                resolve(false);
                process.exit(1);
            }

        } else {
            console.log("\nNo app name was provided.".red);
            console.log("\nProvide an app name in the following format: ");
            console.log("\njsbot create", "app-name\n".green);
            resolve(false);
            process.exit(1);
        }
    })
}
function installPackages() {
    return new Promise(resolve => {
        console.log(`\nInstalling react-router, react-router-dom, axios, ${test ? 'enzyme, enzyme-adapter-react-16, jest, jest-enzyme,' : ''} redux-thunk and redux...`.green);
        shell.exec(`npm install --save react-router react-router-dom axios redux react-redux redux-thunk ${test ? 'enzyme enzyme-adapter-react-16 jest jest-enzyme' : ''}`, { cwd: appDirectory }, (e) => {
            console.log("\nFinished installing packages\n".green);
            resolve()
        });
    });
}
function updatePackage_json() {
    const scripts = {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
    };
    const name = appName;
    return new Promise(resolve => {
        console.log("\nUpdating package.json....".green);
        shell.exec(`node ${require('path').dirname(require.main.filename)}/node_modules/json/lib/json.js -I -f package.json -e 'this.scripts=` + JSON.stringify(scripts) + "'", { cwd: appDirectory }, () => {
            shell.exec(`node ${require('path').dirname(require.main.filename)}/node_modules/json/lib/json.js -I -f package.json -e 'this.name=` + JSON.stringify(name) + "'", { cwd: appDirectory }, () => {
                resolve();
            });
        });
    })
}
function generateBoilerplate() {
    console.log();
    console.log("\nGenerating boilerplate...".green);
    return new Promise(resolve => {
        if (fs.existsSync(`${appDirectory}/src/App.js`)) {
            fs.unlinkSync(`${appDirectory}/src/App.css`);
            fs.unlinkSync(`${appDirectory}/src/App.js`);
            fs.unlinkSync(`${appDirectory}/src/App.test.js`);
            fs.unlinkSync(`${appDirectory}/src/index.css`);
            fs.unlinkSync(`${appDirectory}/src/logo.svg`);
        }
        fs.copySync(`${require('path').dirname(require.main.filename)}/templates/react/`, `${appDirectory}/`);
        console.log('Installing node modules'.green);
        shell.exec(`npm install`, { cwd: appDirectory }, (e) => {
            resolve();
        })
    })
}