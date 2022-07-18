const users = [
    {
        id: '1',
        firstName: 'Maurice',
        lastName: 'Moss',
        email: 'maurice@moss.com',
        password: 'abcdefg'
    },
    {
        id: '2',
        firstName: 'Roy',
        lastName: 'Trenneman',
        email: 'roy@trenneman.com',
        password: 'imroy'
    }
];

const User = {
    getUsers: () => users,
    addUser: user => users.push(user)
};

export default User;