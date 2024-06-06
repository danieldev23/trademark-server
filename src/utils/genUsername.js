const genUsername = (fullName) => {
    const nameWithoutSpaces = fullName.replace(/\s+/g, '').toLowerCase(); 
    const randomNumber = Math.floor(Math.random() * 100); 
    return `${nameWithoutSpaces}${randomNumber}`;
};


module.exports = {genUsername}