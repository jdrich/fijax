var Fijax = {};

Fijax.template = function (message) {
  return '<div class="fijax-error alert alert-danger" role="alert">' + message + "</div>";
}

Fijax.hijack = function(id, callback, prepend) {
  (typeof prepend === 'undefined') && (prepend = true);

  var jacked = {};

  if(!id.indexOf('#') == 0) {
    id = '#' + id;
  }

  jacked.el = jQuery(id);

  if(!jacked.el.is('form')) {
    throw new Exception("Passed element to hijack must be a valid form.");
  }

  if((typeof callback === "string")) {
    jacked.location = callback;

    jacked.callback = function() {
      window.location = jacked.location;
    };
  } else if((typeof callback === "function")) {
    jacked.callback = callback;
  } else {
    jacked.callback = function(data) {
      return;
    };
  }

  jacked.postSubmit = function (xhr) {
    var data = xhr.responseJSON;

    // Working around some jQuery inconsistency.
    if(data == null) {
      data = xhr;
    }

    console.log(data);

    if(data['success'] == true) {
      console.log('success');

      jacked.callback(data);
    }

    for(var errIndex in data.errors) {
      var error = data.errors[errIndex];
      var el = jacked.el.find('[name="' + error['name'] + '"]:first');

      el.addClass('is-invalid');
      el.after(Fijax.template(error['message']));
    }

    jacked.el[0].scrollIntoView();
  };

  jacked.el.submit(function() {
    jacked.el.find('.fijax-error').remove();
    jacked.el.find('.is-invalid').removeClass('is-invalid');

    if(jacked.el.attr('method').toLowerCase() == 'post') {
      var ajax = jQuery.post(
        jacked.el.attr('action'),
        jacked.el.serializeArray()
      );
    } else {
      var ajax = jQuery.get(
        jacked.el.attr('action'),
        jacked.el.serializeArray()
      );
    }

    ajax.always(jacked.postSubmit);

    return false;
  });

  console.log(jacked);

  return jacked;
};
