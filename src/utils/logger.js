import chalk from 'chalk';

export const logger = {
  info: (message) => {
    console.log(chalk.blue('ℹ'), message);
  },
  
  success: (message) => {
    console.log(chalk.green('✅'), message);
  },
  
  warning: (message) => {
    console.log(chalk.yellow('⚠️'), message);
  },
  
  error: (message) => {
    console.log(chalk.red('❌'), message);
  },
  
  debug: (message) => {
    if (process.env.DEBUG) {
      console.log(chalk.gray('🐛'), message);
    }
  },
  
  header: (message) => {
    console.log(chalk.blue.bold(`\n🚀 ${message}\n`));
  },
  
  step: (step, message) => {
    console.log(chalk.cyan(`${step}.`), message);
  },
  
  code: (code) => {
    console.log(chalk.gray(`   ${code}`));
  }
};
