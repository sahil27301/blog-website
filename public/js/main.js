$('.content').each(function () {
  if ($(this).text().length > 175) {
    $(this).text($(this).text().substr(0, 175) + '...');
  }
});
