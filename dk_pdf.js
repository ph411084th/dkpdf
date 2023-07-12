const puppeteer = require("puppeteer");
const AWS = require("aws-sdk");

exports.handler = async (event, context) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://google.com", { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4" });

  await browser.close();

  const s3 = new AWS.S3();
  const params = {
    Bucket: "kantafakture",
    Key: "output.pdf",
    Body: pdfBuffer,
    ContentType: "application/pdf"
  };

  await s3.putObject(params).promise();
};
