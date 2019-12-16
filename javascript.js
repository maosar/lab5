var chart;
var date_time = [];
var cars = [];
var new_cars;
var old_time;
var recived_time;
var hasData = false;
var timeChanged = false;



$(document).ready(function () {
    LoadFile();
    LoadServerEvent();


});

function LoadServerEvent() {
    var evtSource = new EventSource("http://users.du.se/~h17maost/2018/TempLabb/index2.php");
    // var evtSource = new EventSource("http://130.243.34.36/index2.php");
    console.log("started");
    evtSource.onmessage = function (event) {
        // console.log(event);
        var res = event.data.split("??");
        recived_time = res[0];
        new_cars = res[1];
        console.log("Recived time " + recived_time);
        console.log("Recived time " + old_time);


        if (recived_time != old_time) {
            old_time = recived_time;
            timeChanged = true;
        }

        document.getElementById('latest').innerHTML = recived_time + ": " + new_cars + " cars waiting at traffic light";

    }
    evtSource.onerror = function (err) {
        console.error("EventSource failed:", err);
        console.error("Is trusted:", err.isTrusted);
    };

}

function LoadFile() {
    var apiUrl = "http://users.du.se/~h17maost/2018/TempLabb/index1.php?Controller%get_obs%";
    // var apiUrl = "http://130.243.34.36/index1.php?Controller%get_obs%";
    fetch(apiUrl)
        .then(function (response) {
            console.log(response);
            response.json()
                .then(function (data) {
                    data.forEach(function (item, index, array) {
                        date_time.push(item.date_time);
                        cars.push(parseInt(item.cars));
                    });
                    hasData = true;
                    ShowChart();
                    LoadServerEvent();
                }).catch(error => console.log('Error json():', error));
        }).catch(error => console.log('Error response: ', error));
}

function ShowChart() {

    Highcharts.chart('container', {
        chart: {
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: function () {

                    // set up the updating of the chart every 100 miliseconds
                    var series = this.series[0];

                    setInterval(function () {
                        if (timeChanged) {
                            let x = new Date(old_time).getTime(), // current time
                                y = parseInt(new_cars);
                            // [x,y, redraw, shift]
                            series.addPoint([x, y], true, true);
                            console.log(x)
                            console.log(y)
                            timeChanged = false;
                        }
                    }, 100);
                }
            }
        },

        time: {
            useUTC: false
        },

        title: {
            text: 'Live traffic data'
        },

        accessibility: {
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
                text: 'Value'
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

        series: [{
            name: 'Random data',
            data:

                (function () {
                    // generate an array of random data
                    var data = [];

                    console.log(date_time.length);
                    for (i = date_time.length - 10; i < date_time.length; i += 1) {
                        data.push({
                            x: new Date(date_time[i - 1]).getTime(),
                            y: cars[i - 1]
                        });
                    }
                    console.log(data);
                    return data;
                }())

        }]
    });
}

