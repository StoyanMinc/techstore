import Computer from "../models/Computer.js";

const getAll = () => Computer.find();

const getLatest = () => Computer.find().sort({ createdAt: -1 }).limit(3);

const getOne = (_id) => Computer.findById({ _id })

const create = (formData) => Computer.create(formData);

const update = async (_id, userId, formData) => {

    const computer = await getOne(_id);
    if (userId != computer.owner) {
        throw new Error('You can\'t edit foreign offer!');
    };
    await Computer.findByIdAndUpdate(_id, formData);
};

const getUserComputers = (userId) => Computer.find({owner: userId});

const getPrefferdComputers = (userId) => Computer.find({preferredList: userId});

const deleteComputer = async (computerId, userId) => {
    const computer = await Computer.findById(computerId);

    if (computer.owner != userId) {
        throw new Error("Not Owner");
    }
    await Computer.findByIdAndDelete(computerId);
};

const addPrefer = async (computerId, userId) => {
    const computer = await Computer.findById(computerId);
    computer.preferredList.push(userId);
    await computer.save();
};


const computerService = {
    getAll,
    getLatest,
    getOne,
    create,
    update,
    getUserComputers,
    getPrefferdComputers,
    deleteComputer,
    addPrefer
};

export default computerService;