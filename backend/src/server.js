const express = require("express"); //moteur du serveur
const cors = require("cors"); //Permet la communication avec le front

const app = express(); //création du serveur web
app.use(express.json()); //Si on reçoit du json -> permet le parsing
app.use(cors()); // Autorise le front à communiquer

const {login, me} = require("./auth/authController")
const {requireAuth} = require("./auth/authMiddleware");
const {signup} = require("./signedUp");
const {publicEvent, allEvents, createdByEvents, createEvent, deleteEvent, changeEvent} = require('./event/eventController')
const {getAllCategory} = require("./category/categoryController");
const {subscribeEvent, unsubscribeEvent, getEventParticipants} = require("./UserEvent/linkUserEventController");

//Routes
app.post("/api/login", login);
app.get("/api/me", requireAuth,me);
app.post("/api/signup", signup);
app.get("/api/publicEvent",publicEvent);
app.get("/api/allEvents",requireAuth, allEvents);
app.get("/api/createdByEvents",requireAuth, createdByEvents);
app.post("/api/createEvent",requireAuth, createEvent);
app.delete("/api/deleteEvent",requireAuth, deleteEvent);
app.put("/api/modifyEvent", requireAuth, changeEvent);
app.get("/api/allCategories", getAllCategory);
app.post("/api/subscribeEvent", requireAuth, subscribeEvent);
app.delete("/api/unsubscribeEvent", requireAuth, unsubscribeEvent);
app.get("/api/events/:id/participants", getEventParticipants);


//Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})