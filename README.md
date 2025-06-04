# **Mailer Backend Service**

A simple yet powerful email relay service built with Node.js and Express. It enables sending emails through various SMTP servers without requiring client applications to handle SSL/TLS complexities directly.

## **🌟 Key Features**

* **Simplified Email Sending**: Send emails via a straightforward REST API endpoint.  
* **SMTP Provider Agnostic**: Compatible with any SMTP provider (e.g., Gmail, Outlook, SendGrid, Mailgun, or your own SMTP server).  
* **SSL/TLS Handling**: Manages SSL/TLS and STARTTLS connection security, abstracting complexities from client environments.  
* **Dynamic Configuration**: SMTP settings can be provided per request, offering flexibility.

## **🚀 Why Use This Service?**

Many frontend applications, mobile apps, scripts, or environments with limited cryptographic capabilities (e.g., some IoT devices, older systems) can struggle to implement the proper SSL/TLS connections required by modern email providers. This service acts as a secure bridge, allowing these applications to send emails reliably without embedding SMTP logic or handling complex certificate management.

## **📋 Prerequisites**

* Node.js v14.x or higher  
* npm (Node Package Manager, typically comes with Node.js) or yarn

## **🔧 Installation**

1. Clone the repository:  
   git clone \[https://github.com/aftababu/Mailer.git\](https://github.com/aftababu/Mailer.git)  
   cd Mailer 

   *(Note: GitHub repositories are case-sensitive in URLs, but typically cloned folder names match the repo name. If your local folder is mailer, use cd mailer)*  
2. Install dependencies:  
   npm install

   *(or yarn install if you prefer yarn)*  
3. Start the server:  
   npm start

   By default, the server might run on a port like 3000 (e.g., http://localhost:3000). Check your application's configuration.

## **🔌 API Endpoints**

### **Send Email**

Sends an email using the provided details and SMTP configuration.

* **URL**: /send-email  
* **Method**: POST  
* **Content-Type**: application/json

#### **Request Body**

{  
  "to": "recipient@example.com",  
  "from": "Your Name \<sender@example.com\>",  
  "subject": "Email Subject",  
  "html": "\<h1\>Hello\!\</h1\>\<p\>Your email content here (HTML is supported).\</p\>",  
  "text": "Hello\! Your email content here (Plain text version for clients that do not support HTML).",  
  "smtpUser": "your-smtp-username",  
  "smtpPassword": "your-smtp-password",  
  "smtpHost": "smtp.example.com",  
  "smtpPort": 465,  
  "secure": true  
}

| Parameter | Type | Required | Description |
| :---- | :---- | :---- | :---- |
| to | string | Yes | Recipient's email address. For multiple recipients, send multiple requests or modify the service to accept an array. |
| from | string | Yes | Sender's email address. Often recommended in the format: "Sender Name \<sender@example.com\>". |
| subject | string | Yes | Subject line of the email. |
| html | string | No | HTML body of the email. Recommended for rich content. |
| text | string | Yes | Plain text body of the email. Provide this as a fallback if HTML is not supported by the recipient's client, or if html is not provided. |
| smtpUser | string | Yes | Username for SMTP authentication. |
| smtpPassword | string | Yes | Password for SMTP authentication. |
| smtpHost | string | No | SMTP server hostname (e.g., smtp.gmail.com). Defaults to smtp.gmail.com if not provided. |
| smtpPort | number | No | SMTP server port. Common ports: 465 (SSL/TLS), 587 (STARTTLS). Defaults to 465 if not provided. |
| secure | boolean | No | If true, the connection will use SSL/TLS (typically for port 465). If false, and port is 587, STARTTLS will be attempted. Defaults to true (consistent with default port 465). |

*Note on html vs text: It's good practice to provide both. If html is provided, this service should ideally send a multipart email. If only text is provided, it will be a plain text email. If only html is provided, some email clients might have issues rendering it without a text part.*

#### **Responses**

* **Success** (200 OK):  
  {  
    "success": true,  
    "message": "Email sent successfully\!",  
    "info": { /\* Optional: Information from the SMTP provider, like messageId \*/ }  
  }

* **Client Error** (e.g., 400 Bad Request for missing parameters, 401 Unauthorized for auth issues if implemented on the relay):  
  {  
    "success": false,  
    "message": "Invalid request parameters.",  
    "error": "Details about what was missing or invalid."  
  }

* **Server Error** (e.g., 500 Internal Server Error for SMTP connection issues or other unexpected errors):  
  {  
    "success": false,  
    "message": "Failed to send email due to a server error.",  
    "error": "Detailed error information from the SMTP transaction or server."  
  }

### **Health Check**

Provides a simple health status of the service.

* **URL**: /health  
* **Method**: GET

#### **Response**

* **Success** (200 OK):  
  {  
    "status": "UP",  
    "timestamp": "2023-10-27T10:20:30.123Z"  
  }

## **🔐 Security Considerations**

* **Credential Handling**: This service, by design for flexibility, accepts SMTP credentials in the request body. **This is a significant security risk if the service is exposed publicly or used in an untrusted network.**  
  * **For Production/Sensitive Use**:  
    * **NEVER** expose this service directly to the public internet without robust authentication and authorization mechanisms for the service itself (e.g., API keys, JWT tokens, IP whitelisting).  
    * The relay service endpoint **MUST** be protected with HTTPS.  
    * Consider configuring fixed SMTP credentials via **environment variables** on the server where this relay service is hosted, rather than passing them in each API request. This is much more secure. The per-request SMTP parameters could then be made optional or disallowed for certain deployments.  
    * Implement strict input validation and sanitization for all request parameters.  
* **Rate Limiting**: Implement rate limiting to prevent abuse of the email sending functionality.  
* **Logging**: Implement comprehensive logging for requests and SMTP interactions (but be careful not to log sensitive credentials).  
* **Error Handling**: Ensure detailed errors are logged on the server but generic, non-revealing error messages are sent to the client.

## **🌐 Usage Examples**

*(Assuming the service is running at http://indigo-glory-sardine.glitch.me)*

### **Using cURL**

Replace placeholders with actual values.

curl \-X POST \[http://indigo-glory-sardine.glitch.me/send-email\](http://indigo-glory-sardine.glitch.me/send-email) \\  
 \-H "Content-Type: application/json" \\  
 \-d '{  
   "to": "recipient@example.com",  
   "from": "Your App \<noreply@yourdomain.com\>",  
   "subject": "Test Email via Relay",  
   "html": "\<h1\>Hello World\!\</h1\>\<p\>This is a test email sent through the awesome relay service.\</p\>",  
   "text": "Hello World\! This is a test email sent through the awesome relay service.",  
   "smtpUser": "your-actual-smtp-username",  
   "smtpPassword": "your-actual-smtp-password",  
   "smtpHost": "smtp.yourprovider.com",  
   "smtpPort": 465,  
   "secure": true  
 }'

### **Using JavaScript (Fetch API)**

async function sendRelayEmail() {  
  const emailData \= {  
    to: 'recipient@example.com',  
    from: 'My Web App \<sender@webapp.com\>',  
    subject: 'Test Email from JS',  
    html: '\<h1\>Hello from JavaScript\!\</h1\>\<p\>This email was sent via the Node.js mailer relay.\</p\>',  
    text: 'Hello from JavaScript\! This email was sent via the Node.js mailer relay.',  
    smtpUser: 'your-smtp-username',       // Ideally, use environment variables on the server  
    smtpPassword: 'your-smtp-password', // if possible, or ensure this client is trusted.  
    smtpHost: 'smtp.gmail.com',         // Example for Gmail  
    smtpPort: 465,                      // Use 465 for SSL, or 587 for STARTTLS  
    secure: true                        // true for 465, false if using STARTTLS on 587  
  };

  try {  
    const response \= await fetch('\[http://indigo-glory-sardine.glitch.me/send-email\](http://indigo-glory-sardine.glitch.me/send-email)', {  
      method: 'POST',  
      headers: {  
        'Content-Type': 'application/json',  
        // 'Authorization': 'Bearer YOUR\_API\_KEY\_IF\_IMPLEMENTED'   
      },  
      body: JSON.stringify(emailData),  
    });

    const result \= await response.json();

    if (response.ok && result.success) {  
      console.log('Email sent successfully:', result.message);  
    } else {  
      console.error('Failed to send email:', result.message, result.error || '');  
    }  
  } catch (error) {  
    console.error('Network or other error:', error);  
  }  
}

sendRelayEmail();

## **🛠️ Customization & SMTP Providers**

You can adapt this service for various SMTP providers by specifying smtpHost, smtpPort, and secure parameters. The service should handle the necessary SSL/TLS (for ports like 465\) or STARTTLS negotiation (for ports like 587 when secure is false).

* **Gmail**:  
  * smtpHost: smtp.gmail.com  
  * smtpPort: 465, secure: true (SSL/TLS)  
  * smtpPort: 587, secure: false (STARTTLS \- Nodemailer typically handles this automatically if secure: false and port is 587\)  
  * *Note: You might need to enable "Less secure app access" or use App Passwords for Gmail.*  
* **Outlook/Office365**:  
  * smtpHost: smtp.office365.com  
  * smtpPort: 587, secure: false (STARTTLS)  
* **Yahoo Mail**:  
  * smtpHost: smtp.mail.yahoo.com  
  * smtpPort: 465, secure: true (SSL/TLS)  
  * smtpPort: 587, secure: false (STARTTLS)  
  * *Note: Yahoo often requires an App Password.*  
* **SendGrid**:  
  * smtpHost: smtp.sendgrid.net  
  * smtpPort: 465, secure: true (SSL/TLS)  
  * smtpPort: 587, secure: false (STARTTLS)  
  * smtpUser: typically "apikey"  
  * smtpPassword: your SendGrid API key  
* **Custom SMTP Server**:  
  * smtpHost: your-smtp-server.com  
  * smtpPort: Port as configured (e.g., 465, 587, or 25 with STARTTLS if supported)  
  * secure: Set according to your server's configuration for the chosen port.

## **🤝 Contributing**

Contributions, issues, and feature requests are welcome\! Please feel free to submit a Pull Request or open an issue.

## **📜 License**

This project is licensed under the MIT License \- see the LICENSE file for details.

## **⚠️ Disclaimer**

This service is provided as-is, with the aim to simplify email sending from environments with SSL/TLS limitations. The security of your SMTP credentials and the overall security of the deployment environment are your responsibility. Always follow security best practices, especially when handling sensitive credentials.