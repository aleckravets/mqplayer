function bootstrap() {
    gapi.client.load('drive', 'v2', function() {
        angular.bootstrap(document, ['App']);
    });
}