Here are some observations based on our deploying and exploring Airnode:

1. Master and Aplha version do not match. Looks like there are major changes.
   For example, contracts (.sols) referenced are differnt. [The pre-alpha version](https://github.com/api3dao/airnode-starter/tree/pre-alpha)

2. Google Vision API access, after the update to alpha codebase, is working. Posted as phase3. 
   Will add readme to run it.
   Keshav added another optional parameter called raw to the endpoint operation in OIS specifications. This allows raw json POST requests.
   
3. We had to use POST instead of GET and so had to modify Airnode code: Posts are better, we feel. Some characteristics of POST requests (FYI)
     - POST requests are not cached
     - POST requests are not stored in the browser history
     - POST requests cannot be bookmarked
     - POST requests have no restrictions on data length

 On the otherhand we do not know how POST is treated by GDPR?
 If Aitnode DAO does not allow POST requests, then this is a limitatation on the types of APIs Airnode can oraclize.
  
4. Code not audited. It appears that the commit tests by the team are failing.
   
5. The api3/ois module was not registered with npm. 

6. How rigid is OIS? if OIS is changed the docker image provided needs ot be modifed. Is OIS work in progress?

