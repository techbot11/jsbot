const program = require('commander');
const fs = require('fs-extra');
const template = require('./../component_template/template');
const replace = require('replace');

let newCompPath;
let nofolder;
let functional;
let stylesheet;
let redux;
let test;
let observable;

module.exports = async function createComponent(component, cmd) {
    newCompPath = component;
    cmd.nofolder ? nofolder = true : nofolder = false;
    cmd.functional ? functional = true : functional = false;
    cmd.observable ? observable = true : observable = false;
    cmd.nostyle ? stylesheet = false : stylesheet = true;
    cmd.redux ? redux = true : redux = false;
    cmd.test ? test = true : test = false;
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
    let imports = [template.imports.react];
    if (observable) {
        imports.push(template.imports.observable)
    }
    if (stylesheet) {
        imports.push(template.import);
    }
    if (redux) {
        imports.push(template.imports.action);
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
    if (test) {
        if (!fs.existsSync(`${path}/${comp.toLowerCase()}.test.js`)) {
            fs.outputFileSync(`${path}/${comp.toLowerCase()}.test.js`, '');
            console.log(`test ${comp} created at ${path}/${comp.toLowerCase()}.test.js`.green)
        } else {
            console.log(`test ${comp} already exists at ${path}/${comp.toLowerCase()}.test.js, choose another name if you want to create a new stylesheet`.red);
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