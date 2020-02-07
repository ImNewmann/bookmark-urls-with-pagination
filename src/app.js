import UI from './ui';
import Links from './links';
import Store from './storage';
import Validation from './validation';

const form = document.querySelector('.form');
const linkContainer = document.querySelector('.links__items');
const paginationLinks = document.querySelector('.pagination');
const backBtn = document.querySelector('.back-btn')
const resultsSection = document.querySelector('.result')

let state = {
    linksToShow: 10,
    links: Store.getLinks().length,
    currentPage: 1,
    totalPages: UI.getPages(),
}

// Event: Display Links
document.addEventListener('DOMContentLoaded', () => {
    // Show first 20 links if there are more than 20 
    if (state.links > state.linksToShow) {
        UI.displayLinks(0, state.linksToShow); 

        // Show pagination and pass number of pages needed as argument
        UI.updatePaginationLinks(state.totalPages, state.currentPage);
        UI.showPagination();

    // Show remaining links if there aren't over 20
    } else {
        UI.displayLinks(0, state.links);
    }
});

// Event: Add Links
form.addEventListener('submit', e => {
    e.preventDefault();
    // Get form values
    const title = document.querySelector('.form__title-input').value;
    const url = document.querySelector('.form__url-input').value;

    //Validate
    if (title === '' || url === '') {
        alert('Please fill in all fields');

    } else if (!Validation.urlExists(url)) {
        alert('Please enter a valid Url');

    } else {
        // Increase Counter
        state.links += 1;
        // Instantiate link
        const link = new Links(title, url, state.links);
        // Add Link to Store
        Store.addLink(link);
        // Update total pages to show
        state.totalPages = UI.getPages();
        
        // Add Link to UI:
        if (state.links <= state.linksToShow || (state.links <= UI.getNextLinks(state.currentPage, state.linksToShow).startPost)) {
            UI.addLinkToList(link);
        } else if (state.links === state.linksToShow + 1) {
            UI.updatePaginationLinks(state.totalPages, state.currentPage);
            UI.showPagination();
        } else {
            UI.updatePaginationLinks(state.totalPages, state.currentPage);
        }

        //Clear fields
        UI.clearFields();

        //Show Results
        UI.showResult('Thank you for adding a link', link);
    }
})

linkContainer.addEventListener('click', e => {
    // Event: Remove Links
    if (e.target.classList.contains('delete')) {
        // Decrease Counter
        state.links -= 1;
        // Remove Link from UI
        UI.deleteLink(e.target.parentElement.parentElement.parentElement);
        // Remove Link from Store
        Store.removeLink(e.target.parentElement.parentElement.firstElementChild.dataset.id);
        // Decrease pages
        state.totalPages = UI.getPages();
        
        //if page is empty go back a page and update pagination
        if (state.links % state.linksToShow === 0 && state.links !== 0) {
            const prevLinks = UI.getPrevLinks(state.currentPage, state.linksToShow);
            state.currentPage--;
            UI.updatePaginationLinks(state.totalPages, state.currentPage);
            UI.updatePosts(prevLinks.startPost, prevLinks.endPost, state.linksToShow, state.currentPage);
        } else if (state.links === 0) {
            UI.hidePagination();
        }
    
        // Event: Edit Links
    } else if (e.target.classList.contains('edit') || e.target.classList.contains('submit')) {
        UI.editLink(e.target);
    }
})

// Event: Pagination Links
paginationLinks.addEventListener('click', e => {
    // Shows the next 20 links
    if (e.target.classList.contains('next') || e.target.parentElement.classList.contains('next')) {
        const nextLinks = UI.getNextLinks(state.currentPage, state.linksToShow)

        // Shows next posts if there are posts remaining
        if (nextLinks.startPost < state.links) {
            state.currentPage++;
            UI.updatePosts(nextLinks.startPost, nextLinks.endPost, state.linksToShow, state.currentPage);
        }
    
    // Shows previous 20 links
    } else if (e.target.classList.contains('prev') || e.target.parentElement.classList.contains('prev')) {
        const prevLinks = UI.getPrevLinks(state.currentPage, state.linksToShow);
        
        // Shows previous links if there are more links to go back to.
        if (prevLinks.endPost >= state.linksToShow) {
            state.currentPage--;

            UI.updatePosts(prevLinks.startPost, prevLinks.endPost, state.linksToShow, state.currentPage);
        }
    }
})

// Handles returning back to list from results section
backBtn.addEventListener('click', () => {
    resultsSection.style.display = 'none'
    resultsSection.querySelector('.result__message').remove()
})