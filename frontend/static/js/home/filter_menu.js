document.addEventListener('DOMContentLoaded', function () {
    var selectContainers = document.querySelectorAll('.my-custom-select');

    selectContainers.forEach(function (container) {
        var select = container.querySelector('select');
        var icon = container.querySelector('.material-icons');

        icon.addEventListener('click', function () {
            var event = new Event('mousedown', { bubbles: true });
            console.log(event)
            select.dispatchEvent(event);
            select.focus()
        });
    });
});
