module.exports = {
    toIsoStringDate: (date) => {
        var d = new Date(date);
        date = [
        d.getFullYear(),
        ('0' + (d.getMonth() + 1)).slice(-2),
        ('0' + d.getDate()).slice(-2)
        ].join('-');
        return date;
    }
}