#!/bin/bash

################################################################################
#                                                                              #
#                                 {o,o}                                        #
#                                 |)__)                                        #
#                                 -"-"-                                        #
#                                                                              #
################################################################################
#
#The database filling and patching script
#Do supply necessary variables enviormentally please!
#This file is part of the dotFiles repo.
#
#################################---ENV---######################################

set -u
set -e

################################################################################

##############################---VARIABLES---###################################

#Variables to set:
#DBNAME - name of the database
#SQL_LOCATIONS - locations to search for sql files - in array of correct order.

#Optional variables:
DBHOST=${DBHOST:-"localhost"}
DBPORT=${DBPORT:-"5432"}
SUPERU=${SUPERU:-"postgres"}

#Static variables
DBLOG=".dbPatch.log"
DROPFILE=".dropdb"
DBCONNECT=" -h ${DBHOST} -p ${DBPORT} -U ${SUPERU}"

################################################################################

##############################---FUNCTIONS---###################################

#Import sql file
function importFile() {

    #Check if filename is given
    if [ -n "${1+1}" ]
        then
        #Check if file exists
        if [ -f $1 ]
            then
            #Check if the file was imported yet
            if [ -z "$(grep $(basename ${1} ) ${DBLOG} )" ]
                then
                echo "*Processing file ${1} ..."
                psql ${DBCONNECT} ${DBNAME} < "${1}"
                echo "OK - Imported "
                echo ""
                echo $(basename ${1} ) >> ${DBLOG}
            fi
        fi
    else
        echo "No import file specified!"
    fi
}

function importLocations() {
    touch ${DBLOG}
    IFS=', '
    read -a SQL_LOCATIONS <<< "$SQL_LOCATIONS"
    for location in "${SQL_LOCATIONS[@]}"
    do
        echo "Processing location \"$location\""
        for sql_file in ${location}/*.sql
        do
            importFile "${sql_file}"
        done
    done
}

#Create database if it doesn't exist
function createDatabase() {
    if [[ -z $(psql ${DBCONNECT} --list | grep ${DBNAME}) ]]; then
        echo ">>> Database (${DBNAME}) not found - creating"
        createdb ${DBCONNECT} ${DBNAME}
        : > ${DBLOG}
    fi
}

function dropDatabase() {
    echo "* .dropdb found, dropping database!"
    dropdb ${DBCONNECT} ${DBNAME} || true
    rm -f ${DROPFILE} ${DBLOG}
    touch ${DBLOG}
}

################################################################################

###############################---EXECUTION---##################################

#You can run specific actions by specifying them
if [ -n "${1+1}" ]
    then
    $1 $2
else
    if [ -f ${DROPFILE} ]
        then
        dropDatabase
    fi
    createDatabase
    # importLocations
fi
real_user=${REAL_USER:-$USER}
chown ${real_user}:${real_user} ${DBLOG}

################################################################################
