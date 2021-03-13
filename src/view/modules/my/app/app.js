import { LightningElement, api } from 'lwc';

export default class App extends LightningElement {
    @api
    vscode;

    @api
    initialData;

    connectedCallback() {
        console.log(JSON.stringify(this.initialData));
    }
}
