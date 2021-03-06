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
 **/

describe('Factory: ContentViewPuppetModule', function() {
    var $httpBackend,
        ContentViewPuppetModule,
        ContentViewPuppetModules;

    beforeEach(module('Bastion.content-views', 'Bastion.utils', 'Bastion.test-mocks'));

    beforeEach(module(function($provide) {
        ContentViewPuppetModules = {
            results: [
                { name: 'ContentViewPuppetModule1', id: 1 },
                { name: 'ContentViewPuppetModule2', id: 2 }
            ],
            total: 10,
            subtotal: 5,
            limit: 5,
            offset: 0
        };

        $provide.value('CurrentOrganization', 'ACME');
        $provide.value('translate', function(string) {return string;})
    }));

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        ContentViewPuppetModule = $injector.get('ContentViewPuppetModule');
    }));

    afterEach(function() {
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('provides a way to get a collection of content views', function() {
        $httpBackend.expectGET('/api/v2/content_views/content_view_puppet_modules?full_result=true&organization_id=ACME')
            .respond(ContentViewPuppetModules);

        ContentViewPuppetModule.queryUnpaged(function (response) {
            var views = response;

            expect(views.results.length).toBe(2);
            expect(views.total).toBe(10);
            expect(views.subtotal).toBe(5);
            expect(views.offset).toBe(0);
        });
    });

    it('provides a way to get a single content view', function() {
        $httpBackend.expectGET('/api/v2/content_views/content_view_puppet_modules/1?organization_id=ACME')
            .respond(ContentViewPuppetModules.results[0]);

        ContentViewPuppetModule.get({id: 1}, function (contentViewPuppetModule) {
            expect(contentViewPuppetModule).toBeDefined();
            expect(contentViewPuppetModule.name).toEqual('ContentViewPuppetModule1');
        });
    });

    it('provides a way to create a content view', function() {
        var contentViewPuppetModule = {id: 1, name: 'Content View'};

        $httpBackend.expectPOST('/api/v2/content_views/content_view_puppet_modules/1?organization_id=ACME')
            .respond(contentViewPuppetModule);

        ContentViewPuppetModule.save(contentViewPuppetModule, function (contentViewPuppetModule) {
            expect(contentViewPuppetModule).toBeDefined();
            expect(contentViewPuppetModule.name).toEqual('Content View');
        });
    });

    it('provides a way to update a content view', function() {
        $httpBackend.expectPUT('/api/v2/content_views/content_view_puppet_modules/1?organization_id=ACME')
            .respond(ContentViewPuppetModules.results[0]);

        ContentViewPuppetModule.update({id: 1, name: 'NewCVName'}, function (contentViewPuppetModule) {;
            expect(contentViewPuppetModule).toBeDefined();
        });
    });
});
