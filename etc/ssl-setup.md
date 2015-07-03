## create key and certificate
    openssl genrsa -out mqplayer.key 2048
    openssl req -new -x509 -key mqplayer.key -out mqplayer.cert -days 3650 -subj /CN=mqplayer

## configure nginx by adding the following to the "server" section:
    listen 443 ssl;
    ssl_certificate d:/nginx/ssl/mqplayer.cert;
    ssl_certificate_key d:/nginx/ssl/mqplayer.key;
