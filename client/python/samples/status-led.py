# -*- coding: utf-8 -*-

import datastream.listener
#import gaugette.rgbled

url = 'ws://barrine.clearwater.com.au:8001/test'

colors = {
       'red'   : [100,0,0,500],
       'green' : [0,100,0,500],
       'blue'  : [0,0,100,500],
         }

def valueChanged(values):
    print("valueChanged: %s" % (values))
    if ('status' in values):
        color = colors[values['status']]
        print(color)
    else:
        print('no color found')

try:
  ws = datastream.listener.Listener('ws://barrine.clearwater.com.au:8001/test', valueChanged)
  ws.daemon = False
  ws.connect()
except KeyboardInterrupt:
  ws.close()


