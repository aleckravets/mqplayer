'use strict';

/* Services */

angular.module('Services', ['ngResource'])
    .factory('DiskAPI', ['$resource', '$http',
        function($resource, $http){
            var url = 'proxy.php';

            return {
                getItems: function(path, done) {
                    var res = $resource(url + path);

                    if (done) {
                        return res.query(done);
                    }
                    else
                    {
                        var items = [];

                        res.query(function(data) {
                            for (var i = 0; i < data.length; i++) {
                                items.push(data[i]);
                            }
                        });

                        return items;
                    }
                },
                getFileUrl: function(path) {
                    return url + '?get=' + encodeURIComponent(path);
                }
            };
        }])
    .factory('RecursionHelper', ['$compile', function($compile){
        return {
            /**
             * Manually compiles the element, fixing the recursion loop.
             * @param element
             * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
             * @returns An object containing the linking functions.
             */
            compile: function(element, link){
                // Normalize the link parameter
                if(angular.isFunction(link)){
                    link = { post: link };
                }

                // Break the recursion loop by removing the contents
                var contents = element.contents().remove();
                var compiledContents;
                return {
                    pre: (link && link.pre) ? link.pre : null,
                    /**
                     * Compiles and re-adds the contents
                     */
                    post: function(scope, element){
                        // Compile the contents
                        if(!compiledContents){
                            compiledContents = $compile(contents);
                        }
                        // Re-add the compiled contents to the element
                        compiledContents(scope, function(clone){
                            element.append(clone);
                        });

                        // Call the post-linking function, if any
                        if(link && link.post){
                            link.post.apply(null, arguments);
                        }
                    }
                };
            }
        };
    }]);
;
 
