export default (model, Schema) => {
  const RoleSchema = new Schema(
    {
      name: {
        type: String,
        unique: true,
        required: true,
        uppercase: true,
        trim: true,
      },
      description: String,
    },
    { versionKey: false }
  );

  const Role = model("Role", RoleSchema);
  return Role;
};
