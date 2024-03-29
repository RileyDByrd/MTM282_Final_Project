function makeBarChart(rawBarChartData, barNum, barColor, title, labels) {
    console.log(rawBarChartData);
    var canvas = document.getElementById("canvas" + barNum);
    var ctx = canvas.getContext("2d");
    var color = Chart.helpers.color;
    window.chartColors = {
        blue: "rgb(54, 162, 235)",
        green: "rgb(42, 133, 46)",
        grey: "rgb(201, 203, 207)",
        orange: "rgb(255, 159, 64)",
        purple: "rgb(69, 37, 133)",
        red: "rgb(232, 30, 30)",
        yellow: "rgb(255, 205, 86)"
    };

    window["bar" + barNum] = new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                // label: "Votes",
                backgroundColor: color(window.chartColors[barColor]).alpha(0.5).rgbString(),
                borderColor: window.chartColors[barColor],
                borderWidth: 1,
                barThickness: "60",
                data: [
                    rawBarChartData["1"],
                    rawBarChartData["2"],
                    rawBarChartData["3"],
                    rawBarChartData["4"]
                ]
            }]
        },
        options: {
            legend: {
                position: "top",
                display: false
            },
            title: {
                display: true,
                text: title
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontSize: 14
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontSize: 14
                    }
                }]
            }
        }
    });

    // canvas.style.width = 500;
    // canvas.style.height = 400;
    canvas.parentNode.style.width = "400px";
    canvas.parentNode.style.height = "400px";
}

function makeIdeChart(ideData) {
    makeBarChart(ideData, 1, "purple", "IDE Preference", ["Eclipse", "VS Code", "Visual Studio", "Notepad/Notepad++"]);
}

function makeLanguageChart(languageData) {
    makeBarChart(languageData, 2, "green", "Language Preference", ["Python", "C#", "Java", "English"]);
}

function makeThemeChart(themeData) {
    makeBarChart(themeData, 3, "blue", "Theme Preference", ["Light", "Dark", "Custom", "Just Black"]);
}