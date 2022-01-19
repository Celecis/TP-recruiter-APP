/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";

const connection: any = {
  isConnected: null,
};

const uri: any = process.env.MONGODB_URI;

async function connect() {
  if (connection.isConnected) {
    console.log("Connected");
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log("use previous connection");
      return;
    }
    await mongoose.disconnect();
  }

  const mongooseConnect: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  const db = mongoose.connect(uri, mongooseConnect);
  console.log("new connection");
  connection.isConnected = mongoose.connections[0].readyState;
  return db;
}

async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log("not disconnected");
    }
  }
}

function convertDocToObj(doc: any) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  doc.recruiter = doc.recruiter?.toString();
  //doc.candidateInterviews = doc.candidateInterviews.toString();
  doc.candidateInterviews = JSON.stringify(doc.candidateInterviews);

  return doc;
}
const db = { connect, disconnect, convertDocToObj };
export default db;
