import dotenv from 'dotenv'; 

dotenv.config();

import { getDatabase, ref, child, get, set, goOffline } from "firebase/database";
import { collection, query, where } from "firebase/firestore";

const firebaseHashesDbConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_PORT,
  databaseURL: process.env.FIREBASE_ADMIN_DATABASE_URL,
  projectId: "fivewords-8d3cf",
  storageBucket: "fivewords-8d3cf.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const dbContainer = {
  dbObject: null,
  dbInteractor: null,
  dbData:null,
  async loadDb() {
    await this.createDatabase(firebaseHashesDbConfig , "users");
    return this;
  },
  async createDatabase(config, name) {
    const dbInitializer = initializeApp(config, name);
    const db = getDatabase(dbInitializer);
    
    this.dbInteractor = db;
    return Promise.resolve(true);
  },
  async getData(config) {
    //This needs to be re-written!!!
    try{
      if (this.dbObject) {
        return new Promise(async (resolve, reject) => {
            if(config){
              await this.refreshDatabase();
              const data = this.dbData;

              if(data != null){
                const dbRef = ref(this.dbInteractor, config.dbName);
                const path = config.dbPath.join("/");
                const dataQuery = query(
                  collection(dbRef, config.dbName),
                  where(path)
                )
                
                const getData = await get(dataQuery);

                if(getData !== null){
                  resolve(getData);
                }else{
                  reject("The requested item could not be found");
                }
              }
            }else{
              reject("You must provide user data in order to search");
            }
        });
      }
    }catch(err){
      console.log("FFFFFFF");
      
    }
  },
  async addData(config) {
    if (this.dbObject) {
      //TEMP
      return new Promise((resolve, reject) => {
        const path = config.dbPath.join("/");
        set(
          ref(this.dbInteractor, config.dbName+"/"+path),
          config.newData
        ).then(() => {
          resolve(true);
        }).catch((err)=>{
          reject(err);
        });
      });
    }
  },
  async updateData(config) {
    if (this.dbObject) {
      //TEMP
      return new Promise((resolve, reject) => {
        const path = config.dbPath.join("/");
        update(
          ref(this.dbInteractor, config.dbName+"/"+path),
          config.changedData
        ).then(() => {
          resolve(true);
        }).catch((err)=>{
          reject(err);
        });
      });
    }
  },
  closeDatabaseConnection(){
    goOffline(this.dbInteractor);
  }
};

const userData = () => ({
  getDatabaseRules(val, database) {
    rules.domainMatches(val, database);
  },
  async buildDatabase(){
    const database = await dbContainer.loadDb();
    return database;
  },
});

module.exports={
    userData
};