# Email Relay Backend Service

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A simple but powerful email relay service built with Node.js and Express that enables sending emails through SMTP servers without dealing with SSL complexities directly from client applications.

## 🌟 Key Features

- **Easy Email Sending**: Send emails through a simple REST API
- **SMTP Provider Agnostic**: Works with any SMTP provider (Gmail, Outlook, etc.)
- **SSL Handling**: Handles SSL requirements that might be difficult to implement in some client environments
- **Customizable**: Configure SMTP settings per request

## 🚀 Why Use This Service?

Many frontend applications, mobile apps, or environments with limited capabilities struggle to implement proper SSL connections required by modern email providers. This service acts as a bridge, allowing you to send emails from any application without dealing with SSL certificate issues or complex SMTP configurations.

## 📋 Prerequisites

- Node.js 14.x or higher
- npm or yarn

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/email-relay-backend.git
   cd email-relay-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

## 🔌 API Endpoints

### Send Email

```
POST /send-email
```

#### Request Body

```json
{
  "to": "recipient@example.com",
  "from": "sender@example.com",
  "subject": "Email Subject",
  "text": "<p>Your email content here (HTML supported)</p>",
  "smtp_user": "your-smtp-username",
  "smtp_password": "your-smtp-password",
  "smtp_host": "smtp.gmail.com",
  "smtp_port": 465
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| to | string | Yes | Recipient email address |
| from | string | Yes | Sender email address |
| subject | string | Yes | Email subject line |
| text | string | Yes | Email body (HTML supported) |
| smtp_user | string | Yes | SMTP username |
| smtp_password | string | Yes | SMTP password |
| smtp_host | string | No | SMTP server host (defaults to smtp.gmail.com) |
| smtp_port | number | No | SMTP server port (defaults to 465) |

#### Response

Success (200 OK):
```json
{
  "success": true,
  "message": "Email sent successfully!"
}
```

Error (400/500):
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Health Check

```
GET /health
```

Returns the current status of the service.

## 🔐 Security Considerations

- This service accepts SMTP credentials in the request body. In production environments, consider implementing:
  - API key authentication
  - Rate limiting
  - HTTPS encryption
  - Consider using environment variables for fixed SMTP settings

- Never expose this service publicly without proper authentication and authorization.

## 🌐 Usage Examples

### Using cURL

```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "from": "sender@example.com",
    "subject": "Test Email",
    "text": "<h1>Hello World!</h1><p>This is a test email sent through the relay service.</p>",
    "smtp_user": "your-smtp-username",
    "smtp_password": "your-smtp-password"
  }'
```

### Using JavaScript (Fetch)

```javascript
fetch('http://localhost:3000/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'recipient@example.com',
    from: 'sender@example.com',
    subject: 'Test Email',
    text: '<h1>Hello World!</h1><p>This is a test email sent through the relay service.</p>',
    smtp_user: 'your-smtp-username',
    smtp_password: 'your-smtp-password',
  }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

## 🛠️ Customization

### Using Different SMTP Providers

You can use different email providers by modifying the `smtp_host` and `smtp_port` parameters:

- **Gmail**: smtp.gmail.com (port 465)
- **Outlook/Hotmail**: smtp.office365.com (port 587)
- **Yahoo**: smtp.mail.yahoo.com (port 465)
- **Custom SMTP Server**: your-smtp-server.com (port as configured)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This service is intended to simplify email sending for applications that cannot directly handle SSL connections. However, passing SMTP credentials through API requests should be handled with extreme caution in production environments.# Mailer
