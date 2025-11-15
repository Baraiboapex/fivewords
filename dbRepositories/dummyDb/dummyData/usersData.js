const USERS_DATA = {
  "6a8e71c2-b822-4cfd-988e-15fb566fb88e":{
    id: "6a8e71c2-b822-4cfd-988e-15fb566fb88e",
    dateCreated: dayjs(new Date().toISOString())
      .subtract(2, "days")
      .format("MM-DD-YYYY"),
    email: "datGuy3@gmail.com",
    password: "Welcome3",
    userMistakes:{
      "90f06ea9-7cd1-4d94-90b7-5c5c7833a9bc":{
        id: "90f06ea9-7cd1-4d94-90b7-5c5c7833a9bc",
        dateCreated: dayjs(new Date().toISOString())
          .subtract(2, "days")
          .format("MM-DD-YYYY"),
        mistakeName: "I screwed up 1",
        mistakeDescription: "I did something wrong 1 and it was quite stupid LOL.",
        isDeleted:false
      },
      "16b0d9fd-9657-4b28-98c8-0ee03f09c1fa":{
        id: "16b0d9fd-9657-4b28-98c8-0ee03f09c1fa",
        dateCreated: dayjs(new Date().toISOString())
          .subtract(1, "days")
          .format("MM-DD-YYYY"),
        mistakeName: "I screwed up 2",
        mistakeDescription: "I did something wrong 2 and it was quite stupid LOL.",
        isDeleted:false
      },
      "d4138230-4f77-4491-91a6-6b0e2b63c080":{
        id: "d4138230-4f77-4491-91a6-6b0e2b63c080",
        dateCreated: dayjs(new Date().toISOString()).format("MM-DD-YYYY"),
        mistakeName: "I screwed up 3",
        mistakeDescription: "I did something wrong 3 and it was quite stupid LOL.",
        isDeleted:false
      },
    }
  },
  "9d678790-1285-4ed7-844e-60f6d9baed3a":{
    id: "9d678790-1285-4ed7-844e-60f6d9baed3a",
    dateCreated: dayjs(new Date().toISOString())
      .subtract(1, "days")
      .format("MM-DD-YYYY"),
    email: "datGuy2@gmail.com",
    password: "Welcome2",
    userMistakes:{
      "26bafb13-9900-4025-985d-cc1017a2da6b":{
        id: "26bafb13-9900-4025-985d-cc1017a2da6b",
        dateCreated: dayjs(new Date().toISOString())
          .subtract(2, "days")
          .format("MM-DD-YYYY"),
        mistakeName: "I screwed up 1",
        mistakeDescription: "I did something wrong 1 and it was quite stupid LOL.",
        isDeleted:false
      },
      "0078cee4-b51a-48a4-9601-35cfff283381":{
        id: "0078cee4-b51a-48a4-9601-35cfff283381",
        dateCreated: dayjs(new Date().toISOString())
          .subtract(1, "days")
          .format("MM-DD-YYYY"),
        mistakeName: "I screwed up 2",
        mistakeDescription: "I did something wrong 2 and it was quite stupid LOL.",
        isDeleted:false
      },
      "cce51e2d-a715-412e-9a96-1f71d0160790":{
        id: "cce51e2d-a715-412e-9a96-1f71d0160790",
        dateCreated: dayjs(new Date().toISOString()).format("MM-DD-YYYY"),
        mistakeName: "I screwed up 3",
        mistakeDescription: "I did something wrong 3 and it was quite stupid LOL.",
        isDeleted:false
      },
    }
  },
  "2da86ac3-40bb-49a2-a61e-c2567c6a550a":{
    id: "2da86ac3-40bb-49a2-a61e-c2567c6a550a",
    dateCreated: dayjs(new Date().toISOString()).format("MM-DD-YYYY"),
    email: "datGuy1@gmail.com",
    password: "Welcome2",
    userMistakes:{
      "f0fb03e7-e815-4265-8fa6-14e4c7f09830":{
        id: "f0fb03e7-e815-4265-8fa6-14e4c7f09830",
        dateCreated: dayjs(new Date().toISOString())
          .subtract(2, "days")
          .format("MM-DD-YYYY"),
        mistakeName: "I screwed up 1",
        mistakeDescription: "I did something wrong 1 and it was quite stupid LOL.",
        isDeleted:false
      },
      "f6794f4e-e071-4bc7-be93-e6cc5406e354":{
        id: "f6794f4e-e071-4bc7-be93-e6cc5406e354",
        dateCreated: dayjs(new Date().toISOString())
          .subtract(1, "days")
          .format("MM-DD-YYYY"),
        mistakeName: "I screwed up 2",
        mistakeDescription: "I did something wrong 2 and it was quite stupid LOL.",
        isDeleted:false
      },
      "9edb9324-4032-43da-9c9a-ee80ea8104b4":{
        id: "9edb9324-4032-43da-9c9a-ee80ea8104b4",
        dateCreated: dayjs(new Date().toISOString()).format("MM-DD-YYYY"),
        mistakeName: "I screwed up 3",
        mistakeDescription: "I did something wrong 3 and it was quite stupid LOL.",
        isDeleted:false
      },
    }
  }
};

module.exports={
    USERS_DATA
};