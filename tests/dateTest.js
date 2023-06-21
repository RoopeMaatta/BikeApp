let dateTimeStrs = [
    "2021-05-31T23:28:16", // error when importing csv to database
    "2021-05-31T23:27:33", // error when importing csv to database
    '2021-06-01T15:45:49', // error when importing csv to database
    "2021-05-31T23:30:45", // error when importing csv to database
    //"2021-05-20T9:49:13",  // invaliddate
    "2021-05-20T09:49:13",
    "2022-01-01T15:30:45",
    "2023-06-19T12:45:00",
    "2021-05-20T09:09:03",
    "2021-01-05T08:30:00", 
    "2021-05-20T09:09:03",
    "2021-12-03T17:45:22",
    "2021-05-20T09:09:03",
    "2021-08-10T06:50:15",
    "2021-05-20T09:09:03",
    "2021-06-25T15:03:00",
    "2021-05-20T09:09:03",
    "2021-09-12T11:20:01",
    "2021-05-31T21:36:18",
];



dateTimeStrs.forEach(dateTimeStr => {
    let date = new Date(dateTimeStr);
    let timestamp = Math.floor(date.getTime() / 1000);
    console.log(date, timestamp);
});



