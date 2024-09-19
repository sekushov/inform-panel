function initDateTime () {
    const timeEl = document.querySelector('.dateTime__time');
    const dateEl = document.querySelector('.dateTime__date');
    const dayEl = document.querySelector('.dateTime__day');

    timeEl.innerText = getNow();
    dateEl.innerText = `${getToday().date} ${getToday().month}`;
    dayEl.innerText = getToday().day;
    setInterval(() => timeEl.innerText = getNow(), 1000);
    setInterval(() => dateEl.innerText = `${getToday().date} ${getToday().month}`, 1000*60*60*24);

    function getToday () {
        const today = new Date();
        function getFormattedMonth () {
            switch (today.getMonth()) {
                case 0: return 'января'
                case 1: return 'февраля'
                case 2: return 'марта'
                case 3: return 'апреля'
                case 4: return 'мая'
                case 5: return 'июня'
                case 6: return 'июля'
                case 7: return 'августа'
                case 8: return 'сентября'
                case 9: return 'октября'
                case 10: return 'ноября'
                case 11: return 'декабря'
            }
        }
        function getFormattedDay () {
            switch (today.getDay()) {
                case 0: return 'воскресенье'
                case 1: return 'понедельник'
                case 2: return 'вторник'
                case 3: return 'среда'
                case 4: return 'четверг'
                case 5: return 'пятница'
                case 6: return 'суббота'
            }
        }
        return {
            date: today.getDate(), 
            month: getFormattedMonth(), 
            day: getFormattedDay()
            }
    }

    function getNow () {
        const now = new Date();
        const hours = setDateFormat(now.getHours());
        const minutes = setDateFormat(now.getMinutes());
        const seconds = setDateFormat(now.getSeconds());
        function setDateFormat (unit) {
            return (unit < 10) ? `0${unit}` : unit;
        }
        return (hours + ':' + minutes + ':' + seconds);        
    }
}