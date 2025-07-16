import { expect } from "chai";
import { ActivityBar, By, VSBrowser, WebDriver, WebviewView } from "vscode-extension-tester";

const BASELINE = 15_000;

const DEFAULT_TIMEOUT = {
  XS: BASELINE * 0.2,
  SM: BASELINE * 0.5,
  MD: BASELINE,
  XL: BASELINE * 5,
};


describe("Simple Webview UI Test", function () {
  this.timeout(60000);
  let driver: WebDriver;
  let view: WebviewView;
  before(async function () {
    // const activityBar = new ActivityBar();
    // const viewControl = await activityBar.getViewControl("Test Ext Sidebar");
    // if (!viewControl) {
    //   throw new Error("Could not find Test Ext in ActivityBar");
    // }
    // await viewControl.openView();
    driver = VSBrowser.instance.driver;
    await driver.wait(
      async () => {
        const activityBar = new ActivityBar();
        const viewControl = await activityBar.getViewControl('Test Ext Sidebar');
        if (!viewControl) {
          return false;
        }
        await viewControl.openView();
        return true;
      },
      DEFAULT_TIMEOUT.MD,
      'Could not find Test Ext Sidebar in ActivityBar',
    );

    // Wait for the webview content to be ready
    await driver.wait(
      async () => {
        try {
          view = new WebviewView();
          await view.switchToFrame();
          console.log('view HTML', await driver.getPageSource());
          const elements = await driver.findElements(By.css('#myForm'));
          return elements.length > 0;
        } catch (_) {
          return false;
        }
      },
      DEFAULT_TIMEOUT.MD,
      'Webview content did not load in time',
    );
    // const mainWebviewFrame = await driver.findElement(
    //   By.css("iframe.webview.ready")
    // );
    // await driver.switchTo().frame(mainWebviewFrame);
    // const innerFrame = await driver.findElement(
    //   By.css('iframe[title="Simple Webview"]')
    // );
    // await driver.switchTo().frame(innerFrame);
    console.log("innerFrame switching done");
    // console.log("before switching to frame");
    // console.log("opening side bar");
    // const sideBar = new SideBarView();
    // const content = await sideBar.getContent();
    // const html = await content.getAttribute("outerHTML");
    // console.log("Sidebar content HTML:", html);
    // console.log("after opening side bar");
    // // Find the webview element inside the sidebar content
    // console.log("content", content);
    // await new Promise((resolve) => setTimeout(resolve, 1200000));
    // const webviewDiv = await content.findElement(
    //   By.css("iframe.webview.ready")
    // );
    // Find the <iframe id="Simple Webview"> inside that div

    console.log("after finding webview element");

    // Wait for the webview to appear and load
    // webview = new WebView(webviewFrame);
    // console.log("before switching to frame");
    // await webview.switchToFrame();
    // console.log("after switching to frame");
    // console.log("webview", webview);
    // // Wait for the input element to appear in the webview
    // await webview.findWebElement(By.css('[data-testid="webview-input"]'));
    // console.log("after finding webview");
  });

  after(async function () {
    if (driver) {
      await driver.switchTo().defaultContent();
    }
  });

  it("should find the input and submit button in the webview", async function () {
    const input = await driver.findElement(
      By.css('[data-testid="webview-input"]')
    );
    expect(input).to.exist;

    const button = await driver.findElement(
      By.css('[data-testid="webview-submit"]')
    );
    expect(button).to.exist;
  });

  it("should submit the form and show information message", async function () {
    const input = await driver.findElement(
      By.css('[data-testid="webview-input"]')
    );
    await input.clear();
    await input.sendKeys("Hello VSCode");
    const button = await driver.findElement(
      By.css('[data-testid="webview-submit"]')
    );
    await button.click();
    // Switch back to default content to check for the information message
    await driver.switchTo().defaultContent();
    // Wait for the information message to appear
    const infoMessage = await driver.wait(
      async () => {
        try {
          const elem = await driver.findElement(
            By.className("notification-list-item-main-row") //notification-list-item-message
          );
          const text = await elem.getText();
          return text.includes("Message from webview -> Hello VSCode")
            ? elem
            : false;
        } catch {
          return false;
        }
      },
      2000,
      "Information message did not appear"
    );
    expect(infoMessage).to.exist;
  });
});
