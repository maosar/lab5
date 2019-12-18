import os
import glob
import time
import datetime
import requests
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import random
import urllib.request

port = 587 
smtp_server = "smtp.gmail.com"
sender_email = "hallonpaj314@gmail.com"  
receiver_email = "evadahl999@gmail.com"  
password = "IK2018R314"

message = MIMEMultipart('alternative')


# Normal temperatures
norm_min = 15
norm_max = 25


def main():
    temp = getSensorTemp()
    print(str(temp))
    if(isReasonable(temp)):
        #TODO: Send to database...
        time_stamp = getTimeStamp()
        print(time_stamp['date'])
        print(time_stamp['time'])
        url = "http://130.243.34.36/index1.php?Controller%add%1&" + time_stamp['date'] + "&" + time_stamp['time'] + "&" + str(temp)
        data = urllib.request.urlopen(url)
        print(data.read())
        time.sleep(5)
        url = "http://130.243.34.36/index1.php?Controller%add%2&" + time_stamp['date'] + "&" + time_stamp['time'] + "&" + str(temp + random.randint(1000,3000)/1000)
        data = urllib.request.urlopen(url)
        print(data.read())
        time.sleep(5)
        if(not isNormal(temp)):
            print("Not normal: " + str(temp))
            checkTemp(temp)
    else:
        title = "Measurement out of range"
        content = "<p>The measured temperature is out of range</p><p>The measured temperature is: " + str(temp) + "</p>"
        sendMail(title, content)
        print("Not reasonable" + str(temp))
    
    timeStamp = getTimeStamp()
    #print(timeStamp['time'])
    
def checkTemp(temp):
    outTemp = getWeather()
    print("Temp att checka mot" + str(outTemp))
    if(temp < norm_min and outTemp <= temp):
        #Send mail: Kallt i stugan.
        title = "Cabin: too cold"
        print(title)
        content = "<p>Too cold, the cabin temperature is: " + str(temp) + "</p><p>The outside temperature is: " + str(outTemp) + "</p>"
        sendMail(title, content)
    if(temp < norm_min and outTemp > temp):
        #Send mail: Fel på sensorn.
        title = "Cabin: sensor failure"
        print(title)
        content = "<p>The cabin temperature is: " + str(temp) + "</p><p>The outside temperature is: " + str(outTemp) + "</p>"
        sendMail(title, content)
    if(temp > norm_max and outTemp >= temp):
        #Send mail: Varmt inne o varmt ute.
        title = "Cabin: warm, but maybe not too warm"
        print(title)
        content = "<p>The cabin temperature is: " + str(temp) + "</p><p>The outside temperature is: " + str(outTemp) + "</p>"
        sendMail(title, content)
    if(temp > norm_max and outTemp < temp):
        #Send mail: Varmt inne men inte ute. (Antingen e sensorn trasig eller så brinner det...)
        title = "Cabin: Sensor fail or cabin on fire"
        print(title)
        content = "<p>Too warm, the cabin temperature is: " + str(temp) + "</p><p>The outside temperature is: " + str(outTemp) + "</p>"
        sendMail(title, content)
        
def sendMail(title, content):
    print("Skicka mail")
    message['Subject'] = title
    text = content
    html = """<html><body>""" + content + """</body></html>"""
    textType = MIMEText(text, 'plain')
    htmlType = MIMEText(html, 'html')

    message.attach(textType)
    message.attach(htmlType)

    mail = smtplib.SMTP(smtp_server, port)
    mail.ehlo()
    mail.starttls()
    mail.login(sender_email, password)
    mail.sendmail(sender_email, receiver_email, message.as_string())
    mail.close()

def getWeather():
    url = "http://api.openweathermap.org/data/2.5/weather?id=5412230&APPID=f1dfc66d861c916faf761fa9273970df&units=metric"
    outTemp = requests.get(url).json()['main']['temp']
    return outTemp

def isNormal(temp):
    if(temp > norm_min and temp < norm_max):
        return True
    else:
        return False

def isReasonable(temp):
    # Reasonable temperatures
    reas_min = -60
    reas_max = 60
    if(temp > reas_min and temp < reas_max):
        return True
    else:
        return False

def getTimeStamp():
    dateTime = datetime.datetime.now()
    datum = dateTime.strftime("%Y-%m-%d")
    tid = dateTime.strftime("%H:%M:%S")
    timeStamp = {'date': datum,'time': tid}
    return timeStamp
    
def getSensorTemp():
    #load the kernel modules needed to handle the sensor
    os.system("modprobe w1_gpio")
    os.system("modprobe w1_therm")
    # find the path of a sensor directory that starts with 28
    devicelist = glob.glob("/sys/bus/w1/devices/28*")
    #append the device file name to get the absolute path of th ???
    devicefile = devicelist[0] + "/w1_slave"
    #Open devicefile and read it
    fileobj = open (devicefile, 'r')
    lines = fileobj.readlines()
    print(lines)
    fileobj.close()
    tempdata = lines[1].split("=")
    
    #print tempdata
    
    # tempdata[1] ineehåller temperaturvärdet som sedan modifieras med värdet 1000
    # typkonvertering från sträng till float
    temp = float(tempdata[1])
    #Return temp in Celsius
    return temp / 1000
 
while True:
    main()