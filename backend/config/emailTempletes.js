export const REGISTRATION_TEMPLATE = (name, companyName) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome to ${companyName} - Employee Registration Successful</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">

    <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center">
                <table width="600px" cellspacing="0" cellpadding="0" 
                    style="background: #ffffff; border-radius: 10px; overflow: hidden; 
                    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background: #004080; padding: 30px;">
                            <h1 style="color: #ffffff; margin: 0;">Welcome to ${companyName}, ${name}! 🎉</h1>
                            <p style="color: #ffffff; font-size: 18px;">Your employee account is now activated.</p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <h2 style="color: #333;">Your Employee Management System Access</h2>
                            <p style="font-size: 16px; color: #555;">
                                We're thrilled to have you on board! Your employee account has been successfully created in our system.
                            </p>

                            <h3 style="color: #004080; font-size: 18px;">✨ Key Benefits:</h3>
                            <ul style="text-align: left; display: inline-block; font-size: 16px; color: #555;">
                                <li>📊 **Manage sales & transactions seamlessly**</li>
                                <li>🔐 **Secure login & role-based access**</li>
                                <li>🚀 **Boost your efficiency with automated features**</li>
                                <li>📈 **Track reports & performance in real time**</li>
                            </ul>

                            <p style="font-size: 16px; color: #555;">
                                Click below to log in and start using the Employee Management System.
                            </p>

                            <a href="http://yourcompany.com/login" 
                                style="display: inline-block; padding: 14px 30px; background: #004080; 
                                color: #fff; text-decoration: none; font-size: 18px; border-radius: 5px; 
                                font-weight: bold;">
                                Access Your Dashboard
                            </a>

                            <p style="font-size: 14px; color: #777; margin-top: 20px;">
                                If you have any questions, feel free to contact our support team.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background: #222; padding: 20px;">
                            <p style="color: #fff; font-size: 14px;">
                                Need assistance? Contact us at 
                                <a href="mailto:support@yourcompany.com" 
                                style="color: #00aaff; text-decoration: none;">
                                    support@yourcompany.com
                                </a>.
                            </p>
                            <p style="color: #fff; font-size: 14px;">
                                &copy; 2025 ${companyName}. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>`;
