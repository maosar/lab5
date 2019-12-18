#!/usr/bin/python
import time
import datetime
import RPi.GPIO as GPIO
import urllib.request
import random

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

port = 587 
smtp_server = "smtp.gmail.com"
sender_email = "hallonpaj314@gmail.com"  
receiver_email = "evadahl999@gmail.com"  
password = "IK2018R314"

message = MIMEMultipart('alternative')
message['Subject'] = 'Traffic chaos!'

red = 3
yellow = 5
green = 7

GPIO.setwarnings(False)
GPIO.cleanup()
GPIO.setmode(GPIO.BOARD)

GPIO.setup(3,GPIO.OUT)
GPIO.output(3,GPIO.LOW)

GPIO.setup(5,GPIO.OUT)
GPIO.output(5,GPIO.LOW)

GPIO.setup(7,GPIO.OUT)
GPIO.output(7,GPIO.LOW)

while True:
    #Anrop till php sida som lagrar
    dateTime = datetime.datetime.now()
    datum = dateTime.strftime("%Y-%m-%d")
    #dat2 = datetime.datetime.now()
    tid = dateTime.strftime("%H:%M:%S")
    randomNrCars = random.randint(0,9)
    if randomNrCars >= 5:
        #send mail
        
        randomNO2 = random.randint(80,150)
        
        text = "There are " + str(randomNrCars) + " cars at traffic light at the moment!"
        html = """\
            <html>
                <body>
                    <h1>Traffic chaos!</h1>
                    <p>Date: """ + datum + """, Time: """ + tid + """</p>
                    <p>There are """ + str(randomNrCars) + """ cars at the traffic light at the moment!</p>
                    <p>The nitrogen dioxide content is """ + str(randomNO2) + """</p>
                </body>
            </html>
            """
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
            
    
    url = "http://users.du.se/~h17maost/2018/TrafikLabb/index1.php?Controller%add%" + datum + "&" + tid + "&" + str(randomNrCars)
    data = urllib.request.urlopen(url)
    
    print (data.read())
    
    GPIO.output(red,GPIO.HIGH)
    time.sleep(5)
    GPIO.output(yellow,GPIO.HIGH)
    time.sleep(1)
    GPIO.output(red,GPIO.LOW)
    GPIO.output(yellow,GPIO.LOW)
    
    GPIO.output(green,GPIO.HIGH)
    time.sleep(5)
    GPIO.output(green,GPIO.LOW)
    
    GPIO.output(yellow,GPIO.HIGH)
    time.sleep(2)
    GPIO.output(yellow,GPIO.LOW)
