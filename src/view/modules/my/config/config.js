import { LightningElement, api, track } from 'lwc';

export default class Config extends LightningElement {
    @api
    vscode;

    @api
    initialData;

    @track
    _state;

    connectedCallback() {
        let initialData = this.initialData;

        let oldState = this.vscode.getState();
        if (oldState) {
            this._state = oldState;
        } else {
            this._state = { config: JSON.parse(JSON.stringify(initialData)) };
        }
    }

    saveConfig() {
        this.vscode.postMessage({ action: "Save", content: JSON.parse(JSON.stringify(this._state.config)) });
    }

    handleUserState(evt) {
        this._state.config.users = evt.detail;
    }
}
