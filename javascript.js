var chart;
var aspen_time = [];
var aspen_temp = [];
var chamonix_time = [];
var chamonix_temp = [];
var server_event = {
    1: { "time": new Date, "temp": 0.0, "isNew": false },
    2: { "time": new Date, "temp": 0.0, "isNew": false }
};


$(document).ready(function () {
    LoadFile();
    LoadServerEvent();
});

function LoadServerEvent() {
    evtSource = new EventSource("http://users.du.se/~h17maost/2018/TempLabb/index4.php?");
    evtSource.onmessage = function (event) {
        data = JSON.parse(event.data);
        aspen = (data[0]);
        chamonix = (data[1]);

        //var sensor_id = event.data[0].sensor_id;
        //newTime = data[0].obs_time;
        //temp = data[0].temp;

        //console.log(new Date(newTime).getTime());
        //console.log("Time: " + newTime);

        //server_event[sensor_id].time = new Date(newTime).getTime();
        //server_event[sensor_id].temp = parseFloat(temp);
        //server_event[sensor_id].isNew = true;
        //console.log(server_event[sensor_id]);

    }
    evtSource.onerror = function (err) {
        console.error("EventSource failed:", err);
        console.error("Is trusted:", err.isTrusted);
    };

}
function LoadServerEvent2() {
    evtSource = new EventSource("http://users.du.se/~h17maost/2018/TempLabb/index4.php?");
    evtSource.onmessage = function (event) {
        data = JSON.parse(event.data);
        console.log(data);
     

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
                        if (item.sensor_id == 1) {
                            aspen_time.push(item.obs_time);
                            aspen_temp.push(parseFloat(item.temp));
                        } else
                        {
                            chamonix_time.push(item.obs_time);
                            chamonix_temp.push(parseFloat(item.temp));
                        }

                    });
                    console.log("aspen");
                    console.log(aspen_time);
                    console.log(aspen_temp);
                    console.log("chamonix");
                    console.log(chamonix_time);
                    console.log(chamonix_temp);
                    ShowChart();
                    
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
                        
                            //let x = new Date(old_time).getTime(), // current time
                            //    y = parseInt(new_temp);
                            //// [x,y, redraw, shift]
                            //series.addPoint([x, y], true, true);
                            //console.log(x)
                            //console.log(y)
                            //timeChanged = false;
                        
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
            name: 'Aspen data',
            data:

                (function () {
                    // generate an array of random data
                    var data = [];

                    console.log(aspen_time.length);
                    for (i = aspen_time.length - 10; i < aspen_time.length; i += 1) {
                        data.push({
                            x: new Date(aspen_time[i - 1]).getTime(),
                            y: aspen_temp[i - 1]
                        });
                    }
                    console.log(data);
                    return data;
                }())

        }, {
            name: 'Chamonix data',
            data:

            (function () {
                // generate an array of random data
                var data = [];

                
                    for (i = chamonix_time.length - 10; i < chamonix_time.length; i += 1) {
                    data.push({
                        x: new Date(chamonix_time[i - 1]).getTime(),
                        y: chamonix_temp[i - 1]
                    });
                }
                console.log(data);
                return data;
            }())

        }]
    });
}

