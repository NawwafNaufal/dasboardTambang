const mongoose = require("mongoose");
require("dotenv").config();

async function directTest() {
  await mongoose.connect(process.env.MONGO_URI);
  
  console.log("✅ Connected to:", mongoose.connection.name);
  
  // Drop collection
  try {
    await mongoose.connection.db.dropCollection("dailyoperations");
    console.log("✅ Collection dropped");
  } catch (e) {
    console.log("ℹ️ Collection not found, skip");
  }
  
  // Define schema FRESH
  const ActivitySubSchema = new mongoose.Schema({
    unit: String,
    plan: Number,
    actual: Number,
    rkap: Number,
    breakdown: { type: Map, of: Number }
  }, { _id: false });
  
  const TestSchema = new mongoose.Schema({
    date: String,
    site: String,
    day: String,
    activities: { type: Map, of: ActivitySubSchema }
  }, { 
    timestamps: true,
    collection: "dailyoperations"
  });
  
  const TestModel = mongoose.model("DirectTest", TestSchema);
  
  // Test data
  const testData = {
    date: "2025-01-27",
    site: "PT Semen Tonasa",
    day: "Senin",
    activities: {
      loading_hauling: {
        unit: "ton",
        plan: 28287,
        actual: 100,
        rkap: 8075,
        breakdown: {
          toppabiring: 3611,
          batara: 3897
        }
      }
    }
  };
  
  console.log("\n📤 Data to insert:");
  console.log(JSON.stringify(testData, null, 2));
  
  // Insert
  const inserted = await TestModel.create(testData);
  console.log("\n✅ Inserted _id:", inserted._id);
  
  // Fetch from DB
  const fromDb = await TestModel.findById(inserted._id).lean();
  
  console.log("\n📥 Data from database:");
  console.log(JSON.stringify(fromDb, null, 2));
  
  // Check fields
  console.log("\n🔍 Field Check:");
  if (fromDb?.activities?.loading_hauling) {
    const lh = fromDb.activities.loading_hauling;
    console.log("unit:", lh.unit);
    console.log("plan:", lh.plan, lh.plan ? "✅" : "❌ MISSING");
    console.log("actual:", lh.actual, lh.actual ? "✅" : "❌ MISSING");
    console.log("rkap:", lh.rkap, lh.rkap ? "✅" : "❌ MISSING");
  }
  
  // Raw MongoDB query
  const raw = await mongoose.connection.db
    .collection("dailyoperations")
    .findOne({ _id: inserted._id });
    
  console.log("\n🔧 Raw MongoDB query:");
  console.log(JSON.stringify(raw, null, 2));
  
  console.log("\n📦 Mongoose version:", mongoose.version);
  
  await mongoose.disconnect();
  console.log("\n✅ Test complete");
}

directTest().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});