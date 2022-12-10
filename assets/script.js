// Wraping all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // display current date
  let currentDate = dayjs().format("dddd, MMMM D, YYYY");
  $("#currentDay").text(currentDate);
  //  iterating each time blocks
  $(".time-block").each(function (index) {
    // 'prop' gets the propert value of html element
    var timeId = $(this).prop("id");
    // 'replace' replaces the hour- with empty string so that we gets only hour(number)
    let hour = timeId.replace("hour-", "");
    //newDate = dayjs().hour(12)
    let elementHour = dayjs().hour(hour);
    let timeInHour = dayjs().format("H");
    let currentHour = dayjs().hour(timeInHour);
    //finding difference date1.diff(date2)
    //date1.diff('2018-06-05', 'month')
    let difference = elementHour.diff(currentHour, "minutes");
    // adding 'future,present,past' classes based on the time hour difference
    if (difference === 0) {
      $(this).addClass("present");
    } else if (difference < 0) {
      $(this).addClass("past");
    } else {
      $(this).addClass("future");
    }
    // logic for displaying the task that is stored in the local storage ( when reloadind)
    var storageTaskItems = window.localStorage.getItem("myTask");
    if (storageTaskItems) {
      var storageTaskItemsObject = JSON.parse(storageTaskItems);
      let findStorageTask = storageTaskItemsObject.find(
        (eachObject) =>
          eachObject.id === timeId &&
          dayjs(eachObject.date).format("YYYY-M-D") ===
            dayjs().format("YYYY-M-D")
      );
      if (findStorageTask) {
        $(this).find("textarea").val(findStorageTask.description);
      }
    }
    // click function for the save button to store the text schedules in the local storage
    $(this)
      .children("button")
      .click(function () {
        let textInput = $(this).parent().find("textarea").val();

        var myPreviousTask = window.localStorage.getItem("myTask");
        if (myPreviousTask) {
          var myPreviousTaskObject = JSON.parse(myPreviousTask);
          var previousDescriptionForId = myPreviousTaskObject.find(
            (eachObject) => eachObject.id === timeId
          );
          if (previousDescriptionForId) {
            previousDescriptionForId.description = textInput;
          } else {
            myPreviousTaskObject.push({
              id: timeId,
              description: textInput,
              date: dayjs().format(),
            });
          }
          window.localStorage.setItem(
            "myTask",
            JSON.stringify(myPreviousTaskObject)
          );
        } else {
          window.localStorage.setItem(
            "myTask",
            JSON.stringify([
              { id: timeId, description: textInput, date: dayjs().format() },
            ])
          );
        }
      });
  });
});
