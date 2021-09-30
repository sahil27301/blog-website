let resizeSearch = event => {
  $(event.currentTarget)
    .parent()
    .toggleClass('col-sm-6 col-md-4 col-sm-12 col-md-8');
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
