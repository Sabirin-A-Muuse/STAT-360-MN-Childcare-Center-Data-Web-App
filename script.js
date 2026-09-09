/* =================================
   Minnesota Childcare Explorer
   Part 4 - Real Dataset
================================= */


/* =================================
   LOAD REAL MINNESOTA DATA
================================= */

Papa.parse("data/childcare.csv", {

    download: true,

    header: true,

    skipEmptyLines: true,

    complete: function(results) {

        const childcareCenters = results.data.filter(
            row => row["Name of Program"]
        );


        /* -----------------------------
           Calculate Statistics
        ----------------------------- */

        const centerCount =
            childcareCenters.length;


        const counties = new Set(
            childcareCenters
                .map(row => clean(row["County"]))
                .filter(county => county !== "")
        );


        const cities = new Set(
            childcareCenters
                .map(row => clean(row["City"]))
                .filter(city => city !== "")
        );


        /* -----------------------------
           Display Statistics
        ----------------------------- */

        document.getElementById("centerCount").textContent =
            centerCount.toLocaleString();


        document.getElementById("countyCount").textContent =
            counties.size.toLocaleString();


        document.getElementById("cityCount").textContent =
            cities.size.toLocaleString();


        console.log(
            "Loaded childcare centers:",
            centerCount
        );

        console.log(
            "Minnesota counties:",
            counties.size
        );

        console.log(
            "Minnesota cities:",
            cities.size
        );

    },


    error: function(error) {

        console.error(
            "Error loading childcare CSV:",
            error
        );

        document.getElementById("centerCount").textContent =
            "—";

        document.getElementById("countyCount").textContent =
            "—";

        document.getElementById("cityCount").textContent =
            "—";

    }

});


/* =================================
   CLEAN DATA
================================= */

function clean(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value).trim();

}


/* =================================
   HOMEPAGE SEARCH
================================= */

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const searchMessage =
    document.getElementById("searchMessage");


function performSearch() {

    const searchValue =
        searchInput.value.trim();


    if (searchValue === "") {

        searchMessage.textContent =
            "Enter a city, county, or ZIP code to search.";

        return;

    }


    /*
       Send the user to the Explore page
       with their search term.
    */

    window.location.href =
        `explore.html?search=${encodeURIComponent(searchValue)}`;

}


/* Search button */

searchButton.addEventListener(
    "click",
    performSearch
);


/* Search with Enter */

searchInput.addEventListener(
    "keypress",
    function(event) {

        if (event.key === "Enter") {

            performSearch();

        }

    }
);
