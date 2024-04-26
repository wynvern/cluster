import { createTransport } from "nodemailer";

const sendMail = (email, subject, html) => {
	let mailOptions = {
		from: `${process.env.MAIL_USERNAME}@gmail.com`,
		to: email,
		subject: subject,
		html: html,
	};

	const transporter = createTransport({
		service: "gmail",
		auth: {
			type: "OAuth2",
			user: process.env.MAIL_USERNAME,
			pass: process.env.MAIL_PASSWORD,
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
		},
	});

	console.log("sending email");

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			return error;
		} else {
			return info;
		}
	});
};

export default sendMail;
