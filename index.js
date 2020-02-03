#!/usr/bin/env node
const program = require('commander');
const shell = require('shelljs');
const fs = require('fs-extra');
const template = require('./component_template/template');
const replace = require('replace');
const inquirer = require('inquirer');
const packageJson = require('./package.json');
let appName = '';
let appDirectory = `${process.cwd()}`;
let newCompPath;
let nofolder;
let functional;
let stylesheet;
let redux;

program
  .version(packageJson.version)
  .command('create <dir>')
  .option('-T , --typscript', 'Install with typescript')
  .action((dir) => {
    let project;
    var questions = [{
      type: 'list',
      name: 'project',
      message: "Which project you want to create?",
      choices: ['React', 'React Native']
    }]

    inquirer.prompt(questions).then(answers => {
      project = answers['project']
      switch (project) {
        case 'React':
          createReact(dir)
          break;
        case 'React Native':
          console.log('We are working on this feature, soon it will be released in new version.'.green);
          break;
        case 'Angular':
          console.log('We are working on this feature, soon it will be released in new version.'.green);
          break;

        default:
          console.log(`working on ${project} new feature`.green);
          break;
      }
    })
  });

program
  .command('ng [args...]')
  .option('-v, --versions', 'show version of angular cli')
  .option('--opt <opt>', 'any ng options will given using this, multiple option will be comma seprated')
  .action((args, cmd) => {
    const opt = cmd.opt;
    if (cmd.versions) {
      shell.exec('ng --version', (e, stdout, stderr) => {

      })
      return;
    }
    if (opt) {
      shell.exec(`ng ${args.join(' ')} ${opt.split(',').join(' ')}`, (e, stdout, stderr) => {
        // console.log(stdout);
      })
      return;
    }
    shell.exec(`ng ${args.join(' ')}`, (e, stdout, stderr) => {
      // console.log(stdout);
    })
  })

program
  .command('gc <component>')
  .option('-n, --nofolder', 'Do not wrap component in folder')
  .option('-s, --nostyle', 'Without stylesheet', true)
  .option('-r, --noredux', 'Without redux connect', true)
  .option('-f, --functional', 'Create functional component')
  .action(createComponent);

program
  .command('gs <service>')
  .action(createService);

program
  .command('run [cmd]')
  .action((cmd = 'start') => npmCommandRunner(cmd))

program
  .command('install')
  .action(() => {
    console.log('Installing node modules..')
    shell.exec(`npm install`, (e, stdout, stderr) => {
      if (!e) {
        console.log(stdout);
        console.log('Node modules installed.'.green);
      } else {
        console.log(stderr);
        console.log('Something went wrong'.red);
        console.log('Please raise a issue to the author'.red);
      }
    });
  })

program.parse(process.argv)
async function createReact(dir) {
  appName = dir;
  appDirectory = `${process.cwd()}/${appName}`;
  if (fs.existsSync(appDirectory)) {
    console.log('Directory already exists choose antother name...'.red);
    process.exit(1);
  }
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
function npmCommandRunner(cmd) {
  shell.exec(`npm run ${cmd}`, (e, stdout, stderr) => {
    console.log(stdout);
    if (e.toString().search('Something is already running on port 3000.')) {
      console.log('Please run '.white + `npm run ${cmd}`.green);
      console.log(`Error: Something is already running on port 3000.`.red);
    }
  })
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
    console.log("\nInstalling react-router, react-router-dom, axios, redux-thunk and redux...".green);
    shell.exec(`npm install --save react-router react-router-dom axios redux react-redux redux-thunk`, { cwd: appDirectory }, (e) => {
      console.log("\nFinished installing packages\n".green);
      resolve()
    });
  });
}
function updatePackage_json() {
  let scripts = {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "echo \"Error: no test specified\" && exit 1",
    "eject": "react-scripts eject"
  };
  return new Promise(resolve => {
    console.log("\nUpdating package.json....".green);
    shell.exec(`node ${require('path').dirname(require.main.filename)}/node_modules/json/lib/json.js -I -f package.json -e 'this.scripts=` + JSON.stringify(scripts) + "'", { cwd: appDirectory }, () => {
      resolve();
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
async function createComponent(component, cmd) {
  newCompPath = component;
  cmd.nofolder ? nofolder = true : nofolder = false;
  cmd.functional ? functional = true : functional = false;
  cmd.observable ? observable = true : observable = false;
  cmd.nostyle ? stylesheet = false : stylesheet = true;
  cmd.noredux ? redux = false : redux = true;
  if (fs.existsSync('./src/Components')) {
    newCompPath = `./src/Components/${component}`;
  }
  // else {
  //   component = `./src/components/${component}`;
  // }
  let template = await buildTemplate();
  writeFile(template, component)
}
function buildTemplate() {
  let imports = [template.imports.react, template.imports.action];
  if (observable) {
    imports.push(template.imports.observable)
  }
  if (stylesheet) {
    imports.push(template.import);
  }
  if (redux) {
    imports.push(template.imports.connect);
  }
  let body = functional ? [template.functional] : [template.main].join('\n');
  let exported = observable ? [template.exported.observable] : redux ? [template.exported.connectStateAndDispatch] : [template.exported.default];
  return imports.join('\n') + '\n' + body + '\n' + exported;
}
function capitalize(comp) {
  const words = comp.split('-');
  let compName = "";
  words.forEach(word => {
    compName += word[0].toUpperCase() + word.substring(1, word.length);
  })
  return compName;
}
function writeFile(ptemplate, component) {
  let path = newCompPath;
  if (nofolder) {
    strArr = newCompPath.split('/');
    strArr.splice(strArr.length - 1, 1);
    path = strArr.join('/');
  }
  let comp = component.split('/');
  comp = comp[comp.length - 1];
  if (path) {
    path = path;
  } else {
    path = capitalize(comp);
  }
  if (stylesheet) {
    if (!fs.existsSync(`${path}/${comp.toLowerCase()}.css`)) {
      fs.outputFileSync(`${path}/${comp.toLowerCase()}.css`, '');
      console.log(`Stylesheet ${comp} created at ${path}/${comp.toLowerCase()}.css`.green)
    } else {
      console.log(`Stylesheet ${comp} already exists at ${path}/${comp.toLowerCase()}.css, choose another name if you want to create a new stylesheet`.red);
      return
    }
  }
  if (redux) {
    if (!fs.existsSync(`${path}/actions.js`)) {
      fs.outputFileSync(`${path}/actions.js`, '');
      console.log(`Action ${comp}/actions created at ${path}/actions.js`.green);
    } else {
      console.log(`Action ${comp} already exists at ${path}/actions.js, choose another name if you want to create a new component`.red);
      return
    }
    if (!fs.existsSync(`${path}/constants.js`)) {
      fs.outputFileSync(`${path}/constants.js`, template.constant);
      console.log(`Constant ${comp}/constants created at ${path}/constants.js`.green);
    } else {
      console.log(`Constant ${comp} already exists at ${path}/constants.js, choose another name if you want to create a new component`.red);
      return
    }
    if (!fs.existsSync(`${path}/reducer.js`)) {
      fs.outputFile(`${path}/reducer.js`, template.reducer, (err) => {
        if (err) throw err;
        replace({
          regex: ":className",
          replacement: capitalize(comp),
          paths: [`${path}/reducer.js`],
          recursive: false,
          silent: true,
        });
        console.log(`Reducer ${comp}/reducer created at ${path}/reducer.js`.green)
      });
    } else {
      console.log(`Reducer ${comp}/reducer already exists at ${path}/reducer.js, choose another name if you want to create a new component`.red);
      return
    }
  }
  if (!fs.existsSync(`${path}/index.js`)) {
    fs.outputFile(`${path}/index.js`, ptemplate, (err) => {
      if (err) throw err;
      replace({
        regex: ":className",
        replacement: capitalize(comp),
        paths: [`${path}/index.js`],
        recursive: false,
        silent: true,
      });
      console.log(`Component ${comp} created at ${path}/index.js`.green)
    });
  } else {
    console.log(`Component ${comp} already exists at ${path}/index.js, choose another name if you want to create a new component`.red);
    return
  }
}

async function createService(service) {
  let newCompPath = `${service}.service.js`;
  if (fs.existsSync('./src/Services')) {
    newCompPath = `./src/Services/${service}.service.js`;
  } else {
    console.log('Services folder not found in src..'.red);
  }
  console.log(newCompPath);
  let comp = service.split('/');
  comp = comp[comp.length - 1];
  if (!fs.existsSync(newCompPath)) {
    fs.outputFile(newCompPath, template.service, (err) => {
      if (err) throw err;
      replace({
        regex: ":className",
        replacement: `${capitalize(comp)}Service`,
        paths: [`${newCompPath}`],
        recursive: false,
        silent: true,
      });
      console.log(`Service ${comp} created at ${newCompPath}`.green)
    });
  } else {
    console.log(`Service ${comp} already exists at ${newCompPath}, choose another name if you want to create a new component`.red);
    return
  }
}

