const e = require("../modules/elements");
const a = require('../modules/actions');
const message = require('../modules/messages');
const mo = require('../modules/mainobject');
const so = require('../modules/subobject');

describe('mainobject view', () => {
    describe('editables', () => {
        it("number editable should be limited to numbers", () => {
            browser.get(browser.baseUrl);
            mo.getRowContent("Year").then(cell => {
                cell.element(by.css("input")).clear().sendKeys("abc");
                expect(cell.element(by.css(".alert-warning")).isDisplayed()).toBeTruthy();
            });
        });

        it("should load some journal data codes from ojs cilantro plugin api", () => {
            browser.get(browser.baseUrl);
            mo.getRowContent("OJS: Journal Code")
                .then(cell => {
                    cell.all(by.css("option")).get(1).click();
                    e.home.startBtn.click();
                    a.clickNavbarButton("articles");
                    e.subobject.add.click();
                    so.getRowContent("Language").then(cell => {
                        expect(cell.all(by.css("label")).get(0).getText()).toBe("English");
                        expect(cell.all(by.css("label")).get(1).getText()).toBe("German");
                        expect(cell.all(by.css("label")).get(2).getText()).toBe("Russian");
                    });
                    a.restart();
                    cell.all(by.css("option")).get(1).click();
                    e.home.startBtn.click();
                    a.clickNavbarButton("articles");
                    e.subobject.add.click();
                    so.getRowContent("Language").then(cell => {
                        expect(cell.all(by.css("label")).get(0).getText()).toBe("English");
                        expect(cell.all(by.css("label")).count()).toEqual(1);
                    });

                });

        });
        it("should load some journal data codes from ojs cilantro plugin api", () => {
            browser.get(browser.baseUrl);
            mo.getRowContent("OJS: Journal Code")
                .then(cell => {
                    cell.all(by.css("option")).get(2).click();
                    browser.sleep(1500);
                    e.home.startBtn.click();
                    e.documents.treeViewItemsTopLevel.get(2).all(by.css('.load')).first().click();
                    message.waitForMessage();
                    e.documents.proceedBtn.click();
                    e.overview.proceedBtn.click();
                    so.getRowContent("Language").then(cell => {
                        expect(cell.all(by.css("label")).get(0).getText()).toBe("English");
                        expect(cell.all(by.css("label")).count()).toEqual(1);
                    });
                });

        });


    });


});