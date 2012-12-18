##create-upstart-monit

Create upstart and monit configuration files for your nodejs
applications
install globally using
``javascript
npm install create-upstart-monit

``

Then go to the application you want to generate upstart and monit files
for and type create-upstart-monit -p 3000
This will generate basic upstart and monit files in the hidden directory
.deployfiles in the current working directory.
You can then move them over to /etc/init/ and /etc/monit/conf.d/
yourself.


The application uses information from package.json. The name of the
package will be the service name so be sure its unique.


