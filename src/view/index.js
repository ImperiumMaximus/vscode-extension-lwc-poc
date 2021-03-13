import '@lwc/synthetic-shadow';

import { createElement } from 'lwc';
import MyApp from 'my/app';

const vscode = window.acquireVsCodeApi();

const app = createElement('my-app', { is: MyApp });
app.vscode = vscode;
app.initialData = window.initialData;
document.querySelector('#main').appendChild(app);
