READ ME (05/30/18)

[]	Change local host back to robot's IP
[]	Change ros_connection2.txt to rosconnection2.js
[] 	imageTopic is set up and subscribed to, MUST FILL IN:
    	name : '/ROSTOPIC_FOR_IMAGE_HERE',
    	messageType : 'sensor_msgs/CompressedImage'
[!] 	/roslibjs/src/my_msgs/msg/motor_status.msg
    	Assumed data types are all float32 - if they are float64, MODIFY & REBUILD

[]	INCOMPLETE: html buttons do not have appropriate events to send a "0" drive 		command when the Forward/Backward buttons are released. The "onmouseup" 	event works for a block of text, does not work for buttons.



NOTES ---
	
[-] Error comments on Robot Status page assume the /executive/comments rostopic is of message type 'std_msgs/String'

[-] I do not see this error, I suggest "source /roslibjs/devel/setup.bash"
[ERROR] [1525311931.773517]: [Client 0] [id: advertise:/motor/set_velocity:2] advertise: Unable to load the manifest for package my_msgs. Caused by: my_msgs
ROS path [0]=/opt/ros/kinetic/share/ros
ROS path [1]=/home/pipe/radPiper/catkin_ws/src
ROS path [2]=/opt/ros/kinetic/share

[-] NO COMMAS in .csv file (need to modify parser otherwise)
[-] Column order in .csv is hard coded as-is


Completed ---

[X] "Start Measurement" button disabled until (i) all checkboxes selected (ii) velocity is in 0 - 20,000 range
[X] Pop-up to confirm after pressing "Start Measurement"
[X] Reset checkboxes after measurement command sent
[X] Connection status displayed on all 3 tabs
[X] Populate robot status: estop (left), voltage (avg), temp (avg, deg F)
[X] Error box displays /executive/comments string data
[X] Setup to show compressedImage from rostopic
