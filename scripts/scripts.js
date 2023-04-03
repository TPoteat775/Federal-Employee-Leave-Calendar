let currentMonth = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const newLeaveEntry = document.getElementById('create-leave-entry');
const deleteLeaveEntry = document.getElementById('delete-leave-entry')
const leaveText = document.getElementById('leave-text');
const backdrop = document.getElementById('backdrop');

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function createLeaveEntry(date){
  clicked = date;

  const leaveEntry = events.find(e => e.date === clicked);

  if (leaveEntry) {
    document.getElementById('leave-text').innerText = leaveEntry.title;
    deleteLeaveEntry.style.display = 'block';
  } else {
    newLeaveEntry.style.display = 'block';
  }
  backdrop.style.display = 'block';
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

  //console.log("Padding Days: " + paddingDays);

  //console.log(endPaddingDays);

  document.getElementById('monthDisplay').innerText = 
    `${dt.toLocaleDateString('en-us', {month: 'long'})} ${year}`;

  calendar.innerHTML = '';

  for(let i=0; i<7; i++) {
    const weekDaySquare = document.createElement('div');
    weekDaySquare.classList.add('daysOfTheWeek');


    weekDaySquare.innerText = weekdays[i];
    calendar.appendChild(weekDaySquare);

  }

  for(let i = 1; i <= paddingDays + daysInMonth + endPaddingDays; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    //console.log(dayString)

    if (i > paddingDays && i - paddingDays <= daysInMonth) {
      daySquare.innerText = i - paddingDays;
      const eventForDay = events.find(e => e.date === dayString);

      if (i - paddingDays === day && currentMonth === 0) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
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
  if (leaveText.value) {
    leaveText.classList.remove('error');

    events.push({
      date: clicked,
      title: leaveText.value,
    });

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else {
    leaveText.classList.add('error');
  }
}

function deleteLeave(){
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
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