from ws4py.client.threadedclient import WebSocketClient

class Listener(WebSocketClient):
    def __init__(self, url):
        super(Listener,self).__init__(url, protocols=['data-stream'])

    def closed(self, code, reason):
        print (("Closed down", code, reason))

    def received_message(self, message):
        print("received message")
        print("=> %d %s" % (len(m), str(m)))
