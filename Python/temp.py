import os
import glob
import time
import datetime
import urllib.request
import random

#load the kernel modules needed to handle the sensor
os.system("modprobe w1_gpio")
os.system("modprobe w1_therm")

# find the path of a sensor directory that starts with 28
devicelist = glob.glob("/sys/bus/w1/devices/28*")
print (devicelist)
#append the device file name to get the absolute path of th ???
devicefile = devicelist[0] + "/w1_slave"

sensor_id = 1
# Normal temperatures
norm_min = 15
norm_max = 25
# Reasonable temperatures
reas_min = -60
reas_max = 60


# open the file representing the sensor
while True:
    dateTime = datetime.datetime.now()
    datum = dateTime.strftime("%Y-%m-%d")
    tid = dateTime.strftime("%H:%M:%S")
    fileobj = open (devicefile, 'r')
    lines = fileobj.readlines()
    fileobj.close()
    
    # [:-1] tar bort sista tecknet (\n)
    #print (lines[0][:-1])
    #print (lines[1][:-1])
    
    # delar upp stängen vid likhetstecknet och returnerar det som en array
    tempdata = lines[1].split("=")
    
    #print tempdata
    
    # tempdata[1] ineehåller temperaturvärdet som sedan modifieras med värdet 1000
    # typkonvertering från sträng till float
    temp = float(tempdata[1])
    
    temp = temp / 1000
    print (temp)
    
    #url = "http://users.du.se/~h17canyl/ik2018/labb5/tempReaderP2.php?datum=" + datum + "t" + tid + "&temp=" + str(temp)
    
    url = "http://users.du.se/~h17maost/2018/TempLabb/index1.php?Controller%add%" + str(sensor_id) + "&" + datum + "&" + tid + "&" + str(temp + random.random())
    data = urllib.request.urlopen(url)
    print (data.read())
    
    time.sleep(3)
    
    dateTime = datetime.datetime.now()
    datum = dateTime.strftime("%Y-%m-%d")
    tid = dateTime.strftime("%H:%M:%S")
    
    url2 = "http://users.du.se/~h17maost/2018/TempLabb/index1.php?Controller%add%2&" + datum + "&" + tid + "&" + str(temp + random.random() + 2)
    data2 = urllib.request.urlopen(url2)
    print (data2.read())
    
    time.sleep(2)
    
