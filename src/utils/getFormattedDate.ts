import moment from "moment";

const getFormattedDate = (date: Date): string => {
  const now = moment();
  const inputDate = moment(date);

  if (inputDate.isSame(now, "day")) {
    // Case 1: Only the time in 12 hr format if date is today
    return inputDate.format("h:mm A");
  } else if (inputDate.isSame(now.subtract(1, "day"), "day")) {
    // Case 2: Yesterday + time in 12 hr format if the date is of yesterday
    return `Yesterday ${inputDate.format("h:mm A")}`;
  } else if (inputDate.isSame(now.startOf("week"), "week")) {
    // Case 3: Week name + time in 12 hr format if the date is before yesterday but within this week
    return `${inputDate.format("ddd")} ${inputDate.format("h:mm A")}`;
  } else if (inputDate.isSame(now.startOf("year"), "year")) {
    // Case 4: Month + Day + time in 12 hr format if the date is before this week but within this year
    return `${inputDate.format("MMM D")} ${inputDate.format("h:mm A")}`;
  } else {
    // Case 5: Year + Month + Day + time in 12 hr format if the date is before this year
    return `${inputDate.format("YYYY MMM D")} ${inputDate.format("h:mm A")}`;
  }
};

export default getFormattedDate;
