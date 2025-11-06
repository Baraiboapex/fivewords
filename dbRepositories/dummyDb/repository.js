import _ from "lodash";

const {
    USERS_DATA
} = require("./dummyData/usersData.js");
const {
    MISTAKES_DATA
} = require("./dummyData/mistakesData.js");

const dbContainer = {
    dbObject: null,
    dbInteractor: null,
    async createDatabase({config, name}) {
        console.log(config, name)
        const db = {
            users:USERS_DATA,
        };
        const dbObj = db;

        this.dbInteractor = db;
        this.dbObject = dbObj;
        return Promise.resolve(true);
    },
    async getData(auth) {
        if (this.dbObject) {
            return new Promise((resolve, reject) => {
            try {
                if (auth.keyToFilterBy) {
                const database = this.dbObject[auth.dbName];
                const data = _.get(database, auth.dbName)
                resolve(data);
                }
            } catch (err) {
                reject(err);
            }
            });
        }
    },
    async saveDataChanges(auth) {
        if (dbObject) {
            return new Promise((resolve, reject) => {
                try {
                    const database = this.dbObject[auth.dbName];
                    _.set(database, auth.dbPath, auth.newData);
                } catch (err) {
                    reject(err);
                }
            });
        }
    },
    async deleteDataChanges(auth){
        if (dbObject) {
            return new Promise((resolve, reject) => {
                try {
                    const database = this.dbObject[auth.dbName];
                    _.unset(database, auth.dbName);
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}

module.exports = {
    dbContainer
};