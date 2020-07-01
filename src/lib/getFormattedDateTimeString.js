export default (d) => {
  let month = d.getMonth() + 1;
  let date = d.getDate();
  let hour = d.getHours();
  let minute = d.getMinutes();
  
  month = String(month).length < 2 ? `0${month}` : month;
  date = String(date).length < 2 ? `0${date}` : date;
  hour = String(hour).length < 2 ? `0${hour}` : hour;
  minute = String(minute).length < 2 ? `0${minute}` : minute;

  return `${d.getFullYear()}.${month}.${date} ${hour}:${minute}`;
};
