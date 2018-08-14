var handler = StripeCheckout.configure({
  key: 'pk_test_cs2J3lUBPhR8GJTUfMTvVJKk',
  image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
  token: function(token) {
    $("#stripeToken").val(token.id);
    $("#stripeEmail").val(token.email);
    $("#paymentForm").submit();
  }
});

$('#customButton').on('click', function(e) {
  var amountInCents = 4000;
  var lessonTier = $("input[name=priceSelection]:checked").val();
  switch (lessonTier) {
    case "beginner":
      amountInCents = 4000;
      break;
    case "intermediate":
      amountInCents = 5000;
      break;
    case "advanced":
      amountInCents = 6000;
      break;
    default:
      amountInCents = 4000;
  }
  handler.open({
    name: 'Mandarin For Professionals',
    description: 'Mandarin lesson level: ' + lessonTier,
    amount: amountInCents,
  });
  e.preventDefault();
});

$(window).on('popstate', function() {
  handler.close();
});
