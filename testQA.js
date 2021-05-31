const dat = require('./data.json')
const fs = require("fs");
const { Builder, By, Key, until } = require('selenium-webdriver');



async function test(i) {

    let driver = await new Builder().forBrowser('chrome').build();

    try {

        await driver.get("http://375.synergatos.gr/en/propertyDetails/13079");
        await driver.findElement(By.xpath("//input[@name='firstName']")).sendKeys(i.firstName);
        await driver.findElement(By.xpath("//input[@name='lastName']")).sendKeys(i.lastName);
        await driver.findElement(By.xpath("//input[@name='phoneNumber']")).sendKeys(i.phoneNumber);
        await driver.findElement(By.xpath("//input[@name='contactEmail']")).sendKeys(i.email);
        await driver.findElement(By.xpath("//textArea[@name='messageText']")).sendKeys(i.message);
        await driver.findElement(By.xpath("//input[@name='acceptTermsOfUse']/following-sibling::label")).click();
        await driver.findElement(By.xpath("//button[@type='submit' and contains(text(),'Send')]")).click();

        let firstResult = driver.wait(until.elementLocated(By.xpath("//*[contains(@class, 'modal-title')]")), 10000);
        i.testRes = await firstResult.getAttribute('textContent') == i.expectedRes ? 'PASS' : 'FAIL';

    } catch (err) {

        "Error" == i.expectedRes ? 'PASS' : 'FAIL';
    }
    finally {
        await driver.quit();
    }
}


function newRun(i = 0) {
    if (i < dat.length) {
        test(dat[i]).then(() => {
            newRun(++i);
        }
        )
    } else {

        fs.writeFile("./testReport.json", JSON.stringify(dat), err => {
            if (err) throw err;
            console.log("Done Testing. Test Report Exported: testReport.json");
        });
    }
}


newRun();

