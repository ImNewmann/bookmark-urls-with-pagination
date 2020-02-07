import Store from './storage'

export default class UI {

    // This is called when app first loads, loops through data and renders links
    static displayLinks(start, end) {
        UI.clearList();

        const links = Store.getLinks();
        if (links.length) {
            for (let i = start; i < end; i++) {
                UI.addLinkToList(links[i])
            }
        }
    }
    
    // Adds link to the UI
    static addLinkToList(link) {
        const list = document.querySelector('.links__items')
        const row = document.createElement('li')
        row.className = 'row'

        row.innerHTML = `
            <span class="col-6">${link.title}</span>
            <span class="col-6">
                <a href="${link.url}" data-id="${link.id} "target="_blank">${link.url}</a>
                <input type="text" class="edit-link" style="display:none">
                <span><a href="#" class="edit">Edit</a></span>
                <span><a href="#" class="delete">X</a></span>
            </span>
        `
        list.prepend(row);
    }

    // Edits link by revealing hidden input field and then updating UI and store.
    static editLink(editBtn) {
        const url = editBtn.parentElement.parentElement.firstElementChild;
        const linkID = url.dataset.id;
        const editField = editBtn.parentElement.previousElementSibling;

        if (editBtn.classList.contains('edit')) {
            url.style.display = 'none';
            editBtn.innerText = 'Submit';
            editBtn.className = 'submit';
            editField.style.display = 'inline-block';
            editField.value = url.innerText;
        } else if (editBtn.classList.contains('submit')) {
            editBtn.className = 'edit';
            url.style.display = 'inline-block';
            url.innerText = editField.value;
            editBtn.innerText = 'Edit';
            editField.style.display = 'none';

            Store.editLink(linkID, editField.value);
        }
    }

    // Removes Link from UI
    static deleteLink(link) {
        link.remove();
    }

    // Displays results message
    static showResult(message, link) {
        const section = document.querySelector('.result');
        section.style.display = 'block'; 
        const div = document.createElement('div')
        div.appendChild(document.createTextNode(message))
        const row = document.createElement('div')
        row.classList.add('result__message')
        row.innerHTML = `
            <h1 class="mb-2">${message}</h1>
            <h2>${link.title}</h2>
            <h2>Url: <a href="${link.url}">${link.url}</a></h2>
        `;
        section.appendChild(row)
    }

    // Get Pages
    static getPages() {
        return Math.ceil(Store.getLinks().length / 10)
    }

    // Gets previous set of links to show when going back a page
    static getPrevLinks(currentPage, maxNumOfLinks) {
        // Gets the last link of previous 20 links
        const endPost = (maxNumOfLinks * currentPage) - maxNumOfLinks;       
        // Gets the first link
        const startPost = endPost - maxNumOfLinks;

        return {
            startPost,
            endPost
        }
    }

    // Gets next set of links to show when going fprward a page
    static getNextLinks(currentPage, maxNumOfLinks) {
        // Gets the last link in the next set of 20 links
        const endPost = maxNumOfLinks * (currentPage + 1);
        // Gets the first link of the next set of 20 links
        const startPost = endPost - maxNumOfLinks;

        return {
            startPost,
            endPost
        }
    }

    // Reveals pagination links and adds active class to 1st page (Default)
    static showPagination() {
        const paginationLinks = document.querySelector('.pagination')
        paginationLinks.style.display = 'flex';

        const page1 = document.querySelector(`.page--1`);
        page1.classList.add('active')
    }

    // Hides pagination. Is called whenever links are deleted 
    static hidePagination() {
        const paginationLinks = document.querySelector('.pagination')
        paginationLinks.style.display = 'none';
    }
    
    // Highlights current page link on pagination
    static highlightCurrentPage(currentPage) {
        const pageNumbers = document.querySelectorAll('.page');
        const currentPageNumber = document.querySelector(`.page--${currentPage}`);
        pageNumbers.forEach(p => p.classList.remove('active'));
        currentPageNumber.classList.add('active');
    }

    // Updates pagination pages when data changes
    static updatePaginationLinks(numOfPages, currentPage) {
        let pagesHTML = [];
        const paginationLinks = document.querySelector('.pagination');
        paginationLinks.innerHTML = '';

        pagesHTML.push('<li class="prev page-item"><a href="#" class="page-link">prev</a></li>');
        for (let i = 1; i <= numOfPages; i++) {
            pagesHTML.push(`<li class="page page-item page--${i}"><a href="#" class="page-link">${i}</a></li>`);
        }
        pagesHTML.push('<li class="next page-item"><a href="#" class="page-link">next</a></li>');    
        paginationLinks.insertAdjacentHTML('beforeend', pagesHTML.join(''));
        UI.highlightCurrentPage(currentPage)
    }

    // Updates the posts displayed when pagination is being used.
    static updatePosts(start, end, maxNumOfLinks, currentPage) {
        let numOfLinks = Store.getLinks().length;

        // Show remaining amount of posts. (Under 20)
        if (numOfLinks < start + maxNumOfLinks) {
            UI.displayLinks(start, numOfLinks);
            UI.highlightCurrentPage(currentPage)

        // Show the next 20 posts
        } else {
            UI.displayLinks(start, end); 
            UI.highlightCurrentPage(currentPage)
        }
    }

    // Clears list elements before rendering new set of data. (Pagination use)
    static clearList() {
        const listContainer = document.querySelector('.links__items');
        listContainer.innerHTML = '';
    }

    // Clears out form fields when link is submitted
    static clearFields() {
        document.querySelector('.form__title-input').value = '';
        document.querySelector('.form__url-input').value = '';
    }
}