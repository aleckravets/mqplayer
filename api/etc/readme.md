## mod_jk configuration

Download mod_jk.so from here: [http://tomcat.apache.org/download-connectors.cgi](http://tomcat.apache.org/download-connectors.cgi) and put it to apache's modules directory

Module configuration (httpd.conf):

        LoadModule jk_module modules/mod_jk.so
        
        <IfModule jk_module>
            JkWorkersFile Z:/usr/local/apache/conf/workers.properties
            JkLogFile Z:/usr/local/apache/logs/mod_jk.log
            JkLogLevel error
            JkLogStampFormat "[%a %b %d %H:%M:%S %Y]"
        </IfModule>

Virtual host configuration example:

        <VirtualHost 127.0.0.1:443>
          DocumentRoot "E:/Projects/mqplayer/mq/app"  
          ServerName "localhost"
          SSLEngine on
          <IfModule jk_module>
            JkMount /api/* mqplayerapi
          </IfModule>
        </VirtualHost>
        
where `mqplayerapi` is the worker's name, defined in `workers.properties` file:

        worker.list=mqplayerapi
        worker.mqplayerapi.type=ajp13
        worker.mqplayerapi.host=localhost
        worker.mqplayerapi.port=8009
    
 
## Import Google API's certificate
1. downalod the google api's certificate by going to [https://content.googleapis.com/drive/v2/about](https://content.googleapis.com/drive/v2/about)
and put it to c:\gapi.cer for example
2. import the certificate to keystore by running the following commands

        cd %JAVA_HOME%/lib/security
        keytool -import -alias ca -file c:\gapi.cer -keystore cacerts -storepass changeit