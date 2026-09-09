let childcareCenters = [];
let filteredCenters = [];

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const countyFilter = document.getElementById("countyFilter");
const statusFilter = document.getElementById("statusFilter");
const typeFilter = document.getElementById("typeFilter");
const clearFiltersButton = document.getElementById("clearFilters");
const resultsCount = document.getElementById("resultsCount");
const resultsContainer = document.getElementById("resultsList");
const detailsPanel = document.getElementById("detailsPanel");


// ========================================
// LOAD REAL MINNESOTA DATA
// ========================================

Papa.parse("data/childcare.csv", {

    download: true,
    header: true,
    skipEmptyLines: true,

    complete: function(results) {

        childcareCenters = results.data
            .filter(row => row["Name of Program"])
            .map(row => ({

                licenseNumber: clean(row["License Number"]),
                licenseType: clean(row["License Type"]),

                name: clean(row["Name of Program"]),

                address: clean(row["AddressLine1"]),
                address2: clean(row["AddressLine2"]),
                city: clean(row["City"]),
                state: clean(row["State"]),
                zip: clean(row["Zip"]),
                county: clean(row["County"]),

                phone: clean(row["Phone"]),

                rawStatus: clean(row["License Status"]),

                licenseHolder: clean(row["License Holder"]),
                capacity: clean(row["Capacity"]),
                typeOfLicense: clean(row["Type Of License"]),
                restrictions: clean(row["Restrictions"]),
                services: clean(row["Services"]),
                licensingAuthority: clean(row["Licensing Authority"]),

                initialDate: clean(row["Initial Effective Date"]),
                currentDate: clean(row["Current Effective Date"]),
                expirationDate: clean(row["Expiration Date"]),

                livesOnsite: clean(row["License Holder Lives Onsite"]),
                email: clean(row["EmailAddress"])
            }));


        // Create a simplified status category
        childcareCenters.forEach(center => {
            center.status = getStatusCategory(center.rawStatus);
        });


        filteredCenters = [...childcareCenters];


        populateCountyFilter();
        populateStatusFilter();
        populateTypeFilter();

        renderResults();


        console.log(
            "Loaded childcare records:",
            childcareCenters.length
        );
    },


    error: function(error) {

        console.error(
            "Error loading childcare CSV:",
            error
        );

        resultsContainer.innerHTML = `
            <div class="empty-state">

                <h3>Unable to load childcare data</h3>

                <p>
                    Please make sure the childcare.csv file
                    is inside the data folder.
                </p>

            </div>
        `;
    }

});


// ========================================
// CLEAN DATA
// ========================================

function clean(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value).trim();
}


// ========================================
// CONVERT RAW STATUS INTO CATEGORY
// ========================================

function getStatusCategory(status) {

    const value = status.toLowerCase();

    if (value.startsWith("active")) {
        return "Active";
    }

    if (value.startsWith("conditional")) {
        return "Conditional";
    }

    if (value.startsWith("closed")) {
        return "Closed";
    }

    if (value.startsWith("pending reopening")) {
        return "Pending Reopening";
    }

    return "Other";
}


// ========================================
// COUNTY FILTER
// ========================================

function populateCountyFilter() {

    const counties = [
        ...new Set(

            childcareCenters
                .map(center => center.county)
                .filter(county => county !== "")

        )
    ].sort();


    countyFilter.innerHTML = `
        <option value="all">
            All Counties
        </option>
    `;


    counties.forEach(county => {

        const option =
            document.createElement("option");

        option.value = county;
        option.textContent = county;

        countyFilter.appendChild(option);

    });
}


// ========================================
// STATUS FILTER
// ========================================

function populateStatusFilter() {

    const statuses = [
        ...new Set(

            childcareCenters
                .map(center => center.status)
                .filter(status => status !== "")

        )
    ].sort();


    statusFilter.innerHTML = `
        <option value="all">
            All Statuses
        </option>
    `;


    statuses.forEach(status => {

        const option =
            document.createElement("option");

        option.value = status;
        option.textContent = status;

        statusFilter.appendChild(option);

    });
}


// ========================================
// PROGRAM TYPE FILTER
// ========================================

function populateTypeFilter() {

    const types = [
        ...new Set(

            childcareCenters
                .map(center => center.licenseType)
                .filter(type => type !== "")

        )
    ].sort();


    typeFilter.innerHTML = `
        <option value="all">
            All Types
        </option>
    `;


    types.forEach(type => {

        const option =
            document.createElement("option");

        option.value = type;
        option.textContent = type;

        typeFilter.appendChild(option);

    });
}


// ========================================
// APPLY FILTERS
// ========================================

function applyFilters() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedCounty =
        countyFilter.value;

    const selectedStatus =
        statusFilter.value;

    const selectedType =
        typeFilter.value;


    filteredCenters =
        childcareCenters.filter(center => {


            // Search
            const matchesSearch =

                searchTerm === "" ||

                center.name
                    .toLowerCase()
                    .includes(searchTerm) ||

                center.city
                    .toLowerCase()
                    .includes(searchTerm) ||

                center.county
                    .toLowerCase()
                    .includes(searchTerm) ||

                center.zip
                    .toLowerCase()
                    .includes(searchTerm);


            // County
            const matchesCounty =

                selectedCounty === "all" ||

                center.county === selectedCounty;


            // Status
            const matchesStatus =

                selectedStatus === "all" ||

                center.status === selectedStatus;


            // Type
            const matchesType =

                selectedType === "all" ||

                center.licenseType === selectedType;


            return (

                matchesSearch &&

                matchesCounty &&

                matchesStatus &&

                matchesType

            );

        });


    renderResults();
}


// ========================================
// DISPLAY RESULTS
// ========================================

function renderResults() {

    resultsCount.textContent =
        `${filteredCenters.length} childcare programs found`;


    resultsContainer.innerHTML = "";


    if (filteredCenters.length === 0) {

        resultsContainer.innerHTML = `

            <div class="empty-state">

                <h3>
                    No childcare programs found
                </h3>

                <p>
                    Try changing your search or filters.
                </p>

            </div>

        `;

        return;
    }


    filteredCenters.forEach(
        (center, index) => {

            const card =
                document.createElement("div");


            card.className =
                "result-card";


            card.innerHTML = `

                <div class="result-top">

                    <div>

                        <h3>
                            ${escapeHTML(center.name)}
                        </h3>

                        <p class="location">
                            ${escapeHTML(center.city)}, MN
                        </p>

                    </div>


                    <span class="status ${getStatusClass(center.status)}">

                        ${escapeHTML(center.status)}

                    </span>

                </div>


                <div class="result-info">

                    <span class="info-tag">
                        ${escapeHTML(center.county)}
                    </span>

                    <span class="info-tag">
                        ZIP ${escapeHTML(center.zip)}
                    </span>

                    <span class="info-tag">
                        ${escapeHTML(center.licenseType)}
                    </span>

                </div>

            `;


            card.addEventListener(
                "click",
                function() {

                    showDetails(index);

                }
            );


            resultsContainer.appendChild(card);

        }
    );
}


// ========================================
// SHOW DETAILS
// ========================================

function showDetails(index) {

    const center =
        filteredCenters[index];


    if (!center) {
        return;
    }


    detailsPanel.innerHTML = `

        <div class="details-content">

            <h2>
                ${escapeHTML(center.name)}
            </h2>


            <span class="status ${getStatusClass(center.status)} details-status">

                ${escapeHTML(center.status)}

            </span>


            <div class="detail-section">

                <h4>Location</h4>

                <p>
                    ${escapeHTML(center.address || "Not available")}
                </p>

                <p>
                    ${escapeHTML(center.city)}, 
                    ${escapeHTML(center.state)}
                    ${escapeHTML(center.zip)}
                </p>

                <p>
                    ${escapeHTML(center.county)} County
                </p>

            </div>


            <div class="detail-section">

                <h4>License Information</h4>

                <p>
                    <strong>License Number:</strong>
                    ${escapeHTML(center.licenseNumber || "Not available")}
                </p>

                <p>
                    <strong>License Type:</strong>
                    ${escapeHTML(center.licenseType || "Not available")}
                </p>

                <p>
                    <strong>License Holder:</strong>
                    ${escapeHTML(center.licenseHolder || "Not available")}
                </p>

                <p>
                    <strong>Capacity:</strong>
                    ${escapeHTML(center.capacity || "Not available")}
                </p>

            </div>


            <div class="detail-section">

                <h4>Services</h4>

                <p>
                    ${escapeHTML(center.typeOfLicense || "Not available")}
                </p>

                <p>
                    ${escapeHTML(center.services || "Not available")}
                </p>

            </div>


            <div class="detail-section">

                <h4>License Dates</h4>

                <p>
                    <strong>Initial:</strong>
                    ${escapeHTML(center.initialDate || "Not available")}
                </p>

                <p>
                    <strong>Current:</strong>
                    ${escapeHTML(center.currentDate || "Not available")}
                </p>

                <p>
                    <strong>Expiration:</strong>
                    ${escapeHTML(center.expirationDate || "Not available")}
                </p>

            </div>


            <div class="detail-section">

                <h4>Contact</h4>

                <p>
                    <strong>Phone:</strong>
                    ${escapeHTML(center.phone || "Not available")}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${escapeHTML(center.email || "Not available")}
                </p>

            </div>

        </div>

    `;
}


// ========================================
// STATUS CSS CLASS
// ========================================

function getStatusClass(status) {

    const value =
        status.toLowerCase();


    if (value === "active") {
        return "active";
    }

    if (value === "conditional") {
        return "conditional";
    }

    if (value === "closed") {
        return "closed";
    }

    return "";
}


// ========================================
// CLEAR FILTERS
// ========================================

clearFiltersButton.addEventListener(
    "click",
    function() {

        searchInput.value = "";

        countyFilter.value = "all";

        statusFilter.value = "all";

        typeFilter.value = "all";


        filteredCenters =
            [...childcareCenters];


        renderResults();


        detailsPanel.innerHTML = `

            <div class="details-placeholder">

                <div class="placeholder-icon">
                    +
                </div>

                <h3>
                    Select a childcare program
                </h3>

                <p>
                    Click on a result to view more
                    information about the program.
                </p>

            </div>

        `;

    }
);


// ========================================
// SEARCH AND FILTER EVENTS
// ========================================

searchInput.addEventListener(
    "input",
    applyFilters
);


searchButton.addEventListener(
    "click",
    applyFilters
);


countyFilter.addEventListener(
    "change",
    applyFilters
);


statusFilter.addEventListener(
    "change",
    applyFilters
);


typeFilter.addEventListener(
    "change",
    applyFilters
);


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}
