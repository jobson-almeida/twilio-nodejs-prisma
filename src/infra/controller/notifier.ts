import { Twilio } from 'twilio';

type NotifierType = {
  countryCode: string
  phoneNumber: string
  validationCode: number
}

export default class Notifier {
  async sendMessage(notifier: NotifierType): Promise<void> {
    const accountId = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER

    if (accountId && authToken && phoneNumber) {
      const client = new Twilio(accountId, authToken);

      client.messages.create({
        to: "+" + notifier.countryCode + notifier.phoneNumber,
        from: phoneNumber,
        body: buildMessage(notifier.validationCode)
      })
        .then((message) => {
          console.log(message.body);
          console.log(message.sid)
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("Twilio credentials not found")
    }
    //  console.log("validation code: " + notifier.validationCode)
  }
};

const buildMessage = (code: number) => {
  const message = "validation code: " + code;
  return message;
};

