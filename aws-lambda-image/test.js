"use strict";

var lambda = require('./index.js');
var context = function(){
  return {
        succeed: function(result) {
            console.log("-> CONTEXT SUCEEED: ", result);
        },
        fail: function(err) {
            console.log("-> CONTEXT FAIL: ", err);
        },
        done: function(err, result) {
            console.log("-> CONTEXT DONEL", err, result);
        },
        functionName: 'local_function',
        awsRequestId: 'local_awsRequestId',
        logGroupName: 'local_logGroupName',
        logStreamName: 'local_logStreamName',
        clientContext: 'local_clientContext',
        identity: {
            cognitoIdentityId: 'local_cognitoIdentityId'
        }
    };
}

var event = function(){
  return {
    "Records":[  
      {  
         "eventVersion":"2.0",
         "eventSource":"aws:s3",
         "awsRegion":"us-east-1",
         "eventTime":"1970-01-01T00:00:00.000Z",
         "eventName":"ObjectCreated:Put",
         "userIdentity":{ "principalId":"EXAMPLE" },
         "requestParameters":{ "sourceIPAddress":"127.0.0.1" },
         "responseElements":{ "x-amz-request-id":"C3D13FE58DE4C810", "x-amz-id-2":"FMyUVURIY8/IgAtTv8xRjskZQpcIZ9KG4V5Wp6S7S/JRWeUWerMUE5JgHvANOjpD" },
         "s3":{  
            "s3SchemaVersion":"1.0",
            "configurationId":"testConfigRule",
            "bucket":{  
               "name":"questoesdeaaz-assets-dev",
               "ownerIdentity":{ "principalId":"EXAMPLE" },
               "arn":"arn:aws:s3:::questoesdeaaz-assets-dev"
            },
            "object":{  
               "key":"uploads/29092016230641/bb.png",
               "size":33659,
               "eTag":"af25490494d3338afef00869c59fdd37",
               "versionId":"096fKKXTRTtl3on89fVO.nfljtsv6qko"
            }
         }
      }
   ]
  }
}


lambda.handler(event(), context())