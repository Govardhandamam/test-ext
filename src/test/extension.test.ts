import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
// import * as myExtension from '../../extension';

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Sample test", () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });

  test("test-ext.helloWorld command should show info message", async () => {
    // Patch showInformationMessage to capture the message
    let shownMessage: string | undefined;
    const original = vscode.window.showInformationMessage;
    (vscode.window.showInformationMessage as any) = (msg: string) => {
      shownMessage = msg;
      return Promise.resolve();
    };

    await vscode.commands.executeCommand("test-ext.helloWorld");

    assert.strictEqual(shownMessage, "Hello World from test-ext asd sfsdfs!");

    // Restore original
    (vscode.window.showInformationMessage as any) = original;
  });
});
