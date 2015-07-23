#!/bin/bash

set -e

project_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )"/.. && pwd )"
deploy_to=/var/lib/tomcat7/webapps_test/ROOT
pom=$project_dir/pom.xml

cd $project_dir

mvn -f $project_dir/pom.xml clean package -DskipTests war:exploded

mvn -f $project_dir/api/pom.xml initialize resources:resources liquibase:update

# service tomcat7 stop

rm -fr $deploy_to

cp -pr $project_dir/api/target/mqplayer-api $deploy_to

# service tomcat7 start

cd ui
npm install
gulp