export function renderErrorPage(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Error</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .error-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          width: 100%;
          padding: 40px;
          text-align: center;
        }
        .error-code {
          font-size: 72px;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 10px;
        }
        .error-title {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
        }
        .error-message {
          font-size: 16px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .error-button {
          display: inline-block;
          background: #667eea;
          color: white;
          text-decoration: none;
          padding: 12px 30px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          transition: background 0.3s ease;
        }
        .error-button:hover {
          background: #764ba2;
        }
      </style>
    </head>
    <body>
      <div class="error-container">
        <div class="error-code">500</div>
        <div class="error-title">Internal Server Error</div>
        <div class="error-message">
          Something went wrong on our end. Please try refreshing the page or contact support if the problem persists.
        </div>
        <a href="/" class="error-button">Go Home</a>
      </div>
    </body>
    </html>
  `;
}
