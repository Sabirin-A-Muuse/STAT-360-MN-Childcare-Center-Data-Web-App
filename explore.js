let childcareCenters = [];
let filteredCenters = [];

const searchInput = document.getElementById("searchInput");
const countyFilter = document.getElementById("countyFilter");
const statusFilter = document.getElementById("statusFilter");
const typeFilter = document.getElementById("typeFilter");
const clearFiltersButton = document.getElementById("clearFilters");
const resultsCount = document.getElementById("resultsCount");
const resultsContainer = document.getElementById("resultsContainer");
const detailsPanel = document.getElementById("detailsPanel");


// ----------------------------------------
// LOAD REAL MINNESOTA DATA
// ----------------------------------------

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
                status: clean(row["License Status"]),
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

        filteredCenters = [...childcareCenters];

        populateCountyFilter();
        renderResults();

        console.log("Loaded childcare records:", childcareCenters.length);
    },

    error: function(error) {
        console.error("Error loading childcare CSV:", error);

        resultsContainer.innerHTML = `
            <div class="no-results">
                <h3>Unable to load childcare data</h3>
                <p>
                    Please make sure the childcare.csv file is located
                    inside the data folder.
                </p>
            </div>
        `;
    }
});


// ----------------------------------------
// CLEAN DATA
// ----------------------------------------

function clean(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value).trim();
}


// ----------------------------------------
// POPULATE COUNTY DROPDOWN
// ----------------------------------------

function populateCountyFilter() {

    const counties = [
        ...new Set(
            childcareCenters
                .map(center => center.county)
                .filter(county => county !== "")
        )
    ].sort();

    countyFilter.innerHTML = `
        <option value="">All Counties</option>
    `;

    counties.forEach(county => {

        const option = document.createElement("option");

        option.value = county;
        option.textContent = county;

        countyFilter.appendChild(option);
    });
}


// ----------------------------------------
// APPLY FILTERS
// ----------------------------------------

function applyFilters() {

    const searchTerm = searchInput.value
        .toLowerCase()
        .trim();

    const selectedCounty = countyFilter.value;
    const selectedStatus = statusFilter.value;
    const selectedType = typeFilter.value;

    filteredCenters = childcareCenters.filter(center => {

        const matchesSearch =
            searchTerm === "" ||
            center.name.toLowerCase().includes(searchTerm) ||
            center.city.toLowerCase().includes(searchTerm) ||
            center.county.toLowerCase().includes(searchTerm) ||
            center.zip.toLowerCase().includes(searchTerm);

        const matchesCounty =
            selectedCounty === "" ||
            center.county === selectedCounty;

        const matchesStatus =
            selectedStatus === "" ||
            center.status === selectedStatus;

        const matchesType =
            selectedType === "" ||
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


// ----------------------------------------
// RENDER RESULTS
// ----------------------------------------

function renderResults() {

    resultsCount.textContent =
        `${filteredCenters.length} childcare programs found`;

    resultsContainer.innerHTML = "";

    if (filteredCenters.length === 0) {

        resultsContainer.innerHTML = `
            <div class="no-results">
                <h3>No childcare programs found</h3>
                <p>
                    Try changing your search or filters.
                </p>
            </div>
        `;

        return;
    }

    filteredCenters.forEach((center, index) => {

        const card = document.createElement("div");

        card.className = "result-card";

        card.innerHTML = `
            <div class="result-card-header">

                <h3>${escapeHTML(center.name)}</h3>

                <span class="status-badge ${getStatusClass(center.status)}">
                    ${escapeHTML(center.status || "Unknown")}
                </span>

            </div>

            <p class="result-location">
                ${escapeHTML(center.city)}, MN
            </p>

            <p>
                <strong>County:</strong>
                ${escapeHTML(center.county || "Not available")}
            </p>

            <p>
                <strong>ZIP:</strong>
                ${escapeHTML(center.zip || "Not available")}
            </p>

            <p>
                <strong>License Type:</strong>
                ${escapeHTML(center.licenseType || "Not available")}
            </p>

            <button
                class="details-button"
                onclick="showDetails(${index})">
                View Details
            </button>
        `;

        resultsContainer.appendChild(card);
    });
}


// ----------------------------------------
// SHOW DETAILS
// ----------------------------------------

function showDetails(index) {

    const center = filteredCenters[index];

    if (!center) {
        return;
    }

    detailsPanel.innerHTML = `

        <div class="details-header">

            <h2>${escapeHTML(center.name)}</h2>

            <span class="status-badge ${getStatusClass(center.status)}">
                ${escapeHTML(center.status || "Unknown")}
            </span>

        </div>

        <div class="detail-section">

            <h3>Location</h3>

            <p>
                <strong>Address:</strong>
                ${escapeHTML(center.address || "Not available")}
            </p>

            <p>
                <strong>City:</strong>
                ${escapeHTML(center.city || "Not available")}
            </p>

            <p>
                <strong>County:</strong>
                ${escapeHTML(center.county || "Not available")}
            </p>

            <p>
                <strong>ZIP:</strong>
                ${escapeHTML(center.zip || "Not available")}
            </p>

        </div>


        <div class="detail-section">

            <h3>License Information</h3>

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

            <p>
                <strong>Services:</strong>
                ${escapeHTML(center.services || "Not available")}
            </p>

        </div>


        <div class="detail-section">

            <h3>License Dates</h3>

            <p>
                <strong>Initial Effective Date:</strong>
                ${escapeHTML(center.initialDate || "Not available")}
            </p>

            <p>
                <strong>Current Effective Date:</strong>
                ${escapeHTML(center.currentDate || "Not available")}
            </p>

            <p>
                <strong>Expiration Date:</strong>
                ${escapeHTML(center.expirationDate || "Not available")}
            </p>

        </div>


        <div class="detail-section">

            <h3>Contact</h3>

            <p>
                <strong>Phone:</strong>
                ${escapeHTML(center.phone || "Not available")}
            </p>

            <p>
                <strong>Email:</strong>
                ${escapeHTML(center.email || "Not available")}
            </p>

        </div>

    `;
}


// ----------------------------------------
// STATUS COLORS
// ----------------------------------------

function getStatusClass(status) {

    const value = status.toLowerCase();

    if (value === "active") {
        return "status-active";
    }

    if (value === "conditional") {
        return "status-conditional";
    }

    if (value === "closed") {
        return "status-closed";
    }

    return "";
}


// ----------------------------------------
// CLEAR FILTERS
// ----------------------------------------

clearFiltersButton.addEventListener("click", function() {

    searchInput.value = "";
    countyFilter.value = "";
    statusFilter.value = "";
    typeFilter.value = "";

    filteredCenters = [...childcareCenters];

    renderResults();

    detailsPanel.innerHTML = `
        <div class="details-placeholder">
            <h2>Select a childcare program</h2>
            <p>
                Click "View Details" on a program to see
                additional licensing information.
            </p>
        </div>
    `;
});


// ----------------------------------------
// FILTER EVENT LISTENERS
// ----------------------------------------

searchInput.addEventListener("input", applyFilters);

countyFilter.addEventListener("change", applyFilters);

statusFilter.addEventListener("change", applyFilters);

typeFilter.addEventListener("change", applyFilters);


// ----------------------------------------
// ESCAPE HTML
// ----------------------------------------

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
