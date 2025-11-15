import _ from "lodash";

const {
    USERS_DATA
} = require("./dummyData/usersData.js");
const {
   PASSWORD_RESET_DATA
} = require("./dummyData/passwordResetData.js");

const dbContainer = {
    dbObject: null,
    dbInteractor: null,
    async createDatabase({config, name}) {
        console.log(config, name)
        const db = {
            users:USERS_DATA,
            passwordReset:PASSWORD_RESET_DATA
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
                if (auth.dbName) {
                    const database = this.dbObject[auth.dbName];

                    let data = null;

                    if(auth.dbPath){
                        data = _.get(database, auth.dbPath);
                    }

                    if(auth.dbFind){
                        data = _.find(database, auth.dbfind);
                    }
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
                    if (auth.dbName) {
                        const database = this.dbObject[auth.dbName];
                        _.set(database, auth.dbPath, auth.newData);
                    }
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
                    if (auth.dbName) {
                        const database = this.dbObject[auth.dbName];
                        _.unset(database, auth.dbPath);
                    }
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