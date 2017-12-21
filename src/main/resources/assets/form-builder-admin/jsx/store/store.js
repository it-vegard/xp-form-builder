const createBaseInput = (title, type) => {
  return {
    "title": title,
    "type": "object",
    "properties": {
      "inputType": {
        "type": type
      },
      "name": {
        "type": "string"
      },
      "placeholder": {
        "type": "string"
      },
      "maxLength": {
        "type": "number"
      },
      "minLength": {
        "type": "number"
      }
    }
  }
};

const createTextInput = title => {
  return createBaseInput(title, "text");
};

const createNumberInput = title => {
  return createBaseInput(title, "number");
};

const createTelInput = title => {
  return createBaseInput(title, "tel");
}

const store = {
  "editForm": null,
  "formList": [
    {
      "id": "my-first-form",
      "displayName": "My first form",
      "title": "My first form",
      "style": "bootstrap",
      "submit": {
        "text": "Submit"
      },
      "responses": {
        "success": "You submitted the request and should receive a confirmation email shortly.",
        "error500": "Something went wrong on our side. We are working on fixing it.",
        "error404": "This is embarrassing! We can't find our server. Please try again later."
      },
      "inputFields": [
        createTextInput("First name"),
        createTextInput("Last name"),
        createNumberInput("Age"),
        createTelInput("Phone number")
      ]
    }
  ],
  "formResponses": {
    "my-first-form": []
  }
};

export default store;