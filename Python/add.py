#!/usr/bin/python
import time
import datetime
import urllib.request
import random

counter = 0

while True:
    print("\n")
    counter = counter + 1
    print("Meassure no:\t" + str(counter))

    #Anrop till php back-end
    dateTime = datetime.datetime.now()
    dateStamp = dateTime.strftime("%Y-%m-%d")
    timeStamp = dateTime.strftime("%H:%M:%S")
    randomTemp = random.randint(22000,25000)/1000
    sensorID = 1
    url = 'http://users.du.se/~h17maost/2018/TempLabb/index1.php?Controller%add%' + str(sensorID) + "&" + dateStamp + "&" + timeStamp + "&" + str(randomTemp)
    print ("Request:\t" + url)
    data = urllib.request.urlopen(url)
    print ("Response:\t" + str(data.read()))
    time.sleep(20)
    print("\n")
    
    #Anrop till php back-end
    dateTime = datetime.datetime.now()
    dateStamp = dateTime.strftime("%Y-%m-%d")
    timeStamp = dateTime.strftime("%H:%M:%S")
    randomTemp = random.randint(22000,25000)/1000
    sensorID = 2
    url = 'http://users.du.se/~h17maost/2018/TempLabb/index1.php?Controller%add%' + str(sensorID) + "&" + dateStamp + "&" + timeStamp + "&" + str(randomTemp)
    print ("Request:\t" + url)
    data = urllib.request.urlopen(url)
    print ("Response:\t" + str(data.read()))
    time.sleep(25)
    print("\n")
