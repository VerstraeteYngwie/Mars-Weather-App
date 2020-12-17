let passwordToggle;
let passwordInput;
let email ={};
let password ={};
let subscribeButton;
let ratingList = [];

const enableListeners = function(){
    email.input.addEventListener('blur', function(){
        let field = email.field;
        let input = email.input;
        let error = email.error;

        checkErrors(input, field, error);
    });

    if(subscribeButton){
        subscribeButton.addEventListener('click', function(event){
            event.preventDefault();
            if(!isEmpty(email.input.value) && isValidEmailAddress(email.input.value)){
                alert("Succeeded to submit form!");
            }
            else{
                let field = email.field;
                let input = email.input;
                let error = email.error;
                checkErrors(input, field, error);
            }
        });
    }
};

const checkErrors = function(input, field, error){
    if(isEmpty(input.value)){
        addErrors(field, error);
        input.removeEventListener('input', doubleCheckEmail); //to avoid multiple events
        input.addEventListener('input', doubleCheckEmail);
    }
    else if (!isValidEmailAddress(input.value)){
        addErrors(field, error, "Invalid e-mail address");
        input.removeEventListener('input', doubleCheckEmail); //to avoid multiple events
        input.addEventListener('input', doubleCheckEmail);
    }
    else{
        removeErrors(field, error);
    }
};

const isValidEmailAddress = function(emailAddress)
{
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
};

const isEmpty = function(fieldValue) {
    return !fieldValue || !fieldValue.length;
 };

const addErrors = function(formField, errorField, errorMessage = "This field is required"){
    subscribeButton.disabled = true;
    subscribeButton.classList.add("c-form__button--disabled");
    if(errorField){
        errorField.innerHTML = errorMessage;
        errorField.style.visibility = 'visible';
        errorField.style.display = 'block';
    }
 };

 const removeErrors = function(formField, errorField){
    subscribeButton.classList.remove("c-form__button--disabled");
    subscribeButton.disabled = false;
    if(errorField){
        errorField.style.visibility = 'hidden';
    }
};

const doubleCheckEmail = function(){
    let field = email.field;
    let input = email.input;
    let error = email.error;
    if(!isEmpty(input.value) && isValidEmailAddress(input.value)){
        removeErrors(field, error);
        input.removeEventListener('input', doubleCheckEmail);
    }
    else if(isEmpty(input.value)){
        addErrors(field, error);
    }
    else{
        addErrors(field, error, "Invalid e-mail address");
    }
};

const getDOMElements = function(){
    email.field = document.querySelector('.js-email-field');
    email.error = document.querySelector('.js-email-error');
    email.input = document.querySelector('.js-email-input');
    
    subscribeButton = document.querySelector('.js-sign-up-button');
};

document.addEventListener('DOMContentLoaded', function () {
  getDOMElements();
  enableListeners();
});
