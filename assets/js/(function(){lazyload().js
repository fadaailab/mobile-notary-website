let qsRegex;
let buttonFilters = {};
let buttonFilter;
const elem = document.querySelector('.isotope-grid');
const iso = elem && new Isotope(elem, {
    itemSelector: '.isotope-grid-item',
    layoutMode: 'fitRows',
    fitRows: {
        equalheight: true
    },
    filter: function (elem) {
        let text1 = elem.querySelector('.addons-item-body')
        let text2 = elem.querySelector('.price-free')
        let textResult = text2 ? text1.textContent + text2.textContent : text1.textContent
        let searchResult = qsRegex ? textResult.match(qsRegex) : true
        let buttonResult = buttonFilter ? elem.matches(buttonFilter) : true;
        return searchResult && buttonResult
    }
});
let filterFns = {
    search: function (elem) {
        let searchResult = qsRegex ? elem.querySelector('.addons-item-body').textContent.match(qsRegex) : true
        let buttonResult = buttonFilter ? elem.matches(buttonFilter) : true;
        return searchResult && buttonResult
    }
};
let filtersBtns = Array.from(document.querySelectorAll('.filters-button-group button'))
filtersBtns && filtersBtns.forEach((filtersBtn) => {
    filtersBtn.addEventListener('click', () => {
        if (!filtersBtn.classList.contains('primary')) {
            document.querySelector('.filters-button-group button.primary').classList.remove('primary')
            filtersBtn.classList.add('primary')
            let filterGroup = filtersBtn.closest('.filters-button-group').getAttribute('data-filter-group')

            s[filterGroup] = filtersBtn.getAttribute('data-filter')
            buttonFilter = concatValues(buttonFilters);
            iso.arrange()
        }
    });
})
