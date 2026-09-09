```javascript
/* =================================
   Minnesota Childcare Explorer
   Part 1 - Main Page
================================= */


/* ---------------------------------
   Temporary Statistics
   ---------------------------------

   These are intentionally left blank
   until we connect the real Minnesota
   childcare dataset.

--------------------------------- */

const statistics = {
    centers: "—",
    counties: "—",
    cities: "—"
};


/* Display statistics */

document.getElementById("centerCount").textContent =
    statistics.centers;

document.getElementById("countyCount").textContent =
    statistics.counties;

document.getElementById("cityCount").textContent =
    statistics.cities;


/* =================================
   Search
================================= */

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchMessage = document.getElementById("searchMessage");


function performSearch() {

    const searchValue = searchInput.value.trim();

    if (searchValue === "") {

        searchMessage.textContent =
            "Enter a city, county, or ZIP code to search.";

        return;
    }


    searchMessage.textContent =
        `Searching for "${searchValue}"...`;


    /*
        Later, this will connect to the
        childcare data and show matching
        childcare centers.

        For now, it simply demonstrates
        that the search box is working.
    */

    setTimeout(function () {

        searchMessage.textContent =
            "The childcare search feature will be available when the Minnesota dataset is connected.";

    }, 700);
}


/* Search button */

searchButton.addEventListener("click", performSearch);


/* Search when pressing Enter */

searchInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {

        performSearch();

    }

});


/* =================================
   Explore Button
================================= */

const exploreButton =
    document.getElementById("exploreButton");


exploreButton.addEventListener("click", function() {

    /*
        The Explore page will be created
        in a later part of the project.
    */

    document.getElementById("explore").scrollIntoView({
        behavior: "smooth"
    });

});
```
