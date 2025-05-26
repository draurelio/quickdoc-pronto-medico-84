# Sharing Integration Notes

This document outlines research findings for integrating Email and WhatsApp sharing functionalities for prescriptions.

## Email Sharing

### Option 1: `mailto:` links

*   **Description**: `mailto:` links are the simplest way to initiate an email from the client-side. They open the user's default email client with pre-filled fields (recipient, subject, body).
*   **Pros**:
    *   Easy to implement.
    *   No backend setup required for basic functionality.
    *   Leverages the user's existing email configuration.
*   **Cons**:
    *   Reliability depends on the user having a configured email client.
    *   Limited control over the email sending process (e.g., tracking, styling beyond plain text in the body).
    *   PDF attachment needs to be handled manually by the user (i.e., they download the PDF first, then attach it). Direct attachment via `mailto` is not reliably supported across all email clients and browsers.
*   **Implementation**:
    ```html
    <a href="mailto:recipient@example.com?subject=Your%20Prescription&body=Please%20find%20your%20prescription%20attached.">
      Share via Email
    </a>
    ```
    To include the PDF, the user would first download it, and then the body of the email could instruct them to attach it.

### Option 2: Backend Email Sending Service (e.g., SendGrid, AWS SES)

*   **Description**: Use a third-party email service provider to send emails directly from the application's backend.
*   **Pros**:
    *   Full control over the email content, styling (HTML emails), and sending process.
    *   Can attach files (like the generated PDF prescription) directly to the email.
    *   More reliable delivery and tracking capabilities.
    *   Doesn't rely on the user's local email client setup.
*   **Cons**:
    *   Requires backend implementation (API endpoint to trigger email sending).
    *   Involves managing API keys and potentially costs associated with the email service.
    *   More complex setup than `mailto:`.
*   **Implementation Steps (Conceptual)**:
    1.  Set up an account with an email service provider (e.g., SendGrid).
    2.  Install their SDK/library in the backend.
    3.  Create a backend endpoint (e.g., `/api/share/email`) that accepts prescription ID and recipient email.
    4.  The endpoint fetches/generates the PDF, then uses the email service to send it as an attachment.
    5.  Frontend calls this endpoint.

## WhatsApp Sharing

### Option 1: WhatsApp Click to Chat

*   **Description**: Uses a special WhatsApp URL (`https://wa.me/`) to open a chat with a specific phone number. A pre-filled message can be included.
*   **Pros**:
    *   Simple to implement for initiating a chat.
    *   Works on both mobile and desktop (if WhatsApp desktop is installed).
*   **Cons**:
    *   **Does not directly support attaching files (like PDFs) through the URL.** The user would have to download the PDF first and then manually attach it in the WhatsApp chat.
    *   Relies on the user having WhatsApp installed.
    *   The pre-filled message has limitations in length and formatting.
*   **Implementation**:
    ```html
    <a href="https://wa.me/1XXXXXXXXXX?text=Here%20is%20my%20prescription." target="_blank">
      Share on WhatsApp
    </a>
    ```
    (Replace `1XXXXXXXXXX` with the recipient's phone number including country code).
    The text should instruct the user to attach the downloaded PDF.

### Option 2: WhatsApp Business API (via Business Solution Providers)

*   **Description**: For businesses that need more advanced integration, WhatsApp offers Business APIs through partners.
*   **Pros**:
    *   Potentially allows for richer messaging experiences and automation.
    *   Might offer ways to send media, but this is typically for businesses interacting with customers (e.g., sending boarding passes, notifications).
*   **Cons**:
    *   Complex to set up and usually involves costs.
    *   Primarily designed for business-to-consumer communication, not necessarily peer-to-peer sharing initiated by a user from a third-party app.
    *   Direct PDF sharing as an attachment initiated from a web app is still not a straightforward feature for general use. The API is more about programmatic messaging.
    *   Likely overkill for simply sharing a prescription PDF.

## Conclusion for Sharing Prescription PDFs

*   **Email**:
    *   For immediate client-side implementation without backend changes: Use `mailto:`. Instruct users to download the PDF and then attach it manually.
    *   For a more seamless experience with direct PDF attachment: Implement a backend service. This is a more robust solution but requires backend development.
*   **WhatsApp**:
    *   Use the "Click to Chat" feature (`https://wa.me/`). Instruct users to download the PDF and then attach it manually in the WhatsApp chat. Direct PDF sharing via a simple link is not supported.

For the current scope, if backend changes are to be avoided, the `mailto:` and WhatsApp "Click to Chat" links are the most feasible options, with the explicit understanding that users will need to handle the PDF attachment manually.
