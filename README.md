[![Build Status](https://travis-ci.org/gamebin/decen_social.svg?branch=master)](https://travis-ci.org/gamebin/decen_social)


# decentralized social service - Linking
'Linking' is a kind of social service like facebook or twitter. 
But it's different from those services in view of service data authority.


![decen](https://user-images.githubusercontent.com/22092729/69291614-23241500-0c47-11ea-93d6-1f63e7553f56.png)


## How to start
1. prepare your own server
2. install node.js[https://nodejs.org/]
3. if you develop with php you should also install php[https://www.php.net/].
4. install mysql[https://www.mysql.com]. As now we support only mysql.
5. install DB
6. Set up the web server. We recommend nginx[https://nginx.org]
7. configure your web server as you wish. You can build your service with php or with APIs.

## How to develop
This repo consists of main 3parts.
- [API]
API can be used as third party application and federated Sever to Server API. 
you can access to the user's feeding through these API. 
Main 2 apis are user's outbox and user's inbox. 
You can develop your own services by using these APIs. 
- [php]
php folders are web pages to service in the linking web page If you are familiar with php code you can use these files as example and develop without using APIs. 
You can change some sort of php page and publish it easily.
- [DB]
DB consists of real DB to develop the your own service as a guide. You can also change these DB and add some new features.
As now, we support mysql[https://www.mysql.com]

other folders
- [example] this folder consists of some HTML files as a examples to make your own design.

### own your data 
Imagine that the facebook or twitter shut-down. You can not get your data !!
Even though fortunately you downloaded your data, you can not publish it on the web. 
Every social services use their own standard to save, to publish your data. It's impposible to be interoperable between services.
Linking uses W3C social standard to solve those problems. 
You can move your data whenever you want by using Linking. 

### connectivity and openness
Every social services which use social standard can be interoperable. 

### W3C standards
- [ActivityStream] https://www.w3.org/TR/activitystreams-core/
- [Webmention] https://www.w3.org/TR/webmention/
- [Linked Data Notifications] https://www.w3.org/TR/ldn/
- [Micropub] https://www.w3.org/TR/micropub/
- [Activity Streams Vocab] https://www.w3.org/TR/activitystreams-vocabulary/
- [ActivityPub] https://www.w3.org/TR/activitypub/
- [JSON LD] https://www.w3.org/TR/json-ld/

## License 

see license [https://github.com/gamebin/decen_social/blob/master/LICENSE]

## How to participate
Register github issue [https://github.com/gamebin/decen_social/issues] 

slack channerl : https://app.slack.com/client/TQE6FE71S/CQGFV7W8P
