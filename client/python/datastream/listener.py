from ws4py.client.threadedclient import WebSocketClient
import json

class Listener(WebSocketClient):
    def __init__(self, url, eventHandler):
        super(Listener,self).__init__(url, protocols=['data-stream'])
        self.eventHandler = eventHandler

    def closed(self, code, reason):
        print (("Closed down", code, reason))

    def received_message(self, message):
        print("received message")
        print("=> %d %s" % (len(message), str(message)))
        try:
            data = json.loads(str(message))
            self.eventHandler(data)
        except Exception as Ex:
            print("Exception decoding message.")
            print(Ex)

