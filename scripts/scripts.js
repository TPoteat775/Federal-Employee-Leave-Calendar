let currentMonth = 0;
let clicked = null;
let records = localStorage.getItem('records') ? JSON.parse(localStorage.getItem('records')) : [];

const calendar = document.getElementById('calendar');
const newLeaveEntry = document.getElementById('create-leave-entry');
const deleteLeaveEntry = document.getElementById('delete-leave-entry')
const leaveText = document.getElementById('leave-text');
const backdrop = document.getElementById('backdrop');
//const hoursPerEntry = document.getElementById('hours-total');

const annualLeave = document.getElementById('annual-leave');
const sickLeave = document.getElementById('sick-leave');
const creditHrs = document.getElementById('credit-hrs');
const compHrs = document.getElementById('comp-hrs');

let minDate = document.getElementById('min-date');
let maxDate = document.getElementById('max-date');

let totalNumOfHrs = 0;

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function createLeaveEntry(date){
  let splitDate = formatDate(date);
  minDate.setAttribute('value', splitDate);
  maxDate.setAttribute('value', splitDate);

  clicked = date;

  const leaveEntry = records.find(e => e.date === clicked);

  if (leaveEntry) {
    //document.getElementById('leave-text').innerText = leaveEntry.title;
    deleteLeaveEntry.style.display = 'block';
  } else {
    newLeaveEntry.style.display = 'block';
  }
  backdrop.style.display = 'block';
}

function formatDate(date){
  //console.log(date);
  let splitDate = date.split('/');
  let tempDate = "";

  //splitDate[0] = month 
  //splitDate[1] = day
  //splitDate[2] = year

  if(splitDate[0] < 10 && splitDate[1] < 10){
    tempDate = splitDate[2] + '-0' + splitDate[0] + '-0' + splitDate[1];
  } else if(splitDate[0] < 10 && splitDate[1] >= 10) {
    tempDate = splitDate[2] + '-0' + splitDate[0] + '-' + splitDate[1];
  } else if(splitDate[0] >= 10 && splitDate[1] < 10) {
    tempDate = splitDate[2] + '-' + splitDate[0] + '-0' + splitDate[1];
  }else{
    tempDate = splitDate[2] + '-' + splitDate[0] + '-' + splitDate[1];
  } 
  return tempDate
}

function reformatDate(date){
  let splitDate = date.split('-');
  //splitDate[0] is year
  //splitDate[1] is month
  //splitDate[2] is day
  
  return (splitDate[1] + "/" + splitDate[2] + "/" + splitDate[0]);
}

function load() {
  const dt = new Date();

  if (currentMonth != 0) {
    dt.setMonth(new Date().getMonth() + currentMonth);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();
  
  const firstDayOfMonth = new Date(year, month, 1);

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const lastDayInMonth = new Date(year, month, daysInMonth);
  
  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const endDateString = lastDayInMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const endPaddingDays = weekdays.length - (weekdays.indexOf(endDateString.split(', ')[0]) + 1);

  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  //Displays current month in header
  document.getElementById('monthDisplay').innerText = 
    `${dt.toLocaleDateString('en-us', {month: 'long'})} ${year}`;

  calendar.innerHTML = '';

  //Set days of the weeks
  for(let i=0; i<7; i++) {
    const weekDaySquare = document.createElement('div');
    weekDaySquare.classList.add('daysOfTheWeek');
    
    weekDaySquare.innerText = weekdays[i];
    calendar.appendChild(weekDaySquare);
  }

  //Set days and paddingDays for current month
  for(let i = 1; i <= paddingDays + daysInMonth + endPaddingDays; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    //CHANGE THIS CODE TO EXTEND EVENT!!!
    //If not a padding day, add number
    if (i > paddingDays && i - paddingDays <= daysInMonth) {
      daySquare.innerText = i - paddingDays;
      const leaveEntry = records.find(e => e.date === dayString);

      //Set the current day of the month
      if (i - paddingDays === day && currentMonth === 0) {
        daySquare.id = 'currentDay';
        //Current date is the date leave is allowed
        let minDateForLeave = formatDate(dayString);
        minDate.setAttribute('min', (minDateForLeave));
        maxDate.setAttribute('min', (minDateForLeave));
      }


      if (leaveEntry) {
        const leaveDiv = document.createElement('div');
        leaveDiv.classList.add('event');
        leaveDiv.innerText = leaveEntry.title;
        daySquare.appendChild(leaveDiv);
      }
      daySquare.addEventListener('click', () => createLeaveEntry(dayString));
    } else {
      daySquare.classList.add('padding');
    }
    calendar.appendChild(daySquare);    
  }
}

function cancelEntry(){
  leaveText.classList.remove('error');
  newLeaveEntry.style.display = 'none';
  deleteLeaveEntry.style.display = 'none';
  backdrop.style.display = 'none';
  leaveText.value = '';
  clicked = null;
  load();
}

function submitLeave(){
  const hrsPerDay = document.getElementById('hrs-per-day')
  const leaveType = document.getElementById('leave-type');
  let flag = false;
  let numOfDays = 1;

  minDate = document.getElementById('min-date');
  maxDate = document.getElementById('max-date');
  

  if(minDate.value > maxDate.value ) {
    alert("Minimum date can not be larger than maximum date")
    minDate.classList.add('error');
    maxDate.classList.add('error');
    flag = false;
  } else{
    console.log("MinDate.value: " + reformatDate(minDate.value));
    let date1 = new Date(reformatDate(minDate.value));
    let date2 = new Date(reformatDate(maxDate.value));
    minDate.classList.remove('error');
    maxDate.classList.remove('error');

    flag = true;

    if(date1 != date2) {
      numOfDays = (date2.getTime()-date1.getTime()) / (1000 * 3600 * 24);
    }
  }
  numOfDays += 1;  
  
  if(!(hrsPerDay.value)){
    hrsPerDay.classList.add('error');
  } else if (flag && validateEntry(hrsPerDay.value, leaveType.value, numOfDays)) {
    hrsPerDay.classList.remove('error');

    records.push({
      date: clicked,
      title: leaveType.value + ' - ' + totalNumOfHrs,
    });
    localStorage.setItem('records', JSON.stringify(records));
    cancelEntry();
  } else {
    hrsPerDay.classList.add('error');
  }
}

function validateEntry(hours, leaveType, days){  
  let totalHrs = hours * days;
  totalNumOfHrs = totalHrs;

  //console.log("TotalHRS: " + totalHrs);
  //console.log("sickLeave.value: " + sickLeave.value);

  if(hours > 8 || hours < 0) {
    alert("The hours value must be between 0-8");
    return false;
  }

  if(leaveType=="Annual"){
    if(!(annualLeave.value) || annualLeave.value < totalHrs ) {
      alert('Error. Not enough hours in Annual Leave.');
    }else {
      annualLeave.setAttribute('value', (annualLeave.value-totalHrs));
      return true;
    }
  }

  if(leaveType=="Sick"){
    if(!(sickLeave.value) || sickLeave.value < totalHrs ) {
      alert('Error. Not enough hours in Sick Leave.');
    }else {
      sickLeave.setAttribute('value', (sickLeave.value-totalHrs));
      return true;
    }
  }

  if(leaveType=="Credit"){
    if(!(creditHrs.value) || creditHrs.value < totalHrs ) {
      alert('Error. Not enough hours in Credit Hrs.');
    }else {
      creditHrs.setAttribute('value', (creditHrs.value-totalHrs));
      return true;
    }
  }

  if(leaveType=="Comp"){
    if(!(compHrs.value) || compHrs.value < totalHrs ) {
      alert('Error. Not enough hours in Comp Hrs.');
    }else {
      compHrs.setAttribute('value', (compHrs.value-totalHrs));
      return true;
    }
  }
  return false;
  
}

function deleteLeave(){
  records = records.filter(e => e.date !== clicked);
  localStorage.setItem('records', JSON.stringify(records));
  cancelEntry();
}

function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    currentMonth++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    currentMonth--;
    load();
  });

  document.getElementById('cancel-btn').addEventListener('click', cancelEntry)
  
  document.getElementById('submit-btn').addEventListener('click', submitLeave)
  
  document.getElementById('delete-btn').addEventListener('click', deleteLeave)
  
}

initButtons();
load();
