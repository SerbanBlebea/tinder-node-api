const firebase = require('firebase-admin')
require('dotenv').config()
const firebaseJson = require('./../tinder-node-api-firebase.json')

firebase.initializeApp({
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    credential: firebase.credential.cert(firebaseJson)
})

const database = firebase.database()

const storeChatBotData = (payload)=> {
    database.ref('chatbot').set(payload)
}

const getChatBotData = (callback)=> {
    database.ref('chatbot').once('value', (snapshot)=> {
        callback(snapshot.val())
    })
}

const updateChatBotData = (payload)=> {
    if(!Array.isArray(payload)) throw 'The payload should be an array'
    getChatBotData((oldData)=> {
        let newData = oldData.concat(payload)
        storeChatBotData(newData)
    })
}

const storeTask = (task, callback)=> {
    if(typeof task !== 'object') throw 'Task should be an object'
    getTasks((oldTasks)=> {
        let newTasks = (oldTasks !== null) ? oldTasks.concat([task]) : [task]
        database.ref('tasks').set(newTasks)
    })
}

const getTasks = (callback)=> {
    database.ref('tasks').once('value', (snapshot)=> {
        callback(snapshot.val())
    })
}

module.exports = {
    storeChatBotData,
    getChatBotData,
    updateChatBotData,
    storeTask,
    getTasks
}
