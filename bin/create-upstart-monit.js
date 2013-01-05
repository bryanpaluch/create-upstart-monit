#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');
var swig = require('swig');
var fs = require('fs');
var execSync = require('execSync');

var abort = false;
program
  .version('0.0.1')
  .option('-p, --port [portnumber]', 'The port number your application runs or the port it will listen for monit checks on')
  .option('-h, --homedir [homedir]', 'The home directory , needed for nodejs defaults to /home/ubuntu')
  .option('-u, --user [user]', 'The user for which the process should run as defaults to ubuntu')
  .parse(process.argv);

console.log('Upstart and Monit file generator for nodejs');
if (!program.port){
  console.log('Port required aborting');
  process.exit(1); 
  abort = true;
}
var nodeloc = execSync.stdout('which node');
nodeloc = nodeloc.replace(/[\n\r]/g, '');
console.log('using node location ' + nodeloc);
if (!program.user) program.user = 'ubuntu';
if (!program.homedir) program.homedir = '/home/ubuntu';

var info = require(process.cwd() + '/package.json');
if(!info.description || !info.main || !info.name || !info.author){
  console.log(info);
  console.log('missing item in package.json aborting');
  console.log('description, main, name and author required'); 
  process.exit(1);
}
var eol ="\n";

//----------------------Upstart Template
var upstart = [
"description \"{{description}}\""
,"author \"{{author}}\""
,"env USER={{user}}"
,"start on runlevel [2345]"
,"stop on runlevel [!2345]"
,"script"
,"	export HOME=\"{{home}}\""
,"	chdir {{workingdir}}"	
,"	exec start-stop-daemon --chdir {{workingdir}} --start --make-pidfile --pidfile /var/run/{{appname}}.pid --chuid $USER --exec {{nodeloc}} {{workingdir}}/{{appexec}} >> /var/log/{{appname}}.log 2>&1"
,"end script"

,"pre-start script"
,"	echo \"[`date -u +%Y-%m-%dT%T.%3NZ`] (sys) Starting\" >> /var/log/{{appname}}.log"
,"end script"
,"pre-stop script"
,"	echo \"[`date -u +%Y-%m-%dT%T.%3NZ`] (sys) Stopping\" >> /var/log/{{appname}}.log"
,"end script"
].join(eol);
//------------------------ End Upstart Template
//----------------------- Send template values
var upopts = {  
		description : info.description,
		author: info.author,
		home: program.homedir,
		user: program.user,
		workingdir: process.cwd(),
		appname: info.name,
		appexec: info.main,
    nodeloc: nodeloc
	     }
var uptpl = swig.compile(upstart);
var upstartFile = uptpl(upopts);
//-----------------------------------------



//----------------Create Upstart file
if(!(fs.existsSync(process.cwd() + '/.deployscripts/')) && !abort){
  console.log('creating deploy scripts directory'); 
  fs.mkdirSync(process.cwd() + '/.deployscripts');
}
var upfd = fs.openSync(process.cwd() + '/.deployscripts/' + upopts.appname + '.conf', 'w+')
fs.writeSync(upfd,upstartFile);
console.log('upstart file written to ' + process.cwd() + '/.deployscripts/' + upopts.appname + '.conf');

//-----------------Done Upstart File
//----------------- monit template
var monit = [
,"  #!monit"
,"  check process {{appname}} with pidfile \"/var/run/{{appname}}.pid\""
,"    start program = \"/sbin/start {{appname}}\""
,"      stop program = \"/sbin/stop {{appname}}\""
,"        if failed port {{port}} protocol HTTP"
,"              request /"
,"                  with timeout 10 seconds"
,"                then restart"
].join(eol);
var monopts = {
		description : info.description,
		author: info.author,
		home: program.homedir,
		user: program.user,
		workingdir: process.cwd(),
		appname: info.name,
		appexec: info.main,
    port: program.port,
	     }
var montpl = swig.compile(monit);
var monstartFile = montpl(monopts);
var monfd = fs.openSync(process.cwd() + '/.deployscripts/' + monopts.appname + '.monit.conf', 'w+')
fs.writeSync(monfd,monstartFile);
console.log('monit file written to ' + process.cwd() + '/.deployscripts/' + monopts.appname + '.monit.conf');
