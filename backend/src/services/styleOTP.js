export const styleOTP = (message, duration, otp) => `
<div style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f7fb;
      padding: 20px;
      border-radius: 10px;
      color: #333;
    ">
      <h2 style="color: #007bff;">🔐 Email Verification</h2>
      <p style="font-size: 16px;">${message}</p>

      <div style="
        margin: 20px 0;
        padding: 15px;
        background-color: #ffffff;
        border: 2px dashed #007bff;
        border-radius: 8px;
        text-align: center;
      ">
        <h1 style="color: #007bff; letter-spacing: 5px;">${otp}</h1>
      </div>

      <p style="font-size: 14px; color: #555;">
        ⏰ This code will expire in <b>${duration} hour${
  duration > 1 ? "s" : ""
}</b>.
      </p>

      <p style="font-size: 14px; color: #777;">If you didn’t request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #ddd;">
      <p style="font-size: 12px; color: #999;">© ${new Date().getFullYear()} XCode Accounting System</p>
    </div>
  
`;
