export default class Store {
    // Returns links from local storage or an empty array
    static getLinks() {
        let links;
        if (localStorage.getItem('links') === null) {
            links = [];
        } else {
            links = JSON.parse(localStorage.getItem('links'));
        }
        return links;
    }

    // Adds link to local storage
    static addLink(link) {
        const links = Store.getLinks();
        links.push(link);
        localStorage.setItem('links', JSON.stringify(links));
    }

    // Removes link from local storage
    static removeLink(id) {
        const links = Store.getLinks();
        links.forEach((link, index) => {
            if (link.id == id) {
                links.splice(index, 1);
            }
        })

        localStorage.setItem('links', JSON.stringify(links));
    }

    // Edits link from local storage
    static editLink(id, newURL) {
        const links = Store.getLinks();
        links.forEach(link => {
            if (link.id == id) {
                link.url = newURL;
            }
        })

        localStorage.setItem('links', JSON.stringify(links));
    }
}