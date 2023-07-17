
**Description: Usecase and users**

This web app filters and searches through a large quantity of bike trips made in Helsinki. The primary users of this tool are presumed to be city developers. They could use this tool to gain a deeper understanding of biking patterns and identify the need for additional infrastructure based on usage.

With a redesign of the user interface and data displayed through an interactive map, this tool could be adopted by curious citizens and biking enthusiasts as well.



**How to run the project:**

Before you begin, ensure you have Node.js installed on your machine. The project also uses Git Large File Storage (LFS) to handle large files, so you'll need to have that installed as well.

1. clone repository to local machine
    - by downloading the files or running the following in your terminal:
    - git lfs clone https://github.com/RoopeMaatta/BikeApp.git
2. run in terminall:
    3. npm i
    (If you get a error, for example due to a different node version, run: npm rebuild)
    4. git lfs install
    (installs large file storage for database)
    5. git lfs pull
    (pulls the database to be locally usable)
    6. node app.js
    (runs the app)

7. And done -> start testing and using the project. 



**How to use the project: **

Search for bike trips with any number of parameters; you can also omit any. For example, you could leave the date fields empty and search just by departure time:

"departure time starting: From __ to before __"
* If you leave both blank it searches regardles of departure time.
* If you search just from 09:00 it returns all trips that have a departure time from 9:00 onwards
* If you search just to befor 11:00 it returns all trips that have a departure time before 11:00
* If you search from 09:00 to before 11:00 it returns all trips that have a departure time from 09:00 to 11:00


---------------------------------


**Background:**

This is my first actual non tutorial codig project. I wanted to try to use mainly native elements so that I could get a better understanding of them. A react app using MUI library would be very good choice to use for this kind of project.

Tests were not done in this project as I am not yet familiar with how to conduct them. Maybe later in this projects stages I will focus on learning how to do them.

This project was done completely on vsCode web brower on my ipad. As of such I didn't have the option to install and use all that much external software to use with this project

I started working from the backend to the frontend. I wanted to have all the functionality first working before going to the usersides end. Both are very important, but in this project and in its current state I focused mainly on getting the query functionality to work well. This choice was made out of personal curiousity as well as profiling the user of this assingment to be more a professional user who would benedit from a large freely usable toolset for querying. I would be interested in designing this app so that it would work moth for the professional user as well as a everyday curious citizen who wants to see a bit more a bout biketrips in his neighbourhood.



**Additional notes:**
The /scrips folder contains small tool scripts that I used troughout the project to help in various stages. For example tripsTableLog.sh was used in the terminal to give me a visual of what my trips table looked like and csvToDatabaseTrips.js is used to insert .cvs files to my database using my biketrip model.


---------------------------------


**ToDo:**
- fix csv to database import on date to unix timestamp convertion bug for some individual values
- import full databases on a pc - it seems to be very slow on ipad running vscode on a web browser.
- Make it pretty, more user friendly
    - format and style the page for better readability and understandability
    - take into acount different screen sizes
    - format results into cards/grids: .gridSearch .GridResults .cell(Flex?) .label .content .map(placeholder) 
    - group results
    - hide extra settings behind advanced search button.
    - Use Mui desing library and for example combobox elements for better functionality and UI/UX benefits. This changes the frontend to a react app.
    - search distance in km and meters instead of meters
    - Fix page number search. Currently find Trips sets the page to 1. It should check if the the page number has changed, but the query has not -> and in those cases it should not set the page number to 1.
- Show query data in infromative ways (if not too heavy of a process)
    - anytime any field is modified show how many trips query would return from a search
    - for any query return a average trip of all the trips that were found: station name/multiple sations, average distance, average duration
    - graph showing amount of Y: amount of trips and X: Date/time
    - clicking on stations field shows all station suggestions. (currently typing makes the fetch request based on what is typed). Could/should add infinite scroll pagination to the queries if possible. This though might not be at all needed if changing to React MUI ComboBox at some point.
- Tests
    - figure out how to do tests and do them.
    - reformat code into smaller testable pieces
- Map user interface
    - in narrow screens on top, and wider to the right.
    - circles for each station, radius for all minDistanceBetweenAnyStation/2.1
    - when click/touch station circle do action and indicate on map/circle
        - 1. change to query from that station
        - 2. change to query to that station
        - 3. remove from query
    - When drag from one station to another_
        - query from start station to end station
        - can drag multiple
    - indicate with lines, arrows and animations
        - quering from and to station


