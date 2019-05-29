# MongoDB Test

This is a test client app that attempts to communicate with the MongoDB service/server in the IBM Private Cloud.

Step 0 is of course setting up [IBM Cloud Private](https://www.ibm.com/support/knowledgecenter/en/SSBS6K_1.2.0/kc_welcome_containers.html). I used Vagrant as per the instructions [here](https://github.com/IBM/deploy-ibm-cloud-private/blob/master/docs/deploy-vagrant.md).

After that, you need to configure IBM Cloud Private (via the IBM Cloud Private console) to run a MongoDB service that is accessible by a client. See Database Setup below for instructions.

Once all is setup, to start the server, type `npm start`. The password will be automatically retrieved from `kubectl` and IBM Cloud secrets, and will remain hidden to the client. The host and port variables are also automatically setup.

## Database Setup

There seems to be 2 methods to setup the MongoDB service on IBM Cloud Private:
 - GUI
 - Command Line

### GUI Method
First find out where you IBM web console is. If you used the Vagrant setup, it should be in the output with the "happy dance".

For example, my console is hosted at https://192.168.31.100:8443/console. If you did not change the `base_setting` in the Vagrantfile like I did, then yours should be https://192.168.27.100:8443/console by default.

1. Login with your username and password, as set in the `Vagrantfile`

[Screenshot 1](screenshots/setup1.png)

2. Once in, click the **Catalog** button on the top right corner of the


Click the hamburger menu in the top left corner, and go to **Network Access** > **Services**

*IMPORTANT!*
Depending on what you put as the release-name (it is `test` by default), you have to edit the `package.json`'s `start` command accordingly.

For example, if your release name is `mydb` (mine is `test`), replace all occurences of `test-ibm-mongodb-dev` with `mydb-ibm-mongodb-dev`. If you changed the namespace, you will need to change it from `default` to something else as well.

Alternatively, just replace the `start` command with

## References

IBM Cloud Private:

Some code based off the awesome tutorial here: https://zellwk.com/blog/crud-express-mongodb/
