const Counter = require('../models/Counter');
const Fatwa = require('../models/Fatwa');

const { FATWA_SERIAL_COUNTER_ID } = require('./counters');

async function backfillFatwaSerialNumbers() {
  const hasAnySerial = await Fatwa.exists({ serialNumber: { $type: 'number' } });
  const hasMissingSerial = await Fatwa.exists({ serialNumber: { $exists: false } });

  if (!hasMissingSerial) {
    if (hasAnySerial) {
      const max = await Fatwa.findOne({ serialNumber: { $type: 'number' } })
        .sort({ serialNumber: -1 })
        .select({ serialNumber: 1 })
        .lean();

      const maxSerial = max?.serialNumber ?? 0;
      await Counter.findOneAndUpdate(
        { _id: FATWA_SERIAL_COUNTER_ID },
        { $set: { seq: maxSerial } },
        { upsert: true, returnDocument: 'after' },
      );
    }
    return;
  }

  let nextSerial = 0;

  if (hasAnySerial) {
    const max = await Fatwa.findOne({ serialNumber: { $type: 'number' } })
      .sort({ serialNumber: -1 })
      .select({ serialNumber: 1 })
      .lean();
    nextSerial = max?.serialNumber ?? 0;
  }

  const missingDocs = await Fatwa.find({ serialNumber: { $exists: false } })
    .sort({ createdAt: 1, _id: 1 })
    .select({ _id: 1 })
    .lean();

  const ops = [];
  for (const doc of missingDocs) {
    nextSerial += 1;
    ops.push({
      updateOne: {
        filter: { _id: doc._id, serialNumber: { $exists: false } },
        update: { $set: { serialNumber: nextSerial } },
      },
    });
  }

  if (ops.length > 0) {
    const BATCH_SIZE = 500;
    for (let i = 0; i < ops.length; i += BATCH_SIZE) {
      // eslint-disable-next-line no-await-in-loop
      await Fatwa.bulkWrite(ops.slice(i, i + BATCH_SIZE), { ordered: true });
    }
  }

  await Counter.findOneAndUpdate(
    { _id: FATWA_SERIAL_COUNTER_ID },
    { $set: { seq: nextSerial } },
    { upsert: true, returnDocument: 'after' },
  );
}

module.exports = { backfillFatwaSerialNumbers };
