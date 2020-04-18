const fs = require('fs-extra');
const template = require('./../component_template/template');
const replace = require('replace');

function capitalize(comp) {
    const words = comp.split('-');
    let compName = "";
    words.forEach(word => {
        compName += word[0].toUpperCase() + word.substring(1, word.length);
    })
    return compName;
}

module.exports = async function createService(service) {
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