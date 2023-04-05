//FIND DAYS BETWEEN MINDATE AND MAX DATE
//DISPLAY ALL EVENTS FOR LEAVE and PERFORM CALCULATION

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
  let days = 1;
  let flag = false;

  minDate = document.getElementById('min-date');
  maxDate = document.getElementById('max-date');
  

  if(minDate.value > maxDate.value ) {
    alert("Minimum date can not be larger than maximum date")
    minDate.classList.add('error');
    maxDate.classList.add('error');
    flag = false;
  } else{
    minDate.classList.remove('error');
    maxDate.classList.remove('error');
    flag = true;
    //days = daysForRecord(minDate, maxDate);
  }

  if (flag && hrsPerDay.value != 0) {
    hrsPerDay.classList.remove('error');

    records.push({
      date: clicked,
      title: leaveType.value + ' - ',
    });

    //"date + " "

    localStorage.setItem('records', JSON.stringify(records));
    cancelEntry();
  } else {
    hrsPerDay.classList.add('error');
  }
}

function validateEntry(hours, leaveType){
  let tempNum = 0;

  if(hours > 8 || hours < 0) {
    alert("The hours value must be between 0-8");
  }

  if(leaveType=="sick"){
    tempNum = 
    alert('Error. Not enough hours in Sick Leave.')

  } else if(leaveType=="annual"){

  } else if(leaveType=="credit"){

  }else if(leaveType=="comp"){

  }else{
    alert('Invalid entry. Please try again.');
  }

}

function daysForRecord(minDate, maxDate){

  //splitDate1[0] is year
  //splitDate1[1] is month
  //splitDate1[2] is day
  
  let splitDate1 = minDate.value.split('-');
  let splitDate2 = maxDate.value.split('-');

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
