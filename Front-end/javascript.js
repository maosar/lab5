var chart;
var aspen_time = [];
var aspen_temp = [];
var chamonix_time = [];
var chamonix_temp = [];
//Array som håller nya värden för varje sensor ID (från serverEvent)
//isNew används för att inte lägga till samma observation 2 gånger
var live_data = {
    1: { "time": new Date, "temp": 0.0, "isNew": false },
    2: { "time": new Date, "temp": 0.0, "isNew": false }
};

$(document).ready(function () {
    LoadFile();
    LoadServerEvent();
});

function LoadServerEvent() {
   // evtSource = new EventSource("http://users.du.se/~h17maost/2018/TempLabb/index2.php?");
    evtSource = new EventSource("http://130.243.34.36/index2.php?");

    evtSource.onmessage = function (event) {
        data = JSON.parse(event.data);
        live_data[data[0].sensor_id] = { "time": new Date(data[0].obs_time), "temp": data[0].temp, "isNew": true };
    }
    evtSource.onerror = function (err) {
        console.error("EventSource failed:", err);
        console.error("Is trusted:", err.isTrusted);
    };
}

function LoadFile() {
    //var apiUrl = "http://users.du.se/~h17maost/2018/TempLabb/index1.php?Controller%get_obs%";
    var apiUrl = "http://130.243.34.36/index1.php?Controller%get_obs%";
    fetch(apiUrl)
        .then(function (response) {
            console.log(response);
            response.json()
                .then(function (data) {
                    //Fyller våra arrayer med data (API returnerar 100 senaste)
                    data.forEach(function (item, index, array) {
                        if (item.sensor_id == 1) {
                            aspen_time.push(item.obs_time);
                            aspen_temp.push(parseFloat(item.temp));
                        } else {
                            chamonix_time.push(item.obs_time);
                            chamonix_temp.push(parseFloat(item.temp));
                        }

                    });
                    //Körs här för att garantera att det finns data att visa 
                    ShowChart();
                }).catch(error => console.log('Error json():', error));
        }).catch(error => console.log('Error response: ', error));
}

function ShowChart() {
    //Anrop till Highcharts konstruktor 
    Highcharts.chart('container', {
        chart: {
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                //Körs när Highchart har laddats klart
                load: function () {

                    var series1 = this.series[0];
                    var series2 = this.series[1];

                    // set up the updating of the chart every second
                    setInterval(function () {

                        if (live_data[1].isNew) {
                            let x = new Date(live_data[1].time).getTime();
                            let y = parseFloat(live_data[1].temp);
                            series1.addPoint([x, y], true, true);
                            live_data[1].isNew = false;
                        }
                        if (live_data[2].isNew) {
                            let x = new Date(live_data[2].time).getTime();
                            let y = parseFloat(live_data[2].temp);
                            series2.addPoint([x, y], true, true);
                            live_data[2].isNew = false;
                        }
                    }, 1000);
                }
            }
        },

        time: {
            useUTC: false
        },

        title: {
            text: 'Live temperature data'
        },
        accessibility: {
            // Announces new data to screen reader users
            announceNewData: {
                enabled: true,
                minAnnounceInterval: 15000,
                announcementFormatter: function (allSeries, newSeries, newPoint) {
                    if (newPoint) {
                        return 'New point added. Value: ' + newPoint.y;
                    }
                    return false;
                }
            }
        },

        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },

        yAxis: {
            title: {
                text: 'Temperature °C'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },

        tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
        },

        legend: {
            enabled: false
        },

        exporting: {
            enabled: false
        },
        // Initial data 
        series: [{
            name: 'Aspen data',
            data: (function () {
                var data = [];
                    for (i = aspen_time.length; i >= 0; i -= 1) {
                        data.push({
                            x: new Date(aspen_time[i]).getTime(),
                            y: aspen_temp[i]
                        });
                    }
                    return data;
                }())
        }, {
            name: 'Chamonix data',
            data: (function () {
                    var data = [];
                    for (i = chamonix_temp.length; i >= 0; i -= 1) {
                        data.push({
                            x: new Date(chamonix_time[i]).getTime(),
                            y: chamonix_temp[i]
                        });
                    }
                    return data;
                }())
            }]
    });
}

