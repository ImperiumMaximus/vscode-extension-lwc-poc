import { LightningElement, api, track } from 'lwc';

export default class Users extends LightningElement {
    @track
    _users;

    @api
    get users() {
        return this._users.map((user, userIndex) => {
            let roles = user.roles && user.roles.length > 0
                ? user.roles.join(",")
                : null;
            return Object.assign({ roles, index: userIndex }, user);
        });
    }

    set users(value) {
        this._users = value;
    }

    onChangeUserActiveState(event) {
        const userIndex = event.currentTarget.dataset.userIndex;
        const usrs = JSON.parse(JSON.stringify(this._users));
        usrs[userIndex].active = !usrs[userIndex].active;
        this.users = usrs;
        this.defineUserState();
    }

    onAddRole(event) {
        if (event.keyCode === 13 && event.currentTarget.value !== "") {
            const userIndex = event.currentTarget.dataset.userIndex;
            const usrs = JSON.parse(JSON.stringify(this._users));
            usrs[userIndex].roles.push(event.currentTarget.value);
            this.users = usrs;
            this.defineUserState();
            event.currentTarget.value = "";
          }
    }

    onAddUser(event) {
        if (event.keyCode === 13 && event.currentTarget.value !== "") {
            let newUser = {
                name: event.currentTarget.value,
                active: true,
                roles: []
            };
            const usrs = Array.from(this._users);
            usrs.push(newUser);
            this.users = usrs;
            this.defineUserState();
            event.currentTarget.value = "";
        }
    }

    defineUserState() {
        const userStateEvent = new CustomEvent('userstate', { detail: this._users });
        this.dispatchEvent(userStateEvent);
    }
}
