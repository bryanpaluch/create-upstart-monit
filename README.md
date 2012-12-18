##create-upstart-monit

Create upstart and monit configuration files for your nodejs
applications
install globally using you may need sudo

```javascript

npm install create-upstart-monit -g

```

Then go to the application you want to generate upstart and monit files

```
ubuntu@hostname:/opt$ cd home-monitor/cloud-cordinator/
ubuntu@hostname:/opt/home-monitor/cloud-cordinator$ create-upstart-monit -p 3003
upstart file written to
/opt/home-monitor/cloud-cordinator/.deployscripts/xbeecloudcordinator.conf 
monit file written to
/opt/home-monitor/cloud-cordinator/.deployscripts/xbeecloudcordinator.monit.conf
Upstart and Monit file generator for nodejs
```

You can then move them over to /etc/init/ and /etc/monit/conf.d/
yourself.

```
ubuntu@hostname:/opt/home-monitor/cloud-cordinator$ sudo cp .deployscripts/xbeecloudcordinator.conf /etc/init/
ubuntu@hostname:/opt/home-monitor/cloud-cordinator$ sudo cp .deployscripts/xbeecloudcordinator.monit.conf /etc/monit/conf.d/
```

Then you start your service with something like

```
ubuntu@hostname:/opt/$sudo start xbeecloudcordinator

```

Or you can do it through monit.

The application uses information from package.json. The name of the
package will be the service name so be sure its unique.


