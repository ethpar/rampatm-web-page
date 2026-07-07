## RampATM Website Backend

This node app runs on aws lambda and serves as the API for the contact form on rampatm.com website.

## Deployment
To deploy the code
- Run `npm run build`
- Take the generated `function.zip` and upload it to AWS lambda
[rampatm_com](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions/rampatm_com?subtab=url&tab=configure)

## Environmant Variables
This project requires two env vars configured on AWS lambda.
| Name              | Value                                                                                                                                                                               |
|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| CREDENTIALS_EMAIL | {     auth: boolean;     host: string;     port: string;     password: string;     protocol: string;     username: string;     sslProtocols: string;     starttlsEnable: boolean; } |
| MAIL_TO           | email string                                                                                                                                                                        |


### Available API

**POST** `https://ibm7bagudkufu6snu7ulxfpliu0oamdl.lambda-url.us-east-1.on.aws/`

**Request Body**
```
{
  "name": "Test",
  "contact": "test@test.com",
  "notes": "Hello World"
}
```

**Expected Response**
```
{
  "ok": true
}
```