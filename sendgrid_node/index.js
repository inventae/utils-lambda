var helper = require('sendgrid').mail;
var AWS = require('aws-sdk');
var handlebars = require('handlebars');

var s3 = new AWS.S3({ 
                    apiVersion: '2006-03-01',
                    accessKeyId: "KEY",
                    secretAccessKey: "Secret" 
              });

exports.handler = function(event, context) {
  var event = JSON.parse(event.Records[0].Sns.Message)
  new InventaeMailer(event, context);
};

var InventaeMailer = function(event, context){

  this.bucket = event.s3.bucket;
  this.folder = event.s3.folder;
  this.template = this.folder + event.s3.template;
  this.master = this.folder + event.s3.master;
  this.context = context
  this.event = event;
  this.params = event.params;

  this.params.templateName = event.s3.template.split(".")[0];

  this.sendToSendGrid = function(html){
    
    var sg = require('sendgrid').SendGrid(this.event.keys.sengrid);
    var content = new helper.Content("text/html", html);
    var from_email = new helper.Email(this.event.from);
    var to_email = new helper.Email(this.event.to);
    var subject = this.event.subject;

    var mail = new helper.Mail(from_email, subject, to_email, content);

    var requestBody = mail.toJSON();
    var request = sg.emptyRequest();

    request.method = 'POST'
    request.path = '/v3/mail/send'
    request.body = requestBody

    sg.API(request, function (response) {
      context.done();
    });
  };

  this.getFromS3 = function(key, cb){
    var params = {
      Bucket : this.event.s3.bucket,
      Key : key
    };

    s3.getObject(params, function(err, data){
      if (err) {
        console.error(err);
        context.done();
      } else {
        cb( data.Body.toString() );
      }
    });
  };

  this.buildTemplate = function(cb){
    var _this = this;
    _this.getMail(function(){
      var layout = handlebars.compile( _this.master_source );
      handlebars.registerPartial( _this.params.templateName, _this.template_source );
      cb( layout(_this.params) );
    });
  };

  this.getMail = function(cb){
    var _this = this;
    _this.getFromS3(this.master, function(master_source){
      _this.master_source = master_source;
      _this.getTemplate(cb);
    });
  };

  this.getTemplate = function(cb){
    var _this = this;
    _this.getFromS3(this.template, function( template_source ){
      _this.template_source = template_source;
      cb();
    });
  };

  this.init = function(){
    var _this = this;
    _this.buildTemplate(function(html){
      _this.sendToSendGrid(html);
    });
  };

  this.init();
}


