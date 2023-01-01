const makeName = (name1, name2) => {
  return name1 + "_" + name2;
}

const Query = {
  chatbox: async (parent, { name1, name2 }, { ChatBoxModel }) => {
    let name = makeName(name1, name2);
    let box = await ChatBoxModel.findOne({ name });
    if (!box)
      box = await new ChatBoxModel({ name }).save();
    console.log(box);
    return box;
  },
};
export default Query;
