

import pika

# RABBITMQ_SERVER_URL = 'amqp://remote-dev:compact@www.siotman.com:15673/'
RABBITMQ_SERVER_URL = 'amqp://admin:compact@www.siotman.com:5672/'

if __name__ == "__main__":
    connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_SERVER_URL))
    channel = connection.channel()
    for idx in range(0,10):
        msg = "detail$,uid$,SSSIIIDDD$,http://testest%d.com$,상태"%idx
        channel.basic_publish(exchange='url-exchange',
                      routing_key='parse.target.test',
                      body=msg)
        print(msg)

 