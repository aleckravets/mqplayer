#!/bin/bash

set -e

project_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )"/.. && pwd )"
deploy_to=/var/lib/tomcat7/webapps/ROOT.war
#ui_dir=/var/www/mqplayer.com/public_html

cd $project_dir/api

mvn -P prod clean package liquibase:update -DskipTests

rm -fr $deploy_to

cp -pr $project_dir/api/target/mqplayer-api.war $deploy_to

#cd $project_dir/ui

#npm install
#bower install
#gulp

#rm -fr $ui_dir/*

#cp -pr dist/* $ui_dir/