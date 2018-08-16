// checkout handler
var handler = StripeCheckout.configure({
    key: 'pk_test_Gs3mml7J0sPmODW6ZS8o8R3h',
    image: '/images/gavel.png',
    token: function(token) {
            /* Use the token to create the charge with a server-side script.
            You can access the token ID with `token.id`
            Pass along various parameters you get from the token response
            and your form.*/                    
            var myData = {
                    token: token.id,
                    email: token.email,
            };
            
            /* Make an AJAX post request using JQuery,
            change the first parameter to your charge script*/
            $.post("http://devsignup.sharpauctionengine.com/create_subscription.php?plan=" + PLAN_CONFIG['id'], myData, function (data) {
                // if you get some results back update results
                $("#FormSubmission").hide()
                window.location.replace("http://thankyou.sharpauctionengine.com");
            }).fail(function () {
                // if things fail, tell us
                header('Location: http://oops.sharpauctionengine.com');
                
            })
    }
});

$("#SubmissionButton").on('click', function() {
    submitToInfusionSoft();
    launchStripeForm();

});

$('#FormSubmission').on('submit', function (e) {
    submitToInfusionSoft();
    launchStripeForm();
    e.preventDefault();
});

function submitToInfusionSoft() {
    $.ajax ({
           url:"http://devsignup.sharpauctionengine.com/create_contact.php?plan=" + PLAN_CONFIG['id'],
           type: "POST",
           data: {

                    firstname: $("#firstname").val(),
                    lastname: $("#lastname").val(),
                    phonenumber: $("#phonenumber").val(),
                    email: $("#email").val(),
                    company: $("#company").val(),

           },

           success: function(response){
                   console.log(response);
           }
    })
}

function launchStripeForm() {
    handler.open({
            name: PLAN_CONFIG['name'],
            description: PLAN_CONFIG['description'],
            allowRememberMe: false, 
            email: $("#email").val(),
            panelLabel: PLAN_CONFIG['panelLabel'],
    });
}

// Close Checkout on page navigation
$(window).on('popstate', function () {
    handler.close();
});
