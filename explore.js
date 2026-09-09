/* ==========================================
   MN CHILDCARE EXPLORER
   PART 2 - EXPLORE PAGE
========================================== */


/* ==========================================
   DEMO DATA

   This is temporary data.

   Later we will replace this with the
   actual Minnesota childcare dataset.
========================================== */

const childcareData = [

    {
        id: 1,
        name: "Example Early Learning Center",
        city: "St. Cloud",
        county: "Stearns",
        zip: "56301",
        status: "Active",
        type: "Child Care Center",
        license: "DEMO-001",
        address: "Example Address, St. Cloud, MN",
        description: "Demo childcare program used for testing the Minnesota Childcare Explorer."
    },

    {
        id: 2,
        name: "North Star Childcare Demo",
        city: "Minneapolis",
        county: "Hennepin",
        zip: "55401",
        status: "Active",
        type: "Child Care Center",
        license: "DEMO-002",
        address: "Example Address, Minneapolis, MN",
        description: "Demo childcare program used for testing the search and filtering system."
    },

    {
        id: 3,
        name: "Prairie Kids Demo Center",
        city: "Rochester",
        county: "Olmsted",
        zip: "55901",
        status: "Active",
        type: "Preschool",
        license: "DEMO-003",
        address: "Example Address, Rochester, MN",
        description: "Demo preschool program for the Minnesota Childcare Explorer project."
    },

    {
        id: 4,
        name: "Lakeside Demo Childcare",
        city: "Duluth",
        county: "St. Louis",
        zip: "55802",
        status: "Conditional",
        type: "Child Care Center",
        license: "DEMO-004",
        address: "Example Address, Duluth, MN",
        description: "Demo childcare center with a conditional license status."
    },

    {
        id: 5,
        name: "River Valley Demo Center",
        city: "Mankato",
        county: "Blue Earth",
        zip: "56001",
        status: "Closed",
        type: "Child Care Center",
        license: "DEMO-005",
        address: "Example Address, Mankato, MN",
        description: "Demo program used to test closed license filtering."
    },

    {
        id: 6,
        name: "Central Minnesota Demo Preschool",
        city: "Sartell",
        county: "Stearns",
        zip: "56377",
        status: "Active",
        type: "Preschool",
        license: "DEMO-006",
        address: "Example Address, Sartell, MN",
        description: "Demo preschool program located in Central Minnesota."
    },

    {
        id: 7,
        name: "Twin Cities Demo Childcare",
        city: "St. Paul",
        county: "Ramsey",
        zip: "55101",
        status: "Active",
        type: "Family Child Care",
        license: "DEMO-007",
        address: "Example Address, St. Paul, MN",
        description: "Demo family childcare program used for testing."
    },

    {
        id: 8,
        name: "South Metro Demo Learning Center",
        city: "Burnsville",
        county: "Dakota",
        zip: "55337",
        status: "Active",
        type: "Child Care Center",
        license: "DEMO-008",
        address: "Example Address, Burnsville, MN",
        description: "Demo childcare center used for testing filters."
    },

    {
        id: 9,
        name: "Lakes Country Demo Preschool",
        city: "Brainerd",
        county: "Crow Wing",
        zip: "56401",
        status: "Active",
        type: "Preschool",
        license: "DEMO-009",
        address: "Example Address, Brainerd, MN",
        description: "Demo preschool program."
    },

    {
        id: 10,
        name: "Northland Demo Family Childcare",
        city: "Grand Rapids",
        county: "Itasca",
        zip: "55744",
        status: "Conditional",
        type: "Family Child Care",
        license: "DEMO-010",
        address: "Example Address, Grand Rapids, MN",
        description: "Demo family childcare program with conditional status."
    }

];


/* ==========================================
   GET HTML ELEMENTS
========================================== */

const searchInput = document.getElementById("searchInput");

const searchButton = document.getElementById("searchButton");

const countyFilter = document.getElementById("countyFilter");

const statusFilter = document.getElementById("statusFilter");

const typeFilter = document.getElementById("typeFilter");

const clearFilters = document.getElementById("clearFilters");

const resultsList = document.getElementById("resultsList");

const resultsCount = document.getElementById("resultsCount");

const detailsPanel = document.getElementById("detailsPanel");


/* ==========================================
   CREATE COUNTY FILTER OPTIONS
========================================== */

function populateCountyFilter() {

    const counties = childcareData
        .map(program => program.county)
        .filter((county, index, array) => {
            return array.indexOf(county) === index;
        })
        .sort();

    counties.forEach(county => {

        const option = document.createElement("option");

        option.value = county;

        option.textContent = county + " County";

        countyFilter.appendChild(option);

    });

}


/* ==========================================
   FILTER DATA
========================================== */

function getFilteredData() {

    const searchTerm = searchInput.value
        .toLowerCase()
        .trim();

    const selectedCounty = countyFilter.value;

    const selectedStatus = statusFilter.value;

    const selectedType = typeFilter.value;


    return childcareData.filter(program => {

        const matchesSearch =

            program.name.toLowerCase().includes(searchTerm) ||

            program.city.toLowerCase().includes(searchTerm) ||

            program.county.toLowerCase().includes(searchTerm) ||

            program.zip.includes(searchTerm);


        const matchesCounty =
            selectedCounty === "all" ||
            program.county === selectedCounty;


        const matchesStatus =
            selectedStatus === "all" ||
            program.status === selectedStatus;


        const matchesType =
            selectedType === "all" ||
            program.type === selectedType;


        return (
            matchesSearch &&
            matchesCounty &&
            matchesStatus &&
            matchesType
        );

    });

}


/* ==========================================
   DISPLAY RESULTS
========================================== */

function renderResults() {

    const filteredData = getFilteredData();


    /* Update result count */

    resultsCount.textContent =
        `Showing ${filteredData.length} result${filteredData.length === 1 ? "" : "s"}`;


    /* Clear previous results */

    resultsList.innerHTML = "";


    /* Empty state */

    if (filteredData.length === 0) {

        resultsList.innerHTML = `

            <div class="empty-state">

                <h3>No childcare programs found</h3>

                <p>
                    Try changing your search or clearing some filters.
                </p>

            </div>

        `;

        return;
    }


    /* Create cards */

    filteredData.forEach(program => {

        const card = document.createElement("article");

        card.className = "result-card";

        card.dataset.id = program.id;


        card.innerHTML = `

            <div class="result-top">

                <div>

                    <h3>${program.name}</h3>

                    <p class="location">
                        ${program.city}, MN
                    </p>

                </div>

                <span class="status ${program.status.toLowerCase()}">
                    ${program.status}
                </span>

            </div>


            <div class="result-info">

                <span class="info-tag">
                    ${program.county} County
                </span>

                <span class="info-tag">
                    ${program.zip}
                </span>

                <span class="info-tag">
                    ${program.type}
                </span>

            </div>

        `;


        card.addEventListener("click", function () {

            showDetails(program);

            document
                .querySelectorAll(".result-card")
                .forEach(item => {
                    item.classList.remove("selected");
                });

            card.classList.add("selected");

        });


        resultsList.appendChild(card);

    });

}


/* ==========================================
   SHOW DETAILS
========================================== */

function showDetails(program) {

    detailsPanel.innerHTML = `

        <div class="details-content">

            <h2>
                ${program.name}
            </h2>


            <span class="status ${program.status.toLowerCase()} details-status">
                ${program.status}
            </span>


            <div class="detail-section">

                <h4>Location</h4>

                <p>
                    ${program.address}
                </p>

            </div>


            <div class="detail-section">

                <h4>County</h4>

                <p>
                    ${program.county} County
                </p>

            </div>


            <div class="detail-section">

                <h4>ZIP Code</h4>

                <p>
                    ${program.zip}
                </p>

            </div>


            <div class="detail-section">

                <h4>Program Type</h4>

                <p>
                    ${program.type}
                </p>

            </div>


            <div class="detail-section">

                <h4>License Number</h4>

                <p>
                    ${program.license}
                </p>

            </div>


            <div class="detail-section">

                <h4>About</h4>

                <p>
                    ${program.description}
                </p>

            </div>

        </div>

    `;

}


/* ==========================================
   SEARCH BUTTON
========================================== */

searchButton.addEventListener("click", function () {

    renderResults();

});


/* ==========================================
   SEARCH WHEN PRESSING ENTER
========================================== */

searchInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        renderResults();

    }

});


/* ==========================================
   FILTER EVENTS
========================================== */

countyFilter.addEventListener("change", function () {

    renderResults();

});


statusFilter.addEventListener("change", function () {

    renderResults();

});


typeFilter.addEventListener("change", function () {

    renderResults();

});


/* ==========================================
   CLEAR FILTERS
========================================== */

clearFilters.addEventListener("click", function () {

    searchInput.value = "";

    countyFilter.value = "all";

    statusFilter.value = "all";

    typeFilter.value = "all";


    detailsPanel.innerHTML = `

        <div class="details-placeholder">

            <div class="placeholder-icon">
                +
            </div>

            <h3>Select a childcare program</h3>

            <p>
                Click on a result to view more information
                about the program.
            </p>

        </div>

    `;


    renderResults();

});


/* ==========================================
   INITIALIZE PAGE
========================================== */

populateCountyFilter();

renderResults();
