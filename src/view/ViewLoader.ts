import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export default class ViewLoader {
  private readonly _panel: vscode.WebviewPanel | undefined;
  private readonly _extensionPath: string;
  private _disposables: vscode.Disposable[] = [];

  constructor(fileUri: vscode.Uri, extensionPath: string) {
    this._extensionPath = extensionPath;

    let config = this.getFileContent(fileUri);
    if (config) {
      this._panel = vscode.window.createWebviewPanel(
        "configView",
        "Config View",
        vscode.ViewColumn.One,
        {
          enableScripts: true,

          localResourceRoots: [
            vscode.Uri.file(path.join(extensionPath, "dist"))
          ]
        }
      );

      this._panel.webview.html = this.getWebviewContent(config);

      this._panel.webview.onDidReceiveMessage(
        (command: any) => {
          switch (command.action) {
            case "Save":
              this.saveFileContent(fileUri, command.content);
              return;
          }
        },
        undefined,
        this._disposables
      );
    }
  }

  private getWebviewContent(config: any): string {
    // Local path to main script run in the webview
    const lwcAppPathOnDisk = vscode.Uri.file(
      path.join(this._extensionPath, "dist", "main.js")
    );
    const lwcAppUri = this._panel?.webview.asWebviewUri(lwcAppPathOnDisk);

    const sldsCssPathOnDisk = vscode.Uri.file(
      path.join(this._extensionPath, "dist", "resources", "slds", "styles", "salesforce-lightning-design-system.min.css")
    );

    const sldsCssUri = this._panel?.webview.asWebviewUri(sldsCssPathOnDisk);;
    const configJson = JSON.stringify(config);

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Config View</title>
        <link rel="stylesheet" href="${sldsCssUri}">

        <meta http-equiv="Content-Security-Policy"
                    content="default-src 'none';
                             img-src 'self' ${this._panel?.webview.cspSource} data:;
                             script-src 'unsafe-eval' 'unsafe-inline' ${this._panel?.webview.cspSource};
                             style-src ${this._panel?.webview.cspSource} 'unsafe-inline';
                             font-src 'self' ${this._panel?.webview.cspSource};">

        <script>
          window.acquireVsCodeApi = acquireVsCodeApi;
          window.initialData = ${configJson};
        </script>
    </head>
    <body>
        <div id="main"></div>

        <script src="${lwcAppUri}"></script>
    </body>
    </html>`;
  }

  private getFileContent(fileUri: vscode.Uri): any | undefined {
    if (fs.existsSync(fileUri.fsPath)) {
      let content = fs.readFileSync(fileUri.fsPath, "utf8");
      let config: any = JSON.parse(content);

      return config;
    }
    return undefined;
  }

  private saveFileContent(fileUri: vscode.Uri, config: any) {
    if (fs.existsSync(fileUri.fsPath)) {
      let content: string = JSON.stringify(config);
      fs.writeFileSync(fileUri.fsPath, content);

      vscode.window.showInformationMessage(
        `👍 Configuration saved to ${fileUri.fsPath}`
      );
    }
  }
}