function initSlider () {
    const h = new Date().getHours();
    let activeImage;
    if (h >= 0 && h < 6) {
        activeImage = '01'
    } else if (h >= 6 && h < 12) {
        activeImage = '02'
    } else if (h >= 12 && h < 18) {
        activeImage = '03'
    } else if (h >= 18) {
        activeImage = '04'
    }
    document.querySelector('.background').style.background = `url("https://raw.githubusercontent.com/digitalSector47/traineeship-test-task/main/images/${activeImage}.jpg") center center / cover no-repeat`;
}