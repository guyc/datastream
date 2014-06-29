# -*- coding: utf-8 -*-

import datastream.listener
import time

url = 'ws://barrine.clearwater.com.au:8001/test'
retrySeconds = 5

def valueChanged(values):
    print("valueChanged: %s" % (values))

while 1:
  try:
    ws = datastream.listener.Listener('ws://iot.clearwater.com.au:8001/test/build%', valueChanged)
    ws.daemon = False
    ws.connect()
    print("done with connect")
  except KeyboardInterrupt:
    print("keyboard interrupt")
    ws.close()
    exit(0)
  except Exception as e:
    print(e)
  else:
    print("wait forever")
    ws.run_forever()

  print("disconnected, sleeping...\n")
  time.sleep(retrySeconds)
  print("reconnecting.\n")


