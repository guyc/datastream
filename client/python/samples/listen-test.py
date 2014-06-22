# -*- coding: utf-8 -*-

import datastream.listener

url = 'ws://barrine.clearwater.com.au:8001/test'

def valueChanged(values):
    print("valueChanged: %s" % (values))

try:
  ws = datastream.listener.Listener('ws://barrine.clearwater.com.au:8001/test', valueChanged)
  ws.daemon = False
  ws.connect()
except KeyboardInterrupt:
  ws.close()


