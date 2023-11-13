import jsImage from '../../images/js_image.jpg';
import svgImage from '../../images/icon.svg';
import rawImage from '../../images/raw_image.svg?rawSVG'; // eslint-disable-line
import { injectSVG, importFolder } from './utils';

const batch = importFolder(require.context('../../images/batch', false, /\.(png|jpe?g|svg)$/));

export default class App {
    constructor(element) {
        this.ENDPOINT = process.env.API_URL || 'https://jsonplaceholder.typicode.com/users';

        element.addEventListener('click', () => {
            this.getUsers().then((data) => {
                const chld = `
                <div>${data.map((el, idx) => `<p key="${idx}">${el.name}</p>`).join('')}</div>
                `;

                element.insertAdjacentHTML('afterend', chld);
            });
        });

        const image = `<img width="100" src="${jsImage}" alt="js image" />`;
        element.insertAdjacentHTML('afterend', image);

        let div = document.createElement('div');
        element.insertAdjacentElement('afterend', div);
        injectSVG(svgImage, div);

        let rawdiv = document.createElement('div');
        rawdiv.innerHTML = rawImage;
        element.insertAdjacentElement('afterend', rawdiv);

        const batch1 = `<img width="100" src="${batch['TI.png']}" alt="js image" />`;
        element.insertAdjacentHTML('afterend', batch1);
    }

    static myvar = 1;

    getUsers = () =>
        fetch(this.ENDPOINT)
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((json) => json);
}
