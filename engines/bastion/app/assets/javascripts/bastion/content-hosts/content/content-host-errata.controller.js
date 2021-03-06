/**
 * Copyright 2014 Red Hat, Inc.
 *
 * This software is licensed to you under the GNU General Public
 * License as published by the Free Software Foundation; either version
 * 2 of the License (GPLv2) or (at your option) any later version.
 * There is NO WARRANTY for this software, express or implied,
 * including the implied warranties of MERCHANTABILITY,
 * NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
 * have received a copy of GPLv2 along with this software; if not, see
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.
 */

/**
 * @ngdoc object
 * @name  Bastion.content-hosts.controller:ContentHostErrataController
 *
 * @requires $scope
 * @requires ContentHostErratum
 * @requires Nutupane
 *
 * @description
 *   Provides the functionality for the content host package list and actions.
 */
/*jshint camelcase:false*/
angular.module('Bastion.content-hosts').controller('ContentHostErrataController',
    ['$scope', 'ContentHostErratum', 'Nutupane',
    function ($scope, ContentHostErratum, Nutupane) {
        var errataNutupane;

        errataNutupane = new Nutupane(ContentHostErratum, {'id': $scope.$stateParams.contentHostId}, 'get');
        $scope.errataTable = errataNutupane.table;
        $scope.errataTable.errataFilterTerm = "";
        $scope.errataTable.errataCompare = function (item) {
            var searchText = $scope.errataTable.errataFilterTerm;
            return item.type.indexOf(searchText)  >= 0 ||
                item.errata_id.indexOf(searchText) >= 0 ||
                item.title.indexOf(searchText) >= 0;
        };

        $scope.transitionToErratum = function (erratum) {
            loadErratum(erratum.errata_id);
            $scope.transitionTo('content-hosts.details.errata.details', {errataId: erratum.errata_id});
        };

        $scope.applySelected = function () {
            var selected, errataIds = [];
            selected = $scope.errataTable.getSelected();
            if (selected.length > 0) {
                angular.forEach(selected, function (value) {
                    errataIds.push(value.errata_id);
                });
                ContentHostErratum.apply({uuid: $scope.contentHost.uuid, errata_ids: errataIds},
                                   function (task) {
                                        $scope.errataTable.selectAll(false);
                                        $scope.transitionTo('content-hosts.details.tasks.details', {taskId: task.id});
                                    });
            }
        };

        function loadErratum(errataId) {
            $scope.erratum = ContentHostErratum.get({'id': $scope.$stateParams.contentHostId,
                'errata_id': errataId});
        }

        if ($scope.$stateParams.errataId) {
            loadErratum($scope.$stateParams.errataId);
        }
    }
]);
