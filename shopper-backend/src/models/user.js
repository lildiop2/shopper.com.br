export default (model, Schema) => {
  const User = model(
    "User",
    new Schema(
      {
        name: { type: String, uppercase: true, trim: true, required: true },
        email: {
          type: String,
          required: true,
          lowercase: true,
          unique: true,
        },
        password: {
          type: String,
          minLength: 5,
          required: true,
        },
        roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
      },
      { timestamps: true, versionKey: false }
    )
  );
  return User;
};
