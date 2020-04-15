const electron = require('electron');
const uuid = require("uuid").v4;
uuid();

const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;

let mainWindow;
let createWindow;

let allAppointments = [];

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        title: 'Rizki Car Rental'
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.on('closed', () => {
        app.quit();
        mainWindow = null;
    });
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

const listWindowCreator = ()=>{
    listWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "List Rentals"
    });
    listWindow.setMenu(null);
    listWindow.loadURL(`file://${__dirname}/rent/list.html`);
    listWindow.on("closed", ()=> (listWindow = null));
};

ipcMain.on("appointment:create", (event, appointment) => {
    appointment["id"] = uuid();
    appointment["done"] = 0;
    allAppointments.push(appointment);
    console.log(allAppointments);
});

ipcMain.on("appointment:request:list", event => {
    listWindow.webContents.send('appointment:response:list', allAppointments);
});

ipcMain.on("appointment:done", (event, id) => {
    console.log("here3");
});

const menuTemplate = [{
    label: "File",
    submenu: [
        {
            label: "All Appoitments",
            click() {
                listWindowCreator();
            }
        },
        {
            label: "Quit",
            accelerator: process.platform === "darwin" ? "Command+Q" : 
            "Ctrl + Q",
            click() {
                app.quit();
            }
        }
    ]
},
{
    label: "View",
    submenu: [{ role: "reload" }, { role: "toogledevtools" }]
}
]