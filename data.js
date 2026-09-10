/* =================================
   MN CHILDCARE EXPLORER
   DATA DASHBOARD
================================= */


/* =================================
   LOAD DATA
================================= */

Papa.parse("data/childcare.csv", {

    download: true,

    header: true,

    skipEmptyLines: true,

    complete: function(results) {

        const centers = results.data.filter(
            row => clean(row["Name of Program"]) !== ""
        );


        /* =================================
           BASIC STATISTICS
        ================================= */

        const counties = new Set(
            centers
                .map(row => clean(row["County"]))
                .filter(value => value !== "")
        );


        const cities = new Set(
            centers
                .map(row => clean(row["City"]))
                .filter(value => value !== "")
        );


        const totalCapacity = centers.reduce(
            function(total, row) {

                const capacity =
                    parseFloat(row["Capacity"]);

                if (isNaN(capacity)) {
                    return total;
                }

                return total + capacity;

            },
            0
        );


        /* =================================
           DISPLAY SUMMARY
        ================================= */

        document.getElementById("totalCenters")
            .textContent =
            centers.length.toLocaleString();


        document.getElementById("totalCounties")
            .textContent =
            counties.size.toLocaleString();


        document.getElementById("totalCities")
            .textContent =
            cities.size.toLocaleString();


        document.getElementById("totalCapacity")
            .textContent =
            Math.round(totalCapacity)
                .toLocaleString();


        /* =================================
           CREATE CHART DATA
        ================================= */

        createCountyChart(centers);

        createStatusChart(centers);

        createCapacityChart(centers);
       
        createMinnesotaMap(centers);
    },


    error: function(error) {

        console.error(
            "Error loading childcare data:",
            error
        );

    }

});


/* =================================
   CLEAN VALUES
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
   COUNTY CHART
================================= */

function createCountyChart(centers) {

    const countyCounts = {};


    centers.forEach(function(center) {

        const county =
            clean(center["County"]);

        if (county === "") {
            return;
        }

        if (!countyCounts[county]) {
            countyCounts[county] = 0;
        }

        countyCounts[county]++;

    });


    const sortedCounties =
        Object.entries(countyCounts)
            .sort(function(a, b) {
                return b[1] - a[1];
            })
            .slice(0, 10);


    const labels =
        sortedCounties.map(item => item[0]);

    const values =
        sortedCounties.map(item => item[1]);


    new Chart(
        document.getElementById("countyChart"),
        {
            type: "bar",

            data: {
                labels: labels,

                datasets: [
                    {
                        label: "Childcare Centers",

                        data: values
                    }
                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        display: false
                    }
                },

                scales: {

                    y: {
                        beginAtZero: true
                    }

                }

            }

        }
    );

}


/* =================================
   STATUS CHART
================================= */

function createStatusChart(centers) {

    const statusCounts = {};


    centers.forEach(function(center) {

        const status =
            clean(center["License Status"]);

        if (status === "") {
            return;
        }

        if (!statusCounts[status]) {
            statusCounts[status] = 0;
        }

        statusCounts[status]++;

    });


    const labels =
        Object.keys(statusCounts);

    const values =
        Object.values(statusCounts);


    new Chart(
        document.getElementById("statusChart"),
        {
            type: "doughnut",

            data: {

                labels: labels,

                datasets: [
                    {
                        label: "License Status",

                        data: values
                    }
                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        position: "bottom"
                    }

                }

            }

        }
    );

}


/* =================================
   CAPACITY CHART
================================= */

function createCapacityChart(centers) {

    const countyCapacity = {};


    centers.forEach(function(center) {

        const county =
            clean(center["County"]);

        const capacity =
            parseFloat(center["Capacity"]);


        if (
            county === "" ||
            isNaN(capacity)
        ) {

            return;

        }


        if (!countyCapacity[county]) {
            countyCapacity[county] = 0;
        }

        countyCapacity[county] += capacity;

    });


    const sortedCapacity =
        Object.entries(countyCapacity)
            .sort(function(a, b) {
                return b[1] - a[1];
            })
            .slice(0, 10);


    const labels =
        sortedCapacity.map(item => item[0]);

    const values =
        sortedCapacity.map(item =>
            Math.round(item[1])
        );


    new Chart(
        document.getElementById("capacityChart"),
        {
            type: "bar",

            data: {

                labels: labels,

                datasets: [
                    {
                        label: "Licensed Capacity",

                        data: values
                    }
                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    y: {
                        beginAtZero: true
                    }

                }

            }

        }
   
    );

}
       /* =================================
            MINNESOTA COUNTY MAP
         ================================= */

function createMinnesotaMap(centers) {

    const countyCounts = {};


    /* -----------------------------
       Count centers by county
    ----------------------------- */

    centers.forEach(function(center) {

        const county =
            clean(center["County"]);

        if (county === "") {
            return;
        }

        if (!countyCounts[county]) {
            countyCounts[county] = 0;
        }

        countyCounts[county]++;

    });


    /* -----------------------------
       Create Leaflet map
    ----------------------------- */

    const map =
        L.map("mnMap", {

            zoomControl: true,

            scrollWheelZoom: false

        });


    /* Minnesota starting position */

    map.setView(
        [46.3, -94.3],
        6
    );


    /* -----------------------------
       Add map background
    ----------------------------- */

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                '&copy; OpenStreetMap contributors'
        }
    ).addTo(map);


    /* -----------------------------
       Load Minnesota counties
    ----------------------------- */

    fetch(
        "https://raw.githubusercontent.com/josephwarrick/geojson/master/minnesota.geojson"
    )

        .then(function(response) {

            return response.json();

        })

        .then(function(geojson) {

            L.geoJSON(
                geojson,
                {

                    style: function(feature) {

                        const countyName =
                            clean(
                                feature.properties.NAME ||
                                feature.properties.name ||
                                feature.properties.NAME10
                            );

                        const normalizedName =
                            countyName
                                .replace(
                                    / county$/i,
                                    ""
                                )
                                .trim();

                        const count =
                            countyCounts[normalizedName] || 0;


                        return {

                            fillColor:
                                getCountyColor(count),

                            weight: 1,

                            opacity: 1,

                            color: "#ffffff",

                            fillOpacity: 0.75

                        };

                    },


                    onEachFeature:
                        function(
                            feature,
                            layer
                        ) {

                            const countyName =
                                clean(
                                    feature.properties.NAME ||
                                    feature.properties.name ||
                                    feature.properties.NAME10
                                );


                            const normalizedName =
                                countyName
                                    .replace(
                                        / county$/i,
                                        ""
                                    )
                                    .trim();


                            const count =
                                countyCounts[
                                    normalizedName
                                ] || 0;


                            layer.bindTooltip(

                                `<strong>${normalizedName} County</strong><br>
                                 Childcare Centers: ${count}`,

                                {
                                    sticky: true
                                }

                            );


                            layer.on({

                                mouseover:
                                    function(event) {

                                        event.target.setStyle({

                                            weight: 2,

                                            color: "#111827",

                                            fillOpacity: 0.9

                                        });

                                    },


                                mouseout:
                                    function(event) {

                                        event.target.setStyle({

                                            weight: 1,

                                            color: "#ffffff",

                                            fillOpacity: 0.75

                                        });

                                    }

                            });

                        }

                }

            ).addTo(map);

        })

        .catch(function(error) {

            console.error(
                "Error loading Minnesota county map:",
                error
            );

        });

}


/* =================================
   MAP COLORS
================================= */

function getCountyColor(count) {

    if (count === 0) {
        return "#f3f4f6";
    }

    if (count <= 5) {
        return "#dbeafe";
    }

    if (count <= 20) {
        return "#93c5fd";
    }

    if (count <= 50) {
        return "#60a5fa";
    }

    if (count <= 100) {
        return "#3b82f6";
    }

    if (count <= 200) {
        return "#2563eb";
    }

    return "#1d4ed8";

}
