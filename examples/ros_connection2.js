// Connecting to ROS
// -----------------
var ros = new ROSLIB.Ros();

// If there is an error on the backend, an 'error' emit will be emitted.
ros.on('error', function(error) {
document.getElementById('connecting').style.display = 'none';
document.getElementById('connected').style.display = 'none';
document.getElementById('closed').style.display = 'none';
document.getElementById('error').style.display = 'inline';
document.getElementById('connecting2').style.display = 'none';
document.getElementById('connected2').style.display = 'none';
document.getElementById('closed2').style.display = 'none';
document.getElementById('error2').style.display = 'inline';
document.getElementById('connecting3').style.display = 'none';
document.getElementById('connected3').style.display = 'none';
document.getElementById('closed3').style.display = 'none';
document.getElementById('error3').style.display = 'inline';
console.log(error);
});

// Find out exactly when we made a connection.
ros.on('connection', function() {
console.log('Connection made!');
document.getElementById('connecting').style.display = 'none';
document.getElementById('error').style.display = 'none';
document.getElementById('closed').style.display = 'none';
document.getElementById('connected').style.display = 'inline';
document.getElementById('connecting2').style.display = 'none';
document.getElementById('error2').style.display = 'none';
document.getElementById('closed2').style.display = 'none';
document.getElementById('connected2').style.display = 'inline';
document.getElementById('connecting3').style.display = 'none';
document.getElementById('error3').style.display = 'none';
document.getElementById('closed3').style.display = 'none';
document.getElementById('connected3').style.display = 'inline';
});

ros.on('close', function() {
console.log('Connection closed.');
document.getElementById('connecting').style.display = 'none';
document.getElementById('connected').style.display = 'none';
document.getElementById('closed').style.display = 'inline';
document.getElementById('connecting2').style.display = 'none';
document.getElementById('connected2').style.display = 'none';
document.getElementById('closed2').style.display = 'inline';
document.getElementById('connecting3').style.display = 'none';
document.getElementById('connected3').style.display = 'none';
document.getElementById('closed3').style.display = 'inline';
});

// Create a connection to the rosbridge WebSocket server.
//ros.connect('ws://localhost:9090');
ros.connect('ws://10.0.10.3:9090');

// Publishing a Topic
// ------------------

// Create a Topic object with details of the topic's name and message type.
var startCmd = new ROSLIB.Topic({
    ros : ros,
    // name of the channel
    name : '/executive/start_command',
    messageType : 'my_msgs/start_command'
});

var setVel = new ROSLIB.Topic({
    ros : ros,
    name: '/motor/set_velocity',
    messageType: 'my_msgs/set_velocity'
})

var command = new ROSLIB.Message({
    velocity : 0.0,
    user_notes : "",
    user_tech_name : "",
    project_name : "",
    requestor : "",
    request_number : "",
    letter_number : "",
    revision : 0,
    job_id : 0,
    location : "",
    item_id : 0,
    item_number : "",
    building : "",
    unit : "",
    cell : "",
    stage : "",
    floor : "",
    abbreviation : "",
    length : 0.0,
    diameter : 0.0,
    tags : ""
});

var buttonVel = new ROSLIB.Message({
    vel_left_cps : 0.0,
    vel_right_cps : 0.0
});


//Subscribing to a Topic
//----------------------

// Like when publishing a topic, we first create a Topic object with details of the topic's name
// and message type. Note that we can call publish or subscribe on the same topic object.

var listenMotor = new ROSLIB.Topic({
    ros : ros,
    name: '/motor_status',
    messageType : 'my_msgs/motor_status'
});

listenMotor.subscribe(function(message) {
    // console.log('Received message on' + listenMotor.name);
    // console.log(message.left_estop_status);
    estop = document.getElementsByName('ms_output');
    estop[0].value = message.left_estop_status;
    voltage = document.getElementsByName('v_output');
    voltage[0].value = (message.right_voltage_volts + message.left_voltage_volts)/2; // + message.right_voltage_volts)/2;
    temp = document.getElementsByName('temp_output');
    var avg = ((message.left_temperature_celsius + message.right_temperature_celsius)*1.8/2) + 32;
    temp[0].value = avg;
});

var listenComments = new ROSLIB.Topic({
    ros : ros,
    name : '/executive/comments',
    messageType : 'std_msgs/String'
});

// // Then we add a callback to be called every time a message is published on this topic.
listenComments.subscribe(function(message) {
// console.log('Received message on ' + listenComments.name + ': ' + message.data);
document.getElementsByName('errors')[0].value = message.data;
// If desired, we can unsubscribe from the topic as well.
// listener.unsubscribe();
});

var imageTopic = new ROSLIB.Topic({
    ros : ros,
    name : '/ROSTOPIC_FOR_IMAGE_HERE',
    messageType : 'sensor_msgs/CompressedImage'
});

imageTopic.subscribe(function(message)
{
   var imagedata = "data:image/jpeg;base64," + message.data;
   document.getElementById('roboPIC').setAttribute('src', imagedata);
});

// Method that checks conditions to enable/disable 'Start Measurement' button
function cb() {
    var s1 = document.getElementById("cpl").checked ? 1 : 0;
    var s2 = document.getElementById("cpn").checked ? 1 : 0;
    var s3 = document.getElementById("cpd").checked ? 1 : 0;
    var s4 = document.getElementById("cps").checked ? 1 : 0;
    var s5 = document.getElementById("clr").checked ? 1 : 0;
    var s6 = document.getElementById("cpl2").checked ? 1 : 0;
    var s7 = document.getElementById("cpn2").checked ? 1 : 0;
    var s8 = document.getElementById("cpd2").checked ? 1 : 0;
    var s9 = document.getElementById("cps2").checked ? 1 : 0;
    var s10 = document.getElementById("clr2").checked ? 1 : 0;

    vel = Number(document.getElementById("velocityText").value);
    var v = 0;
    if (vel >= 0 && vel<=20000) {
        document.getElementById("vflag").innerText = "";
        v = 1;
    }
    else {
        document.getElementById("vflag").innerText = "Please select a velocity command in range: 0 to 20,000";
    }

    var total = s1 + s2 + s3 + s4 + s5 + s6 + s7 + s8 + s9 + s10 + v;
    // console.log(total)

    var startMbtn = document.getElementById('sendCmd');
    if (total==11) {
        startMbtn.disabled = false;
    }
    else {
        startMbtn.disabled = true;
    }
}

/* This function:
- Retrieves numeric values from the text boxes
- publishes the message to the start_command topic.
*/
function pubStartCmd() {

    command.velocity = Number(document.getElementById("velocityText").value) * 1400;

    command.user_notes = document.getElementById("userNotesText").value;
    command.user_tech_name = document.getElementById("userTechText").value;
    command.project_name = document.getElementById("projectNameText").value;
    command.requestor = document.getElementById("requestorText").value;
    command.request_number = document.getElementById("requestNoText").value;
    command.letter_number = document.getElementById("letterNoText").value;

    // command.revision = Number(document.getElementById("revisionText").value);
    command.job_id = Number(document.getElementById("jobIDText").value);

    // command.location = document.getElementById("locationText").value;

    command.item_id = Number(document.getElementById("itemIDText").value);

    command.item_number = document.getElementById("itemNoText").value;
    // command.building = document.getElementById("buildingText").value;
    // command.unit = document.getElementById("unitText").value;
    // command.cell = document.getElementById("cellText").value;
    // command.stage = document.getElementById("stageText").value;
    // command.floor = document.getElementById("floorText").value;
    // command.abbreviation = document.getElementById("abbrevText").value;

    command.length = Number(document.getElementById("lengthText").value);
    command.diameter = Number(document.getElementById("diameterText").value);

    command.tags = document.getElementById("tagsText").value;

    startCmd.publish(command);
}

// Publishes Wheel Velocity Commands
function pubVel(a) {
    buttonVel.vel_left_cps = a*14000;
    buttonVel.vel_right_cps = a*14000;

    setVel.publish(buttonVel);
}

var bwdB = document.getElementById("bwBtn");
var fwdB = document.getElementById("fwBtn");


var lines = [];
var oldMenu = null;

// Parse .csv file - NO COMMAS IN DATA!!
function parseCSV(){
    var x = document.getElementById("job_file");
    var txt = "";
    var line = "";
    if ('files' in x) {
        if (x.files.length == 0) {
            txt = "Select one or more files.";
        } else {
            for (var i = 0; i < x.files.length; i++) {
                //txt += "<br><strong>" + (i+1) + ". file</strong><br>";
                var file = x.files[i];
                if ('name' in file) {
                    //txt += "name: " + file.name + "<br>";
                    console.log(file.name);
                }
                if ('size' in file) {
                    //txt += "size: " + file.size + " bytes <br>";
                }

                // What to do with the file
                // create a reader object to read the file
                var reader = new FileReader();

                // what happens after the file is loaded successfully
                reader.onload = function (e) {

                    // clear out lines when a new file is uploaded
                    lines = [];

                    var csv_data = e.target.result;
                    var allTextLines = csv_data.split(/\r\n|\n/);
                    // console.log(allTextLines);

                    for (var i=0; i<allTextLines.length; i++) {
                        var data = allTextLines[i].split(';');
                            var tarr = [];
                            for (var j=0; j<data.length; j++) {
                                tarr.push(data[j]);
                            }
                            // lines.push(tarr);
                            // console.log(tarr[0].split(','))
                            lines.push(tarr[0].split(','))

                    }
                    console.log(lines)

                    // clear anything in the menu
                    if (oldMenu != null){
                        console.log("Found old menu");
                        // because length changes as you are removing things you must save an old copy of the length
                        var oldLength = oldMenu.length;
                        for (var i = 1; i< oldLength; i++){
                            oldMenu.remove(1);
                            console.log(i);
                        }
                    }
                    console.log(oldMenu)

                    for (var i=1; i<lines.length; i++){
                        var menu = document.getElementById("myMenu");
                        var option = document.createElement("option");

                        if (lines[i][0] == ""){
                            console.log("Found none");
                        } else {
                            console.log(lines[i][9]);
                            option.text = lines[i][9];
                            option.value = i;
                            menu.add(option);
                        }
                    }

                    oldMenu = document.getElementById("myMenu");

                }
                reader.readAsText(file);


            }
        }
    }
    else {
        if (x.value == "") {
            txt += "Select one or more files.";
        } else {
            txt += "The files property is not supported by your browser!";
            txt  += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead.
        }
    }
    document.getElementById("file_status").innerHTML = txt;
}


// Auto fill based on drop down list selection
function job_select(){
    var x = document.getElementById("myMenu").value;
    // document.getElementById("job_num").innerHTML = "You selected: " + x;
    var row = Number(x)
    console.log(row);
    if (row ==0){
        return;
    }

    document.getElementById("job_num").innerHTML = "You selected item number: " + lines[row][9];

    userTech_item = document.getElementById("userTechText");
    userTech_item.value = lines[row][0];
    // userTech_ROS = userTech_item.value

    projectName_item = document.getElementById("projectNameText");
    projectName_item.value = lines[row][1];

    requestor_item = document.getElementById("requestorText");
    requestor_item.value = lines[row][2];

    requestNo_item = document.getElementById("requestNoText");
    requestNo_item.value = lines[row][3];

    letterNo_item = document.getElementById("letterNoText");
    letterNo_item.value = lines[row][4];

    // revision_item = document.getElementById("revisionText");
    // revision_item.value = lines[row][5];
    command.revision = Number(lines[row][5]);

    jobID_item = document.getElementById("jobIDText");
    jobID_item.value = lines[row][6];

    // location_item = document.getElementById("locationText");
    // location_item.value = lines[row][7];
    command.location = lines[row][7];

    itemID_item = document.getElementById("itemIDText");
    itemID_item.value = lines[row][8];

    itemNo_item = document.getElementById("itemNoText");
    itemNo_item.value = lines[row][9];

    // building_item = document.getElementById("buildingText");
    // building_item.value = lines[row][10];
    command.building = lines[row][10];

    // unit_item = document.getElementById("unitText");
    // unit_item.value = lines[row][11];
    command.unit = lines[row][11];

    // cell_item = document.getElementById("cellText");
    // cell_item.value = lines[row][12];
    command.cell = lines[row][12];

    // stage_item = document.getElementById("stageText");
    // stage_item.value = lines[row][13];
    command.stage = lines[row][13];

    // floor_item = document.getElementById("floorText");
    // floor_item.value = lines[row][14];
    command.floor = lines[row][14];

    // abbrev_item = document.getElementById("abbrevText");
    // abbrev_item.value = lines[row][15];
    command.abbreviation = lines[row][15];

    length_item = document.getElementById("lengthText");
    length_item.value = lines[row][16];

    diameter_item = document.getElementById("diameterText");
    diameter_item.value = lines[row][17];

    tags_item = document.getElementById("tagsText");
    tags_item.value = lines[row][19];

}

// Switches between tabs
function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Sends start measurement command and clears checkboxes
function verifyCmd() {
    var txt;
    if (confirm("Please verify the start command for the robot")) {
        pubStartCmd();

        a = document.getElementById("cpl");
        a.checked = false;
        b = document.getElementById("cpn");
        b.checked = false;
        c = document.getElementById("cpd");
        c.checked = false;
        d = document.getElementById("cps");
        d.checked = false;
        e = document.getElementById("clr");
        e.checked = false;
        f = document.getElementById("cpl2");
        f.checked = false;
        g = document.getElementById("cpn2");
        g.checked = false;
        h = document.getElementById("cpd2");
        h.checked = false;
        i = document.getElementById("cps2");
        i.checked = false;
        j = document.getElementById("clr2");
        j.checked = false;

        k = document.getElementById("validatingTechnician");
        k.value = "";

        startBtn = document.getElementById('sendCmd');
        startBtn.disabled = true;
    }
}


// UNCOMMENT TO SEE INSTRUCTIONS (and debug) IN CONSOLE!

// console.log('Start Up: Run the following commands in the terminal then refresh this page.');
// console.log('(1) roscore');

// console.log('(2a) source roslibjs/devel/setup.bash [OPTIONAL, for debug] ');
// console.log('(2b) rostopic echo /executive/start_command [OPTIONAL, for debug] ');
// console.log('(3a) source roslibjs/devel/setup.bash [OPTIONAL, for debug] ');
// console.log('(3b) rostopic echo /motor/set_velocity [OPTIONAL, for debug] ');

// console.log('(4a) source roslibjs/devel/setup.bash');
// console.log('(4b) roslaunch rosbridge_server rosbridge_websocket.launch');

// console.log('To test listeners:')
// console.log('(5) rostopic pub /executive/comments std_msgs/String "Testing error box"');
// console.log('(6) rostopic pub /motor_status my_msgs/motor_status "{left_estop_status: False, right_estop_status: False, left_current_amps: -1.00999999046, right_current_amps: -0.460000008345, left_encoder_counts: -9422.0, right_encoder_counts: -10307.0, left_velocity_cps: 0.0, right_velocity_cps: 0.0, left_voltage_volts: 26.3999996185, right_voltage_volts: 26.6000003815, left_temperature_celsius: 26.0, right_temperature_celsius: 28.0}"');
