'use strict';

angular.module('directives')
    .directive('droppable', function() {
        return {
            link: function(scope, element, attrs) {
                element[0].addEventListener('dragover', function(e) {
                    e.preventDefault(); // allow drop
                });

                element[0].addEventListener('dragenter', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

//                    if (this == e.target) {
//                        console.log('dragenter');
//                    }
//                    else {
//                        console.log(e.target);
//                        console.log(this);
//                    }

                    scope.$emit('dragenter');
                });

                element[0].addEventListener('dragleave', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

//                    if (this == e.target) {
//                        console.log('dragleave');
//                    }
//                    else {
//                        console.log(e.target);
//                        console.log(this);
//                    }

                    scope.$emit('dragleave');
                });


                element[0].addEventListener('drop', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    scope.$emit('drop');
                });
            }
        };
    });