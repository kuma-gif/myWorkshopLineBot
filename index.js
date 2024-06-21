const line = require("@line/bot-sdk");
const express = require("express");
const fortunes = require("./fortune.json");

const lineConfig = {
  channelSecret: "d920d1f131577cbd4168a7f2ef8ce830",
  channelAccessToken:
    "r4+JZcccfIztnVOtOG1BpxKeYtZyy6y/bCP31Sa16DdmnvlyPlNmRXW+xEm+lJ8AHAvaxj4jA+uX39dl+StPt5RnFNKSFdDtWJCig8/3P69SmxvhIWwyEvjH30tCAELjsobmxxvm0SCv7IfTFfjO5QdB04t89/1O/w1cDnyilFU=",
};
const messagingClient = new line.messagingApi.MessagingApiClient(lineConfig);

const app = express();
app.post("/", line.middleware(lineConfig), handlePostRequest);
app.listen(3000);

async function handlePostRequest(req, res) {
  const { events } = req.body;

  const eventHandledPromises = events.map(handleLineEvent);

  const result = await Promise.all(eventHandledPromises);

  return res.send(result);
}

const FortuneCategory = {
  Love: "love",
  Career: "career",
  Finance: "finance",
  Health: "health",
};

function getFortune(category) {
  const index = Math.floor(Math.random() * fortunes[category].length);
  return fortunes[category][index];
}

let count = 1;

function getAllFortuneMessages() {
  const fortuneMessages = [
    `ดูดวงประจำวันครั้งที่ ${count++}`,
    `ด้านความรัก\n${getFortune(FortuneCategory.Love)}`,
    `ด้านการงาน\n${getFortune(FortuneCategory.Career)}`,
    `ด้านการเงิน\n${getFortune(FortuneCategory.Finance)}`,
    `ด้านสุขภาพ\n${getFortune(FortuneCategory.Health)}`,
  ];

  return fortuneMessages;
}

function reply(event, ...messages) {
  return messagingClient.replyMessage({
    replyToken: event.replyToken,
    messages: messages.map((message) => ({
      type: "text",
      text: message,
    })),
  });
}

function handleLineEvent(event) {
  // หยิบเอา text จาก message ใน event ออกมา
  const text = event.message.text;

  if (text === "ดูดวง") {
    return reply(event, ...getAllFortuneMessages());
  } else {
    return reply(event, "ครับ.."); // << ใส่ข้อความตรง ???
  }
}
