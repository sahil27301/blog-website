$('.content').each(function () {
  if ($(this).text().length > 175) {
    $(this).text($(this).text().substr(0, 175) + '...');
  }
});

let resizeSearch = event => {
  $(event.currentTarget).toggleClass('expand');
};

let filterSearch = event => {
  let input = $(event.currentTarget).val().replace(/\s/g, '').toLowerCase();
  $('.post-title').each((_index, element) => {
    if ($(element).text().replace(/\s/g, '').toLowerCase().includes(input)) {
      $(element).parent().parent().parent().show(500);
    } else {
      $(element).parent().parent().parent().hide(500);
    }
  });
};

$(document).ready(() => {
  $('.search-input').prop('disabled', false);
  $('.search-input').on({
    input: filterSearch,
    focus: resizeSearch,
    blur: resizeSearch,
  });
});
