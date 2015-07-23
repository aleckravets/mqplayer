#!/bin/bash

set -e

project_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )"/.. && pwd )"
deploy_to=/var/lib/tomcat7/webapps/ROOT.war
pom=$project_dir/pom.xml

mvn -f $project_dir/pom.xml clean package war

mvn -f $project_dir/api/pom.xml initialize resources:resources liquibase:update

# service tomcat7 stop

rm -fr $deploy_to

cp -pr $project_dir/api/target/mqplayer-api.war $deploy_to

# service tomcat7 start