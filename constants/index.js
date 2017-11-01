module.exports = {
  dto: {
    users: {
      _id: true,
      firstName: true,
      lastName: true,
      email: true
    },
    pizzas: {
      _id: true,
      name: true,
      image: true,
      ingredients: true,
      priceCts: true,
      description: true,
      history: true,
      cook: true
    },
    ingredients: {
      _id: true,
      name: true,
      weight: true,
      priceCts: true
    }
  },
  config: {
    users: {
      firstName: {
        type: "string",
        required: []
      },
      lastName: {
        type: "string",
        required: []
      },
      email: {
        type: "string",
        required: ["post"],
        format: '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$'
      },
      password: {
        type: "string",
        required: ["post"],
        format: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$'
      }
    },
    pizzas: {
      name: {
        type: "string",
        required: ["post"]
      },
      image: {
        type: "string",
        required: ["post"]
      },
      ingredients: {
        type: "object",
        subtype: "string",
        subformat: "^[a-f\\d]{24}$",
        required: ["post"]
      },
      priceCts: {
        type: "number",
        required: ["post"]
      },
      description: {
        type: "string",
        required: [],
        format: "^.{1,500}$"
      },
    },
    ingredients: {
      name: {
        type: "string",
        required: ["post"]
      },
      weight: {
        type: "number",
        required: ["post"]
      },
      priceCts: {
        type: "number",
        required: ["post"]
      }
    }
  }
};