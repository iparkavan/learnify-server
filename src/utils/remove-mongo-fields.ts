export const removeMongoFields = {
  transform(doc: any, ret: any) {
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
};
