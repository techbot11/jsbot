#!/usr/bin/env node
let program = require('commander');
let shell = require('shelljs');
let colors = require('colors');
let fs = require('fs-extra');
const inquirer = require('inquirer');
const replace = require('replace');
const template = require('./component_template/template');
let appName = '';
let appDirectory = `${process.cwd()}`;
let newCompPath;
let nofolder;
let functional;
let stylesheet;

program
  .version('1.0.0')
  .command('create <dir>')
  .option('-T , --typscript', 'Install with typescript')
  .action((dir) => {
    let project;
    var questions = [{
      type: 'list',
      name: 'project',
      message: "Which project you want to create?",
      choices: ['Angular', 'React', 'React Native']
    }]

    inquirer.prompt(questions).then(answers => {
      project = answers['project']
      switch (project) {
        case 'React':
          createReact(dir)
          break;
        case 'React Native':
          console.log('working on react native'.green);
          break;
        case 'Angular':
          console.log('working on angular'.green);
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
  .option('-f, --functional', 'Create functional component')
  .action(createComponent);

program
  .command('run <cmd>')
  .action(npmCommandRunner)

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
    // await installPackages();
    await updatePackage_json();
    await generateBoilerplate();
    shell.exec(`npm install`, { cwd: appDirectory }, (e, stdout, stderr) => {
      if (stderr) {
        console.log(stdout);
        console.log("All done".green);
      }
    });

  }

}
function npmCommandRunner(cmd = 'start') {
  shell.exec(`npm run ${cmd}`, (e, stdout, stderr) => {
    if (e.toString().search('Something is already running on port 3000.')) {
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
      console.log('Project Created. Happy Coding..!'.green);
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
  if (fs.existsSync('./src/components')) {
    newCompPath = `./src/components/${component}`;
  }
  // else {
  //   component = `./src/components/${component}`;
  // }
  let template = await buildTemplate();
  writeFile(template, component)
}
function buildTemplate() {
  let imports = [template.imports.react, template.imports.propTypes];
  if (observable) {
    imports.push(template.imports.observable)
  }
  if (stylesheet) {
    imports.push(template.imports.stylesheet);
  }
  let body = functional ? [template.functional] : [template.main].join('\n');
  let exported = observable ? [template.exported.observable] : [template.exported.default];
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
    console.log(path);
  }
  console.log(path, component);
  let comp = component.split('/');
  comp = comp[comp.length - 1];
  if (path) {
    path = path + '/' + capitalize(comp);
  } else {
    path = capitalize(comp);
  }
  if (stylesheet) {
    if (!fs.existsSync(`${path}.css`)) {
      console.log('creating syles');
      fs.outputFileSync(`${path}.css`, '');
      console.log(`Stylesheet ${comp} created at ${path}.css`.green)
    } else {
      console.log(`Stylesheet ${comp} already exists at ${path}.css, choose another name if you want to create a new stylesheet`.red);
      return
    }
  }
  if (!fs.existsSync(`${path}Action.js`)) {
    fs.outputFileSync(`${path}Action.js`, '');
    fs.outputFileSync(`${path}Constant.js`, template.constant);
    console.log(`Action ${comp}Action created at ${path}Action.js`.green)
    console.log(`Constant ${comp}Constant created at ${path}Constant.js`.green)
  } else {
    console.log(`Action ${comp} allready exists at ${path}Action.js, choose another name if you want to create a new component`.red);
    return
  }
  if (!fs.existsSync(`${path}Constant.js`)) {
    fs.outputFileSync(`${path}Constant.js`, template.constant);
    console.log(`Constant ${comp}Constant created at ${path}Constant.js`.green)
  } else {
    console.log(`Constant ${comp} allready exists at ${path}Constant.js, choose another name if you want to create a new component`.red);
    return
  }
  if (!fs.existsSync(`${path}Reducer.js`)) {
    fs.outputFile(`${path}Reducer.js`, template.reducer, (err) => {
      if (err) throw err;
      replace({
        regex: ":className",
        replacement: capitalize(comp),
        paths: [`${path}Reducer.js`],
        recursive: false,
        silent: true,
      });
      console.log(`Reducer ${comp}Reducer created at ${path}Reducer.js`.green)
    });
  } else {
    console.log(`Reducer ${comp}Reducer allready exists at ${path}Reducer.js, choose another name if you want to create a new component`.red);
    return
  }
  if (!fs.existsSync(`${path}.js`)) {
    fs.outputFile(`${path}.js`, ptemplate, (err) => {
      if (err) throw err;
      replace({
        regex: ":className",
        replacement: capitalize(comp),
        paths: [`${path}.js`],
        recursive: false,
        silent: true,
      });
      console.log(`Component ${comp} created at ${path}.js`.green)
    });
  } else {
    console.log(`Component ${comp} allready exists at ${path}.js, choose another name if you want to create a new component`.red);
    return
  }


}

