#!/usr/bin/env node
const tools = require("./lib");
const program = require('commander');
const shell = require('shelljs');
const fs = require('fs-extra');
const template = require('./component_template/template');
const replace = require('replace');
const inquirer = require('inquirer');
const packageJson = require('./package.json');


const { createReact, createComponent, createService } = tools

program
  .version(packageJson.version)
  .command('create <dir>')
  .option('-T , --typscript', 'Install with typescript')
  .option('-t , --test', 'Install module for Testing with Jest and Enzyme')
  .action((dir, cmd) => {
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
          createReact(dir, cmd)
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
  .option('-s, --nostyle', 'Without stylesheet')
  .option('-r, --redux', 'With redux connect')
  .option('-f, --functional', 'Create functional component')
  .option('-t, --test', 'Create testing file')
  .action(createComponent);

program
  .command('gs <service>')
  .action(createService);

program
  .command('run [cmd]')
  .action((cmd = 'start') => npmCommandRunner(cmd))

program
  .command('install [args...]')
  .action((args) => {
    console.log(`Installing node modules..`);
    try {
      shell.exec(`npm install ${args.join(' ')}`, (e, stdout, stderr) => {
        if (!e) {
          console.log(stdout);
          console.log('Node modules installed.'.green);
        } else {
          console.log(stderr);
          console.log('Something went wrong'.red);
          console.log('Please raise a issue to the author'.red);
        }
      });
    } catch (e) {
      console.log('ERROR:'.red);
      console.log(e);
      console.log('npm is not installed globally. Please intsall node for you system.'.red);
    }
  })

program.parse(process.argv)

function npmCommandRunner(cmd) {
  shell.exec(`npm run ${cmd}`, (e, stdout, stderr) => {
    console.log(stdout);
    if (e.toString().search('Something is already running on port 3000.')) {
      console.log('Please run '.white + `npm run ${cmd}`.green);
      console.log(`Error: Something is already running on port 3000.`.red);
    }
  })
}