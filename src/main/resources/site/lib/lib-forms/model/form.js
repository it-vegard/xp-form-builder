const formSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Form",
  "description": "A form used in Enonic XP",
  "type": "object",
  "properties": {
    "id": {
      "description": "The unique identifier for a product",
      "type": "string"
    },
    "title": {
      "description": "The title used as display name and title of the form",
      "type": "string"
    },
    "descriptionText": {
      "description": "(Optional) description used in the beginning of the form",
      "type": "string"
    },
    "formComponents": {
      "description": "The building blocks of the form",
      "type": "array",
      "items": {
        "oneOf": [
          {
            
          }
        ]
      }
    }
  },
  "required": ["id", "name", "price"]
};

export default formSchema;