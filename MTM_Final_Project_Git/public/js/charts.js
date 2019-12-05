window.onload = function() {
    var ctx = document.getElementById("canvas").getContext("2d");
    window.bar1 = new Chart(ctx, {
        type: "bar",
        data: barChartData1,
        options: {
            responsive: true,
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Filler text 1"
            }
        }
    });
};