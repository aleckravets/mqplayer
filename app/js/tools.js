function bootstrap() {
    gapi.client.load('drive', 'v2', function() {
        angular.bootstrap(document, ['App']);
    });
}

Array.prototype.empty = function() {
    this.splice(0, this.length);
}