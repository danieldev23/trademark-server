const getCurrentDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();
  
    today = dd + "/" + mm + "/" + yyyy;
    return today;
  };
  
  function convertDateFormat(dateString) {
    const dateParts = dateString.split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    const newDateString = `${day}-${month}-${year}`;
    return newDateString;
  }
  
  function formatDate(date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
  
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  }
  
  module.exports = { getCurrentDate, formatDate, convertDateFormat };
  