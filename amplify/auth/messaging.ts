const emailLayout = (content: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: Arial, Helvetica, sans-serif;
      color: #0f172a;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="background-color: #f1f5f9; padding: 32px 16px;"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              max-width: 520px;
              background-color: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              overflow: hidden;
            "
          >
            <tr>
              <td
                align="center"
                style="
                  padding: 28px 32px 20px;
                  border-bottom: 1px solid #e2e8f0;
                "
              >
                <h1
                  style="
                    margin: 0;
                    font-size: 22px;
                    line-height: 30px;
                    color: #0f172a;
                  "
                >
                  Virtual Company
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding: 32px;">
                ${content}
              </td>
            </tr>

            <tr>
              <td
                align="center"
                style="
                  padding: 20px 32px;
                  background-color: #f8fafc;
                  border-top: 1px solid #e2e8f0;
                "
              >
                <p
                  style="
                    margin: 0;
                    font-size: 12px;
                    line-height: 18px;
                    color: #64748b;
                  "
                >
                  This email was sent by Virtual Company.
                  Please do not share your login credentials.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export const inviteEmailSubject = "Your Virtual Company account";

export const inviteEmailMessage = emailLayout(`
  <h2
    style="
      margin: 0 0 12px;
      font-size: 20px;
      line-height: 28px;
      color: #0f172a;
    "
  >
    Welcome to Virtual Company
  </h2>

  <p
    style="
      margin: 0 0 20px;
      font-size: 14px;
      line-height: 22px;
      color: #475569;
    "
  >
    An administrator has created an account for you. Use the temporary
    credentials below to sign in.
  </p>

  <table
    role="presentation"
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
    style="
      margin-bottom: 20px;
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    "
  >
    <tr>
      <td style="padding: 16px;">
        <p
          style="
            margin: 0 0 6px;
            font-size: 13px;
            color: #64748b;
          "
        >
          Username
        </p>

        <p
          style="
            margin: 0 0 16px;
            font-size: 15px;
            font-weight: 600;
            color: #0f172a;
          "
        >
          {username}
        </p>

        <p
          style="
            margin: 0 0 6px;
            font-size: 13px;
            color: #64748b;
          "
        >
          Temporary password
        </p>

        <p
          style="
            margin: 0;
            font-size: 15px;
            font-weight: 600;
            color: #0f172a;
          "
        >
          {####}
        </p>
      </td>
    </tr>
  </table>

  <p
    style="
      margin: 0;
      font-size: 13px;
      line-height: 20px;
      color: #64748b;
    "
  >
    You will be asked to create a new password after signing in.
  </p>
`);

export const verificationEmailSubject = "Verify your Virtual Company email";

export const verificationEmailMessage = emailLayout(`
  <h2
    style="
      margin: 0 0 12px;
      font-size: 20px;
      line-height: 28px;
      color: #0f172a;
    "
  >
    Verify your email address
  </h2>

  <p
    style="
      margin: 0 0 20px;
      font-size: 14px;
      line-height: 22px;
      color: #475569;
    "
  >
    Enter the verification code below to confirm your email address.
  </p>

  <div
    style="
      padding: 18px;
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      text-align: center;
    "
  >
    <p
      style="
        margin: 0;
        font-size: 28px;
        line-height: 36px;
        font-weight: 700;
        letter-spacing: 6px;
        color: #0f172a;
      "
    >
      {####}
    </p>
  </div>

  <p
    style="
      margin: 20px 0 0;
      font-size: 13px;
      line-height: 20px;
      color: #64748b;
    "
  >
    Ignore this message if you did not request this verification code.
  </p>
`);
