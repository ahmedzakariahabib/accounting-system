import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // user: process.env.AUTH_EMAIL,
    // pass: process.env.AUTH_PASSWORD,
    user: "ahmedxcode8@gmail.com",
    pass: "cjbhfwkiygremqwb",
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  }
  //  else
  //   {
  //   console.log("Ready to send emails");
  // }
});

const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};
export { sendEmail };
