const client = require("scp2");
const chalk = require("chalk");
const ora = require("ora");

const spinner = ora(`正在部署代码到服务器--${new Date()}`).start();

client.scp(
  "build/",
  "root:@roger26189@139.159.224.136:/var/www/html/build",
  function (err) {
    if (err) {
      spinner.fail(chalk.red(err));
      spinner.fail(chalk.red("部署失败，重试一下.\n"));
    } else {
      spinner.succeed(chalk.green(`成功部署代码到服务器--${new Date()}`));
    }
  }
);
