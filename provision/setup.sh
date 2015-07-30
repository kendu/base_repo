#!/bin/bash

################################################################################
#                                                                              #
#                                 {o,o}                                        #
#                                 |)__)                                        #
#                                 -"-"-                                        #
#                                                                              #
################################################################################
#
# The first time setup script
#
#################################---ENV---######################################

set -e
set -u

################################################################################

##############################---VARIABLES---###################################

DOCKER_IMAGES=( "kendu/nginx-proxy" "kendu/projectbuilder" )
DOCKER_PULL_LOCK=".dockerPullLock"
if ! [ "$#" -lt 1 ] && [ $1 == "--pull" ]
    then
    DOCKER_PULL=true
else
    DOCKER_PULL=false
fi

################################################################################

###############################---EXECUTION---##################################

#Pull containers.
if  [ ${DOCKER_PULL} == true ] ||
    [ ! -e "${DOCKER_PULL_LOCK}" ] ||
    [[ "$(date -r ${DOCKER_PULL_LOCK} +%F )" != "$(date +%F )" ]]
    then
    echo " > Checking for docker image updates"
    touch ${DOCKER_PULL_LOCK}
    for image in ${DOCKER_IMAGES[@]}
    do
        docker pull $image
    done
else
    echo " > Docker images have already been updated today, to force use '--pull'"
fi

#Run the integration script
./provision/preBuild

echo " > Starting containers"
docker-compose up -d --no-recreate

#Provision
./provision/provisionDeploy

#Start proxy
docker start proxy || \
docker run \
-d \
--restart always \
--name proxy \
-p 80:80 \
-v /var/run/docker.sock:/tmp/docker.sock \
kendu/nginx-proxy

echo "That's it, have a nice day :)"

################################################################################
