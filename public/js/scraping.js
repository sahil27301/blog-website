const callback = event => {
  const value = $(event.currentTarget).val();
  $('.blog').each((_index, element) => {
    if (
      value == 'Choose a tag to filter by' ||
      $(element).attr('class').includes(value)
    ) {
      $(element).show();
    } else {
      $(element).hide();
    }
  });
};

$(document).ready(() => {
  $('.form-select').prop('disabled', false);
  $('.form-select').on('change', callback);
});
