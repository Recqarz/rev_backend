const nodemailer = require("nodemailer");
const UserModel = require("../models/userModel");
const FormData = require("form-data");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const axios = require("axios");

// Generate a random 6-digit number and return it as a string
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const isOTPExpired = (expirationTime) => {
  const currentTime = new Date().getTime();
  return currentTime > expirationTime;
};

const sendOtptoEmail = async (email, otp) => {
  const outlookEmail = process.env.OUTLOOK_EMAIL;
  const outlookPassword = process.env.OUTLOOK_PASSWORD;
  const fromEmail = process.env.FROMEMAIL;

  // Check if environment variables are set
  if (!outlookEmail || !outlookPassword || !fromEmail) {
    throw new Error(
      "Email credentials are not set in the environment variables."
    );
  }

  const subject = "Your one time password for Secure Access";
  const body = `Your verification code is: ${otp}. REV Shoftware \n Please don't share OTP with any one!`;

  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: outlookEmail,
      pass: outlookPassword,
    },
  });

  const mailOptions = {
    from: fromEmail,
    to: email,
    subject: subject,
    text: body,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`Email sent successfully`);
  return info.response;
};

// OTP on WhatsApp

const messageType = process.env.MESSAGE_TYPE;
const fromNumber = process.env.FROM_NUMBER;
const templateid = process.env.TEMPLATE_ID;
const serviceType = process.env.SERVICE_TYPE;
const whatsappApiKey = process.env.WHATSAPP_API_KEY;

const sendWhatsappMessage = async (whatsappnumber, otp) => {
  // console.log("first", whatsappnumber, otp);
  const formData = new FormData();
  formData.append("messageType", messageType);
  formData.append("fromNumber", fromNumber);
  formData.append("contactnumber", whatsappnumber);
  formData.append("templateid", templateid);
  formData.append("serviceType", serviceType);
  formData.append("messageuuid", "fasdlf7");
  formData.append("buttonValues", "");
  formData.append("dynamicUrl", "");
  formData.append("dynamicUrl2", "");
  formData.append("message", otp);

  const url = `https://automate.nexgplatforms.com/api/v1/wa/save-message`;

  try {
    // Use axios to send the POST request
    const response = await axios.post(url, formData, {
      headers: {
        Authorization: `${whatsappApiKey}`,
        ...formData.getHeaders(), // Ensure headers from FormData are sent
      },
    });

    console.log("WhatsApp message sent successfully");
  } catch (error) {
    console.error(`Error sending WhatsApp message: ${error.message}`);
  }
};

// OTP on sms

const sendSmsToRecipient = async (to, text) => {
  const apiUrl = `https://api2.nexgplatforms.com/sms/1/text/query`;

  const params = new URLSearchParams({
    username: process.env.NEXG_SMS_API_USERNAME,
    password: process.env.NEXG_SMS_API_PASSWORD,
    from: process.env.NEXG_SMS_API_FROM,
    to: `+91${to}`,
    text: `Your OTP for REV Platform is ${text}. It is valid for 5 minutes. Please do not share it with anyone. Team REV (RECQARZ)`,
    indiaDltContentTemplateId: process.env.NEXG_INDIAN_DLT_CONTENT_TEMPLATE_ID,
    indiaDltTelemarketerId: process.env.NEXG_TELEMARKETER_ID,
    indiaDltPrincipalEntityId:
      process.env.NEXG_SMS_API_INDIA_DLT_PRINCIPAL_ENTITY_ID,
  }).toString();

  try {
    await axios.get(`${apiUrl}?${params}`);
    console.log("SMS sent successfully");
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    // Errors are silently handled here
  }
};

// sending OTP
const sendOTP = async (req, res) => {
  try {
    const { userData } = req.body;

    const user = await UserModel.findOne({
      $or: [{ email: userData }, { mobile: userData }, { userCode: userData }],
    });

    if (!user) {
      return res.status(404).send({
        error:
          "Oops! Something went wrong. Please provide correct email/mobile/user-code.",
      });
    }

    const emailOtp = generateOTP();
    const mobileOtp = generateOTP();

    const expirationTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes from now

    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        otp: {
          expirationTime,
          emailOtp,
          mobileOtp,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).send({
        error: " Oops!. Somthing went wrong while storing OTP in database!",
      });
    }

    // Send the OTP on mail and mobile
    await sendOtptoEmail(user?.email, emailOtp);
    await sendWhatsappMessage(user?.mobile, mobileOtp);
    await sendSmsToRecipient(user?.mobile, mobileOtp);

    return res
      .status(200)
      .send({ message: "OTP has been sent to your email and mobile" });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(400).send({ error: error.message });
  }
};

// Verifing OTP
const verifyOTP = async (req, res) => {
  try {
    const { userData, eOtp, mOtp } = req.body;

    const user = await UserModel.findOne({
      $or: [{ email: userData }, { mobile: userData }, { userCode: userData }],
    });

    if (!user) {
      return res.status(404).send({
        error:
          "Oops! Something went wrong. Please provide correct email/mobile/user-code.",
      });
    }
    const { expirationTime, emailOtp, mobileOtp } = user.otp;

    if (isOTPExpired(expirationTime)) {
      return res
        .status(400)
        .send({ error: "Oops! your otp has expired please try again!" });
    }

    if (eOtp !== emailOtp) {
      return res.status(400).send({ error: "Oops! Invalied Email OTP." });
    }
    if (mOtp !== mobileOtp) {
      return res.status(400).send({ error: "Oops! Invalied Mobile OTP." });
    }

    await UserModel.findByIdAndUpdate(user._id, {
      otp: {
        isVerify: true,
      },
    });

    return res.status(200).send({ message: "your Otp has been matched!" });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(400).send({ error: error.message });
  }
};

module.exports = {
  generateOTP,
  isOTPExpired,
  sendOtptoEmail,
  sendOTP,
  verifyOTP,
  sendWhatsappMessage,
  sendSmsToRecipient,
};
