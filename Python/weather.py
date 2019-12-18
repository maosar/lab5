import configparser
import requests
import sys
 
def get_weather():
    url = "http://api.openweathermap.org/data/2.5/weather?id=5412230&APPID=f1dfc66d861c916faf761fa9273970df&units=metric"
    outTemp = requests.get(url).json()['main']['temp']
    return outTemp
 
def main():
 
    weather = get_weather()
    print(weather)
 
 
if __name__ == '__main__':
    main()