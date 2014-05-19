'use strict';

angular.module('Playlist', ['ui.slider'])
    .directive('playlist', function(Player, $document, State) {
        return {
            restrict: 'E',
            scope: {},
            controller: function($scope, $element) {
                $scope.player = Player;

                var state = {
//                    selectedRecords: $scope.player.selectedRecords,
                    lastClickedRecord: undefined
                };

                $scope.mousedown = function(e, record) {
                    if (e.shiftKey) {
                        if (state.lastClickedRecord && state.lastClickedRecord.selected != record.selected) {
                            var i1 = $scope.player.playlist.indexOf(state.lastClickedRecord);
                            var i2 = $scope.player.playlist.indexOf(record);
                            var first = i1 < i2 ? i1 + 1 : i2;
                            var last = i1 < i2 ? i2 : i1 - 1;
                            for (var i = first; i <= last; i++) {
                                $scope.player.playlist[i].selected = state.lastClickedRecord.selected;
                                State.selectedRecords.push($scope.player.playlist[i]);
                            }
                        }
                    }
                    else if (e.ctrlKey) {
                        if (!record.selected) {
                            State.selectedRecords.push(record);
                        }
                        else {
                            var i = State.selectedRecords.indexOf(record);
                            State.selectedRecords.splice(i, 1);
                        }

                        record.selected = !record.selected;
                    }
                    else {
                        State.selectedRecords.forEach(function(record) {
                            record.selected = false;
                        });
                        State.selectedRecords.empty();

                        record.selected = !record.selected;

                        if (record.selected)
                            State.selectedRecords.push(record);
                    }

                    state.lastClickedRecord = record;

                    e.preventDefault(); // no selection on double click
                };

                $scope.deleteSelected = function() {
                    if (State.selectedRecords.length == $scope.player.playlist.length) {
                        $scope.player.playlist.empty();
                    }
                    else {
                        State.selectedRecords.forEach(function(record) {
                            var i = $scope.player.playlist.indexOf(record);
                            $scope.player.playlist.splice(i, 1);
                        });
                    }
                    State.selectedRecords.empty();
                };

                $scope.selectAll = function() {
                    State.selectedRecords.empty();
                    $scope.player.playlist.forEach(function(record) {
                        record.selected = true;
                        State.selectedRecords.push(record);
                    });
                };

                $document.on('keydown', function(e) {
                    switch (e.key.toLowerCase()) {
                        case 'del':
                            $scope.deleteSelected();
                            $scope.$apply();
                            break;
                        case 'a':
                            if (e.ctrlKey) {
                                e.preventDefault();
                                $scope.selectAll();
                                $scope.$apply();
                            }
                            break;
                        default:
                            break;
                    }
                });


            },
            templateUrl: 'tmpl/playlist.html',
            link: function(scope, element, attrs) {
                element[0].addEventListener('dragover', function(e) {
                    e.preventDefault(); // allow drop
                });

                element[0].addEventListener('dragenter', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    scope.$apply(function() {
                        scope.dragover = true;
                    });
                });

                element[0].addEventListener('dragleave', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    scope.$apply(function() {
                        scope.dragover = false;
                    });
                });

                element[0].addEventListener('drop', function(e) {
                    scope.$apply(function() {
                        scope.dragover = false;
                    });

                    Player.enqueue(Player.draggedNode);
                });
            }
        };
    })
    .directive('droppableItem', function(Player) {
        return {
            link: function(scope, element, attrs) {
                element[0].addEventListener('dragover', function(e) {
                    e.preventDefault(); // allow drop
                });

                element[0].addEventListener('dragenter', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    scope.$apply(function() {
                        scope.record.dragover = true;
                    });
                });

                element[0].addEventListener('dragleave', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    scope.$apply(function() {
                        scope.record.dragover = false;
                    });
                });

                element[0].addEventListener('drop', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    Player.enqueue(Player.draggedNode, scope.record);

                    scope.record.dragover = false;
                    scope.$apply();
                });
            }
        }
    });