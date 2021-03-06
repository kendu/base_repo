# Base project

The base project is meant for the bare project start. It only includes the
builder container for running gulp in the background as well as the basic
provision script setup.

## getting started

* Write gulpfile.js file
* Write package.json file
* Write composer.json file
* Write bower.json file

Of course you don't have to use all of them.

## Using docker

To run the docker containers: For first run use:
```
./provision/setup.sh
```
For next runs use:
```
docker-compose start
```

### Upgrading
The docker-compose.yml file has only one container defined. That is the
builder container which runs gulp. While this is OK for developing a project with only static files, you might soon want to upgrade to using a nginx and php containers
which will take care of of processing php files while still serving static
files. You should run setup after you add container definitions.
Also, any provisioning that should be done, ust be added to either the preBuild
script - for any operations that should happen before the containers run, or
the provisionDeploy file for operations which need containers to be running
already.

## Nginx configuration
Http container mounts 3 locations.
* provision/nging/nginx.conf - the main ngin config which includes all server
 configs from sites-enabled
* provision/nginx/conf.d - which contains configuration blocks such as
locations, ssl, cors, and other commonly used.
* provision/nginx/sites-enabled-<deploy> - containing server definitions for
 the given deploy such as staging, beta, production, dev

Each deploy has a seperate docker-compose-<deploy>.yml, which then mounts the
given locations to:
* /etc/nginx/nginx.conf
* /etc/nginx/conf.f
* /etc/nginx/sites-enabled
respectfully.
