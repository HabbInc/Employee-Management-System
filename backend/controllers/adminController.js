import jwt from "jsonwebtoken";


//Admin Login Controller
export const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      // Admin email and password check
      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        // Sign the JWT token
        const token = jwt.sign(
          { email, role: 'admin' },  // Set the role as 'admin'
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
  
        // Send the token to the client
        return res.json({ success: true, token });
      } else {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

