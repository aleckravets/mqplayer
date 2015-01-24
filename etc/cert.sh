# downalod the certificate from https://content.googleapis.com to c:\gapi.cer
# by going to https://content.googleapis.com/drive/v2/about for example
# import the certificate to keystore by the following commands

cd %JAVA_HOME%/lib/security

keytool -import -alias ca -file c:\gapi.cer -keystore cacerts -storepass changeit