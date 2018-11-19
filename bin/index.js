#!usr/bin/env node
const program = require("commander");
const request = require("request");
const chalk = require("chalk");

program
  .version("1.0.1")
  .usage("<keywords>")
  .option("-f, --full", "Full output without any style")
  .parse(process.argv);

if (!program.args.length) {
  program.help();
} else {
  const keywords = program.args;
  request(
    `http://fanyi.youdao.com/openapi.do?keyfrom=node-translator&key=2058911035&type=data&doctype=json&version=1.1&q=${keywords}`,
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        body = JSON.parse(body)
        console.log(
          chalk.black.bgCyan(
            "translation: " + body.translation.join(",")
          )
        );
        body.basic && body.basic.explains && console.log(
          chalk.cyan.bold(  
            "explains: " + body.basic.explains.join(",")
          )
        );

        if(program.full) {
            body.web ?  console.log(chalk.blue.bold(
                "more: " + body.web.map(item => {
                    return `value: ${item.value.join(',')};`
                })
              )) : console.log(
                chalk.red.bold('not full explains')
              ) 
        }

        process.exit(0);
      } else {
        console.log(chalk.red("Error: " + error));
        process.exit(1);
      }
    }
  )
}