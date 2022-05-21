const fs = require('fs');

function readLogJson(filePath) {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  return {};
}


async function createTemplate(
  airnode,
  providerId,
  endpointId,
  requesterInd,
  designatedWallet,
  fulfillAddress,
  fulfillFunctionId,
  parameters
) {
  const receipt = await airnode.createTemplate(
    providerId,
    endpointId,
    requesterInd,
    designatedWallet,
    fulfillAddress,
    fulfillFunctionId,
    parameters
  );
  return new Promise((resolve) =>
    airnode.provider.once(receipt.hash, (tx) => {
      const parsedLog = airnode.interface.parseLog(tx.logs[0]);
      resolve(parsedLog.args.templateId);
    })
  );
  
}


module.exports = {
  updateLogJson: function (name, value) {
    const filePath = './log.json';
    const logJson = readLogJson(filePath);
    logJson[name] = value;
    fs.writeFileSync(filePath, JSON.stringify(logJson, null, 4));
  },
  readFromLogJson: function (name) {
    const filePath = './log.json';
    return readLogJson(filePath)[name];
  },
  readFromReceipt: function (name) {
    const files = fs.readdirSync('./config');
    const receiptFiles = files.filter((file) => /\.receipt.json$/.test(file));
    if (receiptFiles.length === 0) {
      return null;
    }
    if (receiptFiles.length > 1) {
      throw new Error(`${receiptFiles.length} receipt files in ./config, expected 1`);
    }
    const receipt = JSON.parse(fs.readFileSync(`./config/${receiptFiles[0]}`, 'utf-8'));
    return receipt[name];
  },
  createTemplate
};
