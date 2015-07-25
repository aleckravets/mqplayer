#!/bin/bash

set -e

project_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )"/.. && pwd )"
deploy_to=/var/lib/tomcat7/webapps_test/ROOT
ui_dir=/var/www/test.mqplayer.com/public_html

cd $project_dir/api

mvn -P test clean package liquibase:update -DskipTests war:exploded

service tomcat7 stop

rm -fr $deploy_to

cp -pr $project_dir/api/target/mqplayer-api $deploy_to

cd $project_dir/ui

npm install
bower install
gulp

cp -pr dist/* $ui_dir/

service tomcat7 start