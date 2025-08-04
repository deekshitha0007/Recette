document.addEventListener('DOMContentLoaded', function() {
    
    const searchInputs = document.querySelectorAll('.searchBox, #Searchbar input');
    
    // Add event listeners to all search inputs
    searchInputs.forEach(input => {
        // Keyup event with debounce for live search
        input.addEventListener('keyup', function(e) {
            // If Enter key is pressed or for live search
            if (e.key === 'Enter' || e.key === undefined) {
                searchRecipes(this.value);
            }
        });
        
        // Click event for search buttons
        const form = input.closest('form');
        if (form) {
            const button = form.querySelector('button');
            if (button) {
                button.addEventListener('click', function() {
                    searchRecipes(input.value);
                });
            }
        }
    });

    // Main search function
    function searchRecipes(searchTerm) {
        searchTerm = searchTerm.trim().toLowerCase();
        const allDishes = document.querySelectorAll('#MainBody [class^="dish"]');
        let foundResults = false;

        // If search is empty, show all dishes and return
        if (searchTerm === '') {
            allDishes.forEach(dish => {
                dish.style.display = 'block';
                dish.closest('div[id]').style.display = 'block'; // Show parent category
            });
            removeNoResultsMessage();
            return;
        }

        // Search through dishes
        allDishes.forEach(dish => {
            const dishName = dish.querySelector('a:not([href=""])').textContent.toLowerCase();
            const parentCategory = dish.closest('div[id]');
            
            if (dishName.includes(searchTerm)) {
                dish.style.display = 'block';
                parentCategory.style.display = 'block'; // Show parent category
                foundResults = true;
            } else {
                dish.style.display = 'none';
                // Don't hide parent category yet - we'll handle this after checking all dishes
            }
        });

        // Hide empty categories
        document.querySelectorAll('#MainBody > div[id]').forEach(category => {
            const hasVisibleDishes = Array.from(category.querySelectorAll('[class^="dish"]'))
                .some(dish => dish.style.display !== 'none');
            
            category.style.display = hasVisibleDishes ? 'block' : 'none';
        });

        // Show message if no results found
        if (!foundResults) {
            showNoResultsMessage(searchTerm);
        } else {
            removeNoResultsMessage();
        }
    }

    function showNoResultsMessage(searchTerm) {
        removeNoResultsMessage(); // Remove existing message if any
        
        const message = document.createElement('div');
        message.id = 'noResultsMessage';
        message.textContent = `No recipes found for "${searchTerm}"`;
        message.style.textAlign = 'center';
        message.style.padding = '20px';
        message.style.fontSize = '18px';
        message.style.color = '#666';
        message.style.margin = '20px 0';
        
        // Insert message after the search bar
        const searchContainer = document.querySelector('#Searchbar') || document.querySelector('form');
        searchContainer.insertAdjacentElement('afterend', message);
    }

    function removeNoResultsMessage() {
        const existingMessage = document.getElementById('noResultsMessage');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
});