// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

class SimpleSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "test-ext.simpleSidebar";
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
    };
    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);

    // Listen for messages from the webview
    webviewView.webview.onDidReceiveMessage((message) => {
      if (message.command === "submit") {
        vscode.window.showInformationMessage(
          `Message from webview -> ${message.text}`
        );
      }
    });
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simple Sidebar</title>
        <style>
          body { font-family: sans-serif; padding: 16px; }
          input[type='text'] { width: 80%; padding: 4px; }
          button { margin-left: 8px; }
        </style>
      </head>
      <body>
        <form id="myForm">
          <input type="text" id="myInput" data-testid="webview-input" placeholder="Type something..." />
          <button type="submit" data-testid="webview-submit">Submit</button>
        </form>
        <script>
          const vscode = acquireVsCodeApi();
          document.getElementById('myForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const value = document.getElementById('myInput').value;
            vscode.postMessage({ command: 'submit', text: value });
          });
        </script>
      </body>
      </html>
    `;
  }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "test-ext" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "test-ext.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from test-ext asd sfsdfs!"
      );
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      SimpleSidebarProvider.viewType,
      new SimpleSidebarProvider(context.extensionUri)
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
