import 'whatwg-fetch';

export default class App {
    constructor(element) {
        this.ENDPOINT = 'https://jsonplaceholder.typicode.com/users/';

        element.addEventListener('click', () => {
            this.getUsers().then((data) => {
                const chld = `
                <div>${data.map((el, idx) => `<p key="${idx}">${el.name}</p>`).join('')}</div>
                `;

                element.insertAdjacentHTML('afterend', chld);
            });
        });
    }

    getUsers = () =>
        fetch(this.ENDPOINT)
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((json) => json);
}
